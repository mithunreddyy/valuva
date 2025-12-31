/**
 * Metrics Utility
 * Production-ready metrics collection for Prometheus monitoring
 * Tracks request counts, response times, error rates, and business metrics
 */

interface MetricValue {
  value: number;
  labels?: Record<string, string>;
  timestamp?: number;
}

interface CounterMetric {
  name: string;
  help: string;
  type: "counter";
  values: Map<string, MetricValue>;
}

interface HistogramMetric {
  name: string;
  help: string;
  type: "histogram";
  buckets: number[];
  values: Map<string, MetricValue[]>;
}

interface GaugeMetric {
  name: string;
  help: string;
  type: "gauge";
  values: Map<string, MetricValue>;
}

export class MetricsUtil {
  private static counters: Map<string, CounterMetric> = new Map();
  private static histograms: Map<string, HistogramMetric> = new Map();
  private static gauges: Map<string, GaugeMetric> = new Map();

  /**
   * Increment a counter metric
   */
  static incrementCounter(
    name: string,
    labels?: Record<string, string>,
    value: number = 1
  ): void {
    const key = this.getKey(name, labels);
    const counter = this.counters.get(name) || {
      name,
      help: `Counter metric: ${name}`,
      type: "counter" as const,
      values: new Map(),
    };

    const existing = counter.values.get(key) || { value: 0, labels };
    existing.value += value;
    counter.values.set(key, existing);
    this.counters.set(name, counter);
  }

  /**
   * Record a histogram value (for response times, sizes, etc.)
   */
  static recordHistogram(
    name: string,
    value: number,
    labels?: Record<string, string>
  ): void {
    const key = this.getKey(name, labels);
    const histogram = this.histograms.get(name) || {
      name,
      help: `Histogram metric: ${name}`,
      type: "histogram" as const,
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60, 120],
      values: new Map(),
    };

    const existing = histogram.values.get(key) || [];
    existing.push({ value, labels, timestamp: Date.now() });
    
    // Keep only last 1000 values per label set
    if (existing.length > 1000) {
      existing.shift();
    }
    
    histogram.values.set(key, existing);
    this.histograms.set(name, histogram);
  }

  /**
   * Set a gauge value (for current state metrics)
   */
  static setGauge(
    name: string,
    value: number,
    labels?: Record<string, string>
  ): void {
    const key = this.getKey(name, labels);
    const gauge = this.gauges.get(name) || {
      name,
      help: `Gauge metric: ${name}`,
      type: "gauge" as const,
      values: new Map(),
    };

    gauge.values.set(key, { value, labels, timestamp: Date.now() });
    this.gauges.set(name, gauge);
  }

  /**
   * Get Prometheus-formatted metrics
   */
  static getPrometheusMetrics(): string {
    const lines: string[] = [];

    // Counters
    for (const counter of this.counters.values()) {
      lines.push(`# HELP ${counter.name} ${counter.help}`);
      lines.push(`# TYPE ${counter.name} ${counter.type}`);
      for (const [, metric] of counter.values.entries()) {
        const labels = this.formatLabels(metric.labels);
        lines.push(`${counter.name}${labels} ${metric.value}`);
      }
    }

    // Histograms
    for (const histogram of this.histograms.values()) {
      lines.push(`# HELP ${histogram.name} ${histogram.help}`);
      lines.push(`# TYPE ${histogram.name} ${histogram.type}`);
      
      for (const [, values] of histogram.values.entries()) {
        const labels = this.formatLabels(values[0]?.labels);
        
        // Calculate bucket counts
        const bucketCounts: Record<string, number> = {};
        for (const bucket of histogram.buckets) {
          bucketCounts[`le="${bucket}"`] = values.filter((v) => v.value <= bucket).length;
        }
        bucketCounts['le="+Inf"'] = values.length;

        // Output bucket counts
        for (const [le, count] of Object.entries(bucketCounts)) {
          const bucketLabels = labels ? `${labels.slice(0, -1)}, ${le}}` : `{${le}}`;
          lines.push(`${histogram.name}_bucket${bucketLabels} ${count}`);
        }

        // Sum
        const sum = values.reduce((acc, v) => acc + v.value, 0);
        lines.push(`${histogram.name}_sum${labels} ${sum}`);

        // Count
        lines.push(`${histogram.name}_count${labels} ${values.length}`);
      }
    }

    // Gauges
    for (const gauge of this.gauges.values()) {
      lines.push(`# HELP ${gauge.name} ${gauge.help}`);
      lines.push(`# TYPE ${gauge.name} ${gauge.type}`);
      for (const [, metric] of gauge.values.entries()) {
        const labels = this.formatLabels(metric.labels);
        lines.push(`${gauge.name}${labels} ${metric.value}`);
      }
    }

    return lines.join("\n") + "\n";
  }

  /**
   * Track HTTP request metrics
   */
  static trackHttpRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number
  ): void {
    // Increment request counter
    this.incrementCounter("http_requests_total", {
      method,
      path: this.normalizePath(path),
      status: statusCode.toString(),
    });

    // Record response time
    this.recordHistogram("http_request_duration_seconds", duration / 1000, {
      method,
      path: this.normalizePath(path),
    });

    // Track error rate
    if (statusCode >= 400) {
      this.incrementCounter("http_errors_total", {
        method,
        path: this.normalizePath(path),
        status: statusCode.toString(),
      });
    }
  }

  /**
   * Track database query metrics
   */
  static trackDatabaseQuery(
    operation: string,
    model: string,
    duration: number,
    success: boolean
  ): void {
    this.incrementCounter("database_queries_total", {
      operation,
      model,
      status: success ? "success" : "error",
    });

    this.recordHistogram("database_query_duration_seconds", duration / 1000, {
      operation,
      model,
    });

    if (!success) {
      this.incrementCounter("database_errors_total", {
        operation,
        model,
      });
    }
  }

  /**
   * Track business metrics
   */
  static trackBusinessMetric(
    metric: string,
    value: number,
    labels?: Record<string, string>
  ): void {
    this.incrementCounter(`business_${metric}_total`, labels, value);
  }

  /**
   * Reset all metrics (useful for testing)
   */
  static reset(): void {
    this.counters.clear();
    this.histograms.clear();
    this.gauges.clear();
  }

  private static getKey(name: string, labels?: Record<string, string>): string {
    if (!labels) return name;
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join(",");
    return `${name}{${labelStr}}`;
  }

  private static formatLabels(labels?: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) return "";
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${String(v).replace(/"/g, '\\"')}"`)
      .join(",");
    return `{${labelStr}}`;
  }

  private static normalizePath(path: string): string {
    // Normalize paths like /api/v1/users/123 to /api/v1/users/:id
    return path
      .replace(/\/\d+/g, "/:id")
      .replace(/\/[a-f0-9-]{36}/gi, "/:id")
      .replace(/\/[a-f0-9-]{32}/gi, "/:id");
  }
}


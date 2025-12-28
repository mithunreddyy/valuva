import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderShippedEmailProps {
  orderNumber: string;
  customerName: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  trackingUrl: string;
}

export const OrderShippedEmail = ({
  orderNumber,
  customerName,
  trackingNumber,
  estimatedDelivery,
  trackingUrl,
}: OrderShippedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your order has been shipped - {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Order Has Shipped! 🚀</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Great news! Your order #{orderNumber} has been shipped and is on its
            way to you.
          </Text>

          {trackingNumber && (
            <Section style={section}>
              <Text style={label}>Tracking Number</Text>
              <Text style={value}>{trackingNumber}</Text>
            </Section>
          )}

          <Section style={section}>
            <Text style={label}>Estimated Delivery</Text>
            <Text style={value}>{estimatedDelivery}</Text>
          </Section>

          <Section style={buttonSection}>
            <Link href={trackingUrl} style={button}>
              Track Your Order
            </Link>
          </Section>

          <Text style={footer}>
            We&apos;ll send you another email when your order is delivered.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#fafafa",
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e5",
  borderRadius: "12px",
  margin: "0 auto",
  padding: "40px",
  maxWidth: "600px",
};

const h1 = {
  color: "#0a0a0a",
  fontSize: "28px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "0 0 24px",
};

const text = {
  color: "#666666",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const section = {
  margin: "24px 0",
};

const label = {
  color: "#999999",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0 0 4px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const value = {
  color: "#0a0a0a",
  fontSize: "16px",
  margin: "0",
};

const buttonSection = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#0a0a0a",
  borderRadius: "10px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "500",
  padding: "12px 32px",
  textDecoration: "none",
};

const footer = {
  color: "#999999",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "32px 0 0",
  textAlign: "center" as const,
};


/**
 * PayU Service Layer – Valuva Backend
 * -----------------------------------
 * Handles PayU payload generation, hashing, verification,
 * URL building and response validation.
 *
 * Notes:
 * - Uses SHA512 hashing per PayU spec (key|txnid|amount|productinfo|firstname|email||||...|salt)
 * - Supports sandbox (test) and production endpoints via env config
 */

import crypto from "crypto";
import { payuConfig } from "../config/payuConfig";

export type PayUPayload = {
  key: string;
  txnid: string;
  amount: string; // string with 2 decimals
  productinfo: string;
  firstname: string;
  email: string;
  phone?: string;
  surl: string;
  furl: string;
  service_provider?: string;
  // any other optional fields that PayU accepts
  [k: string]: any;
};

export type PayUResponse = {
  status?: string;
  txnid?: string;
  amount?: string;
  mihpayid?: string;
  hash?: string;
  // payu posts many extra fields; allow arbitrary
  [k: string]: any;
};

const SALT = process.env.PAYU_SALT || payuConfig.salt || "";
const KEY = process.env.PAYU_KEY || payuConfig.key || "";
const BASE_URL =
  process.env.PAYU_BASE_URL || payuConfig.baseUrl || "https://test.payu.in";

/**
 * Format amount as PayU expects — string with two decimal places.
 */
export function formatAmount(amountNum: number): string {
  return (Math.round(amountNum * 100) / 100).toFixed(2);
}

/**
 * Build the canonical hash string for PayU (request).
 * Per PayU: key|txnid|amount|productinfo|firstname|email|||||||||||salt
 */
export function buildRequestHashString(payload: PayUPayload): string {
  // Ensure these fields exist
  const key = payload.key || KEY;
  const txnid = payload.txnid;
  const amount = payload.amount;
  const productinfo = payload.productinfo || "";
  const firstname = payload.firstname || "";
  const email = payload.email || "";

  const components = [
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    // PayU expects 10 empty fields between email and salt (older docs)
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    SALT,
  ];

  return components.join("|");
}

/**
 * Generate SHA512 hash for PayU request payload
 */
export function generatePayUHash(payload: PayUPayload): string {
  const hashString = buildRequestHashString(payload);
  return crypto.createHash("sha512").update(hashString).digest("hex");
}

/**
 * Build response hash string (used when verifying PayU callback).
 * PayU verification: hashString = salt|status|||||||||||email|firstname|productinfo|amount|txnid|key
 */
export function buildResponseHashString(response: PayUResponse): string {
  const status = response.status || "";
  const email = response.email || "";
  const firstname = response.firstname || "";
  const productinfo = response.productinfo || "";
  const amount = response.amount || "";
  const txnid = response.txnid || "";
  const key = response.key || KEY;

  const components = [
    SALT,
    status,
    // 10 empties (to mirror spec)
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    email,
    firstname,
    productinfo,
    amount,
    txnid,
    key,
  ];

  return components.join("|");
}

/**
 * Verify a PayU callback/response by comparing provided hash with computed hash.
 * Returns true if valid.
 */
export function verifyPayUHash(response: PayUResponse): boolean {
  const provided = (response.hash || "").toString();
  if (!provided) return false;

  const hashString = buildResponseHashString(response);
  const expected = crypto.createHash("sha512").update(hashString).digest("hex");
  return expected === provided;
}

/**
 * Create a full payment URL to which the frontend should POST or redirect.
 * Returns an object with URL and the payload to POST.
 */
export function createPaymentURL(payload: PayUPayload) {
  const url = `${BASE_URL}/_payment`;
  return { url, payload };
}

/**
 * Build a minimal payload from order and user data (helper)
 */
export function buildPayloadFromOrder(params: {
  txnid: string;
  amount: number;
  productinfo?: string;
  firstname?: string;
  email?: string;
  phone?: string;
}): PayUPayload {
  const amountStr = formatAmount(params.amount);
  const payload: PayUPayload = {
    key: KEY,
    txnid: params.txnid,
    amount: amountStr,
    productinfo: params.productinfo || "Valuva Order",
    firstname: params.firstname || "Customer",
    email: params.email || "customer@example.com",
    phone: params.phone || "",
    surl: payuConfig.successUrl,
    furl: payuConfig.failureUrl,
    service_provider: "payu_paisa",
  };

  payload.hash = generatePayUHash(payload);
  return payload;
}

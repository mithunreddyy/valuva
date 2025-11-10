export const payuConfig = {
  key: process.env.PAYU_KEY || "",
  salt: process.env.PAYU_SALT || "",
  baseUrl: process.env.PAYU_BASE_URL || "https://test.payu.in",
  successUrl: `${process.env.BACKEND_URL}/api/orders/success`,
  failureUrl: `${process.env.BACKEND_URL}/api/orders/failure`,
};

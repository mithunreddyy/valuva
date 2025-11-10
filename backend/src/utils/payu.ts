import crypto from "crypto";

interface PayUPayload {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
}

export const generatePayUHash = (payload: PayUPayload) => {
  const { key, txnid, amount, productinfo, firstname, email } = payload;
  const salt = process.env.PAYU_SALT!;
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

export const verifyPayUHash = (response: any) => {
  const { key, txnid, amount, productinfo, firstname, email, status, hash } =
    response;
  const salt = process.env.PAYU_SALT!;
  const reverseHashStr = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const expectedHash = crypto
    .createHash("sha512")
    .update(reverseHashStr)
    .digest("hex");
  return expectedHash === hash;
};

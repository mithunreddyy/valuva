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

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  orderDate: string;
  total: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  shippingAddress: string;
  orderUrl: string;
}

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  orderDate,
  total,
  items,
  shippingAddress,
  orderUrl,
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Order Confirmation - {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Confirmed</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Thank you for your order! We&apos;ve received your order and will
            begin processing it right away.
          </Text>

          <Section style={section}>
            <Text style={label}>Order Number</Text>
            <Text style={value}>{orderNumber}</Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Order Date</Text>
            <Text style={value}>{orderDate}</Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Shipping Address</Text>
            <Text style={value}>{shippingAddress}</Text>
          </Section>

          <Section style={itemsSection}>
            <Text style={label}>Order Items</Text>
            {items.map((item, index) => (
              <Text key={index} style={itemText}>
                {item.quantity}x {item.name} - {item.price}
              </Text>
            ))}
          </Section>

          <Section style={section}>
            <Text style={label}>Total Amount</Text>
            <Text style={totalAmount}>{total}</Text>
          </Section>

          <Section style={buttonSection}>
            <Link href={orderUrl} style={button}>
              View Order Details
            </Link>
          </Section>

          <Text style={footer}>
            If you have any questions, please contact our support team.
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

const itemsSection = {
  margin: "24px 0",
  padding: "16px",
  backgroundColor: "#fafafa",
  borderRadius: "8px",
};

const itemText = {
  color: "#0a0a0a",
  fontSize: "15px",
  margin: "8px 0",
};

const totalAmount = {
  color: "#0a0a0a",
  fontSize: "24px",
  fontWeight: "600",
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


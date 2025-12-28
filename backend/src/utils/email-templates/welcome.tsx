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

interface WelcomeEmailProps {
  customerName: string;
  dashboardUrl: string;
}

export const WelcomeEmail = ({
  customerName,
  dashboardUrl,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Valuva</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Valuva!</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            We&apos;re thrilled to have you join our community. Thank you for
            creating an account with us!
          </Text>

          <Text style={text}>
            At Valuva, we&apos;re committed to providing you with premium
            minimal fashion that combines timeless design with modern
            aesthetics.
          </Text>

          <Section style={buttonSection}>
            <Link href={dashboardUrl} style={button}>
              Explore Your Dashboard
            </Link>
          </Section>

          <Text style={footer}>
            If you have any questions, our support team is here to help.
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


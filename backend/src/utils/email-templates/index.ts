import { render } from "@react-email/components";
import { ReactElement } from "react";
import { OrderConfirmationEmail } from "./order-confirmation";
import { OrderShippedEmail } from "./order-shipped";
import { PasswordResetEmail } from "./password-reset";
import { WelcomeEmail } from "./welcome";

export {
  OrderConfirmationEmail,
  OrderShippedEmail,
  PasswordResetEmail,
  WelcomeEmail,
};

export const renderEmailTemplate = async (
  template: ReactElement
): Promise<string> => {
  return render(template);
};


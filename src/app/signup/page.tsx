import type { Metadata } from "next";
import AuthGateway from "@/components/auth/AuthGateway";

export const metadata: Metadata = {
  title: "Create account | DevCanvas",
  description: "Create a DevCanvas account and start building your portfolio.",
};

export default function SignUpPage() {
  return <AuthGateway mode="signup" />;
}

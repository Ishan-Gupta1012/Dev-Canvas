import type { Metadata } from "next";
import AuthGateway from "@/components/auth/AuthGateway";

export const metadata: Metadata = {
  title: "Sign in | DevCanvas",
  description: "Sign in to your DevCanvas dashboard.",
};

export default function SignInPage() {
  return <AuthGateway mode="signin" />;
}

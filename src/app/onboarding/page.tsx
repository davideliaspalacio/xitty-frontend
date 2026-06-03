import type { Metadata } from "next";
import { OnboardingWizard } from "@/features/preferences/components/onboarding-wizard";
import { AuthGate } from "@/features/auth/components/auth-gate";

export const metadata: Metadata = { title: "Personaliza tu Xitty · Onboarding" };

export default function OnboardingPage() {
  return (
    <AuthGate>
      <OnboardingWizard />
    </AuthGate>
  );
}

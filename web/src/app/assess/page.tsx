"use client";

import { WizardProvider, WizardShell } from "@/features/assessment-wizard";

export default function AssessPage() {
  return (
    <WizardProvider>
      <WizardShell />
    </WizardProvider>
  );
}

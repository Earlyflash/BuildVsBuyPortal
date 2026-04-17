"use client";

import dynamic from "next/dynamic";
import { WizardProvider } from "@/features/assessment-wizard";

const WizardShell = dynamic(
  () => import("@/features/assessment-wizard").then((mod) => mod.WizardShell),
  { ssr: false },
);

export default function AssessPage() {
  return (
    <WizardProvider>
      <WizardShell />
    </WizardProvider>
  );
}

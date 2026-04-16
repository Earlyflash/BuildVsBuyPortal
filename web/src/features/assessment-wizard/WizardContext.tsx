"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type {
  AssessmentInputs,
  WizardStep,
} from "@/domain/assessment";
import { WIZARD_STEPS } from "@/domain/assessment";

const STORAGE_KEY = "buyVsBuild_draft";

const EMPTY_INPUTS: AssessmentInputs = {
  projectName: "",
  projectDescription: "",
  strategicValue: {
    competitiveDifferentiation: 3,
    capabilityBuilding: 3,
    uniqueBusinessProcess: 3,
  },
  deliveryConstraints: {
    timeToMarketUrgency: 3,
    complianceRequirements: 3,
    securitySensitivity: 3,
  },
  economicsAndRisk: {
    totalCostHorizon: 3,
    integrationComplexity: 3,
    vendorLockInTolerance: 3,
    internalCapability: 3,
  },
  decisionGates: {
    strategicDifferentiation: false,
    dataPrivacyTopPriority: false,
    enoughTalentAndBudget: true,
    heavyCustomizationAndControl: false,
    urgentTimeToMarket: true,
    acceptInnovationRisk: true,
    showStopperNotes: "",
  },
};

function withDefaults(saved: Partial<AssessmentInputs>): AssessmentInputs {
  return {
    ...EMPTY_INPUTS,
    ...saved,
    strategicValue: {
      ...EMPTY_INPUTS.strategicValue,
      ...(saved.strategicValue ?? {}),
    },
    deliveryConstraints: {
      ...EMPTY_INPUTS.deliveryConstraints,
      ...(saved.deliveryConstraints ?? {}),
    },
    economicsAndRisk: {
      ...EMPTY_INPUTS.economicsAndRisk,
      ...(saved.economicsAndRisk ?? {}),
    },
    decisionGates: {
      ...EMPTY_INPUTS.decisionGates,
      ...(saved.decisionGates ?? {}),
    },
  };
}

interface WizardState {
  inputs: AssessmentInputs;
  currentStep: WizardStep;
  stepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  setInputs: (partial: Partial<AssessmentInputs>) => void;
  setNestedInputs: <K extends keyof AssessmentInputs>(
    bucket: K,
    values: Partial<AssessmentInputs[K]>,
  ) => void;
  goNext: () => void;
  goBack: () => void;
  goToStep: (step: WizardStep) => void;
  reset: () => void;
}

const WizardContext = createContext<WizardState | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputsState] = useState<AssessmentInputs>(EMPTY_INPUTS);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<AssessmentInputs>;
        setInputsState(withDefaults(parsed));
      }
    } catch {
      // corrupt storage -- start fresh
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      // storage full -- continue without persistence
    }
  }, [inputs]);

  const currentStep = WIZARD_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === WIZARD_STEPS.length - 1;

  const setInputs = useCallback((partial: Partial<AssessmentInputs>) => {
    setInputsState((prev) => ({ ...prev, ...partial }));
  }, []);

  const setNestedInputs = useCallback(
    <K extends keyof AssessmentInputs>(
      bucket: K,
      values: Partial<AssessmentInputs[K]>,
    ) => {
      setInputsState((prev) => ({
        ...prev,
        [bucket]: { ...(prev[bucket] as unknown as Record<string, unknown>), ...values },
      }));
    },
    [],
  );

  const goNext = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, WIZARD_STEPS.length - 1));
  }, []);

  const goBack = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goToStep = useCallback((step: WizardStep) => {
    const idx = WIZARD_STEPS.indexOf(step);
    if (idx >= 0) setStepIndex(idx);
  }, []);

  const reset = useCallback(() => {
    setInputsState(EMPTY_INPUTS);
    setStepIndex(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <WizardContext.Provider
      value={{
        inputs,
        currentStep,
        stepIndex,
        isFirstStep,
        isLastStep,
        setInputs,
        setNestedInputs,
        goNext,
        goBack,
        goToStep,
        reset,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard(): WizardState {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
}

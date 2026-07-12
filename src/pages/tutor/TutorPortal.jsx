import { useState } from "react";

import TutorWorkspace from "./TutorWorkspace";
import {
  TutorAccessGate,
  TutorAgreementPage,
  TutorAssessmentPage,
} from "./TutorOnboarding";
import {
  TUTOR_STORAGE_KEYS,
  defaultTutorOnboarding,
  defaultTutorProfile,
  loadTutorValue,
  saveTutorValue,
  tutorHasWorkspaceAccess,
} from "./tutorData";

export function isTutorPortalPath(pathname) {
  return (
    pathname === "/tutor" ||
    pathname.startsWith("/tutor/")
  );
}

function usePersistentTutorState(key, fallback) {
  const [value, setValue] = useState(() =>
    loadTutorValue(key, fallback),
  );

  const updateValue = (nextValue) => {
    setValue((current) => {
      const resolved =
        typeof nextValue === "function"
          ? nextValue(current)
          : nextValue;

      saveTutorValue(key, resolved);
      return resolved;
    });
  };

  return [value, updateValue];
}

export default function TutorPortal() {
  const path = window.location.pathname;

  const [profile] = usePersistentTutorState(
    TUTOR_STORAGE_KEYS.profile,
    defaultTutorProfile,
  );

  const [onboarding, setOnboarding] =
    usePersistentTutorState(
      TUTOR_STORAGE_KEYS.onboarding,
      defaultTutorOnboarding,
    );

  const [agreement, setAgreement] =
    usePersistentTutorState(
      TUTOR_STORAGE_KEYS.agreement,
      {
        legalName: "",
        bankName: "",
        accountName: "",
        accountNumber: "",
        payoutCurrency: "NGN",
        signature: "",
        acceptedRevenueShare: false,
        acceptedPartnershipTerms: false,
        signedAt: "",
      },
    );

  if (path === "/tutor") {
    window.location.replace(
      tutorHasWorkspaceAccess(onboarding)
        ? "/tutor/dashboard"
        : onboarding.assessmentPassed
          ? "/tutor/agreement"
          : "/tutor/assessment",
    );
    return null;
  }

  if (path === "/tutor/assessment") {
    return (
      <TutorAssessmentPage
        profile={profile}
        onboarding={onboarding}
        setOnboarding={setOnboarding}
      />
    );
  }

  if (path === "/tutor/agreement") {
    return (
      <TutorAgreementPage
        profile={profile}
        onboarding={onboarding}
        setOnboarding={setOnboarding}
        agreement={agreement}
        setAgreement={setAgreement}
      />
    );
  }

  if (!onboarding.assessmentPassed) {
    return <TutorAccessGate nextStep="assessment" />;
  }

  if (
    !onboarding.agreementSigned ||
    !onboarding.approved
  ) {
    return <TutorAccessGate nextStep="agreement" />;
  }

  return <TutorWorkspace />;
}

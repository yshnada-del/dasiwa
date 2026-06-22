export const ONBOARDING_COMPLETED_KEY = "dasiwa_onboarding_completed";

export function isOnboardingCompleted() {
  return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "true";
}

export function completeOnboarding() {
  localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
}

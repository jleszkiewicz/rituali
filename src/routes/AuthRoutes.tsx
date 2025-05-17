export const AuthRoutes = {
  Login: "/(auth)/login",
  Register: "/(auth)/register",
  Onboarding: "/(auth)/onboarding",
} as const;

export type AuthRoutes = keyof typeof AuthRoutes;

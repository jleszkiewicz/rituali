export const AuthRoutes = {
  Login: "/(auth)/login",
  Register: "/(auth)/register",
} as const;

export type AuthRoutes = keyof typeof AuthRoutes;

export const AppRoutes = {
  Home: "/(tabs)/home",
  Explore: "/(tabs)/explore",
} as const;

export type AppRoutes = keyof typeof AppRoutes;

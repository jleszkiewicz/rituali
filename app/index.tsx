import { Redirect } from "expo-router";
import { AppRoutes } from "@/src/routes/AppRoutes";
import { AuthRoutes } from "@/src/routes/AuthRoutes";
import { useAuth } from "@/src/context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/src/service/supabaseClient";

export default function Index() {
  const { isAuthenticated } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("has_completed_onboarding")
            .eq("id", user.id)
            .single();

          setHasCompletedOnboarding(data?.has_completed_onboarding ?? false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setHasCompletedOnboarding(false);
      }
    };

    if (isAuthenticated) {
      checkOnboardingStatus();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Redirect href={AuthRoutes.Login} />;
  }

  if (hasCompletedOnboarding === false) {
    return <Redirect href={AuthRoutes.Onboarding} />;
  }

  return <Redirect href={AppRoutes.Home} />;
}

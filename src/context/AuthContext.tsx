import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "../service/supabaseClient";
import { useDispatch } from "react-redux";
import { setUserData, clearUserData } from "../store/userSlice";
import { AppDispatch } from "../store";
import * as WebBrowser from "expo-web-browser";
import { useErrorModal } from "./ErrorModalContext";
import { t } from "../service/translateService";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  register: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { showError } = useErrorModal();

  const setUserDataFromAuth = (user: any) => {
    dispatch(
      setUserData({
        userId: user.id,
        email: user.email || "",
      })
    );
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user || error) {
        setIsAuthenticated(false);
        dispatch(clearUserData());
        setIsLoading(false);
        return;
      }

      setUserDataFromAuth(user);
      setIsLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUserDataFromAuth(session.user);
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        dispatch(clearUserData());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showError(t("invalid_credentials"));
        return false;
      }

      if (!data?.user) {
        showError(t("invalid_credentials"));
        return false;
      }

      setUserDataFromAuth(data.user);
      return true;
    } catch (error) {
      showError(t("invalid_credentials"));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (isAuthenticating) return;

    setIsAuthenticating(true);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          redirectTo: "exp+rituali://",
          skipBrowserRedirect: false,
        },
      });

      if (error) throw error;

      if (data?.url) {
        await WebBrowser.openBrowserAsync(data.url);
      }
    } catch (error) {
      setIsAuthenticated(false);
      showError("Błąd logowania przez Google");
    } finally {
      setIsLoading(false);
      setIsAuthenticating(false);
    }
  };

  const register = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("already registered")) {
          return { success: false, error: "Email already registered" };
        }
        return { success: false, error: "Email already registered" };
      }

      if (data.user) {
        setUserDataFromAuth(data.user);
        return { success: true };
      }

      return { success: false, error: "Registration failed" };
    } catch (error) {
      return { success: false, error: "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      dispatch(clearUserData());
    } catch (error) {
      showError(t("logout_error"));
    }
  };

  const deleteAccount = async () => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ""
      );
      if (error) throw error;
      await logout();
    } catch (error) {
      showError(t("delete_account_error"));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

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

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  const fetchAndSetUserData = async (authId: string) => {
    const { data: userData, error } = await supabase
      .from("users")
      .select("auth_id, first_name, last_name")
      .eq("auth_id", authId)
      .single();

    if (userData) {
      dispatch(
        setUserData({
          userId: userData.auth_id,
          firstName: userData.first_name,
          lastName: userData.last_name,
        })
      );
      setIsAuthenticated(true);
    } else {
      console.error("Błąd pobierania danych użytkownika:", error?.message);
      setIsAuthenticated(false);
      dispatch(clearUserData());
    }
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

      await fetchAndSetUserData(user.id);
      setIsLoading(false);
    };

    checkAuth();
  }, [dispatch]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const user = data?.user;

    if (error || !user) {
      console.error("Logowanie nie powiodło się:", error?.message);
      setIsAuthenticated(false);
    } else {
      await fetchAndSetUserData(user.id);
    }

    setIsLoading(false);
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Rejestracja nie powiodła się:", error.message);
    } else if (data.user) {
      setIsAuthenticated(true);

      const { error: insertError } = await supabase.from("users").insert([
        {
          auth_id: data.user.id,
          first_name: "",
          last_name: "",
        },
      ]);

      if (!insertError) {
        dispatch(
          setUserData({
            userId: data.user.id,
            firstName: "",
            lastName: "",
          })
        );
      }
    }

    setIsLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    dispatch(clearUserData());
  };

  const deleteAccount = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Delete user data from the users table
    const { error: deleteUserError } = await supabase
      .from("users")
      .delete()
      .eq("auth_id", user.id);

    if (deleteUserError) {
      console.error("Error deleting user data:", deleteUserError);
      throw deleteUserError;
    }

    // Delete the user's auth account
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(
      user.id
    );

    if (deleteAuthError) {
      console.error("Error deleting auth account:", deleteAuthError);
      throw deleteAuthError;
    }

    setIsAuthenticated(false);
    dispatch(clearUserData());
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
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

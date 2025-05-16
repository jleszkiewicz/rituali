import React, { createContext, useState, useContext, ReactNode } from "react";

interface ErrorContextType {
  error: string;
  setError: (error: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState("");

  const clearError = () => {
    setError("");
  };

  return (
    <ErrorContext.Provider
      value={{
        error,
        setError,
        clearError,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};

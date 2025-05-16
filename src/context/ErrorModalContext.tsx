import React, { createContext, useState, useContext, ReactNode } from "react";

interface ErrorModalContextType {
  showErrorModal: boolean;
  errorMessage: string;
  showError: (message: string) => void;
  hideError: () => void;
}

const ErrorModalContext = createContext<ErrorModalContextType | undefined>(
  undefined
);

export const ErrorModalProvider = ({ children }: { children: ReactNode }) => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const hideError = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return (
    <ErrorModalContext.Provider
      value={{
        showErrorModal,
        errorMessage,
        showError,
        hideError,
      }}
    >
      {children}
    </ErrorModalContext.Provider>
  );
};

export const useErrorModal = () => {
  const context = useContext(ErrorModalContext);
  if (context === undefined) {
    throw new Error("useErrorModal must be used within an ErrorModalProvider");
  }
  return context;
};

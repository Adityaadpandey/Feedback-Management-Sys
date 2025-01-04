"use client";

import CryptoJS from "crypto-js";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

// Define types for RoleContext
interface RoleContextType {
  role: string | null;
  subscriptionPlan: string | null;
  aiGenerationLimit: number | null;
  setRole: Dispatch<SetStateAction<string | null>>;
  setSubscriptionPlan: Dispatch<SetStateAction<string | null>>;
  setAiGenerationLimit: Dispatch<SetStateAction<number | null>>;
}

// Create the context
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// RoleProvider component
export const RoleProvider = ({
  children,
  initialRole,
  initialSubscriptionPlan,
  initialAiGenerationLimit,
}: {
  children: ReactNode;
  initialRole: string | null;
  initialSubscriptionPlan: string | null;
  initialAiGenerationLimit: number | null;
}) => {
  const [role, setRole] = useState<string | null>(initialRole);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(
    initialSubscriptionPlan,
  );
  const [aiGenerationLimit, setAiGenerationLimit] = useState<number | null>(
    initialAiGenerationLimit,
  );

  // Encrypt data before saving to localStorage
  const encryptData = (data: string | number | null) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  };

  // Decrypt data from localStorage
  const decryptData = (data: string | null) => {
    if (!data) return null;
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData ? JSON.parse(decryptedData) : null;
  };

  // On component mount, load state from localStorage and decrypt it
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedPlan = localStorage.getItem("subscriptionPlan");
    const storedLimit = localStorage.getItem("aiGenerationLimit");

    if (storedRole) setRole(decryptData(storedRole));
    if (storedPlan) setSubscriptionPlan(decryptData(storedPlan));
    if (storedLimit) setAiGenerationLimit(decryptData(storedLimit));
  }, []);

  // Save encrypted state to localStorage whenever it changes
  useEffect(() => {
    if (role) localStorage.setItem("role", encryptData(role));
    if (subscriptionPlan)
      localStorage.setItem("subscriptionPlan", encryptData(subscriptionPlan));
    if (aiGenerationLimit)
      localStorage.setItem("aiGenerationLimit", encryptData(aiGenerationLimit));
  }, [role, subscriptionPlan, aiGenerationLimit]);

  return (
    <RoleContext.Provider
      value={{
        role,
        subscriptionPlan,
        aiGenerationLimit,
        setRole,
        setSubscriptionPlan,
        setAiGenerationLimit,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook to access the role context
export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};

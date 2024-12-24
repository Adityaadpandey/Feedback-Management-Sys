'use client'

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState, useEffect } from 'react';

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
    const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(initialSubscriptionPlan);
    const [aiGenerationLimit, setAiGenerationLimit] = useState<number | null>(initialAiGenerationLimit);

    // On component mount, load state from localStorage
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedPlan = localStorage.getItem('subscriptionPlan');
        const storedLimit = localStorage.getItem('aiGenerationLimit');

        if (storedRole) setRole(storedRole);
        if (storedPlan) setSubscriptionPlan(storedPlan);
        if (storedLimit) setAiGenerationLimit(parseInt(storedLimit));
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        if (role) localStorage.setItem('role', role);
        if (subscriptionPlan) localStorage.setItem('subscriptionPlan', subscriptionPlan);
        if (aiGenerationLimit) localStorage.setItem('aiGenerationLimit', aiGenerationLimit.toString());
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
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
};

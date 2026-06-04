import { useState } from "react";
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logout,
  getAuthErrorMessage,
} from "../features/auth/authService";
import { useAuthContext } from "../features/auth/AuthContext";
 
export const useAuth = () => {
  const { user, loading } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
 
  const handleAsync = async (fn: () => Promise<void>) => {
    setError(null);
    setSubmitting(true);
    try {
      await fn();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(getAuthErrorMessage(code));
    } finally {
      setSubmitting(false);
    }
  };
 
  return {
    user,
    loading,
    error,
    submitting,
    clearError: () => setError(null),
    register: (email: string, password: string) =>
      handleAsync(() => registerWithEmail(email, password).then(() => {})),
    login: (email: string, password: string) =>
      handleAsync(() => loginWithEmail(email, password).then(() => {})),
    loginWithGoogle: () => handleAsync(() => loginWithGoogle().then(() => {})),
    logout: () => handleAsync(logout),
  };
};
 
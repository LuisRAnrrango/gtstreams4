"use client";

import { useState } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
  const [authType, setAuthType] = useState<'login' | 'register'>('login');

  const toggleAuthType = () => {
    setAuthType(authType === 'login' ? 'register' : 'login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg border">
        <AuthForm type={authType} onToggle={toggleAuthType} />
      </div>
    </div>
  );
}
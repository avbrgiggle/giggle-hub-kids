
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type LoginFormProps = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  role: "parent" | "provider";
  setRole: (role: "parent" | "provider") => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  loading,
  setLoading,
}: LoginFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Handle the email not confirmed error specifically
        if (signInError.message.includes("Email not confirmed")) {
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email,
          });

          if (!resendError) {
            toast({
              title: "Email Not Verified",
              description: "Please check your email for the verification link. We've sent a new one just in case.",
            });
          } else {
            throw resendError;
          }
        } else {
          throw signInError;
        }
        return;
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      navigate(role === "provider" ? "/provider/dashboard" : "/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="role-login">I am a</Label>
        <Select value={role} onValueChange={(value: "parent" | "provider") => setRole(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="parent">Parent</SelectItem>
            <SelectItem value="provider">Activity Provider</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-login">Email</Label>
        <Input
          id="email-login"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password-login">Password</Label>
        <Input
          id="password-login"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Please wait..." : "Sign In"}
      </Button>
    </form>
  );
};

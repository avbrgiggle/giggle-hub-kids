
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SignUpFormProps = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  role: "parent" | "provider";
  setRole: (role: "parent" | "provider") => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const SignUpForm = ({
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  loading,
  setLoading,
}: SignUpFormProps) => {
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role })
          .eq('id', user.id);

        if (profileError) throw profileError;

        toast({
          title: "Success",
          description: "Account created! Please check your email for verification.",
        });
      }
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
    <form onSubmit={handleSignUp} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="role-signup">I am a</Label>
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
        <Label htmlFor="email-signup">Email</Label>
        <Input
          id="email-signup"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password-signup">Password</Label>
        <Input
          id="password-signup"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Please wait..." : "Create Account"}
      </Button>
    </form>
  );
};

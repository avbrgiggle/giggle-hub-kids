
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type TestProviderButtonProps = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const TestProviderButton = ({ loading, setLoading }: TestProviderButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginAsTestProvider = async () => {
    setLoading(true);
    try {
      const testEmail = "testprovider@example.com";
      const testPassword = "password123";
      
      // Try to sign in first
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (signInError) {
        // If account doesn't exist, create one
        if (signInError.message.includes("Invalid login credentials")) {
          const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
            }
          });
          
          if (signUpError) throw signUpError;
          
          if (newUser) {
            // Create provider profile using upsert
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({ 
                id: newUser.id,
                role: 'provider',
                full_name: 'Test Provider',
                location: 'Test Location',
                phone: '123-456-7890',
                username: 'testprovider'
              });
            
            if (profileError) throw profileError;
            
            toast({
              title: "Success",
              description: "Test provider account created. Please check your email for verification.",
            });
            return;
          }
        } else {
          throw signInError;
        }
      }
      
      if (user) {
        // Ensure the user has a provider profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!profile) {
          // Create profile if it doesn't exist
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({ 
              id: user.id,
              role: 'provider',
              full_name: 'Test Provider',
              location: 'Test Location',
              phone: '123-456-7890',
              username: 'testprovider'
            });
          
          if (profileError) throw profileError;
        } else if (profile.role !== 'provider') {
          // Update role to provider if needed
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'provider' })
            .eq('id', user.id);
          
          if (updateError) throw updateError;
        }
        
        toast({
          title: "Success",
          description: "Logged in as test provider",
        });
        
        navigate("/provider/dashboard");
      }
    } catch (error: any) {
      console.error("Test provider login error:", error);
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
    <Button 
      type="button" 
      variant="outline" 
      className="w-full" 
      onClick={loginAsTestProvider}
      disabled={loading}
    >
      {loading ? "Please wait..." : "Login as Test Provider"}
    </Button>
  );
};

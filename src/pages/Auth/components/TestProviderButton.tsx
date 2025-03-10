
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
      
      // Check if account exists
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
          });
          
          if (signUpError) throw signUpError;
          
          if (newUser) {
            // Create provider profile
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ 
                role: 'provider',
                full_name: 'Test Provider',
                location: 'Test Location',
                phone: '123-456-7890'
              })
              .eq('id', newUser.id);
            
            if (profileError) throw profileError;
            
            // Try login again
            const { error } = await supabase.auth.signInWithPassword({
              email: testEmail,
              password: testPassword,
            });
            
            if (error) throw error;
          }
        } else {
          throw signInError;
        }
      }
      
      toast({
        title: "Success",
        description: "Logged in as test provider",
      });
      
      navigate("/provider/dashboard");
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
    <div className="mt-4 pt-4 border-t">
      <p className="text-sm text-center text-muted-foreground mb-2">For testing purposes</p>
      <Button 
        type="button" 
        variant="outline" 
        className="w-full" 
        onClick={loginAsTestProvider}
        disabled={loading}
      >
        {loading ? "Please wait..." : "Login as Test Provider"}
      </Button>
    </div>
  );
};

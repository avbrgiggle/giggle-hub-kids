
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type TestParentButtonProps = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const TestParentButton = ({ loading, setLoading }: TestParentButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginAsTestParent = async () => {
    setLoading(true);
    try {
      const testEmail = "testparent@example.com";
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
            // Check if profile already exists before creating
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', newUser.id)
              .maybeSingle();
              
            // Only create profile if it doesn't exist
            if (!existingProfile) {
              const { error: profileError } = await supabase
                .from('profiles')
                .insert({ 
                  id: newUser.id,
                  role: 'parent',
                  full_name: 'Test Parent',
                  location: 'Test Location',
                  phone: '123-456-7890'
                });
              
              if (profileError) throw profileError;
            }
            
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
        description: "Logged in as test parent",
      });
      
      navigate("/profile");
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
    <Button 
      type="button" 
      variant="outline" 
      className="w-full mt-2" 
      onClick={loginAsTestParent}
      disabled={loading}
    >
      {loading ? "Please wait..." : "Login as Test Parent"}
    </Button>
  );
};

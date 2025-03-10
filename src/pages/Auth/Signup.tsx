
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProviderCodeInput } from "./components/ProviderCodeInput";
import { PartnerLink } from "./components/PartnerLink";
import { ParentSignupForm } from "./components/ParentSignupForm";
import { ProviderSignupForm } from "./components/ProviderSignupForm";
import { ProviderRequestForm } from "./components/provider-request/ProviderRequestForm";
import { useSignup } from "./hooks/useSignup";

export default function Signup() {
  const { formData, loading, providerCodeValid, handleInputChange, handleValidProviderCode, handleSubmit } = useSignup();
  const [signupTab, setSignupTab] = useState("parent");

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={signupTab} onValueChange={setSignupTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="parent">Parent</TabsTrigger>
              <TabsTrigger value="provider-code">Provider (With Code)</TabsTrigger>
              <TabsTrigger value="provider-request">Request Provider Access</TabsTrigger>
            </TabsList>
            
            <TabsContent value="parent">
              <ParentSignupForm 
                formData={formData}
                loading={loading}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
              />
            </TabsContent>
            
            <TabsContent value="provider-code">
              <ProviderSignupForm 
                formData={formData}
                loading={loading}
                providerCodeValid={providerCodeValid}
                onInputChange={handleInputChange}
                onValidCode={handleValidProviderCode}
                onSubmit={handleSubmit}
              />
            </TabsContent>
            
            <TabsContent value="provider-request">
              <ProviderRequestForm />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
          <PartnerLink />
        </CardFooter>
      </Card>
    </div>
  );
}


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
import { MandatoryFields } from "./components/MandatoryFields";
import { OptionalFields } from "./components/OptionalFields";
import { TermsAgreement } from "./components/TermsAgreement";
import { useSignup } from "./hooks/useSignup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProviderRequestForm } from "./components/ProviderRequestForm";
import { ProviderCodeInput } from "./components/ProviderCodeInput";
import { PartnerLink } from "./components/PartnerLink";

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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <MandatoryFields
                      formData={formData}
                      onInputChange={handleInputChange}
                    />
                    <OptionalFields
                      formData={formData}
                      onInputChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <TermsAgreement
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="provider-code">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                  <p className="text-sm text-yellow-800">
                    Provider accounts require a valid invitation code. If you don't have a code yet, 
                    you can request provider access in the next tab.
                  </p>
                </div>
                
                <ProviderCodeInput 
                  code={formData.providerCode}
                  onCodeChange={(code) => handleInputChange("providerCode", code)}
                  onValidCode={handleValidProviderCode}
                />
                
                {providerCodeValid && (
                  <>
                    <div className="space-y-4 mt-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                          <p className="text-sm text-muted-foreground">
                            Email address pre-filled from your invitation code.
                          </p>
                        </div>
                        <MandatoryFields
                          formData={{...formData, isProvider: true}}
                          onInputChange={handleInputChange}
                          disableEmail={true}
                        />
                        <OptionalFields
                          formData={formData}
                          onInputChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <TermsAgreement
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating Provider Account..." : "Create Provider Account"}
                    </Button>
                  </>
                )}
              </form>
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

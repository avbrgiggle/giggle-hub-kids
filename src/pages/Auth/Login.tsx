
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./components/LoginForm";
import { SignUpForm } from "./components/SignUpForm";
import { TestProviderButton } from "./components/TestProviderButton";
import { TestParentButton } from "./components/TestParentButton";
import { PartnerLink } from "./components/PartnerLink";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"parent" | "provider">("parent");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome</h2>
          <p className="text-muted-foreground mt-2">
            Sign in to your account or create a new one
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                role={role}
                setRole={setRole}
                loading={loading}
                setLoading={setLoading}
              />
              
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-center text-muted-foreground mb-2">For testing purposes</p>
                <div className="space-y-2">
                  <TestProviderButton loading={loading} setLoading={setLoading} />
                  <TestParentButton loading={loading} setLoading={setLoading} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <SignUpForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                role={role}
                setRole={setRole}
                loading={loading}
                setLoading={setLoading}
              />
            </TabsContent>
          </Tabs>
          
          <PartnerLink />
        </div>
      </div>
    </div>
  );

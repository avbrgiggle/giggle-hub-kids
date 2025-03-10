
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./components/LoginForm";
import { SignUpForm } from "./components/SignUpForm";
import { TestProviderButton } from "./components/TestProviderButton";
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
              
              <TestProviderButton loading={loading} setLoading={setLoading} />
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
}


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

export default function Signup() {
  const { formData, loading, handleInputChange, handleSubmit } = useSignup();

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
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

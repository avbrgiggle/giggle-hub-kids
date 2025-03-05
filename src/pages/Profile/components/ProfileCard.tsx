
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/types/database.types";

interface ProfileCardProps {
  profile: Profile | null;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Label>Full Name</Label>
            <p className="text-lg">{profile?.full_name || 'Not set'}</p>
          </div>
          <div>
            <Label>Email</Label>
            <p className="text-lg">{profile?.username || 'Not set'}</p>
          </div>
          <div>
            <Label>Phone</Label>
            <p className="text-lg">{profile?.phone || 'Not set'}</p>
          </div>
          <div>
            <Label>Role</Label>
            <p className="text-lg capitalize">{profile?.role || 'Not set'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

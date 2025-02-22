
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import type { Child } from "@/types/database.types";

interface ChildListProps {
  children: Child[];
}

export function ChildList({ children }: ChildListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {children.map((child) => (
        <Card key={child.id}>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h3 className="font-medium">{child.first_name}</h3>
              <p className="text-sm text-muted-foreground">
                Birth Date: {format(new Date(child.date_of_birth), "PP")}
              </p>
              {child.interests && child.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {child.interests.map((interest) => (
                    <span
                      key={interest}
                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

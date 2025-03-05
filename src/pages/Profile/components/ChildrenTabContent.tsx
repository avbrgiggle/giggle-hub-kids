
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { ChildList } from "./ChildList";
import { AddChildForm } from "./AddChildForm";
import { useChildren, NewChild } from "../hooks/useChildren";

interface ChildrenTabContentProps {
  userId: string | undefined;
}

export function ChildrenTabContent({ userId }: ChildrenTabContentProps) {
  const {
    children,
    showAddChild,
    newChild,
    setShowAddChild,
    setNewChild,
    handleAddChild,
    toggleInterest,
  } = useChildren(userId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Children</CardTitle>
        <Button onClick={() => setShowAddChild(true)} variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Child
        </Button>
      </CardHeader>
      <CardContent>
        {children.length === 0 ? (
          <p className="text-muted-foreground">No children added yet.</p>
        ) : (
          <ChildList children={children} />
        )}

        {showAddChild && (
          <AddChildForm
            newChild={newChild}
            onSubmit={handleAddChild}
            onCancel={() => setShowAddChild(false)}
            onNewChildChange={(field, value) =>
              setNewChild((prev) => ({ ...prev, [field]: value }))
            }
            onToggleInterest={toggleInterest}
          />
        )}
      </CardContent>
    </Card>
  );
}

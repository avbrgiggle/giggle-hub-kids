
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentsTab() {
  const [payments] = useState([]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Payments</h2>
        <p className="text-muted-foreground">Manage and track student payments</p>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">
              No payments recorded yet.
            </p>
            <p className="text-sm text-center max-w-md">
              When students are enrolled in activities, payment information will be tracked here.
              You can send payment reminders, process refunds, and generate reports.
            </p>
          </CardContent>
        </Card>
      ) : (
        <></>
      )}
    </div>
  );
}

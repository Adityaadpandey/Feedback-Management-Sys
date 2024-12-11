import { Card } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";

export function NoResponseSelected() {
  return (
    <Card className="h-[calc(100vh-2rem)] flex items-center justify-center p-6">
      <div className="text-center">
        <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium text-foreground">
          No Response Selected
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Select a form to view its responses
        </p>
      </div>
    </Card>
  );
}
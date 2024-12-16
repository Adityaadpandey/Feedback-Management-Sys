"use client";

import { Button } from "@/components/ui/button";
import {  Download } from "lucide-react";

export function AnalyticsHeader({ form }: { form: any }) {
  return (
    <header className=" mt-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold">{form.title}</h1>
              <p className="text-sm text-muted-foreground">Analytics & Insights</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
    </header>
  );
}

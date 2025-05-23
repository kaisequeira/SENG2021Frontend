"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { getDespatchAdvice } from "@/lib/api-service"
import { FileText, Loader2 } from "lucide-react"
import { useState } from "react"

/**
 * ViewDespatchPage component for viewing despatch advice documents.
 * Allows users to enter a despatch ID and view the corresponding document.
 */
export default function ViewDespatchPage() {
  const [despatchId, setDespatchId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [documentUrl, setDocumentUrl] = useState<string | null>(null)
  const [documentContent, setDocumentContent] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!despatchId.trim()) {
      toast.error("Validation Error", {
        description: "Please enter a Despatch ID",
      });
      return;
    }

    setIsLoading(true);

    try {
      const url = await getDespatchAdvice(despatchId);
      setDocumentUrl(url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch document content");
      }
      const text = await response.text();
      setDocumentContent(text);
    } catch (error) {
      toast.error("Error retrieving despatch advice", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
      setDocumentUrl(null);
      setDocumentContent(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">View Despatch Advice</h1>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Retrieve Despatch Advice</CardTitle>
            <CardDescription>Enter the Despatch ID to view the corresponding document</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="despatch-id">Despatch ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="despatch-id"
                    placeholder="Enter Despatch ID"
                    value={despatchId}
                    onChange={(e) => setDespatchId(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="mr-2 h-4 w-4" />
                    )}
                    View
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {documentUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Despatch Advice Document</CardTitle>
              <CardDescription>Despatch ID: {despatchId}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-6 border rounded-md">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-center mb-4">Document Content:</p>
                <div className="w-full p-4 bg-background rounded-md overflow-auto">
                  <pre className="text-sm whitespace-pre-wrap text-muted-foreground border rounded-lg">{documentContent}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


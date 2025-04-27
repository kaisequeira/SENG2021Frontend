"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { retrieveInvoice } from "@/lib/invoice-api-service"
import { FileText, Loader2 } from "lucide-react"
import { useState } from "react"

/**
 * ViewInvoicePage component for viewing invoice advice documents from the SUSHI API.
 * Allows users to enter a despatch/invoice ID and view the corresponding invoice document.
 */
export default function ViewDespatchPage() {
  const [invoiceId, setInvoiceId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [documentContent, setDocumentContent] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceId.trim()) {
      toast.error("Validation Error", {
        description: "Please enter an Invoice ID",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await retrieveInvoice(invoiceId);
      setDocumentContent(response);
    } catch (error) {
      toast.error("Error retrieving invoice", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
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
            <CardTitle>Retrieve Invoice</CardTitle>
            <CardDescription>Enter the Invoice ID to view the corresponding document. Note: This feature is courtesy of the SUSHI SENG2021 API, although requires sending a despatch before an invoice can be generated and, thus, retrieved. In addition, you must disable the Insecure Content setting if you are in chrome to allow access to SUSHI's API</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="despatch-id">Invoice ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="despatch-id"
                    placeholder="Enter Despatch ID"
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
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

        {documentContent && (
          <Card>
            <CardHeader>
              <CardTitle>Invoice Document</CardTitle>
              <CardDescription>Despatch ID: {invoiceId}</CardDescription>
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


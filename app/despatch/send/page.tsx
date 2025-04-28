"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { getDespatchAdvice, sendDespatch } from "@/lib/api-service"
import { Loader2, Send } from "lucide-react"
import { useState } from "react"
import { mapDespatchAdviceToInvoice } from "@/lib/invoice-utils"
import { createInvoice } from "@/lib/invoice-api-service"

/**
 * SendDespatchPage component for sending despatches from the warehouse.
 * Allows users to enter a despatch ID and mark it as sent.
 */
export default function SendDespatchPage() {
  const [despatchId, setDespatchId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!despatchId.trim()) {
      toast.error("Validation Error", {
        description: "Please enter a Despatch ID",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await sendDespatch(despatchId)

      toast.success("Despatch Sent", {
        description: result,
      })

      try {
        const url = await getDespatchAdvice(despatchId);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch document content");
        }
        const text = await response.text();
        const invoice = mapDespatchAdviceToInvoice(text)
        const invoiceId = await createInvoice(invoice);
        toast.success("Invoice Created", {
          description: `Invoice ID: ${invoiceId}`,
          action: {
            label: "Copy",
            onClick: () => {
              navigator.clipboard.writeText(invoiceId);
              toast.success("Invoice ID copied to clipboard!");
            }
          },
        })
      } catch (error) {
        console.error("Error creating invoice:", error);
        toast.error("Error creating invoice", {
          description: error instanceof Error ? error.message : "Unknown error occurred",
        });
      }

      // Reset form
      setDespatchId("")
    } catch (error) {
      toast.error("Error sending despatch", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Send Despatch</h1>

      <Card>
        <CardHeader>
          <CardTitle>Send Despatch from Warehouse</CardTitle>
          <CardDescription>
            Enter the Despatch ID to mark it as sent and update inventory. Integration with the SUSHI invoice API requires the following steps:
            <ol className="list-decimal list-inside mt-2">
              <li>In site settings, set the "Insecure Content" field to "Allowed".</li>
              <li>Log in again to receive the SUSHI invoice token.</li>
              <li>
                After sending a despatch advice, copy the returned invoice ID to retrieve the invoice at a later date.
              </li>
            </ol>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="despatch-id">Despatch ID</Label>
              <Input
                id="despatch-id"
                placeholder="Enter Despatch ID"
                value={despatchId}
                onChange={(e) => setDespatchId(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Send Despatch
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { sendDespatch } from "@/lib/api-service"
import { Loader2, Send } from "lucide-react"
import { useState } from "react"

/**
 * SendDespatchPage component for sending despatches from the warehouse.
 * Allows users to enter a despatch ID and mark it as sent.
 */
export default function SendDespatchPage() {
  const { toast } = useToast()
  const [despatchId, setDespatchId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!despatchId.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a Despatch ID",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await sendDespatch(despatchId)

      toast({
        title: "Despatch Sent",
        description: result,
      })

      // Reset form
      setDespatchId("")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sending despatch",
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
          <CardDescription>Enter the Despatch ID to mark it as sent and update inventory</CardDescription>
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


"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createDespatchCancellation } from "@/lib/api-service"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

/**
 * CreateCancellationPage component for creating despatch cancellations.
 * Allows users to enter a despatch ID and reason for cancellation.
 */
export default function CreateCancellationPage() {
  const [despatchId, setDespatchId] = useState("")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!despatchId.trim()) {
      toast.error("Please enter a Despatch ID")
      return
    }

    if (!reason.trim()) {
      toast.error("Please enter a reason for cancellation")
      return
    }

    setIsLoading(true)

    try {
      await createDespatchCancellation(despatchId, reason)

      toast.success("Successfully created despatch cancellation")

      // Reset form
      setDespatchId("")
      setReason("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create Despatch Cancellation</h1>

      <Card>
        <CardHeader>
          <CardTitle>Cancel Despatch</CardTitle>
          <CardDescription>Enter the Despatch ID and reason to cancel a despatch</CardDescription>
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

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Cancellation</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for cancellation"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={4}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Cancellation
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

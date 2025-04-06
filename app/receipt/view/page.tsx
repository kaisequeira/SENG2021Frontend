"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { getReceiptAdvice } from "@/lib/api-service"
import { FileText, Loader2 } from "lucide-react"
import { useState } from "react"

/**
 * ViewReceiptPage component for viewing receipt advice documents.
 * Allows users to enter a despatch ID and view the corresponding receipt.
 */
export default function ViewReceiptPage() {
  const { toast } = useToast()
  const [despatchId, setDespatchId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [documentUrl, setDocumentUrl] = useState<string | null>(null)

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
      const url = await getReceiptAdvice(despatchId)
      setDocumentUrl(url)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error retrieving receipt advice",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
      setDocumentUrl(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">View Receipt Advice</h1>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Retrieve Receipt Advice</CardTitle>
            <CardDescription>Enter the Despatch ID to view the corresponding receipt</CardDescription>
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
              <CardTitle>Receipt Advice Document</CardTitle>
              <CardDescription>Despatch ID: {despatchId}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-6 border rounded-md">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-center mb-4">Document URL: {documentUrl}</p>
                <Button asChild>
                  <a href={documentUrl} target="_blank" rel="noopener noreferrer">
                    Open Document
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


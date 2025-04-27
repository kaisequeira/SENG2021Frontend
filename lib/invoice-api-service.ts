import { getInvoiceApiToken } from "./auth"
import { Invoice } from "./invoice-utils"

// Get the Invoice API base URL from environment variables
const INVOICE_API_BASE_URL = "http://sushi-invoice-application.ap-southeast-2.elasticbeanstalk.com"

/**
 * Interface for authentication token response
 */
export interface AuthTokenResponse {
    token: string
    expiresIn?: number
}

/**
 * Helper function to add authentication headers to requests
 * @param headers - Optional existing headers
 * @returns Headers with authentication token
 */
function getInvoiceAuthHeaders(headers: HeadersInit = {}): HeadersInit {
  const token = getInvoiceApiToken()

  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    }
  }

  return headers
}


/**
 * Login to the Invoice API
 * @returns Promise with success or error
 */
export async function loginToInvoiceApi(): Promise<AuthTokenResponse> {
    try {
      const response = await fetch(`${INVOICE_API_BASE_URL}/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "crunchie@gmail.com",
          password: "Password1@",
        }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to login to Invoice API")
      }
  
      return (await response.json()).data
    } catch (error) {
      console.error("Error logging in to Invoice API:", error)
      throw error
    }
}

/**
 * Create an invoice based on despatch data
 * @param despatchId - The despatch ID
 * @returns Promise with invoice ID or error
 */
export async function createInvoice(invoice: Invoice): Promise<string> {
    try {  
        const response = await fetch(`${INVOICE_API_BASE_URL}/v1/invoices/create`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            ...getInvoiceAuthHeaders(),
            },
            body: JSON.stringify(invoice),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to create invoice")
        }

        const data = await response.json()
        console.log("Invoice created successfully:", data)
        return data.invoiceId
    } catch (error) {
        console.error("Error creating invoice:", error)
        throw error
    }
}

/**
 * Retrieve an invoice from the SUSHI API
 * @param invoiceId - The invoice ID
 * @returns Promise with invoice data or error
 */
export async function retrieveInvoice(invoiceId: string): Promise<string> {
    try {  
        const response = await fetch(`${INVOICE_API_BASE_URL}/v1/invoices/${invoiceId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...getInvoiceAuthHeaders(),
            },
        })
    
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to retrieve invoice")
        }

        const responseText = await response.text()
        if (response.headers.get("Content-Type")?.includes("application/xml")) {
            console.log("Invoice retrieved successfully (XML):", responseText)
            return responseText
        } else {
            throw new Error("Unexpected response format: Expected XML")
        }
    } catch (error) {
        console.error("Error retrieving invoice:", error)
        throw error
    }
}
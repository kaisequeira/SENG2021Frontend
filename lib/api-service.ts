/**
 * API service for interacting with the Despatch Advice API.
 * Provides methods for all API endpoints defined in the backend implementation.
 */

import { getAuthToken } from "./auth"

// Get the API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

/**
 * Helper function to add authentication headers to requests
 * @param headers - Optional existing headers
 * @returns Headers with authentication token
 */
function getAuthHeaders(headers: HeadersInit = {}): HeadersInit {
  const token = getAuthToken()

  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    }
  }

  return headers
}

/**
 * Interface for contact information address
 */
interface Address {
  Street: string
  Building_Name?: string
  Building_Number?: string
  City: string
  Postal_Code: string
  Country: string
}

/**
 * Interface for contact information
 */
interface ContactInformation {
  Email: string
  Phone: string
  Address: Address
}

/**
 * Interface for order details
 */
interface OrderDetails {
  Order_ID: number
  Sales_Order_ID: string
  Issue_Date: string
}

/**
 * Interface for product in order
 */
interface OrderProduct {
  Product_ID: number
  Quantity: number
}

/**
 * Interface for order despatch request
 */
interface OrderDespatchRequest {
  Contact_Information: ContactInformation
  Order_Details: OrderDetails
  Products: OrderProduct[]
}

/**
 * Interface for product details
 */
interface ProductDetails {
  P_Description: string
  P_Release_Date?: number
  P_Height?: number
  P_Width?: number
  P_Depth?: number
  P_Weight?: number
}

/**
 * Interface for create product request
 */
interface CreateProductRequest {
  Product_Name: string
  Product_Details: ProductDetails
}

/**
 * Interface for product status response
 */
interface ProductStatusResponse {
  Product_Name: string
  Product_Details: {
    P_Description: string
    P_Release_Date: string
    P_Height: number
    P_Width: number
    P_Depth: number
    P_Weight: number
  }
  SOH: {
    Available: number
    Pending: number
    Awaiting: number
  }
  Last_Stock_Update: string
}

/**
 * Interface for all products response
 */
interface AllProductsResponse {
  Products: {
    Product_ID: number
    Product_Name: string
  }[]
}

/**
 * Creates and sends Despatch Advice to the delivery party
 * @param orderDespatchData - The order despatch data
 * @returns Promise with despatch IDs or error
 */
export async function createOrderDespatch(orderDespatchData: OrderDespatchRequest): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/order-despatch`, {
      method: "POST",
      headers: getAuthHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(orderDespatchData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create order despatch")
    }

    const data = await response.json()
    return data.Despatch_IDs
  } catch (error) {
    console.error("Error creating order despatch:", error)
    throw error
  }
}

/**
 * Creates an order cancellation
 * @param despatchId - The despatch ID to cancel
 * @param reason - The reason for cancellation
 * @returns Promise with success or error
 */
export async function createDespatchCancellation(despatchId: string, reason: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/despatch-cancellation`, {
      method: "POST",
      headers: getAuthHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        Despatch_ID: despatchId,
        Reason: reason,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create despatch cancellation")
    }
  } catch (error) {
    console.error("Error creating despatch cancellation:", error)
    throw error
  }
}

/**
 * Retrieves the product status
 * @param productId - The product ID
 * @returns Promise with product status or error
 */
export async function getProductStatus(productId: number): Promise<ProductStatusResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/product-status?Product_ID=${productId}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to get product status")
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting product status:", error)
    throw error
  }
}

/**
 * Retrieves all products
 * @returns Promise with all products or error
 */
export async function getAllProducts(): Promise<AllProductsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/products-all`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to get all products")
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting all products:", error)
    throw error
  }
}

/**
 * Retrieves the receipt advice
 * @param despatchId - The despatch ID
 * @returns Promise with receipt advice URL or error
 */
export async function getReceiptAdvice(despatchId: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/receipt-advice?Despatch_ID=${despatchId}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to get receipt advice")
    }

    const data = await response.json()
    return data.Receipt_Advice_URL
  } catch (error) {
    console.error("Error getting receipt advice:", error)
    throw error
  }
}

/**
 * Retrieves the despatch cancellation
 * @param despatchId - The despatch ID
 * @returns Promise with cancellation URL or error
 */
export async function getDespatchCancellation(despatchId: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/despatch-cancellation?Despatch_ID=${despatchId}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to get despatch cancellation")
    }

    const data = await response.json()
    return data.Cancellation_URL
  } catch (error) {
    console.error("Error getting despatch cancellation:", error)
    throw error
  }
}

/**
 * Retrieves the despatch advice
 * @param despatchId - The despatch ID
 * @returns Promise with despatch advice URL or error
 */
export async function getDespatchAdvice(despatchId: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/despatch-advice?Despatch_ID=${despatchId}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to get despatch advice")
    }

    const data = await response.json()
    return data.Despatch_Advice_URL
  } catch (error) {
    console.error("Error getting despatch advice:", error)
    throw error
  }
}

/**
 * Sends the despatch from the warehouse
 * @param despatchId - The despatch ID
 * @returns Promise with success or error
 */
export async function sendDespatch(despatchId: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/send-despatch`, {
      method: "PUT",
      headers: getAuthHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        Despatch_ID: despatchId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to send despatch")
    }

    const data = await response.json()
    return data.message
  } catch (error) {
    console.error("Error sending despatch:", error)
    throw error
  }
}

/**
 * Adds product stock
 * @param productId - The product ID
 * @param quantity - The quantity to add
 * @returns Promise with success or error
 */
export async function addProductStock(productId: number, quantity: number): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/product-add`, {
      method: "PUT",
      headers: getAuthHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        Product_ID: productId,
        Quantity: quantity,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to add product stock")
    }

    return "Stock updated successfully"
  } catch (error) {
    console.error("Error adding product stock:", error)
    throw error
  }
}

/**
 * Creates a new product
 * @param productData - The product data
 * @returns Promise with product ID or error
 */
export async function createProduct(productData: CreateProductRequest): Promise<number> {
  try {
    const transformedProductData = {
      ...productData,
      Product_Details: {
        ...productData.Product_Details,
        P_Release_Date: productData.Product_Details.P_Release_Date
          ? new Date(productData.Product_Details.P_Release_Date).toISOString()
          : undefined,
      },
    }

    const response = await fetch(`${API_BASE_URL}/product-create`, {
      method: "POST",
      headers: getAuthHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        Product_Name: transformedProductData.Product_Name,
        Product_Details: transformedProductData.Product_Details,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create product")
    }

    const data = await response.json()
    return data.Product_ID
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

/**
 * Deletes a product
 * @param productId - The product ID
 * @returns Promise with success or error
 */
export async function deleteProduct(productId: number): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/product-delete`, {
      method: "DELETE",
      headers: getAuthHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        Product_ID: productId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to delete product")
    }

    return "Product deleted successfully"
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

/**
 * Retrieves all despatch entries
 * @returns Promise with despatch entries or error
 */
export async function getAllDespatchEntries(): Promise<{ Despatch_ID: string; Status: string; Issue_Date: string }[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/despatch-ids`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to retrieve despatch entries");
    }

    const data = await response.json();
    return data.Despatch_IDs;
  } catch (error) {
    console.error("Error retrieving despatch entries:", error);
    throw error;
  }
}
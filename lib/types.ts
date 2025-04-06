/**
 * Type definitions for the Despatch Advice API.
 * Contains interfaces for all API request and response objects.
 */

/**
 * Interface for address in contact information
 */
export interface Address {
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
export interface ContactInformation {
  Email: string
  Phone: string
  Address: Address
}

/**
 * Interface for order details
 */
export interface OrderDetails {
  Order_ID: number
  Sales_Order_ID: string
  Issue_Date: string
}

/**
 * Interface for product in order
 */
export interface OrderProduct {
  Product_Id: number
  Product_Quantity: number
}

/**
 * Interface for order despatch request
 */
export interface OrderDespatchRequest {
  Contact_Information: ContactInformation
  Order_Details: OrderDetails
  Products: OrderProduct[]
}

/**
 * Interface for order despatch response
 */
export interface OrderDespatchResponse {
  despatchIDs: string[][]
}

/**
 * Interface for product details
 */
export interface ProductDetails {
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
export interface CreateProductRequest {
  Product_name: string
  Product_details: ProductDetails
}

/**
 * Interface for create product response
 */
export interface CreateProductResponse {
  Product_ID: number
}

/**
 * Interface for product status response
 */
export interface ProductStatusResponse {
  Product_Name: string
  Product_Details: {
    P_Description: string
    P_Release_date: string
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
export interface AllProductsResponse {
  Products: {
    Product_ID: number
    Product_Name: string
  }[]
}

/**
 * Interface for receipt advice response
 */
export interface ReceiptAdviceResponse {
  Receipt_Advice_URL: string
}

/**
 * Interface for despatch cancellation response
 */
export interface DespatchCancellationResponse {
  Cancellation_URL: string
}

/**
 * Interface for despatch advice response
 */
export interface DespatchAdviceResponse {
  Despatch_Advice_URL: string
}

/**
 * Interface for error response
 */
export interface ErrorResponse {
  error: string
}


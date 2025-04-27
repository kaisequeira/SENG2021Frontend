/**
 * Utility functions for working with invoices
 */

/**
 * Interface for an invoice item
 */
export interface InvoiceItem {
    name: string;
    count: number;
    cost: number;
}
  
  /**
   * Interface for an invoice
   */
export interface Invoice {
    invoiceId: string;
    supplier: string;
    buyer: string;
    total: number;
    currency: string;
    issueDate: string;
    items: InvoiceItem[];
    buyerEmail?: string;
    buyerPhone?: string;
  }
  
/**
 * Maps a despatch advice XML to an invoice object
 * Works in both browser and Node.js environments
 * 
 * @param xmlString - The despatch advice XML as a string
 * @returns The mapped invoice object
 * @throws Error if the XML cannot be parsed or required data is missing
 */
export function mapDespatchAdviceToInvoice(xmlString: string): Invoice {
    try {
        let despatchData: any;
        
        despatchData = parseXmlWithDom(xmlString);
        
        // Set due date to 30 days after issue date
        const dueDate = new Date(despatchData.issueDate);
        dueDate.setDate(dueDate.getDate() + 30);
    
        // Create the invoice object
        const invoice: Invoice = {
            invoiceId: despatchData.despatchId,
            supplier: "Crunchie Despatch System",
            buyer: "Customer",
            total: despatchData.total,
            currency: "AUD",
            issueDate: despatchData.issueDate,
            items: despatchData.items,
            buyerEmail: despatchData.email,
            buyerPhone: despatchData.phone,
        };
    
        return invoice;
    } catch (error) {
        console.error("Error mapping despatch advice to invoice:", error);
        throw error instanceof Error 
            ? error 
            : new Error("Unknown error mapping despatch advice to invoice");
    }
  }
  
  /**
   * Parse XML using the browser's DOMParser
   * @param xmlString - The XML string to parse
   * @returns Extracted data from the XML
   */
  function parseXmlWithDom(xmlString: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    // Check for parsing errors
    const parseError = xmlDoc.getElementsByTagName("parsererror");
    if (parseError.length > 0) {
        throw new Error("Failed to parse XML: " + parseError[0].textContent);
    }
  
    // Helper function to get text content of an element
    const getElementText = (parent: Element | Document, tagName: string): string => {
        const element = parent.getElementsByTagName(tagName)[0];
        return element ? element.textContent || "" : "";
    };
  
    // Helper function to get number from element text
    const getElementNumber = (parent: Element | Document, tagName: string): number => {
        const text = getElementText(parent, tagName);
        return text ? Number(text) : 0;
    };
  
    // Extract basic despatch info
    const despatchId = getElementText(xmlDoc, "ID");
    if (!despatchId) {
        throw new Error("Despatch ID is missing in the XML");
    }
  
    const issueDateRaw = getElementText(xmlDoc, "IssueDate");
    if (!issueDateRaw) {
        throw new Error("Issue date is missing in the XML");
    }
    
    // Format the issue date (take just the date part if it's in ISO format)
    const issueDate = issueDateRaw.includes("T") 
        ? issueDateRaw.split("T")[0] 
        : issueDateRaw;
  
    // Extract contact information
    const contactInfoElements = xmlDoc.getElementsByTagName("ContactInformation");
    if (contactInfoElements.length === 0) {
        throw new Error("Contact information is missing in the XML");
    }
    
    const contactInfo = contactInfoElements[0];
    const email = getElementText(contactInfo, "Email");
    const phone = getElementText(contactInfo, "Phone");
  
    // Extract address
    const addressElements = contactInfo.getElementsByTagName("Address");
    let street = "";
    let buildingName = "";
    let buildingNumber = "";
    let country = "AU"; // Default to Australia
    
    if (addressElements.length > 0) {
        const address = addressElements[0];
        street = getElementText(address, "Street");
        buildingName = getElementText(address, "BuildingName");
        buildingNumber = getElementText(address, "BuildingNumber");
        const countryRaw = getElementText(address, "Country");
        country = countryRaw === "Australia" ? "AU" : countryRaw;
    }
  
    // Extract products
    const productElements = xmlDoc.getElementsByTagName("Product");
    if (productElements.length === 0) {
        throw new Error("No products found in the XML");
    }
  
    let total = 0;
    const items: InvoiceItem[] = [];
  
    for (let i = 0; i < productElements.length; i++) {
        const product = productElements[i];
        const productName = getElementText(product, "ProductName");
        const quantity = getElementNumber(product, "Quantity");
      
        if (!productName) {
            console.warn(`Product at index ${i} has no name, using default`);
        }
      
        if (quantity <= 0) {
            console.warn(`Product "${productName || 'Unknown'}" has invalid quantity: ${quantity}, using 1`);
        }
      
      // Default unit price of $100 per item
      const unitPrice = 100;
      const itemTotal = unitPrice * (quantity > 0 ? quantity : 1);
      
      total += itemTotal;
      
        items.push({
            name: productName || `Product ${i + 1}`,
            count: quantity > 0 ? quantity : 1,
            cost: unitPrice
        });
    }
  
    return {
        despatchId,
        issueDate,
        email,
        phone,
        street,
        buildingName,
        buildingNumber,
        country,
        total,
        items
    };
}
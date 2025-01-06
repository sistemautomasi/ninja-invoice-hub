import { Invoice } from "@/types/invoice";
import { useCurrency } from "@/hooks/use-currency";
import { format } from "date-fns";

interface PrintableInvoiceProps {
  invoice: Invoice;
}

export const generatePrintableInvoice = (invoice: Invoice, formatPrice: (amount: number) => string) => {
  return `
    <html>
      <head>
        <title>Invoice ${invoice.order_number}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .invoice-details { margin-bottom: 20px; }
          .customer-details { margin-bottom: 20px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items-table th { background-color: #f5f5f5; }
          .total { font-size: 1.2em; font-weight: bold; text-align: right; }
          .company-info { text-align: center; margin-bottom: 20px; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="company-info">
          <h1>Your Company Name</h1>
          <p>123 Business Street<br/>City, State 12345<br/>Phone: (123) 456-7890</p>
        </div>
        <div class="header">
          <h2>Invoice</h2>
          <h3>${invoice.order_number}</h3>
        </div>
        <div class="invoice-details">
          <p><strong>Date:</strong> ${format(new Date(invoice.created_at), "PPP")}</p>
          <p><strong>Status:</strong> ${invoice.status}</p>
        </div>
        <div class="customer-details">
          <h3>Bill To:</h3>
          <p>${invoice.customer_name}</p>
        </div>
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.order_items?.map((item) => `
              <tr>
                <td>${item.product?.name || 'Unknown Product'}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.price_at_time)}</td>
                <td>${formatPrice(item.quantity * item.price_at_time)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">
          <p>Total Amount: ${formatPrice(invoice.total_amount)}</p>
        </div>
      </body>
    </html>
  `;
};
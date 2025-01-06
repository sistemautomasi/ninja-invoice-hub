import { useQuery } from "@tanstack/react-query";
import { Loader2, FileText, Printer, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/hooks/use-currency";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Invoice {
  id: string;
  order_number: string;
  created_at: string;
  customer_name: string;
  total_amount: number;
  status: string;
  order_items: {
    id: string;
    quantity: number;
    price_at_time: number;
    product: {
      name: string;
    };
  }[];
}

const Invoices = () => {
  const { formatPrice } = useCurrency();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          created_at,
          customer_name,
          total_amount,
          status,
          order_items (
            id,
            quantity,
            price_at_time,
            product (
              name
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    },
  });

  const handlePrint = (invoice: Invoice) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
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
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-8 text-left bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
        Invoices
      </h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {invoice.order_number}
                  </div>
                </TableCell>
                <TableCell>{format(new Date(invoice.created_at), "PPP")}</TableCell>
                <TableCell>{invoice.customer_name}</TableCell>
                <TableCell>{formatPrice(invoice.total_amount)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      invoice.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrint(invoice)}
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Invoices;
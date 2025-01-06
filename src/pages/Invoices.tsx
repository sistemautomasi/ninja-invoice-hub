import { useQuery } from "@tanstack/react-query";
import { Loader2, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/hooks/use-currency";
import { format } from "date-fns";

interface Invoice {
  id: string;
  order_number: string;
  created_at: string;
  customer_name: string;
  total_amount: number;
  status: string;
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
          status
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
              .amount { font-size: 1.2em; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Invoice</h1>
              <h2>${invoice.order_number}</h2>
            </div>
            <div class="invoice-details">
              <p>Date: ${format(new Date(invoice.created_at), "PPP")}</p>
            </div>
            <div class="customer-details">
              <h3>Customer Details</h3>
              <p>Name: ${invoice.customer_name}</p>
            </div>
            <div class="amount">
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
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Invoice Number
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Date
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Customer
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Amount
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {invoice.order_number}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    {format(new Date(invoice.created_at), "PPP")}
                  </td>
                  <td className="p-4 align-middle">{invoice.customer_name}</td>
                  <td className="p-4 align-middle">
                    {formatPrice(invoice.total_amount)}
                  </td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        invoice.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrint(invoice)}
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/hooks/use-currency";
import { InvoiceList } from "@/components/invoices/InvoiceList";
import { generatePrintableInvoice } from "@/components/invoices/PrintableInvoice";
import type { Invoice } from "@/types/invoice";

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
            products:product_id (
              name
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match our Invoice type
      const transformedData = data.map(order => ({
        ...order,
        order_items: order.order_items.map(item => ({
          ...item,
          product: item.products // Rename products to product to match our type
        }))
      }));

      return transformedData as Invoice[];
    },
  });

  const handlePrint = (invoice: Invoice) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(generatePrintableInvoice(invoice, formatPrice));
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

      <InvoiceList 
        invoices={invoices || []} 
        onPrint={handlePrint}
      />
    </div>
  );
};

export default Invoices;
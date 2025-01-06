import { format } from "date-fns";
import { FileText, Printer, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/use-currency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/types/invoice";

interface InvoiceListProps {
  invoices: Invoice[];
  onPrint: (invoice: Invoice) => void;
}

export const InvoiceList = ({ invoices, onPrint }: InvoiceListProps) => {
  const { formatPrice } = useCurrency();

  return (
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
                    onClick={() => onPrint(invoice)}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
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
  );
};
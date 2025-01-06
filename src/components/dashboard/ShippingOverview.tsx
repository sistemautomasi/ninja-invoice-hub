import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, Truck, CheckCircle, ClipboardCheck } from "lucide-react";

interface ShippingOverviewProps {
  shipping: {
    toShip: number;
    confirmed: number;
    inTransit: number;
    delivered: number;
  } | undefined;
}

const ShippingOverview = ({ shipping }: ShippingOverviewProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Shipping Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Box className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">To Ship</p>
              <p className="text-2xl font-bold">{shipping?.toShip || 0}</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg flex items-center space-x-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <ClipboardCheck className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-2xl font-bold">{shipping?.confirmed || 0}</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg flex items-center space-x-4">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Truck className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Transit</p>
              <p className="text-2xl font-bold">{shipping?.inTransit || 0}</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-4">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold">{shipping?.delivered || 0}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingOverview;
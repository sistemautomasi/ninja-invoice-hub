import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import Dashboard from "@/pages/Dashboard";
import OrderList from "@/pages/OrderList";
import SubmitOrder from "@/pages/SubmitOrder";
import Products from "@/pages/Products";
import Settings from "@/pages/Settings";
import Costs from "@/pages/Costs";
import AdvertisingReport from "@/pages/AdvertisingReport";
import Invoices from "@/pages/Invoices";
import Integrations from "@/pages/Integrations";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/submit-order" element={<SubmitOrder />} />
            <Route path="/products" element={<Products />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="/costs" element={<Costs />} />
            <Route path="/advertising" element={<AdvertisingReport />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/integrations" element={<Integrations />} />
          </Routes>
        </DashboardLayout>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
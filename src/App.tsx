import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { DashboardLayout } from "@/components/DashboardLayout";

// Pages
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import OrderList from "@/pages/OrderList";
import SubmitOrder from "@/pages/SubmitOrder";
import Settings from "@/pages/Settings";
import Costs from "@/pages/Costs";
import AdvertisingReport from "@/pages/AdvertisingReport";
import { Integrations } from "@/pages/Integrations";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/submit-order" element={<SubmitOrder />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/costs" element={<Costs />} />
          <Route path="/advertising" element={<AdvertisingReport />} />
          <Route path="/integrations" element={<Integrations />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
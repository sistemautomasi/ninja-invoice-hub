import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Settings from "@/pages/Settings";
import OrderList from "@/pages/OrderList";
import SubmitOrder from "@/pages/SubmitOrder";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="settings" element={<Settings />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="submit-order" element={<SubmitOrder />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
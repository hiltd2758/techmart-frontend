import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "./Components/Footer/Footer.jsx";
import Home from "./Pages/Home/Home.jsx";
import SupportCenter from "./Pages/SupportCenter/SupportCenter.jsx";
import Contact from "./Pages/Contact/Contact.jsx";
import FAQs from "./Pages/FAQs/FAQs.jsx";
import Product from "./Pages/Product/Product.jsx";
import LoginPage from "./Pages/auth/LoginPage.jsx";
import RegisterPage from "./Pages/auth/RegisterPage.jsx";
import ProductDetail from "./Pages/ProductDetail/ProductDetail.jsx";
import Account from "./Pages/Account/Account.jsx";
import AdminLayout from "./Components/Admin/AdminLayout.jsx";
import Dashboard from "./Pages/Admin/Dashboard.jsx";
import ProductList from "./Pages/Admin/Products/ProductList.jsx";
import AddProduct from "./Pages/Admin/Products/AddProduct.jsx";
import EditProduct from "./Pages/Admin/Products/EditProduct.jsx";
// import OrderList from "./Pages/Admin/Orders/OrderList.jsx";
import UserList from "./Pages/Admin/Users/UserList.jsx";
import EditUser from "./Pages/Admin/Users/EditUser.jsx";
import Settings from "./Pages/Admin/Settings/Settings.jsx";
import NotFoundPage from "./Pages/Errors/NotFoundPage";
import ServerErrorPage from "./Pages/Errors/ServerErrorPage";
import OrderHistory from "./Pages/Account/OrderHistory/OrderHistory";
import AddUser from "./Pages/Admin/Users/AddUser.jsx";
import CheckoutPage from "./Pages/Checkout/CheckoutPage.jsx";
import PaymentConfirmation from "./Pages/Payment/PaymentConfirmation.jsx";
import OrderSuccess from "./Pages/OrderSuccess.jsx";
import OrderFailed from "./Pages/OrderFailed.jsx";

// Component để scroll to top khi route thay đổi
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Auth routes - Không Footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main routes - Có Footer */}
        <Route
          path="/"
          element={
            <>
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/support-center"
          element={
            <>
              <SupportCenter />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/faqs"
          element={
            <>
              <FAQs />
              <Footer />
            </>
          }
        />
        <Route
          path="/product"
          element={
            <>
              <Product />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={<ProductDetail />}
        />
        <Route
          path="/account"
          element={
            <>
              <Account />
            </>
          }
        />
        <Route
          path="/account/order-history"
          element={
            <>
              <OrderHistory />
              <Footer />
            </>
          }
        />
        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
<Route path="/payment-confirmation/:orderId" element={<PaymentConfirmation />} />
        <Route
          path="/order-success/:orderId"
          element={<OrderSuccess />}
        />
        <Route
          path="/order-failed"
          element={<OrderFailed />}
        />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          {/* <Route path="orders" element={<OrderList />} /> */}
          <Route path="users" element={<UserList />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./Components/Footer/Footer.jsx";
import Home from "./Pages/Home/Home.jsx";
import SupportCenter from "./Pages/SupportCenter/SupportCenter.jsx";
import Contact from "./Pages/Contact/Contact.jsx";
import FAQs from "./Pages/FAQs/FAQs.jsx";
import Product from "./Pages/Product/Product.jsx";
import LoginPage from "./Pages/auth/LoginPage.jsx";
import RegisterPage from "./Pages/auth/RegisterPage.jsx";
import ProductDetail from "./Components/ProductDetail/ProductDetail.jsx";
import Account from "./Pages/Account/Account.jsx";
import AdminLayout from "./Components/Admin/AdminLayout.jsx";
import Dashboard from "./Pages/Admin/Dashboard.jsx";
import ProductList from "./Pages/Admin/Products/ProductList.jsx";
import AddProduct from "./Pages/Admin/Products/AddProduct.jsx";
import EditProduct from "./Pages/Admin/Products/EditProduct.jsx";
import OrderList from "./Pages/Admin/Orders/OrderList.jsx";
import UserList from "./Pages/Admin/Users/UserList.jsx";
import EditUser from "./Pages/Admin/Users/EditUser.jsx";
import CountryList from "./Pages/Admin/Countries/CountryList.jsx";
import AddCountry from "./Pages/Admin/Countries/AddCountry.jsx";
import EditCountry from "./Pages/Admin/Countries/EditCountry.jsx";
import Settings from "./Pages/Admin/Settings/Settings.jsx";
import NotFoundPage from "./Pages/Errors/NotFoundPage";
import ServerErrorPage from "./Pages/Errors/ServerErrorPage";

import OrderHistory from "./Pages/Account/OrderHistory/OrderHistory";
import AddUser from "./Pages/Admin/Users/AddUser.jsx";
import Payment from "./Pages/Payment/Payment.jsx";
import PrivateRoute from "./Components/Auth/PrivateRoute.jsx";
import AdminRoute from "./Components/Auth/AdminRoute.jsx";


function App() {
  return (
    <BrowserRouter>
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
          element={
            <>
              <ProductDetail />
            </>
          }
        />
        <Route
          path="/account"
          element={<PrivateRoute />}
        >
          <Route index element={
            <>
              <Account />
            </>
          } />
          <Route
            path="order-history"
            element={
              <>
                <OrderHistory />
                <Footer />
              </>
            }
          />
        </Route>

        <Route path="/payment" element={<PrivateRoute />}>
          <Route index element={<Payment />} />
        </Route>

        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="users/add" element={<AddUser />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/edit/:id" element={<EditUser />} />
            <Route path="countries" element={<CountryList />} />
            <Route path="countries/add" element={<AddCountry />} />
            <Route path="countries/edit/:id" element={<EditCountry />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

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
import AdminLayout from './Components/Admin/AdminLayout.jsx'  
import Dashboard from './Pages/Admin/Dashboard.jsx'  
// import ProductList from './Pages/Admin/Products/ProductList.jsx' 
import ProductList from './Pages/Admin/Products/ProductList.jsx'  
import AddProduct from './Pages/Admin/Products/AddProduct.jsx'  
import EditProduct from './Pages/Admin/Products/EditProduct.jsx'
import OrderList from './Pages/Admin/Orders/OrderList.jsx'
import UserList from './Pages/Admin/Users/UserList.jsx'
import Settings from './Pages/Admin/Settings/Settings.jsx'
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
              <Footer />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <>
              <ProductDetail />
              <Footer />
            </>
          }
        />
        <Route
          path="/account"
          element={
            <>
              <Account />
            </>
          }
        />
        <Route path='/admin' element={<AdminLayout/>}>
  <Route index element={<Dashboard/>} />
  <Route path='products' element={<ProductList/>} />
  <Route path='products/add' element={<AddProduct/>} />
  <Route path='products/edit/:id' element={<EditProduct/>} />
  <Route path='orders' element={<OrderList/>} />
  <Route path='users' element={<UserList/>} />
  <Route path='settings' element={<Settings/>} />
</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

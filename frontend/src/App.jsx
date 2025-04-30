import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MainLayout from './layouts/MainLayout'
import SignUp from './components/forms/signup'
import Login from './components/forms/login'
import AddProduct from './components/forms/AddProduct'
import Home from './components/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import AboutUs from './pages/AboutUs'
import './App.css'
import EnquiryButton from './components/EnquiryButton'
import EnquiryPopup from './components/EnquiryPopup'
import EditProduct from './components/forms/EditProduct'
import ForgotPassword from './components/forms/ForgotPassword'
import ContactUs from './pages/ContactUs'
import UserProfile from './pages/UserProfile'
import CurrentPurchase from './pages/CurrentPurchase'
import ProtectedRoute from './components/ProtectedRoute'
import AdminEnquiries from './pages/AdminEnquiries'
import AuthProvider from './components/AuthProvider'
import CartPage from './pages/CartPage'
import AdminPurchaseRequests from './pages/AdminPurchaseRequests'
import InvoicePage from './pages/InvoicePage'
import DeliveryForm from './components/forms/DeliveryForm'
import OrderSummary from './pages/OrderSummary'
import AuthPersist from './utils/Auth.persist'
import TermsAndConditions from './pages/TermsAndConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'
import InactiveProducts from './pages/InactiveProducts'

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <AuthPersist>
    <AuthProvider>
      <Routes>
        <Route path="/" element={
          <MainLayout>
            <Home />
            <EnquiryButton />
            {user && user.role !== "admin" && <EnquiryPopup />}
          </MainLayout>
        } />

        <Route path="/admin/enquiries" element={
          <ProtectedRoute requiredRole="admin">
            <AdminEnquiries />
          </ProtectedRoute>
        } />
        <Route path="/inactive-products" element={
          <ProtectedRoute requiredRole="admin">
            <MainLayout>
              <InactiveProducts />
            </MainLayout>
          </ProtectedRoute>
        }
        />
        <Route path="/products" element={
          <MainLayout>
            <Products />
          </MainLayout>
        } />
        <Route path="/product/:id" element={
          <MainLayout>
            <ProductDetails />
          </MainLayout>
        } />
        <Route path="/about" element={
          <MainLayout>
            <AboutUs />
          </MainLayout>
        } />      
        <Route path="/contact" element={
          <MainLayout>
            <ContactUs />
          </MainLayout>
        } />
        <Route path="/userProfile" element={
          <MainLayout>
            <UserProfile />
          </MainLayout>
        } />
        <Route path="/currentPurchase" element={
          <MainLayout>
            <CurrentPurchase />
          </MainLayout>
        } />
        <Route path="/cart" element={
          <MainLayout>
            <CartPage />
          </MainLayout>
        } />        
        <Route path="/purchaseRequests" element={
          <MainLayout>
            <AdminPurchaseRequests />
          </MainLayout>
        } />
        <Route path="/invoice" element={
          <MainLayout>
            <InvoicePage />
          </MainLayout>
        } />        
        <Route path="/terms" element={
          <MainLayout>
            <TermsAndConditions />
          </MainLayout>
        } />
        <Route path="/privacyPolicy" element={
          <MainLayout>
            <PrivacyPolicy />
          </MainLayout>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/editProduct" element={<EditProduct/>}/>
        <Route path="/editProduct/:id" element={<EditProduct />} />
        <Route path="/forgotPassword" element={<ForgotPassword/>}/>
        <Route path="/deliveryForm" element={<DeliveryForm/>}/>
        <Route path="/orderSummary" element={<OrderSummary/>}/>

      </Routes>
    </AuthProvider>
    </AuthPersist>
  )
}

export default App

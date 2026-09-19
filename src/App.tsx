import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MobileFrame } from './components/layout/MobileFrame';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignUpStep1Page from './pages/auth/SignUpStep1Page';
import SignUpStep2Page from './pages/auth/SignUpStep2Page';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Main Pages
import HomePage from './pages/main/HomePage';
import StallMenuPage from './pages/main/StallMenuPage';
import FoodItemDetailsPage from './pages/main/FoodItemDetailsPage';
import NotificationsPage from './pages/main/NotificationsPage';

// Order Pages
import CartPage from './pages/order/CartPage';
import PickupSlotPage from './pages/order/PickupSlotPage';
import CheckoutPage from './pages/order/CheckoutPage';
import PaymentPage from './pages/order/PaymentPage';
import PaymentStatusPage from './pages/order/PaymentStatusPage';
import OrderConfirmationPage from './pages/order/OrderConfirmationPage';
import OrderTrackingPage from './pages/order/OrderTrackingPage';
import OrderHistoryPage from './pages/order/OrderHistoryPage';
import OrderDetailsPage from './pages/order/OrderDetailsPage';

// User Pages
import ProfilePage from './pages/user/ProfilePage';
import EditProfilePage from './pages/user/EditProfilePage';

export default function App() {
  return (
    <Router>
      <MobileFrame>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpStep1Page />} />
          <Route path="/signup/password" element={<SignUpStep2Page />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/stall/:id" element={<StallMenuPage />} />
            <Route path="/item/:id" element={<FoodItemDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/pickup-slot" element={<PickupSlotPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-status" element={<PaymentStatusPage />} />
            <Route path="/order/confirmation" element={<OrderConfirmationPage />} />
            <Route path="/order/track" element={<OrderTrackingPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/order-details/:id" element={<OrderDetailsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </MobileFrame>
    </Router>
  );
}

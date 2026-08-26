import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { UserSelectionPage } from './pages/UserSelectionPage';
import { UnifiedAuthPage } from './pages/UnifiedAuthPage';
import { FarmerLoginPage } from './pages/farmer/FarmerLoginPage';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { FarmerMarketPrices } from './pages/farmer/FarmerMarketPrices';
import { FarmerCropPriceDetail } from './pages/farmer/FarmerCropPriceDetail';
import { FarmerMyCrops } from './pages/farmer/FarmerMyCrops';
import { FarmerAddCrop } from './pages/farmer/FarmerAddCrop';
import { FarmerRequirements } from './pages/farmer/FarmerRequirements';
import { FarmerRequirementDetail } from './pages/farmer/FarmerRequirementDetail';
import { FarmerOrders } from './pages/farmer/FarmerOrders';
import { FarmerOrderDetail } from './pages/farmer/FarmerOrderDetail';
import { FarmerNotifications } from './pages/farmer/FarmerNotifications';
import { FarmerProfile } from './pages/farmer/FarmerProfile';
import { FarmerHelp } from './pages/farmer/FarmerHelp';
import { BuyerLoginPage } from './pages/buyer/BuyerLoginPage';
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { BuyerFindCrops } from './pages/buyer/BuyerFindCrops';
import { BuyerRequirements } from './pages/buyer/BuyerRequirements';
import { BuyerCreateRequirement } from './pages/buyer/BuyerCreateRequirement';
import { BuyerRequirementDetail } from './pages/buyer/BuyerRequirementDetail';
import { BuyerOrders } from './pages/buyer/BuyerOrders';
import { BuyerOrderDetail } from './pages/buyer/BuyerOrderDetail';
import { BuyerPickupManagement } from './pages/buyer/BuyerPickupManagement';
import { BuyerPayment } from './pages/buyer/BuyerPayment';
import { BuyerProfile } from './pages/buyer/BuyerProfile';
import { BuyerNotifications } from './pages/buyer/BuyerNotifications';

export const App: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
    <Navbar />
    <main className="flex-1"><Routes>
      <Route path="/" element={<LandingPage />} /><Route path="/user-select" element={<UserSelectionPage />} /><Route path="/login" element={<UnifiedAuthPage />} /><Route path="/register" element={<UnifiedAuthPage />} />
      <Route path="/farmer/login" element={<FarmerLoginPage />} /><Route path="/farmer/register" element={<FarmerLoginPage />} /><Route path="/buyer/login" element={<BuyerLoginPage />} /><Route path="/buyer/register" element={<BuyerLoginPage />} />
      <Route element={<ProtectedRoute role="farmer" />}>
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} /><Route path="/farmer/market-prices" element={<FarmerMarketPrices />} /><Route path="/farmer/market-prices/:crop" element={<FarmerCropPriceDetail />} /><Route path="/farmer/crops" element={<FarmerMyCrops />} /><Route path="/farmer/crops/add" element={<FarmerAddCrop />} /><Route path="/farmer/requirements" element={<FarmerRequirements />} /><Route path="/farmer/requirements/:id" element={<FarmerRequirementDetail />} /><Route path="/farmer/orders" element={<FarmerOrders />} /><Route path="/farmer/orders/:id" element={<FarmerOrderDetail />} /><Route path="/farmer/notifications" element={<FarmerNotifications />} /><Route path="/farmer/profile" element={<FarmerProfile />} /><Route path="/farmer/help" element={<FarmerHelp />} />
      </Route>
      <Route element={<ProtectedRoute role="buyer" />}>
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} /><Route path="/buyer/find-crops" element={<BuyerFindCrops />} /><Route path="/buyer/requirements" element={<BuyerRequirements />} /><Route path="/buyer/requirements/create" element={<BuyerCreateRequirement />} /><Route path="/buyer/requirements/:id" element={<BuyerRequirementDetail />} /><Route path="/buyer/orders" element={<BuyerOrders />} /><Route path="/buyer/orders/:id" element={<BuyerOrderDetail />} /><Route path="/buyer/pickup/:id" element={<BuyerPickupManagement />} /><Route path="/buyer/payment/:id" element={<BuyerPayment />} /><Route path="/buyer/profile" element={<BuyerProfile />} /><Route path="/buyer/notifications" element={<BuyerNotifications />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></main><Footer /><MobileBottomNav />
  </div>
);
export default App;

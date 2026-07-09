import {
 BrowserRouter,
 Routes,
 Route
}
from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import FraudAlerts from "./pages/FraudAlerts";
import RiskyUsers from "./pages/RiskyUsers";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import FraudInvestigation from "./pages/FraudInvestigation";
import NetworkGraph from "./pages/NetworkGraph";
import MyBanking from "./pages/MyBanking";
import TransferMoney from "./pages/TransferMoney";
import History from "./pages/History";
import Investigations from "./pages/Investigations";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import AccessDenied from "./pages/AccessDenied";
import AdminDeposits from "./pages/AdminDeposits";


function App() {

 return (

  <BrowserRouter>

   <Routes>

    <Route
     path="/"
     element={<Login />}
    />

    <Route
     path="/dashboard"
     element={
        <ProtectedRoute roles={["ADMIN", "ANALYST"]}>
     <Dashboard />
        </ProtectedRoute>
     }
    />

    <Route
     path="/analytics"
     element={
        <ProtectedRoute roles={["ADMIN", "ANALYST"]}>
     <Analytics />
        </ProtectedRoute>
     }
    />

    <Route
     path="/fraud-alerts"
     element={
        <ProtectedRoute roles={["ADMIN", "ANALYST"]}>
     <FraudAlerts />
        </ProtectedRoute>
     }
    />

    <Route
     path="/risky-users"
     element={
        <ProtectedRoute roles={["ADMIN", "ANALYST"]}>
     <RiskyUsers />
        </ProtectedRoute>
     }
    />

    <Route
     path="/transactions"
     element={
        <ProtectedRoute roles={["ADMIN", "ANALYST"]}>
     <Transactions />
        </ProtectedRoute>
     }
    />

    <Route
     path="/profile"
     element={
        <ProtectedRoute roles={["ADMIN", "ANALYST", "CUSTOMER"]}>
     <Profile />
        </ProtectedRoute>
     }
    />
    <Route
     path="/fraud-investigation/:id"
     element={
        <ProtectedRoute roles={["ADMIN", "ANALYST"]}>
     <FraudInvestigation />
        </ProtectedRoute>
     }
    />
    <Route
     path="/network/:id"
     element={
        <ProtectedRoute roles={["ADMIN", "ANALYST"]}>
     <NetworkGraph />
        </ProtectedRoute>
     }
    />
    <Route
     path="/my-banking"
     element={
        <ProtectedRoute roles={["ADMIN", "ANALYST", "CUSTOMER"]}>
     <MyBanking />
        </ProtectedRoute>
     }
    />
    <Route
     path="/transfer"
     element={
        <ProtectedRoute roles={["ADMIN", "ANALYST", "CUSTOMER"]}>
     <TransferMoney />
        </ProtectedRoute>
     }
    />

    <Route
     path="/history"
     element={
        <ProtectedRoute roles={["ADMIN","CUSTOMER"]}>
     <History />
        </ProtectedRoute>
     }
    />

    <Route
     path="/investigations"
     element={
        <ProtectedRoute roles={["ADMIN", "ANALYST"]}>
     <Investigations />
        </ProtectedRoute>
     }
    />
    <Route
     path="/settings"
     element={
        <ProtectedRoute roles={["ADMIN", "ANALYST", "CUSTOMER"]}>
     <Settings />
        </ProtectedRoute>
     }
    />
    <Route
     path="/access-denied"
     element={<AccessDenied />}
    />
    <Route
     path="/admin/deposits"
     element={
        <ProtectedRoute roles={["ADMIN"]}>
     <AdminDeposits />
        </ProtectedRoute>
     }
    />
   </Routes>
   

  </BrowserRouter>

 );

}

export default App;
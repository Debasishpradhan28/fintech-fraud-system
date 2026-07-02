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
     element={<Dashboard />}
    />

    <Route
     path="/analytics"
     element={<Analytics />}
    />

    <Route
     path="/fraud-alerts"
     element={<FraudAlerts />}
    />

    <Route
     path="/risky-users"
     element={<RiskyUsers />}
    />

    <Route
     path="/transactions"
     element={<Transactions />}
    />

    <Route
     path="/profile"
     element={<Profile />}
    />
    <Route
     path="/fraud-investigation/:id"
     element={<FraudInvestigation />}
    />
    <Route
     path="/network/:id"
     element={<NetworkGraph />}
    />
    <Route
     path="/my-banking"
     element={<MyBanking />}
    />
    <Route
     path="/transfer"
     element={<TransferMoney />}
    />

    <Route
     path="/history"
     element={<History />}
    />

    <Route
     path="/investigations"
     element={<Investigations/>}
    />
    <Route
     path="/settings"
     element={<Settings />}
    />
    
   </Routes>

  </BrowserRouter>

 );

}

export default App;
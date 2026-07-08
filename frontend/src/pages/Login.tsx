import { useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const { setUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [showPassword,setShowPassword] =useState(false);
  const handleLogin = async () => {
  try {

    setLoading(true);

    const response = await api.post(
      "/auth/login",
      {
        email: email.trim(),
        password,
        deviceFingerprint: "Windows-Chrome",
        location: "Odisha"
      }
    );

    localStorage.setItem(
      "token",
      response.data.token
    );
    localStorage.setItem(
      "role",
      response.data.user.role
    );
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );
    setUser(response.data.user);
    const role = response.data.user.role;
    if (role === "CUSTOMER") {
      navigate("/profile", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  } catch (error : any) {

    alert(error?.response?.data?.message||"Login Failed");

    console.log(error);

  } finally {

    setLoading(false);
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsLogin(true);
  }
};
const handleRegister = async () => {

  try {
    if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
    }

    setLoading(true);

    await api.post(
      "/auth/register",
      {
        full_name: fullName.trim(),
        email: email.trim(),
        password
      }
    );

    alert("Registration Successful");

    setIsLogin(true);

  } catch(error : any) {
    alert(error?.response?.data?.message||"Registration Failed");
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white p-16 flex-col justify-center">

        <h1 className="text-5xl font-bold mb-6">
          🛡 TrustGuard AI
        </h1>

        <p className="text-xl text-slate-300 mb-8">
          Real-Time Financial Trust & Fraud Prevention Platform
        </p>

        <div className="space-y-4 text-lg">
          <div>✔ Behavioral Analytics</div>
          <div>✔ Device Intelligence</div>
          <div>✔ Trust Scoring</div>
          <div>✔ Fraud Monitoring</div>
          <div>✔ Risk Detection Engine</div>
        </div>

      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8"
        >

          <h2 className="text-3xl font-bold mb-6 text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          {/* Toggle */}

          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">

            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg transition ${
                isLogin
                  ? "bg-white shadow"
                  : ""
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg transition ${
                !isLogin
                  ? "bg-white shadow"
                  : ""
              }`}
            >
              Register
            </button>

          </div>

          {/* Form */}

          {!isLogin && (
            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded-xl p-3 mb-4"
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl p-3 mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl p-3 mb-4"
          />

          {!isLogin && (
            <input
               type="password"
               placeholder="Confirm Password"
               value={confirmPassword}
               onChange={(e)=>setConfirmPassword(e.target.value)}
                 className="w-full border rounded-xl p-3 mb-4"
            />
          )}

          <button
          onClick={
           isLogin
              ? handleLogin
           : handleRegister
             }
             disabled={loading}
             className="
    w-full
    bg-blue-600
    text-white
    p-3
    rounded-xl
    font-semibold
    hover:bg-blue-700
    transition
    disabled:opacity-50
  "
>
            {
            loading
            ? "Processing..."
            : isLogin
            ? "Login"
            : "Create Account"
            }
          </button>

        </motion.div>

      </div>

    </div>
  );
}

export default Login;
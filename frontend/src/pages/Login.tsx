import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Configuration for Idle Timeout (3 minutes)
const IDLE_TIMEOUT_MS = 3 * 60 * 1000;

// ==========================================
// Enterprise Slider Content with "Sketches"
// ==========================================
const SLIDES = [
  {
    title: "Secure. Intelligent. Frictionless.",
    desc: "Enterprise-grade identity verification and real-time fraud mitigation for modern financial ecosystems.",
    features: ["Zero-Trust Architecture", "Customer Ready Platform", "Real-time Anomaly Detection"],
    sketch: (
      <svg className="w-48 h-48 text-blue-500/20 mb-6" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="50" cy="50" r="40" strokeDasharray="4 4" className="animate-[spin_20s_linear_infinite]" />
        <circle cx="50" cy="50" r="30" strokeDasharray="8 4" className="animate-[spin_15s_linear_infinite_reverse]" />
        <path d="M50 35 L65 45 L65 60 L50 70 L35 60 L35 45 Z" fill="currentColor" fillOpacity="0.1" strokeWidth="2" />
        <circle cx="50" cy="52.5" r="5" fill="currentColor" />
      </svg>
    )
  },
  {
    title: "Command Center Dashboard",
    desc: "Global visibility into operational health. Monitor transaction flows, system alerts, and metrics.",
    features: ["Live Transaction Streaming", "Global Threat Mapping", "Automated Incident Triage"],
    sketch: (
      <svg className="w-48 h-48 text-blue-500/20 mb-6" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="10" y="20" width="50" height="30" rx="2" strokeDasharray="2 2" />
        <rect x="65" y="20" width="25" height="30" rx="2" fill="currentColor" fillOpacity="0.1" />
        <rect x="10" y="55" width="80" height="25" rx="2" />
        <path d="M15 70 L35 60 L55 65 L85 55" stroke="currentColor" strokeWidth="2" />
        <circle cx="35" cy="60" r="2" fill="currentColor" />
        <circle cx="55" cy="65" r="2" fill="currentColor" />
      </svg>
    )
  },
  {
    title: "Predictive Analytics Engine",
    desc: "Harness machine learning to visualize fraud velocity and dynamically adjust risk thresholds.",
    features: ["Velocity Trend Graphing", "Risk Distribution Modeling", "False-Positive Reduction"],
    sketch: (
      <svg className="w-48 h-48 text-blue-500/20 mb-6" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 90 L10 10 M10 90 L90 90" strokeWidth="2" strokeDasharray="4 4"/>
        <path d="M10 80 Q 30 80, 40 50 T 90 20" stroke="currentColor" strokeWidth="3" />
        <path d="M10 90 L10 80 Q 30 80, 40 50 T 90 20 L90 90 Z" fill="currentColor" fillOpacity="0.05" stroke="none" />
        <line x1="40" y1="50" x2="40" y2="90" strokeDasharray="2 2" />
        <circle cx="40" cy="50" r="3" fill="currentColor" />
      </svg>
    )
  },
  {
    title: "Deep-Dive Investigations",
    desc: "Map complex fraud rings using interactive node-based network graphs and AI analysis.",
    features: ["Entity Link Analysis", "AI Threat Summaries", "Transaction Flow Tracing"],
    sketch: (
      <svg className="w-48 h-48 text-blue-500/20 mb-6" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="30" y1="30" x2="70" y2="40" />
        <line x1="70" y1="40" x2="60" y2="70" />
        <line x1="60" y1="70" x2="30" y2="30" />
        <line x1="30" y1="30" x2="20" y2="60" />
        <line x1="60" y1="70" x2="80" y2="80" strokeDasharray="3 3"/>
        <circle cx="30" cy="30" r="6" fill="currentColor" fillOpacity="0.2" />
        <circle cx="70" cy="40" r="8" fill="currentColor" fillOpacity="0.4" />
        <circle cx="60" cy="70" r="5" />
        <circle cx="20" cy="60" r="4" />
        <circle cx="80" cy="80" r="3" />
      </svg>
    )
  },
  {
    title: "Secure Consumer Banking",
    desc: "A frictionless portal empowering customers to manage assets while protected by invisible security layers.",
    features: ["Biometric Device Binding", "Real-time Trust Scoring", "Protected Ledger History"],
    sketch: (
      <svg className="w-48 h-48 text-blue-500/20 mb-6" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="20" y="30" width="60" height="40" rx="4" strokeWidth="2" />
        <path d="M20 45 L80 45" strokeWidth="2" fill="currentColor" />
        <rect x="30" y="55" width="15" height="5" rx="1" />
        <rect x="50" y="55" width="10" height="5" rx="1" />
        <circle cx="80" cy="70" r="15" fill="#0f172a" stroke="none" />
        <path d="M75 70 A5 5 0 0 1 85 70 A8 8 0 0 1 72 70" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    )
  }
];

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  
  // UI States
  const [authMode, setAuthMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ==========================================
  // Slider Logic (Auto-play & Navigation)
  // ==========================================
  useEffect(() => {
    const timer: ReturnType<typeof setTimeout> = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000); 
    
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  // ==========================================
  // Security Feature: Inactivity Timeout
  // ==========================================
  const resetAuth = useCallback((message = "Session expired due to inactivity. Please start over.") => {
    setAuthMode("LOGIN");
    setStep(1);
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrorMsg(message);
    setLoading(false);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (step === 2 || email.length > 0) {
        timeoutId = setTimeout(() => resetAuth(), IDLE_TIMEOUT_MS);
      }
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer(); 

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [step, email, resetAuth]);

  // ==========================================
  // Handlers
  // ==========================================
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (authMode === "LOGIN" && !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    
    if (authMode === "REGISTER") {
      if (fullName.trim().length < 2) {
        setErrorMsg("Please enter your full legal name.");
        return;
      }
      if (!email.includes("@")) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
    }
    
    setStep(2);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
        deviceFingerprint: "Windows-Chrome", 
        location: "Odisha" 
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);

      if (response.data.user.role === "CUSTOMER") {
        navigate("/profile", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg("The credentials provided do not match our records.");
      setPassword(""); 
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        full_name: fullName.trim(),
        email: email.trim(),
        password
      });

      setAuthMode("LOGIN");
      setStep(1);
      setPassword("");
      setConfirmPassword("");
      setErrorMsg("");
      alert("Registration successful. Please log in."); 
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode: "LOGIN" | "REGISTER") => {
    setAuthMode(mode);
    setStep(1);
    setErrorMsg("");
    setPassword("");
    setConfirmPassword("");
  };

  const formSlideVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-blue-200">
      
      {/* ========================================== */}
      {/* Left Side: Dynamic Enterprise Slider     */}
      {/* ========================================== */}
      <div className="hidden lg:flex w-[45%] bg-[#0b1120] text-white p-12 xl:p-16 flex-col relative overflow-hidden">
        {/* Subtle background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none" />
        
        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3 mb-12 shrink-0">
          <svg className="w-9 h-9 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight">TrustGuard</h1>
        </div>

        {/* Dynamic Slide Content - FIXED OVERLAP BUG */}
        <div className="relative z-10 flex-1 flex flex-col justify-center min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              {/* Technical Sketch Graphic */}
              {SLIDES[currentSlide].sketch}

              <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6 tracking-tight">
                {SLIDES[currentSlide].title.split('. ').map((part, i, arr) => (
                  <span key={i}>
                    {part}{i !== arr.length - 1 ? '. ' : ''}
                    {i !== arr.length - 1 && <br/>}
                  </span>
                ))}
              </h2>
              
              <p className="text-lg text-slate-400 mb-10 max-w-md leading-relaxed">
                {SLIDES[currentSlide].desc}
              </p>

              <div className="space-y-4 text-slate-300">
                {SLIDES[currentSlide].features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-1 rounded-full shrink-0">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Controls: Pagination & Arrows - No longer floating over text */}
        <div className="relative z-10 flex items-center justify-between pt-8 mt-auto border-t border-slate-800/50 shrink-0">
          {/* Pagination Dots */}
          <div className="flex gap-2">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-blue-500 w-8" : "bg-slate-700 w-2 hover:bg-slate-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-3">
            <button 
              onClick={prevSlide}
              className="p-2.5 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={nextSlide}
              className="p-2.5 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* Right Side: Auth Flow                    */}
      {/* ========================================== */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-[420px]">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 sm:p-10 border border-slate-100"
          >
            {/* Header & Back Button */}
            <div className="mb-8 relative">
              {step === 2 && (
                <button 
                  onClick={() => setStep(1)}
                  className="absolute -left-2 -top-2 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              <h2 className="text-2xl font-bold text-slate-900 text-center">
                {authMode === "LOGIN" 
                  ? (step === 1 ? "Sign In to TrustGuard" : "Enter Password") 
                  : (step === 1 ? "Create Account" : "Secure Your Account")}
              </h2>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-3"
              >
                <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMsg}
              </motion.div>
            )}

            {/* Form Steps */}
            <form onSubmit={step === 1 ? handleNextStep : (authMode === "LOGIN" ? handleLogin : handleRegister)}>
              <AnimatePresence mode="wait">
                
                {/* STEP 1: IDENTIFIER */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={formSlideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {authMode === "REGISTER" && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Legal Full Name</label>
                        <input
                          autoFocus
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all bg-slate-50 focus:bg-white"
                          placeholder="John Doe"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input
                        autoFocus={authMode === "LOGIN"}
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all bg-slate-50 focus:bg-white"
                        placeholder="john.doe@example.com"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0b1120] text-white p-4 rounded-xl font-semibold hover:bg-slate-800 transition-colors mt-2"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}

                {/* STEP 2: CREDENTIALS */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={formSlideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {authMode === "LOGIN" && (
                      <div className="text-sm font-medium text-slate-500 text-center mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {email}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                      <div className="relative">
                        <input
                          autoFocus
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl p-3.5 pr-12 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all bg-slate-50 focus:bg-white"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.71-1.593c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" /></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {authMode === "REGISTER" && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all bg-slate-50 focus:bg-white"
                          placeholder="••••••••"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Authenticating...
                        </>
                      ) : (
                        authMode === "LOGIN" ? "Secure Login" : "Create Account"
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Bottom Toggle */}
            {step === 1 && (
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500">
                  {authMode === "LOGIN" ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={() => switchMode(authMode === "LOGIN" ? "REGISTER" : "LOGIN")}
                    className="ml-2 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {authMode === "LOGIN" ? "Open Account" : "Sign In"}
                  </button>
                </p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Login;
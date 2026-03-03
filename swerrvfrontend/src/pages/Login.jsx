import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const { login, register, googleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (isLogin) {
            const success = await login(formData.email, formData.password);
            if (success) {
                if (formData.email === 'admin@swerrv.com') {
                    navigate('/admin');
                } else {
                    navigate(from, { replace: true });
                }
            }
        } else {
            const success = await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });
            if (success) {
                setIsLogin(true);
            }
        }
        setIsLoading(false);
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        // credentialResponse.credential is the Google ID token
        const success = await googleLogin(credentialResponse.credential);
        if (success) {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center px-6 overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60 mix-blend-screen"
                >
                    <source src="/images/logovideo.mov" type="video/mp4" />
                </video>
                {/* Overlay gradient to ensure form readability if needed */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <motion.div
                className="w-full max-w-[280px] sm:max-w-[320px] bg-grey-900/90 backdrop-blur-md border border-white/[0.08] p-5 sm:p-6 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="text-center mb-5">
                    <h1 className="text-2xl font-black tracking-tight mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-grey-500 text-sm">
                        {isLogin ? 'Enter your details to access your account.' : 'Join Swerrv to start shopping.'}
                    </p>
                </div>

                {/* Google Sign-In */}
                <div className="flex justify-center mb-4">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => { }}
                        theme="filled_black"
                        shape="rectangular"
                        size="large"
                        width="270"
                        text={isLogin ? 'signin_with' : 'signup_with'}
                    />
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-grey-500 text-xs font-semibold tracking-widest uppercase">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">First Name</label>
                                <div className="relative">
                                    <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-500" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        placeholder="John"
                                        className="form-input pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Doe"
                                    className="form-input"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">Email</label>
                        <div className="relative">
                            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-500" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="you@email.com"
                                className="form-input pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">Password</label>
                        <div className="relative">
                            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-500" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="form-input pl-10"
                            />
                        </div>
                    </div>

                    {isLogin && (
                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-xs text-grey-500 hover:text-white transition-colors uppercase tracking-wider font-bold"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-sm py-2"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </form>

                <div className="mt-4 text-center text-xs text-grey-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-white font-bold hover:text-accent transition-colors"
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

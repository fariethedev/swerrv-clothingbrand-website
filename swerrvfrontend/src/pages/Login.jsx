import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiEye, HiEyeOff, HiPlus } from 'react-icons/hi';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const SLIDE_IMAGES = [
    '/images/_DSC8289.jpg',
    '/images/_DSC8164.jpg',
    '/images/_DSC8141.jpg',
    '/images/_DSC8438.jpg',
    '/images/_DSC8415.jpg',
];

const SLIDE_CAPTIONS = [
    'Wear the Movement.',
    'Style Without Limits.',
    'Crafted for the Streets.',
    'Bold. Clean. Swerrv.',
    'Dress Your Story.',
];

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '',
        retypePassword: '', dateOfBirth: '', address: '', profilePictureUrl: '',
        addressLine1: '', addressLine2: '', city: '', state: '', zip: '', country: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRetypePassword, setShowRetypePassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePictureUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const { login, register, googleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    // Auto-advance slides every 4 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % SLIDE_IMAGES.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLogin && !agreeTerms) return;
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
            if (formData.password !== formData.retypePassword) {
                alert("Passwords do not match!");
                setIsLoading(false);
                return;
            }
            if (!formData.addressLine1 || !formData.city || !formData.country) {
                alert("Please provide the required address fields");
                setIsLoading(false);
                return;
            }

            const combinedAddress = [
                formData.addressLine1,
                formData.addressLine2,
                formData.city,
                formData.state,
                formData.zip,
                formData.country
            ].filter(Boolean).join(', ');

            const success = await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                dateOfBirth: formData.dateOfBirth,
                address: combinedAddress,
                profilePictureUrl: formData.profilePictureUrl
            });
            if (success) {
                setIsLogin(true);
            }
        }
        setIsLoading(false);
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const success = await googleLogin(credentialResponse.credential);
        if (success) {
            navigate(from, { replace: true });
        }
    };

    const switchMode = (toLogin) => {
        setIsLogin(toLogin);
        setFormData({
            firstName: '', lastName: '', email: '', password: '',
            retypePassword: '', dateOfBirth: '', address: '', profilePictureUrl: '',
            addressLine1: '', addressLine2: '', city: '', state: '', zip: '', country: ''
        });
        setShowPassword(false);
        setShowRetypePassword(false);
        setAgreeTerms(false);
    };

    return (
        <div className="auth-page">
            {/* ===== LEFT PANEL — Image Carousel ===== */}
            <div className="auth-left">
                {/* Slides */}
                {SLIDE_IMAGES.map((img, i) => (
                    <div
                        key={img}
                        className={`auth-slide ${i === currentSlide ? 'auth-slide--active' : ''}`}
                        style={{ backgroundImage: `url(${img})` }}
                    />
                ))}

                {/* Dark gradient overlay for readability */}
                <div className="auth-left-overlay" />

                {/* Top bar: logo + back link */}
                <div className="auth-left-topbar">
                    <Link to="/" className="auth-logo">
                        <img src="/images/swerrve_logo_white.png" alt="Swerrv" className="auth-logo-img" />
                    </Link>
                    <Link to="/" className="auth-back-btn">
                        Back to website <span>&rarr;</span>
                    </Link>
                </div>

                {/* Bottom: tagline + dots */}
                <div className="auth-left-bottom">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentSlide}
                            className="auth-caption"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                        >
                            {SLIDE_CAPTIONS[currentSlide]}
                        </motion.p>
                    </AnimatePresence>

                    {/* Dot indicators */}
                    <div className="auth-dots">
                        {SLIDE_IMAGES.map((_, i) => (
                            <button
                                key={i}
                                className={`auth-dot ${i === currentSlide ? 'auth-dot--active' : ''}`}
                                onClick={() => setCurrentSlide(i)}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== RIGHT PANEL — Form ===== */}
            <div className="auth-right">
                <motion.div
                    className="auth-form-container"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'register'}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.35 }}
                        >
                            {/* Heading */}
                            <h1 className="auth-title">
                                {isLogin ? 'Welcome back' : 'Create an account'}
                            </h1>
                            <p className="auth-subtitle">
                                {isLogin ? (
                                    <>
                                        Don't have an account?{' '}
                                        <button className="auth-switch-link" onClick={() => switchMode(false)}>Sign up</button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{' '}
                                        <button className="auth-switch-link" onClick={() => switchMode(true)}>Log in</button>
                                    </>
                                )}
                            </p>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="auth-form" noValidate>
                                {/* Name row – register only */}
                                {!isLogin && (
                                    <div className="auth-row">
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="First name"
                                            required
                                            className="auth-input"
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Last name"
                                            className="auth-input"
                                        />
                                    </div>
                                )}

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    className="auth-input"
                                />

                                <div className="auth-input-wrap">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        className="auth-input"
                                        minLength="6"
                                    />
                                    <button
                                        type="button"
                                        className="auth-eye-btn"
                                        onClick={() => setShowPassword(v => !v)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <HiEyeOff /> : <HiEye />}
                                    </button>
                                </div>

                                {!isLogin && (
                                    <>
                                        <div className="auth-input-wrap">
                                            <input
                                                type={showRetypePassword ? 'text' : 'password'}
                                                name="retypePassword"
                                                value={formData.retypePassword}
                                                onChange={handleChange}
                                                placeholder="Retype password"
                                                required
                                                className="auth-input"
                                            />
                                            <button
                                                type="button"
                                                className="auth-eye-btn"
                                                onClick={() => setShowRetypePassword(v => !v)}
                                                tabIndex={-1}
                                            >
                                                {showRetypePassword ? <HiEyeOff /> : <HiEye />}
                                            </button>
                                        </div>

                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            required
                                            className="auth-input"
                                            style={{ color: formData.dateOfBirth ? 'inherit' : 'gray' }}
                                        />

                                        <input
                                            type="text"
                                            name="addressLine1"
                                            value={formData.addressLine1}
                                            onChange={handleChange}
                                            placeholder="Address Line 1"
                                            required
                                            className="auth-input"
                                        />

                                        <input
                                            type="text"
                                            name="addressLine2"
                                            value={formData.addressLine2}
                                            onChange={handleChange}
                                            placeholder="Apartment, suite, etc. (optional)"
                                            className="auth-input"
                                        />

                                        <div className="auth-row">
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="City"
                                                required
                                                className="auth-input"
                                            />
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                placeholder="State / Province"
                                                required
                                                className="auth-input"
                                            />
                                        </div>

                                        <div className="auth-row">
                                            <input
                                                type="text"
                                                name="zip"
                                                value={formData.zip}
                                                onChange={handleChange}
                                                placeholder="ZIP / Postal code"
                                                required
                                                className="auth-input"
                                            />
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                placeholder="Country / Region"
                                                required
                                                className="auth-input"
                                            />
                                        </div>

                                        <div className="auth-input-wrap" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                                            <label style={{ fontSize: '12px', color: '#999', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Profile Picture (Optional)</label>
                                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginTop: '8px' }}>
                                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '1px dashed rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                                    {formData.profilePictureUrl ? (
                                                        <img src={formData.profilePictureUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <HiPlus size={24} color="#888" />
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>
                                                        {formData.profilePictureUrl ? 'Change picture' : 'Upload a picture'}
                                                    </span>
                                                    <span style={{ fontSize: '11px', color: '#666' }}>JPG, PNG or GIF</span>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Forgot password – login only */}
                                {isLogin && (
                                    <div className="auth-forgot-wrap">
                                        <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
                                    </div>
                                )}

                                {/* Terms – register only */}
                                {!isLogin && (
                                    <label className="auth-terms">
                                        <input
                                            type="checkbox"
                                            checked={agreeTerms}
                                            onChange={e => setAgreeTerms(e.target.checked)}
                                            className="auth-checkbox"
                                        />
                                        <span>
                                            I agree to the{' '}
                                            <Link to="/terms" className="auth-terms-link">Terms &amp; Conditions</Link>
                                        </span>
                                    </label>
                                )}

                                <button
                                    type="submit"
                                    className="auth-submit-btn"
                                    disabled={isLoading || (!isLogin && !agreeTerms)}
                                >
                                    {isLoading ? (
                                        <span className="auth-spinner" />
                                    ) : (
                                        isLogin ? 'Sign in' : 'Create account'
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="auth-divider">
                                <span className="auth-divider-line" />
                                <span className="auth-divider-text">Or register with</span>
                                <span className="auth-divider-line" />
                            </div>

                            {/* Social buttons */}
                            {/* Social buttons */}
                            <div className="auth-social-row" style={{ gridTemplateColumns: '1fr' }}>
                                {/* Google */}
                                <div className="auth-social-btn-wrap">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => { }}
                                        theme="filled_black"
                                        shape="rectangular"
                                        size="large"
                                        text={isLogin ? 'signin_with' : 'signup_with'}
                                    />
                                </div>
                            </div>

                            <div className="auth-social-row" style={{ marginTop: '12px' }}>
                                {/* Facebook placeholder */}
                                <button className="auth-social-btn" type="button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                    <svg viewBox="0 0 24 24" className="auth-social-icon" fill="currentColor">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63 1.562-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                    </svg>
                                    Facebook
                                </button>

                                {/* Apple placeholder */}
                                <button className="auth-social-btn" type="button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                    <svg viewBox="0 0 24 24" className="auth-social-icon" fill="currentColor">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                    Apple
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;

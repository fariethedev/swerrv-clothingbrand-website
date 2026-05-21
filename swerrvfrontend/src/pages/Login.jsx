import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiEye, HiEyeOff, HiPlus, HiCheck, HiX } from 'react-icons/hi';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRequirements = [
    { id: 'length', text: 'At least 8 characters', regex: /.{8,}/ },
    { id: 'uppercase', text: 'One uppercase letter', regex: /[A-Z]/ },
    { id: 'lowercase', text: 'One lowercase letter', regex: /[a-z]/ },
    { id: 'number', text: 'One number', regex: /[0-9]/ },
    { id: 'special', text: 'One special character (@$!%*?&)', regex: /[@$!%*?&]/ }
];

const getPasswordStrength = (password) => {
    let count = 0;
    passwordRequirements.forEach(req => {
        if (req.regex.test(password)) count++;
    });
    return count;
};

const getStrengthColor = (strength) => {
    if (strength === 0) return 'transparent';
    if (strength <= 2) return '#ef4444'; // Red
    if (strength <= 4) return '#eab308'; // Yellow
    return '#22c55e'; // Green
};

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
    const [registerStep, setRegisterStep] = useState(0);
    const [direction, setDirection] = useState(1);
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

    const [emailError, setEmailError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);

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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'email') {
            if (value && !emailRegex.test(value)) {
                setEmailError('Please enter a valid email address');
            } else {
                setEmailError('');
            }
        }
        
        if (name === 'password' && !isLogin) {
            setPasswordStrength(getPasswordStrength(value));
        }
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (registerStep === 0) {
            if (!emailRegex.test(formData.email)) {
                setEmailError('Please enter a valid email address');
                return;
            }
            if (formData.password.length < 8) {
                alert('Password must be at least 8 characters long.');
                return;
            }
            if (formData.password !== formData.retypePassword) {
                alert('Passwords do not match.');
                return;
            }
            if (passwordStrength < 5) {
                alert('Please meet all password requirements.');
                return;
            }
        } else if (registerStep === 1) {
            if (!formData.firstName.trim() || !formData.lastName.trim()) {
                alert('Please enter your first and last name.');
                return;
            }
            if (!formData.dateOfBirth) {
                alert('Please select your date of birth.');
                return;
            }
        }
        
        setDirection(1);
        setRegisterStep(prev => prev + 1);
    };

    const handleBackStep = () => {
        setDirection(-1);
        setRegisterStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isLogin) {
            if (!emailRegex.test(formData.email)) {
                setEmailError('Please enter a valid email address');
                return;
            }
            setIsLoading(true);
            const success = await login(formData.email, formData.password);
            if (success) {
                if (formData.email === 'admin@swerrv.com') {
                    navigate('/admin');
                } else {
                    navigate(from, { replace: true });
                }
            }
            setIsLoading(false);
        } else {
            // Final submission
            if (!formData.addressLine1 || !formData.city || !formData.state || !formData.zip || !formData.country) {
                alert("Please provide the required address fields");
                return;
            }
            if (!agreeTerms) {
                alert("You must agree to the Terms & Conditions.");
                return;
            }

            setIsLoading(true);
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
                switchMode(true);
            }
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const success = await googleLogin(credentialResponse.credential);
        if (success) {
            navigate(from, { replace: true });
        }
    };

    const switchMode = (toLogin) => {
        setIsLogin(toLogin);
        setRegisterStep(0);
        setDirection(1);
        setFormData({
            firstName: '', lastName: '', email: '', password: '',
            retypePassword: '', dateOfBirth: '', address: '', profilePictureUrl: '',
            addressLine1: '', addressLine2: '', city: '', state: '', zip: '', country: ''
        });
        setShowPassword(false);
        setShowRetypePassword(false);
        setAgreeTerms(false);
    };

    const stepVariants = {
        enter: (dir) => ({
            x: dir > 0 ? 150 : -150,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (dir) => ({
            x: dir < 0 ? 150 : -150,
            opacity: 0
        })
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
                {/* Mobile Header (Visible only when auth-left is hidden) */}
                <div className="auth-mobile-header">
                    <Link to="/" className="auth-logo">
                        <img src="/images/swerrve_logo_white.png" alt="Swerrv" className="auth-logo-img" />
                    </Link>
                    <Link to="/" className="auth-back-btn">
                        Back <span>&rarr;</span>
                    </Link>
                </div>

                <motion.div
                    className="auth-form-container"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    {/* Progress Indicator for Sign Up */}
                    {!isLogin && (
                        <div className="auth-progress-container">
                            <div className="auth-progress-track">
                                <div 
                                    className="auth-progress-fill"
                                    style={{ width: `${((registerStep + 1) / 3) * 100}%` }}
                                />
                            </div>
                            <div className="auth-progress-labels">
                                <span className={registerStep >= 0 ? 'active' : ''}>Account</span>
                                <span className={registerStep >= 1 ? 'active' : ''}>Profile</span>
                                <span className={registerStep >= 2 ? 'active' : ''}>Address</span>
                            </div>
                        </div>
                    )}

                    {/* Form title & subtitle */}
                    <div className="auth-header-block">
                        <h1 className="auth-title">
                            {isLogin ? 'Welcome back' : 'Create account'}
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
                    </div>

                    <div className="auth-form-body-wrapper">
                        {isLogin ? (
                            /* ===== LOGIN FORM ===== */
                            <form onSubmit={handleSubmit} className="auth-form" noValidate>
                                <div className="auth-input-wrap">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        required
                                        className={`auth-input ${emailError ? 'error' : ''}`}
                                    />
                                </div>
                                <AnimatePresence>
                                    {emailError && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="auth-error-msg"
                                        >
                                            {emailError}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="auth-input-wrap">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        className="auth-input"
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

                                <div className="auth-forgot-wrap">
                                    <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
                                </div>

                                <button
                                    type="submit"
                                    className="auth-submit-btn"
                                    disabled={isLoading || !formData.email || !formData.password}
                                >
                                    {isLoading ? <span className="auth-spinner" /> : 'Sign in'}
                                </button>

                                {/* Divider */}
                                <div className="auth-divider">
                                    <span className="auth-divider-line" />
                                    <span className="auth-divider-text">Or</span>
                                    <span className="auth-divider-line" />
                                </div>

                                {/* Social Login */}
                                <div className="auth-social-row">
                                    <div className="auth-social-btn-wrap">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={() => { }}
                                            theme="filled_black"
                                            shape="rectangular"
                                            size="large"
                                            text="signin_with"
                                        />
                                    </div>
                                </div>
                            </form>
                        ) : (
                            /* ===== MULTI-STEP REGISTER FORM (Horizontal Flow) ===== */
                            <form onSubmit={handleSubmit} className="auth-form" noValidate>
                                <div className="auth-step-overflow-container">
                                    <AnimatePresence mode="wait" custom={direction}>
                                        <motion.div
                                            key={registerStep}
                                            custom={direction}
                                            variants={stepVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                                            className="auth-step-slide"
                                        >
                                            {/* STEP 1: Account Setup */}
                                            {registerStep === 0 && (
                                                <div className="auth-step-content">
                                                    <div className="auth-input-wrap">
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            placeholder="Email"
                                                            required
                                                            className={`auth-input ${emailError ? 'error' : ''}`}
                                                        />
                                                    </div>
                                                    <AnimatePresence>
                                                        {emailError && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="auth-error-msg"
                                                            >
                                                                {emailError}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    <div className="auth-input-wrap">
                                                        <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            name="password"
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                            placeholder="Create password"
                                                            required
                                                            className="auth-input"
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

                                                    {formData.password && (
                                                        <div className="auth-strength-meter">
                                                            <div className="auth-strength-bar">
                                                                <div 
                                                                    className="auth-strength-fill" 
                                                                    style={{ 
                                                                        width: `${(passwordStrength / 5) * 100}%`,
                                                                        backgroundColor: getStrengthColor(passwordStrength)
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="auth-strength-labels">
                                                                {passwordRequirements.map((req, idx) => {
                                                                    const isValid = req.regex.test(formData.password);
                                                                    return (
                                                                        <div key={idx} className={`auth-strength-label ${isValid ? 'valid' : ''}`}>
                                                                            <span className="auth-strength-icon">
                                                                                {isValid ? <HiCheck size={12} /> : <HiX size={12} />}
                                                                            </span>
                                                                            {req.text}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

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

                                                    <button
                                                        type="button"
                                                        className="auth-submit-btn"
                                                        onClick={handleNextStep}
                                                        disabled={!formData.email || !formData.password || !formData.retypePassword || passwordStrength < 5 || formData.password !== formData.retypePassword}
                                                    >
                                                        Continue
                                                    </button>
                                                </div>
                                            )}

                                            {/* STEP 2: Profile Info */}
                                            {registerStep === 1 && (
                                                <div className="auth-step-content">
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
                                                            required
                                                            className="auth-input"
                                                        />
                                                    </div>

                                                    <div className="auth-input-wrap">
                                                        <input
                                                            type="date"
                                                            name="dateOfBirth"
                                                            value={formData.dateOfBirth}
                                                            onChange={handleChange}
                                                            required
                                                            className="auth-input"
                                                            style={{ color: formData.dateOfBirth ? 'white' : '#666' }}
                                                        />
                                                    </div>

                                                    <div className="auth-upload-box">
                                                        <label className="upload-label">Profile Image (Optional)</label>
                                                        <div className="upload-content-wrapper">
                                                            <div className="avatar-preview">
                                                                {formData.profilePictureUrl ? (
                                                                    <img src={formData.profilePictureUrl} alt="Preview" />
                                                                ) : (
                                                                    <HiPlus size={20} color="#666" />
                                                                )}
                                                            </div>
                                                            <div className="upload-meta">
                                                                <span className="upload-title">
                                                                    {formData.profilePictureUrl ? 'Change image' : 'Choose image'}
                                                                </span>
                                                                <span className="upload-subtitle">JPG, PNG or GIF</span>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageUpload}
                                                                className="file-input-hidden"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="auth-navigation-row">
                                                        <button type="button" className="auth-back-nav-btn" onClick={handleBackStep}>
                                                            Back
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="auth-submit-btn inline"
                                                            onClick={handleNextStep}
                                                            disabled={!formData.firstName || !formData.lastName || !formData.dateOfBirth}
                                                        >
                                                            Continue
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* STEP 3: Shipping Address */}
                                            {registerStep === 2 && (
                                                <div className="auth-step-content">
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
                                                            placeholder="State"
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
                                                            placeholder="ZIP / Postal Code"
                                                            required
                                                            className="auth-input"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="country"
                                                            value={formData.country}
                                                            onChange={handleChange}
                                                            placeholder="Country"
                                                            required
                                                            className="auth-input"
                                                        />
                                                    </div>

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

                                                    <div className="auth-navigation-row">
                                                        <button type="button" className="auth-back-nav-btn" onClick={handleBackStep}>
                                                            Back
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="auth-submit-btn inline"
                                                            disabled={isLoading || !agreeTerms || !formData.addressLine1 || !formData.city || !formData.state || !formData.zip || !formData.country}
                                                        >
                                                            {isLoading ? <span className="auth-spinner" /> : 'Create Account'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { api } from '../services/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI State
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.requestPasswordReset(email);
            toast.success("If an account exists, a code was sent to your email.");
            setStep(2);
        } catch (error) {
            toast.error(error.message || "Failed to request code");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match!");
        }
        if (newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters.");
        }
        if (token.length !== 6) {
            return toast.error("Reset code must be exactly 6 digits.");
        }

        setLoading(true);
        try {
            await api.resetPassword(email, token, newPassword);
            toast.success("Password reset successfully! You can now log in.");
            navigate('/login');
        } catch (error) {
            toast.error(error.message || "Failed to reset password. Check your code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-black flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#111] p-8 rounded-2xl border border-white/[0.08]"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">
                        {step === 1 ? 'Forgot Password' : 'Reset Password'}
                    </h1>
                    <p className="text-grey-300">
                        {step === 1
                            ? "Enter your email to receive a 6-digit reset code."
                            : "Enter the code sent to your email and your new password."}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleRequestCode} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-grey-300 mb-2 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 uppercase tracking-wider font-bold disabled:opacity-50"
                        >
                            {loading ? 'Sending Code...' : 'Send Reset Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-grey-300 mb-2 uppercase tracking-wider">6-Digit Code</label>
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                                required
                                maxLength={6}
                                placeholder="123456"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-grey-300 mb-2 uppercase tracking-wider">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-300 hover:text-white transition-colors z-10"
                                    tabIndex={-1}
                                >
                                    {showNewPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-grey-300 mb-2 uppercase tracking-wider">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-300 hover:text-white transition-colors z-10"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 uppercase tracking-wider font-bold disabled:opacity-50"
                        >
                            {loading ? 'Resetting...' : 'Update Password'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-grey-300 hover:text-white transition-colors">
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;

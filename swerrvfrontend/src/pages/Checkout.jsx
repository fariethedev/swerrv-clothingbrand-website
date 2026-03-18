import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheck, HiLockClosed, HiArrowLeft } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripeKey = (import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51RvGIWK8ke7t62uB0k3SMqKjZaQZjzTgZiqF1Z2uUxXSPUu1WrLzORNrogpYAkhl3HAH4dauUI0ktMzLwEBTysi5008wDTmJuL').trim();
const stripePromise = loadStripe(stripeKey);


const StripePaymentForm = ({ onPaymentSuccess, onBack, amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + '/order-success',
            },
            redirect: 'if_required',
        });

        if (error) {
            toast.error(error.message || "Payment failed");
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Payment succeeded, pass the ID back up
            await onPaymentSuccess(paymentIntent.id);
        } else {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handlePayment} className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-xs text-white/50 bg-white/5 border border-white/10 px-4 py-2.5">
                <HiLockClosed size={14} /> Secured with 256-bit SSL encryption
            </div>

            <div className="p-4 bg-black border border-white/10">
                <PaymentElement options={{ layout: 'tabs' }} />
            </div>

            <div className="flex gap-4 justify-between mt-4">
                <button type="button" className="btn-secondary flex items-center gap-2" onClick={onBack} disabled={isProcessing}>
                    <HiArrowLeft size={16} /> Back
                </button>
                <button type="submit" disabled={isProcessing || !stripe} className="btn-primary flex-1 disabled:opacity-70 flex justify-center items-center">
                    {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                        `Pay ${amount.toFixed(2)} zł`
                    )}
                </button>
            </div>
        </form>
    );
};

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { currency, formatPrice } = useCurrency();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [clientSecret, setClientSecret] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Address Selection State
    const [selectedAddressType, setSelectedAddressType] = useState('primary');

    const [form, setForm] = useState({
        firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '', phone: '',
        address: user?.address || '', city: '', state: '', zip: '', country: 'Poland',
    });

    if (cartItems.length === 0 && step < 3) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-[70px]">
            <h2 className="text-2xl font-bold">Your bag is empty</h2>
            <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
    );

    const isLublin = form.city.trim().toLowerCase() === 'lublin';
    const shipping = isLublin ? 0 : 8.99;
    const total = cartTotal + shipping;

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleProceedToPayment = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // 1. Init Payment Intent (Cart is automatically synced via CartContext)
            const intentResponse = await api.createPaymentIntent(currency);
            if (intentResponse && intentResponse.clientSecret) {
                setClientSecret(intentResponse.clientSecret);
                setStep(2);
            } else {
                toast.error("Failed to initialize payment.");
            }
        } catch (error) {
            toast.error(error.message || 'Failed to sync cart and prepare payment.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateOrder = async (paymentIntentId) => {
        try {
            const orderData = {
                shippingAddress: {
                    fullName: `${form.firstName} ${form.lastName}`,
                    addressLine1: form.address,
                    addressLine2: "",
                    city: form.city,
                    state: form.state,
                    zipCode: form.zip,
                    country: form.country,
                    phone: form.phone
                },
                paymentMethod: 'card',
                paymentIntentId: paymentIntentId,
            };

            const createdOrder = await api.createOrder(orderData);
            clearCart();
            // Pass the entire order object so the success page can show tracking info
            navigate('/order-success', { state: { order: createdOrder } });
        } catch (error) {
            toast.error(error.message || 'Failed to finish placing order');
        }
    };

    const handleAddressSelection = (type) => {
        setSelectedAddressType(type);
        if (type === 'primary' && user?.address) {
            setForm(prev => ({ ...prev, address: user.address }));
        } else if (type === 'secondary' && user?.secondAddress) {
            setForm(prev => ({ ...prev, address: user.secondAddress }));
        }
    };

    const steps = ['Shipping', 'Payment & Review'];

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <div className="border-b border-white/[0.08] px-6 py-5 flex flex-wrap items-center justify-between gap-4 max-w-[1200px] mx-auto">
                <Link to="/" className="text-xl font-black tracking-[0.12em]">SWERRV</Link>
                <div className="flex items-center gap-2">
                    {steps.map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`flex items-center gap-2 text-xs font-semibold tracking-wider uppercase ${step > i ? 'text-white' : step === i + 1 ? 'text-white' : 'text-grey-500'}`}>
                                <div className={`w-6 h-6 rounded-none flex items-center justify-center text-xs font-bold ${step > i + 1 ? 'bg-white text-black' : step === i + 1 ? 'bg-white text-black' : 'bg-white/10'}`}>
                                    {step > i + 1 ? <HiCheck size={12} /> : i + 1}
                                </div>
                                <span className="hidden sm:block">{s}</span>
                            </div>
                            {i < steps.length - 1 && <div className={`w-12 h-px ${step > i + 1 ? 'bg-white' : 'bg-grey-700'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">

                {/* Form & Payment Flow */}
                <div className="flex flex-col gap-8">
                    <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>

                        {/* Use CSS to hide/show steps instead of completely unmounting Step 2 which contains Stripe Elements */}
                        <div className={step === 1 ? 'block' : 'hidden'}>
                            <form onSubmit={handleProceedToPayment} className="flex flex-col gap-5">
                                <h2 className="text-2xl font-black tracking-tight">Shipping Information</h2>

                                {/* Saved Address Selection */}
                                {user && (user.address || user.secondAddress) && (
                                    <div className="flex gap-4 mb-4">
                                        {user.address && (
                                            <button
                                                type="button"
                                                onClick={() => handleAddressSelection('primary')}
                                                className={`flex-1 p-3 border text-left text-xs uppercase tracking-widest font-bold transition-colors ${selectedAddressType === 'primary' ? 'border-white bg-white/10 text-white' : 'border-white/10 text-grey-500 hover:border-white/30'}`}
                                            >
                                                Primary Address
                                            </button>
                                        )}
                                        {user.secondAddress && (
                                            <button
                                                type="button"
                                                onClick={() => handleAddressSelection('secondary')}
                                                className={`flex-1 p-3 border text-left text-xs uppercase tracking-widest font-bold transition-colors ${selectedAddressType === 'secondary' ? 'border-white bg-white/10 text-white' : 'border-white/10 text-grey-500 hover:border-white/30'}`}
                                            >
                                                Secondary Address
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">First Name</label><input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="John" className="form-input" /></div>
                                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">Last Name</label><input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Doe" className="form-input" /></div>
                                </div>
                                <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">Email</label><input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" className="form-input" /></div>
                                <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">Phone</label><input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="form-input" /></div>
                                <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">Address</label><input name="address" value={form.address} onChange={handleChange} required placeholder="123 Main Street" className="form-input" /></div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">City</label><input name="city" value={form.city} onChange={handleChange} required placeholder="New York" className="form-input" /></div>
                                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">State</label><input name="state" value={form.state} onChange={handleChange} required placeholder="NY" className="form-input" /></div>
                                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">ZIP</label><input name="zip" value={form.zip} onChange={handleChange} required placeholder="10001" className="form-input" /></div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">Country</label>
                                    <select name="country" value={form.country} onChange={handleChange} className="form-input bg-grey-900">
                                        {['Poland', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Nigeria', 'South Africa', 'Ghana'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="mt-6">
                                    <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-70 flex justify-center items-center">
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            'Continue to Payment'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {clientSecret && (
                            <div className={step === 2 ? 'flex flex-col gap-8' : 'hidden'}>
                                <div className="border border-white/[0.08] p-5 flex flex-col gap-1 text-sm text-grey-300">
                                    <h4 className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-500 mb-3">Review Details</h4>
                                    <p className="font-semibold text-white">{form.firstName} {form.lastName}</p>
                                    <p>{form.address}</p>
                                    <p>{form.city}, {form.state} {form.zip} - {form.country}</p>
                                    <p>{form.email}</p>
                                </div>

                                <Elements stripe={stripePromise} options={{
                                    clientSecret,
                                    appearance: {
                                        theme: 'night',
                                        variables: {
                                            colorPrimary: '#ffffff',
                                            colorBackground: '#0a0a0a',
                                            colorText: '#ffffff',
                                            colorTextSecondary: '#808080',
                                            colorIconTab: '#ffffff',
                                            borderRadius: '0px',
                                            fontFamily: 'Poppins, sans-serif',
                                        },
                                        rules: {
                                            '.Input': { border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.04)' },
                                            '.Input:focus': { border: '1px solid rgba(255,255,255,0.5)', outline: 'none' },
                                            '.Tab': { border: '1px solid rgba(255,255,255,0.1)' },
                                            '.Tab--selected': { border: '1px solid #fff', backgroundColor: 'rgba(255,255,255,0.08)' },
                                        }
                                    }
                                }}>
                                    <StripePaymentForm amount={total} onBack={() => setStep(1)} onPaymentSuccess={handleCreateOrder} />
                                </Elements>
                            </div>
                        )}

                    </motion.div>
                </div>

                {/* Order Summary */}
                <div className="bg-grey-900 border border-white/[0.08] p-7 sticky top-6">
                    <h3 className="text-sm font-bold tracking-[0.12em] uppercase mb-6">Order Summary</h3>
                    <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-white/[0.06]">
                        {cartItems.map(item => (
                            <div key={item.key} className="flex items-center gap-4">
                                <div className="relative w-16 h-20 shrink-0 bg-grey-700">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    <span className="absolute -top-1.5 -right-1.5 bg-grey-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold leading-snug">{item.name}</p>
                                    <p className="text-xs text-grey-500 mt-0.5">Size: {item.size}</p>
                                </div>
                                <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3 text-sm text-grey-300">
                        <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free (Lublin)' : formatPrice(shipping)}</span></div>
                        <div className="flex justify-between text-base font-black text-white pt-3 border-t border-white/[0.08] mt-1">
                            <span>Total</span><span>{formatPrice(total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

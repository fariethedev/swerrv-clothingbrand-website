import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheckCircle, HiOutlineShoppingBag } from 'react-icons/hi';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const location = useLocation();

    return (
        <div className="order-success-page">
            <div className="order-success-card">
                <motion.div 
                    className="success-icon-wrap"
                    initial={{ scale: 0, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                    <div className="success-icon-pulse" />
                    <HiCheckCircle size={80} className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] relative z-10" />
                </motion.div>

                <motion.div 
                    className="flex flex-col items-center gap-5 w-full text-center" 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <p className="section-label">Order Confirmed</p>
                    <h1 className="success-title">Thank You!</h1>
                    <p className="success-subtitle">Your order has been placed and will be processed shortly.</p>

                    <div className="success-stepper">
                        {[
                            { label: 'Order Placed', desc: "We've received your order", done: true },
                            { label: 'Processing', desc: 'Your items are being prepared', done: false },
                            { label: 'Shipped', desc: 'On the way to you', done: false },
                            { label: 'Delivered', desc: 'Enjoy your Swerrv!', done: false },
                        ].map((s, i) => (
                            <motion.div 
                                key={s.label} 
                                className={`success-step-item ${s.done ? 'done' : ''}`}
                                initial={{ opacity: 0, x: -20 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: 0.5 + i * 0.1 }}
                            >
                                <div className={`success-step-node ${s.done ? 'done' : 'pending'}`}>
                                    {s.done ? '✓' : i + 1}
                                </div>
                                <div className="success-step-details">
                                    <p className="success-step-label">{s.label}</p>
                                    <p className="success-step-desc">{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex gap-4 flex-wrap justify-center mt-4">
                        <Link to="/shop" className="btn-primary flex items-center gap-2">
                            <HiOutlineShoppingBag size={18} /> Continue Shopping
                        </Link>
                        <Link to="/contact" className="btn-secondary">Need Help?</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderSuccess;

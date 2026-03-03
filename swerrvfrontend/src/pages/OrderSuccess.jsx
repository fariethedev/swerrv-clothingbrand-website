import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { HiCheckCircle, HiOutlineShoppingBag, HiTruck } from 'react-icons/hi';
import { useCurrency } from '../context/CurrencyContext';

const OrderSuccess = () => {
    const location = useLocation();
    const { formatPrice } = useCurrency();
    const order = location.state?.order;
    const orderId = useMemo(() => order?.id || 'SWV-' + String(Math.floor(Math.random() * 900 + 100)), [order?.id]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
            <div className="max-w-lg w-full text-center flex flex-col items-center gap-6">
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
                    <HiCheckCircle size={88} className="text-accent drop-shadow-[0_0_20px_rgba(200,255,0,0.4)]" />
                </motion.div>

                <motion.div className="flex flex-col items-center gap-5 w-full" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                    <p className="section-label">Order Confirmed</p>
                    <h1 className="text-6xl lg:text-7xl font-black">Thank You!</h1>
                    <p className="text-grey-300 text-base">Your order has been placed and will be processed shortly.</p>

                    <div className="flex flex-col gap-3 w-full max-w-[360px]">
                        <div className="flex items-center justify-between bg-grey-900 border border-grey-700 px-5 py-3 text-sm">
                            <span className="text-grey-300">Order ID:</span>
                            <strong className="text-accent text-base">{orderId}</strong>
                        </div>

                        {order?.trackingNumber && (
                            <div className="flex flex-col gap-2 bg-grey-900 border border-grey-700 px-5 py-4 text-sm text-left">
                                <div className="flex items-center gap-2 mb-2 text-white">
                                    <HiTruck size={18} className="text-accent" />
                                    <h3 className="font-bold tracking-[0.1em] uppercase">Tracking Info</h3>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-grey-400">Courier:</span>
                                    <span className="text-white font-semibold">{order.courier}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-grey-400">Number:</span>
                                    <span className="bg-white/10 px-2 py-0.5 rounded text-white font-mono">{order.trackingNumber}</span>
                                </div>
                                {order.shippingLabelUrl && (
                                    <div className="mt-3 pt-3 border-t border-white/10 text-center">
                                        <a href={order.shippingLabelUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold tracking-wider text-accent uppercase hover:text-white transition-colors">
                                            Tracking Label ↗
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 w-full text-left">
                        {[
                            { label: 'Order Placed', desc: "We've received your order", done: true },
                            { label: 'Processing', desc: 'Your items are being prepared', done: false },
                            { label: 'Shipped', desc: 'On the way to you', done: false },
                            { label: 'Delivered', desc: 'Enjoy your Swerrv!', done: false },
                        ].map((s, i) => (
                            <motion.div key={s.label} className={`flex items-center gap-4 p-4 border ${s.done ? 'border-accent/30 opacity-100' : 'border-white/[0.06] opacity-40'}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: s.done ? 1 : 0.4, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${s.done ? 'bg-accent text-black' : 'bg-white/10 text-white'}`}>
                                    {s.done ? '✓' : i + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{s.label}</p>
                                    <p className="text-xs text-grey-500 mt-0.5">{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex gap-4 flex-wrap justify-center mt-2">
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

import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../context/CurrencyContext';
import { FaChevronDown, FaChevronUp, FaExternalLinkAlt, FaTimesCircle, FaUndo } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import './Orders.css';

const steps = [
    { label: 'Placed', status: 'PENDING' },
    { label: 'Confirmed', status: 'CONFIRMED' },
    { label: 'Processing', status: 'PROCESSING' },
    { label: 'Shipped', status: 'SHIPPED' },
    { label: 'Delivered', status: 'DELIVERED' }
];

const getStatusStepIndex = (status) => {
    switch (status) {
        case 'PENDING': return 0;
        case 'CONFIRMED': return 1;
        case 'PROCESSING': return 2;
        case 'SHIPPED': return 3;
        case 'DELIVERED': return 4;
        default: return -1;
    }
};

const Orders = () => {
    const { user, loading: authLoading } = useAuth();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const toggleTrack = (id) => setExpandedOrderId(expandedOrderId === id ? null : id);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedImage(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!authLoading && !user) navigate('/login');
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const data = await api.getUserOrders();
                setOrders(data || []);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchOrders();
    }, [user]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-black pt-[100px] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="orders-page">
            {/* Background Video ALWAYS visible if empty */}
            {orders.length === 0 && (
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-30 mix-blend-screen"
                    >
                        <source src="/images/logovideo.mov" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/60" />
                </div>
            )}

            <div className="max-w-[1000px] mx-auto relative z-10">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-2">Order History</h1>
                <p className="text-grey-400 mb-10">View and track your previous orders.</p>

                {orders.length === 0 ? (
                    <motion.div
                        className="flex flex-col items-center justify-center py-20 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-3xl font-black uppercase tracking-widest mb-4">No Orders Yet</h2>
                        <p className="text-grey-400 mb-8 max-w-md">You haven't placed any orders. Discover our latest collection and find your next favorite piece.</p>
                        <Link to="/shop" className="btn-primary">Start Shopping</Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => {
                            const currentStepIndex = getStatusStepIndex(order.status);
                            const progressPercent = currentStepIndex >= 0 ? currentStepIndex * 25 : 0;
                            const isExpanded = expandedOrderId === order.id;

                            return (
                                <motion.div
                                    key={order.id}
                                    className="orders-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="order-header-info text-sm">
                                        <div>
                                            <p className="text-grey-500 uppercase tracking-widest text-[10px] font-bold mb-1">Order Number</p>
                                            <p className="font-bold text-white">#{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-grey-500 uppercase tracking-widest text-[10px] font-bold mb-1">Date</p>
                                            <p className="text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-grey-500 uppercase tracking-widest text-[10px] font-bold mb-1">Total</p>
                                            <p className="font-bold text-white">{formatPrice(order.totalAmount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-grey-500 uppercase tracking-widest text-[10px] font-bold mb-1">Status</p>
                                            <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${
                                                order.status === 'DELIVERED'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : order.status === 'SHIPPED'
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : order.status === 'CANCELLED' || order.status === 'REFUNDED'
                                                            ? 'bg-red-500/20 text-red-400'
                                                            : 'bg-white/10 text-white'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {order.items?.map(item => (
                                            <div key={item.id} className="flex gap-4">
                                                {item.product?.image && (
                                                    <img 
                                                        src={item.product.image} 
                                                        alt={item.product.name} 
                                                        className="w-20 h-24 object-cover rounded-xl border border-white/10 cursor-pointer hover:opacity-80 transition-opacity" 
                                                        onClick={() => setSelectedImage(item.product.image)}
                                                        title="Click to view image"
                                                    />
                                                )}
                                                <div className="flex-1 flex justify-between">
                                                    <div>
                                                        <p className="font-bold text-white mb-1">{item.product?.name || 'Unknown Product'}</p>
                                                        <p className="text-xs text-grey-400 font-medium">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-bold text-white">{formatPrice(item.price)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                                        <div></div>
                                        <button
                                            onClick={() => toggleTrack(order.id)}
                                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-grey-300 transition-colors"
                                        >
                                            {isExpanded ? 'Hide Tracking' : 'Track Order'}
                                            {isExpanded ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                className="tracking-drawer"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            >
                                                {['CANCELLED', 'REFUNDED'].includes(order.status) ? (
                                                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                                                        {order.status === 'CANCELLED' ? <FaTimesCircle className="text-lg flex-shrink-0" /> : <FaUndo className="text-lg flex-shrink-0" />}
                                                        <div>
                                                            <p className="font-bold uppercase tracking-wider text-xs">
                                                                Order {order.status === 'CANCELLED' ? 'Cancelled' : 'Refunded'}
                                                            </p>
                                                            <p className="text-xs text-grey-400 mt-1">
                                                                {order.status === 'CANCELLED'
                                                                    ? 'This order has been cancelled and cannot be tracked.'
                                                                    : 'A refund has been processed for this order.'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="orders-stepper" style={{ '--progress-percent': `${progressPercent}%` }}>
                                                            <div className="orders-stepper-progress" />
                                                            {steps.map((step, index) => {
                                                                const isDone = index < currentStepIndex;
                                                                const isActive = index === currentStepIndex;
                                                                const statusClass = isActive ? 'active' : isDone ? 'done' : '';

                                                                return (
                                                                    <div key={step.label} className={`orders-stepper-step ${statusClass}`}>
                                                                        <div className="orders-step-dot">
                                                                            {isDone ? '✓' : index + 1}
                                                                        </div>
                                                                        <span className="orders-step-label">{step.label}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {(order.courier || order.trackingNumber) && (
                                                            <div className="carrier-info-box">
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-grey-500 uppercase tracking-widest text-[9px] font-bold">Courier</span>
                                                                    <p className="text-white font-bold text-sm">{order.courier || 'Standard Courier'}</p>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-grey-500 uppercase tracking-widest text-[9px] font-bold">Tracking Number</span>
                                                                    <span className="carrier-info-pill">{order.trackingNumber || 'N/A'}</span>
                                                                </div>
                                                                {order.shippingLabelUrl && (
                                                                    <a
                                                                        href={order.shippingLabelUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="btn-secondary py-2 px-4 text-[10px] tracking-wider flex items-center gap-2"
                                                                    >
                                                                        View Label
                                                                        <FaExternalLinkAlt className="text-[9px]" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Premium Fullscreen Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000] flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            className="relative max-w-[500px] w-full bg-white/[0.03] border border-white/[0.1] backdrop-blur-2xl rounded-[24px] p-6 shadow-2xl flex flex-col gap-4"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-grey-400">Product Preview</h3>
                                <button
                                    className="text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center border border-white/10"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <HiX size={16} />
                                </button>
                            </div>
                            
                            <div className="relative w-full overflow-hidden bg-black/40 rounded-2xl border border-white/[0.05] flex items-center justify-center aspect-[3/4]">
                                <img
                                    src={selectedImage}
                                    alt="Expanded Product"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                            
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="btn-secondary w-full py-3.5 rounded-xl text-center text-xs font-bold uppercase tracking-widest"
                            >
                                Close Preview
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;

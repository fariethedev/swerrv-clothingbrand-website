import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCurrency } from '../context/CurrencyContext';

const Orders = () => {
    const { user, loading: authLoading } = useAuth();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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
        <div className="min-h-screen relative bg-black pt-[100px] px-6 pb-20 overflow-hidden">
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
                        {orders.map(order => (
                            <motion.div
                                key={order.id}
                                className="bg-grey-900 border border-white/10 p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex flex-wrap justify-between gap-4 mb-6 border-b border-white/10 pb-4 text-sm">
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
                                        <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400' : order.status === 'SHIPPED' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {order.items?.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                            {item.product?.image && (
                                                <img src={item.product.image} alt={item.product.name} className="w-20 h-24 object-cover border border-white/10" />
                                            )}
                                            <div className="flex-1 flex justify-between">
                                                <div>
                                                    <p className="font-bold text-white mb-1">{item.product?.name || 'Unknown Product'}</p>
                                                    <p className="text-xs text-grey-400">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-bold text-white">{formatPrice(item.price)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;

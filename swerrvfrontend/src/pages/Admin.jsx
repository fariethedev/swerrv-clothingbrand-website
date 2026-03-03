import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineCurrencyDollar, HiOutlineClipboardList, HiOutlineCheck, HiOutlineLogout, HiOutlineMenu, HiOutlineCog, HiChartBar, HiOutlineVideoCamera, HiOutlineUsers } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const statusColors = { Delivered: '#34c759', Shipped: '#007aff', Processing: '#ff9500', Pending: '#ff3b30' };

const INITIAL_PRODUCT_FORM = {
    name: '', category: '', description: '', material: '',
    price: 0, salePrice: '', images: [], sizes: [], colors: [],
    stock: 0, featured: false, isNew: false, comingSoon: false
};

const StatCard = ({ icon, label, value, change, color }) => (
    <motion.div className="bg-grey-900 border border-white/[0.06] p-6 flex items-center gap-5" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18`, color }}>{icon}</div>
        <div>
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-500">{label}</p>
            <p className="text-2xl font-black mt-1">{value}</p>
            {change && <p className="text-xs text-grey-500 mt-0.5">{change}</p>}
        </div>
    </motion.div>
);

const Admin = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');

    const [orders, setOrders] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [promoContent, setPromoContent] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0
    });
    const [loading, setLoading] = useState(true);

    const loadAdminData = async () => {
        try {
            setLoading(true);
            const [ordersData, statsData, lowStockData, productsData, promoData, usersData] = await Promise.all([
                api.getAdminOrders(),
                api.getAdminStats(),
                api.getAdminLowStock(10),
                api.getProducts(),
                api.getPromoContent(),
                api.getAdminUsers()
            ]);
            setOrders(ordersData || []);
            setLowStock(lowStockData || []);
            setAllProducts(productsData || []);
            setPromoContent(promoData || []);
            setUsers(usersData || []);
            setStats(statsData || {
                totalRevenue: 0,
                totalOrders: 0,
                pendingOrders: 0,
                deliveredOrders: 0
            });
        } catch (error) {
            toast.error(error.message || 'Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.updateOrderStatus(id, status);
            toast.success('Status updated');
            loadAdminData(); // Refresh data
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleUpdateStock = async (id, currentStock) => {
        const value = prompt('Enter new stock quantity:', currentStock);
        if (value === null || isNaN(value)) return;
        const newStock = parseInt(value, 10);
        try {
            await api.updateAdminStock(id, newStock);
            toast.success('Stock updated');
            loadAdminData(); // Refresh data
        } catch (error) {
            toast.error('Failed to update stock');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.deleteProduct(id);
            toast.success('Product deleted');
            loadAdminData();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const handleDeletePromo = async (id) => {
        if (!confirm('Are you sure you want to delete this promo content?')) return;
        try {
            await api.deletePromoContent(id);
            toast.success('Promo content deleted');
            loadAdminData();
        } catch (error) {
            toast.error('Failed to delete promo content');
        }
    };

    const handleTogglePromoActive = async (id) => {
        try {
            await api.togglePromoContentActive(id);
            toast.success('Status updated');
            loadAdminData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState(INITIAL_PRODUCT_FORM);

    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);
    const INITIAL_PROMO_FORM = { type: 'VIDEO', title: '', description: '', mediaUrl: '', actionUrl: '', eventDate: '', location: '', active: false };
    const [promoForm, setPromoForm] = useState(INITIAL_PROMO_FORM);

    const openCreatePromoModal = () => {
        setEditingPromo(null);
        setPromoForm(INITIAL_PROMO_FORM);
        setIsPromoModalOpen(true);
    };

    const openEditPromoModal = (p) => {
        setEditingPromo(p.id);
        const eventDateStr = p.eventDate ? new Date(p.eventDate).toISOString().slice(0, 16) : '';
        setPromoForm({
            type: p.type || 'VIDEO', title: p.title || '', description: p.description || '',
            mediaUrl: p.mediaUrl || '', actionUrl: p.actionUrl || '', eventDate: eventDateStr, location: p.location || '', active: p.isActive || false
        });
        setIsPromoModalOpen(true);
    };

    const handlePromoSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...promoForm };
            if (payload.eventDate === '') payload.eventDate = null;
            if (editingPromo) {
                await api.updatePromoContent(editingPromo, payload);
                toast.success('Promo content updated');
            } else {
                await api.createPromoContent(payload);
                toast.success('Promo content created');
            }
            setIsPromoModalOpen(false);
            loadAdminData();
        } catch (error) {
            toast.error(error.message || 'Failed to save promo content');
        }
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setProductForm(INITIAL_PRODUCT_FORM);
        setIsProductModalOpen(true);
    };

    const openEditModal = (p) => {
        setEditingProduct(p.id);
        setProductForm({
            name: p.name || '', category: p.category || '', description: p.description || '',
            material: p.material || '', price: p.price || 0, salePrice: p.originalPrice ? p.price : '', // if sale exists, current is salePrice
            images: p.images || [], sizes: p.sizes || [], colors: p.colors || [],
            stock: p.stock || 0, featured: p.featured || false, isNew: p.isNew || false, comingSoon: p.comingSoon || false
        });
        setIsProductModalOpen(true);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const numPrice = parseFloat(productForm.price);
            const numSalePrice = productForm.salePrice === '' ? null : parseFloat(productForm.salePrice);

            const payload = {
                ...productForm,
                slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                price: productForm.salePrice !== '' ? numSalePrice : numPrice, // Backend receives price as current valid price
                salePrice: productForm.salePrice !== '' ? numPrice : null // Backend receives salePrice as sale price
            };

            // Fix array strings to arrays if typed as strings
            if (typeof payload.colors === 'string') payload.colors = payload.colors.split(',').map(s => s.trim()).filter(Boolean);

            if (editingProduct) {
                await api.updateProduct(editingProduct, payload);
                toast.success('Product updated');
            } else {
                await api.createProduct(payload);
                toast.success('Product created');
            }
            setIsProductModalOpen(false);
            loadAdminData();
        } catch (error) {
            toast.error(error.message || 'Failed to save product');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-grey-800 border-t-accent rounded-full animate-spin"></div>
        </div>
    );

    const filteredOrders = filterStatus === 'All' ? orders : orders.filter(o => o.status === filterStatus);
    const revenueData = [45, 62, 80, 55, 92, 110, 85, 130, 95, 140, 120, 160];
    const maxRev = Math.max(...revenueData);
    const months = ['M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D', 'J', 'F'];

    const tabs = [
        { id: 'dashboard', icon: <HiChartBar size={20} />, label: 'Dashboard' },
        { id: 'products', icon: <HiOutlineShoppingBag size={20} />, label: 'Products' },
        { id: 'orders', icon: <HiOutlineClipboardList size={20} />, label: 'Orders' },
        { id: 'inventory', icon: <HiOutlineShoppingBag size={20} />, label: 'Inventory (Alerts)' },
        { id: 'customers', icon: <HiOutlineUsers size={20} />, label: 'Customers' },
        { id: 'payments', icon: <HiOutlineCurrencyDollar size={20} />, label: 'Payments' },
        { id: 'promo', icon: <HiOutlineVideoCamera size={20} />, label: 'Promo Content' },
        { id: 'settings', icon: <HiOutlineCog size={20} />, label: 'Settings' },
    ];

    return (
        <div className="flex min-h-screen bg-[#0a0a0a]">
            {/* Desktop Sidebar */}
            <motion.aside className="hidden md:flex bg-grey-900 border-r border-white/[0.06] flex-col sticky top-0 h-screen shrink-0 overflow-hidden z-20" animate={{ width: sidebarOpen ? 240 : 72 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06] min-h-[64px]">
                    {sidebarOpen && <span className="font-black text-lg tracking-[0.1em] whitespace-nowrap">SWERRV</span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-grey-300 hover:text-accent transition-colors p-1 shrink-0"><HiOutlineMenu size={18} /></button>
                </div>
                <nav className="flex flex-col flex-1 p-2 gap-1">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 p-3 rounded-md text-[13px] font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id ? 'bg-accent/10 text-accent' : 'text-grey-500 hover:bg-white/5 hover:text-white'}`}>
                            <span className="shrink-0">{tab.icon}</span>
                            {sidebarOpen && <span>{tab.label}</span>}
                        </button>
                    ))}
                </nav>
                <button onClick={logout} className="flex items-center gap-3 p-4 border-t border-white/[0.06] text-grey-500 hover:text-brand-red transition-colors text-[13px] font-semibold whitespace-nowrap">
                    <HiOutlineLogout size={18} className="shrink-0" />
                    {sidebarOpen && <span>Logout</span>}
                </button>
            </motion.aside>

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div className="fixed inset-0 bg-black/80 z-[100]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} />
                        <motion.aside className="fixed inset-y-0 left-0 w-[260px] bg-grey-900 z-[101] flex flex-col border-r border-white/10" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }}>
                            <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
                                <span className="font-black text-lg tracking-[0.1em]">SWERRV</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="text-grey-300"><HiOutlineMenu size={20} /></button>
                            </div>
                            <nav className="flex flex-col flex-1 p-3 gap-2 overflow-y-auto">
                                {tabs.map(tab => (
                                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                                        className={`flex items-center gap-3 p-3 rounded-md text-[14px] font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id ? 'bg-accent/10 text-accent' : 'text-grey-400 hover:bg-white/5 hover:text-white'}`}>
                                        <span className="shrink-0">{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                            <button onClick={logout} className="flex items-center gap-3 p-5 border-t border-white/[0.06] text-grey-500 hover:text-brand-red font-semibold">
                                <HiOutlineLogout size={20} className="shrink-0" />
                                <span>Logout</span>
                            </button>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-grey-900 border-b border-white/[0.06] sticky top-0 z-10">
                    <div className="flex items-center gap-3 md:gap-0">
                        <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-white p-1 hover:text-accent disabled:opacity-50"><HiOutlineMenu size={24} /></button>
                        <div>
                            <h1 className="text-lg md:text-xl font-black">{tabs.find(t => t.id === activeTab)?.label}</h1>
                            <p className="hidden md:block text-xs text-grey-500 mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold">
                        <div className="w-9 h-9 rounded-full bg-accent text-black flex items-center justify-center font-black text-base">A</div>
                        <span>Admin</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>

                            {/* DASHBOARD */}
                            {activeTab === 'dashboard' && (
                                <div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
                                        <StatCard icon={<HiOutlineCurrencyDollar size={24} />} label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} change="↑ 24% this month" color="#c8ff00" />
                                        <StatCard icon={<HiOutlineShoppingBag size={24} />} label="Total Orders" value={stats.totalOrders} change={`${stats.pendingOrders} pending`} color="#007aff" />
                                        <StatCard icon={<HiOutlineCheck size={24} />} label="Delivered" value={stats.deliveredOrders} color="#34c759" />
                                        <StatCard icon={<HiOutlineClipboardList size={24} />} label="Processing" value={stats.pendingOrders} change="Needs attention" color="#ff9500" />
                                    </div>

                                    {/* Chart */}
                                    <div className="admin-card">
                                        <h3 className="text-sm font-bold tracking-[0.08em] mb-6">Revenue Overview (2025–2026)</h3>
                                        <div className="flex items-end gap-3 h-44">
                                            {revenueData.map((val, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                                    <motion.div className="w-full bg-accent rounded-t-sm opacity-80 min-h-1" style={{ height: `${(val / maxRev) * 100}%` }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, delay: i * 0.05 }} />
                                                    <span className="text-[11px] text-grey-500 font-semibold">{months[i]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Orders */}
                                    <div className="admin-card">
                                        <h3 className="text-sm font-bold tracking-[0.08em] mb-5">Recent Orders</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-[13px]">
                                                <thead><tr className="border-b border-white/[0.06]">
                                                    {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => <th key={h} className="text-left py-2.5 px-3.5 text-[10px] font-bold tracking-[0.12em] uppercase text-grey-500 whitespace-nowrap">{h}</th>)}
                                                </tr></thead>
                                                <tbody>
                                                    {orders.slice(0, 5).map(o => (
                                                        <tr key={o.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                            <td className="py-4 px-3.5 text-accent font-bold text-xs">#{o.id}</td>
                                                            <td className="py-4 px-3.5 font-medium">{o.customerName}</td>
                                                            <td className="py-4 px-3.5 text-grey-300 max-w-[180px] truncate">{o.items?.map(i => i.productName).join(', ')}</td>
                                                            <td className="py-4 px-3.5 font-black">${o.totalAmount}</td>
                                                            <td className="py-4 px-3.5"><span className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ color: statusColors[o.status], background: `${statusColors[o.status]}18` }}>{o.status}</span></td>
                                                            <td className="py-4 px-3.5 text-grey-500 text-xs">{new Date(o.createdAt || o.date).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ORDERS */}
                            {activeTab === 'orders' && (
                                <div>
                                    <div className="flex gap-2 mb-5 flex-wrap">
                                        {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map(s => (
                                            <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 text-xs font-bold tracking-[0.1em] uppercase rounded border transition-all duration-200 ${filterStatus === s ? 'bg-accent text-black border-accent' : 'bg-transparent text-grey-300 border-white/10 hover:border-grey-500'}`}>{s}</button>
                                        ))}
                                    </div>
                                    <div className="admin-card">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-[13px]">
                                                <thead><tr className="border-b border-white/[0.06]">
                                                    {['Order ID', 'Customer', 'Email', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => <th key={h} className="text-left py-2.5 px-3 text-[10px] font-bold tracking-[0.12em] uppercase text-grey-500 whitespace-nowrap">{h}</th>)}
                                                </tr></thead>
                                                <tbody>
                                                    {filteredOrders.map(o => (
                                                        <motion.tr key={o.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                            <td className="py-3.5 px-3 text-accent font-bold text-xs">#{o.id}</td>
                                                            <td className="py-3.5 px-3 font-medium">{o.customerName}</td>
                                                            <td className="py-3.5 px-3 text-grey-500 text-xs">{o.email}</td>
                                                            <td className="py-3.5 px-3 text-grey-300 max-w-[160px] truncate">{o.items?.map(i => i.productName).join(', ')}</td>
                                                            <td className="py-3.5 px-3 font-black">${o.totalAmount}</td>
                                                            <td className="py-3.5 px-3"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${o.paymentStatus === 'Paid' ? 'text-brand-green bg-brand-green/10' : 'text-brand-red bg-brand-red/10'}`}>{o.paymentStatus}</span></td>
                                                            <td className="py-3.5 px-3"><span className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ color: statusColors[o.status], background: `${statusColors[o.status]}18` }}>{o.status}</span></td>
                                                            <td className="py-3.5 px-3 text-grey-500 text-xs">{new Date(o.createdAt || o.date).toLocaleDateString()}</td>
                                                            <td className="py-3.5 px-3">
                                                                <select value={o.status} onChange={e => handleUpdateStatus(o.id, e.target.value)} className="bg-white/5 border border-grey-700 text-white px-2.5 py-1.5 text-xs rounded cursor-pointer outline-none hover:border-grey-300 transition-colors">
                                                                    {['Pending', 'Processing', 'Shipped', 'Delivered'].map(s => <option key={s} value={s} className="bg-grey-900">{s}</option>)}
                                                                </select>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PRODUCTS APP */}
                            {activeTab === 'products' && (
                                <div>
                                    <div className="flex justify-between items-center mb-5">
                                        <h2 className="text-lg font-bold">Catalog Management</h2>
                                        <button onClick={openCreateModal} className="btn-primary py-2 px-4 text-xs">+ Add Product</button>
                                    </div>
                                    <div className="admin-card">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-[13px]">
                                                <thead><tr className="border-b border-white/[0.06]">
                                                    {['Product', 'Category', 'Price', 'Stock', 'Tags', 'Action'].map(h => <th key={h} className="text-left py-2.5 px-3.5 text-[10px] font-bold tracking-[0.12em] uppercase text-grey-500 whitespace-nowrap">{h}</th>)}
                                                </tr></thead>
                                                <tbody>
                                                    {allProducts.map(p => (
                                                        <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                            <td className="py-3 px-3.5 flex items-center gap-3">
                                                                <img src={p.image} alt={p.name} className="w-10 h-10 object-cover bg-grey-800 rounded-sm" />
                                                                <span className="font-semibold">{p.name} <span className="text-[10px] text-grey-500 font-normal">#{p.id}</span></span>
                                                            </td>
                                                            <td className="py-3 px-3.5 text-grey-400">{p.category}</td>
                                                            <td className="py-3 px-3.5 font-bold">{p.price} PLN</td>
                                                            <td className="py-3 px-3.5 font-black">{p.stock}</td>
                                                            <td className="py-3 px-3.5">
                                                                <div className="flex gap-1 flex-wrap">
                                                                    {p.comingSoon && <span className="px-1.5 py-0.5 rounded bg-white text-black text-[9px] font-bold">SOON</span>}
                                                                    {p.isNew && <span className="px-1.5 py-0.5 rounded bg-accent text-black text-[9px] font-bold">NEW</span>}
                                                                    {p.featured && <span className="px-1.5 py-0.5 rounded border border-white/20 text-[9px] font-bold">FEAT</span>}
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-3.5 space-x-2">
                                                                <button onClick={() => openEditModal(p)} className="text-xs font-bold text-accent hover:underline">Edit</button>
                                                                <button onClick={() => handleDeleteProduct(p.id)} className="text-xs font-bold text-brand-red hover:underline">Delete</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* INVENTORY */}
                            {activeTab === 'inventory' && (
                                <div>
                                    <h2 className="text-lg font-bold mb-5 flex items-center gap-3">
                                        Low Stock Alerts <span className="bg-brand-red text-white text-xs px-2.5 py-0.5 rounded-full">{lowStock.length} items</span>
                                    </h2>
                                    <div className="admin-card">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-[13px]">
                                                <thead><tr className="border-b border-white/[0.06]">
                                                    {['Product', 'Category', 'Price', 'Current Stock', 'Status', 'Action'].map(h => <th key={h} className="text-left py-2.5 px-3.5 text-[10px] font-bold tracking-[0.12em] uppercase text-grey-500 whitespace-nowrap">{h}</th>)}
                                                </tr></thead>
                                                <tbody>
                                                    {lowStock.length === 0 ? (
                                                        <tr><td colSpan="6" className="py-8 text-center text-grey-500">All products are adequately stocked!</td></tr>
                                                    ) : lowStock.map(p => (
                                                        <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                            <td className="py-4 px-3.5 flex items-center gap-3">
                                                                <img src={p.image} alt={p.name} className="w-10 h-10 object-cover bg-grey-800 rounded-sm" />
                                                                <span className="font-semibold">{p.name}</span>
                                                            </td>
                                                            <td className="py-4 px-3.5 text-grey-400">{p.category}</td>
                                                            <td className="py-4 px-3.5 font-bold">${p.price}</td>
                                                            <td className="py-4 px-3.5 font-black text-brand-red">{p.stock}</td>
                                                            <td className="py-4 px-3.5"><span className="px-2.5 py-1 rounded-full text-[11px] font-bold text-brand-red bg-brand-red/10">Low Stock</span></td>
                                                            <td className="py-4 px-3.5">
                                                                <button onClick={() => handleUpdateStock(p.id, p.stock)} className="btn-secondary py-1.5 px-3 text-xs">Update Stock</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CUSTOMERS */}
                            {activeTab === 'customers' && (
                                <div>
                                    <h2 className="text-lg font-bold mb-5 flex items-center gap-3">
                                        Registered Customers <span className="bg-accent text-black text-xs px-2.5 py-0.5 rounded-full">{users.length} users</span>
                                    </h2>
                                    <div className="admin-card">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-[13px]">
                                                <thead><tr className="border-b border-white/[0.06]">
                                                    {['User ID', 'Name', 'Email', 'Role', 'Joined', 'Action'].map(h => <th key={h} className="text-left py-2.5 px-3.5 text-[10px] font-bold tracking-[0.12em] uppercase text-grey-500 whitespace-nowrap">{h}</th>)}
                                                </tr></thead>
                                                <tbody>
                                                    {users.length === 0 ? (
                                                        <tr><td colSpan="6" className="py-8 text-center text-grey-500">No customers found.</td></tr>
                                                    ) : users.map(u => (
                                                        <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                            <td className="py-4 px-3.5 text-accent font-bold text-xs">#{u.id}</td>
                                                            <td className="py-4 px-3.5 font-medium">{u.firstName} {u.lastName}</td>
                                                            <td className="py-4 px-3.5 text-grey-400">{u.email}</td>
                                                            <td className="py-4 px-3.5">
                                                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${u.role === 'ROLE_ADMIN' ? 'text-brand-green bg-brand-green/10' : 'text-grey-300 bg-white/5'}`}>{u.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}</span>
                                                            </td>
                                                            <td className="py-4 px-3.5 text-grey-500 text-xs">{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                                                            <td className="py-4 px-3.5">
                                                                <button className="text-xs font-bold text-accent hover:underline">View Details</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PAYMENTS */}
                            {activeTab === 'payments' && (
                                <div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
                                        <StatCard icon={<HiOutlineCurrencyDollar size={24} />} label="Total Revenue" value={`$${stats.totalRevenue}`} color="#c8ff00" />
                                        <StatCard icon={<HiOutlineCheck size={24} />} label="Paid Orders" value={orders.filter(o => o.payment === 'Paid').length} color="#34c759" />
                                        <StatCard icon={<HiOutlineClipboardList size={24} />} label="Pending Payment" value={orders.filter(o => o.payment === 'Pending').length} color="#ff3b30" />
                                        <StatCard icon={<HiOutlineShoppingBag size={24} />} label="Avg Order Value" value={`$${Math.round(stats.totalRevenue / stats.totalOrders)}`} color="#007aff" />
                                    </div>
                                    <div className="admin-card">
                                        <h3 className="text-sm font-bold tracking-[0.08em] mb-5">Payment Transactions</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-[13px]">
                                                <thead><tr className="border-b border-white/[0.06]">
                                                    {['Transaction ID', 'Customer', 'Amount', 'Status', 'Date', 'Method'].map(h => <th key={h} className="text-left py-2.5 px-3.5 text-[10px] font-bold tracking-[0.12em] uppercase text-grey-500 whitespace-nowrap">{h}</th>)}
                                                </tr></thead>
                                                <tbody>
                                                    {orders.map(o => (
                                                        <tr key={o.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                            <td className="py-3.5 px-3.5 text-accent font-bold text-xs">TXN-{o.id}</td>
                                                            <td className="py-3.5 px-3.5">{o.customerName}</td>
                                                            <td className="py-3.5 px-3.5 font-black">${o.totalAmount}</td>
                                                            <td className="py-3.5 px-3.5"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${o.paymentStatus === 'Paid' ? 'text-brand-green bg-brand-green/10' : 'text-brand-red bg-brand-red/10'}`}>{o.paymentStatus}</span></td>
                                                            <td className="py-3.5 px-3.5 text-grey-500 text-xs">{new Date(o.createdAt || o.date).toLocaleDateString()}</td>
                                                            <td className="py-3.5 px-3.5 text-grey-500 text-xs">Credit Card</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PROMO CONTENT */}
                            {activeTab === 'promo' && (
                                <div>
                                    <div className="flex justify-between items-center mb-5">
                                        <h2 className="text-lg font-bold">Promo Content Management</h2>
                                        <button onClick={openCreatePromoModal} className="btn-primary py-2 px-4 text-xs">+ Add Promo Content</button>
                                    </div>
                                    <div className="admin-card">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-[13px]">
                                                <thead><tr className="border-b border-white/[0.06]">
                                                    {['Type', 'Title', 'Status', 'Date', 'Action'].map(h => <th key={h} className="text-left py-2.5 px-3.5 text-[10px] font-bold tracking-[0.12em] uppercase text-grey-500 whitespace-nowrap">{h}</th>)}
                                                </tr></thead>
                                                <tbody>
                                                    {promoContent.map(p => (
                                                        <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                            <td className="py-3 px-3.5 font-bold text-xs">{p.type}</td>
                                                            <td className="py-3 px-3.5">{p.title}</td>
                                                            <td className="py-3 px-3.5">
                                                                <button onClick={() => handleTogglePromoActive(p.id)} className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${p.active ? 'bg-brand-green/20 text-brand-green' : 'bg-grey-700 text-grey-300'}`}>
                                                                    {p.active ? 'Active' : 'Hidden'}
                                                                </button>
                                                            </td>
                                                            <td className="py-3 px-3.5 text-grey-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                                                            <td className="py-3 px-3.5 space-x-3">
                                                                <button onClick={() => openEditPromoModal(p)} className="text-xs font-bold text-accent hover:underline">Edit</button>
                                                                <button onClick={() => handleDeletePromo(p.id)} className="text-xs font-bold text-brand-red hover:underline">Delete</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {promoContent.length === 0 && (
                                                        <tr><td colSpan="5" className="py-6 text-center text-grey-500 text-sm">No promo content found.</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SETTINGS */}
                            {activeTab === 'settings' && (
                                <div className="flex flex-col gap-0">
                                    <div className="admin-card">
                                        <h3 className="text-sm font-bold tracking-[0.08em] mb-5">Store Settings</h3>
                                        <div className="flex flex-col gap-4 max-w-md">
                                            {[['Store Name', 'SWERRV'], ['Contact Email', 'support@swerrv.com'], ['Currency', 'PLN'], ['Free Shipping Threshold', '400 PLN']].map(([label, val]) => (
                                                <div key={label} className="flex flex-col gap-1.5">
                                                    <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">{label}</label>
                                                    <input defaultValue={val} className="form-input" />
                                                </div>
                                            ))}
                                            <button className="btn-primary self-start mt-2">Save Changes</button>
                                        </div>
                                    </div>
                                    <div className="admin-card">
                                        <h3 className="text-sm font-bold tracking-[0.08em] mb-5">Admin Account</h3>
                                        <div className="flex flex-col gap-4 max-w-md">
                                            <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">New Password</label><input type="password" placeholder="Enter new password" className="form-input" /></div>
                                            <button className="btn-secondary self-start mt-1">Update Password</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* PRODUCT MODAL */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden text-white" onClick={(e) => { if (e.target === e.currentTarget) setIsProductModalOpen(false) }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-grey-900 border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded p-6 shadow-2xl relative custom-scrollbar mt-10 md:mt-0">
                        <button onClick={() => setIsProductModalOpen(false)} className="absolute top-4 right-4 text-grey-500 hover:text-white text-2xl leading-none">&times;</button>
                        <h2 className="text-xl font-black mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>

                        <form onSubmit={handleProductSubmit} className="flex flex-col gap-4 md:gap-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Name</label>
                                    <input required type="text" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="form-input text-sm py-2 px-3" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Category</label>
                                    <input required list="category-suggestions" type="text" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="form-input text-sm py-2 px-3" />
                                    <datalist id="category-suggestions">
                                        <option value="T-Shirts" />
                                        <option value="Hoodies" />
                                        <option value="Tracksuits" />
                                        <option value="Bottoms" />
                                        <option value="Jackets" />
                                        <option value="Accessories" />
                                    </datalist>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Description</label>
                                <textarea rows="3" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="form-input text-sm py-2 px-3" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Orig. Price (PLN)</label>
                                    <input required type="number" step="0.01" min="0" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="form-input text-sm py-2 px-3" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Sale Price (Optional)</label>
                                    <input type="number" step="0.01" min="0" value={productForm.salePrice} onChange={e => setProductForm({ ...productForm, salePrice: e.target.value })} placeholder="Leave blank for none" className="form-input text-sm py-2 px-3" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Stock</label>
                                    <input required type="number" min="0" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className="form-input text-sm py-2 px-3" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                                    <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Images (Up to 5)</label>
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                        {(Array.isArray(productForm.images) ? productForm.images : []).map((img, idx) => (
                                            <div key={idx} className="relative aspect-square bg-grey-800 rounded border border-white/10 overflow-hidden group">
                                                <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => {
                                                    const newImgs = [...productForm.images];
                                                    newImgs.splice(idx, 1);
                                                    setProductForm({ ...productForm, images: newImgs });
                                                }} className="absolute top-1 right-1 bg-brand-red text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                                            </div>
                                        ))}
                                        {(!Array.isArray(productForm.images) || productForm.images.length < 5) && (
                                            <label className="aspect-square bg-white/5 border border-dashed border-white/20 hover:border-accent hover:text-accent transition-colors rounded flex flex-col items-center justify-center cursor-pointer text-grey-500">
                                                <span className="text-2xl mb-1">+</span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (ev) => {
                                                            const newImgs = Array.isArray(productForm.images) ? [...productForm.images] : [];
                                                            newImgs.push(ev.target.result);
                                                            setProductForm({ ...productForm, images: newImgs });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                    e.target.value = null;
                                                }} />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Sizes</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'OS'].map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => {
                                                    const currentSizes = Array.isArray(productForm.sizes) ? productForm.sizes : [];
                                                    if (currentSizes.includes(size)) {
                                                        setProductForm({ ...productForm, sizes: currentSizes.filter(s => s !== size) });
                                                    } else {
                                                        setProductForm({ ...productForm, sizes: [...currentSizes, size] });
                                                    }
                                                }}
                                                className={`w-9 h-9 text-xs font-bold border rounded flex items-center justify-center transition-colors ${(Array.isArray(productForm.sizes) && productForm.sizes.includes(size))
                                                    ? 'bg-accent text-black border-accent'
                                                    : 'bg-transparent text-grey-400 border-white/20 hover:border-white hover:text-white'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Colors (comma separated)</label>
                                    <input placeholder="Red, Blue, Black" value={Array.isArray(productForm.colors) ? productForm.colors.join(', ') : productForm.colors} onChange={e => setProductForm({ ...productForm, colors: e.target.value })} className="form-input text-sm py-2 px-3" />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-5 mt-2 p-4 bg-white/5 border border-white/10 rounded">
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-accent transition-colors">
                                    <input type="checkbox" checked={productForm.isNew} onChange={e => setProductForm({ ...productForm, isNew: e.target.checked })} className="w-4 h-4 accent-accent" /> New Arrival
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-accent transition-colors">
                                    <input type="checkbox" checked={productForm.featured} onChange={e => setProductForm({ ...productForm, featured: e.target.checked })} className="w-4 h-4 accent-accent" /> Featured
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-accent transition-colors">
                                    <input type="checkbox" checked={productForm.comingSoon} onChange={e => setProductForm({ ...productForm, comingSoon: e.target.checked })} className="w-4 h-4 accent-accent" /> Coming Soon
                                </label>
                            </div>

                            <button type="submit" className="btn-primary mt-4 py-3">{editingProduct ? 'Save Changes' : 'Create Product'}</button>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* PROMO MODAL */}
            {isPromoModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden text-white" onClick={(e) => { if (e.target === e.currentTarget) setIsPromoModalOpen(false) }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-grey-900 border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded p-6 shadow-2xl relative custom-scrollbar mt-10 md:mt-0">
                        <button onClick={() => setIsPromoModalOpen(false)} className="absolute top-4 right-4 text-grey-500 hover:text-white text-2xl leading-none">&times;</button>
                        <h2 className="text-xl font-black mb-6">{editingPromo ? 'Edit Promo Content' : 'Add Promo Content'}</h2>

                        <form onSubmit={handlePromoSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Type</label>
                                <select value={promoForm.type} onChange={e => setPromoForm({ ...promoForm, type: e.target.value })} className="form-input text-sm py-2 px-3 bg-grey-900">
                                    <option value="VIDEO">Video</option>
                                    <option value="EVENT">Event</option>
                                    <option value="NEWS">News</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Title</label>
                                <input required type="text" value={promoForm.title} onChange={e => setPromoForm({ ...promoForm, title: e.target.value })} className="form-input text-sm py-2 px-3" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Description</label>
                                <textarea rows="3" value={promoForm.description} onChange={e => setPromoForm({ ...promoForm, description: e.target.value })} className="form-input text-sm py-2 px-3" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Media URL (Video/Image Link)</label>
                                <input type="text" value={promoForm.mediaUrl} onChange={e => setPromoForm({ ...promoForm, mediaUrl: e.target.value })} className="form-input text-sm py-2 px-3" placeholder="/images/logovideo.mov or external link" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Action URL (Optional Link)</label>
                                <input type="text" value={promoForm.actionUrl} onChange={e => setPromoForm({ ...promoForm, actionUrl: e.target.value })} className="form-input text-sm py-2 px-3" />
                            </div>

                            {promoForm.type === 'EVENT' && (
                                <>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Event Date & Time</label>
                                        <input type="datetime-local" value={promoForm.eventDate} onChange={e => setPromoForm({ ...promoForm, eventDate: e.target.value })} className="form-input text-sm py-2 px-3 bg-transparent icon-white" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-grey-400">Location</label>
                                        <input type="text" value={promoForm.location} onChange={e => setPromoForm({ ...promoForm, location: e.target.value })} className="form-input text-sm py-2 px-3" />
                                    </div>
                                </>
                            )}

                            <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-accent transition-colors mt-2">
                                <input type="checkbox" checked={promoForm.active} onChange={e => setPromoForm({ ...promoForm, active: e.target.checked })} className="w-4 h-4 accent-accent" /> Set as Active
                            </label>

                            <button type="submit" className="btn-primary mt-4 py-3">{editingPromo ? 'Save Changes' : 'Create Content'}</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Admin;

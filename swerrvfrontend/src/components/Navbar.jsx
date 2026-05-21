import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlineShoppingBag, HiOutlineHeart, HiMenu, HiX, HiOutlineUser } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredLink, setHoveredLink] = useState(null);
    const { cartCount, setIsCartOpen } = useCart();
    const { wishlist } = useWishlist();
    const { user, logout, isAdmin } = useAuth();
    const { currency, setCurrency } = useCurrency();
    const { t, language, setLanguage } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Escape') {
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { to: '/shop', label: 'Shop' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
    ];

    return (
        <>
            <motion.nav
                className={`always-dark fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 h-[70px]' : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent h-[90px]'}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className={`max-w-[1400px] mx-auto px-6 flex items-center justify-between transition-all duration-300 relative ${scrolled ? 'h-[70px]' : 'h-[90px]'}`}>
                    {/* Left: Nav Links & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button className="lg:hidden text-white p-2.5 bg-black/45 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors" onClick={() => setMobileOpen(true)}>
                            <HiMenu size={20} />
                        </button>
                        
                        {/* Nav Links (Desktop) */}
                        <div 
                            className="hidden lg:flex gap-1.5 items-center bg-black/45 backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-full relative"
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            {navLinks.map(link => {
                                const isHovered = hoveredLink === link.label;
                                return (
                                    <Link
                                        key={link.label}
                                        to={link.to}
                                        onMouseEnter={() => setHoveredLink(link.label)}
                                        className="text-[11px] font-black tracking-[0.2em] uppercase px-4 py-1.5 relative transition-colors duration-300"
                                    >
                                        <span className={`relative z-10 transition-colors duration-300 ${isHovered ? 'text-black' : 'text-white/90'}`}>
                                            {link.label}
                                        </span>
                                        {isHovered && (
                                            <motion.span
                                                layoutId="navHover"
                                                className="absolute inset-0 bg-white rounded-full z-0"
                                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Center: Logo */}
                    <Link to="/" className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 mt-0.5">
                        <img src="/images/swerrve_logo_white.png" alt="Swerrv" className={`object-contain w-auto max-w-[120px] md:max-w-none transition-all duration-300 ${scrolled ? 'h-[30px] md:h-[65px]' : 'h-[40px] md:h-[95px]'}`} />
                    </Link>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2.5 relative z-10 shrink-0">
                        {isAdmin && (
                            <Link to="/admin" className="text-[10px] font-black tracking-widest uppercase text-white border border-white/20 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300 hidden md:block">
                                Admin
                            </Link>
                        )}
                        
                        <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                            <button onClick={() => setSearchOpen(true)} className="hidden md:flex text-white/80 p-1.5 hover:text-white hover:scale-105 transition-all duration-200">
                                <HiOutlineSearch size={18} />
                            </button>
                            {user ? (
                                <div className="group relative flex items-center">
                                    <button className="text-white/80 p-1 hover:text-white hover:scale-105 transition-all duration-200">
                                        {user.profilePictureUrl ? (
                                            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                                                <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <HiOutlineUser size={18} className="m-0.5" />
                                        )}
                                    </button>
                                    <div className="absolute right-0 top-full pt-3.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <div className="bg-black/95 border border-white/10 flex flex-col min-w-[200px] shadow-2xl rounded-2xl p-1 backdrop-blur-xl">
                                            <div className="px-4 py-3 border-b border-white/10 text-xs text-grey-400">
                                                Signed in as <br /><strong className="text-white truncate block capitalize mt-0.5">{user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.name || user.email}</strong>
                                            </div>
                                            <div className="py-1.5 border-b border-white/10 flex flex-col">
                                                <Link to="/profile" className="text-left px-4 py-2 text-xs font-semibold text-grey-300 hover:text-white hover:bg-white/5 transition-colors rounded-xl">My Profile</Link>
                                                <Link to="/orders" className="text-left px-4 py-2 text-xs font-semibold text-grey-300 hover:text-white hover:bg-white/5 transition-colors rounded-xl">Order History</Link>
                                                <Link to="/wishlist" className="text-left px-4 py-2 text-xs font-semibold text-grey-300 hover:text-white hover:bg-white/5 transition-colors rounded-xl">Saved Items</Link>
                                            </div>
                                            <div className="py-1.5 border-b border-white/10 flex flex-col">
                                                <div className="px-4 py-1.5 flex items-center justify-between hover:bg-white/5 transition-colors rounded-xl">
                                                    <span className="text-xs font-semibold text-grey-300">Currency</span>
                                                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer border-none pr-1">
                                                        <option className="bg-black text-white" value="PLN">PLN (zł)</option>
                                                        <option className="bg-black text-white" value="EUR">EUR (€)</option>
                                                        <option className="bg-black text-white" value="GBP">GBP (£)</option>
                                                        <option className="bg-black text-white" value="CAD">CAD ($)</option>
                                                        <option className="bg-black text-white" value="USD">USD ($)</option>
                                                        <option className="bg-black text-white" value="ZAR">ZAR (R)</option>
                                                    </select>
                                                </div>
                                                <div className="px-4 py-1.5 flex items-center justify-between hover:bg-white/5 transition-colors rounded-xl">
                                                    <span className="text-xs font-semibold text-grey-300">Language</span>
                                                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer border-none uppercase pr-1">
                                                        <option className="bg-black text-white" value="en">English</option>
                                                        <option className="bg-black text-white" value="pl">Polski</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="py-1">
                                                <button onClick={logout} className="w-full text-left px-4 py-2 text-xs tracking-widest uppercase font-bold text-red-500 hover:text-red-400 hover:bg-white/5 transition-colors rounded-xl">
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="text-white/80 p-1.5 hover:text-white hover:scale-105 transition-all duration-200">
                                    <HiOutlineUser size={18} />
                                </Link>
                            )}
                            <Link to="/wishlist" className="hidden md:flex relative text-white/80 p-1.5 hover:text-white hover:scale-105 transition-all duration-200">
                                <HiOutlineHeart size={18} />
                                {wishlist.length > 0 && (
                                    <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full">{wishlist.length}</span>
                                )}
                            </Link>
                            <button onClick={() => setIsCartOpen(true)} className="relative text-white/80 p-1.5 hover:text-white hover:scale-105 transition-all duration-200">
                                <HiOutlineShoppingBag size={18} />
                                {cartCount > 0 && (
                                    <span className="absolute top-0.5 right-0.5 bg-white text-black text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full">{cartCount}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Overlay */}
                <AnimatePresence>
                    {searchOpen && (
                        <motion.div
                            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex items-center gap-4"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <form onSubmit={handleSearch} className="flex-1 flex items-center bg-white/5 border border-white/15 px-4 py-2.5 gap-3 rounded-full">
                                <HiOutlineSearch size={18} className="text-white/40 shrink-0" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    className="flex-1 bg-transparent border-none text-white text-sm placeholder:text-white/30 outline-none"
                                />
                                {searchQuery && (
                                    <button type="button" onClick={() => setSearchQuery('')} className="text-white/30 hover:text-white transition-colors">
                                        <HiX size={16} />
                                    </button>
                                )}
                            </form>
                            <button
                                type="button"
                                onClick={() => { if (searchQuery.trim()) { navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`); setSearchOpen(false); setSearchQuery(''); } }}
                                className="bg-white text-black px-5 py-2.5 text-xs font-bold tracking-wider uppercase rounded-full hover:bg-white/90 transition-colors shrink-0"
                            >
                                Search
                            </button>
                            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-white/40 hover:text-white p-2 transition-colors">
                                <HiX size={20} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div className="fixed inset-0 bg-black/70 z-[998]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
                        <motion.div
                            className="fixed top-0 left-0 w-[300px] h-screen bg-grey-900 z-[999] flex flex-col overflow-y-auto"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-grey-700">
                                <img src="/images/swerrve_logo_white.png" alt="Swerrv" className="h-20 object-contain" />
                                <button onClick={() => setMobileOpen(false)} className="text-white"><HiX size={22} /></button>
                            </div>
                            <nav className="flex flex-col p-6 gap-1">
                                <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0 }}>
                                    <button onClick={() => { setMobileOpen(false); setSearchOpen(true); }} className="w-full text-left text-lg font-semibold py-4 border-b border-white/5 text-white flex items-center gap-3">
                                        <HiOutlineSearch size={20} className="text-grey-400" /> Search
                                    </button>
                                </motion.div>
                                <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                                    <Link to="/wishlist" className="w-full text-left text-lg font-semibold py-4 border-b border-white/5 text-white flex items-center justify-between" onClick={() => setMobileOpen(false)}>
                                        <div className="flex items-center gap-3"><HiOutlineHeart size={20} className="text-grey-400" /> Saved Items</div>
                                        {wishlist.length > 0 && <span className="bg-white text-black text-[9px] font-black px-2 py-0.5 rounded-none">{wishlist.length}</span>}
                                    </Link>
                                </motion.div>
                                {navLinks.map((link, i) => (
                                    <motion.div key={link.label} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: (i + 2) * 0.07 }}>
                                        <Link to={link.to} className="block text-lg font-semibold py-4 border-b border-white/5 text-white" onClick={() => setMobileOpen(false)}>
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                                <div className="mt-4 border-t border-white/5 pt-4">
                                    <div className="flex items-center justify-between py-2 text-white">
                                        <span className="text-sm font-semibold text-grey-300">Language</span>
                                        <div className="flex gap-4">
                                            <button onClick={() => setLanguage('en')} className={`text-sm font-bold ${language === 'en' ? 'text-white' : 'text-grey-500'}`}>EN</button>
                                            <button onClick={() => setLanguage('pl')} className={`text-sm font-bold ${language === 'pl' ? 'text-white' : 'text-grey-500'}`}>PL</button>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <CartDrawer />
        </>
    );
};

export default Navbar;

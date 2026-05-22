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

const drawerVariants = {
    hidden: { x: '100%' },
    show: { 
        x: 0, 
        transition: { 
            type: 'spring', 
            stiffness: 260, 
            damping: 30, 
            staggerChildren: 0.05, 
            delayChildren: 0.1 
        } 
    }
};

const overlayVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.3 } }
};

const linkItemVariants = {
    hidden: { x: 30, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 22 } }
};

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
                        <motion.div 
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1010]" 
                            variants={overlayVariants}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            onClick={() => setMobileOpen(false)} 
                        />
                        <motion.div
                            className="fixed top-0 right-0 w-full sm:w-[420px] h-screen bg-black/95 backdrop-blur-3xl border-l border-white/10 z-[1020] flex flex-col justify-between p-6 overflow-y-auto shadow-2xl"
                            variants={drawerVariants}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between pb-6 border-b border-white/10">
                                <Link to="/" onClick={() => setMobileOpen(false)}>
                                    <img src="/images/swerrve_logo_white.png" alt="Swerrv" className="h-16 object-contain" />
                                </Link>
                                <button 
                                    onClick={() => setMobileOpen(false)} 
                                    className="text-white w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 hover:rotate-90 transition-all duration-300"
                                >
                                    <HiX size={20} />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex flex-col gap-1 mt-6">
                                <motion.div variants={linkItemVariants}>
                                    <button 
                                        onClick={() => { setMobileOpen(false); setSearchOpen(true); }} 
                                        className="w-full text-left text-2xl font-black uppercase tracking-[0.2em] py-3.5 border-b border-white/5 text-white flex items-center justify-between hover:text-white/80 transition-colors"
                                    >
                                        Search
                                        <HiOutlineSearch size={22} className="text-white/40" />
                                    </button>
                                </motion.div>
                                <motion.div variants={linkItemVariants}>
                                    <Link 
                                        to="/wishlist" 
                                        className="w-full text-left text-2xl font-black uppercase tracking-[0.2em] py-3.5 border-b border-white/5 text-white flex items-center justify-between hover:text-white/80 transition-colors" 
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <span>Wishlist</span>
                                        <div className="flex items-center gap-2">
                                            {wishlist.length > 0 && (
                                                <span className="bg-white text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                                                    {wishlist.length}
                                                </span>
                                            )}
                                            <HiOutlineHeart size={22} className="text-white/40" />
                                        </div>
                                    </Link>
                                </motion.div>
                                {navLinks.map((link) => (
                                    <motion.div key={link.label} variants={linkItemVariants}>
                                        <Link 
                                            to={link.to} 
                                            className="block text-2xl font-black uppercase tracking-[0.2em] py-3.5 border-b border-white/5 text-white hover:text-white/80 transition-colors duration-300" 
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            {/* User Profile Info / Login Status */}
                            {user ? (
                                <motion.div variants={linkItemVariants} className="mt-8 mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                                    <div className="flex items-center gap-3.5 mb-4 pb-4 border-b border-white/5">
                                        {user.profilePictureUrl ? (
                                            <img src={user.profilePictureUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                                                <HiOutlineUser size={20} />
                                            </div>
                                        )}
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-bold tracking-widest text-grey-500 uppercase">Signed in as</p>
                                            <p className="text-sm font-black text-white truncate capitalize mt-0.5">
                                                {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.name || user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link to="/profile" className="text-center py-2.5 text-[10px] font-bold tracking-widest uppercase text-white/70 hover:text-white bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300 rounded-xl" onClick={() => setMobileOpen(false)}>
                                            Profile
                                        </Link>
                                        <Link to="/orders" className="text-center py-2.5 text-[10px] font-bold tracking-widest uppercase text-white/70 hover:text-white bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300 rounded-xl" onClick={() => setMobileOpen(false)}>
                                            Orders
                                        </Link>
                                    </div>
                                    <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full mt-2.5 py-2.5 text-[10px] font-bold tracking-widest uppercase text-red-500 hover:text-red-400 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 rounded-xl">
                                        Logout
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div variants={linkItemVariants} className="mt-8 mb-6">
                                    <Link 
                                        to="/login" 
                                        className="flex items-center justify-center gap-2.5 w-full py-4 bg-white text-black text-xs font-black tracking-[0.2em] uppercase hover:bg-white/90 transition-all duration-300 rounded-full shadow-lg" 
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <HiOutlineUser size={16} />
                                        <span>Login / Register</span>
                                    </Link>
                                </motion.div>
                            )}

                            {/* Footer Selectors and Socials */}
                            <motion.div variants={linkItemVariants} className="mt-auto border-t border-white/10 pt-6">
                                <div className="flex flex-col gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                                    {/* Currency */}
                                    <div className="flex items-center justify-between text-white/80">
                                        <span className="text-[10px] font-bold tracking-widest text-grey-400 uppercase">Currency</span>
                                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-transparent text-xs text-white font-black tracking-wider outline-none cursor-pointer border-none uppercase pr-1">
                                            <option className="bg-black text-white" value="PLN">PLN (zł)</option>
                                            <option className="bg-black text-white" value="EUR">EUR (€)</option>
                                            <option className="bg-black text-white" value="GBP">GBP (£)</option>
                                            <option className="bg-black text-white" value="CAD">CAD ($)</option>
                                            <option className="bg-black text-white" value="USD">USD ($)</option>
                                            <option className="bg-black text-white" value="ZAR">ZAR (R)</option>
                                        </select>
                                    </div>
                                    {/* Language */}
                                    <div className="flex items-center justify-between text-white/80 border-t border-white/5 pt-3.5">
                                        <span className="text-[10px] font-bold tracking-widest text-grey-400 uppercase">Language</span>
                                        <div className="flex gap-4">
                                            <button onClick={() => setLanguage('en')} className={`text-xs font-black tracking-wider ${language === 'en' ? 'text-white border-b-2 border-white' : 'text-grey-500'}`}>EN</button>
                                            <button onClick={() => setLanguage('pl')} className={`text-xs font-black tracking-wider ${language === 'pl' ? 'text-white border-b-2 border-white' : 'text-grey-500'}`}>PL</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="flex justify-center gap-6 mt-6 pb-2 text-white/40">
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                                    </a>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                                    </a>
                                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.14 1.01.99 2.38 1.54 3.79 1.66v3.42c-.89-.11-1.78-.38-2.61-.75-.76-.35-1.46-.86-2.04-1.48v5.86c.03 2.05-.72 4.05-2.12 5.51-1.46 1.44-3.5 2.19-5.54 2.03-2.02-.12-3.92-1.15-5.16-2.77-1.37-1.74-1.85-4.04-1.32-6.22.45-1.92 1.7-3.6 3.42-4.54 1.16-.65 2.47-.97 3.8-.94v3.41c-.72-.03-1.45.13-2.1.47-.72.38-1.29.99-1.61 1.73-.39.89-.39 1.9 0 2.79.31.74.88 1.35 1.61 1.73.74.39 1.59.45 2.38.19.86-.27 1.6-.87 2.07-1.65.34-.58.52-1.25.53-1.93l-.02-12.98z"/></svg>
                                    </a>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <CartDrawer />
        </>
    );
};

export default Navbar;

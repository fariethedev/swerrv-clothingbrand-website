import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlineShoppingBag, HiOutlineHeart, HiMenu, HiX, HiOutlineUser } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { cartCount, setIsCartOpen } = useCart();
    const { wishlist } = useWishlist();
    const { user, logout, isAdmin } = useAuth();
    const { currency, setCurrency } = useCurrency();
    const { theme, toggleTheme } = useTheme();
    const { t, language, setLanguage } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
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

    const navLinks = [
        { to: '/shop?category=T-Shirts', label: t('nav.tshirts') },
        { to: '/shop?category=Hoodies', label: t('nav.hoodies') },
        { to: '/shop?category=Tracksuits', label: t('nav.tracksuits') },
        { to: '/about', label: t('nav.about') },
        { to: '/contact', label: t('nav.contact') },
    ];

    return (
        <>
            <motion.nav
                className={`always-dark fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-[70px] relative">
                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden text-white p-1.5" onClick={() => setMobileOpen(true)}>
                        <HiMenu size={22} />
                    </button>

                    {/* Nav Links (Desktop) */}
                    <div className="hidden lg:flex gap-7 items-center">
                        {navLinks.map(link => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="text-[11px] font-semibold tracking-[0.15em] uppercase text-grey-300 hover:text-white transition-colors duration-200 relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-200 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Logo */}
                    <Link to="/" className="absolute left-1/2 -translate-x-1/2 mt-1 md:mt-2">
                        <img src="/images/swerrve_logo_white.png" alt="Swerrv" className="h-[40px] md:h-[110px] object-contain w-auto max-w-[120px] md:max-w-none" />
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-4 relative z-10">
                        {isAdmin && (
                            <Link to="/admin" className="text-xs font-bold tracking-widest uppercase text-accent border border-accent px-3 py-1 hover:bg-accent hover:text-black transition-colors hidden md:block">
                                Admin Dashboard
                            </Link>
                        )}
                        <button onClick={() => setSearchOpen(true)} className="hidden md:block text-white p-1.5 hover:text-accent transition-colors duration-200">
                            <HiOutlineSearch size={20} />
                        </button>
                        {user ? (
                            <div className="group relative">
                                <button className="text-white p-1.5 hover:text-accent transition-colors duration-200">
                                    <HiOutlineUser size={20} />
                                </button>
                                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="bg-grey-900 border border-white/10 flex flex-col min-w-[200px] shadow-2xl">
                                        <div className="px-4 py-3 border-b border-white/10 text-xs text-grey-500">
                                            Signed in as <br /><strong className="text-white truncate block capitalize">{user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.name || user.email}</strong>
                                        </div>
                                        <div className="py-2 border-b border-white/10 flex flex-col">
                                            <Link to="/profile" className="text-left px-4 py-2 text-xs font-semibold text-grey-300 hover:text-white hover:bg-white/5 transition-colors">My Profile</Link>
                                            <Link to="/orders" className="text-left px-4 py-2 text-xs font-semibold text-grey-300 hover:text-white hover:bg-white/5 transition-colors">Order History</Link>
                                            <Link to="/wishlist" className="text-left px-4 py-2 text-xs font-semibold text-grey-300 hover:text-white hover:bg-white/5 transition-colors">Saved Items</Link>
                                        </div>
                                        <div className="py-2 border-b border-white/10 flex flex-col">
                                            <div className="px-4 py-2 flex items-center justify-between hover:bg-white/5 transition-colors">
                                                <span className="text-xs font-semibold text-grey-300">Currency</span>
                                                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer border-none">
                                                    <option className="bg-grey-900" value="PLN">PLN (zł)</option>
                                                    <option className="bg-grey-900" value="EUR">EUR (€)</option>
                                                    <option className="bg-grey-900" value="GBP">GBP (£)</option>
                                                    <option className="bg-grey-900" value="CAD">CAD ($)</option>
                                                    <option className="bg-grey-900" value="USD">USD ($)</option>
                                                </select>
                                            </div>
                                            <div className="px-4 py-2 flex items-center justify-between hover:bg-white/5 transition-colors">
                                                <span className="text-xs font-semibold text-grey-300">Language</span>
                                                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer border-none uppercase">
                                                    <option className="bg-grey-900" value="en">English</option>
                                                    <option className="bg-grey-900" value="pl">Polski</option>
                                                </select>
                                            </div>
                                            <div className="px-4 py-2 flex items-center justify-between hover:bg-white/5 transition-colors">
                                                <span className="text-xs font-semibold text-grey-300">Theme</span>
                                                <button onClick={toggleTheme} className="text-xs font-bold text-white uppercase tracking-wider">
                                                    {theme === 'dark' ? 'Dark' : 'Light'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="py-1">
                                            <button onClick={logout} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase font-bold text-grey-500 hover:text-brand-red hover:bg-white/5 transition-colors">
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="text-white p-1.5 hover:text-accent transition-colors duration-200">
                                <HiOutlineUser size={20} />
                            </Link>
                        )}
                        <Link to="/wishlist" className="hidden md:block relative text-white p-1.5 hover:text-accent transition-colors duration-200">
                            <HiOutlineHeart size={20} />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-0.5 -right-1 bg-accent text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{wishlist.length}</span>
                            )}
                        </Link>
                        <button onClick={() => setIsCartOpen(true)} className="relative text-white p-1.5 hover:text-accent transition-colors duration-200">
                            <HiOutlineShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-1 bg-accent text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Overlay */}
                <AnimatePresence>
                    {searchOpen && (
                        <motion.div
                            className="absolute top-full left-0 right-0 bg-grey-900 border-t border-grey-700 px-6 py-4 flex items-center gap-4"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <form onSubmit={handleSearch} className="flex-1 flex items-center bg-white/5 border border-grey-700 px-4 py-2.5 gap-3 rounded-sm">
                                <HiOutlineSearch size={18} className="text-grey-500 shrink-0" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none text-white text-sm placeholder:text-grey-500 outline-none"
                                />
                                <button type="submit" className="bg-accent text-black px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-sm">Search</button>
                            </form>
                            <button onClick={() => setSearchOpen(false)} className="text-grey-300 hover:text-white p-2">
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
                                        {wishlist.length > 0 && <span className="bg-accent text-black text-[10px] font-black px-2 py-0.5 rounded-full">{wishlist.length}</span>}
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
                                            <button onClick={() => setLanguage('en')} className={`text-sm font-bold ${language === 'en' ? 'text-accent' : 'text-grey-500'}`}>EN</button>
                                            <button onClick={() => setLanguage('pl')} className={`text-sm font-bold ${language === 'pl' ? 'text-accent' : 'text-grey-500'}`}>PL</button>
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

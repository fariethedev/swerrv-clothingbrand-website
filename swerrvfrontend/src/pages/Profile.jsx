import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineLocationMarker, HiOutlinePlus, HiOutlinePencilAlt,
    HiOutlineTrash, HiOutlineUserCircle, HiOutlineShoppingBag,
    HiOutlineCamera, HiOutlineHeart, HiOutlineLogout
} from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/* ── helpers ── */
const inputCls = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
    text-sm text-white placeholder-white/30 outline-none
    focus:border-white/40 focus:bg-white/8 transition-all duration-200`;

const labelCls = `block text-[10px] font-bold tracking-[0.18em] uppercase text-white/40 mb-1.5`;

const TAB_VARIANTS = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

/* ════════════════════════════════════════════════════════
   PROFILE PAGE
════════════════════════════════════════════════════════ */
const Profile = () => {
    const { user, updateUserProfile, logout, loading } = useAuth();
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const { wishlist } = useWishlist();
    const fileRef = useRef();

    const [activeTab, setActiveTab] = useState('details');

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        dateOfBirth: '', address: '', secondAddress: '',
        profilePictureUrl: ''
    });
    const [submittingUser, setSubmittingUser] = useState(false);
    const [saved, setSaved] = useState(false);

    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({ type: 'primary', addressString: '' });

    useEffect(() => {
        let active = true;
        if (!loading && !user) {
            navigate('/login');
        } else if (user && user.email !== formData.email) {
            const t = setTimeout(() => {
                if (active) setFormData({
                    firstName: user.firstName || '',
                    lastName:  user.lastName  || '',
                    email:     user.email     || '',
                    dateOfBirth: user.dateOfBirth || '',
                    address:      user.address      || '',
                    secondAddress: user.secondAddress || '',
                    profilePictureUrl: user.profilePictureUrl || ''
                });
            }, 0);
            return () => { active = false; clearTimeout(t); };
        }
    }, [user, loading, navigate, formData.email]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setFormData(p => ({ ...p, profilePictureUrl: reader.result }));
        reader.readAsDataURL(file);
    };

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setSubmittingUser(true);
        await updateUserProfile(formData);
        setSubmittingUser(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const startEditAddress = (type) => {
        setAddressForm({
            type,
            addressString: type === 'primary' ? formData.address : formData.secondAddress
        });
        setIsEditingAddress(true);
    };

    const saveAddress = async (e) => {
        e.preventDefault();
        setSubmittingUser(true);
        const np = { ...formData };
        if (addressForm.type === 'primary') np.address = addressForm.addressString;
        else np.secondAddress = addressForm.addressString;
        await updateUserProfile(np);
        setFormData(np);
        setIsEditingAddress(false);
        setSubmittingUser(false);
    };

    const deleteAddress = async (type) => {
        setSubmittingUser(true);
        const np = { ...formData };
        if (type === 'primary') np.address = '';
        else np.secondAddress = '';
        await updateUserProfile(np);
        setFormData(np);
        setSubmittingUser(false);
    };

    if (loading) return (
        <div className="min-h-screen bg-black pt-[70px] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    );

    if (!user) return null;

    const initials = `${formData.firstName?.[0] || ''}${formData.lastName?.[0] || ''}`.toUpperCase() || '?';

    const TABS = [
        { id: 'details',  label: 'Profile',   icon: <HiOutlineUserCircle size={17} /> },
        { id: 'address',  label: 'Addresses', icon: <HiOutlineLocationMarker size={17} /> },
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-[70px]">

            {/* ── Page wrapper ── */}
            <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10 space-y-8">

                {/* ══ HERO CARD ══ */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm p-8"
                >
                    {/* Subtle decorative glow */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 relative z-10">

                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 bg-white/10 flex items-center justify-center">
                                {formData.profilePictureUrl
                                    ? <img src={formData.profilePictureUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    : <span className="text-2xl font-black text-white/70">{initials}</span>
                                }
                            </div>
                            {/* Upload trigger */}
                            <button
                                onClick={() => fileRef.current?.click()}
                                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                title="Change photo"
                            >
                                <HiOutlineCamera size={14} />
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </div>

                        {/* Name & email */}
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                                {formData.firstName || formData.lastName
                                    ? `${formData.firstName} ${formData.lastName}`.trim()
                                    : 'Your Account'}
                            </h1>
                            <p className="text-sm text-white/40 mt-1">{formData.email}</p>
                        </div>

                        {/* Stats chips */}
                        <div className="flex gap-3 shrink-0">
                            <Link to="/shop/orders" className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors min-w-[70px]">
                                <HiOutlineShoppingBag size={18} className="text-white/60 mb-1" />
                                <span className="text-lg font-black">{cartItems?.length ?? 0}</span>
                                <span className="text-[10px] text-white/40 uppercase tracking-wider">Cart</span>
                            </Link>
                            <Link to="/wishlist" className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors min-w-[70px]">
                                <HiOutlineHeart size={18} className="text-white/60 mb-1" />
                                <span className="text-lg font-black">{wishlist?.length ?? 0}</span>
                                <span className="text-[10px] text-white/40 uppercase tracking-wider">Saved</span>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* ══ TAB NAV ══ */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="flex gap-2 bg-white/5 border border-white/10 rounded-2xl p-1.5"
                >
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setIsEditingAddress(false); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-250 ${
                                activeTab === tab.id
                                    ? 'bg-white text-black shadow'
                                    : 'text-white/50 hover:text-white'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                {/* ══ CONTENT ══ */}
                <AnimatePresence mode="wait">

                    {/* ─ Profile Details ─ */}
                    {activeTab === 'details' && (
                        <motion.div key="details" variants={TAB_VARIANTS} initial="initial" animate="animate" exit="exit">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold tracking-widest uppercase text-white/60">Personal Information</h2>
                                </div>

                                <form onSubmit={handleUserSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelCls}>First Name</label>
                                            <input type="text" name="firstName" value={formData.firstName} onChange={handleUserChange} required className={inputCls} placeholder="John" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Last Name</label>
                                            <input type="text" name="lastName" value={formData.lastName} onChange={handleUserChange} required className={inputCls} placeholder="Doe" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Date of Birth</label>
                                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleUserChange} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Email <span className="normal-case tracking-normal text-white/25 font-normal">(read-only)</span></label>
                                            <input type="email" name="email" value={formData.email} readOnly className={`${inputCls} opacity-50 cursor-not-allowed`} />
                                        </div>
                                    </div>

                                    <div className="pt-2 flex items-center gap-4">
                                        <motion.button
                                            type="submit"
                                            disabled={submittingUser}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="bg-white text-black text-xs font-bold tracking-widest uppercase px-8 py-3 rounded-full hover:bg-white/90 transition-colors disabled:opacity-50"
                                        >
                                            {submittingUser ? 'Saving…' : 'Save Changes'}
                                        </motion.button>

                                        <AnimatePresence>
                                            {saved && (
                                                <motion.span
                                                    key="saved"
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="text-xs text-white/50 font-medium"
                                                >
                                                    ✓ Saved
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </form>
                            </div>

                            {/* Danger zone */}
                            <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white/70">Sign out</p>
                                    <p className="text-xs text-white/30 mt-0.5">You'll be redirected to login</p>
                                </div>
                                <button
                                    onClick={() => { logout(); navigate('/login'); }}
                                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 border border-white/10 px-4 py-2 rounded-full hover:border-white/30 hover:text-white transition-all"
                                >
                                    <HiOutlineLogout size={15} />
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ─ Address Book ─ */}
                    {activeTab === 'address' && (
                        <motion.div key="address" variants={TAB_VARIANTS} initial="initial" animate="animate" exit="exit" className="space-y-4">
                            <AnimatePresence mode="wait">

                                {/* List view */}
                                {!isEditingAddress && (
                                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-sm font-bold tracking-widest uppercase text-white/60">Saved Addresses</h2>
                                            {(!formData.address || !formData.secondAddress) && (
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                    onClick={() => startEditAddress(formData.address ? 'secondary' : 'primary')}
                                                    className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all"
                                                >
                                                    <HiOutlinePlus size={14} /> Add Address
                                                </motion.button>
                                            )}
                                        </div>

                                        {!formData.address && !formData.secondAddress ? (
                                            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center flex flex-col items-center gap-4">
                                                <HiOutlineLocationMarker size={36} className="text-white/20" />
                                                <p className="text-sm text-white/40">No addresses saved yet</p>
                                                <button
                                                    onClick={() => startEditAddress('primary')}
                                                    className="text-xs font-bold uppercase tracking-widest text-white underline underline-offset-4 hover:text-white/70 transition-colors"
                                                >
                                                    Add your first address
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4">
                                                {formData.address && (
                                                    <AddressCard
                                                        label="Primary"
                                                        address={formData.address}
                                                        name={`${formData.firstName} ${formData.lastName}`}
                                                        onEdit={() => startEditAddress('primary')}
                                                        accent
                                                    />
                                                )}
                                                {formData.secondAddress && (
                                                    <AddressCard
                                                        label="Secondary"
                                                        address={formData.secondAddress}
                                                        name={`${formData.firstName} ${formData.lastName}`}
                                                        onEdit={() => startEditAddress('secondary')}
                                                        onDelete={() => deleteAddress('secondary')}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Edit view */}
                                {isEditingAddress && (
                                    <motion.div key="edit" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 space-y-5">
                                            <h2 className="text-sm font-bold tracking-widest uppercase text-white/60">
                                                {addressForm.type === 'primary' ? 'Edit Primary Address' : 'Edit Secondary Address'}
                                            </h2>
                                            <form onSubmit={saveAddress} className="space-y-5">
                                                <div>
                                                    <label className={labelCls}>Full Address</label>
                                                    <textarea
                                                        rows={4}
                                                        value={addressForm.addressString}
                                                        onChange={e => setAddressForm(p => ({ ...p, addressString: e.target.value }))}
                                                        required
                                                        placeholder="123 Main Street, City, State, ZIP, Country"
                                                        className={`${inputCls} resize-none`}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3 pt-2">
                                                    <motion.button
                                                        type="submit"
                                                        disabled={submittingUser}
                                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                                        className="bg-white text-black text-xs font-bold tracking-widest uppercase px-8 py-3 rounded-full hover:bg-white/90 transition-colors disabled:opacity-50"
                                                    >
                                                        {submittingUser ? 'Saving…' : 'Save Address'}
                                                    </motion.button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsEditingAddress(false)}
                                                        className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors px-4 py-3"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

/* ── Address Card sub-component ── */
const AddressCard = ({ label, address, name, onEdit, onDelete, accent }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-2xl border p-5 ${accent ? 'border-white/30 bg-white/[0.05]' : 'border-white/10 bg-white/[0.03]'}`}
    >
        {/* Label badge */}
        <span className={`absolute -top-3 left-5 text-[9px] font-black tracking-[0.2em] uppercase px-3 py-0.5 rounded-full ${accent ? 'bg-white text-black' : 'bg-white/10 text-white/60 border border-white/10'}`}>
            {label}
        </span>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={onEdit} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all" title="Edit">
                <HiOutlinePencilAlt size={15} />
            </button>
            {onDelete && (
                <button onClick={onDelete} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                    <HiOutlineTrash size={15} />
                </button>
            )}
        </div>

        <p className="font-bold text-white text-sm mb-1.5 pr-20">{name}</p>
        <p className="text-sm text-white/40 leading-relaxed whitespace-pre-line">{address}</p>
    </motion.div>
);

export default Profile;

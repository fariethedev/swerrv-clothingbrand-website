import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { HiOutlineLocationMarker, HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineUserCircle } from 'react-icons/hi';

const Profile = () => {
    const { user, updateUserProfile, loading } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('details'); // 'details' or 'address'

    // User Details State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [submittingUser, setSubmittingUser] = useState(false);

    // MOCK Address State (since backend doesn't have an address endpoint right now)
    // We will simulate the Shein functionality by storing it in local storage temporarily
    const [addresses, setAddresses] = useState([]);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({
        fullName: '',
        phone: '',
        country: '',
        state: '',
        city: '',
        zipCode: '',
        addressLine1: '',
        isDefault: false
    });

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || ''
            });
            // Try load mocked addresses
            const savedAddresses = localStorage.getItem('swerrv_addresses_' + user?.id);
            if (savedAddresses) {
                setAddresses(JSON.parse(savedAddresses));
            } else {
                setAddresses([]);
            }
        }
    }, [user, loading, navigate]);

    // Save mocked addresses
    useEffect(() => {
        if (user && user.id) {
            localStorage.setItem('swerrv_addresses_' + user.id, JSON.stringify(addresses));
        }
    }, [addresses, user]);

    // Handle normal user details update
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setSubmittingUser(true);
        await updateUserProfile(formData);
        setSubmittingUser(false);
    };

    // Address Box Handlers
    const handleAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddressForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const selectCountry = (val) => setAddressForm(prev => ({ ...prev, country: val }));
    const selectRegion = (val) => setAddressForm(prev => ({ ...prev, state: val }));

    const saveAddress = (e) => {
        e.preventDefault();
        let newAddresses = [...addresses];

        if (addressForm.isDefault) {
            // Unset other defaults
            newAddresses = newAddresses.map(a => ({ ...a, isDefault: false }));
        }

        const newAddr = { ...addressForm, id: Date.now().toString() };
        // If first address, make it default automatically
        if (newAddresses.length === 0) {
            newAddr.isDefault = true;
        }

        setAddresses([newAddr, ...newAddresses]);
        setIsAddingAddress(false);
        setAddressForm({
            fullName: '', phone: '', country: '', state: '', city: '', zipCode: '', addressLine1: '', isDefault: false
        });
    };

    const deleteAddress = (id) => {
        setAddresses(addresses.filter(a => a.id !== id));
    };

    const setAsDefault = (id) => {
        setAddresses(addresses.map(a => ({
            ...a,
            isDefault: a.id === id
        })));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black pt-[70px] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black pt-[70px]">
            {/* Small visual flair: spinning logo subtly in corner */}
            <div className="fixed top-24 right-10 w-40 h-40 opacity-20 mix-blend-screen pointer-events-none rounded-full overflow-hidden z-0 hidden lg:block">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="/images/logovideo.mov" type="video/mp4" />
                </video>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 py-10 relative z-10">
                <div className="mb-10 border-b border-white/10 pb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-5">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase mb-2">My Account</h1>
                        <p className="text-grey-400">Manage your profile and shipping details.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex items-center gap-3 px-5 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 border-l-2 ${activeTab === 'details' ? 'bg-grey-900 border-accent text-white' : 'border-transparent text-grey-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <HiOutlineUserCircle size={20} /> Profile Details
                        </button>
                        <button
                            onClick={() => setActiveTab('address')}
                            className={`flex items-center gap-3 px-5 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 border-l-2 ${activeTab === 'address' ? 'bg-grey-900 border-accent text-white' : 'border-transparent text-grey-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <HiOutlineLocationMarker size={20} /> Address Book
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {/* Profile Details Tab */}
                            {activeTab === 'details' && (
                                <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-grey-900 border border-white/10 p-6 md:p-8">
                                    <h2 className="text-lg font-bold tracking-widest uppercase text-white mb-6">Personal Information</h2>
                                    <form onSubmit={handleUserSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">First Name</label>
                                                <input type="text" name="firstName" value={formData.firstName} onChange={handleUserChange} required className="form-input" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">Last Name</label>
                                                <input type="text" name="lastName" value={formData.lastName} onChange={handleUserChange} required className="form-input" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">Email Address <span className="text-grey-600 lowercase tracking-normal">(Read Only if Google Auth)</span></label>
                                            <input type="email" name="email" value={formData.email} onChange={handleUserChange} required className="form-input opacity-80" readOnly />
                                        </div>
                                        <button type="submit" disabled={submittingUser} className="btn-primary w-full sm:w-auto">
                                            {submittingUser ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Address Book Tab */}
                            {activeTab === 'address' && (
                                <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    {!isAddingAddress ? (
                                        <>
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-lg font-bold tracking-widest uppercase text-white">Saved Addresses</h2>
                                                <button onClick={() => setIsAddingAddress(true)} className="btn-secondary flex items-center gap-2 text-xs py-2 px-4">
                                                    <HiOutlinePlus size={16} /> Add New
                                                </button>
                                            </div>

                                            {addresses.length === 0 ? (
                                                <div className="bg-grey-900 border border-white/5 border-dashed p-10 text-center flex flex-col items-center">
                                                    <HiOutlineLocationMarker size={40} className="text-grey-600 mb-4" />
                                                    <p className="text-grey-400 mb-4">No shipping addresses saved yet.</p>
                                                    <button onClick={() => setIsAddingAddress(true)} className="text-accent underline text-sm font-bold uppercase tracking-widest">Add your first address</button>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    {addresses.map(addr => (
                                                        <div key={addr.id} className={`bg-grey-900 border p-5 relative transition-all ${addr.isDefault ? 'border-accent' : 'border-white/10'}`}>
                                                            {addr.isDefault && (
                                                                <span className="absolute -top-3 left-4 bg-accent text-black text-[10px] font-black uppercase tracking-widest px-2 py-0.5">Default</span>
                                                            )}
                                                            <div className="absolute top-4 right-4 flex gap-3 text-grey-500">
                                                                <button onClick={() => deleteAddress(addr.id)} className="hover:text-brand-red transition-colors" title="Delete"><HiOutlineTrash size={18} /></button>
                                                            </div>

                                                            <p className="font-bold text-white mb-2 tracking-wide truncate pr-16">{addr.fullName}</p>
                                                            <p className="text-sm text-grey-400 mb-1">{addr.phone}</p>
                                                            <p className="text-sm text-grey-400 leading-relaxed max-w-[90%]">
                                                                {addr.addressLine1} <br />
                                                                {addr.city}, {addr.state} {addr.zipCode} <br />
                                                                {addr.country}
                                                            </p>

                                                            {!addr.isDefault && (
                                                                <button onClick={() => setAsDefault(addr.id)} className="mt-4 text-[11px] font-bold tracking-widest uppercase text-grey-500 hover:text-white underline">
                                                                    Set as Default
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="bg-grey-900 border border-white/10 p-6 md:p-8">
                                            <h2 className="text-lg font-bold tracking-widest uppercase text-white mb-6">Add New Address</h2>
                                            <form onSubmit={saveAddress} className="space-y-5">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">Full Name</label>
                                                        <input type="text" name="fullName" value={addressForm.fullName} onChange={handleAddressChange} required className="form-input py-2.5" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">Phone Number</label>
                                                        <input type="tel" name="phone" value={addressForm.phone} onChange={handleAddressChange} required className="form-input py-2.5" />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                    <div className="space-y-1.5 flex flex-col">
                                                        <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">Country/Region</label>
                                                        <CountryDropdown
                                                            value={addressForm.country}
                                                            onChange={(val) => selectCountry(val)}
                                                            classes="form-input py-2.5 bg-black"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5 flex flex-col">
                                                        <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">State/Province</label>
                                                        <RegionDropdown
                                                            country={addressForm.country}
                                                            value={addressForm.state}
                                                            onChange={(val) => selectRegion(val)}
                                                            classes="form-input py-2.5 bg-black"
                                                            disableWhenEmpty={true}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">City</label>
                                                        <input type="text" name="city" value={addressForm.city} onChange={handleAddressChange} required className="form-input py-2.5" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">Zip/Postal Code</label>
                                                        <input type="text" name="zipCode" value={addressForm.zipCode} onChange={handleAddressChange} required className="form-input py-2.5" />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">Address Line 1</label>
                                                    <input type="text" name="addressLine1" value={addressForm.addressLine1} onChange={handleAddressChange} required placeholder="Street address, P.O. box, company name, c/o" className="form-input py-2.5" />
                                                </div>

                                                <div className="flex items-center gap-3 pt-2">
                                                    <input type="checkbox" id="isDefault" name="isDefault" checked={addressForm.isDefault} onChange={handleAddressChange} className="w-4 h-4 accent-accent" />
                                                    <label htmlFor="isDefault" className="text-sm font-semibold text-white">Make this my default shipping address</label>
                                                </div>

                                                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                                    <button type="submit" className="btn-primary py-3 px-8 text-xs">Save Address</button>
                                                    <button type="button" onClick={() => setIsAddingAddress(false)} className="text-white hover:text-brand-red font-bold text-xs uppercase tracking-widest transition-colors py-3 px-4">Cancel</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

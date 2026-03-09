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

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        address: '',
        secondAddress: '',
        profilePictureUrl: ''
    });
    const [submittingUser, setSubmittingUser] = useState(false);

    // MOCK Address State will be repurposed here to just handle editing 
    // the user's two addresses (Primary Address and Second Address)
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({
        type: 'primary',
        addressString: ''
    });

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                dateOfBirth: user.dateOfBirth || '',
                address: user.address || '',
                secondAddress: user.secondAddress || '',
                profilePictureUrl: user.profilePictureUrl || ''
            });
        }
    }, [user, loading, navigate]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePictureUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

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
        setAddressForm(prev => ({ ...prev, addressString: e.target.value }));
    };

    const startEditAddress = (type) => {
        setAddressForm({
            type: type,
            addressString: type === 'primary' ? formData.address : formData.secondAddress
        });
        setIsEditingAddress(true);
    };

    const saveAddress = async (e) => {
        e.preventDefault();
        setSubmittingUser(true);
        const newProfile = { ...formData };
        if (addressForm.type === 'primary') {
            newProfile.address = addressForm.addressString;
        } else {
            newProfile.secondAddress = addressForm.addressString;
        }

        await updateUserProfile(newProfile);
        setFormData(newProfile);
        setIsEditingAddress(false);
        setSubmittingUser(false);
    };

    const deleteAddress = async (type) => {
        setSubmittingUser(true);
        const newProfile = { ...formData };
        if (type === 'primary') {
            // Shouldn't really delete primary, but if they want to...
            newProfile.address = '';
        } else {
            newProfile.secondAddress = '';
        }
        await updateUserProfile(newProfile);
        setFormData(newProfile);
        setSubmittingUser(false);
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
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">Date of Birth</label>
                                                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleUserChange} className="form-input" style={{ color: formData.dateOfBirth ? 'inherit' : 'gray' }} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">Email Address <span className="text-grey-600 lowercase tracking-normal">(Read Only if Google Auth)</span></label>
                                            <input type="email" name="email" value={formData.email} onChange={handleUserChange} required className="form-input opacity-80" readOnly />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">Profile Picture</label>
                                            <div className="flex items-center gap-4">
                                                {formData.profilePictureUrl && (
                                                    <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20 shrink-0">
                                                        <img src={formData.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-grey-300" />
                                            </div>
                                        </div>

                                        <button type="submit" disabled={submittingUser} className="btn-primary w-full sm:w-auto mt-4">
                                            {submittingUser ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Address Book Tab */}
                            {activeTab === 'address' && (
                                <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    {!isEditingAddress ? (
                                        <>
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-lg font-bold tracking-widest uppercase text-white">Saved Addresses</h2>
                                                {(!formData.address || !formData.secondAddress) && (
                                                    <button onClick={() => startEditAddress(formData.address ? 'secondary' : 'primary')} className="btn-secondary flex items-center gap-2 text-xs py-2 px-4">
                                                        <HiOutlinePlus size={16} /> Add Address
                                                    </button>
                                                )}
                                            </div>

                                            {(!formData.address && !formData.secondAddress) ? (
                                                <div className="bg-grey-900 border border-white/5 border-dashed p-10 text-center flex flex-col items-center">
                                                    <HiOutlineLocationMarker size={40} className="text-grey-600 mb-4" />
                                                    <p className="text-grey-400 mb-4">No shipping addresses saved yet.</p>
                                                    <button onClick={() => startEditAddress('primary')} className="text-accent underline text-sm font-bold uppercase tracking-widest">Add your first address</button>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-5">
                                                    {formData.address && (
                                                        <div className={`bg-grey-900 border p-5 relative transition-all border-accent`}>
                                                            <span className="absolute -top-3 left-4 bg-accent text-black text-[10px] font-black uppercase tracking-widest px-2 py-0.5">Primary</span>
                                                            <div className="absolute top-4 right-4 flex gap-3 text-grey-500">
                                                                <button onClick={() => startEditAddress('primary')} className="hover:text-white transition-colors" title="Edit"><HiOutlinePencilAlt size={18} /></button>
                                                            </div>
                                                            <p className="font-bold text-white mb-2 tracking-wide truncate pr-16">{formData.firstName} {formData.lastName}</p>
                                                            <p className="text-sm text-grey-400 leading-relaxed max-w-[90%] whitespace-pre-line">
                                                                {formData.address}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {formData.secondAddress && (
                                                        <div className={`bg-grey-900 border p-5 relative transition-all border-white/10`}>
                                                            <span className="absolute -top-3 left-4 bg-grey-700 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5">Secondary</span>
                                                            <div className="absolute top-4 right-4 flex gap-3 text-grey-500">
                                                                <button onClick={() => startEditAddress('secondary')} className="hover:text-white transition-colors" title="Edit"><HiOutlinePencilAlt size={18} /></button>
                                                                <button onClick={() => deleteAddress('secondary')} className="hover:text-brand-red transition-colors" title="Delete"><HiOutlineTrash size={18} /></button>
                                                            </div>
                                                            <p className="font-bold text-white mb-2 tracking-wide truncate pr-16">{formData.firstName} {formData.lastName}</p>
                                                            <p className="text-sm text-grey-400 leading-relaxed max-w-[90%] whitespace-pre-line">
                                                                {formData.secondAddress}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="bg-grey-900 border border-white/10 p-6 md:p-8">
                                            <h2 className="text-lg font-bold tracking-widest uppercase text-white mb-6">
                                                {addressForm.type === 'primary' ? 'Edit Primary Address' : 'Edit Secondary Address'}
                                            </h2>
                                            <form onSubmit={saveAddress} className="space-y-5">
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">Full Address</label>
                                                    <textarea
                                                        rows="4"
                                                        value={addressForm.addressString}
                                                        onChange={handleAddressChange}
                                                        required
                                                        placeholder="123 Main Street, City, State, ZIP, Country"
                                                        className="form-input py-2.5 resize-none"
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                                    <button type="submit" disabled={submittingUser} className="btn-primary py-3 px-8 text-xs">{submittingUser ? 'Saving...' : 'Save Address'}</button>
                                                    <button type="button" onClick={() => setIsEditingAddress(false)} className="text-white hover:text-brand-red font-bold text-xs uppercase tracking-widest transition-colors py-3 px-4">Cancel</button>
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

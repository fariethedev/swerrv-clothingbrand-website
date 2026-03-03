/* eslint-disable react-hooks/set-state-in-effect, no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiHeart, HiOutlineHeart, HiArrowLeft, HiCheckCircle } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const StarRating = ({ rating, interactive = false, onRate }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <span key={s} className={`text-sm ${s <= Math.round(rating) ? 'text-accent' : 'text-grey-700'} ${interactive ? 'cursor-pointer' : ''}`} onClick={() => interactive && onRate && onRate(s)}>★</span>
        ))}
    </div>
);

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const { user: currentUser } = useAuth();
    const { formatPrice } = useCurrency();

    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedImg, setSelectedImg] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');


    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0); // Scroll to top when id changes

        Promise.all([
            api.getProductById(id)
        ]).then(([productData]) => {
            setProduct(productData);

            // Fetch related products (same category)
            api.getProducts().then(allProducts => {
                const relatedProducts = allProducts.filter(p => p.category === productData.category && p.id !== productData.id).slice(0, 4);
                setRelated(relatedProducts);
                setLoading(false);
            });
        }).catch(err => {
            console.error('Error fetching product data:', err);
            setLoading(false);
        });
    }, [id]);

    if (loading) return (
        <div className="min-h-screen pt-[70px] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-grey-800 border-t-accent rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-[70px]">
            <h2 className="text-2xl font-bold">Product not found</h2>
            <Link to="/shop" className="btn-primary">Back to Shop</Link>
        </div>
    );

    const wishlisted = isWishlisted(product.id);


    const handleAddToCart = () => {
        if (!selectedSize) { toast.error('Please select a size'); return; }
        addToCart(product, selectedSize, quantity);
        toast.success('Added to bag!', { style: { background: '#111', color: '#fff', border: '1px solid #333' } });
    };



    return (
        <div className="min-h-screen pt-[70px]">
            <div className="max-w-[1400px] mx-auto px-6">
                <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] uppercase text-grey-300 hover:text-accent transition-colors duration-200 py-8">
                    <HiArrowLeft size={16} /> Back to Shop
                </Link>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 pb-20">
                    {/* Gallery */}
                    <div className="lg:sticky lg:top-[90px] h-fit">
                        <motion.div key={selectedImg} className="relative aspect-[3/4] overflow-hidden bg-grey-700" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                            <img src={product.images && product.images[selectedImg] ? product.images[selectedImg] : product.image} alt={product.name} className="w-full h-full object-cover" />
                            {product.comingSoon ? (
                                <span className="absolute top-4 left-4 bg-white text-black px-3 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase rounded-sm">Coming Soon</span>
                            ) : product.originalPrice ? (
                                <span className="absolute top-4 left-4 tag-sale">Sale</span>
                            ) : null}
                        </motion.div>
                        {product.images?.length > 1 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-2 custom-scrollbar">
                                {product.images.map((img, i) => (
                                    <button key={i} onClick={() => setSelectedImg(i)} className={`shrink-0 overflow-hidden border-2 transition-colors duration-200 ${i === selectedImg ? 'border-accent' : 'border-transparent'}`} style={{ width: 72, height: 88 }}>
                                        <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <motion.div className="flex flex-col gap-5" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                        <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">{product.category}</p>
                        <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-none">{product.name}</h1>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-grey-300">
                            <span className={`text-xs font-bold px-2 py-0.5 ${product.stock < 10 ? 'text-brand-red bg-brand-red/10' : 'text-brand-green bg-brand-green/10'}`}>
                                {product.stock < 10 ? `Only ${product.stock} left!` : 'In Stock'}
                            </span>
                        </div>

                        <div className="flex items-baseline gap-4">
                            {product.comingSoon ? (
                                <span className="text-4xl font-black text-grey-500 italic">Coming Soon</span>
                            ) : (
                                <>
                                    <span className="text-4xl font-black">{formatPrice(product.price)}</span>
                                    {product.originalPrice && <span className="text-xl text-grey-500 line-through">{formatPrice(product.originalPrice)}</span>}
                                </>
                            )}
                        </div>

                        {/* Sizes */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-sm font-semibold">Size: <strong>{selectedSize || 'Select'}</strong></p>
                                <a href="#" className="text-xs text-grey-500 underline hover:text-accent">Size Guide</a>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {product.sizes?.map(size => (
                                    <button key={size} onClick={() => setSelectedSize(size)}
                                        className={`min-w-[52px] h-11 border text-sm font-semibold transition-all duration-200 ${selectedSize === size ? 'bg-accent text-black border-accent' : 'bg-transparent text-grey-300 border-grey-700 hover:border-white hover:text-white'}`}>
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Qty */}
                        <div>
                            <p className="text-sm font-semibold mb-2">Quantity</p>
                            <div className="inline-flex border border-grey-700">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 text-xl bg-transparent text-white hover:bg-grey-700 transition-colors">−</button>
                                <span className="w-14 h-11 flex items-center justify-center text-sm font-bold">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 text-xl bg-transparent text-white hover:bg-grey-700 transition-colors">+</button>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex gap-3">
                            <motion.button onClick={handleAddToCart} whileTap={!product.comingSoon ? { scale: 0.98 } : {}}
                                disabled={product.comingSoon}
                                className={`flex-1 py-4 text-[13px] font-extrabold tracking-[0.15em] uppercase transition-colors duration-200 ${product.comingSoon ? 'bg-grey-800 text-grey-500 cursor-not-allowed' : 'bg-accent text-black hover:bg-accent-dark'}`}>
                                {product.comingSoon ? 'Coming Soon' : 'Add to Bag'}
                            </motion.button>
                            <button onClick={() => toggleWishlist(product)}
                                className={`w-[52px] h-[52px] border flex items-center justify-center transition-all duration-200 ${wishlisted ? 'border-accent text-accent' : 'border-grey-700 text-white hover:border-accent hover:text-accent'}`}>
                                {wishlisted ? <HiHeart size={20} /> : <HiOutlineHeart size={20} />}
                            </button>
                        </div>

                        <p className="text-sm text-grey-500">Material: {product.material}</p>

                        {/* Tabs */}
                        <div className="border-t border-white/[0.08] pt-6">
                            <div className="flex border-b border-white/[0.08] mb-6">
                                {['description', 'shipping'].map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)}
                                        className={`px-5 py-2.5 text-xs font-bold tracking-[0.1em] uppercase border-b-2 -mb-px transition-all duration-200 ${activeTab === tab ? 'text-accent border-accent' : 'text-grey-500 border-transparent hover:text-white'}`}>
                                        {tab[0].toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                                    {activeTab === 'description' && <p className="text-sm text-grey-300 leading-relaxed">{product.description}</p>}



                                    {activeTab === 'shipping' && (
                                        <div className="flex flex-col gap-3 text-sm text-grey-300">
                                            <p className="font-semibold text-white">Free standard shipping on orders over 400 PLN.</p>
                                            <p>• Standard: 5–7 business days — Free (400 PLN+) / 40 PLN</p>
                                            <p>• Express: 2–3 business days — 80 PLN</p>
                                            <p>• Overnight: 1 business day — 160 PLN</p>
                                            <p className="mt-2">Easy returns within 30 days of delivery.</p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>

                {/* Related */}
                {related.length > 0 && (
                    <section className="py-14 border-t border-white/[0.06] mb-10">
                        <motion.p className="section-label mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>You May Also Like</motion.p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;

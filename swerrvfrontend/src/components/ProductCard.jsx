import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiOutlineHeart, HiOutlineShoppingCart } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';

const ProductCard = ({ product, index = 0 }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const { formatPrice } = useCurrency();
    const wishlisted = isWishlisted(product.id);

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!product.comingSoon) {
            addToCart(product, product.sizes[0]);
        }
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    return (
        <motion.div
            className="flex flex-col group bg-[#0d0d0d] rounded-2xl p-3 pb-4 border border-white/5 hover:border-white/20 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            whileHover={{ y: -6 }}
        transition={{ duration: 0.5, delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
        >
            <Link to={`/product/${product.id}`} className="block relative">
                {/* Image Area */}
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-grey-800 mb-4">
                    <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${product.comingSoon ? 'blur-[2px] opacity-80' : ''}`}
                        loading="lazy"
                        decoding="async"
                    />

                    {/* Coming soon overlay */}
                    {product.comingSoon && (
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <span className="text-white text-[10px] font-black tracking-widest uppercase bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                Coming Soon
                            </span>
                        </div>
                    )}

                    {/* Badges (Non-coming-soon) */}
                    {!product.comingSoon && product.originalPrice && (
                        <motion.span
                            className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-red-500 text-white"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                            Sale
                        </motion.span>
                    )}
                    {!product.comingSoon && !product.originalPrice && product.isNew && (
                        <motion.span
                            className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-accent/20 text-accent border border-accent/20"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                            New
                        </motion.span>
                    )}

                    {/* Wishlist Button */}
                    {!product.comingSoon && (
                        <button
                            onClick={handleWishlist}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 hover:scale-110 transition-all duration-200 z-10"
                        >
                            {wishlisted ? <HiHeart size={15} className="text-accent" /> : <HiOutlineHeart size={15} />}
                        </button>
                    )}
                </div>

                {/* Info Area */}
                <div className="flex flex-col gap-1 px-1">
                    <h3 className="text-[14px] font-medium text-white/90 leading-snug line-clamp-1">{product.name}</h3>

                    <div className="flex items-end justify-between mt-1">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-medium tracking-wider uppercase text-grey-500">Price</span>
                            {product.comingSoon ? (
                                <span className="text-sm font-semibold text-grey-500 italic">TBA</span>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-bold text-white">{formatPrice(product.price)}</span>
                                    {product.originalPrice && (
                                        <span className="text-xs text-grey-500 line-through">{formatPrice(product.originalPrice)}</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart Button */}
                        {!product.comingSoon && (
                            <motion.button
                                onClick={handleQuickAdd}
                                className="w-10 h-10 rounded-xl bg-accent text-black flex items-center justify-center hover:bg-white transition-colors duration-300 z-10 relative"
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <HiOutlineShoppingCart size={18} />
                            </motion.button>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;

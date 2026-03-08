import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
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
            className="flex flex-col group"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
        >
            <Link to={`/product/${product.id}`} className="block">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-grey-700">
                    <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${product.comingSoon ? 'blur-[3px] scale-105' : ''}`}
                        loading="lazy"
                    />

                    {/* Coming soon overlay */}
                    {product.comingSoon && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                            <span className="text-white text-[11px] font-black tracking-[0.25em] uppercase border border-white/40 px-4 py-2 backdrop-blur-sm">
                                Coming Soon
                            </span>
                        </div>
                    )}

                    {/* Badges (non-coming-soon) */}
                    {!product.comingSoon && product.originalPrice && (
                        <span className="absolute top-3 left-3 tag-sale">Sale</span>
                    )}
                    {!product.comingSoon && !product.originalPrice && product.isNew && (
                        <span className="absolute top-3 left-3 tag-new">New</span>
                    )}

                    {/* Wishlist — disabled for coming soon */}
                    {!product.comingSoon && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <button
                                onClick={handleWishlist}
                                className="bg-black/80 backdrop-blur-sm text-white w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                            >
                                {wishlisted ? <HiHeart size={16} className="text-accent" /> : <HiOutlineHeart size={16} />}
                            </button>
                        </div>
                    )}

                    {/* Quick Add — hidden entirely for coming soon */}
                    {!product.comingSoon && (
                        <button
                            onClick={handleQuickAdd}
                            className="absolute bottom-0 left-0 right-0 bg-accent/95 text-black py-3 text-[11px] font-extrabold tracking-[0.15em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                        >
                            Quick Add
                        </button>
                    )}
                </div>


                {/* Info */}
                <div className="pt-3.5 pb-1 flex flex-col gap-1">
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-grey-500">{product.category}</p>
                    <h3 className="text-[13px] font-semibold tracking-[0.04em] text-white leading-snug">{product.name}</h3>

                    <div className="flex items-center gap-2 mt-1">
                        {product.comingSoon ? (
                            <span className="text-[13px] font-bold text-grey-500 italic">Coming Soon</span>
                        ) : (
                            <>
                                <span className="text-[13px] font-bold">{formatPrice(product.price)}</span>
                                {product.originalPrice && (
                                    <span className="text-xs text-grey-500 line-through">{formatPrice(product.originalPrice)}</span>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;

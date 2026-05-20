import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiOutlineHeart, HiOutlineShoppingBag } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import StarRating from './StarRating';
import './DetailedProductCard.css';

const DetailedProductCard = ({ product, index = 0 }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const { formatPrice } = useCurrency();
    const wishlisted = isWishlisted(product.id);

    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!product.comingSoon) {
            addToCart(product, product.sizes?.[0] || 'M');
        }
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    return (
        <motion.div
            className="detailed-product-card group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
        >
            <Link to={`/product/${product.id}`} className="detailed-card-link">
                <div className="detailed-card-img-wrap">
                    <img
                        src={product.image}
                        alt={product.name}
                        className={`detailed-card-img ${product.comingSoon ? 'coming-soon-blur' : ''}`}
                        loading="lazy"
                        decoding="async"
                    />

                    {/* Circular Discount Badge */}
                    {discountPercentage && !product.comingSoon && (
                        <div className="detailed-card-sale-badge">
                            -{discountPercentage}%
                        </div>
                    )}

                    {/* Wishlist Button */}
                    {!product.comingSoon && (
                        <button
                            onClick={handleWishlist}
                            className="detailed-card-wish-btn"
                        >
                            {wishlisted ? <HiHeart size={16} /> : <HiOutlineHeart size={16} />}
                        </button>
                    )}

                    {/* Quick Add Overlay */}
                    {!product.comingSoon && (
                        <button
                            onClick={handleQuickAdd}
                            className="detailed-card-quick-add"
                        >
                            <HiOutlineShoppingBag size={18} />
                            <span>Quick Add</span>
                        </button>
                    )}
                </div>

                <div className="detailed-card-info">
                    <div className="detailed-card-meta">
                        <span className="detailed-card-cat">{product.category}</span>
                        {product.material && <span className="detailed-card-tag">{product.material}</span>}
                    </div>

                    <h3 className="detailed-card-name">{product.name}</h3>

                    {product.description && (
                        <p className="detailed-card-desc">
                            {product.description.length > 60
                                ? `${product.description.substring(0, 60)}...`
                                : product.description}
                        </p>
                    )}

                    <div className="detailed-card-rating">
                        <StarRating rating={product.rating || 4.5} count={product.ratingCount || 0} />
                    </div>

                    <div className="detailed-card-pricing">
                        <span className="detailed-card-price">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                            <span className="detailed-card-price-original">
                                {formatPrice(product.originalPrice)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default DetailedProductCard;

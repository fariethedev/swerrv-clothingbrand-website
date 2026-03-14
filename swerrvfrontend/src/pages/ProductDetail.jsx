/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HiHeart, HiOutlineHeart, HiArrowLeft, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import './ProductDetail.css';

/* ─────────────────────────── Accordion ─────────────────────────── */
const Accordion = ({ title, children }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="pd-accordion">
            <button className="pd-accordion-trigger" onClick={() => setOpen(o => !o)}>
                <span>{title}</span>
                {open ? <HiChevronUp size={14} /> : <HiChevronDown size={14} />}
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <div
                        key="content"
                        className="pd-accordion-body"
                    >
                        {children}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ─────────────────────────── Main Component ─────────────────────── */
const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const { formatPrice } = useCurrency();

    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedImg, setSelectedImg] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity] = useState(1);

    const styledRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        setSelectedImg(0);
        setSelectedSize('');
        setSelectedColor('');
        window.scrollTo(0, 0);

        api.getProductById(id).then(productData => {
            setProduct(productData);
            api.getProducts().then(all => {
                setRelated(all.filter(p => p.category === productData.category && p.id !== productData.id).slice(0, 6));
                setLoading(false);
            });
        }).catch(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="pd-loading">
            <div className="pd-spinner" />
        </div>
    );

    if (!product) return (
        <div className="pd-not-found">
            <h2>Product not found</h2>
            <Link to="/shop" className="btn-primary">Back to Shop</Link>
        </div>
    );

    const images = product.images?.length ? product.images : [product.image].filter(Boolean);
    const wishlisted = isWishlisted(product.id);
    const isOnSale = !!product.originalPrice && !product.comingSoon;

    const handleAddToCart = () => {
        if (!selectedSize) { toast.error('Please select a size'); return; }
        if (productColors.length > 0 && !selectedColor) { toast.error('Please select a colour'); return; }
        addToCart({ ...product, selectedColor }, selectedSize, quantity);
        toast.success('Added to bag!', { style: { background: '#111', color: '#fff', border: '1px solid #333' } });
    };

    /* ── Sizes catalogue ── */
    const allSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const productSizes = product.sizes?.length ? product.sizes : allSizes;

    /* ── Colours ── */
    const productColors = product.colors?.length ? product.colors : [];
    const colorMap = {
        'black': '#111111', 'white': '#f5f5f5', 'charcoal': '#36454f',
        'olive': '#6b7645', 'cream': '#f5f0e8', 'stone': '#928978',
        'forest green': '#2d5a27', 'washed blue': '#6b8cae', 'rust': '#8b3a2a',
        'sand': '#c2a87d', 'navy': '#1a2744', 'khaki': '#c3b091',
        'burgundy': '#6d1a2f', 'slate blue': '#6a7fa0', 'tan': '#d2b48c',
        'forest': '#2d5a27', 'multi': 'linear-gradient(135deg,#f00,#0f0,#00f)',
        'oat': '#e8dcc8', 'washed grey': '#a0a0a0', 'dusty pink': '#d4a0a0',
        'vintage black': '#2a2a2a', 'washed brown': '#8b6f5e', 'olive green': '#6b7645',
    };
    const getColorSwatch = (name) => colorMap[name.toLowerCase()] || '#888';

    return (
        <div className="pd-root">
            <div className="pd-container">

                {/* ── Top Bar: breadcrumbs etc ── */}
                <div className="pd-top-bar">
                    <Link to="/shop" className="pd-back">
                        <HiArrowLeft size={16} />
                        <span>Home</span>
                        <span className="pd-back-sep">/</span>
                        <span className="pd-back-current">Product details</span>
                    </Link>
                </div>

                {/* ══ Main grid ══ */}
                <div className="pd-grid">

                    {/* ── Left: Gallery ── */}
                    <div className="pd-gallery">
                        {/* Main image */}
                        <AnimatePresence mode="wait">
                            <div
                                key={selectedImg}
                                className="pd-main-img-wrap"
                            >
                                <img
                                    src={images[selectedImg]}
                                    alt={product.name}
                                    className={`pd-main-img${product.comingSoon ? ' blur-[4px] scale-105' : ''}`}
                                />
                                {product.comingSoon && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none rounded-2xl">
                                        <span className="text-white text-sm font-bold tracking-[0.2em] uppercase border border-white/40 px-6 py-3 rounded-full backdrop-blur-sm">
                                            Coming Soon
                                        </span>
                                    </div>
                                )}
                                {isOnSale && (
                                    <span className="pd-badge pd-badge--sale">Sale</span>
                                )}
                            </div>
                        </AnimatePresence>

                        {/* Thumbnail strip */}
                        {images.length > 1 && (
                            <div className="pd-thumbs">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        className={`pd-thumb ${i === selectedImg ? 'pd-thumb--active' : ''}`}
                                        onClick={() => setSelectedImg(i)}
                                    >
                                        <img src={img} alt={`View ${i + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right: Info panel ── */}
                    <div
                        className="pd-info"
                    >
                        {/* Category Tag */}
                        <span className="pd-category-tag">{product.category || 'Fashion'}</span>

                        {/* Name & Price */}
                        <h1 className="pd-name">{product.name}</h1>
                        <div className="pd-price-row">
                            {product.comingSoon ? (
                                <span className="pd-price--soon">Coming Soon</span>
                            ) : (
                                <>
                                    <span className="pd-price--current">{formatPrice(product.price)}</span>
                                    {isOnSale && (
                                        <span className="pd-price--original">{formatPrice(product.originalPrice)}</span>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Delivery Estimate Box */}
                        <div className="pd-delivery-estimate">
                            <span className="pd-icon-clock">🕒</span>
                            <span>Order in <b>02:30:25</b> to get next day delivery</span>
                        </div>

                        {/* Color selector */}
                        {productColors.length > 0 && (
                            <div className={`pd-color-section${product.comingSoon ? ' pd-disabled-section' : ''}`}>
                                <div className="pd-color-label">Select Color {selectedColor && `- ${selectedColor}`}</div>
                                <div className="pd-color-pills">
                                    {productColors.map(color => (
                                        <button
                                            key={color}
                                            disabled={product.comingSoon}
                                            className={`pd-color-pill ${selectedColor === color ? 'pd-color-pill--active' : ''} ${product.comingSoon ? 'pd-pill--disabled' : ''}`}
                                            onClick={() => !product.comingSoon && setSelectedColor(color)}
                                            title={color}
                                        >
                                            <span className="pd-color-dot" style={{ background: getColorSwatch(color) }} />
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size pills */}
                        <div className={`pd-sizes-section${product.comingSoon ? ' pd-disabled-section' : ''}`}>
                            <div className="pd-size-label">Select Size</div>
                            <div className="pd-sizes-grid">
                                {productSizes.map(size => (
                                    <button
                                        key={size}
                                        disabled={product.comingSoon}
                                        className={`pd-size-pill ${selectedSize === size ? 'pd-size-pill--active' : ''} ${product.comingSoon ? 'pd-pill--disabled' : ''}`}
                                        onClick={() => !product.comingSoon && setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="pd-ctas">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.comingSoon}
                                className={`pd-add-btn ${product.comingSoon ? 'pd-add-btn--disabled' : ''}`}
                            >
                                {product.comingSoon ? 'Coming Soon' : 'Add to Cart'}
                            </button>
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`pd-wishlist-btn ${wishlisted ? 'pd-wishlist-btn--active' : ''}`}
                            >
                                {wishlisted ? <HiHeart size={20} /> : <HiOutlineHeart size={20} />}
                            </button>
                        </div>

                        {/* Stock badge */}
                        <div className="pd-stock-row mt-2">
                            <span className={`pd-stock ${product.stock < 10 ? 'pd-stock--low' : ''}`}>
                                {product.stock < 10 ? `Only ${product.stock} left in stock` : 'In Stock'}
                            </span>
                        </div>

                        {/* Accordions */}
                        <div className="pd-accordions">
                            <Accordion title="Description & Fit">
                                <p className="pd-accordion-text">{product.description}</p>
                                {product.material && (
                                    <p className="pd-accordion-text" style={{ marginTop: 8 }}>
                                        <strong>Material:</strong> {product.material}
                                    </p>
                                )}
                            </Accordion>

                            <Accordion title="Shipping">
                                <div className="pd-shipping-grid">
                                    <div className="pd-shipping-item">
                                        <div className="pd-ship-icon">%</div>
                                        <div>
                                            <p className="pd-ship-title">Discount</p>
                                            <p className="pd-ship-desc">Dec 50%</p>
                                        </div>
                                    </div>
                                    <div className="pd-shipping-item">
                                        <div className="pd-ship-icon">📦</div>
                                        <div>
                                            <p className="pd-ship-title">Package</p>
                                            <p className="pd-ship-desc">Regular Package</p>
                                        </div>
                                    </div>
                                    <div className="pd-shipping-item">
                                        <div className="pd-ship-icon">📅</div>
                                        <div>
                                            <p className="pd-ship-title">Delivery Time</p>
                                            <p className="pd-ship-desc">3-4 Working Days</p>
                                        </div>
                                    </div>
                                    <div className="pd-shipping-item">
                                        <div className="pd-ship-icon">🚚</div>
                                        <div>
                                            <p className="pd-ship-title">Estimated Arrival</p>
                                            <p className="pd-ship-desc">10 - 12 October 2026</p>
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>
                    </div>
                </div>

                {/* ══ Ratings & Reviews ══ */}
                <section className="pd-reviews-section">
                    <h2 className="pd-section-title">Rating & Reviews</h2>
                    <div className="pd-reviews-container">
                        <div className="pd-reviews-summary">
                            <div className="pd-score-big">
                                4.5 <span className="pd-score-slash">/ 5</span>
                            </div>
                            <p className="pd-reviews-count">(50 New Reviews)</p>
                        </div>

                        <div className="pd-reviews-bars">
                            {[5, 4, 3, 2, 1].map(star => (
                                <div key={star} className="pd-review-bar-row">
                                    <span className="pd-star">★ {star}</span>
                                    <div className="pd-bar-bg">
                                        <div className="pd-bar-fill" style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '5%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pd-review-cards">
                            <div className="pd-review-card">
                                <div className="pd-rc-header">
                                    <h4>Alex Mathio</h4>
                                    <span className="pd-rc-date">13 Oct 2026</span>
                                </div>
                                <div className="pd-rc-stars">★★★★★</div>
                                <p className="pd-rc-text">"NextGen's dedication to sustainability and ethical practices resonates strongly with today's consumers, positioning the brand as a responsible choice in the fashion world."</p>
                                <img src={`https://i.pravatar.cc/150?u=${product.id}`} alt="User" className="pd-rc-avatar" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══ Styled With / You might also like ══ */}
                {related.length > 0 && (
                    <section className="pd-styled-with">
                        <h2 className="pd-section-title text-center text-4xl mb-12">You might also like</h2>
                        <div className="pd-styled-with__scroll" ref={styledRef}>
                            {related.map((p, i) => (
                                <div key={p.id} className="pd-styled-with__item">
                                    <ProductCard product={p} index={i} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;

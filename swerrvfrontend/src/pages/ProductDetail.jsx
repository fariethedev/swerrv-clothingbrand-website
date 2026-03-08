/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="pd-accordion-body"
                    >
                        {children}
                    </motion.div>
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
    const [quantity, setQuantity] = useState(1);

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

    const handleSizeDropdown = e => setSelectedSize(e.target.value);

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

                {/* Back link */}
                <Link to="/shop" className="pd-back">
                    <HiArrowLeft size={14} />
                    <span>collection</span>
                </Link>

                {/* ══ Main grid ══ */}
                <div className="pd-grid">

                    {/* ── Left: Gallery ── */}
                    <div className="pd-gallery">
                        {/* Main image */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedImg}
                                className="pd-main-img-wrap"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={images[selectedImg]}
                                    alt={product.name}
                                    className="pd-main-img"
                                />
                                {product.comingSoon && (
                                    <span className="pd-badge pd-badge--soon">Coming Soon</span>
                                )}
                                {isOnSale && (
                                    <span className="pd-badge pd-badge--sale">Sale</span>
                                )}
                            </motion.div>
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
                    <motion.div
                        className="pd-info"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45 }}
                    >
                        {/* Name */}
                        <div className="pd-header">
                            <p className="pd-category">{product.category}</p>
                            <h1 className="pd-name">{product.name}</h1>
                        </div>

                        {/* Price */}
                        <div className="pd-price-row">
                            {product.comingSoon ? (
                                <span className="pd-price--soon">Coming Soon</span>
                            ) : (
                                <>
                                    {isOnSale && (
                                        <span className="pd-price--original">{formatPrice(product.originalPrice)}</span>
                                    )}
                                    <span className="pd-price--current">{formatPrice(product.price)}</span>
                                </>
                            )}
                        </div>

                        {/* Color selector */}
                        {productColors.length > 0 && (
                            <div className="pd-color-section">
                                <div className="pd-color-label">
                                    <span>colour</span>
                                    {selectedColor && <span className="pd-color-chosen">{selectedColor}</span>}
                                </div>
                                <div className="pd-color-pills">
                                    {productColors.map(color => (
                                        <button
                                            key={color}
                                            className={`pd-color-pill ${selectedColor === color ? 'pd-color-pill--active' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                            title={color}
                                        >
                                            <span
                                                className="pd-color-dot"
                                                style={{ background: getColorSwatch(color) }}
                                            />
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size pills */}
                        <div className="pd-sizes-section">
                            <div className="pd-sizes-grid">
                                {productSizes.map(size => (
                                    <button
                                        key={size}
                                        className={`pd-size-pill ${selectedSize === size ? 'pd-size-pill--active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>

                            {/* Dropdown (mirrors pill selection) */}
                            <div className="pd-size-select-wrap">
                                <select
                                    className="pd-size-select"
                                    value={selectedSize}
                                    onChange={handleSizeDropdown}
                                >
                                    <option value="">select your size</option>
                                    {productSizes.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <HiChevronDown className="pd-size-select-icon" size={14} />
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="pd-ctas">
                            <motion.button
                                onClick={handleAddToCart}
                                disabled={product.comingSoon}
                                whileTap={!product.comingSoon ? { scale: 0.97 } : {}}
                                className={`pd-add-btn ${product.comingSoon ? 'pd-add-btn--disabled' : ''}`}
                            >
                                {product.comingSoon ? 'Coming Soon' : 'add to bag'}
                            </motion.button>
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`pd-wishlist-btn ${wishlisted ? 'pd-wishlist-btn--active' : ''}`}
                            >
                                {wishlisted ? <HiHeart size={20} /> : <HiOutlineHeart size={20} />}
                            </button>
                        </div>

                        {/* Stock badge */}
                        <div className="pd-stock-row">
                            <span className={`pd-stock ${product.stock < 10 ? 'pd-stock--low' : ''}`}>
                                {product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
                            </span>
                        </div>

                        {/* Accordions */}
                        <div className="pd-accordions">
                            <Accordion title="product details">
                                <p className="pd-accordion-text">{product.description}</p>
                                {product.material && (
                                    <p className="pd-accordion-text" style={{ marginTop: 8 }}>
                                        <strong>Material:</strong> {product.material}
                                    </p>
                                )}
                            </Accordion>

                            <Accordion title="sizing chart">
                                <div className="pd-sizing-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Size</th>
                                                <th>Chest (cm)</th>
                                                <th>Waist (cm)</th>
                                                <th>Hip (cm)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                ['XXS', '76–81', '60–65', '84–89'],
                                                ['XS', '81–86', '65–70', '89–94'],
                                                ['S', '86–91', '70–75', '94–99'],
                                                ['M', '91–96', '75–80', '99–104'],
                                                ['L', '99–104', '83–88', '107–112'],
                                                ['XL', '107–112', '91–96', '115–120'],
                                                ['XXL', '117–122', '101–106', '125–130'],
                                            ].map(([s, ...vals]) => (
                                                <tr key={s} className={selectedSize === s ? 'pd-sizing-table__row--active' : ''}>
                                                    <td>{s}</td>
                                                    {vals.map((v, i) => <td key={i}>{v}</td>)}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Accordion>

                            <Accordion title="shipping &amp; returns">
                                <div className="pd-accordion-text">
                                    <p>Free standard shipping on orders over 400 PLN.</p>
                                    <p>• Standard: 5–7 business days — free (400 PLN+) / 40 PLN</p>
                                    <p>• Express: 2–3 business days — 80 PLN</p>
                                    <p>• Overnight: 1 business day — 160 PLN</p>
                                    <p style={{ marginTop: 8 }}>Easy returns within 30 days of delivery.</p>
                                </div>
                            </Accordion>
                        </div>
                    </motion.div>
                </div>

                {/* ══ Styled With ══ */}
                {related.length > 0 && (
                    <section className="pd-styled-with">
                        <p className="pd-styled-with__label">styled with</p>
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

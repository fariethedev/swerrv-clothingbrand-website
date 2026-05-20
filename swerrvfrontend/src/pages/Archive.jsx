import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAdjustments, HiX, HiChevronDown, HiArrowRight } from 'react-icons/hi';
import DetailedProductCard from '../components/DetailedProductCard';
import { api } from '../services/api';
import './Archive.css';

const categories = ["All", "T-Shirts", "Hoodies", "Bottoms", "Jackets", "Accessories"];

const Archive = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [sortBy, setSortBy] = useState('featured');
    const [priceMax, setPriceMax] = useState(200);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const timeoutId = setTimeout(() => {
            if (active) setLoading(true);
        }, 0);
        const params = {
            category: selectedCategory === 'All' ? undefined : selectedCategory,
            q: searchQuery || undefined,
            maxPrice: priceMax !== 200 ? priceMax : undefined,
            sort: sortBy === 'rating' || sortBy === 'featured' ? undefined : sortBy
        };

        api.searchProducts(params).then(data => {
            if (!active) return;
            let res = data || [];
            if (sortBy === 'rating') {
                res = res.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            } else if (sortBy === 'featured') {
                res = res.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
            }
            setProducts(res);
            setLoading(false);
        }).catch(err => {
            if (!active) return;
            console.error('Error fetching products:', err);
            setLoading(false);
        });

        return () => {
            active = false;
            clearTimeout(timeoutId);
        };
    }, [selectedCategory, searchQuery, sortBy, priceMax]);

    const handleCategory = (cat) => {
        setSelectedCategory(cat);
        setSearchParams(cat === 'All' ? {} : { category: cat });
    };

    return (
        <div className="archive-page">
            {/* Brutalist Hero */}
            <section className="archive-hero">
                <div className="archive-hero-bg">
                    <img src="/images/_DSC8164.jpg" alt="Collection Hero" fetchpriority="high" decoding="async" />
                    <div className="archive-hero-overlay" />
                </div>

                <div className="archive-hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="archive-hero-label">By &Tradition / Swerrv</p>
                        <h1 className="archive-hero-title">Archive Essentials</h1>
                        <button className="archive-hero-btn" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                            Show More
                        </button>
                    </motion.div>
                </div>
            </section>

            <div className="archive-container">
                {/* Sets & Bundles Header (from reference) */}
                <div className="archive-header">
                    <h2 className="archive-section-title">Collections</h2>
                    <span className="archive-section-sub">Save up to 30% on seasonal drops</span>
                </div>

                {/* Filters & Control Bar */}
                <div className="archive-controls">
                    <div className="archive-cats">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategory(cat)}
                                className={`archive-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="archive-actions">
                        <div className="archive-sort">
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="price-asc">Price: Low-High</option>
                                <option value="price-desc">Price: High-Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                            <HiChevronDown size={14} />
                        </div>
                        <button className="archive-filter-trigger" onClick={() => setFiltersOpen(!filtersOpen)}>
                            <HiOutlineAdjustments size={16} />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                {/* Filter Panel Expansion */}
                <AnimatePresence>
                    {filtersOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="archive-filter-panel"
                        >
                            <div className="filter-inner">
                                <div className="filter-item">
                                    <span className="filter-label">Price Ceiling</span>
                                    <input
                                        type="range"
                                        min="20"
                                        max="500"
                                        value={priceMax}
                                        onChange={e => setPriceMax(Number(e.target.value))}
                                    />
                                    <span className="filter-val">{priceMax} PLN</span>
                                </div>
                                <button className="filter-clear" onClick={() => setPriceMax(200)}>
                                    <HiX size={14} /> Clear
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Product Grid */}
                <div className="archive-grid-wrap">
                    {loading ? (
                        <div className="archive-loading-grid">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="archive-skeleton" />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="archive-empty">
                            <h3>No pieces found</h3>
                            <p>Try refining your search or filters.</p>
                            <Link to="/archive" className="archive-clear-link">View all collections</Link>
                        </div>
                    ) : (
                        <div className="archive-grid">
                            {products.map((product, i) => (
                                <DetailedProductCard key={product.id} product={product} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Archive;

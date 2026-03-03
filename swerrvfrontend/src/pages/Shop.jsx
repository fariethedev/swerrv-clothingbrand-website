import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAdjustments, HiX, HiChevronDown } from 'react-icons/hi';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

const categories = ["All", "T-Shirts", "Hoodies", "Bottoms", "Jackets", "Accessories"];

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [sortBy, setSortBy] = useState('featured');
    const [priceMax, setPriceMax] = useState(200);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const params = {
            category: selectedCategory === 'All' ? undefined : selectedCategory,
            q: searchQuery || undefined,
            maxPrice: priceMax !== 200 ? priceMax : undefined,
            sort: sortBy === 'rating' || sortBy === 'featured' ? undefined : sortBy // backend supports price-asc, price-desc, newest
        };

        api.searchProducts(params).then(data => {
            let res = data || [];

            // Client-side fallback sorting for unsupported backend sorts
            if (sortBy === 'rating') {
                res = res.sort((a, b) => b.rating - a.rating);
            } else if (sortBy === 'featured') {
                res = res.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
            }

            setFiltered(res);
            setLoading(false);
        }).catch(err => {
            console.error('Error fetching products:', err);
            setLoading(false);
        });
    }, [selectedCategory, searchQuery, sortBy, priceMax]);

    const handleCategory = (cat) => {
        setSelectedCategory(cat);
        setSearchParams(cat === 'All' ? {} : { category: cat });
    };

    return (
        <div className="min-h-screen pt-[70px]">
            {/* Hero */}
            <div className="bg-grey-900 border-b border-white/[0.06] py-16 text-center px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <p className="section-label mb-3">Collection</p>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-[0.04em]">
                        {searchQuery ? `"${searchQuery}"` : selectedCategory === 'All' ? 'All Products' : selectedCategory}
                    </h1>
                    <p className="text-grey-500 text-sm tracking-[0.1em] mt-3">{filtered.length} products</p>
                </motion.div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-10 pb-20">
                {/* Filters Bar */}
                <div className="flex flex-wrap items-center justify-between gap-5 pb-6 border-b border-white/[0.06] mb-8">
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => handleCategory(cat)}
                                className={`px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase border transition-all duration-200 ${selectedCategory === cat ? 'bg-accent text-black border-accent' : 'bg-transparent text-grey-300 border-transparent hover:border-grey-700 hover:text-white'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative flex items-center border border-grey-700 px-3 py-2 gap-2">
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-transparent text-white text-xs font-semibold tracking-[0.08em] cursor-pointer appearance-none pr-5 outline-none">
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                            <HiChevronDown size={14} className="absolute right-2 pointer-events-none text-grey-500" />
                        </div>
                        <button onClick={() => setFiltersOpen(!filtersOpen)}
                            className="flex items-center gap-2 px-4 py-2 border border-grey-700 text-xs font-semibold tracking-[0.1em] uppercase hover:border-accent hover:text-accent transition-all duration-200">
                            <HiOutlineAdjustments size={16} /> Filters
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                <AnimatePresence>
                    {filtersOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                            <div className="flex flex-wrap gap-10 p-6 bg-grey-900 border border-white/[0.08] mb-8">
                                <div>
                                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-300 mb-3">Price Range</p>
                                    <p className="text-sm font-semibold mb-2">0 PLN – {priceMax} PLN</p>
                                    <input type="range" min="20" max="200" value={priceMax} onChange={e => setPriceMax(Number(e.target.value))}
                                        className="w-48 accent-accent h-0.5" />
                                </div>
                                <button onClick={() => setPriceMax(200)} className="flex items-center gap-2 self-center text-xs text-grey-500 border border-grey-700 px-4 py-2 hover:text-brand-red hover:border-brand-red transition-all duration-200 ml-auto">
                                    <HiX size={14} /> Clear
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loading" className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {Array(8).fill(0).map((_, i) => (
                                <div key={i} className="animate-pulse bg-grey-800 aspect-[3/4] rounded-sm"></div>
                            ))}
                        </motion.div>
                    ) : filtered.length === 0 ? (
                        <motion.div key="empty" className="text-center py-24 flex flex-col items-center gap-4 col-span-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden mix-blend-screen opacity-80 mb-4">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                >
                                    <source src="/images/logovideo.mov" type="video/mp4" />
                                </video>
                            </div>
                            <h3 className="text-2xl font-bold">No products found</h3>
                            <p className="text-grey-500">Try adjusting your filters.</p>
                            <button className="btn-primary mt-2" onClick={() => { setSelectedCategory('All'); setSearchParams({}); }}>Clear All Filters</button>
                        </motion.div>
                    ) : (
                        <motion.div key={`${selectedCategory}-${searchQuery}-${sortBy}`} className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                            {filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Shop;

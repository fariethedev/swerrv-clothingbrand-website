import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAdjustments, HiChevronDown, HiX, HiCheck } from 'react-icons/hi';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

const CATEGORIES = ["All", "T-Shirts", "Tracksuits"];

const COLLECTION_DISPLAY_NAMES = {
    'All': 'All',
    'Feeling Mutual 1': 'Feeling Mutual I',
    'Feeling Mutual 2': 'Feeling Mutual II'
};
const MOCK_COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Brown', hex: '#8B4513' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Grey', hex: '#808080' }
];

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [selectedCollection, setSelectedCollection] = useState(searchParams.get('collection') || 'All');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [sortBy, setSortBy] = useState('featured');
    const [priceMax, setPriceMax] = useState(200);
    const [selectedColor, setSelectedColor] = useState(null); // Mock filter

    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setSelectedCategory(searchParams.get('category') || 'All');
        setSelectedCollection(searchParams.get('collection') || 'All');
        setSearchQuery(searchParams.get('search') || '');
    }, [searchParams]);

    useEffect(() => {
        let active = true;
        const timeoutId = setTimeout(() => {
            if (active) setLoading(true);
        }, 0);

        const params = {
            category: selectedCategory === 'All' ? undefined : selectedCategory,
            collection: selectedCollection === 'All' ? undefined : selectedCollection,
            q: searchQuery || undefined,
            maxPrice: priceMax !== 200 ? priceMax : undefined,
            sort: sortBy === 'rating' || sortBy === 'featured' ? undefined : sortBy
        };

        api.searchProducts(params).then(data => {
            if (!active) return;
            let res = data || [];

            // Client-side fallback sorting
            if (sortBy === 'rating') {
                res = res.sort((a, b) => b.rating - a.rating);
            } else if (sortBy === 'featured') {
                res = res.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
            }

            setFiltered(res);
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
    }, [selectedCategory, selectedCollection, searchQuery, sortBy, priceMax]);

    const handleCategory = (cat) => {
        setSelectedCategory(cat);
        const newParams = {};
        if (cat !== 'All') newParams.category = cat;
        if (selectedCollection !== 'All') newParams.collection = selectedCollection;
        if (searchQuery) newParams.search = searchQuery;
        setSearchParams(newParams);
    };

    const handleCollection = (col) => {
        setSelectedCollection(col);
        const newParams = {};
        if (selectedCategory !== 'All') newParams.category = selectedCategory;
        if (col !== 'All') newParams.collection = col;
        if (searchQuery) newParams.search = searchQuery;
        setSearchParams(newParams);
    };

    return (
        <div className="min-h-screen pt-[70px] bg-black">
            <div className="max-w-[1400px] mx-auto px-6 py-10 pb-24 flex flex-col lg:flex-row gap-8 lg:gap-12">
                
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex flex-col w-56 shrink-0 gap-8">
                    {/* Categories */}
                    <div>
                        <h3 className="text-sm font-bold text-white mb-4">Category</h3>
                        <div className="flex flex-col gap-2">
                            {CATEGORIES.map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => handleCategory(cat)}
                                    className={`text-left text-sm transition-colors duration-200 ${selectedCategory === cat ? 'text-accent font-semibold' : 'text-grey-500 hover:text-white'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Collections */}
                    <div>
                        <h3 className="text-sm font-bold text-white mb-4">Collection</h3>
                        <div className="flex flex-col gap-2">
                            {["All", "Feeling Mutual 1", "Feeling Mutual 2"].map(col => (
                                <button 
                                    key={col} 
                                    onClick={() => handleCollection(col)}
                                    className={`text-left text-sm transition-colors duration-200 ${selectedCollection === col ? 'text-accent font-semibold' : 'text-grey-500 hover:text-white'}`}
                                >
                                    {COLLECTION_DISPLAY_NAMES[col] || col}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div>
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <HiOutlineAdjustments size={16} /> Filter by:
                        </h3>

                        {/* Price Filter */}
                        <div className="mb-6">
                            <p className="text-xs font-semibold text-white/80 mb-3">Price</p>
                            <input 
                                type="range" 
                                min="20" 
                                max="200" 
                                value={priceMax} 
                                onChange={e => setPriceMax(Number(e.target.value))}
                                className="w-full accent-accent h-1 bg-grey-800 rounded-lg appearance-none cursor-pointer" 
                            />
                            <div className="flex justify-between text-xs text-grey-500 mt-2">
                                <span>$0</span>
                                <span>${priceMax}</span>
                            </div>
                        </div>

                        {/* Color Filter (Aesthetic) */}
                        <div className="mb-8">
                            <p className="text-xs font-semibold text-white/80 mb-3">Colour</p>
                            <div className="flex flex-col gap-2.5">
                                {MOCK_COLORS.map(color => (
                                    <label key={color.name} className="flex items-center gap-3 cursor-pointer group">
                                        <div 
                                            className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-200 ${selectedColor === color.name ? 'border-accent bg-accent' : 'border-grey-700 group-hover:border-grey-500 bg-transparent'}`}
                                            onClick={() => setSelectedColor(selectedColor === color.name ? null : color.name)}
                                        >
                                            {selectedColor === color.name && <HiCheck size={12} className="text-black" />}
                                        </div>
                                        <span className={`text-sm ${selectedColor === color.name ? 'text-white' : 'text-grey-500 group-hover:text-white'}`}>
                                            {color.name}
                                        </span>
                                        <div 
                                            className="w-3 h-3 rounded-full ml-auto"
                                            style={{ backgroundColor: color.hex, border: color.name === 'Black' ? '1px solid #333' : 'none' }}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button 
                            className="w-full bg-accent text-black text-sm font-bold py-3 rounded-full hover:bg-white transition-colors duration-300"
                            onClick={() => { setPriceMax(200); setSelectedColor(null); handleCollection('All'); }}
                        >
                            Reset Filters
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-xs text-grey-500 mb-2">
                                <span>Home</span>
                                <span>/</span>
                                <span>Category</span>
                                <span>/</span>
                                <span className="text-white">{selectedCategory}</span>
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.h1
                                    key={searchQuery || selectedCategory}
                                    className="text-3xl md:text-4xl font-bold tracking-tight text-white capitalize"
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {searchQuery ? `Search: "${searchQuery}"` : selectedCategory}
                                </motion.h1>
                            </AnimatePresence>
                        </div>

                        {/* Sort Dropdown & Mobile Filter Trigger */}
                        <div className="flex items-center gap-3">
                            <div className="relative bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-2 hover:border-white/30 transition-colors">
                                <span className="text-xs text-grey-500 whitespace-nowrap">Sort by:</span>
                                <select 
                                    value={sortBy} 
                                    onChange={e => setSortBy(e.target.value)} 
                                    className="bg-transparent text-white text-sm font-medium cursor-pointer appearance-none pr-5 outline-none"
                                >
                                    <option value="featured">Most Popular</option>
                                    <option value="newest">New Arrivals</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                                <HiChevronDown size={16} className="absolute right-3 pointer-events-none text-grey-500" />
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Bar (Mobile & Desktop) */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {selectedCollection !== 'All' && (
                            <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white">
                                Collection: {COLLECTION_DISPLAY_NAMES[selectedCollection] || selectedCollection}
                                <button onClick={() => handleCollection('All')} className="text-grey-500 hover:text-white"><HiX size={14} /></button>
                            </div>
                        )}
                        {priceMax < 200 && (
                            <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white">
                                Max Price: ${priceMax}
                                <button onClick={() => setPriceMax(200)} className="text-grey-500 hover:text-white"><HiX size={14} /></button>
                            </div>
                        )}
                        {selectedColor && (
                            <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white">
                                Color: {selectedColor}
                                <button onClick={() => setSelectedColor(null)} className="text-grey-500 hover:text-white"><HiX size={14} /></button>
                            </div>
                        )}
                        {searchQuery && (
                            <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white">
                                Search: {searchQuery}
                                <button onClick={() => { setSearchQuery(''); setSearchParams({}); }} className="text-grey-500 hover:text-white"><HiX size={14} /></button>
                            </div>
                        )}
                    </div>

                    {/* Grid */}
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div key="loading" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {Array(8).fill(0).map((_, i) => (
                                    <div key={i} className="animate-pulse bg-[#111] aspect-[4/5] rounded-2xl w-full"></div>
                                ))}
                            </motion.div>
                        ) : filtered.length === 0 ? (
                            <motion.div key="empty" className="text-center py-32 flex flex-col items-center gap-4 border border-white/5 bg-[#0d0d0d] rounded-3xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <HiOutlineAdjustments size={48} className="text-grey-700 mb-2" />
                                <h3 className="text-2xl font-bold">No products found</h3>
                                <p className="text-grey-500 text-sm max-w-sm mx-auto">We couldn't find any products matching your current filters. Try relaxing your search criteria.</p>
                                <button className="bg-accent text-black px-6 py-2.5 rounded-xl text-sm font-bold mt-4 hover:bg-white transition-colors" onClick={() => { setSelectedCategory('All'); setSelectedCollection('All'); setPriceMax(200); setSelectedColor(null); setSearchParams({}); }}>
                                    Clear All Filters
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div key="grid" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                {filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Shop;

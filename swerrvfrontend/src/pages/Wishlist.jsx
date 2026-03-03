import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { HiHeart, HiOutlineTrash } from 'react-icons/hi';
import { useCurrency } from '../context/CurrencyContext';

const Wishlist = () => {
    const { wishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();

    return (
        <div className="min-h-screen pt-[70px] pb-20">
            <div className="max-w-[1400px] mx-auto px-6">
                <motion.div className="py-16 border-b border-white/[0.06] mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <p className="section-label mb-3">Saved Items</p>
                    <h1 className="flex items-center gap-4 text-5xl lg:text-6xl font-black">
                        <HiHeart size={40} className="text-accent" /> My Wishlist ({wishlist.length})
                    </h1>
                </motion.div>

                {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
                        <HiOutlineShoppingBag size={64} className="text-grey-700" />
                        <h3 className="text-2xl font-bold">Your wishlist is empty</h3>
                        <p className="text-grey-500 text-base">Save items you love and come back to them later.</p>
                        <Link to="/shop" className="btn-primary mt-2">Browse Collection</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {wishlist.map((product, i) => (
                            <motion.div key={product.id} className="flex flex-col gap-3.5" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} layout>
                                <Link to={`/product/${product.id}`} className="block aspect-[3/4] overflow-hidden bg-grey-700 group">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                </Link>
                                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-grey-500">{product.category}</p>
                                <Link to={`/product/${product.id}`} className="text-sm font-bold hover:text-accent transition-colors duration-200">{product.name}</Link>
                                <p className="text-sm font-bold">{formatPrice(product.price)}</p>
                                <div className="flex gap-2.5">
                                    <button onClick={() => addToCart(product, product.sizes[0])} className="flex-1 bg-accent text-black py-3 text-[11px] font-extrabold tracking-[0.15em] uppercase hover:bg-accent-dark transition-colors duration-200">
                                        Add to Bag
                                    </button>
                                    <button onClick={() => toggleWishlist(product)} className="w-11 border border-grey-700 flex items-center justify-center text-grey-500 hover:text-brand-red hover:border-brand-red transition-all duration-200">
                                        <HiOutlineTrash size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;

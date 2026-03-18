import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiPlus, HiMinus, HiOutlineTrash } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const CartDrawer = () => {
    const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { formatPrice } = useCurrency();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100]"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                    />
                    <motion.div
                        className="fixed top-0 right-0 w-[420px] max-w-full h-screen bg-grey-900 z-[1101] flex flex-col border-l border-white/[0.08]"
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.35 }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-white/[0.08]">
                            <h2 className="text-base font-bold tracking-[0.1em] uppercase">Your Bag ({cartItems.length})</h2>
                            <button className="text-white/60 hover:text-white transition-colors p-1" onClick={() => setIsCartOpen(false)}>
                                <HiX size={22} />
                            </button>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
                                <div className="text-5xl">🛍</div>
                                <p className="text-grey-300 text-base">Your bag is empty</p>
                                <Link to="/shop" className="btn-primary mt-2" onClick={() => setIsCartOpen(false)}>Shop Now</Link>
                            </div>
                        ) : (
                            <>
                                {/* Items */}
                                <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                                    {cartItems.map(item => (
                                        <motion.div key={item.key} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                            className="flex gap-4 py-4 border-b border-white/[0.06]">
                                            <div className="w-20 h-24 shrink-0 overflow-hidden bg-grey-700">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-semibold leading-snug mb-1">{item.name}</p>
                                                <p className="text-xs text-grey-500 mb-1">Size: {item.size}</p>
                                                <p className="text-sm font-bold text-white mb-2">{formatPrice(item.price)}</p>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                                        className="bg-white/10 text-white w-6 h-6 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-200">
                                                        <HiMinus size={12} />
                                                    </button>
                                                    <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                                        className="bg-white/10 text-white w-6 h-6 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-200">
                                                        <HiPlus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            <button onClick={() => removeFromCart(item.key)} className="text-white/30 hover:text-white transition-colors p-1 self-start">
                                                <HiOutlineTrash size={16} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-5 border-t border-white/[0.08]">
                                    <div className="flex justify-between text-base font-bold mb-2">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(cartTotal)}</span>
                                    </div>
                                    <p className="text-xs text-grey-500 mb-5">Shipping calculated at checkout</p>
                                    <Link to="/checkout" className="block w-full bg-white text-black text-center py-4 text-[11px] font-extrabold tracking-[0.18em] uppercase hover:bg-transparent hover:text-white border border-white transition-all duration-200 mb-3" onClick={() => setIsCartOpen(false)}>
                                        Checkout
                                    </Link>
                                    <button onClick={() => setIsCartOpen(false)}
                                        className="block w-full bg-transparent text-grey-300 border border-grey-700 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:text-white hover:border-white transition-all duration-200">
                                        Continue Shopping
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;

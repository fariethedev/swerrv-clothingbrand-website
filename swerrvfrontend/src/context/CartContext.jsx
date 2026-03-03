/* eslint-disable react-hooks/exhaustive-deps, react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const mapBackendCart = (cartData) => {
        if (!cartData || !cartData.items) {
            setCartItems([]);
            setCartTotal(0);
            setCartCount(0);
            return;
        }

        const mappedItems = cartData.items.map(item => ({
            key: item.id, // backend CartItem ID serves as unique key
            id: item.productId,
            name: item.productName,
            image: item.productImage,
            price: item.productPrice,
            size: item.size,
            color: item.color || 'Default',
            quantity: item.quantity,
            lineTotal: item.lineTotal
        }));

        setCartItems(mappedItems);
        setCartTotal(cartData.subtotal || 0);
        setCartCount(cartData.totalItems || 0);
    };

    const fetchCart = async () => {
        if (!user) {
            setCartItems([]);
            setCartTotal(0);
            setCartCount(0);
            return;
        }
        try {
            const data = await api.getCart();
            mapBackendCart(data);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (product, size, quantity = 1) => {
        if (!user) {
            toast.error("Please log in to add items to your cart.");
            return;
        }
        try {
            const data = await api.addToCart({
                productId: product.id,
                quantity: quantity,
                size: size,
                color: product.color || 'Black' // default color fallback
            });
            mapBackendCart(data);
            setIsCartOpen(true);
            toast.success("Added to cart");
        } catch (error) {
            toast.error(error.message || "Failed to add to cart");
        }
    };

    const removeFromCart = async (key) => {
        if (!user) return;
        try {
            const data = await api.removeCartItem(key);
            mapBackendCart(data);
        } catch (error) {
            toast.error(error.message || "Failed to remove item");
        }
    };

    const updateQuantity = async (key, quantity) => {
        if (!user) return;
        if (quantity <= 0) {
            return removeFromCart(key);
        }
        try {
            const data = await api.updateCartItem(key, quantity);
            mapBackendCart(data);
        } catch (error) {
            toast.error(error.message || "Failed to update quantity");
        }
    };

    const clearCart = async () => {
        if (!user) return;
        try {
            await api.clearCart();
            mapBackendCart(null);
        } catch (error) {
            console.error("Failed to clear cart:", error);
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
            cartCount, cartTotal, isCartOpen, setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

/* eslint-disable react-hooks/set-state-in-effect, react-refresh/only-export-components, no-unused-vars */
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        if (user) {
            api.getWishlist()
                .then(data => setWishlist(data || []))
                .catch(err => console.error("Failed to load wishlist:", err));
        } else {
            setWishlist([]);
        }
    }, [user]);

    const toggleWishlist = async (product) => {
        if (!user) {
            toast.error("Please log in to use the wishlist.");
            return;
        }

        const isCurrentlyWishlisted = wishlist.some(p => p.id === product.id);

        // Optimistic UI update
        const previousWishlist = [...wishlist];
        if (isCurrentlyWishlisted) {
            setWishlist(prev => prev.filter(p => p.id !== product.id));
        } else {
            setWishlist(prev => [...prev, product]);
        }

        try {
            if (isCurrentlyWishlisted) {
                const updatedList = await api.removeFromWishlist(product.id);
                setWishlist(updatedList);
            } else {
                const updatedList = await api.addToWishlist(product.id);
                setWishlist(updatedList);
                toast.success("Added to wishlist");
            }
        } catch (error) {
            // Revert on failure
            setWishlist(previousWishlist);
            toast.error("Failed to update wishlist");
        }
    };

    const isWishlisted = (id) => wishlist.some(p => p.id === id);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);

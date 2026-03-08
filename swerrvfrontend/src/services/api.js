const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getHeaders = () => {
    const token = localStorage.getItem('swerrv_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
            errorMessage = response.statusText;
            console.error(e);
        }
        throw new Error(errorMessage);
    }

    // For 204 No Content or empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return null;
};

export const api = {
    // Auth
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(response);
    },

    register: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },

    getCurrentUser: async () => {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    updateProfile: async (profileData) => {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(profileData),
        });
        return handleResponse(response);
    },

    requestPasswordReset: async (email) => {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        // This endpoint returns a plain string, not JSON
        if (!response.ok) {
            let errorMessage = 'An error occurred';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                errorMessage = await response.text() || response.statusText;
            }
            throw new Error(errorMessage);
        }
        return response.text();
    },

    resetPassword: async (email, token, newPassword) => {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token, newPassword }),
        });

        // This endpoint also returns a plain string
        if (!response.ok) {
            let errorMessage = 'An error occurred';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                errorMessage = await response.text() || response.statusText;
            }
            throw new Error(errorMessage);
        }
        return response.text();
    },

    // Products
    getProducts: async () => {
        const response = await fetch(`${API_URL}/products`);
        const data = await handleResponse(response);
        return Array.isArray(data) ? data : (data?.content || data?._embedded?.products || []);
    },

    searchProducts: async (params) => {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.append(key, value);
            }
        });
        const response = await fetch(`${API_URL}/products/search?${query.toString()}`);
        const data = await handleResponse(response);
        return Array.isArray(data) ? data : (data?.content || []);
    },

    getFeaturedProducts: async () => {
        const response = await fetch(`${API_URL}/products/featured`);
        const data = await handleResponse(response);
        return Array.isArray(data) ? data : (data?.content || []);
    },

    getProductById: async (id) => {
        const response = await fetch(`${API_URL}/products/${id}`);
        return handleResponse(response);
    },

    // Reviews
    getProductReviews: async (productId) => {
        const response = await fetch(`${API_URL}/reviews/product/${productId}`);
        const data = await handleResponse(response);
        return Array.isArray(data) ? data : (data?.content || []);
    },

    createReview: async (productId, reviewData) => {
        const response = await fetch(`${API_URL}/reviews/product/${productId}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(reviewData)
        });
        return handleResponse(response);
    },

    // Cart
    getCart: async () => {
        const response = await fetch(`${API_URL}/cart`, { headers: getHeaders() });
        return handleResponse(response);
    },

    clearCart: async () => {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    addToCart: async (itemData) => {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(itemData),
        });
        return handleResponse(response);
    },

    updateCartItem: async (itemId, quantity) => {
        const response = await fetch(`${API_URL}/cart/items/${itemId}?quantity=${quantity}`, {
            method: 'PUT',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    removeCartItem: async (itemId) => {
        const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    // Wishlist
    getWishlist: async () => {
        const response = await fetch(`${API_URL}/wishlist`, { headers: getHeaders() });
        return handleResponse(response);
    },

    addToWishlist: async (productId) => {
        const response = await fetch(`${API_URL}/wishlist/${productId}`, {
            method: 'POST',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    removeFromWishlist: async (productId) => {
        const response = await fetch(`${API_URL}/wishlist/${productId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    // Orders & Payments
    createPaymentIntent: async (currency = 'PLN') => {
        const response = await fetch(`${API_URL}/payments/create-intent?currency=${currency}`, {
            method: 'POST',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    createOrder: async (orderData) => {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(orderData),
        });
        return handleResponse(response);
    },

    getUserOrders: async () => {
        const response = await fetch(`${API_URL}/orders/my-orders`, {
            headers: getHeaders(),
        });
        const data = await handleResponse(response);
        return Array.isArray(data) ? data : (data?.content || []);
    },

    // Admin
    getAdminOrders: async () => {
        const response = await fetch(`${API_URL}/admin/orders`, {
            headers: getHeaders(),
        });
        const data = await handleResponse(response);
        return Array.isArray(data) ? data : (data?.content || []);
    },

    getAdminUsers: async () => {
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: getHeaders(),
        });
        const data = await handleResponse(response);
        return Array.isArray(data) ? data : (data?.content || []);
    },

    updateOrderStatus: async (id, status) => {
        const response = await fetch(`${API_URL}/admin/orders/${id}/status?status=${status}`, {
            method: 'PUT',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getAdminStats: async () => {
        const response = await fetch(`${API_URL}/admin/stats`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getAdminLowStock: async (threshold = 10) => {
        const response = await fetch(`${API_URL}/admin/products/low-stock?threshold=${threshold}`, {
            headers: getHeaders(),
        });
        const data = await handleResponse(response);
        return Array.isArray(data) ? data : (data?.content || []);
    },

    updateAdminStock: async (id, quantity) => {
        const response = await fetch(`${API_URL}/admin/products/${id}/stock?quantity=${quantity}`, {
            method: 'PATCH',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    createProduct: async (productData) => {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(productData),
        });
        return handleResponse(response);
    },

    updateProduct: async (id, productData) => {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(productData),
        });
        return handleResponse(response);
    },

    deleteProduct: async (id) => {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    googleLogin: async (token) => {
        const response = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        return handleResponse(response);
    },

    // Promo Content
    getActivePromoContent: async (type = '') => {
        const response = await fetch(`${API_URL}/promo-content/active${type ? `?type=${type}` : ''}`);
        return handleResponse(response);
    },

    getPromoContent: async () => {
        const response = await fetch(`${API_URL}/promo-content`, { headers: getHeaders() });
        return handleResponse(response);
    },

    createPromoContent: async (data) => {
        const response = await fetch(`${API_URL}/promo-content`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    updatePromoContent: async (id, data) => {
        const response = await fetch(`${API_URL}/promo-content/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    deletePromoContent: async (id) => {
        const response = await fetch(`${API_URL}/promo-content/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    togglePromoContentActive: async (id) => {
        const response = await fetch(`${API_URL}/promo-content/${id}/toggle-active`, {
            method: 'PATCH',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
};

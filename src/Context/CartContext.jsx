import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../api/cartAPI';
import { productAPI } from '../api/productAPI';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Helper function to enrich cart items with product data
const enrichCartWithProducts = async (cartItems) => {
    return Promise.all(
        cartItems.map(async (item) => {
            try {
                const response = await productAPI.getProductById(item.productId);
                const productData = response.data.data;
                return {
                    ...item,
                    name: productData.name,
                    price: productData.discountPrice || productData.price,
                    image: productData.images?.[0] || productData.thumbnail,
                    description: productData.description,
                    originalPrice: productData.price,
                    discountPrice: productData.discountPrice
                };
            } catch (error) {
                console.error(`Failed to fetch product ${item.productId}:`, error);
                // Return item without product details if fetch fails
                return item;
            }
        })
    );
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await cartAPI.getCartItems();
                const items = response.data.data || [];
                
                // Enrich with product information
                const enrichedItems = await enrichCartWithProducts(items);
                setCartItems(enrichedItems);
                localStorage.setItem('cartItems', JSON.stringify(enrichedItems));
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch cart items';
                setError(errorMessage);
                console.error('Error fetching cart items:', errorMessage);
                // Fall back to local storage if server fails
                const localData = localStorage.getItem('cartItems');
                if (localData) {
                    setCartItems(JSON.parse(localData));
                }
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if user is authenticated
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchCartItems();
        }
    }, []);

    const addToCart = async (product, quantity = 1) => {
        try {
            setError(null);
            const productId = product._id || product.id;

            // Call API to add item
            await cartAPI.addItemToCart({
                productId: productId,
                quantity: quantity
            });

            // Refresh cart with product data
            const response = await cartAPI.getCartItems();
            const items = response.data.data || [];
            const enrichedItems = await enrichCartWithProducts(items);
            setCartItems(enrichedItems);
            localStorage.setItem('cartItems', JSON.stringify(enrichedItems));
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to add item to cart';
            setError(errorMessage);
            console.error('Error adding to cart:', errorMessage);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            setError(null);
            // Optimistic update
            setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));

            // Call API to persist
            await cartAPI.removeItem(productId);

            // Refresh cart from server with product data
            const response = await cartAPI.getCartItems();
            const items = response.data.data || [];
            const enrichedItems = await enrichCartWithProducts(items);
            setCartItems(enrichedItems);
            localStorage.setItem('cartItems', JSON.stringify(enrichedItems));
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to remove item from cart';
            setError(errorMessage);
            console.error('Error removing from cart:', errorMessage);
            // Refresh to restore state
            try {
                const response = await cartAPI.getCartItems();
                const items = response.data.data || [];
                const enrichedItems = await enrichCartWithProducts(items);
                setCartItems(enrichedItems);
            } catch (e) {
                console.error('Error refreshing cart:', e);
            }
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            await removeFromCart(productId);
            return;
        }

        try {
            setError(null);
            // Optimistic update
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.productId === productId ? { ...item, quantity: newQuantity } : item
                )
            );

            // Call API to persist
            await cartAPI.updateItemQuantity(productId, { quantity: newQuantity });

            // Refresh cart from server with product data
            const response = await cartAPI.getCartItems();
            const items = response.data.data || [];
            const enrichedItems = await enrichCartWithProducts(items);
            setCartItems(enrichedItems);
            localStorage.setItem('cartItems', JSON.stringify(enrichedItems));
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to update quantity';
            setError(errorMessage);
            console.error('Error updating quantity:', errorMessage);
            // Refresh to restore state
            try {
                const response = await cartAPI.getCartItems();
                const items = response.data.data || [];
                const enrichedItems = await enrichCartWithProducts(items);
                setCartItems(enrichedItems);
            } catch (e) {
                console.error('Error refreshing cart:', e);
            }
        }
    };

    const clearCart = async () => {
        try {
            setError(null);
            const productIds = cartItems.map(item => item.productId);
            
            if (productIds.length > 0) {
                await cartAPI.removeMultipleItems(productIds);
            }
            
            setCartItems([]);
            localStorage.setItem('cartItems', JSON.stringify([]));
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to clear cart';
            setError(errorMessage);
            console.error('Error clearing cart:', errorMessage);
        }
    };

    // Transform cart items for checkout (exclude metadata fields)
    const getCheckoutItems = () => {
        return cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));
    };

    const cartTotal = cartItems.reduce((total, item) => {
        const price = item.price || item.discountPrice || item.originalPrice || 0;
        return total + price * item.quantity;
    }, 0);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
                getCheckoutItems,
                loading,
                error
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

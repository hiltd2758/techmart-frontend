import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useCart } from '../Context/CartContext';
import { cartAPI } from '../api/cartAPI';
import { checkoutAPI } from '../api/checkoutAPI';

export const useCheckout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems } = useCart();

    const handleCheckout = async () => {
        try {
            if (!user) {
                navigate('/login');
                return;
            }

            const cartResponse = await cartAPI.getCartItems();
            const items = cartResponse.data.data || [];

            const checkoutItems = items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            const checkoutResponse = await checkoutAPI.createCheckout({
                items: checkoutItems,
                customerId: user.id || user.userId
            });

            const checkoutId = checkoutResponse.data.data.id || checkoutResponse.data.data.checkoutId;

            localStorage.setItem('checkoutId', checkoutId);
            navigate('/checkout');
        } catch (error) {
            console.error('Error creating checkout:', error);
            throw error;
        }
    };

    return { handleCheckout };
};
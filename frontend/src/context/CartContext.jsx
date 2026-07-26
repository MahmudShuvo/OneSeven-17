import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const LOCAL_KEY = 'borkha_cart';

export function CartProvider({ children }) {
  const { user } = useAuth();
  // cart items: { product: {...}, quantity }
  const [items, setItems] = useState([]);

  // Load cart on mount or when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (user?.token) {
        try {
          const { data } = await api.get('/cart');
          setItems(data);
        } catch (e) {
          console.error('Failed loading cart', e);
        }
      } else {
        const stored = localStorage.getItem(LOCAL_KEY);
        if (stored) {
          try { setItems(JSON.parse(stored)); } catch {}
        } else {
          setItems([]);
        }
      }
    };
    loadCart();
  }, [user]);

  // Persist guest cart locally
  useEffect(() => {
    if (!user) localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  }, [items, user]);

  const addItem = async (product, quantity = 1) => {
    if (user?.token) {
      const { data } = await api.post('/cart', { productId: product._id, quantity });
      setItems(data);
    } else {
      setItems((prev) => {
        const found = prev.find((i) => i.product._id === product._id);
        if (found) {
          return prev.map((i) =>
            i.product._id === product._id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prev, { product, quantity }];
      });
    }
    toast.success(`${product.name} added to cart`);
  };

  const updateQty = async (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    if (user?.token) {
      const { data } = await api.put(`/cart/${productId}`, { quantity });
      setItems(data);
    } else {
      setItems((prev) =>
        prev.map((i) => (i.product._id === productId ? { ...i, quantity } : i))
      );
    }
  };

  const removeItem = async (productId) => {
    if (user?.token) {
      const { data } = await api.delete(`/cart/${productId}`);
      setItems(data);
    } else {
      setItems((prev) => prev.filter((i) => i.product._id !== productId));
    }
    toast.success('Removed from cart');
  };

  const clearCart = async () => {
    if (user?.token) {
      await api.delete('/cart');
    } else {
      localStorage.removeItem(LOCAL_KEY);
    }
    setItems([]);
  };

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQty, removeItem, clearCart, totalCount, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

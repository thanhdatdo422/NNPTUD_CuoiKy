import api from './api';

export const cartService = {
  getCart: async () => {
    const response = await api.get('/carts');
    return response.data;
  },

  addToCart: async (productId, quantity) => {
    const response = await api.post('/carts', { product: productId, quantity });
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/carts/${itemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await api.delete(`/carts/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/carts');
    return response.data;
  },
};
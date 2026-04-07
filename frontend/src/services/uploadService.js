import api from './api';

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/uploads', formData);
    return response.data;
  },
};

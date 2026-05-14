import { sendContactMessage } from './api';

export const sendEmail = async (formData) => {
  try {
    const result = await sendContactMessage(formData);
    return result.success ? { success: true } : { success: false, error: result.error };
  } catch (error) {
    console.error('Failed to send message:', error);
    return { success: false, error: error?.message || 'Network error' };
  }
};

export const sendEmail = async (formData) => {
  try {
    const netlifyData = new URLSearchParams();
    netlifyData.append('form-name', 'contact');
    netlifyData.append('name', formData.name);
    netlifyData.append('email', formData.email);
    netlifyData.append('phone', formData.phone || '');
    netlifyData.append('subject', formData.subject);
    netlifyData.append('message', formData.message);
    netlifyData.append('bot-field', '');

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: netlifyData.toString()
    });

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: `Server error: ${response.status}` };
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    return { success: false, error: error?.message || 'Network error' };
  }
};

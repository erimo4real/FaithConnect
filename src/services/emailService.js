export const sendEmail = async (formData) => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocal) {
    console.log('Local dev — form data logged (not sent):', formData);
    return { success: true, demo: true };
  }

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
      body: netlifyData.toString(),
      redirect: 'follow'
    });

    if (response.ok || response.redirected) {
      return { success: true };
    } else {
      const text = await response.text().catch(() => '');
      console.error('Netlify form error:', response.status, text);
      return { success: false, error: `Server error: ${response.status}` };
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    return { success: false, error: error?.message || 'Network error' };
  }
};

import emailjs from '@emailjs/browser';

// EmailJS Configuration
// Get these from your EmailJS account: https://www.emailjs.com/
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

export const sendEmail = async (formData) => {
  try {
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      to_email: 'bethelministriesinc01@gmail.com',
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully:', response);
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.text };
  }
};

// Formspree endpoint configuration
// Replace with your actual Formspree form ID after creating a form at https://formspree.io
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

export async function submitContactForm(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      return { success: true, message: 'Message sent successfully!' };
    }

    const data = await response.json();
    if (data.errors) {
      return { success: false, message: data.errors.map((e: any) => e.message).join(', ') };
    }
    return { success: false, message: 'Failed to send message. Please try again.' };
  } catch (error) {
    console.error('Form submission error:', error);
    return { success: false, message: 'Network error. Please try again later.' };
  }
}
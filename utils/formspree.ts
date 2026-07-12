/**
 * Formspree configuration and submission utility
 */

interface FormspreeConfig {
  endpoint: string;
  formId: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormspreeResponse {
  ok: boolean;
  message: string;
}

// Default Formspree endpoint - replace with your actual Formspree form ID
const FORMSPREE_CONFIG: FormspreeConfig = {
  endpoint: 'https://formspree.io/f/',
  formId: 'your-form-id', // Replace with actual Formspree form ID
};

const FORMSPREE_URL = `${FORMSPREE_CONFIG.endpoint}${FORMSPREE_CONFIG.formId}`;

/**
 * Submit contact form data to Formspree
 */
export async function submitContactForm(data: FormData): Promise<FormspreeResponse> {
  try {
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      return { ok: true, message: 'Message sent successfully!' };
    } else {
      return { ok: false, message: result.error || 'Failed to send message. Please try again.' };
    }
  } catch (error) {
    console.error('Formspree submission error:', error);
    return { ok: false, message: 'Network error. Please check your connection and try again.' };
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

/**
 * Validate form data before submission
 */
export function validateFormData(data: FormData): { valid: boolean; errors: Partial<Record<keyof FormData, string>> } {
  const errors: Partial<Record<keyof FormData, string>> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.subject || data.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters';
  }

  if (!data.message || data.message.trim().length < 20) {
    errors.message = 'Message must be at least 20 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Format form data for Formspree
 */
export function formatFormspreeData(data: FormData): Record<string, string> {
  return {
    name: data.name.trim(),
    email: data.email.trim(),
    subject: data.subject.trim(),
    message: data.message.trim(),
    _replyto: data.email.trim(),
    _subject: `Portfolio Contact: ${data.subject.trim()}`,
  };
}
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Keyboard } from 'react-native';
import { useForm } from 'react-hook-form';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { Icon } from '../ui/Icon';
import { arcSpring, motion } from '../../constants/design-tokens';
import { Easing } from 'react-native-reanimated';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const quickTags = [
  { label: 'Freelance', subject: 'Freelance Inquiry' },
  { label: 'Collaborations', subject: 'Collaboration Proposal' },
  { label: 'Speaking', subject: 'Speaking Engagement' },
  { label: 'Mentorship', subject: 'Mentorship Request' },
  { label: 'Open Source', subject: 'Open Source Contribution' },
];

/**
 * ContactForm - Formspree contact form with validation
 */
export const ContactForm = () => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const subject = watch('subject');

  const successAnim = useSharedValue(0);
  const errorAnim = useSharedValue(0);

  const successStyle = useAnimatedStyle(() => ({
    opacity: successAnim.value,
    transform: [{ translateY: withSpring(-10 * (1 - successAnim.value), arcSpring) }],
  }));

  const errorStyle = useAnimatedStyle(() => ({
    opacity: errorAnim.value,
    transform: [{ translateY: withSpring(-10 * (1 - errorAnim.value), arcSpring) }],
  }));

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('submitting');
    Keyboard.dismiss();

    try {
      // Formspree endpoint - replace with actual endpoint
      const response = await fetch('https://formspree.io/f/your-form-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        successAnim.value = withSpring(1, arcSpring);
        reset();
        setSelectedTag('');

        // Reset after 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
          successAnim.value = withSpring(0, arcSpring);
        }, 5000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setSubmitStatus('error');
      errorAnim.value = withSpring(1, arcSpring);

      setTimeout(() => {
        setSubmitStatus('idle');
        errorAnim.value = withSpring(0, arcSpring);
      }, 5000);
    }
  };

  const handleTagPress = (tag: typeof quickTags[0]) => {
    setSelectedTag(tag.subject);
    setValue('subject', tag.subject, { shouldValidate: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>Contact</Text>
        <Text style={styles.sectionTitle}>Get In Touch</Text>
      </View>

      {/* Quick select tags */}
      <View style={styles.tagsSection}>
        <Text style={styles.tagsLabel}>What\'s this about?</Text>
        <View style={styles.tagsRow}>
          {quickTags.map((tag) => (
            <Pressable
              key={tag.label}
              onPress={() => handleTagPress(tag)}
              style={({ pressed }) => [
                styles.tagButton,
                selectedTag === tag.subject && styles.tagSelected,
                pressed && styles.tagPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedTag === tag.subject }}
            >
              <Text style={[
                styles.tagText,
                selectedTag === tag.subject && styles.tagTextSelected,
              ]}>
                {tag.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <View style={styles.row}>
          <Input
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
            label="Name"
            placeholder="Your name"
            error={errors.name?.message}
            testID="contact-name"
          />
          <Input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email?.message}
            testID="contact-email"
          />
        </View>

        <Input
          {...register('subject', {
            required: 'Subject is required',
          })}
          label="Subject"
          placeholder="What's this about?"
          error={errors.subject?.message}
          testID="contact-subject"
        />

        <Textarea
          {...register('message', {
            required: 'Message is required',
            minLength: { value: 20, message: 'Message must be at least 20 characters' },
          })}
          label="Message"
          placeholder="Tell me about your project, idea, or question..."
          rows={6}
          error={errors.message?.message}
          testID="contact-message"
        />

        {/* Status messages */}
        <View style={[styles.status, successStyle]}>
          <View style={styles.successMessage}>
            <Icon name="check" size={20} color="var(--success)" />
            <Text style={styles.successText}>Thanks! Your message has been sent. I\'ll get back to you soon.</Text>
          </View>
        </View>

        <View style={[styles.status, styles.statusError, errorStyle]}>
          <View style={styles.errorMessage}>
            <Icon name="x" size={20} color="var(--danger)" />
            <Text style={styles.errorText}>Something went wrong. Please try again or email directly.</Text>
          </View>
        </View>

        {/* Submit button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={submitStatus === 'submitting'}
          onPress={() => {}}
          testID="contact-submit"
        >
          {submitStatus === 'submitting' ? 'Sending...' : 'Send Message'}
        </Button>

        {/* Direct contact fallback */}
        <View style={styles.directContact}>
          <Text style={styles.directText}>Prefer email? </Text>
          <Pressable
            onPress={() => {}}
            accessibilityLabel="Email me directly"
            testID="contact-direct-email"
          >
            <Text style={styles.directLink}>arnstdobrucky48@gmail.com</Text>
          </Pressable>
        </View>
      </form>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  sectionLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    fontWeight: '600',
    color: 'var(--accent)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 40,
    fontWeight: '400',
    color: 'var(--fg)',
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    textAlign: 'center',
  },
  tagsSection: {
    marginBottom: 24,
  },
  tagsLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: '500',
    color: 'var(--fg-2)',
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 95, 95, 0.16)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagSelected: {
    backgroundColor: 'var(--accent)',
    borderColor: 'var(--accent)',
  },
  tagPressed: {
    opacity: 0.8,
  },
  tagText: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    fontWeight: '500',
    color: 'var(--accent)',
  },
  tagTextSelected: {
    color: '#fff',
  },
  form: {
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  rowChild: {
    flex: 1,
  },
  status: {
    height: 0,
    overflow: 'hidden',
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: 'rgba(72, 187, 120, 0.16)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'var(--success)',
  },
  successText: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--success)',
  },
  statusError: {
    // Error styles
  },
  errorMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: 'rgba(245, 101, 101, 0.16)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'var(--danger)',
  },
  errorText: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--danger)',
  },
  directContact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'var(--border-soft)',
  },
  directText: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--fg-2)',
  },
  directLink: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: '500',
    color: 'var(--accent)',
  },
});

export default ContactForm;
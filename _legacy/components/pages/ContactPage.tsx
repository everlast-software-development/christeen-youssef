import React, { useState } from 'react';
import { PageTransition } from '../layout/PageTransition';
import { schedule } from '../../data/schedule';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import styles from './ContactPage.module.css';

interface FormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your name (at least 2 characters).';
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 5) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 2) {
      newErrors.subject = 'Please enter a subject (at least 2 characters).';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please enter your message (at least 10 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      } else {
        setErrors({
          ...errors,
          ...data.errors?.reduce((acc: FormErrors, err: string) => {
            if (err.toLowerCase().includes('name')) acc.name = err;
            if (err.toLowerCase().includes('phone')) acc.phone = err;
            if (err.toLowerCase().includes('email')) acc.email = err;
            if (err.toLowerCase().includes('subject')) acc.subject = err;
            if (err.toLowerCase().includes('message')) acc.message = err;
            return acc;
          }, {} as FormErrors)
        });
      }
    } catch (error) {
      setErrors({ message: 'Something went wrong. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrors({});
  };

  return (
    <PageTransition>
      <div>
        {/* Hero Banner */}
        <section className={styles.heroBanner}>
          <div className={styles.bannerContent}>
            <h1>Reach Me</h1>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className={styles.contactSection}>
          <div className={styles.container}>
            {isSuccess ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                <button onClick={handleReset} className={styles.resetButton}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className={styles.contactGrid}>
                {/* Contact Info Side */}
                <div className={styles.contactInfo}>
                  <h2 className={styles.infoTitle}>Get in Touch</h2>
                  <p className={styles.infoDescription}>
                    Have a question or want to learn more about our services? Fill out the form below & we'll get back to you shortly.
                  </p>
                  
                  <div className={styles.infoItems}>
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <FiMapPin size={20} />
                      </div>
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>Location</span>
                        <span className={styles.infoValue}>{schedule.address}</span>
                      </div>
                    </div>
                    
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <FiPhone size={20} />
                      </div>
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>Phone</span>
                        <a href={`tel:${schedule.phone}`} className={styles.infoLink}>{schedule.phone}</a>
                      </div>
                    </div>
                    
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <FiMail size={20} />
                      </div>
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>Email</span>
                        <a href="mailto:christeen.youssef@everlastwellness.com" className={styles.infoLink}>christeen.youssef@everlastwellness.com</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Side */}
                <div className={styles.formWrapper}>
                  <form onSubmit={handleSubmit}>
                  <div className={styles.formGrid}>
                    {/* Name Field */}
                    <div className={styles.formGroup}>
                      <label htmlFor="name">
                        Your Name <span>*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={styles.formInput}
                      />
                      {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                    </div>

                    {/* Phone Field */}
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">
                        Phone Number <span>*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+971 50 123 4567"
                        className={styles.formInput}
                      />
                      {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                    </div>

                    {/* Email Field */}
                    <div className={styles.formGroup}>
                      <label htmlFor="email">
                        Email Address <span>*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={styles.formInput}
                      />
                      {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                    </div>

                    {/* Subject Field */}
                    <div className={styles.formGroup}>
                      <label htmlFor="subject">
                        Subject <span>*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className={styles.formInput}
                      />
                      {errors.subject && <span className={styles.errorMessage}>{errors.subject}</span>}
                    </div>

                    {/* Message Field */}
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label htmlFor="message">
                        Your Message <span>*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        className={styles.formTextarea}
                        rows={5}
                      />
                      {errors.message && <span className={styles.errorMessage}>{errors.message}</span>}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className={styles.spinner}></span>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

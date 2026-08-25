import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../layout/PageTransition';
import { fadeDown, fadeUp } from '../../utils/motion';
import { countries, getCountryByCode } from '../../data/countries';
import styles from './AppointmentPage.module.css';

const CountrySelect: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectedCountry = countries.find(c => c.dialCode === value);

  const getFlagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm)
  );

  return (
    <div className={styles.countrySelect}>
      <div className={styles.countrySelectButton} onClick={() => setIsOpen(!isOpen)}>
        {selectedCountry && (
          <>
            <img src={getFlagUrl(selectedCountry.code)} alt="" className={styles.flagIcon} />
            <span>{selectedCountry.name} ({selectedCountry.dialCode})</span>
          </>
        )}
        <span className={styles.selectArrow}>▼</span>
      </div>
      {isOpen && (
        <div className={styles.countryDropdown}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className={styles.countryList}>
            {filteredCountries.map(country => (
              <div
                key={country.code}
                className={styles.countryOption}
                onClick={() => {
                  onChange(country.dialCode);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                <img src={getFlagUrl(country.code)} alt="" className={styles.flagIcon} />
                <span>{country.name} ({country.dialCode})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const services = [
  'Select a Service',
  'Dermatology Consultation',
  'Aesthetic Treatment',
  'Laser Therapy',
  'Skin Rejuvenation',
  'Scar Treatment',
  'Burn Healing',
  'Thread Lifting',
  'Anti-Aging Treatment',
  'Other'
];

export const AppointmentPage: React.FC = () => {
  const [formData, setFormData] = useState({
    patientType: 'new',
    name: '',
    countryCode: '+971',
    phone: '',
    whatsapp: '',
    email: '',
    service: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch country from Cloudflare header on component mount
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/country');
        const data = await response.json();
        if (data.countryCode) {
          const country = getCountryByCode(data.countryCode);
          if (country) {
            setFormData(prev => ({ ...prev, countryCode: country.dialCode }));
          }
        } else {
          // Fallback to Egypt if no country detected
          setFormData(prev => ({ ...prev, countryCode: '+20' }));
        }
      } catch (error) {
        console.error('Failed to fetch country:', error);
        // Fallback to Egypt on error
        setFormData(prev => ({ ...prev, countryCode: '+20' }));
      }
    };

    fetchCountry();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePatientTypeChange = (type: 'new' | 'current') => {
    setFormData(prev => ({ ...prev, patientType: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({
      patientType: 'new',
      name: '',
      countryCode: '+971',
      phone: '',
      whatsapp: '',
      email: '',
      service: '',
      message: '',
    });
  };

  return (
    <PageTransition>
      {/* Hero Banner */}
      <section className={styles.heroBanner}>
        <motion.div
          className={styles.bannerContent}
          initial="hidden"
          animate="visible"
          variants={fadeDown}
          transition={{ duration: 0.6 }}
        >
          <h1>Make an appointment</h1>
        </motion.div>
      </section>

      {/* Form Section */}
      <section className={styles.formSection}>
        <div className={styles.container}>
          {submitted ? (
            <motion.div
              className={styles.successMessage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={styles.successIcon}>✓</div>
              <h2>Thank You!</h2>
              <p>Your appointment request has been submitted. We will contact you shortly to confirm your booking.</p>
              <button
                onClick={() => setSubmitted(false)}
                className={styles.newBookingBtn}
              >
                Make Another Booking
              </button>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className={styles.form}
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true }}
            >
                {/* Patient Type */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>New or Current Patient</label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="patientType"
                        value="new"
                        checked={formData.patientType === 'new'}
                        onChange={() => handlePatientTypeChange('new')}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioCustom}></span>
                      New Patient
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="patientType"
                        value="current"
                        checked={formData.patientType === 'current'}
                        onChange={() => handlePatientTypeChange('current')}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioCustom}></span>
                      Current Patient
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={styles.input}
                    required
                  />
                </div>

                {/* Phone Row */}
                <div className={styles.formRow}>
                  <div className={styles.formGroupSmall}>
                    <label className={styles.label}>Country Code</label>
                    <CountrySelect
                      value={formData.countryCode}
                      onChange={(value) => setFormData(prev => ({ ...prev, countryCode: value }))}
                    />
                  </div>
                  <div className={styles.formGroupLarge}>
                    <label htmlFor="phone" className={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className={styles.input}
                      required
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className={styles.formGroup}>
                  <label htmlFor="whatsapp" className={styles.label}>WhatsApp Number</label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="Enter WhatsApp number (optional)"
                    className={styles.input}
                  />
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={styles.input}
                    required
                  />
                </div>

                {/* Service */}
                <div className={styles.formGroup}>
                  <label htmlFor="service" className={styles.label}>Select Service</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={styles.select}
                    required
                  >
                    {services.map((service, index) => (
                      <option key={index} value={index === 0 ? '' : service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your concerns or preferred appointment time..."
                    className={styles.textarea}
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </motion.form>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

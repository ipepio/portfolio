import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { SendIcon, MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import useContactForm from "@/hooks/useContactForm";
// import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

import { motion } from "framer-motion";
import { locales } from "@/data/locales";
import "./Contact.css";

export default function Contact() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const t = locales[language];

  const {
    formData,
    formErrors,
    formStatus,
    handleChange,
    handleSubmit
  } = useContactForm();

  return (
    <section className={`contact-section ${theme}`} id="contacto">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h2 className="contact-title">{t.contactTitle}</h2>
          <div className={`contact-underline ${theme}`}></div>
        </div>

        <p className={`contact-description ${theme}`}>{t.contactDescription}</p>

        <div className="contact-content">
          {/* Form */}
          <motion.form 
            className={`contact-form ${theme}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
          >
            <div className="form-dual form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="name">{t.nameLabel}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${theme} ${formErrors.name ? 'error' : ''}`}
                  placeholder={t.namePlaceholder}
                  disabled={formStatus === "loading"}
                />
                {formErrors.name && <small className="form-error">{formErrors.name}</small>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">{t.emailLabel}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${theme} ${formErrors.email ? 'error' : ''}`}
                  placeholder={t.emailPlaceholder}
                  disabled={formStatus === "loading"}
                />
                {formErrors.email && <small className="form-error">{formErrors.email}</small>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="subject">{t.subjectLabel}</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`form-input ${theme} ${formErrors.subject ? 'error' : ''}`}
                  placeholder={t.subjectPlaceholder}
                  disabled={formStatus === "loading"}
                />
                {formErrors.subject && <small className="form-error">{formErrors.subject}</small>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="message">{t.messageLabel}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`form-textarea ${theme} ${formErrors.message ? 'error' : ''}`}
                  placeholder={t.messagePlaceholder}
                  disabled={formStatus === "loading"}
                />
                {formErrors.message && <small className="form-error">{formErrors.message}</small>}
              </div>
            </div>

            <button 
              type="submit" 
              className={`form-button ${theme}`}
              disabled={formStatus === "loading"}
            >
              {formStatus === "loading" ? (
                <>
                  <div className="spinner"></div>
                  {t.sending}
                </>
              ) : (
                <>
                  <SendIcon size={18} />
                  {t.sendButton}
                </>
              )}
            </button>

            {formStatus === "success" && (
              <div className="form-status success">
                {t.successMessage}
              </div>
            )}

            {formStatus === "error" && (
              <div className="form-status error">
                {t.errorMessage}
              </div>
            )}
          </motion.form>

          {/* Contact information */}
          <div className={`contact-info ${theme}`}>
            <div className={`contact-info-item ${theme}`}>
              <div className={`contact-info-icon ${theme}`}>
                <MailIcon size={24} />
              </div>
              <div className="contact-info-content">
                <h3 className={`contact-info-title ${theme}`}>{t.email}</h3>
                <p className={`contact-info-text ${theme}`}>ipepio@outlook.es</p>
              </div>
            </div>

            <div className={`contact-info-item ${theme}`}>
              <div className={`contact-info-icon ${theme}`}>
                <PhoneIcon size={24} />
              </div>
              <div className="contact-info-content">
                <h3 className={`contact-info-title ${theme}`}>{t.phone}</h3>
                <p className={`contact-info-text ${theme}`}>+34 657 098 798</p>
              </div>
            </div>

            <div className={`contact-info-item ${theme}`}>
              <div className={`contact-info-icon ${theme}`}>
                <MapPinIcon size={24} />
              </div>
              <div className="contact-info-content">
                <h3 className={`contact-info-title ${theme}`}>{t.location}</h3>
                <p className={`contact-info-text ${theme}`}>Vinaròs, España</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
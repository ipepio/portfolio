import { FormEvent, useState, ChangeEvent } from 'react';
import emailjs from '@emailjs/browser';
import { EMAIL_JS_CONFIG } from '@/data/env_data';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const useContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "El nombre es obligatorio";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "El email es obligatorio";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = "El email no es válido";
      isValid = false;
    }

    if (!formData.subject.trim()) {
      errors.subject = "El asunto es obligatorio";
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = "El mensaje es obligatorio";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormStatus("loading");

    try {
      // Inicializar EmailJS
      emailjs.init(EMAIL_JS_CONFIG.publicKey);

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      await emailjs.send(
        EMAIL_JS_CONFIG.serviceID, 
        EMAIL_JS_CONFIG.templateID, 
        templateParams, 
        EMAIL_JS_CONFIG.publicKey
      );

      setFormStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (error) {
      console.error("Error enviando el email:", error);
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  return {
    formData,
    formErrors,
    formStatus,
    setFormData,
    handleChange,
    handleSubmit,
  };
};

export default useContactForm;
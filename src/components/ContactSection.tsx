import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram, Send, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ContactSubmission } from '../types';

interface ContactSectionProps {
  initialInterest: string;
  onNewSubmission: (submission: Omit<ContactSubmission, 'id' | 'submittedAt' | 'status'>) => void;
}

export default function ContactSection({ initialInterest, onNewSubmission }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterest: 'Mental Health Counseling',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync initial interest if it changes from other sections
  useEffect(() => {
    if (initialInterest) {
      setFormData((prev) => ({ ...prev, serviceInterest: initialInterest }));
    }
  }, [initialInterest]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please complete the Name, Email, and Message fields.');
      return;
    }

    // Pass to parent store logger
    onNewSubmission({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      serviceInterest: formData.serviceInterest,
      message: formData.message
    });

    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      serviceInterest: 'Mental Health Counseling',
      message: ''
    });

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  const servicesDropdownOptions = [
    'Mental Health Counseling',
    'Emotional & Wellness Tools',
    'Educational Resources',
    'Well-Mart (E-Marketplace)',
    'Corporate Wellness Programs',
    'Student Intervention Programs',
    'Home Health Services',
    'Institutional General Inquiry',
    'Other Care Questions'
  ];

  return (
    <section id="contact-section" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header container */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <span className="text-xs sm:text-sm font-bold font-mono text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Inquiries & Bookings
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-dark tracking-tight">
            Take the First Step Today
          </h2>
          <p className="mt-4 text-base text-muted">
            Whether you want to schedule a group workshop, purchase therapeutic bundles for your family, or matching with counselor consultants, let’s begin.
          </p>
          <div className="w-16 h-1 bg-accent/40 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          
          {/* Left Column: Interactive Form */}
          <div className="lg:col-span-7 bg-bggray p-6 sm:p-10 rounded-3xl border border-primary/5 shadow-sm">
            
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8"
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-2xl text-dark">Thank you, Namaste!</h3>
                  <p className="text-sm text-muted mt-2 max-w-sm mx-auto leading-relaxed">
                    We have successfully captured your consultation parameters and compiled them into our dashboard. A Care Allocator will evaluate your submission and contact you within 2-4 business hours!
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Dual Field Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div>
                    <label htmlFor="name-input" className="block text-xs font-bold text-dark uppercase tracking-wider mb-2 font-mono">
                      Your Full Name *
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Thapa"
                      className="w-full bg-white text-dark px-4 py-3 rounded-xl border border-primary/10 focus:outline-none focus:border-primary text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email-input" className="block text-xs font-bold text-dark uppercase tracking-wider mb-2 font-mono">
                      Your Email Address *
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. ramesh@gmail.com"
                      className="w-full bg-white text-dark px-4 py-3 rounded-xl border border-primary/10 focus:outline-none focus:border-primary text-sm transition-colors"
                    />
                  </div>

                </div>

                {/* Dual Field Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div>
                    <label htmlFor="phone-input" className="block text-xs font-bold text-dark uppercase tracking-wider mb-2 font-mono">
                      Phone Number (Nepal format)
                    </label>
                    <input
                      id="phone-input"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 98XXXXXXXX"
                      className="w-full bg-white text-dark px-4 py-3 rounded-xl border border-primary/10 focus:outline-none focus:border-primary text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="interest-dropdown" className="block text-xs font-bold text-dark uppercase tracking-wider mb-2 font-mono">
                      Service of Interest
                    </label>
                    <select
                      id="interest-dropdown"
                      name="serviceInterest"
                      value={formData.serviceInterest}
                      onChange={handleChange}
                      className="w-full bg-white text-dark px-4 py-3 rounded-xl border border-primary/10 focus:outline-none focus:border-primary text-sm transition-colors cursor-pointer"
                    >
                      {servicesDropdownOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message-textbox" className="block text-xs font-bold text-dark uppercase tracking-wider mb-2 font-mono">
                    Describe your needs or questions *
                  </label>
                  <textarea
                    id="message-textbox"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="We want to support you. Let us know what you're looking for or experiencing..."
                    className="w-full bg-white text-dark px-4 py-3 rounded-xl border border-primary/10 focus:outline-none focus:border-primary text-sm transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold text-sm shadow-md cursor-pointer transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Request</span>
                </button>

                <p className="text-[10px] text-muted text-center font-mono leading-relaxed">
                  By clicking Send, your inquiry parameters are mapped to our internal Allocator logs. Your data remains protected by the Nepa Health strict clinical security guidelines.
                </p>

              </form>
            )}

          </div>

          {/* Right Column: Contact details & map mock */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-secondary/20 p-6 sm:p-10 rounded-3xl border border-primary/5">
            
            {/* Contact Parameters */}
            <div className="space-y-6">
              
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-primary font-mono block uppercase tracking-widest">
                  Contact Support
                </span>
                <h3 className="font-serif font-bold text-2xl text-dark leading-snug">
                  Reach out through the form above
                </h3>
                <p className="text-sm text-muted">
                  Our care coordination team monitors this inbox during working hours. Please share your request there and we will follow up promptly.
                </p>
              </div>

              <div className="space-y-3.5 pt-4 border-t border-primary/5">
                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-dark text-xs sm:text-sm">Service Area</h4>
                    <p className="text-sm text-muted leading-tight mt-0.5">Kathmandu Valley and nationwide remote support.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-dark text-xs sm:text-sm">Support Hours</h4>
                    <p className="text-sm text-muted leading-tight mt-0.5">Mon–Sat, 9AM–6PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Mail className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-dark text-xs sm:text-sm">Contact Method</h4>
                    <p className="text-sm text-muted leading-tight mt-0.5">Please use the inquiry form above to connect with our team.</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Google Map for Jhamsikhel Lalitpur */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-primary/10 shadow-sm">
              <iframe
                title="Nepa Health Jhamsikhel Lalitpur Location"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.3097375242824!2d85.31904567411265!3d27.666228382794785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1938244e2d49%3A0x5f646d9d5b122f36!2sJhamsikhel%2C%20Lalitpur%2C%20Nepal!5e0!3m2!1sen!2sus!4v1712345678901"
              />
            </div>

            {/* Social Footers with placeholder paths */}
            <div className="flex items-center space-x-4 pt-4 border-t border-primary/5">
              <span className="text-xs text-muted font-mono uppercase font-bold tracking-wider mr-2">
                Join our channels:
              </span>
              <a
                href="#facebook"
                aria-label="Visit Facebook page"
                className="w-9 h-9 rounded-xl bg-white hover:bg-primary hover:text-white text-muted flex items-center justify-center transition-colors border border-primary/10 cursor-pointer"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a
                href="#linkedin"
                aria-label="Visit LinkedIn page"
                className="w-9 h-9 rounded-xl bg-white hover:bg-primary hover:text-white text-muted flex items-center justify-center transition-colors border border-primary/10 cursor-pointer"
              >
                <Linkedin className="w-4.5 h-4.5" />
              </a>
              <a
                href="#instagram"
                aria-label="Visit Instagram page"
                className="w-9 h-9 rounded-xl bg-white hover:bg-primary hover:text-white text-muted flex items-center justify-center transition-colors border border-primary/10 cursor-pointer"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

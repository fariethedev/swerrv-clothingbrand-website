import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiMail, HiPhone, HiCheckCircle } from 'react-icons/hi';
import { FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            access_key: "62af5c85-8d88-439d-921e-e50bd3c8ac1c",
            name: form.name,
            email: form.email,
            subject: form.subject || "No Subject",
            message: form.message,
            from_name: "Swerrv Contact Form"
        };

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                setSent(true);
                setForm({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setSent(false), 5000);
            }
        } catch (error) {
            console.error("Form submission error:", error);
        }
    };

    return (
        <div className="contact-page">
            {/* Hero */}
            <div className="contact-hero">
                <div className="contact-hero-bg">
                    <img 
                        src="/images/_DSC8415.jpg" 
                        alt="Contact Us" 
                        className="contact-hero-img" 
                    />
                    <div className="contact-hero-overlay"></div>
                </div>
                <div className="contact-hero-content">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.7 }}
                    >
                        <span className="contact-hero-subtitle">Get in touch</span>
                        <h1 className="contact-hero-title">We'd love to<br />hear from you</h1>
                    </motion.div>
                </div>
            </div>

            {/* Body */}
            <div className="contact-container">
                <div className="contact-grid">
                    {/* Form */}
                    <motion.form 
                        onSubmit={handleSubmit} 
                        className="contact-glass-card"
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }} 
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="contact-section-title">Send a message</h2>
                        
                        <div className="contact-form-row">
                            <div className="contact-form-group">
                                <label className="contact-form-label">Name</label>
                                <input 
                                    type="text" 
                                    value={form.name} 
                                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} 
                                    placeholder="Your name" 
                                    required 
                                    className="contact-form-input pill" 
                                />
                            </div>
                            <div className="contact-form-group">
                                <label className="contact-form-label">Email</label>
                                <input 
                                    type="email" 
                                    value={form.email} 
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))} 
                                    placeholder="you@email.com" 
                                    required 
                                    className="contact-form-input pill" 
                                />
                            </div>
                        </div>

                        <div className="contact-form-group">
                            <label className="contact-form-label">Subject</label>
                            <select 
                                value={form.subject} 
                                onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} 
                                required 
                                className="contact-form-input contact-form-select pill"
                            >
                                <option value="" className="bg-black">Select a subject</option>
                                {['Order Issue', 'Returns & Exchanges', 'Product Question', 'Wholesale / Collaboration', 'Press Inquiry', 'Other'].map(s => (
                                    <option key={s} value={s} className="bg-black">{s}</option>
                                ))}
                            </select>
                        </div>

                        <div className="contact-form-group">
                            <label className="contact-form-label">Message</label>
                            <textarea 
                                value={form.message} 
                                onChange={e => setForm(p => ({ ...p, message: e.target.value }))} 
                                placeholder="Tell us what's on your mind..." 
                                rows={6} 
                                required 
                                className="contact-form-input contact-form-textarea" 
                            />
                        </div>

                        {sent ? (
                            <motion.div 
                                className="contact-success-alert" 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <HiCheckCircle size={20} />
                                <span>Message sent! We'll get back to you within 24 hours.</span>
                            </motion.div>
                        ) : (
                            <div>
                                <button type="submit" className="contact-submit-btn">Send message</button>
                            </div>
                        )}
                    </motion.form>

                    {/* Info */}
                    <motion.div 
                        className="contact-glass-card"
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }} 
                        transition={{ duration: 0.7, delay: 0.15 }}
                    >
                        <h3 className="contact-section-title">Contact info</h3>
                        <div className="contact-info-list">
                            {[
                                { icon: <HiMail size={20} />, label: 'Email', value: 'support@swerrv.com' },
                                { icon: <HiPhone size={20} />, label: 'Phone', value: '+1 (888) SWERRV-1' },
                                { icon: <HiLocationMarker size={20} />, label: 'Studio', value: 'New York, NY' },
                            ].map(item => (
                                <div key={item.label} className="contact-info-item">
                                    <div className="contact-info-icon-wrapper">
                                        {item.icon}
                                    </div>
                                    <div className="contact-info-detail">
                                        <span className="contact-info-label-text">{item.label}</span>
                                        <span className="contact-info-value-text">{item.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="contact-card-divider"></div>
                        
                        <div>
                            <p className="contact-info-label-text" style={{ marginBottom: '16px' }}>Business Hours</p>
                            {[['Mon – Fri', '9am – 6pm EST'], ['Saturday', '10am – 4pm EST'], ['Sunday', 'Closed']].map(([day, hours]) => (
                                <div key={day} className="contact-hours-row">
                                    <span>{day}</span>
                                    <span>{hours}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="contact-card-divider"></div>
                        
                        <div>
                            <p className="contact-info-label-text" style={{ marginBottom: '16px' }}>Follow Us</p>
                            <div className="contact-social-row">
                                {[
                                    { Icon: FaInstagram, href: "#" },
                                    { Icon: FaTwitter, href: "#" },
                                    { Icon: FaTiktok, href: "#" }
                                ].map(({ Icon, href }, i) => (
                                    <a key={i} href={href} className="contact-social-link">
                                        <Icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            
            {/* FAQs */}
            <div className="contact-faq-section">
                <div className="contact-faq-container">
                    <h3 className="contact-faq-title">Quick FAQs</h3>
                    <div className="contact-faq-list">
                        {[
                            { q: 'How long does shipping take?', a: 'Standard shipping takes 5–7 business days. Express 2–3 days.' },
                            { q: 'What is your return policy?', a: 'We offer 30-day returns on unworn items in original packaging.' },
                            { q: 'Do you ship internationally?', a: 'Yes! We ship to 40+ countries worldwide.' },
                        ].map((faq, i) => (
                            <div key={i} className="contact-faq-item">
                                <p className="contact-faq-q">{faq.q}</p>
                                <p className="contact-faq-a">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

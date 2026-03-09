import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiMail, HiPhone, HiCheckCircle } from 'react-icons/hi';
import { FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';

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
        <div className="min-h-screen pt-[70px]">
            {/* Hero */}
            <div className="relative bg-grey-900 border-b border-white/[0.06] py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/_DSC8415.jpg" alt="Contact Us" className="w-full h-full object-cover opacity-40" style={{ objectPosition: 'center 30%' }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95"></div>
                </div>
                <div className="relative z-10 max-w-[1400px] mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <p className="section-label mb-3 justify-center">Get in Touch</p>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tight drop-shadow-lg">We'd Love to<br />Hear From You</h1>
                    </motion.div>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
                {/* Form */}
                <motion.form onSubmit={handleSubmit} className="flex flex-col gap-5" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">Name</label><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" required className="form-input" /></div>
                        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">Email</label><input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" required className="form-input" /></div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">Subject</label>
                        <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required className="form-input bg-grey-900">
                            <option value="">Select a subject</option>
                            {['Order Issue', 'Returns & Exchanges', 'Product Question', 'Wholesale / Collaboration', 'Press Inquiry', 'Other'].map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-300">Message</label>
                        <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell us what's on your mind..." rows={7} required className="form-input resize-y" />
                    </div>
                    {sent ? (
                        <motion.div className="flex items-center gap-3 text-brand-green bg-brand-green/10 border border-brand-green/20 px-4 py-3 text-sm font-semibold" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <HiCheckCircle size={20} /> Message sent! We'll get back to you within 24 hours.
                        </motion.div>
                    ) : (
                        <button type="submit" className="btn-primary text-sm">Send Message</button>
                    )}
                </motion.form>

                {/* Info */}
                <motion.div className="flex flex-col gap-5" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
                    <div className="bg-grey-900 border border-white/[0.06] p-7 flex flex-col gap-6">
                        <h3 className="text-base font-black tracking-[0.06em]">Contact Info</h3>
                        {[
                            { icon: <HiMail size={18} />, label: 'Email', value: 'support@swerrv.com' },
                            { icon: <HiPhone size={18} />, label: 'Phone', value: '+1 (888) SWERRV-1' },
                            { icon: <HiLocationMarker size={18} />, label: 'Studio', value: 'New York, NY' },
                        ].map(item => (
                            <div key={item.label} className="flex items-start gap-3">
                                <span className="text-accent mt-0.5 shrink-0">{item.icon}</span>
                                <div>
                                    <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-500">{item.label}</p>
                                    <p className="text-sm font-semibold mt-0.5">{item.value}</p>
                                </div>
                            </div>
                        ))}
                        <div>
                            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-500 mb-3">Business Hours</p>
                            {[['Mon – Fri', '9am – 6pm EST'], ['Saturday', '10am – 4pm EST'], ['Sunday', 'Closed']].map(([day, hours]) => (
                                <div key={day} className="flex justify-between text-sm text-grey-300 mb-2"><span>{day}</span><span>{hours}</span></div>
                            ))}
                        </div>
                        <div>
                            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-grey-500 mb-3">Follow Us</p>
                            <div className="flex gap-3">
                                {[FaInstagram, FaTwitter, FaTiktok].map((Icon, i) => (
                                    <a key={i} href="#" className="w-9 h-9 border border-grey-700 rounded-full flex items-center justify-center text-base hover:border-accent hover:text-accent transition-all duration-200">
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-grey-900 border border-white/[0.06] p-7 flex flex-col gap-0">
                        <h3 className="text-base font-black tracking-[0.06em] mb-5">Quick FAQs</h3>
                        {[
                            { q: 'How long does shipping take?', a: 'Standard shipping takes 5–7 business days. Express 2–3 days.' },
                            { q: 'What is your return policy?', a: 'We offer 30-day returns on unworn items in original packaging.' },
                            { q: 'Do you ship internationally?', a: 'Yes! We ship to 40+ countries worldwide.' },
                        ].map((faq, i) => (
                            <div key={i} className="py-4 border-b border-white/[0.06] last:border-none">
                                <p className="text-[13px] font-bold mb-1.5">{faq.q}</p>
                                <p className="text-[13px] text-grey-300 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;

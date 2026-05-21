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
        <div className="min-h-screen pt-[70px] bg-black text-white">
            {/* Hero */}
            <div className="relative bg-grey-950 py-24 px-6 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <img src="/images/_DSC8415.jpg" alt="Contact Us" className="w-full h-full object-cover grayscale opacity-40" style={{ objectPosition: 'center 20%' }} />
                </div>
                <div className="relative z-10 max-w-[1000px] mx-auto text-center text-white">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <p className="text-xs font-semibold tracking-widest uppercase text-grey-300 mb-6">Get in touch</p>
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight uppercase">We'd love to<br />hear from you</h1>
                    </motion.div>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-[1200px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 md:gap-24">
                {/* Form */}
                <motion.form onSubmit={handleSubmit} className="flex flex-col gap-8" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <h2 className="text-3xl font-semibold tracking-tight uppercase">Send a message</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold tracking-widest uppercase text-grey-300">Name</label>
                            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" required className="form-input" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold tracking-widest uppercase text-grey-300">Email</label>
                            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" required className="form-input" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold tracking-widest uppercase text-grey-300">Subject</label>
                        <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required className="form-input bg-black">
                            <option value="">Select a subject</option>
                            {['Order Issue', 'Returns & Exchanges', 'Product Question', 'Wholesale / Collaboration', 'Press Inquiry', 'Other'].map(s => <option key={s} className="bg-black">{s}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold tracking-widest uppercase text-grey-300">Message</label>
                        <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell us what's on your mind..." rows={6} required className="form-input resize-y" />
                    </div>
                    {sent ? (
                        <motion.div className="flex items-center gap-3 text-white bg-white/5 border border-white/10 px-6 py-4 text-sm font-medium" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <HiCheckCircle size={20} className="text-green-500" /> Message sent! We'll get back to you within 24 hours.
                        </motion.div>
                    ) : (
                        <div>
                            <button type="submit" className="btn-primary">Send message</button>
                        </div>
                    )}
                </motion.form>

                {/* Info */}
                <motion.div className="flex flex-col gap-10" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
                    <div className="flex flex-col gap-8 bg-grey-900 border border-white/5 p-8">
                        <h3 className="text-xl font-bold tracking-tight uppercase mb-2">Contact info</h3>
                        {[
                            { icon: <HiMail size={20} />, label: 'Email', value: 'support@swerrv.com' },
                            { icon: <HiPhone size={20} />, label: 'Phone', value: '+1 (888) SWERRV-1' },
                            { icon: <HiLocationMarker size={20} />, label: 'Studio', value: 'New York, NY' },
                        ].map(item => (
                            <div key={item.label} className="flex items-start gap-4">
                                <span className="text-grey-300 mt-1">{item.icon}</span>
                                <div>
                                    <p className="text-xs font-semibold tracking-widest uppercase text-grey-400 mb-1">{item.label}</p>
                                    <p className="text-base font-semibold">{item.value}</p>
                                </div>
                            </div>
                        ))}
                        
                        <div className="pt-6 border-t border-white/5">
                            <p className="text-xs font-semibold tracking-widest uppercase text-grey-400 mb-4">Business Hours</p>
                            {[['Mon – Fri', '9am – 6pm EST'], ['Saturday', '10am – 4pm EST'], ['Sunday', 'Closed']].map(([day, hours]) => (
                                <div key={day} className="flex justify-between text-sm mb-3 text-grey-300">
                                    <span>{day}</span>
                                    <span>{hours}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="pt-6 border-t border-white/5">
                            <p className="text-xs font-semibold tracking-widest uppercase text-grey-400 mb-4">Follow Us</p>
                            <div className="flex gap-4">
                                {[FaInstagram, FaTwitter, FaTiktok].map((Icon, i) => (
                                    <a key={i} href="#" className="text-grey-400 hover:text-white transition-colors duration-200">
                                        <Icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            {/* FAQs */}
            <div className="bg-grey-950 py-24 border-t border-white/5">
                <div className="max-w-[800px] mx-auto px-6">
                    <h3 className="text-3xl font-bold tracking-tight uppercase text-center mb-12">Quick FAQs</h3>
                    <div className="flex flex-col gap-6">
                        {[
                            { q: 'How long does shipping take?', a: 'Standard shipping takes 5–7 business days. Express 2–3 days.' },
                            { q: 'What is your return policy?', a: 'We offer 30-day returns on unworn items in original packaging.' },
                            { q: 'Do you ship internationally?', a: 'Yes! We ship to 40+ countries worldwide.' },
                        ].map((faq, i) => (
                            <div key={i} className="py-6 border-b border-white/5 last:border-0">
                                <p className="text-lg font-semibold mb-2">{faq.q}</p>
                                <p className="text-grey-300 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaTwitter, FaTiktok, FaYoutube } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import { useState } from 'react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) { setSubscribed(true); setEmail(''); }
    };

    const socials = [
        { icon: <FaInstagram />, label: 'Instagram' },
        { icon: <FaTwitter />, label: 'Twitter' },
        { icon: <FaTiktok />, label: 'TikTok' },
        { icon: <FaYoutube />, label: 'YouTube' },
    ];

    return (
        <footer className="bg-grey-900 border-t border-white/[0.06]">
            {/* Newsletter */}
            <div className="max-w-[1400px] mx-auto px-6 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-6xl font-black tracking-[0.06em] mb-3">JOIN THE MOVEMENT</h2>
                    <p className="text-grey-300 text-base mb-8">Be the first to know about drops, exclusives & more.</p>
                    {subscribed ? (
                        <p className="text-accent text-lg font-semibold">✓ You're in. Stay locked in.</p>
                    ) : (
                        <form onSubmit={handleSubscribe} className="inline-flex max-w-md w-full border border-grey-700">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="flex-1 bg-transparent border-none text-white px-5 py-3.5 text-sm placeholder:text-grey-500 outline-none"
                            />
                            <button type="submit" className="bg-accent text-black px-5 py-3.5 flex items-center hover:bg-accent-dark transition-colors duration-200">
                                <HiArrowRight size={20} />
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>

            <div className="border-t border-white/[0.06]" />

            {/* Links */}
            <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                <div>
                    <Link to="/" className="block mb-6">
                        <img src="/images/swerrve_logo_white.png" alt="Swerrv" className="h-32 object-contain opacity-90" />
                    </Link>
                    <p className="text-grey-300 text-sm leading-relaxed mb-6">Not for everyone.<br />Made for the culture.</p>
                    <div className="flex gap-3">
                        {socials.map(s => (
                            <a key={s.label} href="#" aria-label={s.label}
                                className="w-9 h-9 border border-grey-700 rounded-full flex items-center justify-center text-base hover:border-accent hover:text-accent transition-all duration-200">
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {[
                    { title: 'Shop', links: [['T-Shirts', '/shop?category=T-Shirts'], ['Hoodies', '/shop?category=Hoodies'], ['Bottoms', '/shop?category=Bottoms'], ['Jackets', '/shop?category=Jackets'], ['Accessories', '/shop?category=Accessories'], ['New Arrivals', '/shop']] },
                    { title: 'Info', links: [['About Us', '/about'], ['Contact', '/contact'], ['Sizing Guide', '#'], ['Shipping & Returns', '#'], ['FAQ', '#']] },
                    { title: 'Legal', links: [['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Cookie Policy', '/cookie-policy']] },
                ].map(col => (
                    <div key={col.title}>
                        <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-300 mb-5">{col.title}</h4>
                        <nav className="flex flex-col gap-3">
                            {col.links.map(([label, to]) => (
                                <Link key={label} to={to} className="text-sm text-grey-500 hover:text-white transition-colors duration-200">{label}</Link>
                            ))}
                        </nav>
                    </div>
                ))}
            </div>

            <div className="border-t border-white/[0.06]" />
            <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-wrap justify-between items-center gap-3 text-xs text-grey-500">
                <p>© 2026 Swerrv. All rights reserved.</p>
                <p>Made for the culture.</p>
            </div>
        </footer>
    );
};

export default Footer;

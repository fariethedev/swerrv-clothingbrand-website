import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
    const team = [
        { name: 'Farai Mahaso', role: 'Co-Founder & Creative Director', img: '/images/_DSC8211.jpg' },
        { name: 'Mike Thabani', role: 'Co-Founder & Brand Strategist', img: '/images/_DSC8220.jpg' },
    ];

    const values = [
        { title: 'Authenticity', desc: 'We build every piece around real culture, not trends. Swerrv is genuine from concept to closet.' },
        { title: 'Quality First', desc: 'Premium fabrics, precise construction. Every piece is built to outlast the moment.' },
        { title: 'Community', desc: "We're not just a brand — we're a movement built by and for the culture." },
        { title: 'Individuality', desc: 'Swerrv celebrates every expression of self. Wear it your way.' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative h-[80vh] min-h-[500px] flex items-end justify-center overflow-hidden">
                <motion.div className="absolute inset-0 z-0" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.2 }}>
                    <img src="/images/_DSC8144.jpg" alt="About Swerrv" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/30" />
                </motion.div>
                <motion.div className="relative z-10 text-center pb-16 px-6" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                    <p className="section-label mb-4">Our Story</p>
                    <h1 className="text-5xl lg:text-8xl font-black tracking-[0.04em] leading-[1.05]">Built Different.<br />Made for the Culture.</h1>
                </motion.div>
            </section>

            {/* Story */}
            <section className="py-24 bg-black">
                <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                        <p className="section-label mb-5">Who We Are</p>
                        <h2 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight">SWERRV was born from a refusal to conform.</h2>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
                        <p className="text-grey-300 text-base leading-relaxed mb-5">Founded in Lublin, Poland in 2025 by Farai Mahaso and Mike Thabani, SWERRV began as a shared conviction — that streetwear should speak for the culture that created it. Not a trend. Not a statement for everyone. A brand forged for those who move with intention.</p>
                        <p className="text-grey-300 text-base leading-relaxed mb-5">What started as late-night conversations between two creatives in Lublin became something real in September 2025 with the brand's debut drop — a tight, deliberate collection that sold out within days. The message was clear: SWERRV had arrived.</p>
                        <p className="text-grey-300 text-base leading-relaxed mb-8">Every piece since has been a chapter in an ongoing story. Past experiences, present energy, and unlimited possibility — that's the SWERRV timeline.</p>
                        <Link to="/shop" className="btn-primary">Shop the Collection</Link>
                    </motion.div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-grey-900">
                <div className="max-w-[1400px] mx-auto px-6">
                    <motion.p className="section-label text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>What We Stand For</motion.p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((v, i) => (
                            <motion.div key={v.title} className="flex flex-col gap-3.5" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                                <span className="text-5xl font-black text-white/5 font-grotesk leading-none">0{i + 1}</span>
                                <h3 className="text-xl font-black">{v.title}</h3>
                                <p className="text-sm text-grey-300 leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 bg-black">
                <div className="max-w-[1400px] mx-auto px-6">
                    <motion.p className="section-label text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>The Team</motion.p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-3xl mx-auto">
                        {team.map((m, i) => (
                            <motion.div key={m.name} className="flex flex-col items-center text-center gap-4" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}>
                                <div className="w-56 h-64 overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-500">
                                    <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-lg font-black">{m.name}</h3>
                                <p className="text-xs text-grey-500 tracking-[0.2em] uppercase font-bold">{m.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-grey-900 text-center">
                <motion.div className="max-w-[1400px] mx-auto px-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <h2 className="text-5xl lg:text-7xl font-black tracking-[0.05em] mb-4">Ready to Swerrv?</h2>
                    <p className="text-grey-300 text-lg mb-10">Join the movement. Shop the latest drop.</p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link to="/shop" className="btn-primary">Shop Now</Link>
                        <Link to="/contact" className="btn-secondary">Get in Touch</Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default About;

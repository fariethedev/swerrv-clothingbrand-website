import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
    const values = [
        { title: 'Authenticity', desc: 'We build every piece around real culture, not trends. Swerrv is genuine from concept to closet.' },
        { title: 'Quality first', desc: 'Premium fabrics, precise construction. Every piece is built to outlast the moment.' },
        { title: 'Community', desc: "We're not just a brand — we're a movement built by and for the culture." },
        { title: 'Individuality', desc: 'Swerrv celebrates every expression of self. Wear it your way.' },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero */}
            <section className="relative h-[80vh] min-h-[500px] flex items-end justify-center overflow-hidden border-b border-white/5">
                <motion.div className="absolute inset-0 z-0" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.2 }}>
                    <img src="/images/_DSC8289.jpg" alt="About Swerrv" className="w-full h-full object-cover opacity-70" fetchPriority="high" decoding="async" />
                </motion.div>
                <motion.div className="relative z-10 text-center pb-24 px-6 text-white" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                    <p className="text-xs font-semibold tracking-widest uppercase text-grey-300 mb-6">Our story</p>
                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight uppercase leading-[1.05]">Built different.<br />Made for the culture.</h1>
                </motion.div>
            </section>

            {/* Story */}
            <section className="py-32 bg-black">
                <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                        <p className="text-xs font-semibold tracking-widest uppercase text-grey-400 mb-4">Who we are</p>
                        <h2 className="text-4xl lg:text-5xl font-semibold leading-tight tracking-tight uppercase">Swerrv was born from a refusal to conform.</h2>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
                        <p className="text-base text-grey-300 leading-relaxed mb-6">Founded in Lublin, Poland in 2025 by Farai Mahaso, Mike Thabani, and Takudwa Gombiro, Swerrv began as a shared conviction — that streetwear should speak for the culture that created it. Not a trend. Not a statement for everyone. A brand forged for those who move with intention.</p>
                        <p className="text-base text-grey-300 leading-relaxed mb-6">What started as late-night conversations between the founders in Lublin became something real in September 2025 with the brand's debut drop — a tight, deliberate collection that sold out within days. The message was clear: Swerrv had arrived.</p>
                        <p className="text-base text-grey-300 leading-relaxed mb-10">Every piece since has been a chapter in an ongoing story. Past experiences, present energy, and unlimited possibility — that's the Swerrv timeline.</p>
                        <Link to="/shop" className="btn-primary">Shop the collection</Link>
                    </motion.div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-grey-950 border-y border-white/5 text-white">
                <div className="max-w-[1200px] mx-auto px-6">
                    <motion.p className="text-center text-xs font-semibold tracking-widest uppercase mb-16 text-grey-400" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>What we stand for</motion.p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {values.map((v, i) => (
                            <motion.div key={v.title} className="flex flex-col gap-4" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                                <span className="text-4xl font-bold opacity-20">0{i + 1}</span>
                                <h3 className="text-xl font-bold uppercase">{v.title}</h3>
                                <p className="text-sm text-grey-300 leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* CTA */}
            <section className="py-32 bg-grey-950 text-white text-center border-t border-white/5">
                <motion.div className="max-w-[800px] mx-auto px-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <h2 className="text-4xl lg:text-6xl font-bold tracking-tight uppercase mb-6">Ready to Swerrv?</h2>
                    <p className="text-lg text-grey-300 mb-12">Join the movement. Shop the latest drop.</p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link to="/shop" className="btn-primary">Shop now</Link>
                        <Link to="/contact" className="btn-secondary">Get in touch</Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default About;

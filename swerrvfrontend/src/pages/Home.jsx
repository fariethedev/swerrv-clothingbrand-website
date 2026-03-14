/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                let arrivals = await api.searchProducts({ size: 8 });

                if (!arrivals || arrivals.length === 0) {
                    arrivals = [
                        { id: '1', name: 'CORE LOGO T-SHIRT', price: '150', category: 'T-Shirts', image: '/images/_DSC8141.jpg' },
                        { id: '2', name: 'UTILITY CARGO', price: '450', category: 'Trousers', image: '/images/_DSC8164.jpg' },
                        { id: '3', name: 'HEAVYWEIGHT HOODIE', price: '320', category: 'Hoodies', image: '/images/swerrv_hoodie_model_1772058693065.png' },
                        { id: '4', name: 'ZIP JACKET', price: '500', category: 'Outerwear', image: '/images/_DSC8289.jpg' }
                    ];
                }

                setProducts(arrivals);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    return (
        <div className="bg-black text-white min-h-screen font-poppins selection:bg-white selection:text-black">

            {/* ══ HERO SECTION (Brutalist) ══ */}
            <section ref={heroRef} className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center">

                {/* Background Image Container */}
                <motion.div
                    className="absolute inset-0 z-0 flex justify-center"
                    style={{ y: heroY }}
                >
                    <img
                        src="/images/_DSC8415.jpg"
                        alt="Swerrv Model"
                        className="w-[80%] max-w-[800px] h-full object-cover object-top opacity-90"
                        style={{ filter: 'grayscale(100%) contrast(1.2)' }}
                    />
                </motion.div>

                {/* Crosshairs & Grid Lines */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20"></div>
                    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/20"></div>
                    {/* Corners */}
                    <div className="absolute top-10 left-10 w-4 h-[1px] bg-white"></div>
                    <div className="absolute top-10 left-10 w-[1px] h-4 bg-white"></div>
                    <div className="absolute top-10 right-10 w-4 h-[1px] bg-white right-0 translate-x-[-100%]"></div>
                    <div className="absolute top-10 right-10 w-[1px] h-4 bg-white"></div>
                </div>

                {/* Massive Brand Text */}
                <div className="absolute z-20 w-full text-center pointer-events-none mix-blend-difference">
                    <h1 className="text-[12vw] font-black tracking-tighter leading-none text-white lowercase">
                        s w e r r v
                    </h1>
                </div>

                {/* Micro / Utility Text (Brutalist elements) */}
                <div className="absolute inset-0 z-30 pointer-events-none p-6 md:p-12 text-[9px] md:text-[10px] font-mono leading-tight tracking-widest text-white/70 uppercase">

                    {/* Top Left Text Block */}
                    <div className="absolute top-12 left-6 md:top-20 md:left-20 max-w-[200px] text-right">
                        ORIGINATED FROM POLAND. FOUNDED AROUND 2024.<br />
                        THE BRAND STARTED WITH CUSTOMIZING T-SHIRTS FOR FRIENDS<br />
                        AND IT GRADUALLY EVOLVED INTO A FULL-SCALE CLOTHING LINE.
                    </div>

                    {/* Center Text Wrapping (Simulated) */}
                    <div className="absolute top-1/3 left-1/4 max-w-[150px] text-right hidden md:block">
                        KNOWN FOR ITS UNIQUE STYLE<br />
                        SWERRV HAS BEEN SYNONYMOUS WITH A REBELLIOUS SPIRIT.
                    </div>

                    <div className="absolute top-[40%] right-1/4 max-w-[180px] text-left hidden md:block">
                        A MEANINGFUL CONVERSATION BETWEEN THE MASCULINE AND FEMININE.<br />
                        GREATEST ART AND GARMENT THAT FEELS LIKE DESIGNED IN THE 2020s.
                    </div>

                    {/* Header Nav Replacements (Contextual) */}
                    <div className="absolute top-6 left-6">
                        Website:<br />E-commerce
                    </div>

                    <div className="absolute top-6 right-6 text-right">
                        Year:<br />2026
                    </div>

                    <div className="absolute bottom-6 right-6 text-right">
                        View Complete<br />Collection →
                    </div>

                    <div className="absolute bottom-6 left-6">
                        Author:<br />Swerrv Studios
                    </div>
                </div>
            </section>

            {/* ══ QUOTE SECTION ══ */}
            <section className="py-24 md:py-40 px-6 bg-black text-center border-t border-white/10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-sm md:text-lg lg:text-xl font-medium tracking-[0.2em] uppercase leading-relaxed text-white">
                        THIS IS NOT JUST A STORE - IT'S A SPACE FOR THOSE AUDACIOUS ENOUGH TO
                        REINTERPRET THE WORLD AROUND THEM THE EXTRAORDINARY WAY,<br />
                        THE SWERRV WAY.
                    </h2>
                </motion.div>
            </section>

            {/* ══ LOOKBOOK / PRODUCTS GRID (Horizontal minimalist row) ══ */}
            <section className="pb-32 px-6 bg-black overflow-hidden">
                <div className="max-w-[1600px] mx-auto">
                    <div className="flex gap-4 md:gap-8 overflow-x-auto pb-10 scrollbar-hide snap-x">

                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="min-w-[280px] md:min-w-[320px] aspect-[2/3] bg-white/5 animate-pulse shrink-0"></div>
                            ))
                        ) : (
                            products.map((product, i) => (
                                <Link
                                    to={`/product/${product.id}`}
                                    key={product.id}
                                    className="group block min-w-[260px] md:min-w-[340px] shrink-0 snap-center"
                                >
                                    <div className="aspect-[3/4] overflow-hidden bg-white/5 mb-4 relative">
                                        <img
                                            src={product.image || product.images?.[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                                        />
                                    </div>
                                    <div className="flex justify-between items-baseline px-2">
                                        <p className="text-[10px] text-white/50 tracking-widest uppercase">look. /{i + 1}</p>
                                        <div className="text-right">
                                            <p className="text-[11px] font-bold tracking-widest uppercase truncate max-w-[150px]">{product.name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}

                    </div>

                    <div className="text-center mt-12">
                        <Link to="/shop" className="inline-block border border-white px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors duration-300">
                            View Full Archive
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;

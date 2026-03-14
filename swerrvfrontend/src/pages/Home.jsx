/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

const HERO_SLIDES = [
    { img: '/images/_DSC8289.jpg', caption: 'Wear the Movement.' },
    { img: '/images/_DSC8164.jpg', caption: 'Style Without Limits.' },
    { img: '/images/_DSC8141.jpg', caption: 'Crafted for the Streets.' },
    { img: '/images/_DSC8438.jpg', caption: 'Bold. Clean. Swerrv.' },
    { img: '/images/_DSC8415.jpg', caption: 'Dress Your Story.' },
];

const LOOKBOOK_SLIDES = [
    { img: '/images/_DSC8113.jpg', label: 'Campaign 01', title: 'Feelings Mutual' },
    { img: '/images/_DSC8122.jpg', label: 'Campaign 02', title: "Streets Don't Lie" },
    { img: '/images/_DSC8136.jpg', label: 'Campaign 03', title: 'The Uniform' },
    { img: '/images/_DSC8144.jpg', label: 'Campaign 04', title: 'Culture First' },
    { img: '/images/_DSC8157.jpg', label: 'Campaign 05', title: 'Made Different' },
    { img: '/images/_DSC8164.jpg', label: 'Campaign 06', title: 'No Compromise' },
    { img: '/images/_DSC8177.jpg', label: 'Campaign 07', title: 'Own Your Lane' },
];

const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timeUnits = [
        { label: 'DAYS', value: timeLeft.days },
        { label: 'HOURS', value: timeLeft.hours },
        { label: 'MINS', value: timeLeft.minutes },
        { label: 'SECS', value: timeLeft.seconds }
    ];

    return (
        <div className="flex gap-3 sm:gap-5">
            {timeUnits.map((unit) => (
                <div key={unit.label} className="flex flex-col items-center">
                    <div className="bg-black text-white w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center font-black text-xl sm:text-3xl tracking-wider rounded-none">
                        {String(unit.value).padStart(2, '0')}
                    </div>
                    <span className="text-[9px] sm:text-[11px] font-bold tracking-[0.2em] text-black mt-3">{unit.label}</span>
                </div>
            ))}
        </div>
    );
};

const LookbookCarousel = () => {
    const [current, setCurrent] = useState(0);
    const total = LOOKBOOK_SLIDES.length;

    const prev = () => setCurrent(c => (c - 1 + total) % total);
    const next = () => setCurrent(c => (c + 1) % total);

    useEffect(() => {
        const t = setInterval(next, 6000);
        return () => clearInterval(t);
    }, []);

    return (
        <section className="always-dark relative w-full overflow-hidden h-[80vh] md:h-screen">
            {LOOKBOOK_SLIDES.map((slide, i) => (
                <motion.div
                    key={slide.img}
                    className="absolute inset-0"
                    animate={{ opacity: i === current ? 1 : 0 }}
                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                >
                    <img
                        src={slide.img}
                        alt={slide.title}
                        className="w-full h-full object-cover object-[center_40%]"
                    />
                </motion.div>
            ))}

            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />

            <div className="absolute top-10 left-10 z-10">
                <p className="text-xs font-semibold tracking-[0.35em] uppercase text-white/60">Lookbook</p>
            </div>

            <div className="absolute top-10 right-10 z-10">
                <Link to="/shop" className="text-xs font-bold tracking-widest uppercase text-white/60 hover:text-white border border-white/20 hover:border-white/60 px-4 py-2 transition-all duration-200">
                    Shop Collection →
                </Link>
            </div>

            <div className="absolute bottom-24 md:bottom-16 left-6 md:left-10 z-10 max-w-[85vw] md:max-w-xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-white text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase mb-2 md:mb-3">
                            {LOOKBOOK_SLIDES[current].label}
                        </p>
                        <h2 className="text-white text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
                            {LOOKBOOK_SLIDES[current].title}
                        </h2>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="absolute bottom-24 md:bottom-16 right-6 md:right-10 z-10 flex items-center gap-4 md:gap-6">
                <span className="text-white/50 text-xs md:text-sm font-mono tabular-nums hidden sm:inline">
                    {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={prev}
                        className="w-9 h-9 md:w-11 md:h-11 border border-white/30 hover:border-white/80 bg-black/30 hover:bg-black/60 flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 md:w-5 md:h-5">
                            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        className="w-9 h-9 md:w-11 md:h-11 border border-white/30 hover:border-white/80 bg-black/30 hover:bg-black/60 flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 md:w-5 md:h-5">
                            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

const Home = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const [newArrivals, setNewArrivals] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [heroSlide, setHeroSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [feats, arrivals, promos] = await Promise.all([
                    api.getFeaturedProducts(),
                    api.searchProducts({ size: 8 }),
                    api.getActivePromoContent()
                ]);

                // Robust Fallbacks
                if (!feats || feats.length === 0) {
                    setFeatured([{
                        id: 'f1',
                        name: 'CORE LOGO HOODIE',
                        description: 'Premium heavyweight cotton hoodie with signature Swerrv embroidery. Designed for a boxy, oversized fit.',
                        price: '350',
                        image: '/images/swerrv_hoodie_model_1772058693065.png',
                        images: ['/images/swerrv_hoodie_model_1772058693065.png', '/images/_DSC8113.jpg']
                    }]);
                } else {
                    setFeatured(feats);
                }

                if (!arrivals || arrivals.length === 0) {
                    setNewArrivals([
                        { id: '1', name: 'CORE LOGO T-SHIRT', price: '150', category: 'T-Shirts', image: '/images/_DSC8141.jpg' },
                        { id: '2', name: 'VELOUR TRACKSUIT', price: '550', category: 'Tracksuits', image: '/images/swerrv_cargo_1772060995951.png' },
                        { id: '3', name: 'HEAVYWEIGHT HOODIE', price: '320', category: 'Hoodies', image: '/images/swerrv_hoodie_model_1772058693065.png' },
                        { id: '4', name: 'UTILITY CARGO', price: '450', category: 'Trousers', image: '/images/_DSC8164.jpg' }
                    ]);
                } else {
                    setNewArrivals(arrivals);
                }

                if (promos) {
                    const video = promos.find(p => p.type === 'VIDEO');
                    if (video) setActiveVideo(video);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">

            {/* ══ HERO SECTION (Refined Minimalist Imagery) ══ */}
            <section ref={heroRef} className="always-dark relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden border-b border-white/10">

                {/* Background Slider - Full Screen */}
                {HERO_SLIDES.map((slide, i) => (
                    <motion.div
                        key={slide.img}
                        className="absolute inset-0 z-0"
                        style={{ y: heroY }}
                        animate={{ opacity: i === heroSlide ? 1 : 0 }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                    >
                        <img
                            src={slide.img}
                            alt={slide.caption}
                            className="w-full h-full object-cover object-[center_20%]"
                        />
                        <div className="absolute inset-0 bg-black/30 z-10" />
                    </motion.div>
                ))}

                {/* Crosshairs & Grid Lines */}
                <div className="absolute inset-0 z-10 pointer-events-none opacity-40">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10"></div>
                    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10"></div>
                    <div className="absolute top-24 left-10 w-4 h-[1px] bg-white/60"></div>
                    <div className="absolute top-24 left-10 w-[1px] h-4 bg-white/60"></div>
                    <div className="absolute top-24 right-10 w-4 h-[1px] bg-white/60"></div>
                    <div className="absolute top-24 right-10 w-[1px] h-4 bg-white/60"></div>
                </div>

                {/* Minimalist Utility Text */}
                <div className="absolute inset-0 z-30 pointer-events-none p-6 md:p-12 text-[8px] font-mono leading-tight tracking-[0.3em] text-white/50 uppercase">
                    <div className="absolute top-28 left-6 md:left-20 max-w-[150px]">
                        POLAND BASED OFFICE<br />ESTABLISHED 2024
                    </div>
                    <div className="absolute top-28 right-6 md:right-20 text-right max-w-[150px]">
                        COLLECTION 2026<br />AVAILABLE NOW
                    </div>
                    <div className="absolute bottom-12 left-6 md:left-20">
                        DESIGNED BY<br />SWERRV STUDIOS
                    </div>
                    <div className="absolute bottom-12 right-6 md:right-20 text-right">
                        GLOBAL SHIPPING<br />ACTIVE
                    </div>
                </div>

                {/* Hero Caption & Buttons - Centered and Small */}
                <motion.div className="relative z-40 text-center px-6 mt-auto mb-24" style={{ opacity: heroOpacity }}>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={heroSlide}
                            className="text-white/90 text-[10px] md:text-xs font-medium tracking-[0.3em] mb-6 uppercase"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                        >
                            {HERO_SLIDES[heroSlide].caption}
                        </motion.p>
                    </AnimatePresence>
                    <div className="flex gap-3 justify-center">
                        <Link to="/shop" className="px-5 py-2 text-[9px] font-bold tracking-[0.2em] uppercase border border-white bg-white text-black hover:bg-black hover:text-white transition-all duration-300">Shop Now</Link>
                        <Link to="/about" className="px-5 py-2 text-[9px] font-bold tracking-[0.2em] uppercase border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300">Our Story</Link>
                    </div>
                </motion.div>
            </section>

            {/* ══ BRAND STATEMENT ══ */}
            <section className="py-32 bg-black text-center border-b border-white/10">
                <motion.div className="max-w-[1400px] mx-auto px-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <p className="text-[clamp(11px,1.2vw,14px)] tracking-[0.4em] uppercase text-grey-300 leading-loose mb-6">
                        A CELEBRATION OF INDIVIDUALISM. SWERRV IS<br />
                        NOT FOR EVERYONE. SWERRV IS FOR EVERY ONE.
                    </p>
                    <div className="flex gap-4 justify-center items-center text-[10px] font-bold tracking-[0.3em] uppercase text-grey-500">
                        <span>PAST</span>
                        <span className="text-grey-700">·</span>
                        <span>PRESENT</span>
                        <span className="text-grey-700">·</span>
                        <span className="text-white">FUTURE</span>
                    </div>
                </motion.div>
            </section>

            {/* ══ FEATURED DROP ══ */}
            {featured[0] && (
                <section className="py-24 bg-black border-b border-white/10">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <p className="section-label mb-12">Featured Drop</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                            <motion.div className="grid grid-cols-2 gap-2" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                {featured[0].images?.length >= 4 ? (
                                    featured[0].images.slice(0, 4).map((img, i) => (
                                        <div key={i} className={`relative aspect-square overflow-hidden ${i === 0 ? 'col-span-2 aspect-[3/2]' : ''}`}>
                                            <img src={img} alt="feature" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 aspect-[4/5] overflow-hidden">
                                        <img src={featured[0].image} alt="feature" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                                    </div>
                                )}
                            </motion.div>
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 uppercase">{featured[0].name}</h2>
                                <p className="text-grey-500 text-base leading-relaxed mb-8 max-w-lg">{featured[0].description}</p>
                                <p className="text-2xl font-black mb-10">{featured[0].price} PLN</p>
                                <Link to={`/product/${featured[0].id}`} className="btn-primary">View Product</Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ══ NEW ARRIVALS ══ */}
            <section className="py-24 bg-black">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <p className="section-label">New Arrivals</p>
                        <Link to="/shop" className="text-xs font-bold tracking-widest text-grey-300 hover:text-white transition-colors uppercase">View All →</Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse"></div>
                            ))
                        ) : (
                            newArrivals.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)
                        )}
                    </div>
                </div>
            </section>

            {/* ══ PROMO BANNER ══ */}
            <section className="bg-white text-black py-20">
                <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-center md:text-left">
                        <p className="font-bold tracking-[0.3em] uppercase text-xs mb-3 text-black/60">Next Drop Countdown</p>
                        <h2 className="text-4xl lg:text-7xl font-black tracking-tighter">FEELINGS MUTUAL 2</h2>
                    </div>
                    <div className="bg-black p-8">
                        <CountdownTimer targetDate="2026-08-26T00:00:00" />
                    </div>
                </div>
            </section>

            {/* ══ LOOKBOOK GALLERY ══ */}
            <LookbookCarousel />

            {/* ══ THE ARCHIVE ══ */}
            <section className="py-24 bg-black">
                <div className="max-w-[1400px] mx-auto px-6">
                    <p className="section-label mb-12">The Archive</p>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 relative aspect-video overflow-hidden">
                            {activeVideo ? (
                                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                                    <source src={activeVideo.mediaUrl} />
                                </video>
                            ) : (
                                <div className="w-full h-full bg-grey-900 flex items-center justify-center">
                                    <p className="text-grey-500 font-mono text-[10px]">VISUAL_ARCHIVE.MOV</p>
                                </div>
                            )}
                            <div className="absolute bottom-8 left-8">
                                <h3 className="text-2xl font-black mb-2 uppercase">Campaign Visuals</h3>
                                <Link to="/about" className="text-[10px] font-bold tracking-widest underline underline-offset-4">EXPLORE</Link>
                            </div>
                        </div>
                        <div className="lg:col-span-4 bg-grey-900/50 p-10 flex flex-col justify-center border border-white/5">
                            <p className="text-xs font-bold tracking-widest mb-4 text-grey-500 uppercase">Upcoming</p>
                            <h3 className="text-3xl font-black mb-6 leading-tight uppercase">SWERRV PICNIC<br />& BRAAI</h3>
                            <p className="text-grey-500 text-sm mb-10 leading-relaxed">
                                Join us for an outdoor session in Lublin. Exclusive previews and good energy.
                            </p>
                            <div className="text-[10px] font-bold tracking-widest uppercase">
                                <p className="mb-2"><span className="text-grey-600">DATE:</span> 31 JUL '26</p>
                                <p><span className="text-grey-600">LOC:</span> ZALEW ZEMBORZYCKI</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ CATEGORIES ══ */}
            <section className="py-24 bg-black border-t border-white/5">
                <div className="max-w-[1400px] mx-auto px-6">
                    <p className="section-label mb-12">Categories</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'T-Shirts', img: '/images/_DSC8141.jpg' },
                            { label: 'Hoodies', img: '/images/swerrv_hoodie_model_1772058693065.png' },
                            { label: 'Tracksuits', img: '/images/swerrv_cargo_1772060995951.png' },
                            { label: 'Accessories', img: '/images/swerrv_bag_model_1772058939685.png' },
                        ].map((cat) => (
                            <Link key={cat.label} to={`/shop?category=${cat.label}`} className="group relative aspect-[2/3] overflow-hidden">
                                <img src={cat.img} alt={cat.label} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                <div className="absolute inset-x-0 bottom-0 p-8">
                                    <h3 className="text-lg font-black tracking-widest uppercase">{cat.label}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

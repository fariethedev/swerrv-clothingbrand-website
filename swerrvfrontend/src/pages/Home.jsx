import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../services/api';


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
            {timeUnits.map((unit, i) => (
                <div key={unit.label} className="flex flex-col items-center">
                    <div className="bg-black text-white w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center font-black text-xl sm:text-3xl tracking-wider rounded-sm shadow-xl">
                        {String(unit.value).padStart(2, '0')}
                    </div>
                    <span className="text-[9px] sm:text-[11px] font-bold tracking-[0.2em] text-black mt-3">{unit.label}</span>
                </div>
            ))}
        </div>
    );
};

const LOOKBOOK_SLIDES = [
    { img: '/images/_DSC8113.jpg', label: 'Campaign 01', title: 'Feelings Mutual' },
    { img: '/images/_DSC8122.jpg', label: 'Campaign 02', title: "Streets Don't Lie" },
    { img: '/images/_DSC8136.jpg', label: 'Campaign 03', title: 'The Uniform' },
    { img: '/images/_DSC8144.jpg', label: 'Campaign 04', title: 'Culture First' },
    { img: '/images/_DSC8157.jpg', label: 'Campaign 05', title: 'Made Different' },
    { img: '/images/_DSC8164.jpg', label: 'Campaign 06', title: 'No Compromise' },
    { img: '/images/_DSC8177.jpg', label: 'Campaign 07', title: 'Own Your Lane' },
];

const LookbookCarousel = () => {
    const [current, setCurrent] = useState(0);
    const total = LOOKBOOK_SLIDES.length;

    const prev = () => setCurrent(c => (c - 1 + total) % total);
    const next = () => setCurrent(c => (c + 1) % total);

    // Auto-advance every 6s
    useEffect(() => {
        const t = setInterval(next, 6000);
        return () => clearInterval(t);
    }, []);

    return (
        <section className="always-dark relative w-full overflow-hidden" style={{ height: '100vh' }}>
            {/* Slides */}
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
                        className="w-full h-full object-cover object-[center_20%] md:object-[center_40%] lg:object-[center_50%]"
                    />
                </motion.div>
            ))}

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />

            {/* Section label top-left */}
            <div className="absolute top-10 left-10 z-10">
                <p className="text-xs font-semibold tracking-[0.35em] uppercase text-white/60">Lookbook</p>
            </div>

            {/* Shop link top-right */}
            <div className="absolute top-10 right-10 z-10">
                <Link to="/shop" className="text-xs font-bold tracking-widest uppercase text-white/60 hover:text-white border border-white/20 hover:border-white/60 px-4 py-2 transition-all duration-200">
                    Shop Collection →
                </Link>
            </div>

            {/* Slide caption — bottom left */}
            <div className="absolute bottom-24 md:bottom-16 left-6 md:left-10 z-10 max-w-[85vw] md:max-w-xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-accent text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase mb-2 md:mb-3">
                            {LOOKBOOK_SLIDES[current].label}
                        </p>
                        <h2 className="text-white text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight drop-shadow-xl">
                            {LOOKBOOK_SLIDES[current].title}
                        </h2>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls — bottom right */}
            <div className="absolute bottom-24 md:bottom-16 right-6 md:right-10 z-10 flex items-center gap-4 md:gap-6">
                {/* Photo counter */}
                <span className="text-white/50 text-xs md:text-sm font-mono tabular-nums hidden sm:inline">
                    {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>

                {/* Prev / Next arrows */}
                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={prev}
                        aria-label="Previous"
                        className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-white/30 hover:border-white/80 bg-black/30 hover:bg-black/60 flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 md:w-5 md:h-5">
                            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next"
                        className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-white/30 hover:border-white/80 bg-black/30 hover:bg-black/60 flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 md:w-5 md:h-5">
                            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Dot indicators — bottom centre */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                {LOOKBOOK_SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        aria-label={`Slide ${i + 1}`}
                        style={{
                            width: i === current ? '38px' : '22px',
                            height: '3px',
                            borderRadius: '2px',
                            background: i === current ? '#fff' : 'rgba(255,255,255,0.3)',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            transition: 'all 0.35s',
                        }}
                    />
                ))}
            </div>
        </section>
    );
};

const Home = () => {
    const { user } = useAuth();
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const [newArrivals, setNewArrivals] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);
    const [activeEvent, setActiveEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [heroSlide, setHeroSlide] = useState(0);

    // Auto-advance hero slides every 5s
    useEffect(() => {
        const interval = setInterval(() => {
            setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [feats, arrivals, promos] = await Promise.all([
                    api.getFeaturedProducts(),
                    api.searchProducts({ size: 4 }),
                    api.getActivePromoContent()
                ]);
                setFeatured(feats || []);
                setNewArrivals(arrivals || []);

                if (promos) {
                    const video = promos.find(p => p.type === 'VIDEO');
                    const event = promos.find(p => p.type === 'EVENT');
                    if (video) setActiveVideo(video);
                    if (event) setActiveEvent(event);
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
        <div className="min-h-screen">
            {/* HERO */}
            <section ref={heroRef} className="always-dark relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">

                {/* Slide images — absolute stacked, fade in/out */}
                {HERO_SLIDES.map((slide, i) => (
                    <motion.div
                        key={slide.img}
                        className="absolute inset-[-10%] z-0"
                        style={{ y: heroY }}
                        animate={{ opacity: i === heroSlide ? 1 : 0 }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                    >
                        <img
                            src={slide.img}
                            alt={slide.caption}
                            className="w-full h-full object-cover"
                            style={{ objectPosition: 'center 40%' }}
                        />
                    </motion.div>
                ))}

                {/* Gradient overlay */}
                <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/30 via-black/70 to-black/95 pointer-events-none" />

                {/* Central text content */}
                <motion.div className="relative z-10 text-center px-6" style={{ opacity: heroOpacity }}>
                    <motion.p className="text-accent text-xs font-semibold tracking-[0.4em] uppercase mb-5" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        New Collection — 2026
                    </motion.p>
                    <motion.h1 className="font-poppins font-black text-[clamp(40px,9vw,120px)] tracking-tight leading-[1] text-white mb-5 uppercase" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}>
                        FEELINGS MUTUAL
                    </motion.h1>

                    {/* Animated slide caption */}
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={heroSlide}
                            className="text-white/70 text-lg font-light tracking-[0.15em] mb-10"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.5 }}
                        >
                            {HERO_SLIDES[heroSlide].caption}
                        </motion.p>
                    </AnimatePresence>

                    <motion.div className="flex gap-4 justify-center flex-wrap mb-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}>
                        <Link to="/shop" className="btn-primary">Shop Now</Link>
                        <Link to="/about" className="btn-secondary">Our Story</Link>
                    </motion.div>
                </motion.div>

                {/* Dot indicators — bottom centre */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-5"
                    style={{ opacity: heroOpacity }}
                >
                    <div className="flex items-center gap-2">
                        {HERO_SLIDES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setHeroSlide(i)}
                                aria-label={`Slide ${i + 1}`}
                                style={{
                                    width: i === heroSlide ? '38px' : '26px',
                                    height: '3px',
                                    borderRadius: '2px',
                                    background: i === heroSlide ? '#fff' : 'rgba(255,255,255,0.35)',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                }}
                            />
                        ))}
                    </div>
                    {/* Scroll line */}
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
                        <div className="w-px h-10 bg-gradient-to-b from-transparent to-accent mx-auto" />
                    </motion.div>
                </motion.div>
            </section>

            {/* BRAND STATEMENT */}
            <section className="py-32 bg-black text-center">
                <motion.div className="max-w-[1400px] mx-auto px-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1 }}>
                    <p className="text-[clamp(11px,1.2vw,13px)] tracking-[0.3em] uppercase text-grey-300 leading-[2.2] mb-6">
                        A CELEBRATION OF INDIVIDUALISM. SWERRV IS<br />
                        NOT FOR EVERYONE. SWERRV IS FOR EVERY ONE.
                    </p>
                    <div className="flex gap-4 justify-center items-center text-xs font-bold tracking-[0.2em] uppercase text-grey-500">
                        <span>PAST</span>
                        <span className="text-grey-700">·</span>
                        <span>PRESENT</span>
                        <span className="text-grey-700">·</span>
                        <span className="text-accent">FUTURE</span>
                    </div>
                </motion.div>
            </section>

            {/* FEATURED DROP */}
            {featured[0] && (
                <section className="py-20 bg-grey-900">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <motion.p className="section-label mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            Featured Drop
                        </motion.p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                            <motion.div className="grid grid-cols-2 gap-2" initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                                {featured[0].images && featured[0].images.length >= 4 ? (
                                    featured[0].images.slice(0, 4).map((img, i) => (
                                        <div key={i} className={`relative aspect-square overflow-hidden ${i === 0 ? 'col-span-2 aspect-[3/2]' : ''}`}>
                                            <img src={img} alt={`${featured[0].name} view ${i + 1}`} className="w-full h-full object-cover" />
                                            {i === 0 && <span className="absolute top-4 left-4 tag-new pointer-events-none">Featured</span>}
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 relative aspect-[4/5] overflow-hidden">
                                        <img src={featured[0].image} alt={featured[0].name} className="w-full h-full object-cover" />
                                        <span className="absolute top-5 left-5 tag-new pointer-events-none">Featured</span>
                                    </div>
                                )}
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}>
                                <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">{featured[0].category}</p>
                                <h2 className="text-4xl lg:text-5xl font-black tracking-[0.03em] leading-tight mb-5">{featured[0].name}</h2>
                                <p className="text-grey-300 text-base leading-relaxed mb-5">{featured[0].description}</p>

                                <p className="text-3xl font-black mb-8">{featured[0].price} PLN</p>
                                <Link to={`/product/${featured[0].id}`} className="btn-primary">View Product</Link>
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}

            {/* NEW ARRIVALS */}
            <section className="py-20 bg-black">
                <div className="max-w-[1400px] mx-auto px-6">
                    <motion.div className="flex items-center justify-between mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <p className="section-label">New Arrivals</p>
                        <Link to="/shop" className="text-xs font-semibold tracking-[0.1em] text-grey-300 hover:text-accent transition-colors duration-200">View All →</Link>
                    </motion.div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="animate-pulse bg-grey-800 aspect-[3/4] rounded-sm"></div>
                            ))
                        ) : (
                            newArrivals.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)
                        )}
                    </div>
                </div>
            </section>

            {/* PROMO BANNER / COUNTDOWN */}
            <section className="bg-accent py-16">
                <motion.div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8" initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                    <div className="text-center md:text-left">
                        <p className="text-black/70 font-bold tracking-[0.2em] uppercase text-sm mb-2">Next Drop — August 26, 2026</p>
                        <h2 className="text-4xl lg:text-6xl font-black tracking-[0.04em] text-black">FEELINGS MUTUAL 2</h2>
                        <p className="text-black/60 text-base mt-2">The highly anticipated sequel collection.</p>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <CountdownTimer targetDate="2026-08-26T00:00:00" />
                    </div>
                </motion.div>
            </section>

            {/* LOOKBOOK — Full-Page Carousel */}
            <LookbookCarousel />

            {/* VIDEO + EVENT STRIP */}
            <section className="py-20 bg-black">
                <div className="max-w-[1400px] mx-auto px-6">
                    <motion.div className="flex items-center justify-between mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <p className="section-label">The Archive</p>
                        <Link to="/about" className="text-xs font-semibold tracking-[0.1em] text-grey-300 hover:text-accent transition-colors duration-200">Discover More →</Link>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
                        {/* Video Column */}
                        <motion.div className="always-dark lg:col-span-8 relative aspect-video rounded-sm overflow-hidden" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                            {activeVideo ? (
                                <video autoPlay loop muted playsInline className="w-full h-full object-cover" key={activeVideo.mediaUrl}>
                                    <source src={activeVideo.mediaUrl} type={activeVideo.mediaUrl.endsWith('.mp4') ? 'video/mp4' : 'video/quicktime'} />
                                </video>
                            ) : (
                                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                                    <source src="/images/logovideo.mov" type="video/mp4" />
                                </video>
                            )}
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-6 left-6 z-10">
                                <p className="text-white text-sm font-bold tracking-[0.2em] uppercase mb-1 drop-shadow-md">Campaign</p>
                                <h3 className="text-white text-2xl md:text-3xl font-black drop-shadow-md">{activeVideo ? activeVideo.title : 'FEELINGS MUTUAL VISUALS'}</h3>
                                {activeVideo?.description && <p className="text-white/80 text-sm mt-2 max-w-lg drop-shadow">{activeVideo.description}</p>}
                                {activeVideo?.actionUrl && <a href={activeVideo.actionUrl} target="_blank" rel="noreferrer" className="inline-block mt-3 text-xs font-bold bg-white text-black px-4 py-2 hover:bg-accent transition-colors">WATCH FULL</a>}
                            </div>
                        </motion.div>

                        {/* Event Card */}
                        <motion.div className="lg:col-span-4 bg-grey-900 p-6 sm:p-8 flex flex-col justify-center border border-white/[0.06] relative overflow-hidden rounded-sm group hover:bg-grey-800 transition-colors duration-300" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="absolute right-[-10%] top-[-10%] text-white/[0.02] text-8xl font-black uppercase pointer-events-none select-none">
                                EVENT
                            </div>
                            <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3 relative z-10">Event</p>
                            <h3 className="text-2xl font-black tracking-tight leading-tight mb-4 relative z-10 text-white">SWERRV PICNIC<br />& BRAAI</h3>
                            <p className="text-grey-400 group-hover:text-grey-300 transition-colors duration-300 text-sm mb-6 relative z-10 line-clamp-4">
                                Join us for an outdoor picnic and braai hosted by SWERRV to showcase the new collection. Good food, music, and exclusive first looks.
                            </p>
                            <div className="mt-auto relative z-10 flex items-center gap-4">
                                <div className="text-xs font-bold tracking-[0.1em] text-white">
                                    <span className="block text-grey-500 mb-1">DATE</span>
                                    31 JUL '26
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-xs font-bold tracking-[0.1em] text-white">
                                    <span className="block text-grey-500 mb-1">LOC</span>
                                    Zalew Zemborzycki, Lublin
                                </div>
                            </div>
                            <a href="#" className="absolute top-6 right-6 text-xs text-accent hover:underline font-bold z-20">RSVP →</a>
                        </motion.div>
                    </div>
                </div>
            </section>



            {/* CATEGORIES */}
            <section className="py-20 bg-black">
                <div className="max-w-[1400px] mx-auto px-6">
                    <motion.p className="section-label mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Shop by Category</motion.p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'T-Shirts', img: '/images/_DSC8141.jpg', comingSoon: false },
                            { label: 'Hoodies', img: '/images/swerrv_hoodie_model_1772058693065.png', comingSoon: true },
                            { label: 'Tracksuits', img: '/images/swerrv_cargo_1772060995951.png', comingSoon: true },
                            { label: 'Accessories', img: '/images/swerrv_bag_model_1772058939685.png', comingSoon: true },
                        ].map((cat, i) => (
                            <motion.div key={cat.label} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                                {cat.comingSoon ? (
                                    <div className="always-dark group block relative aspect-[2/3] overflow-hidden bg-grey-900 cursor-not-allowed">
                                        <img src={cat.img} alt={cat.label} className="w-full h-full object-cover blur-[4px] scale-105 opacity-50 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center z-10">
                                            <h3 className="text-lg font-black tracking-[0.08em] uppercase text-white mb-2">{cat.label}</h3>
                                            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-white border border-white/40 px-3 py-1.5 backdrop-blur-sm">
                                                Coming Soon
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <Link to={`/shop?category=${cat.label}`} className="always-dark group block relative aspect-[2/3] overflow-hidden">
                                        <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent flex flex-col justify-end p-6">
                                            <h3 className="text-lg font-black tracking-[0.08em] uppercase text-white">{cat.label}</h3>
                                            <span className="text-xs text-accent font-semibold mt-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Shop →</span>
                                        </div>
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FULLSCREEN IMAGE MODAL REMOVED */}

        </div>
    );
};

export default Home;

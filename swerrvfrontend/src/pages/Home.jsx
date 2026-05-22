/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiX, HiArrowRight } from 'react-icons/hi';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import './Home.css';

const AnimatedNumber = ({ value }) => {
    return (
        <div className="relative overflow-hidden text-3xl sm:text-5xl h-[1.1em] flex justify-center items-center">
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={value}
                    initial={{ y: '30%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-30%', opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="block font-mono text-white font-black tracking-tight"
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </div>
    );
};

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
        { label: 'days', value: timeLeft.days },
        { label: 'hours', value: timeLeft.hours },
        { label: 'mins', value: timeLeft.minutes },
        { label: 'secs', value: timeLeft.seconds }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        show: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { 
                type: 'spring', 
                stiffness: 100, 
                damping: 15 
            } 
        }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex gap-3 sm:gap-6 justify-center select-none"
        >
            {timeUnits.map((unit) => (
                <motion.div 
                    key={unit.label} 
                    variants={itemVariants}
                    whileHover={{ 
                        scale: 1.05, 
                        borderColor: 'rgba(255, 255, 255, 0.25)', 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 0 25px rgba(255, 255, 255, 0.1)' 
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center justify-center bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-2xl w-20 h-24 sm:w-28 sm:h-32 transition-colors duration-300"
                >
                    <div className="mb-1 h-10 sm:h-14 flex items-center justify-center w-full">
                        <AnimatedNumber value={String(unit.value).padStart(2, '0')} />
                    </div>
                    <span className="text-[9px] sm:text-xs font-black tracking-widest text-grey-500 uppercase">{unit.label}</span>
                </motion.div>
            ))}
        </motion.div>
    );
};

const OurCollections = () => {
    const cards = [
        { img: '/images/_DSC8113.jpg', label: 'Feeling Mutual 1', displayName: 'Feeling Mutual I', sub: 'T-Shirts', to: '/shop?collection=Feeling+Mutual+1' },
        { img: '/images/_DSC8164.jpg', label: 'Feeling Mutual 2', displayName: 'Feeling Mutual II', sub: 'Tracksuits', to: '/shop?collection=Feeling+Mutual+2' },
    ];

    return (
        <section className="bg-black text-white py-16 px-6 md:px-12">
            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div>
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-grey-500 mb-1.5 block">01 // THE SELECTIONS</span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-white font-grotesk">Our collections</h2>
                </div>
                <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase border border-white/10 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                >
                    view more
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M17 7H7M17 7V17"/>
                    </svg>
                </Link>
            </div>

            {/* 2-card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        className="relative overflow-hidden group cursor-pointer rounded-2xl"
                        style={{ height: '75vh', minHeight: '460px' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                        <Link to={card.to} className="block w-full h-full">
                            <img
                                src={card.img}
                                alt={card.displayName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out"
                                loading="lazy"
                            />
                            {/* Premium dark gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/85 group-hover:from-black/40 group-hover:via-black/60 group-hover:to-black/90 transition-all duration-500 z-10" />
                            
                            {/* Centered content overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20">
                                {/* Giant semi-transparent Roman Numeral */}
                                <span className="absolute text-[15rem] sm:text-[18rem] md:text-[22rem] font-serif font-light text-white/[0.04] group-hover:text-white/[0.07] group-hover:scale-110 select-none pointer-events-none leading-none transition-all duration-[800ms] ease-out z-0">
                                    {i === 0 ? 'I' : 'II'}
                                </span>
                                
                                {/* Collection details */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <h3 className="text-white font-grotesk font-extrabold text-3xl sm:text-4xl tracking-[0.16em] uppercase transition-transform duration-500 group-hover:translate-y-[-8px]">
                                        {card.displayName}
                                    </h3>
                                    <p className="text-white/60 font-mono text-[10px] tracking-[0.3em] uppercase mt-2 transition-transform duration-500 group-hover:translate-y-[-6px]">
                                        {card.sub}
                                    </p>
                                    
                                    {/* Action button appearing on hover */}
                                    <span className="mt-8 inline-flex items-center gap-2.5 text-[9px] font-black tracking-widest uppercase border border-white/20 px-6 py-3.5 rounded-full bg-white/5 backdrop-blur-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-hover:border-white transition-all duration-500 ease-out">
                                        EXPLORE DROP
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M7 17L17 7M17 7H7M17 7V17"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

const BrandStatement = () => (
    <section className="bg-black text-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: '540px' }}>

            {/* Left — full portrait photo */}
            <div className="relative overflow-hidden" style={{ minHeight: '540px' }}>
                <img
                    src="/images/_DSC8177.jpg"
                    alt="Swerrv model"
                    className="absolute inset-0 w-full h-full object-cover object-[center_15%]"
                    loading="lazy"
                />
                {/* Subtle right fade */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40" />
                {/* Large decorative S */}
                <span
                    className="absolute bottom-[-0.1em] left-2 font-black select-none pointer-events-none text-white/15 leading-none"
                    style={{ fontSize: '20vw' }}
                >
                    S
                </span>
            </div>

            {/* Right — text block */}
            <div className="flex flex-col justify-center gap-8 px-10 md:px-16 py-20 bg-black">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                >
                    Not just a brand —{' '}a movement redefining streetwear and connecting creators through style
                </motion.h2>

                <motion.p
                    className="text-sm text-white/50 leading-relaxed max-w-xs"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.18 }}
                >
                    We&apos;re not just a brand — we&apos;re a movement redefining streetwear.
                    Connect with a community of creators, explore curated styles, and express
                    yourself through fashion that speaks your language.
                </motion.p>

                <motion.div
                    className="flex flex-wrap gap-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.3 }}
                >
                    <Link
                        to="/about"
                        className="inline-flex items-center gap-2 text-sm font-semibold border border-white px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors"
                    >
                        Our story
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17L17 7M17 7H7M17 7V17"/>
                        </svg>
                    </Link>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 text-sm font-semibold border border-white px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors"
                    >
                        Contact us
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17L17 7M17 7H7M17 7V17"/>
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </div>
    </section>
);

const SupportCTA = () => (
    <section className="py-24 bg-grey-950 text-white border-t border-b border-white/[0.06]">
        <div className="max-w-[1000px] mx-auto px-6 text-center flex flex-col items-center gap-6">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-grey-400">Customer Support</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-tight max-w-xl">
                Need help with your order or have a question?
            </h2>
            <p className="text-sm text-grey-300 leading-relaxed max-w-md">
                Our support team is available Mon–Fri to help you with sizing, shipping, returns, or anything else you need.
            </p>
            <div className="mt-4">
                <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase border border-white px-8 py-3.5 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                >
                    Get in touch
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M17 7H7M17 7V17"/>
                    </svg>
                </Link>
            </div>
        </div>
    </section>
);

/* ══ LOOKBOOK GALLERY ══ */
const LookbookGallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const lookbookSets = [
        [
            { id: 1, src: '/images/_DSC8141.jpg', span: 'col-span-2 row-span-1', label: 'WARSAW STREETS' },
            { id: 2, src: '/images/_DSC8160.jpg', span: 'col-span-1 row-span-2', label: 'RAW SILHOUETTE' },
            { id: 3, src: '/images/_DSC8177.jpg', span: 'col-span-1 row-span-1', label: 'STUDIO FIT' },
            { id: 4, src: '/images/_DSC7953.jpg', span: 'col-span-1 row-span-1', label: 'OUTDOOR VIBES' },
            { id: 5, src: '/images/_DSC7893.jpg', span: 'col-span-2 row-span-1', label: 'FEELING MUTUAL' },
            { id: 6, src: '/images/_DSC8055.jpg', span: 'col-span-1 row-span-1', label: 'BOXY TEE' },
            { id: 7, src: '/images/_DSC8199.jpg', span: 'col-span-1 row-span-1', label: 'VINTAGE WASH' },
            { id: 8, src: '/images/_DSC8220.jpg', span: 'col-span-1 row-span-1', label: 'WARSAW POP-UP' }
        ],
        [
            { id: 9, src: '/images/_DSC8122.jpg', span: 'col-span-1 row-span-1', label: 'COZY HOODIE' },
            { id: 10, src: '/images/_DSC8144.jpg', span: 'col-span-1 row-span-1', label: 'CREATIVE PROCESS' },
            { id: 11, src: '/images/_DSC8136.jpg', span: 'col-span-2 row-span-1', label: 'OVERSIZED DRAPE' },
            { id: 12, src: '/images/_DSC8149.jpg', span: 'col-span-1 row-span-2', label: 'MONOCHROME' },
            { id: 13, src: '/images/_DSC8154.jpg', span: 'col-span-1 row-span-1', label: 'STREET CUT' },
            { id: 14, src: '/images/_DSC8157.jpg', span: 'col-span-2 row-span-1', label: 'WARSAW CORE' },
            { id: 15, src: '/images/_DSC8164.jpg', span: 'col-span-1 row-span-1', label: 'HEAVYWEIGHT' },
            { id: 16, src: '/images/_DSC8179.jpg', span: 'col-span-1 row-span-1', label: 'CREATOR WEAR' }
        ],
        [
            { id: 17, src: '/images/_DSC8188.jpg', span: 'col-span-1 row-span-2', label: 'CONCRETE JUNGLE' },
            { id: 18, src: '/images/_DSC8190.jpg', span: 'col-span-2 row-span-1', label: 'SILHOUETTE PLAY' },
            { id: 19, src: '/images/_DSC8192.jpg', span: 'col-span-1 row-span-1', label: 'FEELING MUTUAL II' },
            { id: 20, src: '/images/_DSC8195.jpg', span: 'col-span-1 row-span-1', label: 'RAW DETAILS' },
            { id: 21, src: '/images/_DSC8211.jpg', span: 'col-span-1 row-span-1', label: 'WARSAW VIBES' },
            { id: 22, src: '/images/_DSC8221.jpg', span: 'col-span-1 row-span-1', label: 'DESIGN ROOM' },
            { id: 23, src: '/images/_DSC8235.jpg', span: 'col-span-2 row-span-1', label: 'STREET MOVEMENT' },
            { id: 24, src: '/images/_DSC8246.jpg', span: 'col-span-1 row-span-1', label: 'TEXTURE ARCHIVE' }
        ]
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedImage(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % lookbookSets.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [activeIndex]);

    return (
        <section className="py-24 bg-black text-white border-t border-white/10">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-grey-400 mb-2">01 // VISUAL LOGBOOK</p>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">SWERRV LOOKBOOK</h2>
                    </div>
                    {/* Page selector controls */}
                    <div className="flex items-center gap-2">
                        {lookbookSets.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-mono transition-all duration-300 ${
                                    activeIndex === i
                                    ? 'bg-white border-white text-black font-bold'
                                    : 'border-white/10 text-white/55 hover:border-white/30 hover:text-white'
                                }`}
                                aria-label={`Go to lookbook set ${i + 1}`}
                            >
                                {String(i + 1).padStart(2, '0')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px] md:auto-rows-[280px]">
                    <AnimatePresence mode="popLayout">
                        {lookbookSets[activeIndex].map((img) => (
                            <motion.div
                                key={img.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                                className={`relative overflow-hidden group cursor-pointer rounded-2xl border border-white/5 ${img.span}`}
                                onClick={() => setSelectedImage(img.src)}
                                whileHover={{ scale: 0.99 }}
                            >
                                <img
                                    src={img.src}
                                    alt={img.label}
                                    className="w-full h-full object-cover transition-transform duration-[750ms] group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                                    <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase">TAP TO VIEW</span>
                                    <h3 className="text-lg font-black tracking-tight text-white uppercase">{img.label}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000] flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            className="relative max-w-[500px] w-full bg-white/[0.03] border border-white/[0.1] backdrop-blur-2xl rounded-[24px] p-6 shadow-2xl flex flex-col gap-4"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-grey-400">Lookbook Preview</h3>
                                <button
                                    className="text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center border border-white/10"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <HiX size={16} />
                                </button>
                            </div>
                            
                            <div className="relative w-full overflow-hidden bg-black/40 rounded-2xl border border-white/[0.05] flex items-center justify-center aspect-[3/4]">
                                <img
                                    src={selectedImage}
                                    alt="Expanded Lookbook"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                            
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="btn-secondary w-full py-3.5 rounded-xl text-center text-xs font-bold uppercase tracking-widest"
                            >
                                Close Preview
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

/* ══ BRAND NEWS / EDITORIAL ══ */
const BrandNews = () => {
    const [selectedStory, setSelectedStory] = useState(null);

    const stories = [
        {
            id: 1,
            date: '15 MAY 2026',
            tag: 'RELEASES',
            title: 'DROP 002: FEELING MUTUAL PART II',
            excerpt: 'Our second collection Drop exploring oversized silhouettes, raw detailing, and custom washed heavy cotton fabrics.',
            image: '/images/_DSC8113.jpg',
            content: [
                'Drop 002 represents the next chapter in the Feeling Mutual story. Building on the core shapes established in our initial drop, Part II introduces premium velour tracksuits, textured cargo pants, and signature graphic tees.',
                'Each piece is designed in Warsaw and crafted using custom-dyed fabrics to achieve the perfect vintage streetwear feel. We have adjusted the fits to feature slightly wider chest dimensions and custom dropped shoulders, ensuring an ultra-relaxed but structured drape.',
                'All garments have undergone a unique acid-wash treatment, making every individual item unique in its texture and depth of colour. Available now online and at select stockists worldwide.'
            ]
        },
        {
            id: 2,
            date: '28 APR 2026',
            tag: 'EDITORIAL',
            title: 'THE SWERRV WARSAW STUDIO SPACE',
            excerpt: 'A look inside our creative headquarters where sketches, raw patterns, and streetwear culture intersect.',
            image: '/images/_DSC8289.jpg',
            content: [
                'Located in the heart of Warsaw, the Swerrv Studio is more than just a design space — it\'s a collaborative hub for artists, skaters, and creatives. We believe that streetwear should be an organic extension of lifestyle, and our studio workspace is designed to foster exactly that.',
                'In this journal entry, we take you behind the curtain to show the mood boards, fabric trials, and design iterations that birthed our latest silhouettes. From the initial pencil sketch to final sample approval, every detail is scrutinised.',
                'Our space regularly hosts local underground artists and serves as a meeting point for pop-up galleries and listening parties, cementing Swerrv as a cultural movement rather than just a clothing label.'
            ]
        },
        {
            id: 3,
            date: '10 APR 2026',
            tag: 'COMMUNITY',
            title: 'STREETWEAR AND CREATORS IN FOCUS',
            excerpt: 'Connecting local artists, skate culture, and musicians through clothing that serves as a canvas for self-expression.',
            image: '/images/_DSC8177.jpg',
            content: [
                'Streetwear has always been driven by subcultures and the communities that shape them. For Swerrv, clothing is a physical medium that connects creators across different disciplines — from skateboarders to underground music producers.',
                'We sat down with local Warsaw creators to discuss what streetwear means to them, how style shapes identity, and how we can continue to support local creative spaces.',
                'This article is the first of a series of community spotlights. We explore how clothing can act as a unifying uniform for independent thinkers, and share our upcoming initiatives for collaborative artist tees.'
            ]
        }
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedStory(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <section className="py-24 bg-black text-white border-t border-white/10">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="mb-12">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-grey-400 mb-2">02 // JOURNAL & ARCHIVES</p>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">THE SWERRV EDITORIAL</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stories.map((story) => (
                        <motion.div
                            key={story.id}
                            className="flex flex-col group cursor-pointer bg-[#0d0d0d] rounded-2xl border border-white/5 hover:border-white/15 p-4 transition-colors duration-300"
                            onClick={() => setSelectedStory(story)}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-grey-800 mb-5">
                                <img
                                    src={story.image}
                                    alt={story.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                                    loading="lazy"
                                />
                            </div>
                            <div className="flex items-center gap-3.5 mb-3">
                                <span className="text-[9px] font-black tracking-wider text-accent border border-accent/20 bg-accent/5 px-2 py-0.5 rounded-full">{story.tag}</span>
                                <span className="text-[10px] font-mono text-grey-500">{story.date}</span>
                            </div>
                            <h3 className="text-lg font-bold leading-snug text-white/90 group-hover:text-white mb-2 line-clamp-2 transition-colors">
                                {story.title}
                            </h3>
                            <p className="text-xs text-grey-400 leading-relaxed line-clamp-3 mb-5">
                                {story.excerpt}
                            </p>
                            <div className="mt-auto pt-2 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white/60 group-hover:text-white transition-colors">
                                <span>Read story</span>
                                <HiArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedStory && (
                    <motion.div
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000] flex items-center justify-center p-4 overflow-y-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedStory(null)}
                    >
                        <motion.div
                            className="bg-[#0c0c0c] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden my-8"
                            initial={{ scale: 0.95, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative aspect-[16/9] w-full bg-grey-800">
                                <img
                                    src={selectedStory.image}
                                    alt={selectedStory.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-black/30" />
                                <button
                                    className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white rounded-full p-2 transition-colors border border-white/10"
                                    onClick={() => setSelectedStory(null)}
                                >
                                    <HiX size={20} />
                                </button>
                                <div className="absolute bottom-4 left-6 right-6">
                                    <div className="flex items-center gap-3.5 mb-2">
                                        <span className="text-[9px] font-black tracking-wider text-accent border border-accent/20 bg-accent/5 px-2 py-0.5 rounded-full">{selectedStory.tag}</span>
                                        <span className="text-[10px] font-mono text-white/70">{selectedStory.date}</span>
                                    </div>
                                    <h2 className="text-xl md:text-3xl font-black uppercase text-white tracking-tight leading-tight">
                                        {selectedStory.title}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
                                <div className="flex flex-col gap-4 text-sm text-grey-300 leading-relaxed font-light">
                                    {selectedStory.content.map((p, idx) => (
                                        <p key={idx}>{p}</p>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/10 px-6 py-4 flex justify-end">
                                <button
                                    onClick={() => setSelectedStory(null)}
                                    className="btn-primary py-2.5 px-6 text-[10px] font-black tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

const Home = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

    const [newArrivals, setNewArrivals] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [feats, arrivals] = await Promise.all([
                    api.getFeaturedProducts(),
                    api.searchProducts({ size: 8 })
                ]);

                if (!feats || feats.length === 0) {
                    setFeatured([{
                        id: 'f1',
                        name: 'Featured logo t-shirt',
                        description: 'Premium heavyweight cotton tee with signature Swerrv embroidery. Designed for a boxy, oversized fit.',
                        price: '59.99',
                        image: '/images/_DSC8141.jpg',
                        images: ['/images/_DSC8141.jpg', '/images/_DSC8113.jpg']
                    }]);
                } else {
                    setFeatured(feats);
                }

                if (!arrivals || arrivals.length === 0) {
                    setNewArrivals([
                        { id: '1', name: 'Core logo t-shirt', price: '150', category: 'T-Shirts', image: '/images/_DSC8141.jpg' },
                        { id: '2', name: 'Velour tracksuit', price: '550', category: 'Tracksuits', image: '/images/swerrv_cargo_1772060995951.png' },
                        { id: '3', name: 'Signature tracksuit cream', price: '320', category: 'Tracksuits', image: '/images/swerrv_cargo_1772060995951.png' },
                        { id: '4', name: 'Classic white tee', price: '450', category: 'T-Shirts', image: '/images/_DSC7916.jpg' }
                    ]);
                } else {
                    setNewArrivals(arrivals);
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
            {/* ══ HERO SECTION ══ */}
            <section ref={heroRef} className="relative h-[65vh] min-h-[420px] md:h-screen md:min-h-[600px] w-full bg-black overflow-hidden text-white">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <motion.img
                        src="/images/_DSC8289.jpg"
                        alt="Hero Models"
                        className="w-full h-full object-cover object-[center_25%]"
                        style={{ y: heroY }}
                        fetchPriority="high"
                    />
                    {/* Subtle dark overlay only at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
                </div>

                {/* Small descriptor — middle right */}
                <div className="absolute right-12 top-1/2 -translate-y-1/2 z-20 max-w-[180px] text-right hidden md:block">
                    <p className="text-[11px] font-medium tracking-wide leading-relaxed text-white/80 uppercase">
                        Find the latest fits, exclusive releases and influencer-curated outfits all in one spot
                    </p>
                </div>

                {/* Cross accent marks */}
                <span className="absolute top-[38%] left-[38%] z-20 text-white/30 text-lg select-none hidden md:block">+</span>
                <span className="absolute top-[55%] right-[35%] z-20 text-white/30 text-lg select-none hidden md:block">+</span>

                {/* Bottom-left headline + CTA */}
                <div className="absolute bottom-24 left-6 md:left-12 z-20">
                    <motion.h1
                        className="text-[8vw] md:text-[5.5vw] font-black leading-[0.9] tracking-tight uppercase text-white"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                    >
                        UPGRADE<br />
                        YOUR STYLE<br />
                        <span className="inline-flex items-center gap-4 flex-wrap">
                            WITH EASE
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                            >
                                <Link
                                    to="/shop"
                                    className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold tracking-wide px-6 py-3 rounded-full hover:bg-white/90 transition-colors normal-case text-base"
                                    style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.01em' }}
                                >
                                    Shop now
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M7 17L17 7M17 7H7M17 7V17"/>
                                    </svg>
                                </Link>
                            </motion.span>
                        </span>
                    </motion.h1>
                </div>
            </section>

            {/* ══ OUR COLLECTIONS ══ */}
            <OurCollections />

            {/* ══ BRAND STATEMENT ══ */}
            <BrandStatement />

            {/* ══ NEW ARRIVALS ══ */}
            <section className="py-24 bg-black">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-medium tracking-tight">New arrivals</h2>
                        <Link to="/shop" className="text-sm font-medium tracking-wide border-b border-white hover:opacity-60 transition-opacity">Shop all</Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-black/5 animate-pulse"></div>
                            ))
                        ) : (
                            newArrivals.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)
                        )}
                    </div>
                </div>
            </section>

            {/* ══ LOOKBOOK GALLERY ══ */}
            <LookbookGallery />

            {/* ══ FEATURED DROP ══ */}
            {featured[0] && (
                <section className="py-32 bg-grey-900 text-white">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                                <div className="aspect-[4/5] overflow-hidden bg-black/20">
                                    <img src={featured[0].image} alt="feature" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-700" />
                                </div>
                            </motion.div>
                            <div>
                                <p className="text-sm font-medium tracking-wide mb-6 opacity-70">Featured piece</p>
                                <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">{featured[0].name}</h2>
                                <p className="text-lg leading-relaxed mb-10 opacity-90">{featured[0].description}</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-2xl font-medium">{featured[0].price} zł</p>
                                    <Link to={`/product/${featured[0].id}`} className="text-xs font-semibold tracking-wide border border-current px-8 py-3 hover:bg-white hover:text-black transition-colors">
                                        View product
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ══ BRAND EDITORIALS ══ */}
            <BrandNews />
            {/* ══ PROMO BANNER ══ */}
            <section className="relative bg-black py-36 border-b border-white/10 overflow-hidden">
                {/* Background image teaser */}
                <div className="absolute inset-0 z-0 opacity-25">
                    <img src="/images/_DSC8168.jpg" alt="Teaser Background" className="w-full h-full object-cover object-[center_35%]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
                </div>

                <div className="relative z-10 max-w-[1000px] mx-auto px-6 text-center flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-[10px] font-black tracking-widest uppercase text-grey-300">Live countdown</span>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-black tracking-tight uppercase mb-12">
                        THE UPCOMING COLLECTION
                    </h2>
                    <CountdownTimer targetDate="2026-08-26T00:00:00" />
                </div>
            </section>

            {/* ══ SUPPORT CTA ══ */}
            <SupportCTA />

        
        </div>
    );
};

export default Home;

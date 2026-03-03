import { motion } from 'framer-motion';

const PageLoader = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear"
                }}
                className="w-16 h-16 rounded-full overflow-hidden border border-white/10"
            >
                {/* We use logo.jpeg as the spinning circular icon */}
                <img
                    src="/images/logo.jpeg"
                    alt="Loading"
                    className="w-full h-full object-cover"
                />
            </motion.div>
        </div>
    );
};

export default PageLoader;

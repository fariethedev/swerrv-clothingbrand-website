import { HiStar, HiOutlineStar } from 'react-icons/hi';

const StarRating = ({ rating, count }) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex text-white">
                {[...Array(fullStars)].map((_, i) => (
                    <HiStar key={`full-${i}`} size={12} />
                ))}
                {hasHalfStar && <HiStar key="half" size={12} className="opacity-70" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <HiOutlineStar key={`empty-${i}`} size={12} className="opacity-40" />
                ))}
            </div>
            {count !== undefined && (
                <span className="text-[10px] text-grey-500 font-mono">({count})</span>
            )}
        </div>
    );
};

export default StarRating;

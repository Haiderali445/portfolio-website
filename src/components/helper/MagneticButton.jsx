import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, className = '', onClick }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
            className={`relative overflow-hidden group ${className}`}
            onClick={onClick}
        >
            <span className="relative z-10">{children}</span>
            {/* Optional Glow Effect on Hover */}
            <div className="absolute inset-0 -z-10 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-xl" />
        </motion.button>
    );
};

export default MagneticButton;

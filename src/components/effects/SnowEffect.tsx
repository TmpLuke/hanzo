import { useEffect, useState } from "react";

const SnowEffect = () => {
    const [snowflakes, setSnowflakes] = useState<{ id: number; left: number; animationDuration: number; opacity: number; size: number }[]>([]);

    useEffect(() => {
        const createSnowflakes = () => {
            const count = 50;
            const newSnowflakes = Array.from({ length: count }).map((_, i) => ({
                id: i,
                left: Math.random() * 100,
                animationDuration: Math.random() * 3 + 4, // 4-7s
                opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8
                size: Math.random() * 5 + 5, // 5-10px
            }));
            setSnowflakes(newSnowflakes);
        };

        createSnowflakes();
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute top-0 text-white select-none"
                    style={{
                        left: `${flake.left}%`,
                        fontSize: `${flake.size}px`,
                        opacity: flake.opacity,
                        animation: `snow-fall ${flake.animationDuration}s linear infinite, snow-sway 3s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    );
};

export default SnowEffect;

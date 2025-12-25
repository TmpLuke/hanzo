import { useEffect, useState } from "react";

const HeartsEffect = () => {
    const [hearts, setHearts] = useState<{ id: number; left: number; animationDuration: number; size: number; color: string }[]>([]);

    useEffect(() => {
        const createHearts = () => {
            const count = 30;
            const colors = ["#ff4d4d", "#ff99cc", "#ff0000", "#ff66b2"];
            const newHearts = Array.from({ length: count }).map((_, i) => ({
                id: i,
                left: Math.random() * 100,
                animationDuration: Math.random() * 4 + 3, // 3-7s
                size: Math.random() * 15 + 10, // 10-25px
                color: colors[Math.floor(Math.random() * colors.length)],
            }));
            setHearts(newHearts);
        };

        createHearts();
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="absolute top-0 select-none"
                    style={{
                        left: `${heart.left}%`,
                        fontSize: `${heart.size}px`,
                        color: heart.color,
                        animation: `heart-fall ${heart.animationDuration}s linear infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                        textShadow: "0 0 5px rgba(255,105,180, 0.5)",
                    }}
                >
                    ❤️
                </div>
            ))}
        </div>
    );
};

export default HeartsEffect;

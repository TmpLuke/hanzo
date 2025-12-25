import { useEffect, useState } from "react";

const ChristmasLights = () => {
    // Generate lights
    const [lights, setLights] = useState<number[]>([]);

    useEffect(() => {
        setLights(Array.from({ length: 40 }));
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-[60px] pointer-events-none z-[60] overflow-hidden flex justify-between px-2">
            {/* Wire */}
            <div className="absolute top-[-5px] left-0 w-full h-[10px] border-b-2 border-gray-600 rounded-[50%] opacity-80" style={{ transform: "scaleY(0.5)" }}></div>

            {lights.map((_, i) => {
                // Alternating colors
                const colors = ["#ff0000", "#00ff00", "#ffff00", "#0000ff"];
                const color = colors[i % colors.length];

                return (
                    <div
                        key={i}
                        className="relative w-[12px] h-[12px] rounded-full mt-[10px]"
                        style={{
                            backgroundColor: color,
                            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
                            animation: `flash 2s infinite alternate`,
                            animationDelay: `${i * 0.1}s`,
                        }}
                    >
                        {/* Socket */}
                        <div className="absolute top-[-5px] left-[2px] w-[8px] h-[6px] bg-gray-800 rounded-sm"></div>
                    </div>
                );
            })}
            <style>
                {`
                    @keyframes flash {
                        0%, 50% { opacity: 1; transform: scale(1); }
                        51%, 100% { opacity: 0.4; transform: scale(0.9); }
                    }
                `}
            </style>
        </div>
    );
};

export default ChristmasLights;

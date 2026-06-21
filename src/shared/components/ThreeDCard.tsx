import React, { useState } from "react";

interface ThreeDCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
  isInteractive?: boolean;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({
  children,
  glowColor = "rgba(120, 120, 255, 0.15)",
  isInteractive = true,
  className = "",
  id,
  ...props
}) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // range -0.5 to 0.5
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  const cardStyle: React.CSSProperties = {
    transform: isInteractive
      ? `perspective(1000px) rotateY(${coords.x * 12}deg) rotateX(${-coords.y * 12}deg) translateZ(${isHovered ? 8 : 0}px)`
      : "none",
    transition: isHovered ? "transform 0.05s ease-out, box-shadow 0.25s ease" : "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: isHovered
      ? `0 20px 40px -15px rgba(0, 0, 0, 0.4), 0 0 30px 2px ${glowColor}`
      : "0 4px 20px -8px rgba(0, 0, 0, 0.25)",
  };

  return (
    <div
      id={id}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Glow reflection element */}
      {isInteractive && isHovered && (
        <div
          className="absolute pointer-events-none rounded-full blur-2xl"
          style={{
            width: "150px",
            height: "150px",
            left: `${(coords.x + 0.5) * 100}%`,
            top: `${(coords.y + 0.5) * 100}%`,
            background: glowColor,
            transform: "translate(-50%, -50%)",
            transition: "opacity 0.2s ease",
          }}
        />
      )}
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
};

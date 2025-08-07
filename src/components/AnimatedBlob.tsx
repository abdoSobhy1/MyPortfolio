import { useState, useEffect } from "react";

interface AnimatedBlobProps {
  size?: string;
  color?: string;
  delay?: string;
  duration?: string;
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  followMouse?: boolean;
}

const AnimatedBlob = ({
  size = "w-96 h-96",
  color = "bg-primary/20",
  delay = "0s",
  duration = "20s",
  position = {},
  followMouse = false,
}: AnimatedBlobProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!followMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [followMouse]);

  if (followMouse) {
    return (
      <div
        className={`fixed ${size} ${color} rounded-full blur-2xl opacity-30 pointer-events-none z-0 transition-all duration-700 ease-out`}
        style={{
          left: mousePosition.x, // Offset to center the blob
          top: mousePosition.y,
          filter: "blur(60px)",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }

  return (
    <div
      className={`absolute ${size} ${color} rounded-full blur-2xl animate-float opacity-60 pointer-events-none`}
      style={{
        ...position,
        animationDelay: delay,
        animationDuration: duration,
        filter: "blur(40px)",
      }}
    />
  );
};

export default AnimatedBlob;

import { useEffect, useRef } from "react";

import nextjs from "../assets/stack/nextjs.svg";
import react from "../assets/stack/reactjs.svg";
import redux from "../assets/stack/redux.svg";
import tailwind from "../assets/stack/tailwind.svg";
import bootstrap from "../assets/stack/Bootstrap.svg";
import github from "../assets/stack/github.svg";
import html from "../assets/stack/html.svg";
import css from "../assets/stack/css.svg";
import javascript from "../assets/stack/javascript.svg";
import typescript from "../assets/stack/typescript.svg";

const techStack = [
  { name: "HTML", color: "#E34F26", logo: html },
  { name: "CSS", color: "#1572B6", logo: css },
  { name: "JavaScript", color: "#F7DF1E", logo: javascript },
  { name: "TypeScript", color: "#3178C6", logo: typescript },
  { name: "React", color: "#61DAFB", logo: react },
  { name: "Redux", color: "#764ABC", logo: redux },
  { name: "Next.js", color: "#000000", logo: nextjs },
  { name: "Tailwind CSS", color: "#06B6D4", logo: tailwind },
  { name: "Bootstrap", color: "#7952B3", logo: bootstrap },
  { name: "GitHub", color: "#181717", logo: github },
];

const TechCarousel = () => {
  const stackRef = useRef<HTMLDivElement>(null);
  const didDuplicate = useRef(false);

  useEffect(() => {
    if (didDuplicate.current || !stackRef.current) return;

    const stack = stackRef.current;
    const children = Array.from(stack.children);
    children.forEach((item) => {
      if (!(item instanceof HTMLElement) || item.dataset.duplicated) return;
      const clone = item.cloneNode(true) as HTMLElement;
      clone.className = "w-36";
      clone.dataset.duplicated = "true";
      stack.appendChild(clone);
    });

    didDuplicate.current = true;
  }, []);

  return (
    <div className="relative w-full py-4">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="max-w-full mt-8 overflow-hidden">
        <div
          ref={stackRef}
          className="w-max flex flex-nowrap gap-5 items-center"
          style={{
            animation: "scroll 15s linear infinite",
          }}
        >
          {techStack.map((tech, index) => (
            <div key={`${tech.name}-${index}`} className="w-36">
              <div className="glass-card p-6 rounded-2xl transition-all duration-300 hover:z-20 relative  text-center space-y-3 group">
                <div className="text-4xl transition-all duration-300 relative">
                  <img
                    src={tech.logo}
                    alt={`${tech.name} logo`}
                    className="w-12 h-12 mx-auto relative z-10"
                  />
                  <img
                    src={tech.logo}
                    alt={`${tech.name} logo`}
                    className="w-12 h-12 mx-auto opacity-0 max-h-full scale-200 absolute top-0 left-1/2 -translate-x-1/2 z-0 blur-md transition duration-300 group-hover:opacity-100"
                    style={{
                      filter: `blur(8px) drop-shadow(0 0 20px ${tech.color})`,
                    }}
                  />
                </div>
                <h4 className="font-semibold text-foreground">{tech.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechCarousel;

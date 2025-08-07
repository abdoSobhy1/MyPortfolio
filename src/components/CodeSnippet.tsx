import { useState, useEffect } from "react";

const CodeSnippet = () => {
  const [currentLine, setCurrentLine] = useState(0);

  const codeLines = [
    "const developer = {",
    "  name: 'AbdelRahman Sobhy',",
    "  role: 'Frontend & mobile Developer',",
    "  location: 'Alexandria, Egypt',",
    "  experience: '2+ years',",
    "  specialties: [",
    "    'Next.js',",
    "    'React',",
    "    'React Native',",
    "    'TypeScript',",
    "    'and more...',",
    "  ],",
    "  passion: 'Building amazing apps',",
    "  availability: 'Open for projects'",
    "};",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % codeLines.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 rounded-2xl animate-float">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-sm text-muted-foreground ml-4">developer.js</span>
      </div>

      {/* Code Content */}
      <div className="font-mono text-sm space-y-1">
        {codeLines.map((line, index) => (
          <div
            key={index}
            className={`transition-all duration-500 ${
              index <= currentLine
                ? "opacity-100 text-foreground"
                : "opacity-30 text-muted-foreground"
            }`}
          >
            <span className="text-muted-foreground mr-4">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={
                line.includes("'AbdelRahman Sobhy'")
                  ? "text-primary"
                  : line.includes("'Frontend & mobile Developer'")
                  ? "text-accent"
                  : line.includes("'React Native'") ||
                    line.includes("'Next.js'") ||
                    line.includes("'React'")
                  ? "text-primary"
                  : line.includes("'TypeScript'") ||
                    line.includes("'and more...'")
                  ? "text-accent"
                  : line.includes("'Building amazing apps'")
                  ? "text-primary"
                  : line.includes("'Open for projects'")
                  ? "text-green-400"
                  : "text-foreground"
              }
            >
              {line}
            </span>
            {index === currentLine && (
              <span className="animate-pulse text-primary">|</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeSnippet;

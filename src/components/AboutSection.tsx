import { Code, Smartphone, Package, Users } from "lucide-react";

const AboutSection = () => {
  const skills = [
    {
      icon: Smartphone,
      title: "Mobile App Development",
      description:
        "Building fast, beautiful mobile apps using React Native with a focus on UI and performance.",
    },
    {
      icon: Code,
      title: "Frontend Web Development",
      description:
        "Creating modern, scalable web interfaces with React, Next.js, and Tailwind CSS.",
    },
    {
      icon: Package,
      title: "AI-Powered UI Development",
      description:
        "Leveraging AI tools to accelerate UI development, generate components, and enhance productivity while maintaining code quality and design consistency.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Experienced in agile workflows and cross-functional collaboration for product delivery.",
    },
  ];

  return (
    <section id="about" className="py-20 lg:pl-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            I'm a frontend-focused developer passionate about building polished,
            high-performing user interfaces for both mobile and web platforms.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                My Journey
              </h3>
              <p className="text-foreground/80 leading-relaxed mb-4">
                With several years of experience building user-facing
                applications, I specialize in creating responsive, maintainable
                UIs using modern frameworks and tools.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                My main stack includes React Native for cross-platform mobile
                apps and Next.js for performant web interfaces. I'm always
                driven by clean code, consistent UX, and optimizing performance
                for real users.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <div
                key={skill.title}
                className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <skill.icon className="h-8 w-8 text-primary mb-4" />
                <h4 className="font-semibold text-foreground mb-2">
                  {skill.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

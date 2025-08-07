import { useState, useEffect } from "react";
import { Github, Mail, Linkedin, Briefcase, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import TechCarousel from "@/components/TechCarousel";
import CodeSnippet from "@/components/CodeSnippet";
import VerticalNav from "@/components/VerticalNav";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import PageTransition from "@/components/PageTransition";
import AnimatedBlob from "@/components/AnimatedBlob";
import Footer from "@/components/Footer";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Enhanced Grid Background */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background opacity-95" />

        {/* Animated Blobs - Enhanced visibility */}
        <AnimatedBlob
          size="w-[400px] h-[400px]"
          color="bg-primary/15"
          followMouse={true}
        />

        {/* Static background blob */}
        <AnimatedBlob
          size="w-[500px] h-[500px]"
          color="bg-accent/15"
          position={{ top: "5%", left: "0%" }}
          delay="0s"
          duration="25s"
        />

        {/* Dashboard Access Button for Signed In Users */}
        {isSignedIn && (
          <div className="fixed top-4 right-4 z-50">
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-primary hover:bg-primary/90 text-white neon-glow"
            >
              <Settings className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
        )}

        {/* Vertical Navigation */}
        <VerticalNav />

        {/* Main Content - Responsive padding */}
        <div className="relative z-10 lg:pl-20">
          <div className="container mx-auto px-6 py-8">
            {/* Hero Section */}
            <section id="home" className="min-h-screen flex items-center">
              <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
                {/* Left Column - Bio */}
                <div
                  className={`space-y-8 ${
                    isVisible ? "animate-slide-in-left" : "opacity-0"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="inline-block">
                      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent mb-2 leading-loose">
                        AbdelRahman Sobhy
                      </h1>
                      <div className="h-1 w-32 bg-gradient-to-r from-primary to-accent rounded-full" />
                    </div>

                    <h2 className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light">
                      Frontend & Mobile Developer
                    </h2>
                  </div>

                  <div className="glass-card p-6 rounded-2xl max-w-lg">
                    <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                      Passionate frontend developer specializing in crafting
                      responsive, high-quality user interfaces using
                      <span className="text-primary font-semibold">
                        {" "}
                        React Native{" "}
                      </span>
                      for mobile and
                      <span className="text-accent font-semibold">
                        {" "}
                        Next.js{" "}
                      </span>
                      for web. Dedicated to clean architecture, seamless user
                      experiences, and modern frontend best practices.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full neon-glow hover:scale-105 transition-all duration-300"
                      onClick={() => scrollToSection("projects")}
                    >
                      <Briefcase className="mr-2 h-5 w-5" />
                      View Projects
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-3 rounded-full hover:scale-105 transition-all duration-300"
                      onClick={() => scrollToSection("contact")}
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Get In Touch
                    </Button>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-4 pt-4">
                    <a
                      href="#"
                      className="p-3 glass rounded-full hover:bg-primary/20 transition-all duration-300 hover:scale-110"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="p-3 glass rounded-full hover:bg-primary/20 transition-all duration-300 hover:scale-110"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="p-3 glass rounded-full hover:bg-primary/20 transition-all duration-300 hover:scale-110"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>

                {/* Right Column - Code Snippet */}
                <div
                  className={`${
                    isVisible
                      ? "animate-fade-in animation-delay-300"
                      : "opacity-0"
                  }`}
                >
                  <CodeSnippet />
                </div>
              </div>
            </section>

            {/* Tech Stack Carousel */}
            <section id="skills" className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Tech Stack
                </h3>
                <p className="text-muted-foreground text-lg">
                  Technologies I work with daily
                </p>
              </div>
              <TechCarousel />
            </section>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <AboutSection />
      <ProjectsSection />
      <ContactSection />

      {/* Footer */}
      <Footer />
    </PageTransition>
  );
};

export default Index;

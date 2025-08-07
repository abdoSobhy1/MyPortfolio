import { Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-background/95 backdrop-blur-xl border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="space-y-4 text-center md:text-left lg:pl-20">
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AbdelRahman Sobhy
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto md:mx-0">
              Frontend Developer crafting beautiful experiences with and
              Next.js, React Native, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-semibold text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-semibold text-foreground">
              Connect
            </h4>
            <div className="flex gap-3 sm:gap-4 justify-center md:justify-start">
              <a
                href="https://github.com/abdoSobhy1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 glass rounded-lg hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              >
                <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/abdosobhy/"
                className="p-2 sm:p-3 glass rounded-lg hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="mailto:abdoosobhy97@gmail.com"
                className="p-2 sm:p-3 glass rounded-lg hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
            © {new Date().getFullYear()} AbdelRahman Sobhy. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500" /> by AbdelRahman
            Sobhy
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

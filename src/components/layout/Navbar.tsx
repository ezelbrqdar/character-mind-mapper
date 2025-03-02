
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brain, User, ChartBar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Change navbar appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { name: "الرئيسية", path: "/", icon: <Brain className="h-4 w-4 mr-1" /> },
    { name: "الاختبارات", path: "/tests", icon: <ChartBar className="h-4 w-4 mr-1" /> },
    { name: "الدردشة", path: "/chat", icon: <MessageSquare className="h-4 w-4 mr-1" /> },
    { name: "نتائجي", path: "/results", icon: <User className="h-4 w-4 mr-1" /> },
  ];

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300 backdrop-blur-md",
        scrolled
          ? "bg-background/80 border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className="flex items-center gap-2 font-bold text-xl text-foreground"
          >
            <Brain className="h-6 w-6 text-primary" />
            <span>تحليل الشخصية</span>
          </Link>
          
          <nav className="flex items-center space-x-4 text-sm font-medium md:space-x-6 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors hover:text-primary",
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70"
                )}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            تسجيل الدخول
          </Button>
          <Button size="sm">
            ابدأ مجاناً
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;

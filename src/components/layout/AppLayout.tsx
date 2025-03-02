
import React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

interface AppLayoutProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <motion.main
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="flex-1 container mx-auto px-4 py-8 max-w-6xl"
      >
        {children}
      </motion.main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          تحليل الشخصية © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;

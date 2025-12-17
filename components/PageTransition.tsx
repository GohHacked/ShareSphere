import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(10px)' }}
    animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, scale: 1.05, y: -20, filter: 'blur(10px)' }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // smooth easeOutQuint-ish
    className={`flex flex-col h-full ${className}`}
  >
    {children}
  </motion.div>
);
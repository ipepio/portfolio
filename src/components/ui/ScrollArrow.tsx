import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface ScrollArrowProps {
  targetId: string;
}

export default function ScrollArrow({ targetId }: ScrollArrowProps) {
  const { theme } = useTheme();
  
  const scrollToSection = () => {
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      style={{
        position: "absolute",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "2.5rem",
        height: "2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <motion.div
        onClick={scrollToSection}
        initial={{ opacity: 0, y: 0 }}
        animate={{ 
          opacity: 1,
          y: [0, 10, 0],
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          repeatType: "loop",
          ease: "easeInOut"
        }}
        className={`scroll-arrow ${theme}`}
        style={{
          fontSize: "2rem",
          cursor: "pointer",
          color: theme === "light" ? "var(--color-muted-light)" : "var(--color-muted-dark)",
          transition: "color 0.3s ease, transform 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%"
        }}
        whileHover={{
          color: theme === "light" ? "var(--color-primary-light)" : "var(--color-primary-dark)",
        }}
      >
        ↓
      </motion.div>
    </div>
  );
}
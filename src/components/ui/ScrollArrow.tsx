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
    <motion.div
      onClick={scrollToSection}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      className={`scroll-arrow ${theme}`}
      style={{
        position: "absolute",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "2rem",
        cursor: "pointer",
        color: theme === "light" ? "var(--color-muted-light)" : "var(--color-muted-dark)",
        transition: "color 0.3s ease",
      }}
      whileHover={{
        color: theme === "light" ? "var(--color-primary-light)" : "var(--color-primary-dark)",
        scale: 1.2
      }}
    >
      ↓
    </motion.div>
  );
}
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import "./Background.css";

const Background = () => {
  const { theme } = useTheme();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0.4);
  const [colorHue, setColorHue] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  interface TrailPosition {
    x: number;
    y: number;
    opacity: number;
    hue: number;
  }
  
  const [trailPositions, setTrailPositions] = useState<TrailPosition[]>([]);
  
  // Usar refs para los intervalos para evitar su recreación
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const colorIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const moveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Efecto para cambiar el color continuamente
  useEffect(() => {
    colorIntervalRef.current = setInterval(() => {
      setColorHue(prev => (prev + 1) % 360);
    }, 50);

    return () => {
      if (colorIntervalRef.current) {
        clearInterval(colorIntervalRef.current);
      }
    };
  }, []);

  // Efecto para manejar la disminución continua de la opacidad
  useEffect(() => {
    const startFading = () => {
      // Limpiar intervalo anterior si existe
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      
      fadeIntervalRef.current = setInterval(() => {
        setOpacity(prev => {
          if (prev <= 0.01) {
            return 0;
          }
          return prev - 0.01;
        });
        
        // También reducir la opacidad de la estela
        setTrailPositions(prev => 
          prev
            .map(point => ({
              ...point,
              opacity: Math.max(0, point.opacity - 0.01)
            }))
            .filter(point => point.opacity > 0)
        );
      }, 50);
    };
    
    // Iniciar el desvanecimiento inmediatamente
    startFading();
    
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  // Efecto para manejar el movimiento del cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPosition: { x: number; y: number } = { x: e.clientX, y: e.clientY };
      setPosition(newPosition);
      setOpacity(0.4); // Restaurar opacidad cuando se mueve
      setIsMoving(true);
      
      // Añadir la posición actual a las posiciones de la estela
      setTrailPositions(prev => {
      const newTrail: TrailPosition[] = [...prev, { ...newPosition, opacity: 0.3, hue: colorHue }];
      return newTrail.slice(-5); // Mantener solo las últimas 5 posiciones
      });
      
      // Limpiar el timeout anterior
      if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
      }
      
      // Configurar un nuevo timer para detectar cuando el cursor se detiene
      moveTimeoutRef.current = setTimeout(() => {
      setIsMoving(false);
      }, 100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, [colorHue]);

  return (
    <div className={`background ${theme}`}>
      {/* Renderizar la estela */}
      {trailPositions.map((point, index) => (
        <CursorEffect 
          key={`trail-${index}`}
          x={point.x} 
          y={point.y} 
          opacity={point.opacity} 
          hue={point.hue}
          isMoving={false}
          size={220 - (index * 15)}
          blur={10 - (index * 1)}
        />
      ))}
      
      {/* Efecto principal */}
      <CursorEffect 
        x={position.x} 
        y={position.y} 
        opacity={opacity} 
        hue={colorHue}
        isMoving={isMoving}
        size={250}
        blur={10}
      />
    </div>
  );
};

interface CursorEffectProps {
  x: number;
  y: number;
  opacity: number;
  hue: number;
  isMoving: boolean;
  size: number;
  blur: number;
}

const CursorEffect = ({ x, y, opacity, hue, isMoving, size, blur }: CursorEffectProps) => {
  return (
    <div
      className="cursor-effect"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        opacity: opacity,
        background: `radial-gradient(circle, hsla(${hue}, 100%, 70%, ${opacity}) 0%, hsla(${hue}, 100%, 60%, ${opacity * 0.6}) 40%, hsla(${hue}, 100%, 50%, 0) 80%)`,
        width: `${size}px`, 
        height: `${size}px`,
        filter: `blur(${blur}px)`,
        transform: `translate(-50%, -50%) scale(${isMoving ? 1.1 : 1})`,
        transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
      }}
    />
  );
};

export default Background;
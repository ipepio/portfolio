import React from "react";
import "./Progress.css"; // Importamos los estilos

interface ProgressProps {
  value: number; // Valor de progreso (0-100)
}

const Progress: React.FC<ProgressProps> = ({ value }) => {
  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${value}%` }} />
    </div>
  );
};

export default Progress;

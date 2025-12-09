import React from 'react';

interface KidButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  colorClass?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const KidButton: React.FC<KidButtonProps> = ({ 
  onClick, 
  children, 
  colorClass = "bg-blue-500 hover:bg-blue-400", 
  size = 'md',
  disabled = false
}) => {
  const sizeClasses = {
    sm: "p-2 text-lg min-w-[100px]",
    md: "p-4 text-2xl min-w-[200px]",
    lg: "p-8 text-4xl min-w-[300px]"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${colorClass} 
        ${sizeClasses[size]}
        text-white font-bold rounded-3xl shadow-[0_6px_0_rgb(0,0,0,0.2)] 
        active:shadow-[0_2px_0_rgb(0,0,0,0.2)] active:translate-y-1 
        transition-all transform duration-150
        flex items-center justify-center gap-3
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  );
};

export default KidButton;

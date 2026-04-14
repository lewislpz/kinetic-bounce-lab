import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface BallState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface PhysicsBallProps {
  gravity: number;
  elasticity: number;
  friction: number;
  mass: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
}

export const PhysicsBall: React.FC<PhysicsBallProps> = ({ 
  gravity, 
  elasticity, 
  friction, 
  mass,
  color,
  size,
  shape
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ball, setBall] = useState<BallState>({ x: 100, y: 100, vx: 5, vy: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const requestRef = useRef<number>(null);
  
  const ballSize = size;

  const updatePhysics = () => {
    if (isDragging) return;

    setBall((prev) => {
      if (!containerRef.current) return prev;

      const { width, height } = containerRef.current.getBoundingClientRect();
      
      let nextVx = prev.vx * friction;
      let nextVy = prev.vy + gravity;
      let nextX = prev.x + nextVx;
      let nextY = prev.y + nextVy;

      // Floor collision
      if (nextY + ballSize > height) {
        nextY = height - ballSize;
        nextVy = -nextVy * elasticity;
        // Add some horizontal friction when touching ground
        nextVx *= 0.95;
      }

      // Ceiling collision
      if (nextY < 0) {
        nextY = 0;
        nextVy = -nextVy * elasticity;
      }

      // Wall collisions
      if (nextX + ballSize > width) {
        nextX = width - ballSize;
        nextVx = -nextVx * elasticity;
      }
      if (nextX < 0) {
        nextX = 0;
        nextVx = -nextVx * elasticity;
      }

      // Stop tiny movements to prevent jitter
      if (Math.abs(nextVy) < 0.1 && nextY + ballSize >= height - 1) {
        nextVy = 0;
      }

      return { x: nextX, y: nextY, vx: nextVx, vy: nextVy };
    });

    requestRef.current = requestAnimationFrame(updatePhysics);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isDragging, gravity, elasticity, friction]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - rect.left - ballSize / 2;
    const newY = clientY - rect.top - ballSize / 2;
    
    setBall(prev => ({
      x: newX,
      y: newY,
      vx: (newX - prev.x) * 0.5, // Throw velocity based on movement
      vy: (newY - prev.y) * 0.5
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getShapeStyles = () => {
    switch (shape) {
      case 'square':
        return 'rounded-lg';
      case 'triangle':
        return 'clip-triangle';
      default:
        return 'rounded-full';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full cursor-crosshair overflow-hidden bg-transparent"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Motion Arc (Visual only) */}
      <div className="absolute left-1/2 bottom-[80px] w-[300px] h-[400px] -translate-x-1/2 border-2 border-dashed border-grid border-bottom-0 rounded-t-[150px] opacity-30 pointer-events-none" />

      <motion.div
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{
          x: ball.x,
          y: ball.y,
          width: ballSize,
          height: ballSize,
        }}
        className="absolute cursor-grab active:cursor-grabbing z-10"
      >
        {/* The Ball Visual */}
        {shape === 'triangle' ? (
          <div 
            className="w-full h-full shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
            style={{ 
              backgroundColor: color,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }} 
          />
        ) : (
          <div 
            className={`w-full h-full ${getShapeStyles()} shadow-[0_4px_12px_rgba(0,0,0,0.2)]`}
            style={{ backgroundColor: color }} 
          />
        )}
        
        {/* Shadow on the ground (simulated) */}
        <div 
          className="absolute -bottom-[100px] left-1/2 -translate-x-1/2 w-[40px] h-[8px] bg-black/10 blur-[1px] rounded-full transition-opacity pointer-events-none"
          style={{
            opacity: Math.max(0, 1 - (ball.y / 500)),
            transform: `translateX(-50%) scale(${Math.max(0.5, 1 - (ball.y / 1000))})`
          }}
        />
      </motion.div>

      {/* Current State Overlay */}
      <div className="absolute top-8 left-10 border-l-2 border-accent pl-4 pointer-events-none">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Current State</div>
        <div className="text-2xl font-light text-text-main">
          Kinetic Energy: {(0.5 * mass * (ball.vx**2 + ball.vy**2)).toFixed(1)} J
        </div>
      </div>
    </div>
  );
};

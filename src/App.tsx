import React, { useState } from 'react';
import { VectorBackground } from './components/VectorBackground';
import { PhysicsBall } from './components/PhysicsBall';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';

const CELESTIAL_PRESETS = [
  { name: 'Mercury', g: 0.226, e: 0.7, f: 0.998 },
  { name: 'Venus', g: 0.542, e: 0.6, f: 0.98 },
  { name: 'Earth', g: 0.6, e: 0.75, f: 0.995 },
  { name: 'Moon', g: 0.099, e: 0.85, f: 0.999 },
  { name: 'Mars', g: 0.227, e: 0.75, f: 0.997 },
  { name: 'Jupiter', g: 1.516, e: 0.4, f: 0.95 },
  { name: 'Saturn', g: 0.638, e: 0.5, f: 0.96 },
  { name: 'Uranus', g: 0.531, e: 0.6, f: 0.97 },
  { name: 'Neptune', g: 0.682, e: 0.6, f: 0.97 },
  { name: 'ISS', g: 0.0001, e: 0.95, f: 1.0 },
];

export default function App() {
  const [gravity, setGravity] = useState(0.6);
  const [elasticity, setElasticity] = useState(0.75);
  const [mass, setMass] = useState(1.2);
  const [friction, setFriction] = useState(0.995);
  const [resetKey, setResetKey] = useState(0);
  
  // Customization state
  const [color, setColor] = useState('#2a6df5');
  const [size, setSize] = useState(60);
  const [shape, setShape] = useState<'circle' | 'square' | 'triangle'>('circle');

  const handleReset = () => {
    setResetKey(prev => prev + 1);
  };

  const applyPreset = (preset: typeof CELESTIAL_PRESETS[0]) => {
    setGravity(preset.g);
    setElasticity(preset.e);
    setFriction(preset.f);
    handleReset();
  };

  return (
    <div className="h-screen w-full flex flex-col bg-bg text-text-main font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 px-10 border-b border-border flex items-center justify-between bg-panel-bg shrink-0">
        <div className="text-lg font-bold tracking-tight flex items-center gap-2">
          KINETIC<span className="text-accent">LAB</span>
        </div>
        <div className="text-[12px] text-text-muted font-medium uppercase tracking-wider">
          VERSION 2.4.0 &nbsp;•&nbsp; VECTOR RENDERING ACTIVE
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 grid grid-cols-[1fr_320px] overflow-hidden">
        {/* Viewport */}
        <main className="relative bg-white overflow-hidden">
          <VectorBackground />
          <PhysicsBall 
            key={resetKey}
            gravity={gravity} 
            elasticity={elasticity} 
            friction={friction} 
            mass={mass}
            color={color}
            size={size}
            shape={shape}
          />
        </main>

        {/* Sidebar */}
        <aside className="border-l border-border p-6 bg-panel-bg flex flex-col gap-6 overflow-y-auto">
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Celestial Presets</h2>
            <div className="grid grid-cols-2 gap-2">
              {CELESTIAL_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider border border-border rounded hover:bg-accent hover:text-white hover:border-accent transition-all active:scale-95"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </section>

          <div className="h-px bg-border w-full" />

          <section className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">Customization</h2>
            
            {/* Shape Selection */}
            <div className="flex gap-2">
              {(['circle', 'square', 'triangle'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider border rounded transition-all ${shape === s ? 'bg-text-main text-white border-text-main' : 'border-border hover:bg-gray-50'}`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Color Selection */}
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Color</span>
              <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-6 rounded cursor-pointer border-none bg-transparent"
              />
            </div>

            {/* Size Control */}
            <ControlGroup 
              label="Size" 
              value={`${size}px`} 
              min={20} 
              max={120} 
              step={1} 
              currentValue={size} 
              onChange={setSize} 
            />
          </section>

          <div className="h-px bg-border w-full" />

          <section className="space-y-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">Manual Controls</h2>
            <ControlGroup 
              label="Gravity (g)" 
              value={`${(gravity * 16.35).toFixed(2)} m/s²`} 
              min={0} 
              max={2} 
              step={0.01} 
              currentValue={gravity} 
              onChange={setGravity} 
            />
            <ControlGroup 
              label="Elasticity (e)" 
              value={elasticity.toFixed(2)} 
              min={0} 
              max={1} 
              step={0.01} 
              currentValue={elasticity} 
              onChange={setElasticity} 
            />
            <ControlGroup 
              label="Mass (m)" 
              value={`${mass.toFixed(2)} kg`} 
              min={0.5} 
              max={5} 
              step={0.1} 
              currentValue={mass} 
              onChange={setMass} 
            />
            <ControlGroup 
              label="Air Friction" 
              value={((1 - friction) * 100).toFixed(2) + "%"} 
              min={0.9} 
              max={1} 
              step={0.001} 
              currentValue={friction} 
              onChange={setFriction} 
            />
          </section>

          <button 
            onClick={handleReset}
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-text-main text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-all active:scale-95"
          >
            <RotateCcw size={16} />
            RESET SIMULATION
          </button>

          <div className="mt-auto border border-dashed border-grid p-4 rounded-lg">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">Vector Diagnostics</div>
            <div className="font-mono text-[10px] leading-relaxed opacity-70">
              g_const: {gravity.toFixed(3)}<br />
              e_coeff: {elasticity.toFixed(3)}<br />
              m_val: {mass.toFixed(2)}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

interface ControlGroupProps {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  currentValue: number;
  onChange: (val: number) => void;
}

function ControlGroup({ label, value, min, max, step, currentValue, onChange }: ControlGroupProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{label}</span>
        <span className="font-mono text-[12px] text-text-main bg-[#f1f5f9] px-1.5 py-0.5 rounded">{value}</span>
      </div>
      <div className="relative flex items-center group">
        <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-[#e2e8f0] rounded-full appearance-none cursor-pointer accent-accent hover:bg-[#cbd5e1] transition-colors"
        />
        <style>{`
          input[type=range]::-webkit-slider-thumb {
            appearance: none;
            width: 14px;
            height: 14px;
            background: var(--color-accent);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: 2px solid white;
          }
          input[type=range]::-moz-range-thumb {
            width: 14px;
            height: 14px;
            background: var(--color-accent);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: 2px solid white;
          }
        `}</style>
      </div>
    </div>
  );
}

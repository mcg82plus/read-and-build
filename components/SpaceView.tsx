import React, { useState, useRef, useEffect } from 'react';
import { SpaceType, Item, AvatarConfig } from '../types';
import { Avatar } from './Avatar';

interface SpaceViewProps {
  spaceType: SpaceType;
  items: Item[];
  avatarConfig: AvatarConfig;
  coins: number;
  onReadClick: () => void;
  onItemUpdate: (updatedItems: Item[]) => void;
}

export const SpaceView: React.FC<SpaceViewProps> = ({ spaceType, items, avatarConfig, coins, onReadClick, onItemUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [localItems, setLocalItems] = useState<Item[]>(items);

  // Sync local items with props when props change (but not while dragging)
  useEffect(() => {
    if (!draggingItemId) {
      setLocalItems(items);
    }
  }, [items, draggingItemId]);

  const getBackgroundClass = () => {
    switch (spaceType) {
      case 'ROOM': return 'bg-amber-100';
      case 'ISLAND': return 'bg-sky-300';
      case 'SPACESHIP': return 'bg-slate-900';
      default: return 'bg-white';
    }
  };

  const handlePointerDown = (e: React.PointerEvent, itemId: string) => {
    e.preventDefault();
    setDraggingItemId(itemId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingItemId || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp values to keep inside screen roughly
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(90, y));

    setLocalItems(prev => prev.map(item => 
      item.id === draggingItemId ? { ...item, x: clampedX, y: clampedY } : item
    ));
  };

  const handlePointerUp = () => {
    if (draggingItemId) {
      setDraggingItemId(null);
      onItemUpdate(localItems);
    }
  };

  const renderBackgroundElements = () => {
    if (spaceType === 'ROOM') {
      return (
        <>
          <div className="absolute bottom-0 w-full h-1/3 bg-amber-200 border-t-4 border-amber-300" />
          <div className="absolute top-10 left-10 w-32 h-48 bg-sky-200 border-8 border-white rounded-lg overflow-hidden shadow-inner">
             <div className="w-full h-1 bg-white absolute top-1/2" />
             <div className="h-full w-1 bg-white absolute left-1/2" />
             <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-300 rounded-full opacity-80" />
          </div>
          <div className="absolute top-20 right-20 w-24 h-32 bg-orange-900 rounded shadow-lg" />
          {/* Rug */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-400 rounded-full opacity-30 transform scale-y-50" />
        </>
      );
    }
    if (spaceType === 'ISLAND') {
      return (
        <>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-b from-sky-400 to-sky-600" /> 
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 bg-yellow-200 rounded-t-[100%] border-t-8 border-yellow-300" /> 
          <div className="absolute top-10 right-10 animate-pulse-slow">
            <div className="w-20 h-20 bg-yellow-400 rounded-full shadow-[0_0_60px_rgba(255,200,0,0.8)] blur-sm" />
            <div className="absolute inset-0 w-20 h-20 bg-yellow-300 rounded-full" />
          </div>
          {/* Cloud */}
          <div className="absolute top-20 left-20 w-32 h-12 bg-white rounded-full opacity-80 animate-float" />
        </>
      );
    }
    if (spaceType === 'SPACESHIP') {
      return (
        <>
          <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          <div className="absolute bottom-0 w-full h-1/4 bg-slate-700 border-t-4 border-slate-500" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2/3 h-2/3 border-4 border-slate-600 rounded-full opacity-20 bg-gradient-to-b from-black to-transparent" /> 
          {/* Planet */}
          <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-purple-500 shadow-inner border-4 border-purple-400 opacity-80" />
        </>
      );
    }
    return null;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${getBackgroundClass()} transition-colors duration-1000 touch-none select-none`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {renderBackgroundElements()}

      {/* Coin Display - Top Left */}
      <div className="absolute top-6 left-6 z-50 bg-white/90 backdrop-blur border-4 border-yellow-400 rounded-full px-6 py-2 shadow-xl flex items-center gap-3 transform hover:scale-105 transition-transform">
        <span className="text-3xl drop-shadow-sm">🪙</span>
        <span className="text-2xl font-black text-yellow-600">{coins}</span>
      </div>

      {/* Placed Items (Draggable) */}
      {localItems.map((item) => (
        <div
          key={item.id}
          className={`absolute cursor-grab active:cursor-grabbing hover:scale-110 transition-transform ${draggingItemId === item.id ? 'scale-125 z-50 drop-shadow-2xl' : 'z-20'}`}
          style={{ 
            left: `${item.x}%`, 
            top: `${item.y}%`,
            transform: 'translate(-50%, -50%)',
            touchAction: 'none'
          }}
          onPointerDown={(e) => handlePointerDown(e, item.id)}
          title={item.name}
        >
          <div className="text-6xl filter drop-shadow-lg animate-float" style={{ animationDelay: draggingItemId === item.id ? '0s' : `${Math.random() * 2}s`, animationDuration: draggingItemId === item.id ? '0s' : '6s' }}>
            {item.emoji}
          </div>
        </div>
      ))}

      {/* Avatar - Full Body Centered Bottom */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-40 h-80 z-10 pointer-events-none">
        <Avatar config={avatarConfig} />
      </div>

      {/* Action Button - Enhanced Attractive Design */}
      <div className="absolute bottom-8 right-8 z-50">
        <button
          onClick={onReadClick}
          className="group relative bg-gradient-to-r from-secondary to-teal-400 text-white font-black py-4 px-12 rounded-full shadow-[0_10px_20px_rgba(78,205,196,0.5)] border-b-4 border-teal-600 active:border-b-0 active:translate-y-1 transition-all text-2xl flex items-center gap-3 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,230,109,0.8)] animate-pulse-slow"
        >
          {/* Glowing effect */}
          <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping opacity-20"></div>
          
          <span className="text-4xl drop-shadow-md group-hover:rotate-12 transition-transform">📖</span>
          <span className="drop-shadow-md tracking-wide">OKU (READ)</span>
        </button>
      </div>
    </div>
  );
};
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Layers, 
  Rotate3d, 
  Info, 
  ShoppingBag, 
  RefreshCw, 
  Maximize2, 
  Sliders, 
  Flame, 
  Check, 
  Plus, 
  Minus,
  Heart,
  HelpCircle,
  Eye,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Product } from '../types';

interface InteractiveCake3DProps {
  onAddToCart: (product: Product, options: { size?: string; sweetness?: string; temp?: string }) => void;
  onAddedAnimation?: () => void;
}

type CakeShape = 'square' | 'slice' | 'round';
type LayerPreset = 'classic-matcha' | 'autumn-chestnut' | 'sea-salt-mousse';

export default function InteractiveCake3D({ onAddToCart, onAddedAnimation }: InteractiveCake3DProps) {
  // Shape and structural state
  const [shape, setShape] = useState<CakeShape>('square');
  const [layersCount, setLayersCount] = useState<number>(5); // 3 to 7 layers
  const [exploded, setExploded] = useState<boolean>(false); // 3D exploded view
  
  // Customization state
  const [creamColor, setCreamColor] = useState<string>('deep-matcha'); // deep-matcha, sweet-chestnut, salted-cheese
  const [baseCrust, setBaseCrust] = useState<string>('oreo-charcoal'); // oreo-charcoal, butter-cookie, matcha-chiffon
  const [toppings, setToppings] = useState<string[]>(['chestnut', 'gold-foil']); // chestnut, strawberry, gold-foil, macaron, matcha-poudre
  const [sugarLevel, setSugarLevel] = useState<number>(30); // 10%, 30%, 50%
  const [creamThickness, setCreamThickness] = useState<number>(1.2); // 0.8x to 1.8x
  
  // Interaction/Orbit State
  const [rotateY, setRotateY] = useState<number>(-45);
  const [rotateX, setRotateX] = useState<number>(-22);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1.1); // Dynamic zoom slider
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  // Keyboard Arrow controls for rotating the 3D cake model
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Prevent page scrolling
        setPressedKey(e.key);

        if (e.key === 'ArrowLeft') {
          setRotateY(prev => (prev - 7) % 360);
        } else if (e.key === 'ArrowRight') {
          setRotateY(prev => (prev + 7) % 360);
        } else if (e.key === 'ArrowUp') {
          setRotateX(prev => Math.min(20, Math.max(-65, prev + 5)));
        } else if (e.key === 'ArrowDown') {
          setRotateX(prev => Math.min(20, Math.max(-65, prev - 5)));
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setPressedKey(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Advanced 3D Engine configuration parameters
  const [lightAngle, setLightAngle] = useState<number>(135); // Real-time directional lighting angle
  const [wireframe, setWireframe] = useState<boolean>(false); // 3D structural outline grid
  const [creamDrips, setCreamDrips] = useState<boolean>(true); // Decorative gravity-dripping frosting
  
  const [showIngredientsGuide, setShowIngredientsGuide] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const dragStartRef = useRef({ x: 0, y: 0, rx: 0, ry: 0 });
  const cakeContainerRef = useRef<HTMLDivElement>(null);

  // Math-based Dynamic Lighting engine for standard CSS 3D
  const getFaceShadeStyle = (normalAngleDeg: number, baseStylePattern: string) => {
    if (wireframe) {
      return {
        background: 'transparent',
        border: '1.5px solid rgba(92, 99, 63, 0.45)',
        backgroundImage: 'linear-gradient(45deg, rgba(92, 99, 63, 0.1) 25%, transparent 25%, transparent 75%, rgba(92, 99, 63, 0.1) 75%)',
        backgroundSize: '8px 8px',
        opacity: 0.65
      };
    }
    
    // Convert angles to radians
    const lightRad = (lightAngle * Math.PI) / 180;
    const faceRad = (normalAngleDeg * Math.PI) / 180;
    
    // Light vector (moving primarily in flat azimuthal plane)
    const lx = Math.cos(lightRad);
    const lz = Math.sin(lightRad);
    
    // Face plane normal vector
    const fx = Math.cos(faceRad);
    const fz = Math.sin(faceRad);
    
    // Shading factor through scalar dot-product [-1, 1]
    const dot = fx * lx + fz * lz;
    
    // Map dot product from [-1, 1] range into [65%, 132%] brightness scale for gorgeous high-contrast depth shadow
    const brightness = 98 + Math.round(dot * 34);
    
    return {
      backgroundImage: baseStylePattern,
      filter: `brightness(${brightness}%) contrast(104%)`,
      transition: 'filter 0.2s ease-out'
    };
  };

  // Auto slow rotation when not dragging
  useEffect(() => {
    if (isDragging) return;
    
    const interval = setInterval(() => {
      setRotateY(prev => (prev + 0.22) % 360);
    }, 30);
    
    return () => clearInterval(interval);
  }, [isDragging]);

  // Drag listeners
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rx: rotateX,
      ry: rotateY
    };
    if (cakeContainerRef.current) {
      cakeContainerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    
    // Adjust rotation speed modifier
    setRotateY(dragStartRef.current.ry + deltaX * 0.7);
    setRotateX(Math.max(-65, Math.min(20, dragStartRef.current.rx - deltaY * 0.7)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (cakeContainerRef.current) {
      cakeContainerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  // Pre-configured premium presets
  const applyPreset = (preset: LayerPreset) => {
    if (preset === 'classic-matcha') {
      setShape('square');
      setLayersCount(5);
      setCreamColor('deep-matcha');
      setBaseCrust('matcha-chiffon');
      setToppings(['matcha-poudre', 'gold-foil']);
      setSugarLevel(30);
      setCreamThickness(1.2);
    } else if (preset === 'autumn-chestnut') {
      setShape('square');
      setLayersCount(6);
      setCreamColor('sweet-chestnut');
      setBaseCrust('butter-cookie');
      setToppings(['chestnut', 'gold-foil', 'macaron']);
      setSugarLevel(30);
      setCreamThickness(1.4);
    } else if (preset === 'sea-salt-mousse') {
      setShape('slice');
      setLayersCount(4);
      setCreamColor('salted-cheese');
      setBaseCrust('oreo-charcoal');
      setToppings(['strawberry', 'matcha-poudre']);
      setSugarLevel(10);
      setCreamThickness(1.0);
    }
  };

  const toggleTopping = (id: string) => {
    if (toppings.includes(id)) {
      setToppings(prev => prev.filter(t => t !== id));
    } else {
      if (toppings.length < 5) {
        setToppings(prev => [...prev, id]);
      }
    }
  };

  // Calculated custom specs
  const getCalculation = () => {
    const basePrice = 48;
    const layerCost = (layersCount - 3) * 6;
    const toppingCost = toppings.length * 5;
    const thicknessPremium = creamThickness > 1.2 ? 4 : 0;
    const price = basePrice + layerCost + toppingCost + thicknessPremium;

    // Nutrition estimates
    const matchaConcentration = creamColor === 'deep-matcha' ? 85 : creamColor === 'sweet-chestnut' ? 30 : 55;
    const calories = 180 + (layersCount * 22) + (toppings.length * 15) + Math.round((creamThickness - 1.0) * 35);
    const fiber = creamColor === 'sweet-chestnut' ? '高（秋栗纤维）' : '中等';

    return { price, calories, matchaConcentration, fiber };
  };

  const { price, calories, matchaConcentration, fiber } = getCalculation();

  // Return strings for metadata creation
  const getIngredientDescription = () => {
    const shapeLabel = shape === 'square' ? '方形歌剧院' : shape === 'slice' ? '经典三角千层' : '圆形和印';
    const colorLabel = creamColor === 'deep-matcha' ? '特浓宇治抹茶霜' : creamColor === 'sweet-chestnut' ? '炭焙糖心栗子泥' : '喜马拉雅海盐芝士奶盖';
    const baseLabel = baseCrust === 'oreo-charcoal' ? '竹炭奥利奥酥底' : baseCrust === 'butter-cookie' ? '焦香牛油酥饼底' : '宇治纯茶戚风蛋糕胚';
    const toppingLabels = toppings.map(t => {
      if (t === 'chestnut') return '炭火蜜栗';
      if (t === 'strawberry') return '极美草莓';
      if (t === 'gold-foil') return '可食用纯金箔';
      if (t === 'macaron') return '和风抹茶马卡龙';
      if (t === 'candle') return '庆典温和蜡烛';
      return '浓密抹茶粉';
    }).join('、');

    return { shapeLabel, colorLabel, baseLabel, toppingLabels };
  };

  // Directly bind customization parameters into actual store Product instance
  const handleAddCustomToCart = () => {
    const { shapeLabel, colorLabel, baseLabel, toppingLabels } = getIngredientDescription();
    
    // Fully functional conversion to dynamic product
    const customProduct: Product = {
      id: `custom-3d-cake-${Date.now()}`,
      name: `【3D大师定制】${colorLabel}${shapeLabel}`,
      enName: `Interactive 3D Matcha Masterpiece`,
      price: price,
      originalPrice: price + 10, // Show savings
      category: 'cakes',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxiFCdfPxAE2gBeM8kL8VEye6iheRUTGeEPOUnFx0_EAVWHhWyss_acODNzqnkT-AXmbLvxo5UY0-FrhakvAFeoYTy44TI9Q-p6--d94mbaH7gk9H_ubREbCM4kN3ocWAgp5q5RtbrBtvzks_cY-8mzZ9vhejFLU3wj6uJLrAny2zRRjk-HQBv1IcuHgK6286Ry7oZrThpCAb7ZLGxisz3RV5IKRAOGsU9G7uu9OfpaPAI1UzsAztZZpa65mKves4lc-dGe4I-cb4w',
      description: `工艺细节：${layersCount}层精工堆叠，选用「${colorLabel}」为主调，结合「${baseLabel}」，顶饰「${toppingLabels || '轻羽抹茶粉'}」。主厨特制${sugarLevel}%低卡控糖。`,
      tags: ['3D大师定制', '主厨独创', '鲜采制作'],
      details: {
        ingredients: `纯手工高精调配。精选A级宇治抹茶粉、${baseLabel}原料、无反式脂肪奶油及${toppingLabels || '抹茶洒粉'}。`,
        calories: `${calories} kcal / 100g`,
        sugar: `${sugarLevel}% 专属控糖`
      },
      subImages: [],
      pairingIds: ['ceremonial-matcha', 'cold-brew-tea'],
      rating: 5.0,
      reviewsCount: 1,
      reviews: []
    };

    onAddToCart(customProduct, {
      size: `${layersCount}层立创主厨版`,
      sweetness: `${sugarLevel}% 微调控糖`,
      temp: '标准温存（推荐）'
    });

    setJustAdded(true);
    if (onAddedAnimation) onAddedAnimation();
    setTimeout(() => setJustAdded(false), 2500);
  };

  // Color mapping variables for elegant styling
  const creamHexMap: Record<string, string> = {
    'deep-matcha': '#5C633F',     // Deep matcha cream
    'sweet-chestnut': '#9E7A5A',   // Chestnut sand
    'salted-cheese': '#F7F4EB',    // Cream/soft light-yellow
  };

  const creamLightHexMap: Record<string, string> = {
    'deep-matcha': '#8A9A5B',     // Lighter green
    'sweet-chestnut': '#B8977A',   // Lighter chestnut
    'salted-cheese': '#FFFDF9',    // Softest cream
  };

  const crustHexMap: Record<string, string> = {
    'oreo-charcoal': '#232323',    // Dark charcoal
    'butter-cookie': '#DEB887',    // Classic tan biscuit
    'matcha-chiffon': '#7D8B55',   // Moss green chiffon
  };

  const activeCreamColorValue = creamHexMap[creamColor];
  const activeCreamLightValue = creamLightHexMap[creamColor];
  const activeCrustValue = crustHexMap[baseCrust];

  return (
    <div className="w-full bg-white rounded-3xl border border-[#c4c8b7]/40 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[580px]">
      {/* LEFT PANEL: The Immersive Interactive 3D Canvas */}
      <div 
        ref={cakeContainerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full md:w-7/12 bg-gradient-to-b from-[#F2F1EC] to-[#E9E7DF] relative flex flex-col items-center justify-center p-6 md:p-8 select-none overflow-hidden touch-none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Decorative Floating Tea Mist Tag */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 z-20 pointer-events-none">
          <span className="text-[10px] font-mono tracking-widest text-[#5C633F] font-bold uppercase bg-white/60 backdrop-blur-xs px-2.5 py-1 rounded-full">
            🍵 Real-time Interactive 3D Lab
          </span>
          <span className="text-[9px] text-gray-500 font-sans pl-1 font-semibold dark:text-neutral-400">
            可拖拽旋转，或使用键盘方向键 ↑ ↓ ← → 控制
          </span>
        </div>

        {/* Floating Zoom & Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20 pointer-events-auto">
          <button 
            type="button"
            onClick={() => setExploded(prev => !prev)}
            className={`p-2 rounded-xl border transition-all duration-300 shadow-xs flex items-center gap-1 cursor-pointer text-xs font-serif ${
              exploded 
                ? 'bg-[#5C633F] text-white border-[#5C633F]' 
                : 'bg-white text-primary border-[#c4c8b7]/40 hover:bg-surface-beige/30'
            }`}
            title="3D层层拆解剖析"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{exploded ? '重组' : '拆解'}</span>
          </button>
          
          <button 
            type="button"
            onClick={() => { setRotateX(-22); setRotateY(-45); setZoom(1.1); }}
            className="p-2 bg-white text-primary border border-[#c4c8b7]/40 rounded-xl hover:bg-surface-beige/30 transition-colors shadow-xs cursor-pointer"
            title="重置视角"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive 3D Orbit Compass (Visual D-pad with Arrow Key Bindings) */}
        <div className="absolute bottom-4 left-4 flex flex-col items-center gap-1.5 z-20 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-[#c4c8b7]/45 shadow-lg pointer-events-auto">
          <span className="text-[8px] font-mono tracking-widest text-[#5C633F] font-bold uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
            3D ORBIT KEYPAD
          </span>
          
          <div className="grid grid-cols-3 gap-1.5 w-28 h-28 relative select-none">
            {/* Top row */}
            <div></div>
            <button
              type="button"
              onClick={() => setRotateX(prev => Math.min(20, Math.max(-65, prev + 8)))}
              className={`p-0.5 flex items-center justify-center rounded-xl border border-[#c4c8b7]/40 transition-all duration-150 cursor-pointer ${
                pressedKey === 'ArrowUp'
                  ? 'bg-[#5C633F] text-white scale-90 shadow-inner'
                  : 'bg-white hover:bg-[#F2F1EC] text-primary'
              }`}
              title="向上仰视 (↑)"
            >
              <div className="relative flex items-center justify-center w-full h-full">
                <svg className="w-8 h-8 transform rotate-0 transition-transform hover:scale-110" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18 L20 18 L16 28 Z" fill="#D29B52" stroke="#8C5C23" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M14 18 L18 24" stroke="#B87C31" strokeWidth="1"/>
                  <path d="M10 18 C8 18 8 15 11 14 C12 13 20 13 21 14 C24 15 24 18 22 18 Z" fill="#8A9A5B" stroke="#5C633F" strokeWidth="1.5" />
                  <path d="M11 14 C10 14 10 11 13 11 C14 10 18 10 19 11 C22 11 22 14 21 14 Z" fill="#9FB46C" stroke="#5C633F" strokeWidth="1.5" />
                  <path d="M13 11 C13 8 16 6 16 6 C16 6 19 8 19 11 Z" fill="#B4CB7E" stroke="#5C633F" strokeWidth="1.5" />
                  <circle cx="16" cy="5" r="2.5" fill="#e11d48" />
                </svg>
                <ArrowUp className="w-3.5 h-3.5 text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)] absolute font-black" />
              </div>
            </button>
            <div></div>

            {/* Middle row */}
            <button
              type="button"
              onClick={() => setRotateY(prev => (prev - 12) % 360)}
              className={`p-0.5 flex items-center justify-center rounded-xl border border-[#c4c8b7]/40 transition-all duration-150 cursor-pointer ${
                pressedKey === 'ArrowLeft'
                  ? 'bg-[#5C633F] text-white scale-90 shadow-inner'
                  : 'bg-white hover:bg-[#F2F1EC] text-primary'
              }`}
              title="向左旋转 (←)"
            >
              <div className="relative flex items-center justify-center w-full h-full">
                <svg className="w-8 h-8 transform -rotate-90 transition-transform hover:scale-110" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18 L20 18 L16 28 Z" fill="#D29B52" stroke="#8C5C23" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M14 18 L18 24" stroke="#B87C31" strokeWidth="1"/>
                  <path d="M10 18 C8 18 8 15 11 14 C12 13 20 13 21 14 C24 15 24 18 22 18 Z" fill="#8A9A5B" stroke="#5C633F" strokeWidth="1.5" />
                  <path d="M11 14 C10 14 10 11 13 11 C14 10 18 10 19 11 C22 11 22 14 21 14 Z" fill="#9FB46C" stroke="#5C633F" strokeWidth="1.5" />
                  <path d="M13 11 C13 8 16 6 16 6 C16 6 19 8 19 11 Z" fill="#B4CB7E" stroke="#5C633F" strokeWidth="1.5" />
                  <circle cx="16" cy="5" r="2.5" fill="#e11d48" />
                </svg>
                <ArrowLeft className="w-3.5 h-3.5 text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)] absolute font-black" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => { setRotateX(-22); setRotateY(-45); setZoom(1.1); }}
              className="p-1 flex items-center justify-center rounded-xl border border-[#c4c8b7]/30 bg-[#E8EAE0]/30 hover:bg-[#F2F1EC] text-[#5C633F] transition-all cursor-pointer font-bold"
              title="重置 3D 轴心"
            >
              <Rotate3d className="w-4 h-4 animate-spin-slow" />
            </button>
            <button
              type="button"
              onClick={() => setRotateY(prev => (prev + 12) % 360)}
              className={`p-0.5 flex items-center justify-center rounded-xl border border-[#c4c8b7]/40 transition-all duration-150 cursor-pointer ${
                pressedKey === 'ArrowRight'
                  ? 'bg-[#5C633F] text-white scale-90 shadow-inner'
                  : 'bg-white hover:bg-[#F2F1EC] text-primary'
              }`}
              title="向右旋转 (→)"
            >
              <div className="relative flex items-center justify-center w-full h-full">
                <svg className="w-8 h-8 transform rotate-90 transition-transform hover:scale-110" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18 L20 18 L16 28 Z" fill="#D29B52" stroke="#8C5C23" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M14 18 L18 24" stroke="#B87C31" strokeWidth="1"/>
                  <path d="M10 18 C8 18 8 15 11 14 C12 13 20 13 21 14 C24 15 24 18 22 18 Z" fill="#8A9A5B" stroke="#5C633F" strokeWidth="1.5" />
                  <path d="M11 14 C10 14 10 11 13 11 C14 10 18 10 19 11 C22 11 22 14 21 14 Z" fill="#9FB46C" stroke="#5C633F" strokeWidth="1.5" />
                  <path d="M13 11 C13 8 16 6 16 6 C16 6 19 8 19 11 Z" fill="#B4CB7E" stroke="#5C633F" strokeWidth="1.5" />
                  <circle cx="16" cy="5" r="2.5" fill="#e11d48" />
                </svg>
                <ArrowRight className="w-3.5 h-3.5 text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)] absolute font-black" />
              </div>
            </button>

            {/* Bottom row */}
            <div></div>
            <button
              type="button"
              onClick={() => setRotateX(prev => Math.min(20, Math.max(-65, prev - 8)))}
              className={`p-0.5 flex items-center justify-center rounded-xl border border-[#c4c8b7]/40 transition-all duration-150 cursor-pointer ${
                pressedKey === 'ArrowDown'
                  ? 'bg-[#5C633F] text-white scale-90 shadow-inner'
                  : 'bg-white hover:bg-[#F2F1EC] text-primary'
              }`}
              title="向下俯视 (↓)"
            >
              <div className="relative flex items-center justify-center w-full h-full">
                <svg className="w-8 h-8 transform rotate-180 transition-transform hover:scale-110" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18 L20 18 L16 28 Z" fill="#D29B52" stroke="#8C5C23" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M14 18 L18 24" stroke="#B87C31" strokeWidth="1"/>
                  <path d="M10 18 C8 18 8 15 11 14 C12 13 20 13 21 14 C24 15 24 18 22 18 Z" fill="#8A9A5B" stroke="#5C633F" strokeWidth="1.5" />
                  <path d="M11 14 C10 14 10 11 13 11 C14 10 18 10 19 11 C22 11 22 14 21 14 Z" fill="#9FB46C" stroke="#5C633F" strokeWidth="1.5" />
                  <path d="M13 11 C13 8 16 6 16 6 C16 6 19 8 19 11 Z" fill="#B4CB7E" stroke="#5C633F" strokeWidth="1.5" />
                  <circle cx="16" cy="5" r="2.5" fill="#e11d48" />
                </svg>
                <ArrowDown className="w-3.5 h-3.5 text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)] absolute font-black" />
              </div>
            </button>
            <div></div>
          </div>
          <span className="text-[8px] text-gray-400 font-sans tracking-wide font-medium">
            键盘或点击按钮控制
          </span>
        </div>

        {/* 3D SCENE PERSPECTIVE WRAPPER */}
        <div 
          style={{ perspective: '800px' }} 
          className="w-full h-80 sm:h-[400px] flex items-center justify-center pointer-events-none relative"
        >
          {/* Dynamic Virtual Sun Light Indicator (moves spherically based on lightAngle slider) */}
          {!wireframe && (
            <div 
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${zoom})`,
                transformStyle: 'preserve-3d',
              }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <div 
                style={{
                  transform: `rotateY(${-lightAngle}deg) translateZ(128px) rotateY(${lightAngle}deg) rotateX(${-rotateX}deg) rotateY(${-rotateY}deg)`,
                  transition: 'transform 0.15s ease-out'
                }}
                className="absolute w-5 h-5 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-550 border-2 border-white flex items-center justify-center shadow-[0_0_16px_rgba(245,158,11,0.95)]"
                title="3D模拟主光源"
              >
                <div className="w-2 h-2 rounded-full bg-white opacity-85"></div>
              </div>
            </div>
          )}
          {/* Inner positioning core */}
          <div
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${zoom})`,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-56 h-36 flex items-center justify-center transition-transform duration-100 ease-out"
          >
            {/* Exploded helper connecting guide lines */}
            {exploded && (
              <div 
                style={{ transformStyle: 'preserve-3d' }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                {/* Vertical dash lines */}
                <div className="w-[1px] h-52 border-l border-dashed border-[#5C633F]/35 transform -translate-y-6"></div>
              </div>
            )}

            {/* 3D BASE PLATE SHAPE - Custom Servings Ceramic Tray */}
            <div
              style={{
                transform: `rotateY(180deg) rotateX(90deg) translate3d(0, 0, ${exploded ? '-58px' : '-10px'})`,
                transformStyle: 'preserve-3d',
              }}
              className="absolute w-56 h-56 flex items-center justify-center transition-all duration-500 ease-out"
            >
              {shape === 'square' ? (
                /* Elegant Square Dish */
                <div 
                  style={{ transformStyle: 'preserve-3d' }}
                  className="w-44 h-44 bg-gradient-to-tr from-[#fbfbfa] to-[#ffffff] border-2 border-[#D4AF37]/45 rounded-2xl shadow-2xl flex items-center justify-center relative"
                >
                  <div className="absolute inset-1.5 border border-[#D4AF37]/20 rounded-xl" />
                  {/* Outer Beveled edge thickness rim */}
                  {Array.from({ length: 4 }).map((_, side) => {
                    const rot = side * 90;
                    return (
                      <div
                        key={side}
                        style={{
                          background: 'linear-gradient(to bottom, #dedbd0 30%, #a8a599 100%)',
                          transform: `rotateY(${rot}deg) translateZ(88px)`,
                          width: '176px',
                          height: '6px',
                        }}
                        className="absolute border-b border-black/10 rounded-sm"
                      />
                    );
                  })}
                </div>
              ) : shape === 'slice' ? (
                /* Wedge-Shaped Porcelain Plate with Gold Rim */
                <div 
                  style={{ transformStyle: 'preserve-3d' }}
                  className="w-44 h-44 flex items-center justify-center relative scale-110"
                >
                  {/* Triangle face with elegant drop-shadow and beige texture */}
                  <div 
                    style={{ 
                      clipPath: 'polygon(100% 50%, 0% 10%, 0% 90%)',
                      background: 'radial-gradient(circle, #ffffff 40%, #fbfbfa 100%)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      transformStyle: 'preserve-3d'
                    }} 
                    className="w-[140px] h-[110px] border border-[#D4AF37]/45 flex items-center justify-center relative"
                  >
                    {/* Golden inner glazed line */}
                    <div 
                      style={{ 
                        clipPath: 'polygon(100% 50%, 0% 10%, 0% 90%)',
                      }} 
                      className="absolute inset-1 bg-[#D4AF37]/15"
                    />
                  </div>
                  {/* Sidewalls of the wedge plate of 4px height to give realistic 3D feel */}
                  <div 
                    style={{
                      background: 'linear-gradient(to bottom, #dedbd0 20%, #a8a599 100%)',
                      transform: 'rotateY(32deg) translate3d(-10px, 0px, 35px)',
                      width: '128px',
                      height: '5px'
                    }}
                    className="absolute border-b border-black/10"
                  />
                  <div 
                    style={{
                      background: 'linear-gradient(to bottom, #dedbd0 20%, #a8a599 100%)',
                      transform: 'rotateY(-32deg) translate3d(-10px, 0px, -35px)',
                      width: '128px',
                      height: '5px'
                    }}
                    className="absolute border-b border-black/10"
                  />
                  <div 
                    style={{
                      background: 'linear-gradient(to bottom, #dedbd0 20%, #a8a599 100%)',
                      transform: 'rotateY(-90deg) translateZ(64px)',
                      width: '90px',
                      height: '5px'
                    }}
                    className="absolute border-b border-[#D4AF37]/60"
                  />
                </div>
              ) : (
                /* Exquisite Round Porcelain Platter */
                <div 
                  style={{ transformStyle: 'preserve-3d' }}
                  className="w-48 h-48 bg-gradient-to-tr from-[#fbfbfa] to-[#ffffff] border-2 border-[#D4AF37]/45 rounded-full shadow-2xl flex items-center justify-center relative"
                >
                  <div className="absolute inset-2 border border-[#D4AF37]/20 rounded-full" />
                  {/* Cylindrical beveled edge thickness rim */}
                  {Array.from({ length: 12 }).map((_, pIdx) => {
                    const angle = pIdx * 30;
                    return (
                      <div
                        key={pIdx}
                        style={{
                          background: 'linear-gradient(to bottom, #dedbd0 30%, #a8a599 100%)',
                          transform: `rotateY(${angle}deg) translateZ(96px)`,
                          width: '52px',
                          height: '6px',
                        }}
                        className="absolute border-b border-black/10 rounded-sm"
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* STACKED 3D CAKE LAYERS ENGINE */}
            <div style={{ transformStyle: 'preserve-3d' }} className="relative w-44 h-24">
              {/* Stack loops of layers dynamically */}
              {Array.from({ length: layersCount }).map((_, idx) => {
                const isTop = idx === layersCount - 1;
                const isBottom = idx === 0;
                
                // Explode & clean stack offsets
                const gapMultiplier = 34;
                const mid = (layersCount - 1) / 2;
                const translateY = exploded 
                  ? (idx - mid) * -gapMultiplier 
                  : idx * -13.5; // Perfectly overlap slightly to prevent physical gaps

                // Determine colors, sponge grains, and piped cream fillings
                let faceColor = activeCreamColorValue;
                let topFaceColor = activeCreamLightValue;
                let sideBgStyle = `linear-gradient(to bottom, ${faceColor} 70%, rgba(0,0,0,0.15) 100%)`;
                
                if (isBottom) {
                  // Biscuit base crust (dense Oreo crumb or butter biscuit texture)
                  faceColor = activeCrustValue;
                  topFaceColor = activeCrustValue;
                  sideBgStyle = `repeating-linear-gradient(to right, ${faceColor} 0px, ${faceColor} 4px, rgba(0,0,0,0.2) 4px, rgba(0,0,0,0.2) 8px)`;
                } else if (idx % 2 === 1 && !isTop) {
                  // Sponge cakes with visible green crumbs or soft yellow crumbs
                  const spongeColor = creamColor === 'deep-matcha' ? '#7D8B55' : creamColor === 'sweet-chestnut' ? '#B8977A' : '#E6DFD3';
                  const spongeLight = creamColor === 'deep-matcha' ? '#8A9A5B' : creamColor === 'sweet-chestnut' ? '#CDB380' : '#FFFDF0';
                  faceColor = spongeColor;
                  topFaceColor = spongeLight;
                  sideBgStyle = `repeating-linear-gradient(to right, ${spongeColor} 0px, ${spongeColor} 3px, rgba(255,255,255,0.08) 3px, rgba(255,255,255,0.08) 6px)`;
                } else {
                  // Rich piped cream with soft highlights on upper face
                  sideBgStyle = `linear-gradient(to bottom, ${faceColor} 0%, ${faceColor} 65%, rgba(255,255,255,0.3) 65%, rgba(255,255,255,0.3) 80%, rgba(0,0,0,0.18) 100%)`;
                }

                return (
                  <div
                    key={idx}
                    style={{
                      transform: `translate3d(0, ${translateY}px, 0)`,
                      transformStyle: 'preserve-3d',
                      zIndex: idx
                    }}
                    className="absolute inset-x-0 w-full hover:scale-[1.03] transition-all duration-300"
                  >
                    {/* -- LAYER PLANE RENDERING (SQUARE SLAB) -- */}
                    {shape === 'square' && (
                      <div 
                        style={{ transformStyle: 'preserve-3d' }} 
                        className="relative w-full h-8 flex items-center justify-center"
                      >
                        {/* 1. TOP FACE (With beautiful radial glaze or icing powder sheen) */}
                        <div
                          style={{
                            background: wireframe ? 'rgba(92, 99, 63, 0.05)' : topFaceColor,
                            border: wireframe ? '1px dashed rgba(92, 99, 63, 0.45)' : '1px solid rgba(0, 0, 0, 0.1)',
                            transform: `rotateX(90deg) translateZ(7px)`,
                            width: '110px',
                            height: '110px',
                            backgroundImage: !wireframe && isTop && creamColor === 'deep-matcha'
                              ? 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 80%)'
                              : 'none',
                          }}
                          className="absolute rounded-md shadow-[inset_0_0_8px_rgba(0,0,0,0.12)] flex items-center justify-center"
                        >
                          {/* Top toppings details in layer perspective */}
                          {isTop && (
                            <div className="absolute inset-0 flex items-center justify-center scale-95 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                              {/* Matcha Powder sprinkles */}
                              {toppings.includes('matcha-poudre') && !wireframe && (
                                <div className="absolute inset-2 bg-[#5C633F]/25 filter blur-[3px] rounded-full mix-blend-multiply"></div>
                              )}
                              
                              {/* Edible Gold Foil details */}
                              {toppings.includes('gold-foil') && (
                                <>
                                  <div className="absolute top-1/4 left-1/3 w-3.5 h-2 bg-yellow-400 rotate-12 opacity-95 rounded-xs animate-bounce" style={{ transform: 'translateZ(1px)' }}></div>
                                  <div className="absolute bottom-1/3 right-1/4 w-2 h-2.5 bg-yellow-300 -rotate-45 opacity-90 rounded-xs" style={{ transform: 'translateZ(1.5px)' }}></div>
                                </>
                              )}

                              {/* Corner Whipped Cream Rosettes for Square Cake (adds complete gourmet look) */}
                              {!wireframe && (
                                <>
                                  <div style={{ transform: 'translate3d(-42px, -42px, 8px) rotateX(-20deg)', transformStyle: 'preserve-3d' }} className="absolute">
                                    <div className="w-5 h-5 rounded-full bg-white shadow-xs border-b border-[#ebd] relative flex items-center justify-center">
                                      <div className="w-2 h-2 rounded-full bg-[#fdfdf9] filter brightness-95"></div>
                                      <div className="absolute -top-0.5 w-1 h-2 bg-gradient-to-t from-transparent to-white rounded-t-full"></div>
                                    </div>
                                  </div>
                                  <div style={{ transform: 'translate3d(42px, -42px, 8px) rotateX(-20deg)', transformStyle: 'preserve-3d' }} className="absolute">
                                    <div className="w-5 h-5 rounded-full bg-white shadow-xs border-b border-[#ebd] relative flex items-center justify-center">
                                      <div className="w-2 h-2 rounded-full bg-[#fdfdf9] filter brightness-95"></div>
                                      <div className="absolute -top-0.5 w-1 h-2 bg-gradient-to-t from-transparent to-white rounded-t-full"></div>
                                    </div>
                                  </div>
                                  <div style={{ transform: 'translate3d(-42px, 42px, 8px) rotateX(-20deg)', transformStyle: 'preserve-3d' }} className="absolute">
                                    <div className="w-5 h-5 rounded-full bg-white shadow-xs border-b border-[#ebd] relative flex items-center justify-center">
                                      <div className="w-2 h-2 rounded-full bg-[#fdfdf9] filter brightness-95"></div>
                                      <div className="absolute -top-0.5 w-1 h-2 bg-gradient-to-t from-transparent to-white rounded-t-full"></div>
                                    </div>
                                  </div>
                                  <div style={{ transform: 'translate3d(42px, 42px, 8px) rotateX(-20deg)', transformStyle: 'preserve-3d' }} className="absolute">
                                    <div className="w-5 h-5 rounded-full bg-white shadow-xs border-b border-[#ebd] relative flex items-center justify-center">
                                      <div className="w-2 h-2 rounded-full bg-[#fdfdf9] filter brightness-95"></div>
                                      <div className="absolute -top-0.5 w-1 h-2 bg-gradient-to-t from-transparent to-white rounded-t-full"></div>
                                    </div>
                                  </div>
                                </>
                              )}
                              
                              {/* Chestnut model of 3D with glazed shine and roasted golden base */}
                              {toppings.includes('chestnut') && (
                                <div 
                                  style={{ transform: 'translate3d(-18px, 12px, 10px) rotateX(-15deg) rotateY(-35deg)', transformStyle: 'preserve-3d' }}
                                  className="absolute"
                                >
                                  <div className={`w-8.5 h-8.5 rounded-tr-3xl rounded-l-2xl ${wireframe ? 'border border-[#5C633F]/60 bg-transparent' : 'bg-gradient-to-br from-[#80461B] via-[#5C2E0B] to-[#361A05] border-b-4 border-[#C19A6B] shadow-md'} relative`} style={{ transform: 'rotate(45deg)' }}>
                                    {!wireframe && (
                                      <>
                                        {/* Sugar Honey Glaze reflection */}
                                        <div className="w-4 h-1.5 bg-white/30 rounded-full absolute top-1.5 left-1.5 blur-[0.5px] rotate-12"></div>
                                        {/* Roasted Golden base contrast */}
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#D2B48C] rounded-full filter brightness-95 opacity-80"></div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Fresh Strawberry piece with green calyx leaves in 3D */}
                              {toppings.includes('strawberry') && (
                                <div 
                                  style={{ transform: 'translate3d(16px, 16px, 12px) rotateX(-15deg) rotateY(30deg)', transformStyle: 'preserve-3d' }}
                                  className="absolute"
                                >
                                  <div className={`w-7.5 h-9 rounded-b-3xl rounded-t-lg shadow-md flex flex-col justify-between p-1.5 transform -rotate-12 relative ${wireframe ? 'border border-[#5C633F] bg-transparent' : 'bg-gradient-to-br from-red-500 via-red-600 to-red-800 border-b-2 border-red-950'}`}>
                                    {/* Seed dots */}
                                    {!wireframe && (
                                      <div className="flex flex-wrap gap-1 px-1 justify-center opacity-90 mt-2">
                                        <div className="w-[1.2px] h-[1.2px] bg-yellow-300 rounded-full"></div>
                                        <div className="w-[1.2px] h-[1.2px] bg-yellow-105 rounded-full"></div>
                                        <div className="w-[1.2px] h-[1.2px] bg-yellow-300 rounded-full"></div>
                                      </div>
                                    )}
                                    {/* Green Calyx Leaves */}
                                    {!wireframe && (
                                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex gap-[1px]">
                                        <div className="w-1.5 h-2.5 bg-[#556B2F] rounded-t-full rotate-12"></div>
                                        <div className="w-1.5 h-3 bg-[#4F7942] rounded-t-full"></div>
                                        <div className="w-1.5 h-2.5 bg-[#556B2F] rounded-t-full -rotate-12"></div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Japanese Premium Macaron in 3D with ruffles/ruffled foot shells */}
                              {toppings.includes('macaron') && (
                                <div 
                                  style={{ transform: 'translate3d(23px, -18px, 12px) rotateX(-10deg) rotateY(15deg)', transformStyle: 'preserve-3d' }}
                                  className="absolute w-8 h-8 flex flex-col items-center justify-center"
                                >
                                  {/* Upper shell */}
                                  <div className={`w-7.5 h-2.5 rounded-full shadow-xs ${wireframe ? 'border border-[#5C633F] bg-transparent' : 'bg-[#8A9A5B] border-b-2 border-[#556B2F]/20'}`} style={{ transform: 'translateY(1.5px)' }}>
                                    {!wireframe && <div className="w-4 h-1 bg-white/40 rounded-full mx-auto mt-0.5 opacity-90 filter blur-[0.5px]"></div>}
                                  </div>
                                  {/* Cream filling */}
                                  <div className={`w-6.5 h-1.5 rounded-xs ${wireframe ? 'border-y border-[#5C633F]/30' : 'bg-[#FFFDF9] shadow-[0_0_2px_rgba(0,0,0,0.15)]'}`} />
                                  {/* Lower shell */}
                                  <div className={`w-7.5 h-2.5 rounded-full shadow-sm ${wireframe ? 'border border-[#5C633F] bg-transparent' : 'bg-[#8A9A5B]'}`} style={{ transform: 'translateY(-1.5px)' }} />
                                </div>
                              )}

                              {/* Celebration Candle with glowing flame */}
                              {toppings.includes('candle') && (
                                <div 
                                  style={{ transform: 'translate3d(0px, 0px, 20px) rotateX(-90deg)', transformStyle: 'preserve-3d' }}
                                  className="absolute flex flex-col items-center justify-center animate-pulse-slow"
                                >
                                  {/* Flicker Flame */}
                                  <div className="relative w-3.5 h-[18px] mb-0.5 flex items-end justify-center">
                                    <div className="absolute w-2.5 h-4 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 rounded-full filter blur-[1px] shadow-[0_0_12px_rgba(249,115,22,0.85)] animate-bounce"></div>
                                    <div className="absolute w-1.5 h-2.5 bg-white/90 rounded-full mb-0.5"></div>
                                  </div>
                                  {/* Candle cylinder stick */}
                                  <div className={`w-2.5 h-12 border shadow-md rounded-xs relative ${wireframe ? 'border border-[#5C633F]/60 bg-transparent' : 'bg-gradient-to-b from-[#ff6b6b] via-[#ffffff] to-[#ff4757] border-black/15'}`}>
                                    {!wireframe && (
                                      <>
                                        <div className="w-full h-[2px] bg-red-500 absolute top-2 rotate-12 opacity-80" />
                                        <div className="w-full h-[2px] bg-red-500 absolute top-5 rotate-12 opacity-80" />
                                        <div className="w-full h-[2px] bg-red-500 absolute top-8 rotate-12 opacity-80" />
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 2. FRONT FACE (Normal is pointing at 90 deg) */}
                        <div
                          style={{
                            ...getFaceShadeStyle(90, sideBgStyle),
                            transform: `translateZ(55px)`, // half of top depth
                            width: '110px',
                            height: '14px',
                          }}
                          className={`${wireframe ? '' : 'border-x border-b border-black/10'} absolute flex items-center justify-between px-2`}
                        >
                          {/* Exquisite vertical micro line textures */}
                          {!isBottom && !wireframe && (
                            <div className="w-full h-1 bg-white/10 absolute bottom-1 left-0"></div>
                          )}
                          
                          {/* Decorative gravity cream drips */}
                          {creamDrips && !isBottom && !wireframe && (
                            <div className="absolute top-0 inset-x-0 h-4 pointer-events-none flex justify-around overflow-visible z-10" style={{ transform: 'translateY(-1px)' }}>
                              <div style={{ background: faceColor }} className="w-1.5 h-3 rounded-b-full shadow-xs filter brightness-95 opacity-90 animate-pulse-slow"></div>
                              <div style={{ background: faceColor }} className="w-1.5 h-2 rounded-b-full shadow-xs filter brightness-105 opacity-80 mt-1"></div>
                              <div style={{ background: faceColor }} className="w-1.2 h-3.5 rounded-b-full shadow-xs filter brightness-90 opacity-95"></div>
                            </div>
                          )}
                        </div>

                        {/* 3. RIGHT FACE (Normal points to 0 deg) */}
                        <div
                          style={{
                            ...getFaceShadeStyle(0, sideBgStyle),
                            transform: `rotateY(90deg) translateZ(55px)`,
                            width: '110px',
                            height: '14px',
                          }}
                          className={`${wireframe ? '' : 'border-x border-b border-black/10'} absolute`}
                        >
                          {!isBottom && !wireframe && (
                            <div className="w-full h-1 bg-white/10 absolute bottom-1 left-0"></div>
                          )}
                          
                          {/* Cream dripping effect on the side plate */}
                          {creamDrips && !isBottom && !wireframe && (
                            <div className="absolute top-0 inset-x-0 h-4 pointer-events-none flex justify-around overflow-visible z-10" style={{ transform: 'translateY(-1px)' }}>
                              <div style={{ background: faceColor }} className="w-1.2 h-2.2 rounded-b-full shadow-xs filter brightness-95 opacity-85 mt-0.5"></div>
                              <div style={{ background: faceColor }} className="w-1.5 h-3.2 rounded-b-full shadow-xs filter brightness-105 opacity-95"></div>
                            </div>
                          )}
                        </div>

                        {/* 4. LEFT FACE (Normal points to 180 deg) */}
                        <div
                          style={{
                            ...getFaceShadeStyle(180, sideBgStyle),
                            transform: `rotateY(-90deg) translateZ(55px)`,
                            width: '110px',
                            height: '14px',
                          }}
                          className={`${wireframe ? '' : 'border-x border-b border-black/10'} absolute`}
                        />

                        {/* 5. BACK FACE (Normal points to 270 deg) */}
                        <div
                          style={{
                            ...getFaceShadeStyle(270, sideBgStyle),
                            transform: `rotateY(180deg) translateZ(55px)`,
                            width: '110px',
                            height: '14px',
                          }}
                          className={`${wireframe ? '' : 'border-x border-b border-black/10'} absolute`}
                        />
                      </div>
                    )}

                    {/* -- LAYER PLANE RENDERING (TRIANGLE CREPE SLICE) -- */}
                    {shape === 'slice' && (
                      <div 
                        style={{ transformStyle: 'preserve-3d' }} 
                        className="relative w-full h-8 flex items-center justify-center transform translate-y-1"
                      >
                        {/* 1. TOP FACE (Triangle wedge shape) */}
                        <div
                          style={{
                            background: wireframe ? 'rgba(92, 99, 63, 0.05)' : topFaceColor,
                            border: wireframe ? '1.5px dashed rgba(92, 99, 63, 0.45)' : '1px solid rgba(0,0,0,0.05)',
                            transform: `rotateX(90deg) translateZ(7px)`,
                            width: '130px',
                            height: '100px',
                            clipPath: 'polygon(100% 50%, 0% 0%, 0% 100%)',
                          }}
                          className="absolute"
                        >
                          {isTop && (
                            <div className="absolute inset-0 flex items-center justify-start pointer-events-none pl-4 scale-90" style={{ transformStyle: 'preserve-3d' }}>
                              <div className="w-12 h-12 flex items-center justify-between relative" style={{ transformStyle: 'preserve-3d' }}>
                                {/* Multi-toppings for wedge */}
                                {toppings.includes('chestnut') && (
                                  <div 
                                    style={{ transform: 'translate3d(0px, 0px, 10px) rotateX(-15deg) rotateY(-35deg)', transformStyle: 'preserve-3d' }}
                                    className="absolute"
                                  >
                                    <div className={`w-7.5 h-7.5 rounded-tr-3xl rounded-l-2xl ${wireframe ? 'border border-[#5C633F]/60 bg-transparent' : 'bg-gradient-to-br from-[#80461B] via-[#5C2E0B] to-[#361A05] border-b-2 border-[#C19A6B] shadow-md'} relative`} style={{ transform: 'rotate(45deg)' }}>
                                      {!wireframe && (
                                        <>
                                          <div className="w-3.5 h-1 bg-white/30 rounded-full absolute top-1 left-1 blur-[0.5px] rotate-12"></div>
                                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#D2B48C] rounded-full filter brightness-95 opacity-80"></div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {toppings.includes('strawberry') && (
                                  <div 
                                    style={{ transform: 'translate3d(22px, 2px, 12px) rotateX(-15deg) rotateY(20deg)', transformStyle: 'preserve-3d' }}
                                    className="absolute"
                                  >
                                    <div className={`w-6.5 h-8 rounded-b-3xl rounded-t-lg shadow-md flex flex-col justify-between p-1 transform -rotate-12 relative ${wireframe ? 'border border-[#5C633F] bg-transparent' : 'bg-gradient-to-br from-red-500 via-red-600 to-red-800 border-b-2 border-red-950'}`}>
                                      {!wireframe && (
                                        <div className="flex gap-[1px] justify-center opacity-90 mt-1.5">
                                          <div className="w-[1px] h-[1px] bg-yellow-300 rounded-full"></div>
                                          <div className="w-[1px] h-[1px] bg-yellow-200 rounded-full"></div>
                                        </div>
                                      )}
                                      {!wireframe && (
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-[0.5px]">
                                          <div className="w-1 h-2 bg-[#556B2F] rounded-t-full rotate-12"></div>
                                          <div className="w-1 h-2 bg-[#4F7942] rounded-t-full"></div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {toppings.includes('gold-foil') && (
                                  <div className="absolute w-2.5 h-2 bg-yellow-400 rotate-12 top-0 left-0 animate-bounce" style={{ transform: 'translateZ(1px)' }} />
                                )}
                                
                                {toppings.includes('candle') && (
                                  <div 
                                    style={{ transform: 'translate3d(12px, -8px, 14px) rotateX(-90deg)', transformStyle: 'preserve-3d' }}
                                    className="absolute flex flex-col items-center justify-center scale-75"
                                  >
                                    <div className="relative w-2.5 h-3.5 mb-0.5 flex items-end justify-center">
                                      <div className="absolute w-2 h-3.5 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 rounded-full filter blur-[1px] shadow-[0_0_8px_rgba(249,115,22,0.85)] animate-bounce"></div>
                                    </div>
                                    <div className={`w-2 h-[34px] border shadow-md rounded-xs relative ${wireframe ? 'border border-[#5C633F]/60 bg-transparent' : 'bg-gradient-to-b from-white via-red-500 to-white'}`}></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 2. SIDE 1 LONG RECTANGLE (Back wide flat edge, normal points to 270 deg) */}
                        <div
                          style={{
                            ...getFaceShadeStyle(270, sideBgStyle),
                            transform: `rotateY(-90deg) translateZ(65px)`,
                            width: '100px',
                            height: '14px',
                          }}
                          className={`absolute ${wireframe ? '' : 'border-b border-black/15'}`}
                        >
                          {!isBottom && !wireframe && Array.from({ length: 4 }).map((_, lIdx) => (
                            <div 
                              key={lIdx} 
                              style={{ bottom: `${lIdx * 3 + 2}px` }} 
                              className="w-full h-[1px] bg-white/20 absolute left-0"
                            ></div>
                          ))}
                        </div>

                        {/* 3. INCLINED SIDE 2 (Wedge slope surface, normal points to roughly 35 deg) */}
                        <div
                          style={{
                            ...getFaceShadeStyle(35, sideBgStyle),
                            transform: `rotateY(35deg) translate3d(-10px, 0px, 42px)`,
                            width: '122px',
                            height: '14px',
                          }}
                          className={`absolute ${wireframe ? '' : 'border-b border-black/10'}`}
                        >
                          {!isBottom && !wireframe && Array.from({ length: 4 }).map((_, lIdx) => (
                            <div 
                              key={lIdx} 
                              style={{ bottom: `${lIdx * 3 + 2}px` }} 
                              className="w-full h-[1px] bg-white/20 absolute left-0"
                            ></div>
                          ))}
                          
                          {/* Delicate side drips for wedge edge */}
                          {creamDrips && !isBottom && !wireframe && (
                            <div className="absolute top-0 inset-x-0 h-4 pointer-events-none flex justify-around overflow-visible z-10" style={{ transform: 'translateY(-1px)' }}>
                              <div style={{ background: faceColor }} className="w-1.2 h-2.5 rounded-b-full filter brightness-95 opacity-90"></div>
                              <div style={{ background: faceColor }} className="w-1.2 h-1.5 rounded-b-full filter brightness-110 opacity-75"></div>
                            </div>
                          )}
                        </div>

                        {/* 4. INCLINED SIDE 3 (Wedge opposite slope surface, normal points to roughly -35 deg) */}
                        <div
                          style={{
                            ...getFaceShadeStyle(-35, sideBgStyle),
                            transform: `rotateY(-35deg) translate3d(-10px, 0px, -42px)`,
                            width: '122px',
                            height: '14px',
                          }}
                          className={`absolute ${wireframe ? '' : 'border-b border-black/10'}`}
                        />
                      </div>
                    )}

                    {/* -- LAYER PLANE RENDERING (ROUND TIER SLICE) -- */}
                    {shape === 'round' && (
                      <div 
                        style={{ transformStyle: 'preserve-3d' }} 
                        className="relative w-full h-8 flex items-center justify-center"
                      >
                        {/* 1. TOP FACE (Beautiful Circular Disc) */}
                        <div
                          style={{
                            background: wireframe ? 'rgba(92, 99, 63, 0.05)' : topFaceColor,
                            border: wireframe ? '1.5px dashed rgba(92, 99, 63, 0.45)' : '1px solid rgba(0,0,0,0.1)',
                            transform: `rotateX(90deg) translateZ(7px)`,
                            width: '118px',
                            height: '118px',
                          }}
                          className="absolute rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.12)] flex items-center justify-center"
                        >
                          {isTop && (
                            <div className="absolute inset-0 flex items-center justify-center scale-95 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                              {toppings.includes('matcha-poudre') && !wireframe && (
                                <div className="absolute inset-2 border-4 border-dashed border-[#5C633F]/25 rounded-full filter blur-[1px]"></div>
                              )}
                              
                              {/* Glazed Chestnut model on Round cake */}
                              {toppings.includes('chestnut') && (
                                <div 
                                  style={{ transform: 'translate3d(-18px, 12px, 10px) rotateX(-15deg) rotateY(-35deg)', transformStyle: 'preserve-3d' }}
                                  className="absolute"
                                >
                                  <div className={`w-8.5 h-8.5 rounded-tr-3xl rounded-l-2xl ${wireframe ? 'border border-[#5C633F]/60 bg-transparent' : 'bg-gradient-to-br from-[#80461B] via-[#5C2E0B] to-[#361A05] border-b-4 border-[#C19A6B] shadow-md'} relative`} style={{ transform: 'rotate(45deg)' }}>
                                    {!wireframe && (
                                      <>
                                        <div className="w-3.5 h-1 bg-white/30 rounded-full absolute top-1 left-1 blur-[0.5px] rotate-12"></div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#D2B48C] rounded-full filter brightness-95 opacity-80"></div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                              {/* Upgraded Strawberry model on Round cake */}
                              {toppings.includes('strawberry') && (
                                <div 
                                  style={{ transform: 'translate3d(15px, 15px, 12px) rotateX(-15deg) rotateY(15deg)', transformStyle: 'preserve-3d' }}
                                  className="absolute"
                                >
                                  <div className={`w-7 h-8 rounded-b-3xl rounded-t-lg shadow-md flex flex-col justify-between p-1 transform -rotate-12 relative ${wireframe ? 'border border-[#5C633F] bg-transparent' : 'bg-gradient-to-br from-red-500 via-red-600 to-red-800 border-b-2 border-red-950'}`}>
                                    {!wireframe && (
                                      <div className="flex gap-[1px] justify-center opacity-90 mt-1">
                                        <div className="w-[1.2px] h-[1.2px] bg-yellow-300 rounded-full"></div>
                                        <div className="w-[1.2px] h-[1.2px] bg-yellow-200 rounded-full"></div>
                                      </div>
                                    )}
                                    {!wireframe && (
                                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-[0.5px]">
                                        <div className="w-1 h-2.2 bg-[#556B2F] rounded-t-full rotate-12"></div>
                                        <div className="w-1 h-2.2 bg-[#4F7942] rounded-t-full -rotate-12"></div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              {toppings.includes('gold-foil') && (
                                <div className="absolute top-5 right-6 w-3 h-2 bg-yellow-400 rotate-12 animate-bounce" style={{ transform: 'translateZ(1px)' }}></div>
                              )}
                              
                              {toppings.includes('candle') && (
                                <div 
                                  style={{ transform: 'translate3d(0px, 0px, 20px) rotateX(-90deg)', transformStyle: 'preserve-3d' }}
                                  className="absolute flex flex-col items-center justify-center animate-pulse-slow font-sans"
                                >
                                  {/* Flicker Flame */}
                                  <div className="relative w-3.5 h-[18px] mb-0.5 flex items-end justify-center">
                                    <div className="absolute w-2.5 h-4 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 rounded-full filter blur-[1px] shadow-[0_0_12px_rgba(249,115,22,0.85)] animate-bounce"></div>
                                    <div className="absolute w-1.5 h-2.5 bg-white/90 rounded-full mb-0.5"></div>
                                  </div>
                                  {/* Candle cylinder stick */}
                                  <div className={`w-2.5 h-12 border shadow-md rounded-xs relative ${wireframe ? 'border border-[#5C633F]/60 bg-transparent' : 'bg-gradient-to-b from-[#ff6b6b] via-[#ffffff] to-[#ff4757] border-black/15'}`}>
                                    {!wireframe && (
                                      <>
                                        <div className="w-full h-[2px] bg-red-500 absolute top-2 rotate-12 opacity-80" />
                                        <div className="w-full h-[2px] bg-red-500 absolute top-5 rotate-12 opacity-80" />
                                        <div className="w-full h-[2px] bg-red-500 absolute top-8 rotate-12 opacity-80" />
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 2. ROUNDED CYLINDER approximation using 8 faceted vertical plates with math dynamic lighting */}
                        {Array.from({ length: 8 }).map((_, pIdx) => {
                          const angle = pIdx * 45;
                          return (
                            <div
                              key={pIdx}
                              style={{
                                ...getFaceShadeStyle(angle, sideBgStyle),
                                transform: `rotateY(${angle}deg) translateZ(58px)`,
                                width: '46px',
                                height: '14px',
                              }}
                              className={`absolute ${wireframe ? '' : 'opacity-95 border-b border-black/10'}`}
                            >
                              {/* Simple mini-drippings on front-facing cylindrical cylinders */}
                              {creamDrips && !isBottom && !wireframe && (pIdx < 4) && (
                                <div style={{ background: faceColor }} className="w-1.2 h-2.5 rounded-b-full mx-auto filter brightness-95 transform -translate-y-px"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3D Ingredients Formulation Formula Breakdown HUD Overlay */}
        <div className="absolute left-4 bottom-16 hidden lg:flex flex-col gap-1.5 bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-[#c4c8b7]/30 text-[10px] font-sans text-gray-700 pointer-events-auto z-20 max-w-[210px] shadow-sm transform scale-90 hover:scale-95 transition-transform duration-300">
          <div className="font-bold text-primary flex items-center gap-1 font-serif border-b border-[#c4c8b7]/20 pb-1 mb-1">
            <Info className="w-3.5 h-3.5 text-[#5C633F]" />
            <span>3D 工艺解剖 (Formula Structure)</span>
          </div>
          <div className="flex flex-col gap-1.2">
            <div className="flex items-center justify-between gap-2 border-b border-[#c4c8b7]/10 pb-0.5">
              <span className="text-gray-400 shrink-0">顶装饰层:</span>
              <span className="font-medium text-emerald-900 truncate">
                {toppings.length > 0 ? toppings.map(t => {
                  if (t === 'chestnut') return '金烤秋栗';
                  if (t === 'strawberry') return '鲜采红莓';
                  if (t === 'gold-foil') return '奢华金箔';
                  if (t === 'macaron') return '原味小饼';
                  if (t === 'candle') return '庆典火光';
                  return '宇治茶洒粉';
                }).join('+') : '经典抹茶撒粉'}
              </span>
            </div>
            {Array.from({ length: Math.min(5, layersCount) }).map((_, i) => {
              const depthIdx = layersCount - 1 - i;
              let name = "宇治特浓抹茶乳酪霜层";
              if (depthIdx === 0) {
                name = baseCrust === 'oreo-charcoal' ? "巧克力奥利奥酥性饼干底" : baseCrust === 'butter-cookie' ? "黄金焦脆牛油酥饼底" : "宇治抹茶戚风蛋糕胚座";
              } else if (depthIdx % 2 === 1) {
                name = creamColor === 'deep-matcha' ? "宇治茶川抹茶甘纳许慕斯" : creamColor === 'sweet-chestnut' ? "炭火慢焖磨砂香甜板栗泥" : "喜马拉雅岩盐芝士乳脂奶盖";
              } else {
                name = "手工饱沾焙茶汤抹茶沙绵蛋糕";
              }
              return (
                <div key={i} className="flex items-center justify-between gap-3 text-[9px] text-[#555]">
                  <span className="text-gray-400 shrink-0 font-mono">第 L{depthIdx + 1} 层:</span>
                  <span className="font-sans truncate text-right text-gray-800">{name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT FLOATING: 3D Render Lab Engine Settings Dashboard */}
        <div className="absolute right-4 bottom-16 flex flex-col gap-1 rounded-2xl bg-white/85 backdrop-blur-md p-3.5 border border-[#c4c8b7]/30 text-[10px] text-gray-700 pointer-events-auto z-20 w-[180px] shadow-sm transform scale-90 hover:scale-95 transition-transform duration-300">
          <div className="font-bold text-primary flex items-center justify-between font-serif border-b border-[#c4c8b7]/20 pb-1.5 mb-2">
            <span className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#5C633F]" />
              <span>3D 渲染实验室</span>
            </span>
            <span className="text-[8px] bg-[#5C633F]/10 text-[#5C633F] px-1.5 py-0.2 rounded font-sans uppercase">v2.1</span>
          </div>

          <div className="flex flex-col gap-2 font-sans">
            {/* Dynamic Light source angle controller */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                <span>虚拟光照偏角 🔆</span>
                <span className="text-gray-800 font-bold">{lightAngle}°</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="360" 
                value={lightAngle} 
                onChange={(e) => setLightAngle(Number(e.target.value))}
                className="w-full h-1 bg-[#c4c8b7]/40 rounded-lg appearance-none cursor-pointer accent-[#5C633F]"
              />
            </div>

            {/* Dynamic Scale Zoom controller */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                <span>镜头精确焦段 🔍</span>
                <span className="text-gray-800 font-bold">{Math.round(zoom * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.7" 
                max="1.7" 
                step="0.05"
                value={zoom} 
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1 bg-[#c4c8b7]/40 rounded-lg appearance-none cursor-pointer accent-[#5C633F]"
              />
            </div>

            {/* Toggles for wireframe and cream cascading drips */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => setWireframe(prev => !prev)}
                className={`py-1 px-1.5 rounded-lg border text-center transition-all cursor-pointer font-bold text-[9px] flex flex-col items-center justify-center gap-0.5 ${
                  wireframe 
                    ? 'bg-[#5C633F] text-white border-[#5C633F]' 
                    : 'bg-white/60 text-primary border-[#c4c8b7]/40 hover:bg-surface-beige/30'
                }`}
                title="开启/关闭 3D 线框结构辅助线"
              >
                <Eye className="w-3 h-3" />
                <span>网格线框</span>
              </button>

              <button
                onClick={() => setCreamDrips(prev => !prev)}
                className={`py-1 px-1.5 rounded-lg border text-center transition-all cursor-pointer font-bold text-[9px] flex flex-col items-center justify-center gap-0.5 ${
                  creamDrips 
                    ? 'bg-[#5C633F] text-white border-[#5C633F]' 
                    : 'bg-white/60 text-primary border-[#c4c8b7]/40 hover:bg-surface-beige/30'
                }`}
                title="开启/关闭 侧边奶油重力滑落点缀"
              >
                <Sparkles className="w-3 h-3" />
                <span>奶油滑落</span>
              </button>
            </div>

            {/* Camera Perspective Profiles Toolbar (Isometric, Front Elevation, Bird's eye, Low cinematic) */}
            <div className="flex flex-col gap-1 border-t border-[#c4c8b7]/25 pt-2 mt-1">
              <span className="text-[8px] text-gray-400 font-mono scale-95 origin-left uppercase">
                焦位相机(Presets) 📷
              </span>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => { setRotateX(-25); setRotateY(-45); }}
                  className="py-1 bg-white hover:bg-[#5C633F]/10 border border-[#c4c8b7]/30 rounded text-[8px] text-center cursor-pointer font-bold duration-300 hover:text-primary"
                  title="经典等轴角透视 (RotateX: -25deg, RotateY: -45deg)"
                >
                  📐 经典等轴
                </button>
                <button
                  onClick={() => { setRotateX(0); setRotateY(0); }}
                  className="py-1 bg-white hover:bg-[#5C633F]/10 border border-[#c4c8b7]/30 rounded text-[8px] text-center cursor-pointer font-bold duration-300 hover:text-primary"
                  title="正前视剖 (RotateX: 0deg, RotateY: 0deg)"
                >
                  👁️ 正放剖视
                </button>
                <button
                  onClick={() => { setRotateX(-78); setRotateY(0); }}
                  className="py-1 bg-white hover:bg-[#5C633F]/10 border border-[#c4c8b7]/30 rounded text-[8px] text-center cursor-pointer font-bold duration-300 hover:text-primary"
                  title="正北鸟瞰俯视 (RotateX: -78deg, RotateY: 0deg)"
                >
                  🛸 极致鸟瞰
                </button>
                <button
                  onClick={() => { setRotateX(-10); setRotateY(120); }}
                  className="py-1 bg-white hover:bg-[#5C633F]/10 border border-[#c4c8b7]/30 rounded text-[8px] text-center cursor-pointer font-bold duration-300 hover:text-primary"
                  title="低景深特写视角 (RotateX: -10deg, RotateY: 120deg)"
                >
                  🌌 低空特写
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orbit indicator hint overlay */}
        <div className="absolute bottom-4 flex items-center gap-1 text-gray-500 font-mono text-[9px] bg-white/75 backdrop-blur-xs py-1 px-3 rounded-full border border-[#c4c8b7]/30 pointer-events-none shadow-xs">
          <Rotate3d className="w-3.5 h-3.5 text-[#5C633F]" />
          <span>旋转度 Y: {Math.round(rotateY)}° | 仰角 X: {Math.round(rotateX)}°</span>
        </div>
      </div>

      {/* RIGHT PANEL: Customizable ingredients panel & order actions */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between font-serif bg-white text-[#2c2e26]">
        <div>
          {/* Header titles */}
          <div className="flex items-start justify-between border-b border-[#c4c8b7]/20 pb-4 mb-5">
            <div>
              <span className="text-secondary text-[11px] font-mono tracking-widest uppercase block">
                🍵 3D Customizer Lab
              </span>
              <h2 className="text-2xl font-bold text-primary mt-1">
                互动点心定制工坊
              </h2>
            </div>
            
            {/* Real-time calculated price tag */}
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-mono block">预估单价</span>
              <span className="text-2xl font-bold font-mono text-primary">¥{price}</span>
            </div>
          </div>

          {/* Preset templates selector */}
          <div className="mb-5 flex flex-col gap-1.5">
            <span className="text-[11px] text-gray-400 tracking-wider">首选灵感推荐</span>
            <div className="flex gap-2 text-xs">
              {[
                { id: 'classic-matcha', label: '🍵 古和特浓' },
                { id: 'autumn-chestnut', label: '🌰 霜林碳栗' },
                { id: 'sea-salt-mousse', label: '🌊 海盐浮海' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id as LayerPreset)}
                  className="py-1.5 px-3 rounded-lg border border-[#c4c8b7]/40 bg-surface-beige/30 hover:bg-[#5C633F]/10 text-on-surface hover:text-[#5C633F] transition-all cursor-pointer font-serif font-bold text-[11px]"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form control: Cake base shape */}
          <div className="mb-5">
            <span className="text-[11px] text-gray-400 tracking-wider block mb-2">
              外貌形体：
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'square', label: '方形歌剧院', desc: '整规优雅' },
                { id: 'slice', label: '三角千层', desc: '丝滑交叠' },
                { id: 'round', label: '圆形和印', desc: '团圆守意' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setShape(opt.id as CakeShape)}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    shape === opt.id
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-white text-on-surface-variant border-[#c4c8b7]/40 hover:bg-surface-beige/25'
                  }`}
                >
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[9px] opacity-80 font-sans">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form control: Layers selection */}
          <div className="mb-5 pr-1">
            <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
              <span>烘焙堆叠层数 (Layers of Stack):</span>
              <span className="font-mono text-primary font-bold">{layersCount} 层精品</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setLayersCount(prev => Math.max(3, prev - 1))}
                className="w-8 h-8 rounded-full border border-[#c4c8b7]/40 flex items-center justify-center hover:bg-surface-beige/30 cursor-pointer active:scale-95"
              >
                <Minus className="w-3.5 h-3.5 text-primary" />
              </button>
              <input
                type="range"
                min="3"
                max="7"
                step="1"
                value={layersCount}
                onChange={(e) => setLayersCount(parseInt(e.target.value))}
                className="flex-1 accent-[#5C633F] h-1 bg-surface-beige rounded-lg appearance-none cursor-ew-resize"
              />
              <button 
                onClick={() => setLayersCount(prev => Math.min(7, prev + 1))}
                className="w-8 h-8 rounded-full border border-[#c4c8b7]/40 flex items-center justify-center hover:bg-surface-beige/30 cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-primary" />
              </button>
            </div>
          </div>

          {/* Form control: Primary Cream / Filling flavor type */}
          <div className="mb-5">
            <span className="text-[11px] text-gray-400 tracking-wider block mb-2">
              调和霜林 (Cream Type):
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'deep-matcha', label: '特浓抹茶', color: 'bg-[#5C633F]', text: '味苦回甘' },
                { id: 'sweet-chestnut', label: '炭焙秋栗', color: 'bg-[#9E7A5A]', text: '咸软甜糯' },
                { id: 'salted-cheese', label: '海盐芝士', color: 'bg-[#FDFCF8] border border-gray-200', text: '微咸顺滑' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setCreamColor(opt.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 hover:shadow-xs transition-all cursor-pointer ${
                    creamColor === opt.id 
                      ? 'border-[#5C633F] bg-primary/5 ring-1 ring-primary' 
                      : 'border-[#c4c8b7]/30 bg-white'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${opt.color}`}></div>
                  <span className="text-[11px] font-bold text-on-surface">{opt.label}</span>
                  <span className="text-[9px] text-gray-400 font-sans">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form control: Cake base crust options */}
          <div className="mb-5">
            <span className="text-[11px] text-gray-400 tracking-wider block mb-2">
              静音底壳 (Base Crust):
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'oreo-charcoal', label: '奥利奥脆底', desc: '黑曜馥苦' },
                { id: 'butter-cookie', label: '焦香饼干底', desc: '酥厚醇浓' },
                { id: 'matcha-chiffon', label: '抹茶戚风胚', desc: '柔绵吸汤' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setBaseCrust(opt.id)}
                  className={`p-2 rounded-xl border cursor-pointer transition-all ${
                    baseCrust === opt.id
                      ? 'border-[#5C633F] bg-[#5C633F]/5'
                      : 'border-[#c4c8b7]/25 text-on-surface-variant hover:bg-surface-beige/10'
                  }`}
                >
                  <div className="font-bold text-[10px]">{opt.label}</div>
                  <div className="text-[8px] opacity-75 font-sans mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form control: Toppings checkboxes */}
          <div className="mb-5">
            <span className="text-[11px] text-gray-400 tracking-wider block mb-1.5">
              御饰顶设 (Toppings - 最多可选5款):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'chestnut', label: '🌰 炭火栗子' },
                { id: 'strawberry', label: '🍓 极美鲜莓' },
                { id: 'gold-foil', label: '✨ 闪耀金箔' },
                { id: 'macaron', label: '🧁 抹茶马卡龙' },
                { id: 'matcha-poudre', label: '🍃 纯抹茶洒粉' },
                { id: 'candle', label: '🕯️ 庆典温和蜡烛' },
              ].map(topping => {
                const isSelected = toppings.includes(topping.id);
                return (
                  <button
                    key={topping.id}
                    onClick={() => toggleTopping(topping.id)}
                    className={`py-1.5 px-3 rounded-full text-[11px] font-sans font-medium transition-all cursor-pointer flex items-center gap-1.5 border border-[#c4c8b7]/30 ${
                      isSelected 
                        ? 'bg-[#5C633F] text-white' 
                        : 'bg-white text-[#5C633F] hover:bg-surface-beige/30'
                    }`}
                  >
                    <span>{topping.label}</span>
                    {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 opacity-60" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sugar level selector */}
          <div className="mb-6 flex items-center justify-between pb-4 border-b border-[#c4c8b7]/15">
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400">主厨度糖 (Sugar Control)</span>
              <span className="text-[9px] text-[#8A9A5B] font-sans">海藻糖比，不溢苦，不怕甜腻</span>
            </div>
            <div className="flex bg-[#E9E7DF]/35 border border-[#c4c8b7]/30 p-1 rounded-xl gap-1">
              {[
                { id: 10, label: '10% 净意' },
                { id: 30, label: '30% 和风' },
                { id: 50, label: '50% 甜韵' },
              ].map(sugar => (
                <button
                  key={sugar.id}
                  onClick={() => setSugarLevel(sugar.id)}
                  className={`py-1.5 px-3.5 rounded-lg text-[10px] font-bold font-serif cursor-pointer transition-all ${
                    sugarLevel === sugar.id 
                      ? 'bg-[#5C633F] text-white shadow-xs' 
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {sugar.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Nutritional Meter Estimations & Details */}
        <div className="pt-2">
          <div className="grid grid-cols-3 gap-2 bg-[#F9F8F5] border border-[#c4c8b7]/25 p-3 rounded-2xl text-[10px] sm:text-xs mb-4 font-mono">
            <div className="text-center border-r border-[#c4c8b7]/25">
              <div className="text-gray-400 font-sans">热量估算</div>
              <div className="text-xs font-bold text-primary mt-0.5">{calories} 大卡/百克</div>
            </div>
            <div className="text-center border-r border-[#c4c8b7]/25">
              <div className="text-gray-400 font-sans">抹茶纯度</div>
              <div className="text-xs font-bold text-emerald-800 mt-0.5">{matchaConcentration}% 奢量</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 font-sans">健康配膳</div>
              <div className="text-xs font-bold text-[#8A9A5B] mt-0.5">膳宿纤维 {fiber}</div>
            </div>
          </div>

          {/* Action button - Binds dynamically to Cart */}
          <button
            onClick={handleAddCustomToCart}
            disabled={justAdded}
            className={`w-full py-4 rounded-2xl text-xs tracking-widest font-serif font-bold transition-all duration-500 shadow-md flex items-center justify-center gap-2 group cursor-pointer ${
              justAdded 
                ? 'bg-emerald-700 text-white border border-emerald-700' 
                : 'bg-primary text-white hover:opacity-95 hover:shadow-lg active:scale-98'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4.5 h-4.5 animate-bounce" />
                <span>定制乐盒已配膳并加入购物车 (1)</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4.5 h-4.5 transform group-hover:-translate-y-0.5 transition-transform" />
                <span>将此定制的 3D 艺术主厨蛋糕加购 • ¥{price}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

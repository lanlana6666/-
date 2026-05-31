/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Leaf, Plus, Minus, ShoppingCart, HelpCircle, Flame, Snowflake, RotateCcw, Box, Check, ArrowLeft, ArrowRight, Play, Pause, Compass, Award } from 'lucide-react';
import { Product } from '../types';

interface ShowroomViewProps {
  onAddToCart: (product: Product, options: { size?: string; sweetness?: string; temp?: string }) => void;
  products: Product[];
  triggerToast?: (msg: string, type: 'success' | 'info' | 'error') => void;
}

// Defining our 3 flagship products specifically designed for this SUNTY showroom pattern:
interface ShowroomProduct {
  id: string;
  name: string;
  enName: string;
  jpName: string;
  price: number;
  bgGrad: string;
  darkColor: string;
  lightColor: string;
  textColor: string;
  accentBadge: string;
  description: string;
  image: string;
  specs: {
    origin: string;
    weight: string;
    temperature: string;
    grindSpeed: string;
    caffeine: string;
    calories: string;
  };
  highlights: string[];
}

const SHOWROOM_PRODUCTS: ShowroomProduct[] = [
  {
    id: 'matcha01',
    name: '御前初摘 · 手打纯薄茶',
    enName: 'MINISTERIAL CEREMONIAL MATCHA',
    jpName: '御前初摘み薄茶',
    price: 48,
    bgGrad: 'from-[#EBF2E3] to-[#D5E2C9]',
    darkColor: '#4A5D22',
    lightColor: '#EBF2E3',
    textColor: '#2E3B15',
    accentBadge: 'bg-[#5C742D] text-white',
    description: '京都宇治首采春茶嫩叶，经传统石磨慢研成超微茶粉。茶汤如翡翠般纯净，泡沫致密饱满，入口先有清新海苔香，再现微苦甘甜的深厚喉韵。',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&fit=crop',
    specs: {
      origin: '京都府宇治田原町',
      weight: '30g 经典和纸罐',
      temperature: '75°C - 80°C 最佳赏味',
      grindSpeed: '每小时慢磨 30 克 (石磨)',
      caffeine: '中等偏低 (0.02%)',
      calories: '约 6 kcal / 杯 (无麸质)'
    },
    highlights: ['100% 石磨极细初茶', '180次古法茶筅起汤花', '回甘悠长细腻']
  },
  {
    id: 'hojicha02',
    name: '极炙炭焙 · 浓香焙茶拿铁',
    enName: 'INTENSE COPPER TOASTED HOJICHA',
    jpName: '極炙炭火ほうじ茶ラテ',
    price: 38,
    bgGrad: 'from-[#F5EDE3] to-[#DFD0BF]',
    darkColor: '#7C4B29',
    lightColor: '#F5EDE3',
    textColor: '#422410',
    accentBadge: 'bg-[#8E532D] text-white',
    description: '秋季最高人气。选用深绿熟成茶茎叶，极高温远红外线陶瓷炭火极限烘焙。完全去除苦涩，融合北海道重瓣厚鲜牛乳，释出极高雅坚果、焦糖、烤面包暖香。',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&fit=crop',
    specs: {
      origin: '滋贺县朝宫茶园',
      weight: '45ml 重浓拿铁冷凝装',
      temperature: '热服 85°C / 极致冷饮',
      grindSpeed: '220°C 炭火滚砂极焙',
      caffeine: '微乎其微 (低于 0.005%)',
      calories: '约 132 kcal / 杯 (厚鲜乳)'
    },
    highlights: ['零咖啡因不伤肠胃', '黄金比例厚牛乳调和', '坚果烤面包浓香']
  },
  {
    id: 'chestnut03',
    name: '丹波蜜栗 · 金桂千层甜点',
    enName: 'DANBA CHESTNUT OSMANTHUS CREPE',
    jpName: '丹波栗と金木犀の千層',
    price: 68,
    bgGrad: 'from-[#FCF1E6] to-[#EBD5BB]',
    darkColor: '#8C561D',
    lightColor: '#FCF1E6',
    textColor: '#57330B',
    accentBadge: 'bg-[#AB6E2C] text-white',
    description: '主厨特研秋日顶级和洋点心。手熟熬制丹波特选金栗泥，搭配轻揉慢炖出的江南金桂花蜜，将其封存在23层蝉翼薄千层皮中，层层微甜，唇齿生花。',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&fit=crop',
    specs: {
      origin: '兵库县丹波篠山极栗',
      weight: '4英寸 分享分享式精制',
      temperature: '最佳温度 4°C 冷藏',
      grindSpeed: '历经 48 小时古法慢摇熟制',
      caffeine: '完全无咖啡因',
      calories: '约 290 kcal / 件'
    },
    highlights: ['手工研磨甘熟栗子泥', '晨采天然金桂花蜜发酵', '含冷链极速配送保障']
  }
];

const getCircularDiff = (index: number, activeIdx: number, total: number) => {
  let diff = index - activeIdx;
  while (diff > total / 2) diff -= total;
  while (diff < -total / 2) diff += total;
  return diff;
};

// Internal component for organic drifting tea bubbles & leaves
function AmbientParticles() {
  const particleCount = 12;
  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const list = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 92 + 4,
      top: Math.random() * 80 + 10,
      size: Math.random() * 8 + 4,
      delay: Math.random() * -15,
      duration: 12 + Math.random() * 15,
    }));
    setParticles(list);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [300, -300],
            x: [0, Math.sin(p.id) * 40, 0],
            rotate: [0, 360],
            opacity: [0, 0.45, 0.45, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
          className="rounded-full flex items-center justify-center bg-[#8A9A5B]/10 border border-[#8A9A5B]/15"
        >
          {p.id % 4 === 0 && <Leaf className="w-2.5 h-2.5 text-[#8A9A5B]/20" />}
        </motion.div>
      ))}
    </div>
  );
}

// Raw data detailing exclusive flavor palettes for flagship collection
const SENSORY_PALETTES: Record<string, Array<{ label: string; score: number; color: string; valDesc: string }>> = {
  matcha01: [
    { label: '御深海苔鲜 (Umami)', score: 95, color: '#4A5D22', valDesc: '特级宇治石磨极鲜' },
    { label: '嫩芽清甘度 (Sweetness)', score: 80, color: '#8A9A5B', valDesc: '天然叶绿素之清甜' },
    { label: '单宁微涩感 (Astringency)', score: 30, color: '#A0AF7E', valDesc: '击拂中和后的柔雅' },
    { label: '炭火焙茶度 (Roast Intensity)', score: 12, color: '#7C4B29', valDesc: '超超低温冷研避火' }
  ],
  hojicha02: [
    { label: '御深海苔鲜 (Umami)', score: 18, color: '#4A5D22', valDesc: '高温焙砂破坏鲜感' },
    { label: '嫩芽清甘度 (Sweetness)', score: 72, color: '#8A9A5B', valDesc: '炭焙慢速糖化香甜' },
    { label: '单宁微涩感 (Astringency)', score: 10, color: '#A0AF7E', valDesc: '完全脱去单宁苦感' },
    { label: '炭火焙茶度 (Roast Intensity)', score: 96, color: '#7C4B29', valDesc: '220°C级真砂远红外炙' }
  ],
  chestnut03: [
    { label: '御深海苔鲜 (Umami)', score: 5, color: '#4A5D22', valDesc: '和洋融合点心甜制' },
    { label: '嫩芽清甘度 (Sweetness)', score: 92, color: '#8A9A5B', valDesc: '丹波极栗桂花蜜厚甘' },
    { label: '单宁微涩感 (Astringency)', score: 0, color: '#A0AF7E', valDesc: '丝滑饱满无苦涩度' },
    { label: '炭火焙茶度 (Roast Intensity)', score: 58, color: '#7C4B29', valDesc: '桂花蜂蜜酿炉炙焦香' }
  ]
};

interface ShowroomCardProps {
  key?: any;
  product: ShowroomProduct;
  index: number;
  activeIdx: number;
  onSelect: () => void;
  onAddItemToPack: (item: ShowroomProduct) => void;
  onAddToCart: (product: Product, options: { size?: string; sweetness?: string; temp?: string }) => void;
  products: Product[];
  triggerToast?: (msg: string, type: 'success' | 'info' | 'error') => void;
}

function ShowroomCard({
  product,
  index,
  activeIdx,
  onSelect,
  onAddItemToPack,
  onAddToCart,
  products,
  triggerToast
}: ShowroomCardProps) {
  const diff = getCircularDiff(index, activeIdx, SHOWROOM_PRODUCTS.length);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  // Interactive sub-tabs on card
  const [activeTab, setActiveTab] = useState<'specs' | 'sensory'>('specs');
  
  // Zen tea whisking interactive game state
  const [isBrewing, setIsBrewing] = useState<boolean>(false);
  const [whiskCount, setWhiskCount] = useState<number>(0);
  const [isWhiskingAnim, setIsWhiskingAnim] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (diff !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // Convert to tilt rotation within +/- 15 degrees
    const rotateX = -(mouseY / (rect.height / 2)) * 15;
    const rotateY = (mouseX / (rect.width / 2)) * 15;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const executeWhiskClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (whiskCount >= 5) return;
    
    setIsWhiskingAnim(true);
    setTimeout(() => setIsWhiskingAnim(false), 200);
    
    const nextCount = whiskCount + 1;
    setWhiskCount(nextCount);
    
    if (nextCount === 5) {
      triggerToast?.('🎉 点茶功德圆满！已唤醒妙华泡沫与茶山甘甜！', 'success');
    } else {
      triggerToast?.(`打茶中(${nextCount}/5)... 筅击击振，茶华萌发`, 'info');
    }
  };

  const isCurrent = diff === 0;
  const isMobile = windowWidth < 640;

  // Horizontal translation with perfect mobile support & spacing checks
  const xValue = diff === 0 ? 0 : diff === -1 ? (isMobile ? -230 : -340) : diff === 1 ? (isMobile ? 230 : 340) : (isMobile ? diff * 300 : diff * 450);
  const zValue = diff === 0 ? 50 : -100;
  const scaleValue = diff === 0 ? 1.05 : 0.85;
  const opacityValue = diff === 0 ? 1 : 0.4;
  const rotateYValue = diff === -1 ? 15 : diff === 1 ? -15 : 0;

  const finalRotateX = isCurrent ? tilt.x : 0;
  const finalRotateY = isCurrent ? tilt.y : rotateYValue;

  // Dynamic light sheen / reflection glare overlay coordinating with 3D tilts
  const glareStyle = {
    background: `radial-gradient(circle at ${50 + tilt.y * 3.5}% ${50 - tilt.x * 3.5}%, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0) 65%)`
  };

  return (
    <motion.div
      onClick={() => {
        if (diff !== 0) onSelect();
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={false}
      aria-hidden={Math.abs(diff) > 1}
      style={{
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        pointerEvents: Math.abs(diff) <= 1 ? 'auto' : 'none',
        visibility: Math.abs(diff) <= 1 ? 'visible' : 'hidden',
        cursor: diff !== 0 ? 'pointer' : 'default',
        zIndex: diff === 0 ? 30 : 10,
      }}
      animate={{
        x: xValue,
        z: zValue,
        scale: scaleValue,
        opacity: opacityValue,
        rotateX: finalRotateX,
        rotateY: finalRotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 900,
        damping: 50,
        mass: 0.3,
      }}
      className={`absolute w-[310px] sm:w-[380px] h-[480px] sm:h-[530px] rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-[#FBFBFA] p-4 sm:p-5 flex flex-col justify-between`}
    >
      {/* Dynamic Mirror Glare */}
      {isCurrent && (
        <div 
          className="absolute inset-0 pointer-events-none z-20 opacity-80 mix-blend-overlay" 
          style={glareStyle} 
        />
      )}

      {/* Interactive Micro-Game Zen Brewing Ritual Overlay */}
      <AnimatePresence>
        {isBrewing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0F100D]/95 backdrop-blur-xl z-40 p-4 sm:p-6 flex flex-col justify-between text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#8A9A5B] block">KYOTO ZEN BREW</span>
                <h4 className="font-serif text-sm font-bold text-neutral-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  手打茶道修行 · 击拂妙华
                </h4>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setIsBrewing(false); }}
                className="text-neutral-400 hover:text-white font-mono text-xs border border-white/10 rounded-full px-2 py-0.5"
              >
                关闭 ESC
              </button>
            </div>

            {/* Simulated Whisk Container */}
            <div className="my-auto flex flex-col items-center justify-center text-center py-4">
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-b from-[#181a15] to-[#2B3519] border-2 border-[#8A9A5B]/25 flex items-center justify-center overflow-hidden mb-4">
                
                {/* Floating green particles / bubbles according to bubble parameters */}
                {[...Array(whiskCount * 3 + 2)].map((_, i) => (
                  <motion.div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: 4 + (i % 3) * 3,
                      height: 4 + (i % 3) * 3,
                      borderRadius: '50%',
                    }}
                    animate={{
                      y: [40, -50],
                      x: [Math.sin(i) * 30, Math.cos(i) * 30],
                      opacity: [0, 0.8, 0],
                      scale: [1, 1.4, 0.8],
                    }}
                    transition={{
                      duration: 1.5 + (i % 2),
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    className={`bg-emerald-300/40 border border-emerald-400/20`}
                  />
                ))}

                {/* Animated Tea Whisk (茶筅) */}
                <motion.div
                  animate={isWhiskingAnim ? {
                    rotate: [-15, 15, -15, 0],
                    x: [-8, 8, -8, 0],
                    scale: [1, 1.1, 0.95]
                  } : {
                    rotate: [0, 5, -5, 0],
                    y: [0, -3, 0]
                  }}
                  transition={{
                    duration: isWhiskingAnim ? 0.25 : 3,
                    repeat: isWhiskingAnim ? 0 : Infinity,
                    ease: 'easeInOut'
                  }}
                  className="z-10 cursor-pointer origin-bottom"
                  onClick={executeWhiskClick}
                >
                  {/* Whisk Icon SVG */}
                  <svg className="w-16 h-16 drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Bamboo Handle */}
                    <rect x="28" y="4" width="8" height="24" rx="2" fill="#D8B589" stroke="#9E7643" strokeWidth="1.5"/>
                    <line x1="28" y1="12" x2="36" y2="12" stroke="#9E7643" strokeWidth="1.5"/>
                    <line x1="28" y1="20" x2="36" y2="20" stroke="#9E7643" strokeWidth="1.5"/>
                    {/* Bamboo Threads / Strings */}
                    <path d="M22 28 C22 28, 14 44, 14 56 C14 58, 16 60, 20 60 C24 60, 28 50, 32 44 C36 50, 40 60, 44 60 C48 60, 50 58, 50 56 C50 44, 42 28, 42 28 Z" fill="#F1DCC1" stroke="#AC824E" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M28 28 L18 56 M30 28 L28 58 M32 28 L32 58 M34 28 L36 58 M36 28 L46 56" stroke="#AC824E" strokeWidth="1.2"/>
                  </svg>
                </motion.div>
              </div>

              {whiskCount < 5 ? (
                <>
                  <p className="font-serif text-xs text-neutral-300 mb-1 max-w-xs leading-relaxed">
                    连续点击上面的 <span className="text-[#8A9A5B] font-bold">茶筅</span>。筅击急击，使空气注入茶粉与其高度乳化，焕活名茶灵魂之甘原香。
                  </p>
                  <span className="font-mono text-[10px] text-amber-200 uppercase tracking-widest block bg-white/5 px-3 py-1 rounded-full border border-white/5 animate-pulse mt-1 select-none">
                    打茶指引: {whiskCount} / 5 连击
                  </span>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white/5 border border-amber-300/20 rounded-2xl p-3 max-w-xs"
                >
                  <div className="flex justify-center mb-1">
                    <Award className="w-5 h-5 text-amber-400 animate-bounce" />
                  </div>
                  <h5 className="font-serif text-xs font-bold text-amber-300">「御前一等赏·极上妙华」</h5>
                  <p className="font-serif text-[10px] text-neutral-300 mt-1 leading-normal">
                    您已拂击出万颗醇棉松软的顶级微气泡。茶香高爽，喉韵甜美如江南金雨。
                  </p>
                </motion.div>
              )}
            </div>

            {/* Actions bottom */}
            <div>
              {whiskCount >= 5 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBrewing(false);
                    onAddItemToPack(product);
                    triggerToast?.(`🍵 妙手点茶版【${product.name}】已置入托盘！`, 'success');
                  }}
                  className="w-full text-center py-2.5 bg-[#8A9A5B] hover:bg-[#6c7d3d] text-slate-900 font-serif text-[11px] font-extrabold rounded-full tracking-wider transition-all shadow-md active:scale-95"
                >
                  以茶人礼仪：收纳进我的定制礼盒
                </button>
              ) : (
                <button
                  type="button"
                  onClick={executeWhiskClick}
                  className="w-full text-neutral-900 bg-white hover:bg-neutral-100 font-serif text-[11px] font-extrabold py-2 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  快速打茶 +1
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}>
        {/* Top brand badge & number */}
        <div className="flex items-center justify-between mb-2 h-[24px]" style={{ transform: 'translateZ(10px)' }}>
          <span className={`px-2 py-0.5 text-[9px] font-mono tracking-widest font-extrabold uppercase rounded-full ${product.accentBadge} shadow-xs`}>
            {product.enName.split(' ')[0]} SPECIAL
          </span>
          <span className="font-serif text-[10px] font-bold text-[#5C633F] opacity-95 tracking-wider">
            ★ NO. 0{index + 1}
          </span>
        </div>

        {/* Beautiful Image Slot with 3D layers inside */}
        <div 
          className="w-full h-[150px] sm:h-[185px] rounded-2xl overflow-hidden relative shadow-md mb-3 select-none group border border-stone-200"
          style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
        >
          <img src={product.image} alt={product.name} className="w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
          
          {/* Floating Japanese Typography Accent Overlay - POPPED OUT */}
          <div 
            style={{ transform: 'translateZ(35px)' }}
            className="absolute top-3 left-3 font-serif writing-mode-vertical text-stone-900 bg-[#FAF9F5]/90 border border-amber-800/20 backdrop-blur-xs px-1.5 py-2 rounded text-[9px] tracking-widest font-black text-center shadow-md select-none"
          >
            精·淹·手·作
          </div>

          {/* Interactive Zen Brewing Trigger Button on Image - SUPER PREMIUM! */}
          {isCurrent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBrewing(true);
                setWhiskCount(0);
              }}
              style={{ transform: 'translateZ(40px)' }}
              className="absolute top-3 right-3 bg-stone-900/80 hover:bg-[#5C633F] text-[#FAF9F5] border border-amber-200/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-serif font-bold tracking-wider hover:scale-105 active:scale-95 transition-all text-center flex items-center gap-1 cursor-pointer shadow-md select-none"
              title="禅意点茶仪式"
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
              <span>手打茶道</span>
            </button>
          )}

          <div className="absolute bottom-2.5 left-3 right-3 text-white text-[10px] pointer-events-none" style={{ transform: 'translateZ(20px)' }}>
            <span className="font-mono uppercase tracking-[0.25em] opacity-80 block mb-0.5 text-[8px] sm:text-[9px]">
              {product.enName}
            </span>
            <p className="font-serif italic font-extrabold text-[#ECECE5] text-xs">
              {product.jpName}
            </p>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="font-serif text-base sm:text-[17px] font-black tracking-tight text-neutral-950 leading-tight mb-1" style={{ transform: 'translateZ(20px)' }}>
          {product.name}
        </h3>
        
        <p className="font-serif text-[10px] sm:text-[11px] leading-relaxed text-stone-600 font-medium line-clamp-2 mb-3.5" style={{ transform: 'translateZ(10px)' }}>
          {product.description}
        </p>

        {/* Ultra Premium Component Tabs: Specs parameter lists vs Flavor palette! */}
        <div className="flex border-b border-[#c4c8b7]/30 pb-1.5 mb-2.5 gap-4" style={{ transform: 'translateZ(30px)' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveTab('specs'); }}
            className={`font-serif text-[10px] sm:text-xs tracking-wider pb-0.5 relative transition-all ${
              activeTab === 'specs' 
                ? 'text-[#5C633F] font-bold border-b border-[#5C633F]' 
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            造物工艺 (SPECS)
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveTab('sensory'); }}
            className={`font-serif text-[10px] sm:text-xs tracking-wider pb-0.5 relative transition-all ${
              activeTab === 'sensory' 
                ? 'text-[#5C633F] font-bold border-b border-[#5C633F]' 
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            风味轮度 (PALETTE)
          </button>
        </div>

        {/* Dynamic Inner Tab Interface Body */}
        <div style={{ transform: 'translateZ(25px)' }} className="h-[96px] sm:h-[105px]">
          <AnimatePresence mode="wait">
            {activeTab === 'specs' ? (
              <motion.div
                key="specs-tab"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-2 gap-2 h-full"
              >
                {[
                  { label: '茶山产地 (ORIGIN)', val: product.specs.origin },
                  { label: '成品毛量 (WT)', val: product.specs.weight },
                  { label: '温控 (TEMP)', val: product.specs.temperature.split(' ')[0] },
                  { label: '碳卡 (CALORIES)', val: product.specs.calories.split(' ')[0] }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#FAF9F5] rounded-lg p-1.5 border border-[#c4c8b7]/20 hover:border-[#5C633F]/35 transition-all">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-stone-400 block leading-tight mb-0.5">
                      {item.label}
                    </span>
                    <span className="font-serif font-extrabold text-[10px] sm:text-xs text-stone-800 antialiased line-clamp-1">
                      {item.val}
                    </span>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="sensory-tab"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-1.5 h-full justify-center"
              >
                {(SENSORY_PALETTES[product.id] || []).map((bar, idx) => (
                  <div key={idx} className="w-full">
                    <div className="flex justify-between items-center text-[8.5px] font-serif font-bold text-stone-700 leading-none mb-0.5">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: bar.color }}></span>
                        {bar.label}
                      </span>
                      <span className="text-[8px] font-mono text-stone-500 opacity-90 font-medium">
                        {bar.valDesc} ({bar.score}%)
                      </span>
                    </div>
                    {/* Exquisite custom progress bar */}
                    <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.score}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        style={{ backgroundColor: bar.color }}
                        className="h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer row containing prices and actions with Pop-out styling */}
      <div 
        className="border-t border-stone-200/70 pt-2.5 sm:pt-3 flex items-center justify-between"
        style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}
      >
        <div>
          <span className="text-[8px] font-mono uppercase tracking-widest text-[#5C633F]/70 block leading-none mb-0.5">
            SHOWROOM EXCLUSIVE
          </span>
          <span className="font-serif text-lg sm:text-x1 font-black text-stone-900 flex items-baseline leading-none">
            <span className="text-xs mr-0.5">¥</span>
            {product.price}
          </span>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddItemToPack(product);
            }}
            className="py-1.5 sm:py-2 px-2.5 sm:px-3.5 bg-[#5C633F] hover:bg-[#4A5D22] text-[#FAF9F5] font-serif text-[10px] font-bold rounded-full active:scale-95 transition-all flex items-center gap-1 cursor-pointer shadow-xs border border-white/20 select-none"
          >
            <Plus className="w-3 h-3" />
            置入礼盒
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              let matchingSystemProduct = products.find(p => p.id === 'hojicha-lat');
              if (product.id === 'matcha01') {
                matchingSystemProduct = products.find(p => p.id === 'ceremonial-matcha') || matchingSystemProduct;
              } else if (product.id === 'hojicha02') {
                matchingSystemProduct = products.find(p => p.id === 'hojicha-lat') || matchingSystemProduct;
              } else if (product.id === 'chestnut03') {
                matchingSystemProduct = products.find(p => p.id === 'autumn-montblanc') || matchingSystemProduct;
              }
              if (matchingSystemProduct) {
                onAddToCart(matchingSystemProduct, { size: '标准装', sweetness: '微甜', temp: '经典冰敷' });
                triggerToast?.(`🍁 已快速置入1份【${product.name}】`, 'success');
              }
            }}
            className="py-1.5 sm:py-2 px-2.5 sm:px-3.5 bg-[#F4F3ED] border border-stone-300 text-[#422410] font-serif text-[10px] font-bold rounded-full hover:bg-stone-100 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShowroomView({
  onAddToCart,
  products,
  triggerToast
}: ShowroomViewProps) {
  // Current active showcase index
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeProduct = SHOWROOM_PRODUCTS[activeIdx];

  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Handle automatic cycle with user hover pausing
  useEffect(() => {
    if (!isAutoplay || isHovered) return;
    const interval = setInterval(() => {
      setActiveIdx(prev => (prev === SHOWROOM_PRODUCTS.length - 1 ? 0 : prev + 1));
    }, 4500); // Gentle 4.5s autoplay rotation
    return () => clearInterval(interval);
  }, [isAutoplay, isHovered]);

  // Keyboard arrow key listener for showroom sliding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Rotate between products using left and right keys when showroom is visible
      if (e.key === 'ArrowLeft') {
        setActiveIdx(prev => (prev === 0 ? SHOWROOM_PRODUCTS.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIdx(prev => (prev === SHOWROOM_PRODUCTS.length - 1 ? 0 : prev + 1));
      } else if (e.key === ' ') {
        // Toggle play/pause on Spacebar
        e.preventDefault();
        setIsAutoplay(v => !v);
        triggerToast?.(isAutoplay ? '⏸ 已暂停自动放映' : '▶ 已启动自动放映及3D空间流转', 'info');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAutoplay, triggerToast]);

  // Custom Bundle State (Tray Packer)
  const [packSize, setPackSize] = useState<3 | 6>(3); // 3-pack or 6-pack
  const [packedItems, setPackedItems] = useState<ShowroomProduct[]>([]);

  // Helpers for adding items inside SUNTY bundle custom packer
  const handleAddItemToPack = (item: ShowroomProduct) => {
    if (packedItems.length >= packSize) {
      triggerToast?.(`⚠️ 该和风托盘最多只能容纳 ${packSize} 件甜品，请先剔除部分商品。`, 'error');
      return;
    }
    setPackedItems(prev => [...prev, item]);
    triggerToast?.(`➕ 已放入 ${item.name} 到定制礼盒托盘`, 'info');
  };

  const handleRemoveItemFromPack = (index: number) => {
    setPackedItems(prev => prev.filter((_, i) => i !== index));
    triggerToast?.(`➖ 已从定制礼盒托盘中移出一件甜品`, 'info');
  };

  const handleClearPack = () => {
    setPackedItems([]);
    triggerToast?.(`🔄 已清空当前的盒装托盘`, 'info');
  };

  // Convert Showroom bundle back onto global cart structure
  const handleBuyBundle = () => {
    if (packedItems.length === 0) {
      triggerToast?.('⚠️ 托盘目前是空的，请添加一些秋叶茶礼后再购买。', 'error');
      return;
    }

    // Loop through each packed item and match it against the genuine products collection
    // (creating fallback dummy item if ID is showroom-specific)
    packedItems.forEach(item => {
      // Look up corresponding product in system products data
      let matchingSystemProduct = products.find(p => p.id === 'hojicha-lat'); // Fallback hojicha
      if (item.id === 'matcha01') {
        matchingSystemProduct = products.find(p => p.id === 'ceremonial-matcha') || matchingSystemProduct;
      } else if (item.id === 'hojicha02') {
        matchingSystemProduct = products.find(p => p.id === 'hojicha-lat') || matchingSystemProduct;
      } else if (item.id === 'chestnut03') {
        matchingSystemProduct = products.find(p => p.id === 'autumn-montblanc') || matchingSystemProduct;
      }

      if (matchingSystemProduct) {
        onAddToCart(matchingSystemProduct, {
          size: item.specs.weight.split(' ')[0],
          sweetness: '半糖(少甜)',
          temp: '常规(冰温)'
        });
      }
    });

    triggerToast?.(`🎉 已成功将定制的 ${packedItems.length} 件 SUNTY 极简和风甜点礼包同步至购物清单！`, 'success');
  };

  // Calculate prices for the packed drawer (gives 15% discount for complete boxes!)
  const rawTotalPrice = packedItems.reduce((acc, item) => acc + item.price, 0);
  const discountMultiplier = packedItems.length === packSize ? 0.85 : 1.0; // 15% discount if exact filled
  const discountedTotalPrice = Math.round(rawTotalPrice * discountMultiplier);

  return (
    <div className="w-full min-h-screen bg-[#FDFCF8] text-[#333333] transition-colors duration-300">
      
      {/* 1. Header Hero Brutalist Banner (SUNTY Style) */}
      <section className="relative pt-20 pb-16 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col justify-center items-center text-center rounded-3xl bg-[#1A1D13] border border-white/5 shadow-2xl my-6 overflow-hidden">
        {/* Elegant top ambient backdrop glow supporting the custom colors */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[160px] bg-[#C7DCA7]/25 blur-[90px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#D2DEC1] opacity-90 font-mono text-[10px] tracking-[0.4em] uppercase font-bold mb-4 relative z-10"
        >
          SUNTY DESIGN REFERENCE • ARTISANAL TEA SHOWCASE
        </motion.div>
        
        <h1 className="font-serif italic text-[74px] font-bold tracking-tight mb-4 text-[#C7DCA7] relative z-10 drop-shadow-[0_2px_15px_rgba(199,220,167,0.2)]">
          御 茶 秀 场
        </h1>
        <p className="font-serif text-xs sm:text-sm text-[#D2DEC1] max-w-xl leading-relaxed tracking-wide relative z-10">
          源于 SUNTY 原创高端和风交互设计。柔和流转色彩、返璞自然材质与个性自选包点，重塑东方茶点社交交互。
        </p>

        {/* Dynamic floating badge mimicking high-end UI */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] font-mono border border-white/10 rounded-full px-6 py-2.5 bg-white/5 backdrop-blur-md shadow-lg text-white/90 relative z-10">
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#C7DCA7]" /> STATIC PRESSURE GROUND</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#C7DCA7]" /> ZERO CONSERVATIVES</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#C7DCA7]" /> ARTISAN WHIPPED</span>
        </div>
      </section>

      {/* 2. Flagship Interactive Showroom (Dynamic Color Sync) */}
      <section className="relative w-full py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#c4c8b7]/40 pb-8">
            <div>
              <p className="font-mono text-[9px] text-[#8A9A5B] uppercase tracking-[0.25em] mb-1.5 font-bold">
                01 / THE SHOWROOM ASSORTMENT
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-[#333333]">
                主厨严选一等品
              </h2>
            </div>

            {/* Quick Flagship Toggles (Heavy typography buttons) */}
            <div className="flex border border-[#c4c8b7]/40 rounded-xl p-1 bg-[#E8EAE0]/45">
              {SHOWROOM_PRODUCTS.map((prod, index) => (
                <button
                  key={prod.id}
                  onClick={() => setActiveIdx(index)}
                  className={`px-4 py-2 font-serif text-xs font-bold transition-all duration-300 rounded-md cursor-pointer ${
                    activeIdx === index
                      ? 'bg-white text-[#5C633F] border border-[#c4c8b7]/30 shadow-xs font-semibold'
                      : 'text-neutral-500 hover:text-[#5C633F]'
                  }`}
                >
                  {prod.name.split(' · ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Carousel Presentation (With 3-card optical controls, spring physics, and pointer drag tilt) */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-full h-[520px] sm:h-[570px] flex flex-col items-center justify-center overflow-hidden my-4 py-6 perspective-[1500px]"
          >
            {/* Ambient colorful glowing orbs matching SUNTY high-end aesthetic */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-100/35 blur-3xl pointer-events-none z-0 animate-pulse duration-[8000ms]"></div>
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-50/30 blur-3xl pointer-events-none z-0 animate-pulse duration-[12000ms]"></div>

            {/* Premium organic floating particles and leaves */}
            <AmbientParticles />

            {/* Dynamic Autoplay Pill Controller */}
            <div className="absolute top-4 right-4 z-40 flex items-center gap-2 bg-white/75 backdrop-blur-md py-1.5 px-3 rounded-full border border-[#c4c8b7]/40 shadow-xs">
              <button
                onClick={() => {
                  setIsAutoplay(!isAutoplay);
                  triggerToast?.(!isAutoplay ? '▶ 启动3D自动轮播' : '⏸ 暂停自动放映，您可以更自由地进行3D倾斜探索', 'info');
                }}
                className="flex items-center gap-1.5 font-mono text-[9px] text-[#5C633F] hover:text-[#4a5624] active:scale-95 transition-all select-none font-bold"
                type="button"
              >
                {isAutoplay ? (
                  <>
                    <Pause className="w-2.5 h-2.5 text-emerald-700 fill-emerald-700 animate-pulse" />
                    <span>AUTOPLAY ON</span>
                  </>
                ) : (
                  <>
                    <Play className="w-2.5 h-2.5 text-neutral-400 fill-neutral-400" />
                    <span className="text-neutral-400">AUTOPLAY OFF</span>
                  </>
                )}
              </button>
            </div>

            {/* Elegant layout backdrop line */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#c4c8b7]/40 to-transparent"></div>
            
            {/* Absolute Slider Track Frame holding symmetric cards */}
            <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
              <AnimatePresence initial={false}>
                {SHOWROOM_PRODUCTS.map((prod, index) => (
                  <ShowroomCard
                    key={prod.id}
                    product={prod}
                    index={index}
                    activeIdx={activeIdx}
                    onSelect={() => setActiveIdx(index)}
                    onAddItemToPack={handleAddItemToPack}
                    onAddToCart={onAddToCart}
                    products={products}
                    triggerToast={triggerToast}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Gentle pause indicator displayed during active interaction */}
            {isHovered && isAutoplay && (
              <div className="absolute bottom-1 z-40 bg-[#5C633F]/90 text-[white] font-mono text-[8px] tracking-widest font-black py-0.5 px-2.5 rounded-full select-none shadow-xs backdrop-blur-xs transition-all pointer-events-none">
                PAUSED ON HOVER
              </div>
            )}

            {/* Float Floating Interactive Aesthetic Navigation Arrows */}
            <button
              onClick={() => setActiveIdx(prev => (prev === 0 ? SHOWROOM_PRODUCTS.length - 1 : prev - 1))}
              className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 rounded-full bg-white/95 hover:bg-[#E8EAE0] border border-[#c4c8b7]/40 text-[#5C633F] shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center select-none"
              title="上一个 (←)"
              type="button"
            >
              <ArrowLeft className="w-4.5 h-4.5 sm:w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveIdx(prev => (prev === SHOWROOM_PRODUCTS.length - 1 ? 0 : prev + 1))}
              className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 rounded-full bg-white/95 hover:bg-[#E8EAE0] border border-[#c4c8b7]/40 text-[#5C633F] shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center select-none"
              title="下一个 (→)"
              type="button"
            >
              <ArrowRight className="w-4.5 h-4.5 sm:w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. SUNTY-Style Masterpiece: The Custom Pack Mixer Tray */}
      <section className="bg-[#F1F2ED] py-20 px-4 border-t border-b border-[#c4c8b7]/40 relative overflow-hidden">
        
        {/* Subtle grids mimicking SUNTY minimalist web layout */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-black/10 to-transparent"></div>
        <div className="absolute inset-y-0 left-10 w-px bg-black/5 hidden lg:block"></div>
        <div className="absolute inset-y-0 right-10 w-px bg-black/5 hidden lg:block"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.3em] font-mono text-[#8A9A5B] bg-white border border-[#c4c8b7]/40 shadow-xs px-4 mb-3.5 py-1.5 rounded-full font-bold uppercase inline-block">
              02 / THE CHAWAN PACKER MIXER
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#333333] mt-1.5">
              御茶托盘自选混配装
            </h2>
            <p className="text-xs text-[#555555] max-w-md mx-auto mt-3 leading-relaxed font-serif">
              挑选心仪的春初手作茶品与节令点心装点您的精制漆盘，填满后即可解锁 15% 极上特惠。
            </p>
          </div>

          {/* Toggle Gift Tray Size */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
            <button
               onClick={() => {
                 setPackSize(3);
                 setPackedItems([]); // Reset current packer to avoid overflow
               }}
               className={`px-6 py-3 font-serif text-xs font-bold transition-all border rounded-xl flex items-center gap-2 cursor-pointer ${
                 packSize === 3
                   ? 'bg-white text-[#5C633F] border-[#5C633F] shadow-sm'
                   : 'bg-white/50 text-[#555555] border-[#c4c8b7]/50 hover:border-[#525732]/30 hover:bg-white/80'
               }`}
            >
               <Box className="w-4 h-4 text-[#8A9A5B]" />
               禅茶三合托盘礼盒 (3入/15%立减)
            </button>
            <button
               onClick={() => {
                 setPackSize(6);
                 setPackedItems([]);
               }}
               className={`px-6 py-3 font-serif text-xs font-bold transition-all border rounded-xl flex items-center gap-2 cursor-pointer ${
                 packSize === 6
                   ? 'bg-white text-[#5C633F] border-[#5C633F] shadow-sm'
                   : 'bg-white/50 text-[#555555] border-[#c4c8b7]/50 hover:border-[#525732]/30 hover:bg-white/80'
               }`}
            >
               <Box className="w-4 h-4 text-[#8A9A5B]" />
               国色御六盒装珍藏 (6入/15%立减)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Interactive tray packer area representing packed slots */}
            <div className="lg:col-span-7 bg-white border border-[#c4c8b7]/40 shadow-sm rounded-3xl p-6 sm:p-8">
              
              <div className="flex items-center justify-between mb-6 border-b border-[#c4c8b7]/30 pb-4">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#333333] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                    秋叶御用木质漆案
                  </h4>
                  <p className="text-[10px] font-mono text-[#555555] uppercase tracking-wider mt-1">
                    YOUR EXQUISITE TRAY: {packedItems.length} OF {packSize} FILLED
                  </p>
                </div>

                <button
                  onClick={handleClearPack}
                  disabled={packedItems.length === 0}
                  className="text-neutral-400 hover:text-[#5C633F] transition-colors disabled:opacity-30 disabled:pointer-events-none p-1"
                  title="重置托盘"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Graphical representation of selected box elements */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[...Array(packSize)].map((_, index) => {
                  const packedProduct = packedItems[index];

                  return (
                    <div
                      key={index}
                      className={`relative aspect-square rounded-2xl border transition-all flex flex-col justify-between p-3 overflow-hidden ${
                        packedProduct
                          ? 'bg-[#E8EAE0]/20 border-[#c4c8b7]/50 shadow-xs'
                          : 'border-dashed border-[#c4c8b7]/80 bg-[#E8EAE0]/10 hover:bg-[#E8EAE0]/30'
                      }`}
                    >
                      {packedProduct ? (
                        <>
                          {/* Item Preview content */}
                          <img
                            src={packedProduct.image}
                            alt={packedProduct.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs"
                          />
                          <div className="relative z-10 flex flex-col h-full justify-between">
                            <span className="font-mono text-[9px] text-[#8A9A5B] font-bold">
                              SLOT {index + 1}
                            </span>
                            
                            <div>
                              <p className="font-serif font-bold text-xs leading-tight text-[#333333] line-clamp-2 mb-1">
                                {packedProduct.name.split(' · ')[0]}
                              </p>
                              <p className="font-mono text-[9px] text-[#555555] leading-none">
                                ¥{packedProduct.price}
                              </p>
                            </div>

                            <button
                              onClick={() => handleRemoveItemFromPack(index)}
                              className="text-[10px] font-sans text-rose-600 hover:text-rose-800 transition-colors mt-2 text-left hover:underline font-semibold"
                            >
                              移出托盘 ×
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-[#8A9A5B]/80 font-medium gap-1 select-none">
                          <span className="text-xs font-mono font-bold">SLOT {index + 1}</span>
                          <span className="text-[10px]">待充盈</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Set summary price and proceed to Buy button */}
              <div className="border-t border-[#c4c8b7]/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif text-sm font-bold text-[#333333]">Showroom 定制合集</span>
                    {packedItems.length === packSize && (
                      <span className="text-[9px] font-sans font-bold text-[#FCF1E6] bg-amber-700 px-2 py-0.5 rounded-sm">
                        合组15%立减包邮已达成!
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#555555] font-mono">
                    {packedItems.length === 0
                      ? '请在右侧选择好物装点您的托盘...'
                      : `包含 ${packedItems.length} 件高级单品`}
                  </p>
                </div>

                <div className="flex items-center gap-4.5 shrink-0">
                  <div className="text-right">
                    <div className="flex items-baseline gap-1.5 justify-end">
                      {packedItems.length === packSize && (
                        <span className="text-xs text-neutral-400 line-through">
                          ¥{rawTotalPrice}
                        </span>
                      )}
                      <span className="text-xl sm:text-2xl font-serif font-bold text-amber-850">
                        ¥{discountedTotalPrice}
                      </span>
                    </div>
                    {packedItems.length > 0 && packedItems.length < packSize && (
                      <span className="text-[9px] font-sans text-amber-800 block select-none font-semibold">
                        *再加入 {packSize - packedItems.length} 件即可激减 15% 优惠!
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleBuyBundle}
                    disabled={packedItems.length === 0}
                    className="py-3 px-6 bg-[#5C633F] hover:bg-[#4d5232] text-white font-serif text-xs font-bold rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    购入此合集
                  </button>
                </div>
              </div>

            </div>

            {/* Right Side: Showcase Selection Drawer to pack from */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="font-serif text-sm font-bold text-[#333333] uppercase tracking-wider mb-2">
                可放入托盘的极上点心
              </h4>

              {SHOWROOM_PRODUCTS.map(item => {
                const alreadyPackedCount = packedItems.filter(i => i.id === item.id).length;

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#c4c8b7]/40 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-[#5C633F]/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#c4c8b7]/30">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-serif text-xs font-bold text-[#333333]">{item.name.split(' · ')[0]}</p>
                        <p className="font-mono text-[9px] text-[#8A9A5B] font-semibold">{item.enName.substring(0, 24)}...</p>
                        <p className="text-[10px] text-amber-800 font-serif font-bold mt-0.5">¥{item.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {alreadyPackedCount > 0 && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-700 px-2 py-0.5 font-bold font-serif rounded-full border border-amber-500/20 font-semibold">
                          {alreadyPackedCount} 枚
                        </span>
                      )}
                      
                      <button
                        onClick={() => handleAddItemToPack(item)}
                        className="p-1 px-3 bg-[#E8EAE0]/20 hover:bg-[#E8EAE0]/50 border border-[#c4c8b7] text-[#5C633F] rounded-full font-serif text-[11px] font-bold transition-all cursor-pointer"
                      >
                        加入托盘 +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 4. Brand Core Advantages Bento (SUNTY Reference) */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <p className="font-mono text-[10px] text-neutral-500 tracking-[0.3em] uppercase mb-1">
            03 / BRAND CORE ADVANTAGES
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#333333]">
            不 妥 协 的 纯 粹 本 质
          </h2>
          <div className="w-10 h-0.5 bg-[#c4c8b7] mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white border border-[#c4c8b7]/45 rounded-2xl p-6.5 hover:bg-[#E8EAE0]/15 hover:shadow-md transition-all">
            <span className="text-[#8A9A5B] font-serif text-3xl font-light mb-4 block">01</span>
            <h4 className="font-serif text-base font-bold text-[#333333] mb-2">零添加剂防腐剂</h4>
            <p className="text-xs text-[#555555] leading-relaxed font-serif">
              拒绝任何防腐剂、人造色素与人工甜味剂，完全依靠宇治初茶自身的天然抗氧化特性与古法脱干，极度健康安全。
            </p>
          </div>

          <div className="bg-white border border-[#c4c8b7]/45 rounded-2xl p-6.5 hover:bg-[#E8EAE0]/15 hover:shadow-md transition-all">
            <span className="text-[#8A9A5B] font-serif text-3xl font-light mb-4 block">02</span>
            <h4 className="font-serif text-base font-bold text-[#333333] mb-2">手摇手打微气泡</h4>
            <p className="text-xs text-[#555555] leading-relaxed font-serif">
               茶艺师每杯经历180秒的高强度茶筅手打，注入千万颗天然细密泡沫，完全中和茶叶本身的苦涩，释放海苔清甜。
            </p>
          </div>

          <div className="bg-white border border-[#c4c8b7]/45 rounded-2xl p-6.5 hover:bg-[#E8EAE0]/15 hover:shadow-md transition-all">
            <span className="text-[#8A9A5B] font-serif text-3xl font-light mb-4 block">03</span>
            <h4 className="font-serif text-base font-bold text-[#333333] mb-2">京都小森一级赏</h4>
            <p className="text-xs text-[#555555] leading-relaxed font-serif">
              所有春初嫩叶皆与京都府宇治田原町的高端有机茶园直接签订契约，全程冷链恒温专线，保障初摘高爽品质。
            </p>
          </div>

          <div className="bg-white border border-[#c4c8b7]/45 rounded-2xl p-6.5 hover:bg-[#E8EAE0]/15 hover:shadow-md transition-all">
            <span className="text-[#8A9A5B] font-serif text-3xl font-light mb-4 block">04</span>
            <h4 className="font-serif text-base font-bold text-[#333333] mb-2">和纸美学环保盒</h4>
            <p className="text-xs text-[#555555] leading-relaxed font-serif">
              外包装采用可100%自然降解的日本越前手绢手工和纸重包装，精雕泥金纹案，低碳环保，富有触觉暖意。
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

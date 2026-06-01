/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Flame, 
  ArrowUpRight, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  Compass, 
  Grid,
  Sparkles,
  Star
} from 'lucide-react';
import { Product } from '../types';
import { products } from '../data';

interface InteractiveCardProps {
  prod: Product;
  isActive: boolean;
  onSelect: () => void;
  cardWidthClass: string;
  cardHeightClass: string;
}

function InteractiveCard({
  prod,
  isActive,
  onSelect,
  cardWidthClass,
  cardHeightClass,
}: InteractiveCardProps) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const percentX = mouseX / (width / 2);
    const percentY = mouseY / (height / 2);

    // Limit to ±15 degrees tilt
    setTilt({
      rotateX: -percentY * 15,
      rotateY: percentX * 15,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      className="w-full h-full text-left"
      style={{
        transformStyle: "preserve-3d" as const,
      }}
      animate={{
        rotateX: isActive ? tilt.rotateX : 0,
        rotateY: isActive ? tilt.rotateY : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
    >
      <div className={`w-full h-full rounded-3xl bg-white border p-4 sm:p-5 flex flex-col justify-between shadow-xl relative transition-all duration-300 cursor-pointer select-none ${
        isActive 
          ? 'ring-6 ring-emerald-800/15 border-emerald-800 bg-gradient-to-b from-white via-white to-[#FDFCF8]' 
          : 'border-[#c4c8b7]/30 hover:border-[#8A9A5B]/60'
      }`}>
        {/* Rounded circular Image inside card */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-beige shadow-inner mb-4 pointer-events-none">
          <img
            src={prod.image}
            alt={prod.name}
            className="w-full h-full object-cover transition-transform duration-500"
            draggable={false}
          />
          
          {/* Rating stars overlay */}
          <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-primary flex items-center gap-0.5 shadow-sm">
            <Star className="w-3.5 h-3.5 text-emerald-800 fill-emerald-800" />
            <span>{prod.rating}</span>
          </div>

          {/* Quick Discount Badge */}
          {prod.originalPrice && (
            <div className="absolute top-2.5 left-2.5 bg-red-600 text-white font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">
              极
            </div>
          )}
        </div>

        {/* Text and title info */}
        <div className="flex-grow flex flex-col justify-center pointer-events-none mb-1">
          <h4 className="font-serif text-base sm:text-lg text-on-surface font-extrabold line-clamp-1 leading-tight mb-1 text-gray-800">
            {prod.name}
          </h4>
          <span className="text-[10px] text-outline font-mono uppercase tracking-wider block truncate text-gray-400">
            {prod.enName}
          </span>
        </div>

        {/* Price tag */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#c4c8b7]/25 select-none">
          <span className="text-base sm:text-lg font-black font-mono text-emerald-800">
            ¥{prod.price}
          </span>
          
          <span className="text-xs font-sans font-extrabold text-[#5C633F] flex items-center gap-0.5">
            {isActive ? '定制详情 ➔' : '点击对齐'}
          </span>
        </div>

        {/* Double animated border glow for active element */}
        {isActive && (
          <div className="absolute inset-0 rounded-3xl border-2 border-emerald-800/30 pointer-events-none animate-pulse" />
        )}
      </div>
    </motion.div>
  );
}

interface CatalogViewProps {
  category: 'all' | 'cakes' | 'drinks' | 'icecream' | 'gifts';
  onSelectCategory: (category: 'all' | 'cakes' | 'drinks' | 'icecream' | 'gifts') => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, options: {}) => void;
}

export default function CatalogView({
  category,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
}: CatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'priceDesc'>('rating');
  const [layoutMode, setLayoutMode] = useState<'fan' | 'grid'>('fan');
  const [activeIndex, setActiveIndex] = useState(0);

  // Responsive state to compute the semicircular rotation radius & widths on the fly
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const cardWidthClass = isMobile ? 'w-[195px]' : isTablet ? 'w-[260px]' : 'w-[340px]';
  const cardHeightClass = isMobile ? 'h-[280px]' : isTablet ? 'h-[370px]' : 'h-[460px]';
  const radius = isMobile ? 320 : isTablet ? 380 : 440;
  const anglePerItem = isMobile ? 36 : isTablet ? 32 : 28;

  const categories = [
    { id: 'all', name: '全 部 甜 点' },
    { id: 'cakes', name: '手 工 烘 焙' },
    { id: 'drinks', name: '特 调 茶 饮' },
    { id: 'icecream', name: '季 节 冰 敷' },
    { id: 'gifts', name: '精 致 茶 礼' },
  ];

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = category === 'all' || p.category === category;
        const matchesSearch =
          p.name.includes(searchQuery) ||
          p.enName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.includes(searchQuery);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        return 0;
      });
  }, [category, searchQuery, sortBy]);

  // Reset active index when products range changes
  useEffect(() => {
    setActiveIndex(0);
  }, [filteredProducts.length]);

  const activeProd = filteredProducts[activeIndex];

  return (
    <div className="w-full pb-20">
      {/* Search Header Banner */}
      <section className="bg-gradient-to-b from-primary-light/40 to-[#FDFCF8] pt-10 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif italic text-3xl font-bold text-primary mb-3 text-[#5C633F]">
            宇 治 特 选 甜 点 谱
          </h1>
          <p className="text-xs text-on-surface-variant mb-6 tracking-wide text-gray-500">
            100% 顶等有机宇治首摘抹茶制成，新鲜现打，手工造设
          </p>

          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder="搜索喜欢的甜点 (如千层、拿铁、巴斯克)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white text-[#1a1c1b] placeholder:text-outline border border-[#c4c8b7]/40 rounded-full shadow-sm text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            <Search className="w-4 h-4 text-outline absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Categories Horizontal Tabs */}
      <section className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-outline-variant/30 overflow-x-auto py-2.5 scrollbar-thin scrollbar-thumb-outline/20">
        <div className="flex gap-2 px-4 max-w-4xl mx-auto whitespace-nowrap scrollbar-none justify-start sm:justify-center relative">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as any)}
              className={`relative px-5 py-2.5 rounded-full text-xs font-serif font-bold tracking-wider transition-all duration-300 cursor-pointer group flex flex-col items-center select-none ${
                category === cat.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-on-surface-variant hover:text-primary hover:bg-surface-beige/30 text-gray-600'
              }`}
            >
              <span>{cat.name}</span>
              {category === cat.id && (
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-primary z-10 select-none animate-fade-in pointer-events-none">
                  <span className="inline-block border-x-4 border-x-transparent border-t-4 border-t-primary"></span>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* Switchers and Count Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-[#c4c8b7]/20">
          <div className="text-xs text-on-surface-variant text-gray-500">
            找到 <span className="font-bold text-primary font-mono text-emerald-800">{filteredProducts.length}</span> 款 精致点心商品
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Sorting controls */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-outline font-sans tracking-wide text-gray-400">排序:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#c4c8b7]/40 text-xs text-on-surface rounded-full py-1.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700"
              >
                <option value="rating">⭐️ 人气推荐</option>
                <option value="priceAsc">📈 价格升序</option>
                <option value="priceDesc">📉 价格降序</option>
              </select>
            </div>

            {/* Layout switch controls */}
            <div className="flex bg-[#F2F1EC] p-1 rounded-full border border-[#c4c8b7]/30 shadow-xs">
              <button
                onClick={() => setLayoutMode('fan')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-serif font-bold transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                  layoutMode === 'fan'
                    ? 'bg-primary text-white shadow-xs bg-emerald-800'
                    : 'text-[#44483c] hover:bg-[#E2DFD5]'
                }`}
                title="Semicircle Fan View"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>扇形茶谱</span>
              </button>
              <button
                onClick={() => setLayoutMode('grid')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-serif font-bold transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                  layoutMode === 'grid'
                    ? 'bg-primary text-white shadow-xs bg-emerald-800'
                    : 'text-[#44483c] hover:bg-[#E2DFD5]'
                }`}
                title="Traditional Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>经典格栅</span>
              </button>
            </div>
          </div>
        </div>

        {/* Catalog Displays */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/40 border border-[#c4c8b7]/10 rounded-3xl max-w-xl mx-auto">
            <Search className="w-12 h-12 text-outline/50 mx-auto mb-4 text-gray-300 animate-pulse" />
            <h3 className="font-serif text-lg text-on-surface mb-1 text-gray-700">未找到相符的商品</h3>
            <p className="text-xs text-outline mb-6 text-gray-400">更正检索词或选择其他分类尝试寻茶吧</p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
              }}
              className="py-2.5 px-6 bg-primary text-white text-xs rounded-full font-bold bg-emerald-800 cursor-pointer"
            >
              重置分类
            </button>
          </div>
        ) : layoutMode === 'fan' ? (
          /* =======================================================
             1. ELEGANT FAN SHAPED (RADIAL INTERACTIVE) LAYOUT VIEW
             ======================================================= */
          <div className="w-full flex flex-col items-center">
            {/* The Semicircular Fan Stage Container */}
            <div 
              className="relative h-[620px] sm:h-[720px] lg:h-[840px] w-full max-w-5xl overflow-hidden flex items-start justify-center pt-10 bg-gradient-to-b from-[#F2F1EC]/40 via-transparent to-transparent rounded-3xl border border-[#c4c8b7]/25 shadow-xs"
              style={{ perspective: "1500px" }}
            >
              
              {/* Semicircle Guides / Track design (aligned mathematically to rotation orbit) */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 border-[#8A9A5B]/15 border-t border-dashed rounded-t-full pointer-events-none transition-all duration-300"
                style={{
                  width: `${radius * 2}px`,
                  height: `${radius}px`,
                  top: `40px`
                }}
              />
              <div 
                className="absolute left-1/2 -translate-x-1/2 border-[#8A9A5B]/10 border-t border-dashed rounded-t-full pointer-events-none transition-all duration-300"
                style={{
                  width: `${(radius + 70) * 2}px`,
                  height: `${radius + 70}px`,
                  top: `${40 - 70}px`
                }}
              />
 
              {/* Navigation Indicators */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] text-[#5C633F] font-serif font-bold uppercase tracking-[0.2em] bg-white/90 backdrop-blur-xs shadow-xs border border-[#c4c8b7]/30 px-4 py-1.5 rounded-full z-20 pointer-events-none">
                <Sparkles className="w-3 h-3 text-[#5C633F] animate-pulse" />
                <span>左右拖拽或点击旋转展开茶谱</span>
              </div>
 
              {/* Slider Controls Inside Fan */}
              <button 
                onClick={() => {
                  const total = filteredProducts.length;
                  if (total <= 1) return;
                  setActiveIndex(prev => (prev === 0 ? total - 1 : prev - 1));
                }}
                className="absolute left-3 sm:left-6 top-[280px] sm:top-[340px] lg:top-[400px] -translate-y-1/2 p-3.5 sm:p-4 bg-white border border-[#c4c8b7]/40 rounded-full hover:bg-[#F2F1EC] hover:scale-105 active:scale-95 transition-all shadow-md z-35 cursor-pointer animate-pulse-subtle"
                aria-label="Previous dessert"
              >
                <ArrowLeft className="w-5 h-5 text-[#5C633F]" />
              </button>
 
              <button 
                onClick={() => {
                  const total = filteredProducts.length;
                  if (total <= 1) return;
                  setActiveIndex(prev => (prev === total - 1 ? 0 : prev + 1));
                }}
                className="absolute right-3 sm:right-6 top-[280px] sm:top-[340px] lg:top-[400px] -translate-y-1/2 p-3.5 sm:p-4 bg-white border border-[#c4c8b7]/40 rounded-full hover:bg-[#F2F1EC] hover:scale-105 active:scale-95 transition-all shadow-md z-35 cursor-pointer animate-pulse-subtle"
                aria-label="Next dessert"
              >
                <ArrowRight className="w-5 h-5 text-[#5C633F]" />
              </button>
 
              {/* The Rotating Fan Deck */}
              <motion.div 
                className="relative w-full h-full cursor-grab active:cursor-grabbing"
                style={{
                  perspective: "2000px",
                  transformStyle: "preserve-3d" as const,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(event, info) => {
                  const swipeThreshold = 50;
                  const total = filteredProducts.length;
                  if (total <= 1) return;
                  if (info.offset.x < -swipeThreshold) {
                    setActiveIndex(prev => (prev === total - 1 ? 0 : prev + 1));
                  } else if (info.offset.x > swipeThreshold) {
                    setActiveIndex(prev => (prev === 0 ? total - 1 : prev - 1));
                  }
                }}
              > 
                {filteredProducts.map((prod, i) => {
                  const total = filteredProducts.length;
                  if (total === 0) return null;

                  // 1. Calculate dynamic index-based offset loop distance (min shortest wrapping distance)
                  let diff = i - activeIndex;
                  if (total > 1) {
                    const rawDiff = ((i - activeIndex) % total);
                    if (rawDiff > total / 2) {
                      diff = rawDiff - total;
                    } else if (rawDiff < -total / 2) {
                      diff = rawDiff + total;
                    } else {
                      diff = rawDiff;
                    }
                  }

                  const isActive = i === activeIndex;

                  // Spacing around active index
                  const angle = diff * anglePerItem;

                  // Viewport mask control: only show active plus neighboring wings (central 3 cards)
                  const isVisible = Math.abs(diff) <= 1;

                  // High-velocity Spring configuration (stiffness: 900, damping: 50, mass: 0.3)
                  const springConfig = {
                    type: "spring" as const,
                    stiffness: 900,
                    damping: 50,
                    mass: 0.3
                  };
 
                  return (
                    <div 
                      key={prod.id} 
                      className="absolute left-1/2 top-[30px] sm:top-[40px] -translate-x-1/2 select-none"
                      style={{
                        transformStyle: "preserve-3d" as const,
                        visibility: isVisible ? "visible" : "hidden",
                      }}
                    >
                      
                      {/* 1. Dynamic Bamboo Fan Bone Line */}
                      <motion.div
                        className="absolute w-[2px] bg-gradient-to-t from-[#8A9A5B]/25 to-transparent pointer-events-none select-none"
                        style={{
                          height: `${radius}px`,
                          transformOrigin: "bottom center",
                          left: "50%",
                          bottom: `-${radius}px`,
                          visibility: isVisible ? "visible" : "hidden",
                        }}
                        initial={false}
                        animate={{
                          rotate: angle,
                          opacity: isActive ? 0.35 : Math.max(0.12, 0.30 - Math.abs(diff) * 0.05)
                        }}
                        transition={springConfig}
                      />
 
                      {/* 2. Rotatable Sweet Dessert Card with proper 3D coordinates */}
                      <motion.div
                        className={`${cardWidthClass} ${cardHeightClass} absolute left-1/2 -translate-x-1/2 pointer-events-auto`}
                        style={{
                          transformOrigin: `center ${radius}px`,
                          zIndex: isActive ? 50 : 20 - Math.abs(diff),
                          transformStyle: "preserve-3d" as const,
                          visibility: isVisible ? "visible" : "hidden",
                          pointerEvents: isVisible ? "auto" : "none",
                        }}
                        initial={false}
                        animate={{
                          rotate: angle,
                          y: isActive ? -12 : 0,
                          scale: isActive ? 1.05 : 0.85,
                          opacity: isActive ? 1 : 0.40,
                          z: isActive ? 50 : -100,
                        }}
                        transition={springConfig}
                      >
                        <InteractiveCard
                          prod={prod}
                          isActive={isActive}
                          cardWidthClass={cardWidthClass}
                          cardHeightClass={cardHeightClass}
                          onSelect={() => {
                            if (isActive) {
                              onSelectProduct(prod);
                            } else {
                              setActiveIndex(i);
                            }
                          }}
                        />
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
 
              {/* Fan's Stylized Jade Pivot Dial precisely at base vertex of the bones */}
              <div 
                className="absolute -translate-x-1/2 -translate-y-1/2 w-[110px] h-[110px] rounded-full border border-emerald-800/20 bg-white flex flex-col items-center justify-center text-center shadow-lg z-40 transition-colors"
                style={{
                  left: "50%",
                  top: `${40 + radius}px`
                }}
              >
                <span className="text-xl animate-bounce">🍵</span>
                <span className="text-[8px] font-serif font-black text-emerald-800 tracking-widest mt-0.5 scale-90">
                  宇治和弦
                </span>
                <div className="w-8 h-0.5 bg-emerald-800/20 mt-1" />
              </div>
            </div>

            {/* Dynamic Symmetrical Showcase Details Box */}
            {activeProd && (
              <div className="w-full mt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProd.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="bg-white rounded-3xl border border-[#c4c8b7]/30 p-6 sm:p-8 shadow-sm grid md:grid-cols-12 gap-6 items-center"
                  >
                    {/* Rich Product Image with premium frame bounds */}
                    <div className="md:col-span-5 relative group overflow-hidden rounded-2xl bg-surface-beige aspect-square">
                      <img 
                        src={activeProd.image} 
                        alt={activeProd.name} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                      
                      {/* Scent & Type tags */}
                      <span className="absolute top-4 left-4 bg-[#8A9A5B] text-white text-[10px] font-serif font-bold py-1 px-3 rounded-full uppercase tracking-wider shadow-sm z-10">
                        {activeProd.category === 'cakes' && '🍰 手工千层饼房'}
                        {activeProd.category === 'drinks' && '🍵 极品手打特调'}
                        {activeProd.category === 'icecream' && '🍨 霜雪节气冰物'}
                        {activeProd.category === 'gifts' && '🎁 臻贵和风茶礼'}
                      </span>
                    </div>

                    {/* Detailed info showcase space */}
                    <div className="md:col-span-7 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {activeProd.tags?.map((tag: string) => (
                            <span key={tag} className="px-2.5 py-0.5 bg-primary/10 rounded-full text-[10px] font-bold text-emerald-800 bg-emerald-50">
                              {tag}
                            </span>
                          ))}
                          <span className="px-2.5 py-0.5 bg-secondary-container text-primary font-serif text-[10px] font-bold rounded-full text-emerald-800 bg-[#EAE8E0]/40">
                            ★ {activeProd.rating} 宇治首推
                          </span>
                        </div>

                        <h3 className="font-serif italic text-2xl sm:text-3xl font-extrabold text-[#5C633F] leading-tight mb-1 text-emerald-900">
                          {activeProd.name}
                        </h3>
                        <p className="font-mono text-xs text-outline uppercase tracking-widest mb-4 text-gray-400">
                          {activeProd.enName}
                        </p>
                        
                        <p className="text-xs sm:text-sm text-[#44483c] leading-relaxed mb-6 font-medium text-gray-600">
                          {activeProd.description}
                        </p>

                        {activeProd.details && (
                          <div className="grid grid-cols-2 gap-4 bg-[#fbfbfa] p-4 rounded-xl border border-[#c4c8b7]/20 text-xs mb-6">
                            <div>
                              <span className="text-outline text-[10px] block mb-0.5 text-gray-400">🍃 大师极味选配：</span>
                              <span className="font-semibold text-gray-700 truncate block" title={activeProd.details.ingredients}>
                                {activeProd.details.ingredients || '高山天然纯磨有机宇治茶'}
                              </span>
                            </div>
                            <div>
                              <span className="text-outline text-[10px] block mb-0.5 text-gray-400">🔥 营养热量与控糖：</span>
                              <span className="font-semibold font-mono text-[#5C633F] block">
                                {activeProd.details.calories || '210 kcal'} / {activeProd.details.sugar || '标准低海藻糖'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-[#c4c8b7]/20 mt-auto">
                        <div>
                          <span className="text-[10px] text-outline uppercase tracking-wider block font-bold text-gray-400">大师首创高定特价</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black font-mono text-primary text-emerald-800">
                              ¥{activeProd.price}
                            </span>
                            {activeProd.originalPrice && (
                              <span className="text-xs text-outline font-mono line-through text-gray-400">
                                ¥{activeProd.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => onSelectProduct(activeProd)}
                            className="px-5 py-3 bg-white text-[#44483c] border border-[#c4c8b7]/50 hover:bg-[#F2F1EC] text-xs font-serif font-bold rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <span>定制选项参数</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onAddToCart(activeProd, {})}
                            className="px-6 py-3 bg-emerald-800 text-white hover:bg-black text-xs font-serif font-bold rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
                          >
                            <span>添入购物车</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        ) : (
          /* =======================================================
             2. CLASSIC GRID LAYOUT DETAIL VIEW
             ======================================================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(prod => (
              <div
                key={prod.id}
                className="group bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5 flex flex-col cursor-pointer"
                onClick={() => onSelectProduct(prod)}
              >
                {/* Image panel */}
                <div className="relative aspect-square overflow-hidden bg-surface-beige">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  
                  {/* Hover Details Arrow Overlay */}
                  <div className="absolute inset-0 bg-black/6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-10 h-10 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-md transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <ArrowUpRight className="w-4.5 h-4.5 text-emerald-800" />
                    </div>
                  </div>

                  {prod.originalPrice && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full z-10">
                      减 {Math.round(prod.originalPrice - prod.price)}元
                    </div>
                  )}

                  {/* Hot tag */}
                  {prod.reviewsCount > 500 && (
                    <div className="absolute top-3 right-3 bg-secondary-container text-primary font-serif text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-0.5 shadow-sm z-10 text-emerald-800 bg-[#EAE8E0]">
                      <Flame className="w-3 h-3 text-[#8A9A5B] animate-bounce" />
                      口碑爆款
                    </div>
                  )}
                </div>

                {/* Info block */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1 h-12">
                    <h3 className="font-serif text-base text-on-surface font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors text-gray-800">
                      {prod.name}
                    </h3>
                  </div>
                  
                  <p className="text-[9px] text-outline font-mono uppercase tracking-wider line-clamp-1 mb-2 text-gray-400">
                    {prod.enName}
                  </p>

                  <p className="text-xs text-[#44483c] line-clamp-2 leading-relaxed mb-4 flex-grow text-gray-500">
                    {prod.description}
                  </p>

                  {/* Rating / Counts */}
                  <div className="flex items-center gap-1.5 text-[10px] text-outline mb-3.5 text-gray-400">
                    <span className="text-[#45621b] font-bold">★ {prod.rating}</span>
                    <span className="text-[#c4c8b7] font-sans">|</span>
                    <span>{prod.reviewsCount}+ 好评数</span>
                  </div>

                  {/* Footer & Action Button */}
                  <div className="flex justify-between items-center pt-3 border-t border-[#c4c8b7]/20 mt-auto select-none">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-base font-bold text-primary text-emerald-800">
                        ¥{prod.price}
                      </span>
                      {prod.originalPrice && (
                        <span className="font-mono text-xs text-outline line-through text-gray-400">
                          ¥{prod.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(prod, {});
                      }}
                      className="group/btn px-3 py-1.5 bg-primary-light text-primary hover:bg-emerald-800 hover:text-white text-xs font-serif font-bold rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer text-emerald-800"
                    >
                      <span>加入茶篮</span>
                      <ChevronRight className="w-3 h-3 transform group-hover/btn:translate-x-1.5 transition-transform duration-300 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

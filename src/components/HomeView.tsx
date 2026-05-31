/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, MessageSquare, Compass, ArrowRight, ArrowLeft, Heart, ShoppingBag, ArrowDown, Leaf } from 'lucide-react';
import { Product } from '../types';
import { products } from '../data';
import InteractiveCake3D from './InteractiveCake3D';

interface HomeViewProps {
  onNavigate: (view: 'home' | 'catalog' | 'story' | 'cart' | 'detail') => void;
  onSelectCategory: (category: 'cakes' | 'drinks' | 'icecream' | 'gifts' | 'all') => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, options: { size?: string; sweetness?: string; temp?: string }) => void;
}

export default function HomeView({
  onNavigate,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
}: HomeViewProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const nextSectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Framer Motion scroll hook
  const { scrollY } = useScroll();

  // Background speed: 0.5x
  // Under standard scroll, content moves up by scrollY.
  // We translate background DOWN by scrollY * 0.5 so that it moves up relative to viewport at 0.5x speed.
  const yBg = useTransform(scrollY, [0, 1000], [0, 500]);
  const scaleBg = useTransform(scrollY, [0, 1000], [1.1, 1.25]);

  // Foreground speed: 1.2x
  // Translating foreground elements UP by scrollY * 0.2 relative to container moves them UP at 1.2x speed in viewport.
  const yFg = useTransform(scrollY, [0, 1000], [0, -210]);

  // Content (Header text & Buttons) speed overlay: gentle offset + fade out
  const yContent = useTransform(scrollY, [0, 1000], [0, 80]);
  const opacityContent = useTransform(scrollY, [0, 600], [1, 0]);

  const handleScrollDown = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Recommended products: mille-crepe, sea-salt-foam, zen-macarons, basque-cheese
  const trendingProducts = products.filter(p => 
    ['mille-crepe', 'sea-salt-foam', 'zen-macarons', 'basque-cheese'].includes(p.id)
  );

  const prevSlide = () => {
    setActiveSlide(prev => (prev === 0 ? trendingProducts.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide(prev => (prev === trendingProducts.length - 1 ? 0 : prev + 1));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <div className="w-full pb-16">
      {/* Immersive Hero Section with Parallax Scrolling */}
      <section 
        ref={heroRef}
        className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-[#FDFCF8]"
      >
        {/* Background Layer (speed 0.5x) */}
        <motion.div 
          className="absolute inset-0 z-0 origin-center select-none pointer-events-none"
          style={{ 
            y: yBg,
            scale: scaleBg
          }}
        >
          <img
            className="w-full h-[120%] -top-[10%] relative object-cover filter brightness-[0.88] contrast-[1.02]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAheTwt3habdn9E32hj0n3-ENYUYxXoULKj64_6rIJRU5GA6LJmhtE-Dwow1aYRqvHpguCYK9D7ZACNFnubgKYZxsbz-Ju8qwNnvIxUcGrGSMDbarUiW-0C2OViHKbqWNFwdye_RavPzYhr419djpXO-8luRg5canr4VMgf9vNhQlgynKDE4pWblIBZBCeOH7QpkqRuXp4p61Jiu7FBSsEpJGGs3u0_DOE09fWl8bpsOYevLexUxyH2hOVQHyvkZ2zOQQ1YSMzdifvh"
            alt="宇治顶级千层甜点"
          />
          {/* Beautiful high-contrast gradient overlay, ensures maximum readability for light text colors */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#FDFCF8]"></div>
        </motion.div>

        {/* Foreground Layer (speed 1.2x) */}
        {/* Multiple floating design assets aligned with speed 1.2x to create an authentic 3D optical flow */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none select-none"
          style={{ y: yFg }}
        >
          {/* Floating Leaves 1 - Soft rotated Green leaf on left */}
          <div className="absolute left-[8%] top-[25%] md:left-[12%] md:top-[20%] opacity-80 md:opacity-100">
            <motion.div 
              animate={{ 
                y: [0, -12, 0],
                rotate: [0, 15, 0],
                scale: [1, 1.05, 1] 
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-[#5C633F] drop-shadow-lg"
            >
              <Leaf className="w-8 h-8 sm:w-12 sm:h-12 fill-[#8A9A5B]/35 text-[#5C633F]" />
            </motion.div>
          </div>

          {/* Floating Leaves 2 - Rotated large green leaf on right */}
          <div className="absolute right-[10%] top-[15%] opacity-70 md:opacity-90">
            <motion.div 
              animate={{ 
                y: [0, 18, 0],
                rotate: [0, -15, 0] 
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="text-[#5C633F] drop-shadow-md"
            >
              <Leaf className="w-12 h-12 sm:w-16 sm:h-16 fill-[#5C633F]/20 text-[#5C633F]" />
            </motion.div>
          </div>

          {/* Floating Leaves 3 - Tiny wind-drifted leaf bottom-left */}
          <div className="absolute left-[15%] bottom-[25%] opacity-50 md:opacity-75">
            <motion.div 
              animate={{ 
                y: [0, -8, 0],
                x: [0, 6, 0],
                rotate: [15, 35, 15] 
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="text-[#8A9A5B]"
            >
              <Leaf className="w-6 h-6 sm:w-8 sm:h-8 fill-[#C4D300]/15" />
            </motion.div>
          </div>

          {/* Floating Leaves 4 - Right lower medium leaf */}
          <div className="absolute right-[22%] bottom-[18%] opacity-60">
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                rotate: [-20, -5, -20]
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
              className="text-[#8A9A5B]"
            >
              <Leaf className="w-8 h-8 fill-[#8A9A5B]/20 text-primary-container" />
            </motion.div>
          </div>

          {/* Interactive Layer Badge on the Bottom-Right */}
          <div className="absolute right-[6%] bottom-[15%] hidden md:flex items-center gap-3 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl p-4.5 shadow-[0_20px_50px_rgba(92,99,63,0.15)] ring-1 ring-black/5 pointer-events-auto">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-14 h-14 bg-surface-beige rounded-xl overflow-hidden shadow-inner flex-shrink-0"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNS_QGYv-ZquhytM1GdiubVOjZYSPsiy1IdnpG55VHS36LL_aZV7uKupBVLcet7VxJJbxgSSs0S2ZlcZ8X3wXouy7WjIQ7XRJ_-wRT0_7zY0bMnYT9Mncn3LKBfwrRPEsOQqLy_uLK-N01jjiT5_d0kIOrnsKL7u97wBxiJX1uDRAPiqdUFhpPDL0WLQQCfGTc3bCvJGPV_79DBYwUXv004uDuKyHf97VeLDRBaw5rwIVOyVP8yii9NsnVMhL2VGb3kDUlZKHpP1yP" 
                alt="手打抹茶特写" 
                className="w-full h-full object-cover scale-110"
              />
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="bg-primary/95 text-white font-serif text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  手起汤花
                </span>
                <span className="font-mono text-xs font-bold text-primary">
                  ★ 4.8
                </span>
              </div>
              <p className="font-serif text-xs font-bold text-primary mb-0.5">
                海盐芝士厚奶盖抹茶
              </p>
              <p className="text-[9px] font-mono text-outline tracking-wider uppercase">
                LATTE CHAWAN foam
              </p>
            </div>
          </div>

          {/* Transparent Floating Zen Slate Card on the Middle-Left */}
          <div className="absolute left-[6%] bottom-[28%] hidden lg:flex flex-col backdrop-blur-xl bg-white/45 border border-white/50 rounded-2xl p-4.5 shadow-[0_20px_40px_rgba(92,99,63,0.12)] max-w-[240px] pointer-events-auto border-l-4 border-l-primary">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#5C633F] font-bold mb-1.5">
              禅茶心意 · ZEN ESSENCE
            </span>
            <p className="font-serif text-xs leading-relaxed text-on-surface-variant font-medium">
              每小时仅石磨慢磨30克特级茶粉。
              以最纯粹的温盏与白花，
              静候世间最美好的相遇。
            </p>
          </div>
        </motion.div>

        {/* Content Layer (Speed Standard, but elegantly floated and faded relative to scroll) */}
        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl max-md:py-16"
          style={{ 
            y: yContent,
            opacity: opacityContent 
          }}
        >
          <motion.span 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-xs md:text-sm font-mono tracking-[0.3em] text-primary bg-primary-light/85 px-4.5 py-1.5 rounded-full mb-6 font-semibold uppercase shadow-xs border border-primary/10"
          >
            茶 寮 匠 心 慢 调 • CRAFTED WITH SERENITY
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight text-[#C7DCA7] mb-6 font-bold tracking-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
          >
            于苦涩间，寻味宁静
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-xs sm:text-sm md:text-base text-[#D2DEC1] drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] max-w-xl mx-auto mb-10 leading-relaxed font-semibold tracking-wide"
          >
            探寻京都宇治茶园的首采嫩叶。每一口微苦与丝滑的细腻，都是回归内心世界的一次和弦。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => {
                onSelectCategory('all');
                onNavigate('catalog');
              }}
              className="w-48 py-4 px-8 bg-primary text-white font-serif font-bold tracking-[0.2em] rounded-full text-sm hover:opacity-95 hover:shadow-lg transition-all active:scale-95 duration-150 flex items-center justify-center gap-2 group cursor-pointer"
            >
              立即探索点心
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
            <button
              onClick={() => onNavigate('story')}
              className="w-48 py-4 px-8 border border-primary/40 text-primary font-serif font-bold tracking-[0.15em] rounded-full text-sm bg-white/40 backdrop-blur-xs hover:bg-white/85 transition-all hover:shadow-md active:scale-95 duration-150 flex items-center justify-center gap-2 group cursor-pointer"
            >
              探秘茶园故事
              <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:translate-x-1 group-hover:ml-0 transition-all duration-300" />
            </button>
          </motion.div>
        </motion.div>

        {/* Dynamic Interactive Scroll Arrow */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: [0.75, 1, 0.75], y: [0, 8, 0] }}
          transition={{ 
            opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 cursor-pointer pointer-events-auto group"
          onClick={handleScrollDown}
          title="向下探索茶寮"
        >
          <span className="font-mono text-[9px] text-[#5C633F] tracking-[0.3em] font-bold uppercase transition-transform duration-300 group-hover:translate-y-0.5">
            向下探索
          </span>
          <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs border border-[#5C633F]/20 flex items-center justify-center shadow-xs group-hover:bg-[#5C633F] group-hover:border-[#5C633F] group-hover:text-white transition-all duration-300">
            <ArrowDown className="w-4 h-4 text-[#5C633F] group-hover:text-white transition-colors duration-300" />
          </div>
        </motion.div>
      </section>

      {/* Quick Category Icons Section */}
      <section ref={nextSectionRef} className="py-12 bg-white/30 border-y border-black/5 px-4 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            {[
              { id: 'cakes', name: '手作千层', icon: '🍰', en: 'Cakes' },
              { id: 'drinks', name: '特调茶饮', icon: '🍵', en: 'Drinks' },
              { id: 'icecream', name: '抹茶冰敷', icon: '🍦', en: 'Glace' },
              { id: 'gifts', name: '典雅茶礼', icon: '🎁', en: 'Gifts' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id as any);
                  onNavigate('catalog');
                }}
                className="group flex flex-col items-center p-3 sm:p-5 bg-white rounded-2xl border border-black/10 hover:bg-[#5C633F]/5 hover:border-primary/20 hover:shadow-lg transition-all duration-300 spring-click"
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <div className="font-serif text-sm sm:text-base text-on-surface font-semibold group-hover:text-primary transition-colors">
                  {cat.name}
                </div>
                <div className="text-[10px] text-outline uppercase tracking-widest mt-0.5">
                  {cat.en}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending / Recommended Products (Carousel) */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-secondary text-xs sm:text-sm font-mono tracking-widest uppercase block mb-1">
              BEST RECOMMEND
            </span>
            <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-primary">
              本 季 热 门 臻 品
            </h2>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={prevSlide}
              className="group w-10 h-10 rounded-full border border-outline-variant bg-white/70 hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer"
              title="上一个"
            >
              <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1.5 transition-transform duration-300" />
            </button>
            <button
              onClick={nextSlide}
              className="group w-10 h-10 rounded-full border border-outline-variant bg-white/70 hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer"
              title="下一个"
            >
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Sliding Carousel */}
        <div className="overflow-hidden py-2 px-1">
          <div 
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeSlide * 22}px)` }} // Adjust translate on larger layouts if needed
          >
            {trendingProducts.map(prod => (
              <div
                key={prod.id}
                className="min-w-[280px] sm:min-w-[340px] max-w-[360px] bg-white rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500 flex flex-col cursor-pointer"
                onClick={() => onSelectProduct(prod)}
              >
                <div className="relative h-60 overflow-hidden bg-surface-beige">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={prod.image}
                    alt={prod.name}
                  />
                  {prod.originalPrice && (
                    <span className="absolute top-4 left-4 bg-error text-white font-mono text-xs px-3 py-1 rounded-full font-semibold">
                      限定惠
                    </span>
                  )}
                  <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm shadow-sm py-1 px-3 rounded-full text-xs font-serif text-primary font-bold">
                    ★ {prod.rating}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex gap-1 mb-2 flex-wrap">
                    {prod.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="bg-primary-light text-primary text-[10px] px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-serif text-lg text-on-surface font-semibold mb-1 group-hover:text-primary transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-[10px] text-outline font-mono tracking-wider uppercase mb-3">
                    {prod.enName}
                  </p>
                  
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-4">
                    {prod.description}
                  </p>

                  <div className="flex justify-between items-center mt-auto pt-3 border-t border-outline-variant/30">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-lg font-bold text-primary">
                        ¥{prod.price}
                      </span>
                      {prod.originalPrice && (
                        <span className="font-mono text-xs text-outline line-through">
                          ¥{prod.originalPrice}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(prod, {});
                      }}
                      className="p-2.5 rounded-full bg-primary-light text-primary hover:bg-primary hover:text-white transition-colors duration-200 flex items-center justify-center text-xs gap-1 font-bold shadow-sm spring-click"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      购
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Heritage Section */}
      <section className="py-20 bg-surface-beige">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
            <img
              className="relative rounded-2xl shadow-lg w-full h-[320px] sm:h-[450px] object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdvy-pEuTPDxnoJGocJlF6D7uka8Tx-iOyj8ncWmLy7Fz7Sm3e1xkeWT_C6bSwLDPuLxsi6u809ZzFZ0S5IhKBazuYaauKCCyiwkeIZL-9ixbCEVFOTzHNGLIg0SiJbGYKK7boQB347VUwZGvIePiXSCTX04Ys6ZgVsA01gWAmSngfUf-Yb_AddPneDxwsHR2mGNX7js-aezWoTI99blPI70vtUn2hFj5E__RUemIDmgVngPw-pcmkxE4yM2QdOnfy-6mPRZz0uCMm"
              alt="匠人手打抹茶"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-xs font-mono tracking-[0.2em] text-primary font-semibold mb-3">
              BRAND PHILOSOPHY
            </span>
            <h2 className="font-serif italic text-3xl sm:text-4xl text-primary font-bold mb-6">
              溯源于心，静候茶香
            </h2>
            <p className="font-sans text-sm sm:text-base text-on-surface-variant mb-6 leading-relaxed">
              宇治川之流，古茶园之雾。我们与京都宇治最古老的茶园结缘，坚持遮光三周、清晨手工净析，最纯正的“一番新茶”。
            </p>
            <p className="font-sans text-sm sm:text-base text-on-surface-variant mb-8 leading-relaxed">
              杜绝任何人工合成色素与抗氧化剂。每一口抹茶，都借助拥有百年历史的高质玄色花岗岩石磨、在低温暗室中慢速碾轧而成——为此，我们每小时仅能磨制得 30g 纯茶粉。
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => onNavigate('story')}
                className="py-3.5 px-8 max-xs:w-full border-2 border-primary text-primary font-sans rounded-full text-sm font-bold bg-white shadow-sm hover:bg-primary hover:text-white transition-all active:scale-95 duration-200"
              >
                关于我们
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Autumn Special Interactive Area */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-secondary text-xs sm:text-sm font-mono tracking-[0.3em] uppercase block mb-2">
            Seasonal Autumn Concept
          </span>
          <h2 className="font-serif italic text-3xl text-primary font-bold">
            秋 季 限 定 系列新品
          </h2>
          <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 items-stretch">
          {/* Interactive 3D Customizable Cake Lab */}
          <div className="lg:col-span-3 h-full">
            <InteractiveCake3D onAddToCart={onAddToCart} />
          </div>

          {/* Interactive Newsletter Sign Up Card */}
          <div className="bg-secondary-container text-on-surface rounded-3xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden lg:col-span-1 min-h-[420px]">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center mb-6 text-primary">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-primary">
                特权预览订阅
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                订阅我们的茶寮季报，您将在秋季限定新品正式上市前48小时收到预订邀请码，并专享一客免费的经典抹茶千层礼券。
              </p>
            </div>

            <div className="relative z-10">
              {subscribed ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/80 backdrop-blur-sm border border-primary p-4 rounded-2xl text-center"
                >
                  <p className="text-xs font-semibold text-primary">
                    🍵 订阅成功！
                  </p>
                  <p className="text-[10px] text-outline mt-1 font-mono">
                    专属礼格体验指南已发至该箱
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    required
                    type="email"
                    placeholder="请输入您的邮箱"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/70 hover:bg-white focus:bg-white text-xs px-4 py-3 border-none rounded-xl shadow-inner focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
                  />
                  <button
                    type="submit"
                    className="group w-full bg-primary text-white text-xs font-bold py-3.5 rounded-xl hover:opacity-95 transition-opacity py-3 duration-200 shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                  >
                    免费获取预订礼包
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

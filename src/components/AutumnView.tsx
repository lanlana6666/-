/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Leaf, ArrowRight, ShoppingCart, Heart, Plus, Minus, Check, Gift } from 'lucide-react';
import { Product } from '../types';
import { products } from '../data';

interface AutumnViewProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, options: { size?: string; sweetness?: string; temp?: string }) => void;
  onNavigateToCatalog: () => void;
  triggerToast?: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function AutumnView({
  onSelectProduct,
  onAddToCart,
  onNavigateToCatalog,
  triggerToast
}: AutumnViewProps) {
  // Extract autumn limited products plus roasted hojicha as honorary autumn item
  const autumnProducts = products.filter(p => 
    p.id.includes('autumn') || p.id === 'hojicha-lat'
  );

  // Active filter for chilled/ice-cold vs warm/cosy desserts
  const [activeFilter, setActiveFilter] = useState<'all' | 'chilled' | 'warm'>('all');

  const getIsChilled = (product: Product) => {
    return product.tags.some(tag => tag.includes('冰') || tag.includes('冷') || tag.includes('霜') || tag.includes('芭菲')) || 
           product.category === 'icecream' || 
           product.id.includes('shavedice') || 
           product.id.includes('pear') || 
           product.id.includes('parfait') || 
           product.id.includes('affogato');
  };

  const chilledCount = autumnProducts.filter(getIsChilled).length;
  const warmCount = autumnProducts.length - chilledCount;

  const filteredAutumnProducts = autumnProducts.filter(product => {
    const isChilled = getIsChilled(product);
    if (activeFilter === 'chilled') return isChilled;
    if (activeFilter === 'warm') return !isChilled;
    return true;
  });

  // Quick specifications state for floating add-to-cart drawers
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, { size: string; sweet: string; temp: string }>>({});
  
  // Custom interactive set builder states
  const [selectedSetCake, setSelectedSetCake] = useState<Product | null>(autumnProducts.find(p => p.category === 'cakes') || null);
  const [selectedSetDrink, setSelectedSetDrink] = useState<Product | null>(autumnProducts.find(p => p.category === 'drinks') || null);
  const [appliedCustomCoupon, setAppliedCustomCoupon] = useState(false);

  const initSpecsForProduct = (productId: string, product: Product) => {
    if (!selectedSpecs[productId]) {
      const defaultSize = product.details.sizeOptions?.[0] || '标准装';
      const defaultSweet = product.details.sweetnessOptions?.[0] || '标准甜';
      const defaultTemp = product.details.temperatureOptions?.[0] || '标准温热';
      setSelectedSpecs(prev => ({
        ...prev,
        [productId]: { size: defaultSize, sweet: defaultSweet, temp: defaultTemp }
      }));
    }
  };

  const handleSpecChange = (productId: string, type: 'size' | 'sweet' | 'temp', value: string) => {
    setSelectedSpecs(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [type]: value
      }
    }));
  };

  const handleQuickAdd = (product: Product) => {
    const specs = selectedSpecs[product.id] || {
      size: product.details.sizeOptions?.[0] || '',
      sweet: product.details.sweetnessOptions?.[0] || '',
      temp: product.details.temperatureOptions?.[0] || ''
    };

    onAddToCart(product, {
      size: specs.size,
      sweetness: specs.sweet,
      temp: specs.temp
    });

    if (triggerToast) {
      triggerToast(`🍂 已将秋季限定【${product.name}】追加至清单`, 'success');
    }
  };

  // Set builder helper to purchase package
  const handlePurchaseSetForTwo = () => {
    if (!selectedSetCake || !selectedSetDrink) return;
    
    // Add both to cart
    onAddToCart(selectedSetCake, { size: '标准装', sweetness: '半糖', temp: '去冰' });
    onAddToCart(selectedSetDrink, { size: '标准装', sweetness: '微糖', temp: '温热' });
    
    if (triggerToast) {
      triggerToast('🍁 秋季和风限定双人餐已成功置入清单！合并立减20元优惠已生效！', 'success');
    }
  };

  return (
    <div className="w-full pb-24 bg-[#FCF8F2] text-[#423D33] overflow-hidden">
      {/* 1. Immersive Golden Autumn Parallax Hero Banner */}
      <section className="relative h-[65vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#7C411D] via-[#8A9A5B] to-[#4A5D22]">
        
        {/* Absolute Autumnal Leaves overlay particles */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none opacity-40">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-[#D27D2D]"
              style={{
                left: `${Math.random() * 95}%`,
                top: `${Math.random() * 90}%`,
              }}
              animate={{
                y: [0, 40, 0],
                x: [0, 15, 0],
                rotate: [0, 360],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{
                duration: 6 + Math.random() * 8,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut'
              }}
            >
              <Leaf className="w-8 h-8 fill-amber-700/20 text-[#A65E2E]" />
            </motion.div>
          ))}
        </div>

        {/* Ambient Overlay Layer */}
        <div className="absolute inset-0 bg-neutral-900/35 z-1"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FCF8F2]/40 to-[#FCF8F2] z-2"></div>

        {/* Hero Title Container */}
        <div className="relative z-10 text-center px-4 max-w-4xl max-md:py-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 px-4 py-1 bg-amber-100/90 backdrop-blur-md rounded-full text-amber-800 font-serif text-xs font-semibold tracking-wider mb-6 border border-amber-200/30 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>露晓金桂 · 霜染丹枫</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif italic text-4xl sm:text-5xl md:text-6xl text-white mb-6 font-bold tracking-tight drop-shadow-md"
          >
            秋季限定 · 蜜栗桂影
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs sm:text-sm md:text-base font-sans text-amber-50 max-w-lg mb-8 leading-relaxed drop-shadow-sm font-medium"
          >
            当京都石磨抹茶，邂逅温暖甜蜜的丹波甘栗、馥郁丹桂与柴心焙茶。
            在微凉秋风升起时，为您点燃一盏驱散寂寥的和暖甜意。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-4 flex-wrap justify-center font-serif text-xs text-white/95"
          >
            <span className="flex items-center gap-1.5 bg-black/10 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/10">
              🍁 限时发售：2026/09/01 - 2026/11/15
            </span>
            <span className="flex items-center gap-1.5 bg-black/10 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/10">
              🍵 鲜工精制：日磨30克珍稀初摘茶粉
            </span>
          </motion.div>
        </div>
      </section>

      {/* 2. Visual Introduction of Autumn Key Ingredients */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-30 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Ingredient 1: Chestnut */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-amber-200/20 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 font-serif text-xl font-bold mb-4 outline-amber-700 group-hover:bg-amber-100 transition-colors">
              🌰
            </div>
            <h3 className="font-serif text-base font-bold text-amber-950 mb-2">丹波蜜栗</h3>
            <p className="text-xs text-[#6B6151] leading-relaxed">
              严选颗粒饱满的丹波熟炒板栗，历经数十小时的慢火熬制与纯手工去壳，保留最初始的微细焦糖香，粉糯细腻。
            </p>
          </div>

          {/* Ingredient 2: Golden Osmanthus */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-amber-200/20 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 font-serif text-xl font-bold mb-4 group-hover:bg-amber-100 transition-colors">
              🌼
            </div>
            <h3 className="font-serif text-base font-bold text-amber-950 mb-2">金桂丹桂</h3>
            <p className="text-xs text-[#6B6151] leading-relaxed">
              清晨手工摇采的露水桂花，以天然蜂浆古法发酵封存，花质金黄，香气馥郁高雅而不腻。
            </p>
          </div>

          {/* Ingredient 3: Hojicha */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-amber-200/20 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 font-serif text-xl font-bold mb-4 group-hover:bg-amber-100 transition-colors">
              🍂
            </div>
            <h3 className="font-serif text-base font-bold text-amber-950 mb-2">炭焙焙茶</h3>
            <p className="text-xs text-[#6B6151] leading-relaxed">
              秋收粗碾茶叶经红外线陶瓷炭火极限深度烘焙，脱去苦涩与大半咖啡因，留下独特的深邃坚果焦糖暖香。
            </p>
          </div>

        </div>
      </section>

      {/* 3. Products Core Showcases Grid */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#86765A] font-bold">
            THE HARVEST COLLECTION
          </span>
          <h2 className="font-serif italic text-2xl sm:text-3xl text-amber-950 mt-1.5 font-bold">
            秋 实 茶 饮 • 季 限 精 选
          </h2>
          <div className="w-12 h-0.5 bg-amber-700 mx-auto mt-4 rounded"></div>
        </div>

        {/* Dynamic Temperature/Coolness Filter Tab Selector */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-12 max-w-2xl mx-auto px-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4.5 py-2.5 rounded-full font-serif text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-amber-800 text-white shadow-md'
                : 'bg-white border border-amber-200/40 text-amber-950 hover:border-amber-400'
            }`}
          >
            🍁 全部秋限 ({autumnProducts.length})
          </button>
          
          <button
            onClick={() => setActiveFilter('chilled')}
            className={`px-4.5 py-2.5 rounded-full font-serif text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'chilled'
                ? 'bg-sky-700 text-white shadow-md border border-sky-600'
                : 'bg-white border border-amber-200/40 text-[#1E3B35] hover:border-sky-300'
            }`}
          >
            ❄️ 极度冰敷冷藏 ({chilledCount})
          </button>
          
          <button
            onClick={() => setActiveFilter('warm')}
            className={`px-4.5 py-2.5 rounded-full font-serif text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'warm'
                ? 'bg-[#A26D40] text-white shadow-md border border-[#915B2D]'
                : 'bg-white border border-amber-200/40 text-[#3B2C16] hover:border-amber-400'
            }`}
          >
            🔥 温润秋意暖食 ({warmCount})
          </button>
        </div>

        <div className="space-y-16">
          {filteredAutumnProducts.map((product, idx) => {
            initSpecsForProduct(product.id, product);
            const specs = selectedSpecs[product.id] || { size: '', sweet: '', temp: '' };
            const isEven = idx % 2 === 0;

            return (
              <div 
                key={product.id}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-white rounded-3xl overflow-hidden shadow-sm border border-amber-200/10 hover:shadow-md transition-all duration-300`}
              >
                {/* Product Image Panel */}
                <div className="relative lg:w-1/2 h-[300px] sm:h-[380px] lg:h-[450px] overflow-hidden group cursor-pointer" onClick={() => onSelectProduct(product)}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" 
                  />
                  {/* Absolute subtle glowing golden radial border */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Floating Autumn Tag */}
                  <span className="absolute top-4 left-4 font-serif text-xs font-bold leading-none bg-amber-500 text-white px-3 py-1.5 rounded-full shadow flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 fill-white" />
                    秋日限时款
                  </span>

                  {/* Quick View Text */}
                  <span className="absolute bottom-4 right-4 text-white/90 text-xs font-serif flex items-center gap-1 bg-black/30 backdrop-blur-xs py-1 px-3.5 rounded-full hover:bg-black/50 transition-colors uppercase tracking-wider">
                    查看赏析详情
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                {/* Product Configuration and Descriptions */}
                <div className="lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {product.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-sans font-bold bg-[#FAF2EB] text-[#A26D40] px-2.5 py-0.5 rounded-md border border-[#F4E2D0]">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3B2C16] mb-1 hover:text-amber-700 cursor-pointer transition-colors" onClick={() => onSelectProduct(product)}>
                      {product.name}
                    </h3>
                    <p className="font-mono text-xs text-[#8A7962] uppercase tracking-wider mb-4">
                      {product.enName}
                    </p>

                    <p className="text-xs sm:text-sm text-[#5C5546] leading-relaxed mb-6">
                      {product.description}
                    </p>

                    {/* Dynamic Specs Selections (if exist) */}
                    <div className="space-y-4 border-t border-[#F5EFE6] pt-4.5 mb-6">
                      {/* Size Specifications */}
                      {product.details.sizeOptions && product.details.sizeOptions.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase font-mono tracking-wider text-[#A29481] mb-1.5">
                            规格选择 (Size)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {product.details.sizeOptions.map(opt => (
                              <button
                                key={opt}
                                onClick={() => handleSpecChange(product.id, 'size', opt)}
                                className={`text-[11px] font-sans px-3 py-1 rounded-full border transition-all ${
                                  specs.size === opt
                                    ? 'bg-amber-600 text-white border-amber-600 font-medium'
                                    : 'border-amber-200/60 bg-[#FAF9F5] text-[#5C5243] hover:border-amber-400'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sweetness Specifications */}
                      {product.details.sweetnessOptions && product.details.sweetnessOptions.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase font-mono tracking-wider text-[#A29481] mb-1.5">
                            甜度风致 (Sweetness)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {product.details.sweetnessOptions.map(opt => (
                              <button
                                key={opt}
                                onClick={() => handleSpecChange(product.id, 'sweet', opt)}
                                className={`text-[11px] font-sans px-3 py-1 rounded-full border transition-all ${
                                  specs.sweet === opt
                                    ? 'bg-amber-600 text-white border-amber-600 font-medium'
                                    : 'border-amber-200/60 bg-[#FAF9F5] text-[#5C5243] hover:border-amber-400'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Temperature Specifications */}
                      {product.details.temperatureOptions && product.details.temperatureOptions.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase font-mono tracking-wider text-[#A29481] mb-1.5">
                            饮度温度 (Temperature)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {product.details.temperatureOptions.map(opt => (
                              <button
                                key={opt}
                                onClick={() => handleSpecChange(product.id, 'temp', opt)}
                                className={`text-[11px] font-sans px-3 py-1 rounded-full border transition-all ${
                                  specs.temp === opt
                                    ? 'bg-amber-600 text-white border-amber-600 font-medium'
                                    : 'border-amber-200/60 bg-[#FAF9F5] text-[#5C5243] hover:border-amber-400'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add action buttons */}
                  <div className="flex items-center justify-between border-t border-[#F5EFE6] pt-5 mt-auto">
                    <div>
                      <span className="text-[10px] font-mono font-bold block text-outline-variant leading-none uppercase mb-1">
                        🍂 秋实尊享价
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl sm:text-2xl font-serif font-bold text-amber-800 leading-none">
                          ¥{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs font-mono line-through text-outline-variant leading-none">
                            ¥{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="py-2.5 px-4.5 rounded-full border border-amber-600/30 text-amber-800 font-serif text-xs font-bold bg-[#FAF9F5] hover:bg-amber-50 active:scale-95 transition-all"
                      >
                        茶评赏析
                      </button>
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="py-2.5 px-5 bg-amber-800 text-white font-serif text-xs font-bold rounded-full shadow-sm hover:bg-amber-900 glow-btn active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        置入清单
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Interactive Autumn Ambiance Tea Set Builder Section */}
      <section className="bg-[#FAF0E4] py-16 border-t border-b border-[#EFE2D2] relative overflow-hidden">
        {/* Subtle decorative autumn maple-leaf branch overlay on right */}
        <div className="absolute right-0 bottom-0 top-0 opacity-10 select-none pointer-events-none flex items-center justify-center">
          <Leaf className="w-96 h-96 transform rotate-45 text-amber-900 fill-amber-700" />
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.25em] font-mono text-[#985F2C] bg-amber-100 px-3.5 py-1 rounded-full font-bold uppercase inline-block">
              秋 风 生 音 · 禅 意 自 选 套 餐
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B2C16] mt-4">
              主厨特调：秋日和风双人茶点餐
            </h2>
            <p className="text-xs text-[#7A6A53] max-w-md mx-auto mt-2 leading-relaxed">
              在这里自选一款秋日限定甜点和一杯暖秋饮品组合，享受秋季专属减免优惠，暖胃更暖心。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Cake Selector Panel */}
            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-5 shadow-inner border border-amber-200/20">
              <h4 className="font-serif text-sm font-bold text-amber-900 border-b border-[#FAF0E4] pb-2 mb-3.5 flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-500" />
                第①步：选一件限定甜点
              </h4>
              <div className="space-y-2.5">
                {autumnProducts.filter(p => p.category === 'cakes' || p.category === 'icecream').map(cake => {
                  const isSelected = selectedSetCake?.id === cake.id;
                  return (
                    <div 
                      key={cake.id}
                      onClick={() => setSelectedSetCake(cake)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-amber-600 bg-amber-50/40 shadow-xs' 
                          : 'border-transparent hover:bg-neutral-50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <img src={cake.image} alt={cake.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-serif text-xs font-bold text-amber-950">{cake.name}</p>
                        <p className="text-[10px] text-outline truncate max-w-[200px]">{cake.description}</p>
                      </div>
                      <div className="shrink-0 text-right pr-1">
                        <span className="font-serif text-xs font-bold text-amber-800">¥{cake.price}</span>
                        <div className={`w-4 h-4 rounded-full border border-amber-300 mt-1 flex items-center justify-center ${
                          isSelected ? 'bg-amber-600 border-amber-600 text-white' : ''
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drinks Selector Panel */}
            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-5 shadow-inner border border-amber-200/20">
              <h4 className="font-serif text-sm font-bold text-amber-900 border-b border-[#FAF0E4] pb-2 mb-3.5 flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-500" />
                第②步：选一杯暖饮佐茶
              </h4>
              <div className="space-y-2.5">
                {autumnProducts.filter(p => p.category === 'drinks').map(drink => {
                  const isSelected = selectedSetDrink?.id === drink.id;
                  return (
                    <div 
                      key={drink.id}
                      onClick={() => setSelectedSetDrink(drink)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-amber-600 bg-amber-50/40 shadow-xs' 
                          : 'border-transparent hover:bg-neutral-50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <img src={drink.image} alt={drink.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-serif text-xs font-bold text-amber-950">{drink.name}</p>
                        <p className="text-[10px] text-outline truncate max-w-[200px]">{drink.description}</p>
                      </div>
                      <div className="shrink-0 text-right pr-1">
                        <span className="font-serif text-xs font-bold text-amber-800">¥{drink.price}</span>
                        <div className={`w-4 h-4 rounded-full border border-amber-300 mt-1 flex items-center justify-center ${
                          isSelected ? 'bg-amber-600 border-amber-600 text-white' : ''
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Combined pricing and Order summary box */}
          {selectedSetCake && selectedSetDrink && (
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E9DFD0] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-2xl">🍁</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif text-sm font-bold text-amber-950">秋日和风双人套餐</span>
                    <span className="text-[9px] font-sans font-bold text-white bg-amber-600 px-2.5 py-0.5 rounded-full leading-none">
                      套餐立减 ¥20
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A6A53] leading-relaxed">
                    已选：{selectedSetCake.name} + {selectedSetDrink.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-xs text-outline line-through">
                      原价 ¥{selectedSetCake.price + selectedSetDrink.price}
                    </span>
                    <span className="text-2xl font-serif font-bold text-amber-800">
                      ¥{selectedSetCake.price + selectedSetDrink.price - 20}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-outline block">
                    *包含冷链必达配送及秋桂手工贺片一份
                  </span>
                </div>

                <button
                  onClick={handlePurchaseSetForTwo}
                  className="py-3 px-6 bg-gradient-to-r from-amber-700 to-amber-800 text-white font-serif text-xs font-bold rounded-full shadow hover:shadow-lg hover:from-amber-800 hover:to-amber-900 active:scale-95 transition-all duration-150 flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  购买套餐
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Autumn Zen Epilogue Card */}
      <section className="max-w-4xl mx-auto px-4 mt-20 text-center">
        <div className="backdrop-blur-md bg-white/40 border border-amber-200/20 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-800/20 rounded-tl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-800/20 rounded-br-3xl"></div>
          
          <span className="text-[20px] mb-3 inline-block">🎑</span>
          <h3 className="font-serif text-lg font-bold text-amber-950 mb-4">
            秋风无端起，茶寮见良人。
          </h3>
          <p className="text-xs sm:text-sm font-serif italic text-[#7C6E56] max-w-xl mx-auto leading-relaxed mb-8">
            “庭前落叶打黄梅，灶冷松枝火半熄。
            唯有釜中茶鼎沸，一杯和暖唤秋归。”
            每小时仅磨30克的极稀有秋季宇治抹茶，以一盏温盏与丹赤白花，静候尘世之中的有缘重温。
          </p>

          <button
            onClick={onNavigateToCatalog}
            className="font-serif text-xs font-bold text-amber-900 hover:text-amber-700 inline-flex items-center gap-1.5 transition-colors group cursor-pointer"
          >
            返回浏览常规甜点全谱
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}

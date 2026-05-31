/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Flame, HelpCircle, ArrowUpRight, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { products } from '../data';

interface CatalogViewProps {
  category: 'cakes' | 'drinks' | 'icecream' | 'gifts' | 'all';
  onSelectCategory: (category: 'cakes' | 'drinks' | 'icecream' | 'gifts' | 'all') => void;
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

  return (
    <div className="w-full pb-20">
      {/* Search Header Banner */}
      <section className="bg-gradient-to-b from-primary-light/40 to-[#FDFCF8] pt-10 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif italic text-3xl font-bold text-primary mb-3">
            宇 治 特 选 甜 点 谱
          </h1>
          <p className="text-xs text-on-surface-variant mb-6 tracking-wide">
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
            <Search className="w-4 h-4 text-outline absolute left-4 top-1/2 -translate-y-1/2" />
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
                  : 'bg-white text-on-surface-variant hover:text-primary hover:bg-surface-beige/30'
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

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* Count & Sorters bar */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 mb-8 pb-4 border-b border-[#c4c8b7]/20">
          <div className="text-xs text-on-surface-variant">
            找到 <span className="font-bold text-primary font-mono">{filteredProducts.length}</span> 款 精致点心商品
          </div>
          
          <div className="flex items-center gap-2 max-xs:w-full">
            <span className="text-[10px] text-outline font-sans tracking-wide">排序:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#c4c8b7]/40 text-xs text-on-surface rounded-full py-1.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="rating">⭐️ 人气推荐</option>
              <option value="priceAsc">📈 价格：从低到高</option>
              <option value="priceDesc">📉 价格：从高到低</option>
            </select>
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/40 border border-[#c4c8b7]/10 rounded-3xl max-w-xl mx-auto">
            <Search className="w-12 h-12 text-outline/50 mx-auto mb-4" />
            <h3 className="font-serif text-lg text-on-surface mb-1">未找到相符的商品</h3>
            <p className="text-xs text-outline mb-6">更正检索词或选择其他分类尝试寻茶吧</p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
              }}
              className="py-2.5 px-6 bg-primary text-white text-xs rounded-full font-bold"
            >
              重置分类
            </button>
          </div>
        ) : (
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
                      <ArrowUpRight className="w-4.5 h-4.5" />
                    </div>
                  </div>

                  {prod.originalPrice && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full z-10">
                      减 {Math.round(prod.originalPrice - prod.price)}元
                    </div>
                  )}

                  {/* Hot tag */}
                  {prod.reviewsCount > 500 && (
                    <div className="absolute top-3 right-3 bg-secondary-container text-primary font-serif text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-0.5 shadow-sm z-10">
                      <Flame className="w-3 h-3 text-primary animate-bounce" />
                      口碑爆款
                    </div>
                  )}
                </div>

                {/* Info block */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1 h-12">
                    <h3 className="font-serif text-base text-on-surface font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {prod.name}
                    </h3>
                  </div>
                  
                  <p className="text-[9px] text-outline font-mono uppercase tracking-wider line-clamp-1 mb-2">
                    {prod.enName}
                  </p>

                  <p className="text-xs text-[#44483c] line-clamp-2 leading-relaxed mb-4 flex-grow">
                    {prod.description}
                  </p>

                  {/* Rating / Counts */}
                  <div className="flex items-center gap-1.5 text-[10px] text-outline mb-3.5">
                    <span className="text-[#45621b] font-bold">★ {prod.rating}</span>
                    <span className="text-[#c4c8b7] font-sans">|</span>
                    <span>{prod.reviewsCount}+ 好评数</span>
                  </div>

                  {/* Footer & Action Button */}
                  <div className="flex justify-between items-center pt-3 border-t border-[#c4c8b7]/20 mt-auto">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-base font-bold text-primary">
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
                      className="group/btn px-3 py-1.5 bg-primary-light text-primary hover:bg-primary hover:text-white text-xs font-serif font-bold rounded-full transition-all duration-300 flex items-center gap-1.5 spring-click cursor-pointer"
                    >
                      <span>添入购物车</span>
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

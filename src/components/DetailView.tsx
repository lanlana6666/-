/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Heart, ShieldCheck, Truck, Star, Sparkles, MessageSquare } from 'lucide-react';
import { Product } from '../types';
import { products } from '../data';

interface DetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, options: { size?: string; sweetness?: string; temp?: string }) => void;
  onSelectProduct: (product: Product) => void;
  onCheckoutDirectly: (product: Product, quantity: number, options: { size?: string; sweetness?: string; temp?: string }) => void;
}

export default function DetailView({
  product,
  onBack,
  onAddToCart,
  onSelectProduct,
  onCheckoutDirectly,
}: DetailViewProps) {
  const [selectedImg, setSelectedImg] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.details.sizeOptions ? product.details.sizeOptions[0] : ''
  );
  const [selectedSweetness, setSelectedSweetness] = useState<string>(
    product.details.sweetnessOptions ? product.details.sweetnessOptions[0] : ''
  );
  const [selectedTemperature, setSelectedTemperature] = useState<string>(
    product.details.temperatureOptions ? product.details.temperatureOptions[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [liked, setLiked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'process' | 'reviews'>('details');

  // Multi-images lists
  const gallery = [product.image, ...product.subImages];

  // recommended combination items
  const pairingItems = products.filter(p => product.pairingIds.includes(p.id));

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const selectedOptions = {
    size: selectedSize || undefined,
    sweetness: selectedSweetness || undefined,
    temp: selectedTemperature || undefined,
  };

  return (
    <div className="w-full pb-24">
      {/* Immersive Detail Gallery Banner */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        {/* Navigation Breadcrumb inside page */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="group flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1.5 transition-transform duration-300" />
            返回浏览大厅
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className="p-2 bg-white border border-outline-variant/30 rounded-full text-on-surface hover:text-[#ba1a1a] transition-colors"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-[#ba1a1a] text-[#ba1a1a]' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Gallery Sub-Component (7 columns) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-surface-beige border border-outline-variant/20 shadow-sm relative">
              <img
                src={selectedImg}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            
            {/* Horizontal gallery list */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 mt-1 hide-scrollbar">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    className={`min-w-[80px] w-20 aspect-square rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImg === img ? 'border-primary scale-102' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="产品图" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Selector Form (5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <div className="flex gap-2 mb-3">
                <span className="bg-primary/10 text-primary text-[10px] font-sans px-3 py-1 rounded-full font-bold">
                  宇治直采
                </span>
                <span className="bg-secondary-container text-primary text-[10px] font-sans px-3 py-1 rounded-full font-bold">
                  减脂低能
                </span>
              </div>
              
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-2">
                {product.name}
              </h1>
              <p className="text-xs text-outline font-mono tracking-wider uppercase mb-4">
                {product.enName}
              </p>

              <div className="flex items-baseline gap-2 pb-5 border-b border-[#c4c8b7]/30">
                <span className="font-mono text-3xl font-bold text-primary">
                  ¥{product.price}
                </span>
                {product.originalPrice && (
                  <span className="font-mono text-base text-outline line-through">
                    ¥{product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Description list */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono text-outline tracking-wider uppercase">甜点茶香心语</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Sizes Custom Picker */}
            {product.details.sizeOptions && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-outline tracking-wider uppercase">
                    分量规格 Size
                  </span>
                  {selectedSize && (
                    <span className="text-xs text-primary font-bold">{selectedSize}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {product.details.sizeOptions.map((sz, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 px-3 text-xs text-center font-bold tracking-wide rounded-xl border transition-all ${
                        selectedSize === sz
                          ? 'border-primary bg-primary-light/40 text-primary font-semibold'
                          : 'border-[#c4c8b7]/40 hover:border-primary text-on-surface-variant'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sweetness Selector */}
            {product.details.sweetnessOptions && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-outline tracking-wider uppercase">
                    甜度选择 Sweetness
                  </span>
                  {selectedSweetness && (
                    <span className="text-xs text-primary font-bold">{selectedSweetness}</span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.details.sweetnessOptions.map((sw, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSweetness(sw)}
                      className={`py-2 px-4 text-xs font-semibold rounded-full border transition-all ${
                        selectedSweetness === sw
                          ? 'border-primary bg-primary text-white font-bold'
                          : 'border-[#c4c8b7]/40 hover:border-primary text-on-surface-variant'
                      }`}
                    >
                      {sw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Temperature Option */}
            {product.details.temperatureOptions && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-outline tracking-wider uppercase">
                    温度首选 Temperature
                  </span>
                  {selectedTemperature && (
                    <span className="text-xs text-primary font-bold">{selectedTemperature}</span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.details.temperatureOptions.map((tp, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedTemperature(tp)}
                      className={`py-2 px-4 text-xs font-semibold rounded-full border transition-all ${
                        selectedTemperature === tp
                          ? 'border-primary bg-primary text-white font-bold'
                          : 'border-[#c4c8b7]/40 hover:border-primary text-on-surface-variant'
                      }`}
                    >
                      {tp}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector and Order Action panel */}
            <div className="space-y-4 pt-2 border-t border-[#c4c8b7]/30">
              <span className="text-xs font-mono text-outline tracking-wider uppercase block">
                预定数量 Quantity
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-surface-beige rounded-full px-4 py-2 border border-[#c4c8b7]/40">
                  <button
                    onClick={handleDecrease}
                    className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors text-base font-bold"
                  >
                    -
                  </button>
                  <span className="mx-4 font-mono font-bold text-sm min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors text-base font-bold"
                  >
                    +
                  </button>
                </div>
                
                <span className="text-xs text-outline font-sans">
                  极速冷链市区配送2小时内达
                </span>
              </div>

              {/* Action grid button */}
              <div className="grid grid-cols-5 gap-3 h-14 pt-2">
                <button
                  onClick={() => onAddToCart(product, selectedOptions)}
                  className="col-span-2 bg-surface-beige hover:bg-primary-light text-primary border border-primary/20 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors spring-click"
                >
                  <ShoppingCart className="w-4 h-4" />
                  入购物车
                </button>
                <button
                  onClick={() => onCheckoutDirectly(product, quantity, selectedOptions)}
                  className="col-span-3 bg-primary text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center transition-colors shadow-md shadow-primary/15 hover:opacity-95 spring-click"
                >
                  极速立即预订
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion tabs section */}
      <section className="max-w-7xl mx-auto px-4 mt-20 border-t border-[#c4c8b7]/30 pt-10">
        <div className="flex gap-8 mb-8 border-b border-[#c4c8b7]/20 pb-0.5 overflow-x-auto hide-scrollbar">
          {[
            { id: 'details', name: '原料与膳食档案' },
            { id: 'process', name: '手作工艺过程' },
            { id: 'reviews', name: `真实食客评价 (${product.reviewsCount}+)` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs sm:text-sm font-serif font-bold tracking-wider relative whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab.name}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab content panel */}
        <div className="max-w-4xl">
          {activeTab === 'details' && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h4 className="font-serif text-base text-on-surface font-semibold mb-2">
                  精挑原材料食材溯源
                </h4>
                <p className="text-xs sm:text-sm text-on-surface-variant gap-2 leading-relaxed">
                  {product.details.ingredients}
                </p>
              </div>

              <div className="bg-surface-beige p-6 rounded-2xl grid grid-cols-2 gap-6 max-w-lg border border-outline-variant/25">
                <div>
                  <span className="text-[10px] text-outline uppercase block mb-1">
                    膳食卡路里
                  </span>
                  <span className="text-sm font-bold text-on-surface font-mono">
                    {product.details.calories}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-outline uppercase block mb-1">
                    含糖等级
                  </span>
                  <span className="text-sm font-bold text-on-surface">
                    {product.details.sugar}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="space-y-6 animate-fade-in-up">
              <h4 className="font-serif text-base text-on-surface font-semibold mb-2">
                24小时恒温碾轧与慢烤工艺
              </h4>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
                极品天然食材的极致风味，无法通过大规模商用设备批量复设。在恒暗20℃的石磨室中，极重石盘每分钟仅缓速旋转55下，以防微弱摩擦热挥发茶叶中最灵秘的高山茶酰。
              </p>
              
              {/* Pictures grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="h-44 sm:h-52 rounded-2xl overflow-hidden shadow-inner">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfd87Q33186GQpWptDHQqonM4YyypRQIYiazpapbIWOZ3gVv_lKwXAasBHdvkcFqw7jBGdrq7CeRt9q4Y-KmXeaUhdIjDzse1a2Fnb1AKUhbq_dzDjYgDBgMT-cBsPgGbW6jXTRwWkcuxqN0xWiGZ61vu25owLu8LA9700qhLe6Q7kiSVBWPrHXfU3h8sWBrXZNHdsxJomHpyTOUbGbpp_Fqz4qvxOAbRpGpesHIhPIN_B0xpeBl-q9TcuqyXSbZ7PD9Uvt6h1No6P"
                    alt="和风揉制揉搓过程"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-44 sm:h-52 rounded-2xl overflow-hidden shadow-inner">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6z33Tku73-aPqdqz3RaNGwl6PEzJ0ba6kwvPmcTSP8-ydWOz6Fus_GSUSgWQluPSb_7Eff30DGhBenXgD2RkwjqrNOuJR_UhhIEMS3amQBAu6UrHzRceZsLmQMva-I5AvlcIRZ9ORJSy8oBTFDv5KjS_6WmL7Ef1-A2iFmi95iQb-H-fPK5kEpbnpVPyvsUJ2lYpo50lLbjaws_c9sNv76hIiRgWUI6eOLjvln7I_3jmWgY3pGzdOcBfpBe4R98mmmeLbxJ4N0_RG"
                    alt="刚出炉的精制甜品"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in-up">
              {product.reviews.length === 0 ? (
                <div className="py-10 text-center text-outline text-xs">
                  暂无对此定制批次的评价，首订体验后可写评语。
                </div>
              ) : (
                product.reviews.map(cmt => (
                  <div key={cmt.id} className="pb-6 border-b border-[#c4c8b7]/10 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={cmt.avatar}
                          alt={cmt.user}
                          className="w-8 h-8 rounded-full object-cover shadow-sm"
                        />
                        <div>
                          <div className="text-xs font-bold text-on-surface">{cmt.user}</div>
                          <div className="text-[10px] text-outline font-mono mt-0.5">{cmt.date}</div>
                        </div>
                      </div>
                      
                      <div className="flex text-amber-500 gap-0.5">
                        {Array.from({ length: cmt.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      {cmt.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Suggested pairings */}
      {pairingItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-20">
          <div className="mb-8">
            <span className="text-primary text-[10px] tracking-widest font-mono uppercase block mb-1">
              Zen Pairing Inspiration
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-on-surface">
              灵 感 搭配和弦推荐
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pairingItems.map(pair => (
              <div
                key={pair.id}
                onClick={() => {
                  onSelectProduct(pair);
                  setSelectedImg(pair.image);
                  setSelectedSize(pair.details.sizeOptions ? pair.details.sizeOptions[0] : '');
                  setSelectedSweetness(pair.details.sweetnessOptions ? pair.details.sweetnessOptions[0] : '');
                  setSelectedTemperature(pair.details.temperatureOptions ? pair.details.temperatureOptions[0] : '');
                  setQuantity(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white border border-outline-variant/30 rounded-2xl p-4 flex flex-col items-center text-center gap-3.5 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-surface-beige">
                  <img
                    src={pair.image}
                    alt={pair.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-on-surface mb-0.5">
                    {pair.name}
                  </h4>
                  <p className="text-[10px] text-outline leading-tight">
                    {pair.description.slice(0, 24)}...
                  </p>
                </div>
                <div className="mt-auto flex justify-between items-center w-full pt-2 border-t border-[#c4c8b7]/10">
                  <span className="font-mono text-xs font-bold text-primary">¥{pair.price}</span>
                  <span className="text-[10px] text-primary hover:underline font-bold flex items-center gap-0.5">
                    查看详情 →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

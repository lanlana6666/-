/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Minus, Plus, Trash2, Tag, ChevronRight, Gift, CircleAlert } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { coupons } from '../data';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQty: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onCheckout: (discount: number, couponCode: string, ecoPacking: boolean) => void;
  onNavigateToCatalog: () => void;
}

export default function CartView({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onNavigateToCatalog,
}: CartViewProps) {
  const [couponInput, setCouponInput] = useState<string>('');
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [ecoPacking, setEcoPacking] = useState<boolean>(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Apply voucher validation
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const voucher = coupons.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase());
    
    if (!voucher) {
      setCouponError('⚠️ 无效的优惠券代码，请仔细核对');
      setActiveCoupon(null);
      return;
    }

    if (subtotal < voucher.minSpend) {
      setCouponError(`⚠️ 该券需订单金额满 ¥${voucher.minSpend} 才能兑享使用（当前差 ¥${(voucher.minSpend - subtotal).toFixed(2)}）`);
      setActiveCoupon(null);
      return;
    }

    setActiveCoupon(voucher);
    setCouponError('');
  };

  const discountAmount = activeCoupon ? activeCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-fade-in-up">
        <div className="w-16 h-16 bg-surface-beige border border-outline-variant/30 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-on-surface mb-2">
          您的购物车是空的
        </h2>
        <p className="text-xs text-outline mb-8 leading-relaxed max-w-xs mx-auto">
          尚未开始选购极富哲意茶寮的手作甜品，快去大厅探索吧！
        </p>
        <button
          onClick={onNavigateToCatalog}
          className="py-3 px-8 bg-primary hover:opacity-95 text-white font-serif font-bold rounded-full text-xs sm:text-sm shadow-sm active:scale-95 transition-all duration-150"
        >
          探索经典茶礼点心
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in-up">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface mb-8">
        您的点心清单
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Item Row List (8 columns) */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-outline-variant/30 p-4 sm:p-5 flex gap-4 items-center shadow-inner hover:shadow-md transition-shadow"
            >
              {/* Image box */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-surface-beige border border-outline-variant/20">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description body */}
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <div>
                    <h3 className="font-serif text-sm sm:text-base text-on-surface font-semibold truncate leading-tight">
                      {item.product.name}
                    </h3>
                    <p className="text-[10px] text-outline font-mono uppercase tracking-wider mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.product.enName}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 text-outline hover:text-error transition-colors border border-transparent hover:border-[#c4c8b7]/20 rounded-lg shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Sub-options lists */}
                {(item.selectedSize || item.selectedSweetness || item.selectedTemperature) && (
                  <div className="flex gap-1.5 flex-wrap mb-3.5">
                    {item.selectedSize && (
                      <span className="text-[10px] bg-surface-beige text-on-surface-variant font-medium px-2 py-0.5 rounded-md">
                        {item.selectedSize}
                      </span>
                    )}
                    {item.selectedSweetness && (
                      <span className="text-[10px] bg-primary/5 text-primary font-medium px-2 py-0.5 rounded-md">
                        {item.selectedSweetness}
                      </span>
                    )}
                    {item.selectedTemperature && (
                      <span className="text-[10px] bg-secondary-container/30 text-secondary font-medium px-2 py-0.5 rounded-md">
                        {item.selectedTemperature}
                      </span>
                    )}
                  </div>
                )}

                {/* Counter and Price grid */}
                <div className="flex justify-between items-center bg-surface-beige/30 pt-2 border-t border-outline-variant/10">
                  <div className="flex items-center bg-surface-beige rounded-full px-2.5 py-1 border border-[#c4c8b7]/20">
                    <button
                      onClick={() => onUpdateQty(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors text-xs font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="mx-2.5 font-mono font-bold text-xs min-w-[14px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQty(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors text-xs font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-mono text-sm sm:text-base font-bold text-primary">
                    ¥{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Quick recommendations tag */}
          <div className="bg-surface-beige/60 border border-dashed border-[#c4c8b7]/40 rounded-2xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🍵</span>
              <div>
                <p className="text-xs font-serif font-bold text-on-surface">再加一些宇治特调？</p>
                <p className="text-[10px] text-outline mt-0.5">搭配冷萃大福口感极其柔顺</p>
              </div>
            </div>
            <button
              onClick={onNavigateToCatalog}
              className="text-xs text-primary hover:underline font-bold flex items-center gap-0.5 shrink-0"
            >
              继续添购点心
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pricing Summary Block (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-on-surface pb-4 border-b border-[#c4c8b7]/25 mb-5">
              费 用 对 账 摘要
            </h2>

            {/* Packaging options card */}
            <div className="mb-6 p-4 bg-primary-light/35 border border-primary/10 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  礼赠包装选择
                </span>
                <input
                  type="checkbox"
                  id="ecoPacking"
                  checked={ecoPacking}
                  onChange={(e) => setEcoPacking(e.target.checked)}
                  className="w-4.5 h-4.5 text-primary rounded border-[#c4c8b7] focus:ring-primary/25 focus:ring-opacity-50"
                />
              </div>
              <label htmlFor="ecoPacking" className="text-[10px] text-on-surface-variant leading-relaxed block cursor-pointer">
                勾选即启用 “环保手工纸礼格+缎带+明信片定制手写” (免费配套，未勾选默认标准安全便冷包装)。
              </label>
            </div>

            {/* Interactive Coupon Code Entry form */}
            <div className="mb-6">
              <span className="text-xs font-mono text-outline uppercase tracking-wider block mb-2">
                可选用优惠券券码
              </span>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="如 MATCHA88"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-grow bg-[#f4f4f2] border-none text-xs px-3.5 py-2 rounded-xl text-on-surface uppercase font-mono tracking-wider focus:ring-1 focus:ring-primary placeholder:text-outline/65 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="py-2.5 px-4 bg-primary hover:opacity-95 text-white text-xs font-serif font-bold rounded-xl active:scale-95 transition-all outline-none"
                >
                  激活应用
                </button>
              </form>

              {couponError && (
                <p className="text-[10px] text-[#ba1a1a] mt-2 font-medium leading-relaxed">
                  {couponError}
                </p>
              )}

              {activeCoupon && (
                <div className="mt-3.5 bg-green-50 border border-[#45621b]/20 p-3 rounded-xl flex items-start gap-1.5 text-xs text-[#45621b]">
                  <CircleAlert className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">兑享券优惠已激活: {activeCoupon.code}</span>
                    <p className="text-[10px] text-outline-dark/80 mt-0.5">{activeCoupon.description}</p>
                  </div>
                </div>
              )}

              {/* Promo suggestions */}
              {!activeCoupon && (
                <div className="mt-3 px-1">
                  <p className="text-[10px] text-outline leading-tight">
                    💡 提示：输入首订新券码 <span className="font-bold text-primary font-mono copy-text">MATCHA88</span> 即可享受立减 ¥20 的爆满福利！
                  </p>
                </div>
              )}
            </div>

            {/* Price lines */}
            <div className="space-y-3 pt-4 border-t border-[#c4c8b7]/20">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>甜品小计</span>
                <span className="font-mono">¥{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>顺丰冷链配送费</span>
                <span className="text-primary font-serif">包邮 (限时免)</span>
              </div>
              
              {activeCoupon && (
                <div className="flex justify-between text-xs text-error font-medium">
                  <span>活动卷减扣</span>
                  <span className="font-mono">-¥{activeCoupon.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-4 border-t border-[#c4c8b7]/30 flex justify-between items-baseline mb-6">
                <span className="font-serif text-sm text-on-surface font-semibold">最终结余额</span>
                <span className="font-mono text-2xl font-bold text-primary">
                  ¥{grandTotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => onCheckout(discountAmount, activeCoupon ? activeCoupon.code : '', ecoPacking)}
                className="w-full bg-primary hover:opacity-95 text-white py-4 rounded-xl text-center text-sm font-sans font-bold shadow-md shadow-primary/15 transition-all duration-150 active:scale-95 flex justify-center items-center gap-1 mb-2"
              >
                前往填写配送详情
              </button>
              
              <p className="text-center text-[10px] text-outline leading-relaxed px-2">
                * 点击去结算即代表您同意茶寮预订退换及手工现制规则。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Truck, MapPin, Calendar, Clock, MessageSquare, AlertCircle, Sparkles, ChevronLeft } from 'lucide-react';
import { CartItem, ShippingInfo } from '../types';

interface CheckoutViewProps {
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  couponCode: string;
  ecoPacking: boolean;
  onNavigateToCart: () => void;
  onSubmitCheckout: (info: ShippingInfo) => void;
}

export default function CheckoutView({
  cartItems,
  subtotal,
  discount,
  couponCode,
  ecoPacking,
  onNavigateToCart,
  onSubmitCheckout,
}: CheckoutViewProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(() => {
    // Default to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().substring(0, 10);
  });
  const [timeSlot, setTimeSlot] = useState('下午 (13:00 - 17:00)');
  const [giftCardMessage, setGiftCardMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [formError, setFormError] = useState('');

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    setPhoneError('');
    if (val && !/^1[3-9]\d{9}$/.test(val)) {
      setPhoneError('⚠️ 请输入正确的11位中国手机号');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setFormError('⚠️ 请完善并填妥姓名、联系电话以及详细配送地址');
      return;
    }

    if (phoneError || !/^1[3-9]\d{9}$/.test(phone)) {
      setFormError('⚠️ 手机号格式有误，请更正后再提交');
      return;
    }

    const shippingInfo: ShippingInfo = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      date,
      timeSlot,
      giftCardMessage: giftCardMessage.trim(),
      ecoPacking,
    };

    onSubmitCheckout(shippingInfo);
  };

  const finalTotal = Math.max(0, subtotal - discount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in-up">
      <div className="mb-8 flex gap-3.5 items-center">
        <button
          onClick={onNavigateToCart}
          className="group p-2 border border-[#c4c8b7]/30 hover:bg-surface-beige rounded-xl text-on-surface transition-all duration-300 spring-click cursor-pointer"
          title="返回购物车"
        >
          <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" />
        </button>
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">确认订单并配送</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">请确认您的极速顺丰配送信息与订单名细</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side Column: Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="bg-white rounded-2xl border border-outline-variant/30 p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-on-surface border-b border-[#c4c8b7]/20 pb-4 mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                顺丰极速冷链配送
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-on-surface-variant font-bold ml-1">
                      收货人姓名
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="如何称呼您"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-surface-beige/70 focus:bg-white text-xs px-4 py-3 border-none rounded-xl focus:ring-2 focus:ring-primary/25 outline-none transition-all placeholder:text-outline/70"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-on-surface-variant font-bold ml-1">
                      联系电话
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="11位手机号"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="bg-surface-beige/70 focus:bg-white text-xs px-4 py-3 border-none rounded-xl focus:ring-2 focus:ring-primary/25 outline-none transition-all placeholder:text-outline/70"
                    />
                    {phoneError && <p className="text-[10px] text-error mt-1 font-semibold">{phoneError}</p>}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono text-on-surface-variant font-bold ml-1">
                    详细送餐收货地址
                  </label>
                  <textarea
                    required
                    placeholder="请输入写字楼、小区、公寓名称以及具体楼层门牌号"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="bg-surface-beige/70 focus:bg-white text-xs px-4 py-3 border-none rounded-xl focus:ring-2 focus:ring-primary/25 outline-none transition-all resize-none placeholder:text-outline/70"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-on-surface-variant font-bold ml-1">
                      预约送达日期
                    </label>
                    <input
                      required
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-surface-beige/70 focus:bg-white text-xs px-4 py-3 border-none rounded-xl focus:ring-2 focus:ring-primary/25 outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-on-surface-variant font-bold ml-1">
                      首选时间区间
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="bg-surface-beige/70 focus:bg-white text-xs px-4 py-3 border-none rounded-xl focus:ring-2 focus:ring-primary/25 outline-none transition-all"
                    >
                      <option>上午 (09:00 - 12:00)</option>
                      <option>下午 (13:00 - 17:00)</option>
                      <option>晚上 (18:00 - 21:00)</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Greeting card note custom details */}
            <section className="bg-primary-container text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
              <div className="relative z-10 max-w-xl">
                <div className="flex items-center gap-1.5 mb-2 text-[#cbee97]">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-serif text-base font-bold">书写手书明信片和礼寄寄语</h3>
                </div>
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  若是赠礼订单或生日庆典，我们可提供手印蜡章宇治和风卡纸贺卡冲印，由茶艺馆师代为您手写书法卡寄语（限40字内），随冷链精妥包配。
                </p>
                <textarea
                  placeholder="请输入您的卡片寄语（如：祝亲爱的小张生日快乐，笑口常开，一室清宁。不需代卡则留空即可）..."
                  value={giftCardMessage}
                  onChange={(e) => setGiftCardMessage(e.target.value)}
                  rows={2}
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 text-xs px-4 py-3 rounded-xl shadow-inner focus:ring-1 focus:ring-white outline-none transition-all placeholder:text-white/40 text-white"
                />
              </div>
            </section>

            {formError && (
              <div className="p-3.5 bg-error-container text-error rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:opacity-95 text-white py-4.5 rounded-2xl font-serif font-bold text-center text-sm shadow-md shadow-primary/20 transition-all duration-200 active:scale-95"
            >
              提交订单并前往安全支付
            </button>
          </form>
        </div>

        {/* Right Side Column: Order lines preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-28">
          <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-md">
            <div className="p-6">
              <h2 className="font-serif text-lg font-bold text-on-surface border-b border-[#c4c8b7]/20 pb-4 mb-6">
                订单商品预览
              </h2>

              {/* Items lists inside checkout */}
              <div className="space-y-5 max-h-[280px] overflow-y-auto pr-1 hide-scrollbar">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-beige border border-outline-variant/20">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-serif text-xs sm:text-sm font-semibold text-on-surface truncate">
                        {item.product.name}
                      </h3>
                      {(item.selectedSize || item.selectedSweetness || item.selectedTemperature) && (
                        <p className="text-[10px] text-outline truncate mt-0.5">
                          {item.selectedSize} / {item.selectedSweetness} {item.selectedTemperature}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="text-xs text-on-surface-variant font-mono">
                          x{item.quantity}
                        </span>
                        <span className="text-xs font-bold font-mono text-primary">
                          ¥{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown numbers */}
              <div className="mt-8 pt-6 border-t border-[#c4c8b7]/20 flex flex-col gap-3.5">
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>商品小计</span>
                  <span className="font-mono">¥{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>顺丰极冷链物流</span>
                  <span className="text-primary font-serif">包邮 (限免)</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs text-error font-medium">
                    <span className="flex items-center gap-1">
                      🏷️ 优惠代码 {couponCode}
                    </span>
                    <span className="font-mono">-¥{discount.toFixed(2)}</span>
                  </div>
                )}
                {ecoPacking && (
                  <div className="flex justify-between text-xs text-[#45621b] font-medium">
                    <span>🎁 环保礼赠定制包</span>
                    <span>已免费启用</span>
                  </div>
                )}

                <div className="pt-4 border-t border-[#c4c8b7]/30 flex justify-between items-baseline mt-2">
                  <span className="font-serif text-sm font-semibold text-on-surface">实付最终总额</span>
                  <span className="font-mono text-3xl font-bold text-primary">
                    ¥{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, CheckCircle2, QrCode, CreditCard, Wallet, Copy, Share2, HelpCircle, Clock } from 'lucide-react';
import { CartItem, ShippingInfo, PaymentMethod } from '../types';

interface PaymentViewProps {
  cartItems: CartItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  discount: number;
  onPaymentSuccess: () => void;
  onResetApp: () => void;
}

export default function PaymentView({
  cartItems,
  shippingInfo,
  subtotal,
  discount,
  onPaymentSuccess,
  onResetApp,
}: PaymentViewProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wechat');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [payingState, setPayingState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [txId] = useState(() => 'MZ' + Date.now().toString().substring(5) + Math.floor(Math.random() * 90 + 10));

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || payingState === 'success') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, payingState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const finalAmount = Math.max(0, subtotal - discount);

  const handlePayDirectly = () => {
    setPayingState('processing');
    
    // Simulate payment clearing
    setTimeout(() => {
      setPayingState('success');
      onPaymentSuccess();
    }, 2200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
      {/* Timer / Order Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-surface-beige border border-[#c4c8b7]/30 p-5 rounded-2xl mb-10 gap-4">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-on-surface mb-0.5">订单支付中心</h1>
          <p className="text-xs text-on-surface-variant">订单支付编号：<span className="font-mono text-primary font-semibold">{txId}</span></p>
        </div>
        <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-full border border-primary/10 tracking-wide">
          <Clock className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs text-primary font-bold">
            支付剩余时间：<span className="font-mono">{formatTime(timeLeft)}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Left: Payment Method Grid List (7 cols) */}
        <div className="md:col-span-7 space-y-8">
          <section className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              支付渠道选择
            </h2>

            {/* WeChat */}
            <div
              onClick={() => setSelectedMethod('wechat')}
              className={`p-5 bg-white border rounded-2xl cursor-pointer transition-all flex items-center justify-between group hover:shadow-md ${
                selectedMethod === 'wechat'
                  ? 'border-primary bg-primary-light/10 shadow-sm'
                  : 'border-[#c4c8b7]/30 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-green-500/10">
                  <QrCode className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-sans font-bold text-on-surface">微信支付 WeChat Pay</p>
                  <p className="text-[10px] text-outline mt-0.5">支持扫码快捷、微信零钱及绑信用卡</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedMethod === 'wechat' ? 'border-primary' : 'border-[#c4c8b7]'
              }`}>
                {selectedMethod === 'wechat' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
              </div>
            </div>

            {/* Alipay */}
            <div
              onClick={() => setSelectedMethod('alipay')}
              className={`p-5 bg-white border rounded-2xl cursor-pointer transition-all flex items-center justify-between group hover:shadow-md ${
                selectedMethod === 'alipay'
                  ? 'border-primary bg-primary-light/10 shadow-sm'
                  : 'border-[#c4c8b7]/30 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-500/10">
                  <Wallet className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-sans font-bold text-on-surface">支付宝支付 Alipay</p>
                  <p className="text-[10px] text-outline mt-0.5">支持花呗分期、余额宝以及主流银行借记卡</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedMethod === 'alipay' ? 'border-primary' : 'border-[#c4c8b7]'
              }`}>
                {selectedMethod === 'alipay' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
              </div>
            </div>

            {/* Bank Card CreditCard */}
            <div
              onClick={() => setSelectedMethod('card')}
              className={`p-5 bg-white border rounded-2xl cursor-pointer transition-all flex items-center justify-between group hover:shadow-md ${
                selectedMethod === 'card'
                  ? 'border-primary bg-primary-light/10 shadow-sm'
                  : 'border-[#c4c8b7]/30 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary/10">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-sans font-bold text-on-surface">中国银联/信用卡支付 Bank Cards</p>
                  <p className="text-[10px] text-outline mt-0.5">支持国内全系储蓄卡、万事达卡、VISA结算</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedMethod === 'card' ? 'border-primary' : 'border-[#c4c8b7]'
              }`}>
                {selectedMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
              </div>
            </div>
          </section>

          {/* Guarantee Security */}
          <div className="bg-[#f4f4f2] p-5 rounded-2xl flex items-start gap-3.5 border border-[#c4c8b7]/10">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-serif font-bold text-on-surface mb-0.5">安全合规支付保护</p>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                您的交易在行业级 TLS 1.3 证书加密隧道内流转。本茶寮绝不擅自捕存顾客的核心资金、验证码、或银行卡密。
              </p>
            </div>
          </div>
        </div>

        {/* Right: Balance block (5 cols) */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 shadow-md sticky top-28">
            <h3 className="font-serif text-base font-bold text-on-surface pb-4 border-b border-[#c4c8b7]/25 mb-5">
              应付费用明细
            </h3>

            <div className="space-y-4 mb-7 text-xs text-on-surface-variant">
              <div className="flex justify-between">
                <span>小计 (共计 {cartItems.reduce((acc, i) => acc + i.quantity, 0)} 件点心)</span>
                <span className="font-mono">¥{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>顺丰极冷链运费</span>
                <span className="text-primary font-bold">免邮</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-error font-medium">
                  <span>满减优惠减免</span>
                  <span className="font-mono">-¥{discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#c4c8b7]/30 pt-5 mb-8">
              <div className="flex justify-between items-baseline">
                <span className="font-serif text-sm font-semibold">最终实付额额</span>
                <div className="text-right">
                  <span className="text-[10px] text-outline font-mono">RMB</span>
                  <span className="font-mono text-3xl font-bold text-primary ml-1">
                    {finalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Pay Button Action */}
            <button
              onClick={handlePayDirectly}
              disabled={payingState !== 'idle' || timeLeft <= 0}
              className={`w-full py-4 rounded-xl text-center text-sm font-sans font-bold shadow-md shadow-primary/15 transition-all outline-none flex items-center justify-center gap-2 active:scale-95 border-none ${
                payingState === 'idle'
                  ? 'bg-primary text-white hover:opacity-95'
                  : 'bg-primary/20 text-primary cursor-not-allowed'
              }`}
            >
              {payingState === 'processing' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>正在建立支付安全网桥...</span>
                </>
              ) : (
                <>
                  <span>立即授权支付 </span>
                  <ShieldCheck className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Payment success visual modal overlay */}
      {payingState === 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4 animate-fade-in-up">
          <div className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] text-center">
            <div className="w-14 h-14 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/15">
              <CheckCircle2 className="w-8 h-8 font-bold" />
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-on-surface mb-1">
              茶 寮 预 订 支 付 成 功
            </h2>
            <p className="text-[11px] text-outline font-mono uppercase tracking-widest block mb-4">
              Order Cleared & Verified
            </p>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-sm mx-auto mb-6">
              静候茶香。茶寮点心大本营已将您的订单分派给茶艺厨房，现点手工现制烘焙。新鲜顺丰冷链即将开启您的禅味之旅！
            </p>

            {/* Digital Receipt Box */}
            <div className="bg-surface-beige text-left p-4 sm:p-5 rounded-2xl mb-8 space-y-4 border border-[#c4c8b7]/25 text-xs">
              <div className="flex justify-between text-[11px] text-outline pb-2.5 border-b border-[#c4c8b7]/15">
                <span>交易序列号：{txId}</span>
                <span className="text-primary font-bold">支付成功 (已清算)</span>
              </div>

              {/* Delivery items details */}
              <div className="space-y-2">
                <p className="font-bold text-on-surface font-serif">📦 收货配送详情</p>
                <div className="grid grid-cols-3 gap-2 text-on-surface-variant leading-relaxed">
                  <span className="text-outline">收 货 人:</span>
                  <span className="col-span-2 font-semibold text-on-surface">{shippingInfo.name} ({shippingInfo.phone})</span>

                  <span className="text-outline">配送地址:</span>
                  <span className="col-span-2">{shippingInfo.address}</span>

                  <span className="text-outline">递送日期:</span>
                  <span className="col-span-2 font-semibold">{shippingInfo.date} {shippingInfo.timeSlot}</span>
                  
                  {shippingInfo.giftCardMessage && (
                    <>
                      <span className="text-outline">贺卡书法寄语:</span>
                      <span className="col-span-2 italic text-primary">“ {shippingInfo.giftCardMessage} ”</span>
                    </>
                  )}

                  {shippingInfo.ecoPacking && (
                    <>
                      <span className="text-outline">定制纸格贺礼包:</span>
                      <span className="col-span-2 text-primary font-bold">已免费开启定制</span>
                    </>
                  )}
                </div>
              </div>

              {/* Items summarized */}
              <div className="pt-3 border-t border-[#c4c8b7]/15 space-y-1">
                <p className="font-bold text-on-surface font-serif">🍵 预订商品清单</p>
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-on-surface-variant">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span className="font-mono">¥{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#c4c8b7]/15 flex justify-between font-bold text-primary">
                <span>已实清款项</span>
                <span className="font-mono text-sm">¥{finalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={onResetApp}
                className="w-full bg-primary hover:opacity-95 text-white py-3.5 rounded-xl text-xs font-serif font-bold transition-all outline-none"
              >
                返回茶寮首页
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`我在【抹茶禅意】预订了精美宇治甜点礼格：${cartItems.map(i=>i.product.name).join('、')}！配送正在极速进行中。跟朋友们分享静宁一味。`);
                  alert('🔗 订单分享口令已复制至您的剪贴板，您可以粘贴发送给微信等好友共享好礼！');
                }}
                className="w-full bg-surface-beige hover:bg-[#eeeeec] border border-[#c4c8b7]/40 text-on-surface py-3.5 rounded-xl text-xs font-serif font-bold transition-all outline-none flex items-center justify-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                微信好友分享
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

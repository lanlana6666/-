/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Compass, BookOpen, ShoppingCart, User, Landmark, HelpCircle, UtensilsCrossed, AlertCircle, CheckCircle, Info, Leaf, Sparkles } from 'lucide-react';
import { Product, CartItem, ShippingInfo, ViewType } from './types';
import { products } from './data';

// Component imports
import HomeView from './components/HomeView';
import CatalogView from './components/CatalogView';
import DetailView from './components/DetailView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import PaymentView from './components/PaymentView';
import StoryView from './components/StoryView';
import AutumnView from './components/AutumnView';
import ShowroomView from './components/ShowroomView';
import DynamicBackground from './components/DynamicBackground';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  color: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewType>('home');
  const [selectedCategory, setSelectedCategory] = useState<'cakes' | 'drinks' | 'icecream' | 'gifts' | 'all'>('all');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  
  // Dynamic matcha click particles state
  const [clickRipples, setClickRipples] = useState<ClickRipple[]>([]);

  // Setup global mouse click active ripple listener
  useEffect(() => {
    const handleMouseClick = (e: MouseEvent) => {
      const clickEmojis = ['🍵', '🍃', '✨', '🌸', '🍵', '🍦'];
      const clickColors = ['#5C633F', '#8A9A5B', '#C4D300', '#F1F2ED', '#E8EAE0'];
      
      const newRipple: ClickRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        emoji: clickEmojis[Math.floor(Math.random() * clickEmojis.length)],
        size: Math.floor(Math.random() * 12) + 14, // 14px to 26px
        color: clickColors[Math.floor(Math.random() * clickColors.length)]
      };

      setClickRipples(prev => [...prev.slice(-9), newRipple]);
    };

    window.addEventListener('click', handleMouseClick);
    return () => {
      window.removeEventListener('click', handleMouseClick);
    };
  }, []);
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Checkout & Shipping state
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    phone: '',
    address: '',
    date: '',
    timeSlot: '下午 (13:00 - 17:00)',
    giftCardMessage: '',
    ecoPacking: false,
  });
  
  // Discount states
  const [checkoutSummary, setCheckoutSummary] = useState({
    discount: 0,
    couponCode: '',
    ecoPacking: false,
  });

  // Micro-toast notifications
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'info' | 'error' }>({
    show: false,
    msg: '',
    type: 'success',
  });

  // Trigger brief alert toast
  const triggerToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ show: true, msg, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Add Item global handler
  const handleAddToCart = (
    product: Product,
    options: { size?: string; sweetness?: string; temp?: string }
  ) => {
    // Generate unique identification id: productId + size + sweetness + temp
    const sizePart = options.size || '';
    const sweetPart = options.sweetness || '';
    const tempPart = options.temp || '';
    const itemId = `${product.id}-${sizePart}-${sweetPart}-${tempPart}`;

    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.id === itemId);
      
      if (existingIdx > -1) {
        // Increment quantity of already selected specs
        const updated = [...prevCart];
        updated[existingIdx].quantity += 1;
        triggerToast(`🍵 ${product.name} 数量已加1！`, 'success');
        return updated;
      } else {
        // Create new item inside cart
        triggerToast(`🍵 已成功将 ${product.name} 放入购物车！`, 'success');
        return [
          ...prevCart,
          {
            id: itemId,
            product,
            quantity: 1,
            selectedSize: options.size,
            selectedSweetness: options.sweetness,
            selectedTemperature: options.temp,
          },
        ];
      }
    });
  };

  // Adjust cart quantity
  const handleUpdateQty = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, nextQty, quantity: nextQty } : item;
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  // Remove single item
  const handleRemoveItem = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    triggerToast('🗑️ 商品已自清单中移除', 'info');
  };

  // Direct checkout
  const handleCheckoutDirectly = (
    product: Product,
    quantity: number,
    options: { size?: string; sweetness?: string; temp?: string }
  ) => {
    const sizePart = options.size || '';
    const sweetPart = options.sweetness || '';
    const tempPart = options.temp || '';
    const itemId = `${product.id}-${sizePart}-${sweetPart}-${tempPart}`;

    setCart([
      {
        id: itemId,
        product,
        quantity,
        selectedSize: options.size,
        selectedSweetness: options.sweetness,
        selectedTemperature: options.temp,
      },
    ]);
    
    // Clear discount on direct checkout to be clean
    setCheckoutSummary({ discount: 0, couponCode: '', ecoPacking: false });
    setActiveTab('checkout');
  };

  // Proceed checkout setup from CartView
  const handleProceedToCheckout = (discount: number, couponCode: string, ecoPacking: boolean) => {
    setCheckoutSummary({ discount, couponCode, ecoPacking });
    setActiveTab('checkout');
  };

  // Finish delivery info, transition to pay screen
  const handleProceedToPayment = (info: ShippingInfo) => {
    setShippingInfo(info);
    setActiveTab('payment');
  };

  const handleResetApp = () => {
    setCart([]);
    setShippingInfo({
      name: '',
      phone: '',
      address: '',
      date: '',
      timeSlot: '下午 (13:00 - 17:00)',
      giftCardMessage: '',
      ecoPacking: false,
    });
    setCheckoutSummary({ discount: 0, couponCode: '', ecoPacking: false });
    setActiveProduct(null);
    setSelectedCategory('all');
    setActiveTab('home');
    window.scrollTo({ top: 0 });
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans transition-colors duration-300 relative overflow-x-hidden">
      <DynamicBackground />
      {/* Pristine Responsive Top Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-outline-variant/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center h-16">
          <div 
            onClick={() => handleResetApp()}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="text-xl sm:text-2xl font-serif italic text-primary font-bold tracking-widest leading-none transition-transform group-hover:scale-102">
              抹茶禅意
            </span>
            <span className="text-[10px] text-outline font-mono border border-primary/20 px-1.5 py-0.5 rounded leading-none pt-1 hidden xs:inline-block">
              MATCHA ZEN
            </span>
          </div>

          {/* Desktop Links (Hidden on mobile) */}
          <nav className="hidden md:flex gap-10 items-center font-serif text-sm font-bold tracking-wider">
            <button
              onClick={() => {
                setActiveTab('home');
                setActiveProduct(null);
              }}
              className={`transition-colors py-1 ${
                activeTab === 'home' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              茶寮首页
            </button>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setActiveTab('catalog');
                setActiveProduct(null);
              }}
              className={`transition-colors py-1 ${
                activeTab === 'catalog' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              甜点谱
            </button>
            <button
              onClick={() => {
                setActiveTab('autumn');
                setActiveProduct(null);
              }}
              className={`transition-colors py-1 flex items-center gap-1 ${
                activeTab === 'autumn' ? 'text-amber-800 border-b-2 border-amber-800 font-bold' : 'text-on-surface-variant hover:text-amber-800'
              }`}
            >
              <span className="text-amber-600 animate-pulse text-xs">🍁</span>
              秋季限定
            </button>
            <button
              onClick={() => {
                setActiveTab('showroom');
                setActiveProduct(null);
              }}
              className={`transition-colors py-1 flex items-center gap-1 ${
                activeTab === 'showroom' ? 'text-emerald-700 border-b-2 border-emerald-700 font-bold' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="text-emerald-600 animate-pulse text-xs">🌟</span>
              御茶秀场
            </button>
            <button
              onClick={() => {
                setActiveTab('story');
                setActiveProduct(null);
              }}
              className={`transition-colors py-1 ${
                activeTab === 'story' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              品牌故事
            </button>
          </nav>

          {/* Header Action Badges */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Header Mini Cart Badge */}
            <button
              onClick={() => {
                setActiveTab('cart');
                setActiveProduct(null);
              }}
              className="p-2.5 rounded-full hover:bg-surface-container transition-all relative shrink-0 active:scale-90"
              title="查看购物车"
            >
              <ShoppingCart className="w-5 h-5 text-primary" />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white font-mono text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Router wrapper with top gap for fixed header banner */}
      <div className="pt-16 pb-12">
        {activeTab === 'home' && !activeProduct && (
          <HomeView
            onNavigate={(view) => {
              setActiveTab(view);
              setActiveProduct(null);
            }}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setActiveTab('catalog');
            }}
            onSelectProduct={(p) => {
              setActiveProduct(p);
              setActiveTab('detail');
            }}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'catalog' && !activeProduct && (
          <CatalogView
            category={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectProduct={(p) => {
              setActiveProduct(p);
              setActiveTab('detail');
            }}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'detail' && activeProduct && (
          <DetailView
            product={activeProduct}
            onBack={() => {
              // Simply revert back to catalog layout
              setActiveProduct(null);
              setActiveTab('catalog');
            }}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => {
              setActiveProduct(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCheckoutDirectly={handleCheckoutDirectly}
          />
        )}

        {activeTab === 'cart' && (
          <CartView
            cartItems={cart}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={() => setCart([])}
            onCheckout={handleProceedToCheckout}
            onNavigateToCatalog={() => {
              setSelectedCategory('all');
              setActiveTab('catalog');
            }}
          />
        )}

        {activeTab === 'checkout' && (
          <CheckoutView
            cartItems={cart}
            subtotal={cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0)}
            discount={checkoutSummary.discount}
            couponCode={checkoutSummary.couponCode}
            ecoPacking={checkoutSummary.ecoPacking}
            onNavigateToCart={() => setActiveTab('cart')}
            onSubmitCheckout={handleProceedToPayment}
          />
        )}

        {activeTab === 'payment' && (
          <PaymentView
            cartItems={cart}
            shippingInfo={shippingInfo}
            subtotal={cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0)}
            discount={checkoutSummary.discount}
            onPaymentSuccess={() => triggerToast('💳 订单支付清算成功！并已发送顺丰备货讯息', 'success')}
            onResetApp={handleResetApp}
          />
        )}

        {activeTab === 'autumn' && !activeProduct && (
          <AutumnView
            onSelectProduct={(p) => {
              setActiveProduct(p);
              setActiveTab('detail');
            }}
            onAddToCart={handleAddToCart}
            onNavigateToCatalog={() => {
              setSelectedCategory('all');
              setActiveTab('catalog');
            }}
            triggerToast={triggerToast}
          />
        )}

        {activeTab === 'showroom' && !activeProduct && (
          <ShowroomView
            onAddToCart={handleAddToCart}
            products={products}
            triggerToast={triggerToast}
          />
        )}

        {activeTab === 'story' && !activeProduct && <StoryView />}
      </div>

      {/* Persistent Bottom Mobile Navigation Tab Bar (Hidden on Desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-outline-variant/30 shadow-lg flex items-center justify-around py-2 h-14 pr-2">
        <button
          onClick={() => {
            setActiveTab('home');
            setActiveProduct(null);
          }}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold font-serif tracking-wider shrink-0 transition-colors w-14 ${
            activeTab === 'home' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>首页</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategory('all');
            setActiveTab('catalog');
            setActiveProduct(null);
          }}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold font-serif tracking-wider shrink-0 transition-colors w-14 ${
            activeTab === 'catalog' || activeTab === 'detail' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>发现甜点</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('autumn');
            setActiveProduct(null);
          }}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold font-serif tracking-wider shrink-0 transition-colors w-14 ${
            activeTab === 'autumn' ? 'text-amber-800' : 'text-on-surface-variant'
          }`}
        >
          <Leaf className={`w-5 h-5 ${activeTab === 'autumn' ? 'text-amber-700 fill-amber-700/20' : ''}`} />
          <span>秋季限定</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('showroom');
            setActiveProduct(null);
          }}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold font-serif tracking-wider shrink-0 transition-colors w-14 ${
            activeTab === 'showroom' ? 'text-emerald-700' : 'text-on-surface-variant'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${activeTab === 'showroom' ? 'text-emerald-700 fill-emerald-600/10' : ''}`} />
          <span>御茶秀场</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('story');
            setActiveProduct(null);
          }}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold font-serif tracking-wider shrink-0 transition-colors w-14 ${
            activeTab === 'story' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>茶寮故事</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('cart');
            setActiveProduct(null);
          }}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold font-serif tracking-wider shrink-0 transition-colors relative w-14 ${
            activeTab === 'cart' || activeTab === 'checkout' || activeTab === 'payment' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {totalCartCount > 0 && (
            <span className="absolute top-0 right-2 bg-red-600 border border-white text-white font-mono text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {totalCartCount}
            </span>
          )}
          <span>清单列表</span>
        </button>
      </nav>

      {/* Footer (Universal Bottom Board) */}
      <footer className="w-full bg-[#f4f4f2] text-[#44483c] py-14 px-4 text-center border-t border-outline-variant/30 mt-16 max-md:pb-24">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-5">
          <p className="font-serif text-lg font-bold text-primary tracking-widest leading-none">
            抹茶禅意 • MATCHA ZEN
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3.5 text-xs text-on-surface-variant/80">
            <a href="#" className="hover:text-primary transition-colors">茶寮生态可持续行动</a>
            <span>|</span>
            <a href="#" className="hover:text-primary transition-colors">全国顺丰冷链必送公章</a>
            <span>|</span>
            <a href="#" className="hover:text-primary transition-colors">手工现点定制声明</a>
            <span>|</span>
            <a href="#" className="hover:text-primary transition-colors">隐私保护及退换政策</a>
          </div>
          <p className="text-[10px] text-outline font-mono mt-2 tracking-wide uppercase">
            © 2026 MATCHA ZEN TEA LAB. HANDCRAFTED WITH SOUL AND MINFULNESS.
          </p>
        </div>
      </footer>

      {/* Global Success / Info Toast Alert bar */}
      {toast.show && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] bg-on-surface text-white py-3 px-6 rounded-full text-xs font-serif font-bold shadow-lg flex items-center gap-2.5 animate-bounce">
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-primary-light" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-300" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-300" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Global Click Matcha Sparkles & Ripple Particles System */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        <AnimatePresence>
          {clickRipples.map(ripple => (
            <div key={ripple.id}>
              {/* Centered expansion ring */}
              <motion.div
                initial={{ x: ripple.x, y: ripple.y, scale: 0.2, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  left: -20,
                  top: -20,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: `2px solid ${ripple.color}`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
              {/* Cute floating tea element (Matcha, Leaf, Ice Cream, Sakura) */}
              <motion.div
                initial={{ 
                  x: ripple.x, 
                  y: ripple.y, 
                  scale: 0.4, 
                  opacity: 1, 
                  rotate: 0 
                }}
                animate={{ 
                  x: ripple.x + (Math.random() * 100 - 50), 
                  y: ripple.y - (Math.random() * 100 + 40), 
                  scale: 1.2, 
                  opacity: 0, 
                  rotate: Math.random() * 360 - 180 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  left: 0,
                  top: 0,
                  fontSize: `${ripple.size}px`,
                  userSelect: 'none',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {ripple.emoji}
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

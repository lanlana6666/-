/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Compass, BookOpen, ShoppingCart, User, Landmark, HelpCircle, UtensilsCrossed, AlertCircle, CheckCircle, Info, Leaf, Sparkles, Rotate3d, Volume2, VolumeX } from 'lucide-react';
import { Product, CartItem, ShippingInfo, ViewType } from './types';
import { products } from './data';

// Component imports
import { playClickSound, playChimeSound } from './utils/audio';
import LoadingScreen from './components/LoadingScreen';
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
import InteractiveCake3D from './components/InteractiveCake3D';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  color: string;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ViewType>('home');
  const [selectedCategory, setSelectedCategory] = useState<'cakes' | 'drinks' | 'icecream' | 'gifts' | 'all'>('all');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  
  // Dynamic audio controls
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('peaceput-muted') === 'true';
    }
    return false;
  });

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    localStorage.setItem('peaceput-muted', String(nextMuted));
    if (!nextMuted) {
      setTimeout(() => playClickSound(), 50);
    }
  };
  
  // Dynamic matcha click particles state
  const [clickRipples, setClickRipples] = useState<ClickRipple[]>([]);

  // Setup global mouse click active ripple listener and premium physical sound feedback
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

      // Sound effect play condition: target is interactable and sound is not muted
      const target = e.target as HTMLElement;
      if (target) {
        const isClickable =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('.cursor-pointer') ||
          target.classList.contains('cursor-pointer') ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA';

        if (isClickable && !isMuted) {
          playClickSound();
        }
      }
    };

    window.addEventListener('click', handleMouseClick);
    return () => {
      window.removeEventListener('click', handleMouseClick);
    };
  }, [isMuted]);

  // Trigger gentle organic wooden-chimes on route/tab switches
  useEffect(() => {
    if (!isLoading && !isMuted) {
      playChimeSound();
    }
  }, [activeTab, isLoading, isMuted]);
  
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
      <AnimatePresence>
        {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}
      </AnimatePresence>
      <DynamicBackground />
      {/* Pristine Responsive Top Header Navigation (peaceput.com template) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#2C3E20]/15 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
          <div 
            onClick={() => handleResetApp()}
            className="flex flex-col items-start cursor-pointer group"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-serif text-[#2C3E20] font-normal tracking-[0.2em] transition-transform group-hover:scale-[1.01]">
                抹茶禅意
              </span>
              <span className="text-[11px] text-[#8A9A5B] tracking-widest pl-1 font-semibold">
                手作茶寮
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-[#2C3E20]/60 tracking-wider mt-0.5 leading-none font-medium">
              手作茶物 • 在一盏茶里，安顿疲惫心灵
            </span>
          </div>

          {/* Desktop Links (Separated by fine dividers in a modular layout like peaceput.com) */}
          <nav className="hidden lg:flex items-center h-full text-[11px] font-sans font-bold tracking-[0.25em] text-[#2C3E20]/80 uppercase">
            <button
              onClick={() => {
                setActiveTab('home');
                setActiveProduct(null);
              }}
              className={`h-full px-6 border-l border-[#2C3E20]/10 hover:text-[#5C633F] hover:bg-[#2C3E20]/2 transition-all ${
                activeTab === 'home' ? 'text-[#5C633F] bg-[#2C3E20]/3 border-b-2 border-[#5C633F]' : ''
              }`}
            >
              首页
            </button>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setActiveTab('catalog');
                setActiveProduct(null);
              }}
              className={`h-full px-6 border-l border-[#2C3E20]/10 hover:text-[#5C633F] hover:bg-[#2C3E20]/2 transition-all ${
                activeTab === 'catalog' ? 'text-[#5C633F] bg-[#2C3E20]/3 border-b-2 border-[#5C633F]' : ''
              }`}
            >
              点心谱
            </button>
            <button
              onClick={() => {
                setActiveTab('autumn');
                setActiveProduct(null);
              }}
              className={`h-full px-6 border-l border-[#2C3E20]/10 hover:text-amber-800 hover:bg-amber-800/3 transition-all ${
                activeTab === 'autumn' ? 'text-amber-800 bg-amber-800/5 border-b-2 border-amber-800 font-extrabold' : ''
              }`}
            >
              🍁 秋季限定
            </button>
            <button
              onClick={() => {
                setActiveTab('showroom');
                setActiveProduct(null);
              }}
              className={`h-full px-6 border-l border-[#2C3E20]/10 hover:text-emerald-800 hover:bg-emerald-800/3 transition-all ${
                activeTab === 'showroom' ? 'text-emerald-800 bg-emerald-800/5 border-b-2 border-emerald-800' : ''
              }`}
            >
              🌟 御茶秀场
            </button>
            <button
              onClick={() => {
                setActiveTab('cakelab');
                setActiveProduct(null);
              }}
              className={`h-full px-6 border-l border-[#2C3E20]/10 hover:text-emerald-800 hover:bg-[#2C3E20]/2 transition-all flex items-center gap-1.5 ${
                activeTab === 'cakelab' ? 'text-emerald-800 bg-emerald-800/5 border-b-2 border-emerald-800' : ''
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5 text-emerald-700 animate-spin-slow" />
              3D 定制
            </button>
            <button
              onClick={() => {
                setActiveTab('story');
                setActiveProduct(null);
              }}
              className={`h-full px-6 border-l border-r border-[#2C3E20]/10 hover:text-[#5C633F] hover:bg-[#2C3E20]/2 transition-all ${
                activeTab === 'story' ? 'text-[#5C633F] bg-[#2C3E20]/3 border-b-2 border-[#5C633F]' : ''
              }`}
            >
              故事
            </button>
          </nav>

          {/* Header Action Badges */}
          <div className="flex items-center gap-4">
            {/* Audio Premium Toggle Button */}
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full hover:bg-[#2C3E20]/5 transition-all relative shrink-0 active:scale-95 border border-[#2C3E20]/10 bg-white/50 cursor-pointer text-[#2C3E20] ${
                isMuted ? 'opacity-60' : 'opacity-100'
              }`}
              title={isMuted ? "开启音效" : "静音音效"}
              aria-label="切换金声音效"
            >
              {isMuted ? (
                <VolumeX className="w-4.5 h-4.5 text-[#2C3E20]/60" />
              ) : (
                <Volume2 className="w-4.5 h-4.5 text-[#5C633F] animate-pulse" style={{ animationDuration: '4s' }} />
              )}
            </button>

            {/* Header Mini Cart Badge */}
            <button
              onClick={() => {
                setActiveTab('cart');
                setActiveProduct(null);
              }}
              className="p-3 rounded-full hover:bg-[#2C3E20]/5 transition-all relative shrink-0 active:scale-95 border border-[#2C3E20]/10 bg-white/50"
              title="查看购物车"
            >
              <ShoppingCart className="w-4.5 h-4.5 text-[#2C3E20]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white font-mono text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Router wrapper with top gap for fixed header banner and luxury typography progressive reveal */}
      <div 
        className="pt-20 pb-12 page-fade-in" 
        key={`${activeTab}-${activeProduct?.id || 'none'}`}
      >
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

        {activeTab === 'cakelab' && !activeProduct && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 md:px-8 mt-6"
          >
            <div className="mb-10 text-center relative z-10">
              <span className="text-secondary text-xs sm:text-sm font-mono tracking-[0.4em] uppercase block mb-2 font-bold">
                MATCHA CREATIVE LAB • MASTERPIECE CUSTOMIZER
              </span>
              <h1 className="font-serif italic text-4xl sm:text-5xl text-primary font-bold tracking-normal drop-shadow-sm mb-4">
                3D 抹茶高定工坊
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
                在这里，您不仅在品尝抹茶，更是在亲手塑造一件绿意的艺术品。
                利用先进 3D 模拟体感，自主堆叠千层层数、微调霜层颜色与精制配料，高定专属味道。
              </p>
              <div className="w-16 h-0.5 bg-primary/20 mx-auto mt-6 rounded-full" />
            </div>
            
            <InteractiveCake3D onAddToCart={handleAddToCart} />
          </motion.div>
        )}
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
            setActiveTab('cakelab');
            setActiveProduct(null);
          }}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold font-serif tracking-wider shrink-0 transition-colors w-14 ${
            activeTab === 'cakelab' ? 'text-emerald-700' : 'text-on-surface-variant'
          }`}
        >
          <Rotate3d className={`w-5 h-5 ${activeTab === 'cakelab' ? 'text-emerald-700' : ''}`} />
          <span>3D高定</span>
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

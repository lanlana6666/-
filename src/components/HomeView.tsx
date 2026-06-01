import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, ShoppingBag, ArrowDown, Leaf, Calendar, ExternalLink, Heart, Globe, Users, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { products } from '../data';

interface HomeViewProps {
  onNavigate: (view: any) => void;
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
  const [selectedBrandIndex, setSelectedBrandIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const brandsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    setScrollY(window.scrollY);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Recommended products
  const featuredProducts = products.filter(p => 
    ['mille-crepe', 'sea-salt-foam', 'zen-macarons', 'basque-cheese'].includes(p.id)
  );

  const prevSlide = () => {
    setActiveSlide(prev => (prev === 0 ? featuredProducts.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide(prev => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
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

  const scrollDownToBrands = () => {
    brandsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sub-brands matching peaceput's rustic layout
  const subBrands = [
    {
      id: 'amam-dacotan',
      title: 'AMAM DACOTAN',
      subtitle: '手作古典烘焙坊 • CRAFT ANCIENT BAKERY',
      desc: '源自福冈的古老面团童话。推开厚重的欧式栎木门，在干花与烛光环绕的怀旧空间里，静置24小时慢速天然发酵，炭烤出外脆里软的抹茶风味巧巴达与法式千层。',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy6vIHRQISVc928bPRzbbmAjMX4iTt3LSSA5787R3sQ2WxYYHlSUkkA33I1HfIly3DVAlgs4ifRmuFjusRS3OnTDqkf3uuGGLre_XCrU6I70TxOPEKDI0gKmLX3CKw_-C8QwPTm9ksLqNeX2r6pJlrRQ_ASIcIdnwxL8cV1mL2kHO4Yi2PbXMIYDvHVnm69PSzUr9ZvLqOdq596U27z45bR-m01rr1oa9SnnyB1hK3ydCB9Kz-KAdgebOg6-OauyGZQdmsoZsO5mKl',
      category: 'cakes',
      themeColor: 'bg-[#5C633F]/5 border-[#5C633F]/20 text-[#5C633F]',
      badge: '经典千层 & 烘焙专科',
      signature: '手工宇治抹茶千层蛋糕'
    },
    {
      id: 'dacomecca',
      title: 'DACOMECCA',
      subtitle: '原木茶歌茶院 • COAL FIRE TEA CHAMBER',
      desc: '以原木篝火为魂的沉浸式现代茶座。在这里，松软的抹茶红豆吐司在明火炭炉上微微炙烤，温盏、白花、石磨慢碾，将最古老的日本宇治茶道，与极简生活美学完美咬合。',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNS_QGYv-ZquhytM1GdiubVOjZYSPsiy1IdnpG55VHS36LL_aZV7uKupBVLcet7VxJJbxgSSs0S2ZlcZ8X3wXouy7WjIQ7XRJ_-wRT0_7zY0bMnYT9Mncn3LKBfwrRPEsOQqLy_uLK-N01jjiT5_d0kIOrnsKL7u97wBxiJX1uDRAPiqdUFhpPDL0WLQQCfGTc3bCvJGPV_79DBYwUXv004uDuKyHf97VeLDRBaw5rwIVOyVP8yii9NsnVMhL2VGb3kDUlZKHpP1yP',
      category: 'drinks',
      themeColor: 'bg-[#C4D300]/5 border-[#C4D300]/20 text-emerald-800',
      badge: '海盐茶饮 & 现打茶室',
      signature: '海盐芝士奶盖抹茶拿铁'
    },
    {
      id: 'daco',
      title: 'dacō',
      subtitle: '都市一口菓子舍 • MINI ONE-BITE PATISSERIE',
      desc: '专为都市步履打造的小比例精致果点。主打“一人食、多风味”，分量减半、匠心加倍。招牌抹茶松露马卡龙与白玉大福，外壳酥脆轻巧，满足所有对绿意的温柔幻想。',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBpKzehlxlWX_U1qpIRCR642NGM0Uby183QbvUZ22IBvJ4Clf5bC-vm6GW_Rteeg_gIzQCFutNXOxSfADTwI3f3NiQNqQ_lX65QVjlofqCvIXSwrbmiutzorRAZ8OrTUqYTFhecImzMC8SGwFAreaCcEsimDn347dHhPvMGFRxsv0dN669rEar1jdfo7XvW6t_EVmMl6WPdZya5RMyaMQdKfd1AHfZvNWF7ZqZEHqoq_vPgr-VJmKRfSNFY6gLsIVmYDMb8HmyZyvr',
      category: 'gifts',
      themeColor: 'bg-emerald-600/5 border-emerald-600/20 text-emerald-950',
      badge: '一口甜度 & 伴手茶礼',
      signature: '禅意手工抹茶马卡龙'
    },
    {
      id: 'im-donut',
      title: 'I’m donut?',
      subtitle: '冷发酵生甜甜圈 • THE MELTING RAW DONUT',
      desc: '风靡东京的超人气空气感“生”甜甜圈。选用秘制超软发酵面团，经长达18小时低温熟成，炸制后犹如云朵般轻盈消融。饱满注入手打浓厚宇治抹茶生奶油，甜而不腻。',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdvy-pEuTPDxnoJGocJlF6D7uka8Tx-iOyj8ncWmLy7Fz7Sm3e1xkeWT_C6bSwLDPuLxsi6u809ZzFZ0S5IhKBazuYaauKCCyiwkeIZL-9ixbCEVFOTzHNGLIg0SiJbGYKK7boQB347VUwZGvIePiXSCTX04Ys6ZgVsA01gWAmSngfUf-Yb_AddPneDxwsHR2mGNX7js-aezWoTI99blPI70vtUn2hFj5E__RUemIDmgVngPw-pcmkxE4yM2QdOnfy-6mPRZz0uCMm',
      category: 'icecream',
      themeColor: 'bg-amber-600/5 border-amber-600/20 text-amber-900',
      badge: '低温发酵 & 生乳流心',
      signature: '生抹茶烘焙甜圈口面'
    },
    {
      id: 'neo-nice-burger',
      title: 'Neo Nice Burger',
      subtitle: '元气抹茶汉堡店 • MATCHA WHOLE-WHEAT BURGER',
      desc: '将抹茶融入经典西式烘焙的先锋之作。使用石磨宇治绿茶粉揉入全麦面粉，烤制出微带茶香的抹茶小汉堡胚，搭配本地时令甜品或高定沙拉，让轻食与禅意悄然相遇。',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAheTwt3habdn9E32hj0n3-ENYUYxXoULKj64_6rIJRU5GA6LJmhtE-Dwow1aYRqvHpguCYK9D7ZACNFnubgKYZxsbz-Ju8qwNnvIxUcGrGSMDbarUiW-0C2OViHKbqWNFwdye_RavPzYhr419djpXO-8luRg5canr4VMgf9vNhQlgynKDE4pWblIBZBCeOH7QpkqRuXp4p61Jiu7FBSsEpJGGs3u0_DOE09fWl8bpsOYevLexUxyH2hOVQHyvkZ2zOQQ1YSMzdifvh',
      category: 'all',
      themeColor: 'bg-neutral-800/5 border-neutral-800/10 text-neutral-900',
      badge: '健康全麦 & 3D高定胚',
      signature: '秋令高定创意全麦大福'
    }
  ];

  const currentBrand = subBrands[selectedBrandIndex];

  // Editorial official notices from peaceput.com (Japanese minimal news table style)
  const officialNotices = [
    {
      date: '2026.06.01',
      brand: 'AMAM DACOTAN',
      title: '线上预约通告：cafe&bake 旗下三款御用主盘饰甜品需提前线上预约',
      linkText: '前往预约',
      isHot: true
    },
    {
      date: '2026.05.24',
      brand: 'I\'m donut?',
      title: '秋日新品：无麸质低温生乳甜甜圈于涩谷及心斋桥专门店同步上架',
      linkText: '查看单品',
      isHot: false
    },
    {
      date: '2026.05.18',
      brand: 'DACOMECCA',
      title: '碾茶祭典：100% 宇治首采春茶碾片已顺利运抵原木炭焙室',
      linkText: '详细资讯',
      isHot: false
    },
    {
      date: '2026.05.11',
      brand: 'dacō',
      title: '宇治川野餐季限定联名：环保石磨抹茶随行手办礼盒正式开售',
      linkText: '了解详情',
      isHot: false
    }
  ];

  return (
    <div className="w-full bg-[#FAF7F0] text-[#1E201F] selection:bg-[#2C3E20] selection:text-white pb-16">
      
      {/* 1. HERO SLIDER BANNER (Refined double-parallax scrolling experience) */}
      <section id="peaceput-parallax-hero-section" className="relative px-4 sm:px-8 pt-6 pb-12 border-b border-[#2C3E20]/10 bg-[#FAF7F0] overflow-hidden">
        <div id="peaceput-parallax-hero-container" className="max-w-7xl mx-auto rounded-[32px] overflow-hidden border border-[#2C3E20]/15 relative h-[78vh] min-h-[500px] bg-[#1E201F]">
          
          {/* Animated Hero Background Image (Layer 1 - Coordinates: speed 0.5x, using extra vertical buffers to maintain fluid image edges) */}
          <div 
            id="parallax-bg-layer"
            className="absolute -top-[160px] -bottom-[160px] left-0 right-0 z-0 pointer-events-none"
            style={{
              transform: `translate3d(0, ${scrollY * 0.5}px, 0)`,
              willChange: 'transform'
            }}
          >
            <img
              className="w-full h-full object-cover filter brightness-[0.80] contrast-[1.03] scale-102"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAheTwt3habdn9E32hj0n3-ENYUYxXoULKj64_6rIJRU5GA6LJmhtE-Dwow1aYRqvHpguCYK9D7ZACNFnubgKYZxsbz-Ju8qwNnvIxUcGrGSMDbarUiW-0C2OViHKbqWNFwdye_RavPzYhr419djpXO-8luRg5canr4VMgf9vNhQlgynKDE4pWblIBZBCeOH7QpkqRuXp4p61Jiu7FBSsEpJGGs3u0_DOE09fWl8bpsOYevLexUxyH2hOVQHyvkZ2zOQQ1YSMzdifvh"
              alt="Artisanal Bakery Studio"
            />
            {/* Elegant vignette shade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/30"></div>
          </div>

          {/* Slogan and Text Foreground (Layer 2 - Coordinates: Speed 1.2x. TranslateY = -scrollY * 0.2 relative position) */}
          <div 
            id="parallax-fg-layer"
            className="absolute inset-0 z-10 flex flex-col justify-between p-8 sm:p-12 md:p-16 text-white text-left"
            style={{
              transform: `translate3d(0, ${-scrollY * 0.2}px, 0)`,
              willChange: 'transform'
            }}
          >
            <div className="flex justify-between items-start w-full">
              <span className="text-[10px] md:text-xs tracking-[0.4em] text-white/90 bg-white/10 backdrop-blur-xs border border-white/25 px-4.5 py-1.5 rounded-full font-semibold">
                独创与自由
              </span>
              <div className="text-right text-[11px] tracking-widest text-white/85 max-sm:hidden font-medium">
                创立于二零二六 // 源自宇治
              </div>
            </div>

            <div className="max-w-3xl">
              <span className="font-serif text-sm md:text-base text-amber-200 block mb-3.5 tracking-wider font-semibold">
                手作茶物 • 在一盏茶里，安顿疲惫心灵
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.12] mb-6 tracking-wide drop-shadow-md">
                将片刻优雅绿意，<br className="max-sm:hidden" />
                寄入繁华城市的呼吸。
              </h1>
              <p className="font-sans text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed font-normal tracking-wide pl-1 border-l-2 border-[#8A9A5B]/70 py-1 bg-black/10 backdrop-blur-xs rounded-r-md px-2">
                每一颗慢发酵多孔生面团、每一碗研磨3周的海盐芝士抹茶，都是安抚浮躁城市的一记和弦。在这里，我们用指尖的温暖与自由，传递全知觉的心灵抚慰。
              </p>
            </div>

            <div className="flex flex-wrap gap-4 items-center pl-1">
              <button
                onClick={() => {
                  onSelectCategory('all');
                  onNavigate('catalog');
                }}
                className="py-4 px-9 bg-white text-[#1E201F] font-serif font-bold text-xs tracking-[0.25em] uppercase hover:bg-[#FAF7F0] transition-colors duration-200 flex items-center gap-2 rounded-lg cursor-pointer"
              >
                点心谱 PREVIEW
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('cakelab')}
                className="py-4 px-8 border border-white/50 text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition-colors duration-200 rounded-lg max-xs:w-full cursor-pointer bg-white/5"
              >
                3D 高定 CO-CREATION
              </button>
            </div>
          </div>

          {/* Foreground Decorative Leaves (Layer 3 - Floating Zen objects scrolling even faster at 1.4x for added 3D relief layer interaction) */}
          <div 
            id="parallax-leaves-layer" 
            className="absolute inset-x-0 top-0 bottom-0 z-15 pointer-events-none select-none hidden md:block"
            style={{
              transform: `translate3d(0, ${-scrollY * 0.4}px, 0)`,
              willChange: 'transform'
            }}
          >
            {/* Top Right Floating Leaf */}
            <div className="absolute right-[12%] top-[18%] w-12 h-12 text-[#8A9A5B]/50 opacity-70 blur-[0.5px]">
              <Leaf className="w-full h-full transform rotate-[42deg] animate-pulse" />
            </div>

            {/* Bottom Left Floating Leaf */}
            <div className="absolute left-[6%] bottom-[30%] w-16 h-16 text-[#5C633F]/45 opacity-60 blur-[1px]">
              <Leaf className="w-full h-full transform rotate-[-25deg]" />
            </div>

            {/* Minor golden floating grain petal */}
            <div className="absolute right-[30%] bottom-[12%] w-10 h-10 text-amber-200/35 opacity-50 blur-[0.8px]">
              <Leaf className="w-full h-full transform rotate-[15deg] scale-x-[-1]" />
            </div>
          </div>

          {/* Centered Dynamic Bottom Scroll Arrow styled after peaceput */}
          <div 
            onClick={scrollDownToBrands}
            className="absolute bottom-6 right-8 z-20 flex items-center gap-2.5 cursor-pointer text-white/90 hover:text-white transition-all uppercase font-mono text-[9px] tracking-[0.3em] font-semibold bg-black/25 backdrop-blur-xs py-2 px-4 rounded-full border border-white/10"
          >
            <span>探索品牌 • VIEW LAB</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. THE MULTI-COLUMN BRAND BLOCK BOARD (Direct reflection of peaceput.com/en/ brand split grid) */}
      <section ref={brandsSectionRef} className="py-20 px-4 sm:px-8 border-b border-[#2C3E20]/10 bg-[#FAF7F0] scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Header titles centered and detailed */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#8A9A5B] text-[10px] sm:text-xs font-mono tracking-[0.45em] uppercase block mb-3 font-semibold">
              brand portfolio • 旗下专门甜点线
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1E201F] font-normal tracking-wide">
              自由创意与感官烘焙
            </h2>
            <p className="text-xs text-[#1E201F]/60 font-sans tracking-wide leading-relaxed mt-4 max-w-md mx-auto">
              我们将抹茶衍生出五个各具美学品格的子甜品空间，提供古典烘焙、原木篝火茶饮、迷你菓子及空气生甜甜圈。
            </p>
            <div className="w-16 h-[1.5px] bg-[#2C3E20]/20 mx-auto mt-6" />
          </div>

          {/* Brand Interactive Category Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5 mb-12">
            {subBrands.map((brand, idx) => (
              <button
                key={brand.id}
                onClick={() => setSelectedBrandIndex(idx)}
                className={`py-3.5 px-6 font-serif text-xs tracking-[0.2em] border transition-all duration-300 rounded-full cursor-pointer ${
                  selectedBrandIndex === idx 
                    ? 'bg-[#2C3E20] text-white border-[#2C3E20] shadow-sm' 
                    : 'bg-white text-[#2C3E20] hover:bg-[#FAF7F0] border-[#2C3E20]/15'
                }`}
              >
                {brand.title}
              </button>
            ))}
          </div>

          {/* Symmetrical Split Brand Detail Frame (peaceput template style) */}
          <div className="grid lg:grid-cols-12 border border-[#2C3E20]/15 rounded-3xl overflow-hidden bg-white shadow-xs">
            {/* Left side: Visual representation with organic label overlay */}
            <div className="lg:col-span-7 h-[340px] sm:h-[460px] relative overflow-hidden group border-b lg:border-b-0 lg:border-r border-[#2C3E20]/15">
              <img 
                src={currentBrand.image} 
                alt={currentBrand.title}
                className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-103"
              />
              <div className="absolute top-4 left-4 bg-[#FAF7F0]/95 backdrop-blur-xs text-[#2C3E20] font-mono text-[9px] tracking-widest uppercase py-1.5 px-4 rounded-md border border-[#2C3E20]/15 font-bold shadow-xs">
                {currentBrand.badge}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E201F]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-white text-xs font-serif tracking-[0.15em] font-medium opacity-90">
                / Signature: <span className="underline underline-offset-4 decoration-amber-300 font-bold">{currentBrand.signature}</span>
              </div>
            </div>

            {/* Right side: Detailed, luxury typography copy deck */}
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-[#FCFAF5]">
              <div>
                <span className="text-[#8A9A5B] font-mono text-[10px] tracking-[0.3em] uppercase block mb-2 font-bold">
                  {currentBrand.subtitle}
                </span>
                <h3 className="font-serif text-3xl text-[#1E201F] font-normal leading-tight tracking-wider mb-6">
                  {currentBrand.title}
                </h3>
                <div className="w-10 h-[1.5px] bg-[#2C3E20]/20 mb-6" />
                <p className="text-xs sm:text-[13px] text-[#1E201F]/75 leading-relaxed tracking-wide font-normal font-sans mb-8">
                  {currentBrand.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-[#2C3E20]/10 flex max-xs:flex-col gap-3 justify-between items-start xs:items-center">
                <div>
                  <div className="text-[9px] font-mono tracking-widest text-[#1E201F]/50 uppercase mb-1">RECOMMENDED CATEGORIES</div>
                  <span className="inline-block bg-[#2C3E20]/5 text-[#2C3E20] font-serif text-[11px] px-3.5 py-1.5 rounded-md font-bold uppercase tracking-widest">
                    {currentBrand.category === 'all' ? '全 部 抹茶大荟' : currentBrand.category === 'cakes' ? '手 工 烘 焙' : currentBrand.category === 'drinks' ? '特 调 茶 座' : currentBrand.category === 'gifts' ? '典 雅 茶 礼' : '特 制 冰 敷'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onSelectCategory(currentBrand.category as any);
                    onNavigate('catalog');
                  }}
                  className="py-3 px-6 bg-[#2C3E20] text-white font-serif text-xs font-bold tracking-[0.2em] rounded-md hover:bg-black transition-colors flex items-center gap-1.5 self-end shrink-0"
                >
                  探索菜单 ENTER
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXQUISITE PRODUCT COMPILATION SLIDER (peaceput.com template gallery) */}
      <section className="py-20 px-4 sm:px-8 border-b border-[#2C3E20]/10 bg-[#FAF7F0]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[#8A9A5B] text-[10px] font-mono tracking-[0.3em] block mb-2 font-bold uppercase">
                artisan selection • 主厨手作臻选
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1E201F] font-normal tracking-wide">
                本季推荐之作
              </h2>
            </div>
            <div className="flex gap-2 text-[#2C3E20]">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border border-[#2C3E20]/15 hover:bg-[#2C3E20] hover:text-white flex items-center justify-center transition-all duration-300"
                title="上一个"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border border-[#2C3E20]/15 hover:bg-[#2C3E20] hover:text-white flex items-center justify-center transition-all duration-300"
                title="下一个"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Gallery List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod, i) => (
              <div
                key={prod.id}
                className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-500 flex flex-col cursor-pointer group ${
                  activeSlide === i ? 'border-[#2C3E20]/60 ring-2 ring-[#2C3E20]/5' : 'border-[#2C3E20]/10'
                }`}
                onClick={() => onSelectProduct(prod)}
              >
                <div className="relative h-60 overflow-hidden bg-[#FCFAF5] border-b border-[#2C3E20]/5">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                    src={prod.image}
                    alt={prod.name}
                  />
                  {prod.originalPrice && (
                    <span className="absolute top-3 left-3 bg-amber-700 text-white font-serif text-[9px] px-2.5 py-1.5 tracking-wider rounded font-bold">
                      SEASONAL SPECIAL
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-white/95 text-[10px] font-mono py-1 px-2.5 rounded text-[#2C3E20] font-semibold border border-[#2C3E20]/10">
                    ★ {prod.rating}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex gap-1.5 mb-2.5 flex-wrap">
                    {prod.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="bg-[#FAF7F0] text-[#2C3E20] text-[9px] font-mono tracking-wider border border-[#2C3E20]/10 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-serif text-[15px] sm:text-base text-[#1E201F] font-bold mb-1.5 group-hover:text-[#5C633F] transition-colors leading-snug">
                    {prod.name}
                  </h3>
                  <p className="text-[9px] text-[#1E201F]/50 font-mono tracking-widest uppercase mb-4 leading-none">
                    {prod.enName}
                  </p>

                  <div className="flex justify-between items-center mt-auto pt-3 border-t border-[#2C3E20]/10">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-sm sm:text-base font-bold text-[#2C3E20]">
                        ¥{prod.price}
                      </span>
                      {prod.originalPrice && (
                        <span className="font-mono text-[11px] text-[#1E201F]/40 line-through">
                          ¥{prod.originalPrice}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(prod, {});
                      }}
                      className="p-2 w-8 h-8 rounded-md bg-[#2C3E20]/5 text-[#2C3E20] hover:bg-[#2C3E20] hover:text-white transition-all flex items-center justify-center spring-click"
                      title="加入购物清单"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OFFICIAL EDITORIAL NEWS (Elegant Japanese/Tokyo minimalist list design) */}
      <section className="py-20 px-4 sm:px-8 bg-[#FCFAF5]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#8A9A5B] text-[10px] font-mono tracking-[0.45em] block mb-2 font-bold uppercase">
              RECRUIT & ANNOUNCEMENTS • 讯息简报
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1E201F] font-normal tracking-wide">
              官方直营店通告
            </h2>
          </div>

          <div className="border-t border-[#2C3E20]/20">
            {officialNotices.map((notice, idx) => (
              <div 
                key={idx} 
                className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-[#2C3E20]/10 gap-4 group hover:bg-[#2C3E20]/2 transition-colors px-4 rounded-lg"
              >
                <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-grow">
                  <span className="font-mono text-xs text-[#2C3E20]/60 min-w-[80px]">
                    {notice.date}
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="inline-flex bg-[#2C3E20]/10 text-[#2C3E20] text-[9px] font-mono font-bold uppercase tracking-wider py-0.5 px-2 rounded">
                      {notice.brand}
                    </span>
                    <span className="font-serif text-[13px] sm:text-sm text-[#1E201F] group-hover:text-[#5C633F] transition-colors font-medium">
                      {notice.title}
                    </span>
                    {notice.isHot && (
                      <span className="bg-amber-700 text-white text-[8px] font-sans font-bold uppercase tracking-widest py-0.5 px-1.5 rounded animate-pulse shrink-0">
                        ATTENTION
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-[#2C3E20] font-sans text-xs tracking-wider font-semibold self-start sm:self-center">
                  <span className="group-hover:underline underline-offset-4">{notice.linkText}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a 
              href="#" 
              className="inline-flex items-center gap-2 border border-[#2C3E20]/30 hover:border-[#2C3E20] px-8 py-3.5 rounded-lg text-xs tracking-widest font-serif text-[#2C3E20] uppercase font-bold text-center"
            >
              <span>查看更多官方讯息 READ MORE NEWS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 5. PRESTIGE REGISTRATION NEWSLETTER (Custom clean design) */}
      <section className="py-20 px-4 sm:px-8 border-t border-[#2C3E20]/10 bg-[#FAF7F0]">
        <div className="max-w-4xl mx-auto rounded-3xl border border-[#2C3E20]/15 bg-[#FCFAF5] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
          {/* Subtle floral/organic corner background */}
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] select-none pointer-events-none">
            <Leaf className="w-60 h-60 text-[#2C3E20]" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-[#8A9A5B] font-mono text-[10px] tracking-[0.4em] uppercase block mb-3 font-bold">
              PRESTIGE PREVIEW REGISTRATION • 尊享先享预订
            </span>
            <h2 className="font-serif text-3xl text-[#1E201F] font-normal tracking-wide mb-6">
              加入城市安宁体验计划
            </h2>
            <p className="text-xs sm:text-sm text-[#1E201F]/70 leading-relaxed font-sans mb-10">
              订阅我们的烘焙茶寮季报。我们会向您寄奉京都宇治茶道美学、限定大功面包配方、
              且在秋季限定新品开售前48小时向您发出专门通道预约码（赠经典抹茶千层蛋糕切片尝新券一卷）。
            </p>

            {subscribed ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#2C3E20]/5 border border-[#2C3E20]/40 p-6 rounded-2xl text-center"
              >
                <p className="text-[14px] font-serif font-bold text-[#2C3E20]">
                  🍵 订阅成功！尊享特权码已在寄送途中。
                </p>
                <p className="text-[11px] text-[#2C3E20]/75 mt-2 tracking-wide font-medium">
                  专属特权优惠券将立即发送至您的邮箱，感谢您的关注。
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  required
                  type="email"
                  placeholder="请输入您的电子邮箱 / Email Addresses"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-white border border-[#2C3E20]/15 rounded-lg px-4 py-3.5 text-xs text-[#1E201F] outline-none focus:ring-1 focus:ring-[#2C3E20] placeholder:text-[#1E201F]/40"
                />
                <button
                  type="submit"
                  className="py-3.5 px-8 bg-[#2C3E20] text-white font-serif font-bold text-xs tracking-[0.2em] uppercase rounded-lg hover:bg-black transition-colors shrink-0"
                >
                  免费获取预订权益 REGISTER
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

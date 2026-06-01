/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Navigation,
  Compass,
  CalendarCheck,
  Info,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  Clock,
  User,
  Phone,
  Layers,
  ShieldCheck,
  X,
  Droplet,
  Heart
} from 'lucide-react';

interface Utensil {
  id: string;
  name: string;
  japanese: string;
  desc: string;
  material: string;
  history: string;
  emoji: string;
  quote: string;
  image: string;
}

interface Grade {
  id: string;
  name: string;
  sub: string;
  density: string;
  sweetness: number;
  umami: number;
  bitterness: number;
  color: string;
  colorHex: string;
  idealFor: string;
  notes: string;
}

export default function StoryView() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedUtensil, setSelectedUtensil] = useState<string>('chasen');
  const [selectedGrade, setSelectedGrade] = useState<string>('ceremonial');
  
  // Custom reservation state
  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [targetCafeName, setTargetCafeName] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-06-08');
  const [bookingTime, setBookingTime] = useState('14:00');
  const [bookingGuests, setBookingGuests] = useState('2');
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  const ritualSteps = [
    {
      title: "第一步：静心温盏 (Warm the Chawan)",
      desc: "将热泉水注入手工建盏或乐烧钵，徐徐转动使陶土充分温润，随之滤干，以干印拭干。温热的器皿方能彻底唤醒沉睡的抹茶油脂香。",
      tips: "最佳温盏度约为 45°C - 50°C",
      emoji: "🥣",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtgOU3-lrS9a8aJ55ZlJh4jNyD6sQkVzT2nJmxoZBSy8TCdemW6k_D502dc9xr0deU1A0SrbqDV5V4-cNt__PAzykg8p_0n2FmgqRs-2fiB4eZs9nbP4WVz2JakUPi69iJvbzJxVcYx6NGF2rvDlMdERTkeHpRbPPE2IRFnux1qEHqW6M98Y4tmLYCcoFhwjpwJK-SjImKT8tkQOUASzk9Sk2D8Bx-6UIGWR-21l-P_ajyXxFiEm0-OaNxIwBGZIcZ9SLmj_lK7qwq"
    },
    {
      title: "第二步：古粉入钵 (Measure Matcha)",
      desc: "选用细密铜质茶筛，将 2 克古法石磨初摘纯抹茶粉轻筛入钵，避免受潮起结，确保冲调时每一颗微米级香气分子均匀舒展。",
      tips: "约两茶勺，呈尖挺的微观黛绿小丘",
      emoji: "🥄",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQmg6GtobeEqsZC6k3Xs62PGNwQkuxOx7camTbKaoHR_ROIJcVjY6rNkHFAq5s7-glXbOHvOrdcLqs9krIoCBrUoSuqd-zVNRIIPzQVpPgvraA0RjiCRmeWMUr-C_cwmgFMEDPIc-8tQVzLoSGzMLljIq8Jth-rNWmT_5Ffqhcuf4W5rsLNi0EksudMNgESDykpangyknP6NNWpzxm4NOg21K_co-yl4BO86Aby2aE5fYEqas1nproEVH9nBBdwHtOEn6z9D8TNJoJ"
    },
    {
      title: "第三步：点泉注水 (Pour Water)",
      desc: "缓缓注入 80°C、硬度极低的天然弱碱山泉水 60ml。切忌使用滚沸开水，以防将其温和的茶氨酸与鲜嫩叶绿素烫伤发黄起苦。",
      tips: "山泉水温不要高于 82°C",
      emoji: "💧",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWpySKlfJJc6bexKOkvc1JT9Z87wVc4PEJJm9JTbB_ulv5NFRO-kKKIjPQipnkiQJIoYRlyNkb4fa9zvaMoe4yHjTc74dImGtex0DBGl_8-cvFgPG0RP4hKW9xOAdM5h4TviNSU4hxMX8KQOr9ebakXMEu1f0XkFRhHWHX_tX-lsflk-R6KljcAli9mBLyDpyxt7LNM5kanWkafM91FbsDEsufNHPqIuRkjQ5p64pu3gPVw4PiK2jMo7294ANBxa7fcQ3YNSutOGFC"
    },
    {
      title: "第四步：瞬打白花 (Whisking Jade Foam)",
      desc: "手腕松弛执百本立竹筅，贴近钵底，由慢至快，于钵里做极速W字划动。使碗底抹茶与水分充分起泡，收尾时打顺浮沫、划出浓顺汤花。",
      tips: "一盏汤色嫩白、泛满细密如脂泡沫的饱满汤花即成",
      emoji: "🍵",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVE5kD0YCYFYUWoZ3YlhRQAKBZgma9H-DBJENRBVmpuOU_ifkde9Ae1q4WZoahXfw2lz5FwKHiMZ1rBIgTIk8ZAs8chuEAnfbNvineqEMNi-9PXk4B8rLvhXRgFFLm4lG9rS5QQeCxs_22_QA-uVhsBrbXmnEVy0vlkK1mwKMBbOrgRUffCP0ee1yVI95Akb1HzQVU7aV2OT-VyKmWmkdW14c5FM7oxyCmBgbbzlnom27O9hH3S-F0q1jmadB3rsSnu49BWM7DSnpw"
    }
  ];

  const utensils: Utensil[] = [
    {
      id: "chasen",
      name: "百本立茶筅",
      japanese: "茶筅 (Chasen)",
      desc: "由一根整竹经手工繁复破割砍切、刮薄提尖、再将一百根精细小篾向内翻烘弯制而成。每一根细齿的弧度与弹性，都深刻影响着点茶起沫后泡沫的绵密度。",
      material: "三年以上天然生冬紫竹",
      history: "源自奈良高山村，世代相传纯正古物手作匠心技艺",
      emoji: "🥢",
      quote: "「经千百次极速击沸，化水为乳，抚平世间浮躁。」",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQmg6GtobeEqsZC6k3Xs62PGNwQkuxOx7camTbKaoHR_ROIJcVjY6rNkHFAq5s7-glXbOHvOrdcLqs9krIoCBrUoSuqd-zVNRIIPzQVpPgvraA0RjiCRmeWMUr-C_cwmgFMEDPIc-8tQVzLoSGzMLljIq8Jth-rNWmT_5Ffqhcuf4W5rsLNi0EksudMNgESDykpangyknP6NNWpzxm4NOg21K_co-yl4BO86Aby2aE5fYEqas1nproEVH9nBBdwHtOEn6z9D8TNJoJ"
    },
    {
      id: "chawan",
      name: "手拉胚美浓烧碗",
      japanese: "抹茶碗 (Chawan)",
      desc: "造型内敛、敦实厚重。茶碗粗粝微粘的陶土表面，能够锁住冲调抹茶所必需的舒适储温；宽阔且略微向内凹聚的底部，专为茶筅的击打角度和轨迹合理设计。",
      material: "天然粘土美浓长石釉",
      history: "古窑经1250°C高温烧制，釉面带有古拙如霜的质感与自然火斑",
      emoji: "🥣",
      quote: "「双手捧起温暖分量，感受大地陶坯的沉稳鼻息。」",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtgOU3-lrS9a8aJ55ZlJh4jNyD6sQkVzT2nJmxoZBSy8TCdemW6k_D502dc9xr0deU1A0SrbqDV5V4-cNt__PAzykg8p_0n2FmgqRs-2fiB4eZs9nbP4WVz2JakUPi69iJvbzJxVcYx6NGF2rvDlMdERTkeHpRbPPE2IRFnux1qEHqW6M98Y4tmLYCcoFhwjpwJK-SjImKT8tkQOUASzk9Sk2D8Bx-6UIGWR-21l-P_ajyXxFiEm0-OaNxIwBGZIcZ9SLmj_lK7qwq"
    },
    {
      id: "chashaku",
      name: "古本色茶杓",
      japanese: "茶杓 (Chashaku)",
      desc: "竹制茶匙，整体被蒸汽熏蒸、精心压弯成经典灵动的微折曲“鸭嘴弧”。修长平滑的匙面不含冗余倒角，能够每次精准利落地舀出两平勺（约2克）的顶级茶粉。",
      material: "手工炭烘竹节骨骼",
      history: "由老匠人以传统切切刮剥技法，依竹节筋络细微骨节手工刨削制作",
      emoji: "🎋",
      quote: "「一叶落知天下秋，一把杓承揽起整座绿意庭院。」",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJZ2J0VPnI7RCwOAc9jjEO7ML92pw44JkaU_XYKdgKgKEwcqN4iFkILmDvGiIJLeae1FAWHlU5saJCI8c957BJI-WoaBeobUCH9dDqTcytG26Ka1pBm9cuGyFXo-I4HtwsX2lS0iCbJ_ZI7yUq7Ib7VD1BLE92vENnFoJ0j9vIML-6_KcTZNfhzvEYcjDjAj5NfgBCPqdcEyX2nXZEAXn2ezPuqsc-QDPOx2A2f7pNStPon3THspr75a3TPN3qG8YKalFALRN0uHJe"
    },
    {
      id: "tetsubun",
      name: "寿山铸铁老釜",
      japanese: "鉄釜 (Tetsubun)",
      desc: "传统点茶仪式之命脉所在。生铁材质老釜加热升温极其温和漫长，能充分分解吸附矿泉水中的硬度硬杂质，释放微量二价铁离子，将沸水重组为柔软细腻的甘之甜水。",
      material: "寿山冶炼纯生铁砂",
      history: "历经二十余道手工蜡型及泥粉模工艺，成型后其壁斑驳蕴藏金石之声",
      emoji: "🏺",
      quote: "「釜中泉水初响如松涛鸣和，煮尽万虑，寂静身心。」",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWpySKlfJJc6bexKOkvc1JT9Z87wVc4PEJJm9JTbB_ulv5NFRO-kKKIjPQipnkiQJIoYRlyNkb4fa9zvaMoe4yHjTc74dImGtex0DBGl_8-cvFgPG0RP4hKW9xOAdM5h4TviNSU4hxMX8KQOr9ebakXMEu1f0XkFRhHWHX_tX-lsflk-R6KljcAli9mBLyDpyxt7LNM5kanWkafM91FbsDEsufNHPqIuRkjQ5p64pu3gPVw4PiK2jMo7294ANBxa7fcQ3YNSutOGFC"
    }
  ];

  const grades: Grade[] = [
    {
      id: "ceremonial",
      name: "极浓 • 御膳浓茶级",
      sub: "GOKUJO CEREMONIAL RESERVE",
      density: "头摘春茶原叶纯石磨精品",
      sweetness: 98,
      umami: 96,
      bitterness: 4,
      color: "嫩翠欲滴的极高亮宝石绿色",
      colorHex: "#1E5E14",
      idealFor: "纯茶汤打泡 (浓茶/薄茶式单品点饮)",
      notes: "仅选用海拔四百米火山岩土区避日覆盖满28天的极嫩头春茶芽，手工剔除主干粗梗，滋味宛如微融海苔，几乎毫无涩感，回甘绵醇极其悠远。"
    },
    {
      id: "premium",
      name: "祥绿 • 日常薄茶级",
      sub: "SAMIDORI PREMIUM BLEND",
      density: "首采与二采黄金拼配",
      sweetness: 72,
      umami: 78,
      bitterness: 22,
      color: "成熟饱满的高饱和丛林深墨绿",
      colorHex: "#2D6A4F",
      idealFor: "高级抹茶椰椰、清茗燕麦拿铁、鲜奶特调",
      notes: "选用初春首采嫩芽与晚春第二茬嫩叶，经大师调茶技艺，在醇厚的坚果香与清鲜的野草本清香味之间，构筑了完美的极佳鲜涩平衡，适合绝大部分即调特饮。"
    },
    {
      id: "culinary",
      name: "青山 • 制菓烘焙级",
      sub: "SEIZAN BAKING QUALITY",
      density: "强日照优质成熟夏茶原叶",
      sweetness: 32,
      umami: 45,
      bitterness: 65,
      color: "沉稳鲜亮的高饱和明黄翠绿",
      colorHex: "#5C8B49",
      idealFor: "重奶酪巴斯克、千层蛋糕、熔岩芝士",
      notes: "保留了相对高浓度的天然茶多酚、单宁酸和叶绿素。即便在经过高达200℃高温烘烤或重油脂奶酪的层层包夹后，依然能持久散发出令人振奋的浓烈成熟茶香，平衡甜腻腻感。"
    }
  ];

  const cafes = [
    {
      id: 'shanghai',
      city: '上海',
      name: '静 安 精 选 概 念 店',
      address: '上海市静安区南京西路1601号越洋剧院一楼',
      hours: '每日 10:00 - 22:00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWpySKlfJJc6bexKOkvc1JT9Z87wVc4PEJJm9JTbB_ulv5NFRO-kKKIjPQipnkiQJIoYRlyNkb4fa9zvaMoe4yHjTc74dImGtex0DBGl_8-cvFgPG0RP4hKW9xOAdM5h4TviNSU4hxMX8KQOr9ebakXMEu1f0XkFRhHWHX_tX-lsflk-R6KljcAli9mBLyDpyxt7LNM5kanWkafM91FbsDEsufNHPqIuRkjQ5p64pu3gPVw4PiK2jMo7294ANBxa7fcQ3YNSutOGFC',
      phone: '021-62888888',
    },
    {
      id: 'beijing',
      city: '北京',
      name: '三 里 屯 侘 寂 茶 寮',
      address: '北京市朝阳区三里屯路19号太古里北区N8栋',
      hours: '每日 09:30 - 21:30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8qBtji8gm15bV_bW9MCfWbBkBV9AgFYg6C5s4jb9vPL0ZoyQoq-774y-pLqoy6SNf8Yl8Kx0pUO6XHamfstqM7xY-aRl3ILTYk5_VYQAM6xU3aFixcHZIQFY7G-tD89pnnNTr62rbs-WmZ9YwIFGf1K4-NGPcxTA9kbzB8hDLrpqWPnjMyFCBTFnaWBAB6N414-p7yhW6eGQsnMyTsOI-pkfz9UQhAg-YWduwDsKv-HkdWA-bQEu3TYo-eQykN2_AdX2h9FPGH3lK',
      phone: '010-84555555',
    },
    {
      id: 'chengdu',
      city: '成都',
      name: '太 古 里 归 纯 工 坊',
      address: '成都市锦江区中纱帽街8号远洋太古里中里2层',
      hours: '每日 10:00 - 22:00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3XlL8C2UUcolJ4Tz6bfNahYW6WJA8XHX2sJu3WFNG2rcZaFq1JDBfElA1ZVmpij4tDlWuNm34MEKZm5Xb_NCM-5OsHwt3l6Odgy-bvxwvSDml_z6ByuL7raqVZBkefi1LXSekNE041MGUjtN4RvpGsO663tO45PyADrCYolxB5pludPCzHIoCdsGkm5-7t2UeiGZ-RarfMniI9z95NYTwTFuf0m0aVSY80iCSHsT80bSj_XAXj_C49zpgn9ZKycqRMPsxuoA6AKmC',
      phone: '028-86666666',
    },
  ];

  const handleOpenBooking = (cafeName: string) => {
    setTargetCafeName(cafeName);
    setIsBookedSuccess(false);
    setBookingName('');
    setBookingPhone('');
    setShowBookingPanel(true);
  };

  const submitReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim()) return;
    
    // Generate beautiful ticket mock digits
    const randomCode = `ZEN-${Math.floor(1000 + Math.random() * 9000)}-${bookingDate.split('-')[1]}${bookingDate.split('-')[2]}`;
    setBookingCode(randomCode);
    setIsBookedSuccess(true);
  };

  const activeUtensilData = utensils.find(u => u.id === selectedUtensil) || utensils[0];
  const activeGradeData = grades.find(g => g.id === selectedGrade) || grades[0];

  return (
    <div className="w-full pb-20 animate-fade-in-up">
      {/* Immersive banner cover */}
      <section className="relative h-[65vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover filter brightness-[0.7] scale-102"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVE5kD0YCYFYUWoZ3YlhRQAKBZgma9H-DBJENRBVmpuOU_ifkde9Ae1q4WZoahXfw2lz5FwKHiMZ1rBIgTIk8ZAs8chuEAnfbNvineqEMNi-9PXk4B8rLvhXRgFFLm4lG9rS5QQeCxs_22_QA-uVhsBrbXmnEVy0vlkK1mwKMBbOrgRUffCP0ee1yVI95Akb1HzQVU7aV2OT-VyKmWmkdW14c5FM7oxyCmBgbbzlnom27O9hH3S-F0q1jmadB3rsSnu49BWM7DSnpw"
            alt="侘寂茶寮空间"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#F7F5F0]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white mb-4 drop-shadow-md tracking-[0.1em]">
            归于纯粹，始于一盏
          </h1>
          <p className="tracking-[0.3em] font-medium text-[#F7F5F0]/80 text-xs sm:text-sm uppercase max-w-lg mx-auto leading-relaxed border-t border-white/20 pt-4">
            手作茶物 • 岁月沉淀之茗 • 宇治和弦心斋
          </p>
        </div>
      </section>

      {/* Section 1: History Origin of Kyoto Uji */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[#8A9A5B] text-xs font-semibold tracking-[0.25em] uppercase block">
              01 • KYOTO UJI SOURCE
            </span>
            <h2 className="font-serif text-2xl sm:text-3.5xl font-normal text-[#2C3E20] tracking-wide leading-tight">
              源自京都，云雾缭绕的抹茶故乡
            </h2>
            <div className="h-0.5 w-12 bg-[#8A9A5B]/30" />
            <p className="text-xs sm:text-sm text-[#2C3E20]/80 leading-relaxed">
              在京都南部的宇治川畔，清晨升起的浓厚川雾与排水顺畅的河道砂质黄土，自古便是种制顶级好茶的一方天作仙界环境。
            </p>
            <p className="text-xs sm:text-sm text-[#2C3E20]/80 leading-relaxed">
              茶农世家沿用着拥有数百年历史的 “本茨棚”（Tana Straw Covering）绝技。在极嫩茶青采摘前三周，用天然麦秆铺顶，阻绝85%以上的强烈阳光。
            </p>
            <p className="text-xs sm:text-sm text-[#2C3E20]/75 italic leading-relaxed bg-[#8A9A5B]/5 p-4 rounded-xl border-l-2 border-[#8A9A5B]">
              “没有直射光，茶树为了捕捉一丝微光，会催生叶绿素剧烈转换为极为鲜美爽口、自带海苔甜香的高浓度碳基茶氨酸。这正是顶级手打茶微甘、不苦涩的物理基底。”
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-md h-72 sm:h-[450px] relative group border border-[#c4c8b7]/40">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJZ2J0VPnI7RCwOAc9jjEO7ML92pw44JkaU_XYKdgKgKEwcqN4iFkILmDvGiIJLeae1FAWHlU5saJCI8c957BJI-WoaBeobUCH9dDqTcytG26Ka1pBm9cuGyFXo-I4HtwsX2lS0iCbJ_ZI7yUq7Ib7VD1BLE92vENnFoJ0j9vIML-6_KcTZNfhzvEYcjDjAj5NfgBCPqdcEyX2nXZEAXn2ezPuqsc-QDPOx2A2f7pNStPon3THspr75a3TPN3qG8YKalFALRN0uHJe"
              alt="宇治茶山"
              className="w-full h-full object-cover group-hover:scale-[1.03] duration-1000 transition-transform ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <span className="font-mono text-[9px] tracking-widest text-[#A3B899] uppercase font-bold">TERROIR</span>
                <p className="font-serif text-sm font-medium">宇治川雾漫坡遮罩天然茶田</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Granite slow milling (Bento card grid) */}
      <section className="bg-[#FAF9F5] border-y border-[#2C3E20]/5 py-24 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[#8A9A5B] text-xs font-semibold tracking-[0.25em] uppercase block mb-2">
              02 • STONE MILLING CRAFT
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#2C3E20] tracking-wide">
              古法玄武石磨，一小时仅得 30g
            </h2>
            <p className="text-xs text-[#2C3E20]/60 mt-2">
              保留活性温度，不惜时间以毫米级花岗岩慢轧而出的鲜绿奇迹
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {/* Left large text area card */}
            <div className="md:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-[#c4c8b7]/30 flex flex-col justify-between shadow-xs group">
              <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-6 border border-[#c4c8b7]/15">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtgOU3-lrS9a8aJ55ZlJh4jNyD6sQkVzT2nJmxoZBSy8TCdemW6k_D502dc9xr0deU1A0SrbqDV5V4-cNt__PAzykg8p_0n2FmgqRs-2fiB4eZs9nbP4WVz2JakUPi69iJvbzJxVcYx6NGF2rvDlMdERTkeHpRbPPE2IRFnux1qEHqW6M98Y4tmLYCcoFhwjpwJK-SjImKT8tkQOUASzk9Sk2D8Bx-6UIGWR-21l-P_ajyXxFiEm0-OaNxIwBGZIcZ9SLmj_lK7qwq"
                  alt="古石磨磨制"
                  className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-1000 ease-out"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-[#2C3E20] mb-3">
                  恒温地窖中的微秒摩擦
                </h3>
                <p className="text-xs sm:text-sm text-[#2C3E20]/80 leading-relaxed">
                  大体积高能机械设备，在剧烈高速旋转、摩擦中会产生多达 60℃ 以上的金属热效应。这就足以轻而易举地坏死鲜绿茶粉内的气味小分子和天然酶。
                  <br />
                  我们使用极其沉重的、由日本御影石手工打琢的双面对纹花岗岩石磨，静置于恒温 18℃、避光湿润的地窑中。两面石盘微摩擦低速平移，将干燥后的完整“撵茶”（Tencha）叶叶肉，缓缓轧成带有极细天然微静电感、入口即融的 2 微米（大约3000目以上）特等茶粉。
                </p>
              </div>
            </div>

            {/* Right smaller blocks */}
            <div className="md:col-span-4 grid grid-rows-2 gap-8">
              <div className="bg-[#1C201A] text-[#F7F5F0] rounded-3xl p-6 sm:p-8 flex flex-col justify-center border border-[#c4c8b7]/20 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#8A9A5B]/15 to-transparent rounded-full pointer-events-none" />
                <h4 className="font-serif text-base font-semibold text-[#8A9A5B] mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  和之精魂 • 无添物理
                </h4>
                <p className="text-xs text-[#F5F2EB]/80 leading-relaxed">
                  手打茶寮坚信侘寂原生之美。全系制品无论是纯粉还是乳酪、特饮，均 100% 拒绝任何添加剂、人工香精或防腐化学剂，全靠石磨研磨的原生茶氨酸带来天成海苔鲜味，支撑整晚心境。
                </p>
              </div>

              <div className="rounded-3xl overflow-hidden shadow-inner border border-[#c4c8b7]/30 relative group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQmg6GtobeEqsZC6k3Xs62PGNwQkuxOx7camTbKaoHR_ROIJcVjY6rNkHFAq5s7-glXbOHvOrdcLqs9krIoCBrUoSuqd-zVNRIIPzQVpPgvraA0RjiCRmeWMUr-C_cwmgFMEDPIc-8tQVzLoSGzMLljIq8Jth-rNWmT_5Ffqhcuf4W5rsLNi0EksudMNgESDykpangyknP6NNWpzxm4NOg21K_co-yl4BO86Aby2aE5fYEqas1nproEVH9nBBdwHtOEn6z9D8TNJoJ"
                  alt="茶筅打白沫"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION A: Aesthetics of Utensils (茶道具の美的探究) */}
      <section className="py-24 max-w-7xl mx-auto px-4 border-b border-[#2C3E20]/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#8A9A5B] text-xs font-semibold tracking-[0.25em] uppercase block mb-2">
            03 • THE BEAUTY OF UTENSILS
          </span>
          <h2 className="font-serif text-2xl sm:text-3.5xl font-normal text-[#2C3E20] tracking-wide">
            盛纳绿意之心：茶器具的工艺审美
          </h2>
          <p className="text-xs text-[#2C3E20]/60 mt-3 leading-relaxed">
            器物因手作而温暖，茶筅击打、陶钵呵护，每一件工具都是仪式中不可或缺的修行。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left menu selector */}
          <div className="lg:col-span-4 space-y-3.5">
            {utensils.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedUtensil(item.id)}
                className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  selectedUtensil === item.id
                    ? 'bg-[#1C201A] border-[#1C201A] text-white shadow-md translation-x-1'
                    : 'bg-white border-[#c4c8b7]/40 text-[#2C3E20] hover:bg-[#FAF9F5]/80 hover:border-[#8A9A5B]/40'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xl">{item.emoji}</span>
                  <div>
                    <p className="font-serif text-sm font-semibold">{item.name}</p>
                    <p className="text-[10px] loyalty-sans font-medium tracking-wider opacity-60 mt-0.5">{item.japanese}</p>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                  selectedUtensil === item.id ? 'translate-x-1 text-[#8A9A5B]' : 'opacity-30'
                }`} />
              </button>
            ))}
          </div>

          {/* Right visual content displaying frame with smooth transition */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedUtensil}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="bg-[#FAF9F5]/70 border border-[#c4c8b7]/40 rounded-3xl p-6 sm:p-10 grid md:grid-cols-12 gap-8 items-center"
              >
                {/* Visual Area */}
                <div className="md:col-span-5 aspect-square bg-[#0E120D] rounded-2xl overflow-hidden border border-[#c4c8b7]/30 relative shadow-inner">
                  <img
                    src={activeUtensilData.image}
                    alt={activeUtensilData.name}
                    className="w-full h-full object-cover mix-blend-lighten opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#121811]/60 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-3xl p-2 bg-[#F7F5F0] rounded-full shadow-md text-center">
                    {activeUtensilData.emoji}
                  </span>
                </div>

                {/* Information Area */}
                <div className="md:col-span-7 space-y-5">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest bg-[#8A9A5B]/15 text-[#5C633F] px-3 py-1 rounded-full font-bold uppercase">
                      CHADOGU SELECTION
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2C3E20] mt-3">
                      {activeUtensilData.name}
                    </h3>
                    <p className="text-[11px] text-[#8A9A5B] font-mono font-semibold tracking-wider italic mt-1">
                      {activeUtensilData.japanese}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#2C3E20]/80 leading-relaxed">
                    {activeUtensilData.desc}
                  </p>

                  <div className="space-y-2 border-t border-[#c4c8b7]/25 pt-4">
                    <p className="text-xs text-[#2C3E20]/70 flex items-center gap-1.5">
                      <strong className="text-[#2C3E20] font-serif">匠选材料:</strong> {activeUtensilData.material}
                    </p>
                    <p className="text-xs text-[#2C3E20]/70 flex items-center gap-1.5">
                      <strong className="text-[#2C3E20] font-serif">印物由来:</strong> {activeUtensilData.history}
                    </p>
                  </div>

                  <p className="font-serif italic text-xs text-[#8A9A5B] bg-[#8A9A5B]/5 px-4.5 py-3 rounded-xl border-l-[3px] border-[#8A9A5B]">
                    {activeUtensilData.quote}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* NEW SECTION B: Matcha Grading and Tasting Radar (等级色谱与雷达风味星级) */}
      <section className="py-24 bg-[#FAF9F5] border-b border-[#2C3E20]/5 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#8A9A5B] text-xs font-semibold tracking-[0.25em] uppercase block mb-2">
              04 • MATCHA GRADINGS & TASTING
            </span>
            <h2 className="font-serif text-2xl sm:text-3.5xl font-normal text-[#2C3E20] tracking-wide">
              色泽判定阶：抹茶等级色谱与风味鉴赏
            </h2>
            <p className="text-xs text-[#2C3E20]/60 mt-3 leading-relaxed">
              根据遮光时间、采收季节、嫩叶部位以及石磨工艺判定抹茶等级。以下两极风味，一目了然其精妙。
            </p>
          </div>

          {/* Interactive Grade Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {grades.map(grade => (
              <button
                key={grade.id}
                onClick={() => setSelectedGrade(grade.id)}
                className={`px-6 py-3 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  selectedGrade === grade.id
                    ? 'bg-[#2C3E20] text-[#F7F5F0] shadow-sm scale-102'
                    : 'bg-white text-[#2C3E20]/75 border border-[#c4c8b7]/30 hover:border-[#8A9A5B]'
                }`}
              >
                {grade.name.split(' • ')[1] || grade.name}
              </button>
            ))}
          </div>

          <div className="bg-white border border-[#c4c8b7]/35 rounded-3xl p-6 sm:p-10 shadow-xs max-w-5xl mx-auto">
            <div className="grid md:grid-cols-12 gap-10 items-stretch">
              {/* Left Color Block & Ideal serves */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#8A9A5B] block font-bold mb-3">
                    {activeGradeData.sub}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2C3E20]">
                    {activeGradeData.name}
                  </h3>
                  <p className="text-xs text-[#2C3E20]/60 mt-1">{activeGradeData.density}</p>
                </div>

                {/* Dynamic Swatch Color Block */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-[#2C3E20]/70 font-semibold">标称色相:</span>
                    <span className="text-[10px] font-mono text-[#8A9A5B] font-bold">{activeGradeData.colorHex}</span>
                  </div>
                  <div 
                    className="h-28 rounded-2xl w-full border border-black/10 shadow-inner flex items-center justify-center text-white font-mono text-xs tracking-wider"
                    style={{ backgroundColor: activeGradeData.colorHex }}
                  >
                    <span>{activeGradeData.color}</span>
                  </div>
                </div>

                {/* Ideal For */}
                <div className="bg-[#FAF9F5] p-4.5 rounded-xl border-l-[3px] border-[#8A9A5B]/50">
                  <span className="text-[9px] font-mono tracking-widest text-[#2C3E20] block font-extrabold uppercase">
                    IDEAL SERVICE / 最佳契合:
                  </span>
                  <p className="font-serif text-sm font-bold text-[#2C3E20] mt-1 flex items-center gap-1.5">
                    🍵 {activeGradeData.idealFor}
                  </p>
                </div>
              </div>

              {/* Right detailed notes & Radar Taste Bars */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <span className="text-[9px] font-mono tracking-widest text-[#8A9A5B] block font-bold uppercase">
                    TASTE PROFILE STATS / 茶道感官指标比:
                  </span>

                  {/* Flavor Bar - Sweetness */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[#2C3E20]/90">
                      <span className="font-semibold flex items-center gap-1">🌸 甘回甜鲜度 (Sweetness / Ltheanine):</span>
                      <span className="font-bold">{activeGradeData.sweetness}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${activeGradeData.sweetness}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full bg-gradient-to-r from-[#A3B899] to-[#8A9A5B] rounded-full"
                      />
                    </div>
                  </div>

                  {/* Flavor Bar - Umami */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[#2C3E20]/90">
                      <span className="font-semibold flex items-center gap-1">🌊 手打海苔鲜质 (Astringent Umami):</span>
                      <span className="font-bold">{activeGradeData.umami}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${activeGradeData.umami}%` }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-[#1E5E14] rounded-full"
                      />
                    </div>
                  </div>

                  {/* Flavor Bar - Bitterness */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[#2C3E20]/90">
                      <span className="font-semibold flex items-center gap-1">🎋 骨香单宁涩苦度 (Tanin Bitterness):</span>
                      <span className="font-bold">{activeGradeData.bitterness}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${activeGradeData.bitterness}%` }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-[#8A9A5B]/30 to-[#8A9A5B] rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Explanatory notes text */}
                <div className="border-t border-[#c4c8b7]/40 pt-6 space-y-3">
                  <span className="text-[10px] font-semibold text-[#8A9A5B] tracking-wider uppercase flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-[#8A9A5B]" />
                    茶道师亲笔感官札记:
                  </span>
                  <p className="text-xs sm:text-sm text-[#2C3E20]/80 leading-relaxed bg-[#FAF9F5]/80 p-4.5 rounded-2xl border border-[#c4c8b7]/20 font-serif whitespace-pre-line">
                    {activeGradeData.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive ritual steps (Zen Tea Whisking Steps) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[#8A9A5B] text-xs font-semibold tracking-[0.25em] uppercase block mb-2">
              05 • RITUAL STEPS EXPERIENCE
            </span>
            <h2 className="font-serif text-2xl sm:text-3.5xl font-normal text-[#2C3E20] tracking-wide">
              日本点茶仪轨：四步调出一盏玉乳
            </h2>
            <p className="text-xs text-[#2C3E20]/60 mt-3">
              点击下方互动箭头，领略传统茶师心中化水为乳的至臻境界
            </p>
          </div>

          <div className="relative bg-[#FAF9F5]/40 border border-[#c4c8b7]/40 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center min-h-[400px]">
            {/* Left side: Interactive image frame with a sliding dynamic indicator overlay */}
            <div className="w-full md:w-5/12 aspect-square md:aspect-auto md:h-72 rounded-2xl overflow-hidden relative group shadow-inner border border-[#c4c8b7]/15">
              <img
                src={ritualSteps[currentStep].image}
                alt={ritualSteps[currentStep].title}
                className="w-full h-full object-cover transition-all duration-700 transform scale-100 group-hover:scale-101"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end p-4">
                <span className="text-2xl">{ritualSteps[currentStep].emoji}</span>
              </div>
            </div>

            {/* Right side: Detailed descriptions & arrows */}
            <div className="flex-1 space-y-5 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <span className="font-mono text-[9px] text-[#A3B899] bg-[#8A9A5B]/15 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-block">
                  STAGE 0{currentStep + 1}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#2C3E20] leading-tight">
                  {ritualSteps[currentStep].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#2C3E20]/80 leading-relaxed min-h-[96px]">
                  {ritualSteps[currentStep].desc}
                </p>
                <div className="flex items-center gap-1.5 p-3 rounded-xl bg-[#8A9A5B]/5 text-[#5C633F] text-xs border border-[#8A9A5B]/10">
                  <span className="text-sm">💡</span>
                  <span className="font-medium font-serif italic text-[11px]">{ritualSteps[currentStep].tips}</span>
                </div>
              </div>

              {/* Progress Stepping Path with pointing arrows */}
              <div className="flex items-center gap-2.5 pt-4 border-t border-[#c4c8b7]/15">
                <div className="flex-1 flex justify-start gap-2">
                  {ritualSteps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      className={`h-2 rounded-full transition-all duration-300 relative group cursor-pointer ${
                        idx === currentStep ? 'w-8 bg-[#8A9A5B]' : 'w-2 bg-[#c4c8b7]/50 hover:bg-[#8A9A5B]/50'
                      }`}
                      title={`步骤 ${idx + 1}`}
                    >
                      {/* Interactive hovering helper arrow */}
                      {idx === currentStep && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[#8A9A5B] text-[8px] animate-bounce select-none">
                          ▼
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Animated Navigation Arrow Controls */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="disabled:opacity-30 disabled:pointer-events-none group/prev p-2.5 rounded-full border border-[#8A9A5B]/20 bg-white text-[#2C3E20] hover:bg-[#2C3E20] hover:text-white transition-all duration-300 shadow-xs disabled:scale-95 cursor-pointer flex items-center justify-center h-10 w-10 border border-[#c4c8b7]"
                    title="上一步"
                  >
                    <ArrowLeft className="w-4 h-4 transform group-hover/prev:-translate-x-1 group-disabled/prev:translate-x-0 transition-transform duration-300" />
                  </button>
                  <button
                    disabled={currentStep === ritualSteps.length - 1}
                    onClick={() => setCurrentStep(next => next + 1)}
                    className="disabled:opacity-30 disabled:pointer-events-none group/next p-2.5 rounded-full border border-[#8A9A5B]/20 bg-white text-[#2C3E20] hover:bg-[#2C3E20] hover:text-white transition-all duration-300 shadow-xs disabled:scale-95 cursor-pointer flex items-center justify-center h-10 w-10 border border-[#c4c8b7]"
                    title="下一步"
                  >
                    <ArrowRight className="w-4 h-4 transform group-hover/next:translate-x-1 group-disabled/next:-translate-x-0 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION C: The Four Zen Beliefs (和敬清寂 • 禅思茶室) */}
      <section className="py-24 bg-[#1C201A] text-[#F7F5F0] px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#8A9A5B] text-xs font-semibold tracking-[0.25em] uppercase block mb-2">
              06 • THE CHADO PHILOSOPHY
            </span>
            <h2 className="font-serif text-2xl sm:text-3.5xl font-normal text-white tracking-wide">
              和敬清寂：不落俗套的四种禅悟
            </h2>
            <div className="h-0.5 w-12 bg-[#8A9A5B]/50 mx-auto mt-4" />
            <p className="text-xs text-[#F5F2EB]/60 mt-3 leading-relaxed">
              茶道不仅仅是一门技艺，更是内窥心宅的无声桥梁。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#242921] border border-white/5 rounded-2xl p-6 hover:border-[#8A9A5B]/30 hover:-translate-y-1 transition-all duration-300">
              <span className="text-2xl font-serif text-[#8A9A5B] border-b border-[#8A9A5B]/20 pb-2 block mb-4">和 (Harmony)</span>
              <p className="text-xs text-[#FAF9F5]/75 leading-relaxed font-serif">
                人与自然的和美鸣合。顺应二十四节气寒暑，选用春初生嫩叶，配合无华粗粝陶器，品尝雨雪阴晴之间的天然本真风味。
              </p>
            </div>
            <div className="bg-[#242921] border border-white/5 rounded-2xl p-6 hover:border-[#8A9A5B]/30 hover:-translate-y-1 transition-all duration-300">
              <span className="text-2xl font-serif text-[#8A9A5B] border-b border-[#8A9A5B]/20 pb-2 block mb-4">敬 (Respect)</span>
              <p className="text-xs text-[#FAF9F5]/75 leading-relaxed font-serif">
                主客并进无有高低。主打茶者虔敬行礼、躬身双手，就尝者以珍惜体谅之心一口口啜饮，抛却社会功名之繁冗阶梯枷锁。
              </p>
            </div>
            <div className="bg-[#242921] border border-white/5 rounded-2xl p-6 hover:border-[#8A9A5B]/30 hover:-translate-y-1 transition-all duration-300">
              <span className="text-2xl font-serif text-[#8A9A5B] border-b border-[#8A9A5B]/20 pb-2 block mb-4">清 (Purity)</span>
              <p className="text-xs text-[#FAF9F5]/75 leading-relaxed font-serif">
                器与心智的彻底洗练。拂拭尘埃，温盏滤纸，冲泡一杯无添加之茶，洗涤日常在嘈杂写字楼、高压城市中所覆上的世故微尘。
              </p>
            </div>
            <div className="bg-[#242921] border border-white/5 rounded-2xl p-6 hover:border-[#8A9A5B]/30 hover:-translate-y-1 transition-all duration-300">
              <span className="text-2xl font-serif text-[#8A9A5B] border-b border-[#8A9A5B]/20 pb-2 block mb-4">寂 (Tranquility)</span>
              <p className="text-xs text-[#FAF9F5]/75 leading-relaxed font-serif">
                独坐观念的终极宁静。在松籁煮沸的细微声音中，在一片寂静的落叶光斑中，重获身心与天地万事万物相处的心斋之安。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Store locations cards layout */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <span className="text-[#8A9A5B] text-xs font-semibold tracking-[0.25em] uppercase block mb-1">
              07 • ZEN TEA CHAMBERS
            </span>
            <h2 className="font-serif text-2xl sm:text-3.5xl font-normal text-[#2C3E20] tracking-wide">
              线下城市和风概念茶寮
            </h2>
          </div>
          <p className="text-xs text-[#2C3E20]/75 max-w-sm leading-relaxed">
            在繁嚣喧闹的城市核心带，辟一隅让人安顿灵魂深吸的风声竹影深院。欢迎预约体验茶道师面对面的点饮席，或参研修打课程。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cafes.map(cafe => (
            <div
              key={cafe.id}
              className="bg-white border border-[#c4c8b7]/30 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-60 relative overflow-hidden group">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 bg-[#1C201A] px-3.5 py-1.5 rounded-full text-xs font-serif font-bold text-[#F7F5F0] shadow-sm select-none">
                    {cafe.city}寮 • 仪式席预订中
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#2C3E20] mb-2">
                      {cafe.name}
                    </h3>
                    <p className="text-xs text-[#2C3E20]/80 flex items-start gap-1.5 leading-relaxed min-h-[40px]">
                      <MapPin className="w-4 h-4 text-[#8A9A5B] shrink-0 mt-0.5" />
                      <span>{cafe.address}</span>
                    </p>
                  </div>

                  <div className="text-[10px] text-[#2C3E20]/60 font-mono space-y-1 pt-1.5 border-t border-[#c4c8b7]/15">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#2C3E20]/50" />
                      <strong>营业时段:</strong> {cafe.hours}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#2C3E20]/50" />
                      <strong>咨询热线:</strong> {cafe.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map visual and quick reserve */}
              <div className="p-6 pt-0 grid grid-cols-2 gap-3">
                <button
                  onClick={() => alert(`🧭 正在为您检索至【${cafe.name}】的导航路径...\n详细地址: ${cafe.address}`)}
                  className="py-2.5 rounded-xl border border-[#2C3E20]/20 hover:bg-[#FAF9F5] text-[#2C3E20] text-xs font-serif font-semibold flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#8A9A5B]" />
                  地图导航
                </button>
                <button
                  onClick={() => handleOpenBooking(cafe.name)}
                  className="py-2.5 rounded-xl bg-[#2C3E20] text-white text-xs font-serif font-semibold hover:bg-[#1E2E16] flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-[#8A9A5B]" />
                  预订打席
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Online Reservation Panel (Replacing alert dialog box) */}
      <AnimatePresence>
        {showBookingPanel && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingPanel(false)}
              className="absolute inset-0 bg-[#0E120D]/65 backdrop-blur-sm"
            />

            {/* Panel box container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-[#FAF9F5] rounded-3xl w-full max-w-md p-6 sm:p-8 relative z-10 border border-[#c4c8b7]/50 shadow-2xl overflow-hidden"
            >
              {/* Corner circle decorations */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#8A9A5B]/15 to-transparent rounded-full pointer-events-none" />

              <button
                onClick={() => setShowBookingPanel(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100/80 text-[#2C3E20] transition-colors cursor-pointer"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>

              {!isBookedSuccess ? (
                <>
                  <div className="mb-6">
                    <span className="text-[9px] font-mono tracking-widest text-[#8A9A5B] block font-bold uppercase">
                      ARTISAN SESSION RESERVE
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#2C3E20] mt-1.5 leading-tight">
                      线下茶席预约 • 【{targetCafeName}】
                    </h3>
                    <p className="text-xs text-[#2C3E20]/60 mt-1">
                      静候入座，亲身观赏茶道师为您击拂一盏纯正的黄金甘露。
                    </p>
                  </div>

                  <form onSubmit={submitReservation} className="space-y-4">
                    {/* Guest Name */}
                    <div>
                      <label className="block text-[11px] text-[#2C3E20]/60 font-serif tracking-widest uppercase mb-1 font-bold">
                        雅士称谓 / Guest Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9A5B]" />
                        <input
                          type="text"
                          required
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          placeholder="请输入您的姓名"
                          className="w-full bg-white border border-[#c4c8b7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2C3E20] placeholder-gray-400 focus:outline-[#8A9A5B]"
                        />
                      </div>
                    </div>

                    {/* Guest Phone */}
                    <div>
                      <label className="block text-[11px] text-[#2C3E20]/60 font-serif tracking-widest uppercase mb-1 font-bold">
                        联络垂询电话 / Phone number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9A5B]" />
                        <input
                          type="tel"
                          required
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          placeholder="请输入 11 位手机号码"
                          className="w-full bg-white border border-[#c4c8b7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2C3E20] placeholder-gray-400 focus:outline-[#8A9A5B]"
                        />
                      </div>
                    </div>

                    {/* Grid Dates & Seats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-[#2C3E20]/60 font-serif tracking-widest uppercase mb-1 font-bold">
                          预约日期 / Date
                        </label>
                        <input
                          type="date"
                          required
                          min="2026-06-01"
                          max="2026-08-31"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full bg-white border border-[#c4c8b7] rounded-xl px-3 py-2.5 text-xs text-[#2C3E20] focus:outline-[#8A9A5B]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#2C3E20]/60 font-serif tracking-widest uppercase mb-1 font-bold">
                          席尊人数 / Seats
                        </label>
                        <select
                          value={bookingGuests}
                          onChange={(e) => setBookingGuests(e.target.value)}
                          className="w-full bg-white border border-[#c4c8b7] rounded-xl px-3 py-2.5 text-xs text-[#2C3E20] focus:outline-[#8A9A5B] appearance-auto"
                        >
                          <option value="1">1位 (独坐心斋)</option>
                          <option value="2">2位 (一期一会)</option>
                          <option value="3">3位 (三人得道)</option>
                          <option value="4">4位 (茶话雅聚)</option>
                        </select>
                      </div>
                    </div>

                    {/* Time slots selection */}
                    <div>
                      <label className="block text-[10px] text-[#2C3E20]/60 font-serif tracking-widest uppercase mb-1.5 font-bold">
                        茶道雅席时段 / Select Session
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { text: '清澜席 10:00', val: '10:00' },
                          { text: '凝翠席 14:00', val: '14:00' },
                          { text: '松涛席 16:30', val: '16:30' }
                        ].map(slot => (
                          <button
                            key={slot.val}
                            type="button"
                            onClick={() => setBookingTime(slot.val)}
                            className={`py-2 rounded-xl text-xs font-serif border text-center transition-all cursor-pointer ${
                              bookingTime === slot.val
                                ? 'bg-[#2C3E20] border-[#2C3E20] text-white font-bold'
                                : 'bg-white border-[#c4c8b7] text-[#2C3E20]/75 hover:bg-[#FAF9F5]'
                            }`}
                          >
                            {slot.text}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit click */}
                    <button
                      type="submit"
                      className="w-full bg-[#1C201A] text-white py-3 rounded-xl border border-white/10 text-xs font-serif font-bold hover:bg-[#2C3E20] transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-5 active:scale-[0.98]"
                    >
                      <CalendarCheck className="w-4 h-4 text-[#8A9A5B]" />
                      确认锁定和风茶席席位
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 bg-emerald-50 text-[#1E5E14] border border-[#1E5E14]/10 rounded-full flex items-center justify-center mx-auto shadow-inner text-2xl animate-pulse">
                    🍵
                  </div>
                  
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.25em] text-[#8A9A5B] block font-extrabold uppercase">
                      RESERVATION VERIFIED / 预订生效
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#2C3E20] mt-2">
                      【{bookingName}】尊客您好，一期一会。
                    </h3>
                    <p className="text-xs text-[#2C3E20]/70 mt-2.5 max-w-sm mx-auto leading-relaxed">
                      您已成功预约：<strong className="text-[#2C3E20]">{targetCafeName}</strong> 的下午茶点茶体验席位。
                    </p>
                  </div>

                  {/* Bamboo Ticket layout */}
                  <div className="bg-white border border-[#c4c8b7] rounded-2xl p-4.5 text-left font-serif space-y-2 max-w-xs mx-auto shadow-xs relative">
                    <div className="absolute top-4 right-4 text-[9px] text-[#8A9A5B] tracking-wider font-extrabold uppercase bg-[#8A9A5B]/10 px-2.5 py-0.5 rounded-full">
                      TICKET ACTIVE
                    </div>
                    <div>
                      <span className="text-[9px] text-[#2C3E20]/40 font-mono tracking-wider block">RESERVATION CODE:</span>
                      <strong className="text-xs font-mono text-[#2C3E20] tracking-wider select-all">{bookingCode}</strong>
                    </div>
                    <div className="h-0.5 border-t border-dashed border-[#c4c8b7] my-2" />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[9px] text-[#2C3E20]/40 block leading-none">日期 / DATE:</span>
                        <span className="font-sans font-semibold text-[#2C3E20] leading-loose">{bookingDate}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#2C3E20]/40 block leading-none">时段 / SESSION:</span>
                        <span className="font-serif font-bold text-[#2C3E20] leading-loose">{bookingTime === '10:00' ? '清澜席 10:00' : bookingTime === '14:00' ? '凝翠席 14:00' : '松涛席 16:30'}</span>
                      </div>
                    </div>
                    <div className="text-[9px] text-gray-500 font-sans mt-2.5">
                      * 席位为您保留30分钟。服务员会发送入场通知信息，盼光临。
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBookingPanel(false)}
                    className="px-8 py-2.5 bg-[#1C201A] text-white rounded-xl text-xs font-serif hover:bg-[#2C3E20] cursor-pointer transition-colors"
                  >
                    知晓，返回画卷
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

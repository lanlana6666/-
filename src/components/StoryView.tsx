/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MapPin, Navigation, Compass, CalendarCheck, Info, MessageSquare, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export default function StoryView() {
  const [activeCafes, setActiveCafes] = useState<Record<string, boolean>>({});
  const [currentStep, setCurrentStep] = useState(0);

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
      desc: "手腕松弛执百本立竹筅，贴近钵底，由慢至快，于钵里做极速中划动。使碗底抹茶与水分充分起泡，收尾时打顺浮沫、划出浓顺汤花。",
      tips: "一盏汤色嫩白、泛满细密如脂泡沫的饱满汤花即成",
      emoji: "🍵",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVE5kD0YCYFYUWoZ3YlhRQAKBZgma9H-DBJENRBVmpuOU_ifkde9Ae1q4WZoahXfw2lz5FwKHiMZ1rBIgTIk8ZAs8chuEAnfbNvineqEMNi-9PXk4B8rLvhXRgFFLm4lG9rS5QQeCxs_22_QA-uVhsBrbXmnEVy0vlkK1mwKMBbOrgRUffCP0ee1yVI95Akb1HzQVU7aV2OT-VyKmWmkdW14c5FM7oxyCmBgbbzlnom27O9hH3S-F0q1jmadB3rsSnu49BWM7DSnpw"
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

  const handleBooking = (cafeName: string) => {
    alert(`🍵 您已成功预约【${cafeName}】下午茶仪式茶道席位置！我们将发送确认短消息至您的手机。静候光临。`);
  };

  return (
    <div className="w-full pb-20 animate-fade-in-up">
      {/* Immersive banner cover */}
      <section className="relative h-[65vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover filter brightness-90 scale-102"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVE5kD0YCYFYUWoZ3YlhRQAKBZgma9H-DBJENRBVmpuOU_ifkde9Ae1q4WZoahXfw2lz5FwKHiMZ1rBIgTIk8ZAs8chuEAnfbNvineqEMNi-9PXk4B8rLvhXRgFFLm4lG9rS5QQeCxs_22_QA-uVhsBrbXmnEVy0vlkK1mwKMBbOrgRUffCP0ee1yVI95Akb1HzQVU7aV2OT-VyKmWmkdW14c5FM7oxyCmBgbbzlnom27O9hH3S-F0q1jmadB3rsSnu49BWM7DSnpw"
            alt="侘寂茶寮空间"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-[#FDFCF8]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="font-serif italic text-3xl sm:text-5xl font-bold text-white mb-4 drop-shadow-md">
            归于纯粹，始于一盏
          </h1>
          <p className="font-mono text-[10px] sm:text-xs text-secondary-container tracking-[0.3em] font-semibold uppercase">
            MATCHA ZEN • ORIGINAL HERITAGE SINCE MILENNIAL
          </p>
        </div>
      </section>

      {/* Section 1: History Origin of Kyoto Uji */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-primary text-xs font-mono tracking-widest uppercase font-semibold">
              01 • KYOTO UJI SOURCE
            </span>
            <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-primary">
              源自京都，云雾缭绕的抹茶故乡
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              在京都南部的宇治川畔，清晨升起的浓厚川雾与排水顺畅的河道砂质黄土，自古便是种制顶级好茶的一方仙界环境。
            </p>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              茶农世家沿用着拥有数百年历史的 “棚遮遮光覆盖” 绝技。在极嫩茶青采摘前三周封顶防晒，让叶片不直晒阳光，进而使儿茶素在静暗中剧烈转换为鲜美爽口、自带海苔甜香的高浓度碳基茶氨酸。
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm h-72 sm:h-[400px]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJZ2J0VPnI7RCwOAc9jjEO7ML92pw44JkaU_XYKdgKgKEwcqN4iFkILmDvGiIJLeae1FAWHlU5saJCI8c957BJI-WoaBeobUCH9dDqTcytG26Ka1pBm9cuGyFXo-I4HtwsX2lS0iCbJ_ZI7yUq7Ib7VD1BLE92vENnFoJ0j9vIML-6_KcTZNfhzvEYcjDjAj5NfgBCPqdcEyX2nXZEAXn2ezPuqsc-QDPOx2A2f7pNStPon3THspr75a3TPN3qG8YKalFALRN0uHJe"
              alt="宇治茶山"
              className="w-full h-full object-cover hover:scale-103 duration-700 transition-transform"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Granite slow milling (Bento card grid) */}
      <section className="bg-surface-beige py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-primary text-xs font-mono tracking-widest uppercase font-semibold">
              02 • STONE MILLING CRAFT
            </span>
            <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-primary mt-2">
              古法玄武石磨，一小时仅得 30g
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Left large text area card */}
            <div className="md:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/30 flex flex-col justify-between shadow-sm group">
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-6">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtgOU3-lrS9a8aJ55ZlJh4jNyD6sQkVzT2nJmxoZBSy8TCdemW6k_D502dc9xr0deU1A0SrbqDV5V4-cNt__PAzykg8p_0n2FmgqRs-2fiB4eZs9nbP4WVz2JakUPi69iJvbzJxVcYx6NGF2rvDlMdERTkeHpRbPPE2IRFnux1qEHqW6M98Y4tmLYCcoFhwjpwJK-SjImKT8tkQOUASzk9Sk2D8Bx-6UIGWR-21l-P_ajyXxFiEm0-OaNxIwBGZIcZ9SLmj_lK7qwq"
                  alt="古石磨磨制"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-on-surface mb-2">
                  温度的严防与茶粉的极细化
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  大体积高能机械设备，在剧烈摩擦中会产生多达 60℃ 以上的高温，这会损坏鲜绿茶粉的活性叶绿素、使香醇尽失。
                  <br />
                  我们使用极其厚重的、手工对纹的花岗岩石磨，置于避光的恒温18℃地窑中。两面石盘微摩擦低速旋转，将干燥的完整叶肉片，缓缓碾轧为微米级的、带有天然静电感的纯正特等茶粉。
                </p>
              </div>
            </div>

            {/* Right smaller blocks */}
            <div className="md:col-span-4 grid grid-rows-2 gap-6">
              <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-center">
                <h4 className="font-serif text-base font-bold text-secondary-container mb-3">
                  自然无添加承诺
                </h4>
                <p className="text-xs text-white/80 leading-relaxed font-sans">
                  Matcha Zen 坚信侘寂原生之美。全系制品无论是纯粉还是乳酪、特饮，均100%拒绝使用防腐化学剂、香精调配，全靠纯抹茶自身微甘之韵支撑。
                </p>
              </div>

              <div className="rounded-3xl overflow-hidden shadow-inner">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQmg6GtobeEqsZC6k3Xs62PGNwQkuxOx7camTbKaoHR_ROIJcVjY6rNkHFAq5s7-glXbOHvOrdcLqs9krIoCBrUoSuqd-zVNRIIPzQVpPgvraA0RjiCRmeWMUr-C_cwmgFMEDPIc-8tQVzLoSGzMLljIq8Jth-rNWmT_5Ffqhcuf4W5rsLNi0EksudMNgESDykpangyknP6NNWpzxm4NOg21K_co-yl4BO86Aby2aE5fYEqas1nproEVH9nBBdwHtOEn6z9D8TNJoJ"
                  alt="茶筅打白沫"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive ritual steps (Zen Tea Whisking Steps) */}
      <section className="py-20 bg-white border-y border-[#c4c8b7]/25 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-primary text-xs font-mono tracking-widest uppercase font-semibold">
              03 • RITUAL STEPS EXPERIENCE
            </span>
            <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-primary mt-2">
              日本点茶仪轨：四步调出一盏玉乳
            </h2>
            <p className="text-xs text-on-surface-variant mt-2.5">
              点击下方互动箭头，领略传统茶师手中化水为乳的至臻境界
            </p>
          </div>

          <div className="relative bg-surface-beige/30 border border-[#c4c8b7]/40 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center min-h-[400px]">
            {/* Left side: Interactive image frame with a sliding dynamic indicator overlay */}
            <div className="w-full md:w-5/12 aspect-square md:aspect-auto md:h-72 rounded-2xl overflow-hidden relative group shadow-inner border border-[#c4c8b7]/15">
              <img
                src={ritualSteps[currentStep].image}
                alt={ritualSteps[currentStep].title}
                className="w-full h-full object-cover transition-all duration-700 transform scale-100 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent flex items-end p-4">
                <span className="text-2xl">{ritualSteps[currentStep].emoji}</span>
              </div>
            </div>

            {/* Right side: Detailed descriptions & arrows */}
            <div className="flex-1 space-y-5 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <span className="font-mono text-[10px] text-primary bg-primary-light/40 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  STAGE 0{currentStep + 1}
                </span>
                <h3 className="font-serif italic text-xl font-bold text-primary leading-tight">
                  {ritualSteps[currentStep].title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed min-h-[96px]">
                  {ritualSteps[currentStep].desc}
                </p>
                <div className="flex items-center gap-1.5 p-3 rounded-xl bg-primary/5 text-primary text-xs border border-primary/10">
                  <span className="text-sm">💡</span>
                  <span className="font-medium font-serif italic text-[11px]">{ritualSteps[currentStep].tips}</span>
                </div>
              </div>

              {/* Progress Stepping Path with pointing arrows */}
              <div className="flex items-center gap-2.5 pt-4 border-t border-[#c4c8b7]/15">
                <div className="flex-1 flex justify-start gap-1">
                  {ritualSteps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 relative group cursor-pointer ${
                        idx === currentStep ? 'w-8 bg-primary' : 'w-2.5 bg-outline-variant/50 hover:bg-primary/50'
                      }`}
                      title={`步骤 ${idx + 1}`}
                    >
                      {/* Interactive hovering helper arrow pointing exactly at the current progress bulb */}
                      {idx === currentStep && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-primary text-[8px] animate-bounce select-none">
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
                    className="disabled:opacity-30 disabled:pointer-events-none group/prev p-2.5 rounded-full border border-primary/25 bg-white text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm disabled:scale-95 cursor-pointer flex items-center justify-center h-10 w-10"
                    title="上一步"
                  >
                    <ArrowLeft className="w-4 h-4 transform group-hover/prev:-translate-x-1 group-disabled/prev:translate-x-0 transition-transform duration-300" />
                  </button>
                  <button
                    disabled={currentStep === ritualSteps.length - 1}
                    onClick={() => setCurrentStep(next => next + 1)}
                    className="disabled:opacity-30 disabled:pointer-events-none group/next p-2.5 rounded-full border border-primary/25 bg-white text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm disabled:scale-95 cursor-pointer flex items-center justify-center h-10 w-10"
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

      {/* Section 4: Store locations cards layout */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <span className="text-primary text-xs font-mono tracking-widest uppercase font-semibold">
              03 • ZEN TEA CHAMBERS
            </span>
            <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-primary mt-1">
              线下城市和风概念茶寮
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant max-w-xs font-sans leading-relaxed">
            在纷繁熙攘的特大城市中心地带，造设一所让人灵魂安顿深思的和风竹影空间。欢迎预订打茶课程。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cafes.map(cafe => (
            <div
              key={cafe.id}
              className="bg-white border border-[#c4c8b7]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-56 relative overflow-hidden group">
                <img
                  src={cafe.image}
                  alt={cafe.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-serif font-bold text-primary shadow-sm">
                  {cafe.city}寮
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-serif text-base font-bold text-on-surface mb-2">
                    {cafe.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant flex items-start gap-1 leading-relaxed min-h-[40px]">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{cafe.address}</span>
                  </p>
                </div>

                <div className="text-[10px] text-outline font-mono space-y-1 pt-1.5 border-t border-[#c4c8b7]/15">
                  <p>营业时段: {cafe.hours}</p>
                  <p>预订专线: {cafe.phone}</p>
                </div>

                {/* Map visual and quick reserve */}
                <div className="grid grid-cols-2 gap-3.5 pt-2">
                  <button
                    onClick={() => alert(`🧭 正在启动地图导航至【${cafe.name}】...\n详细地址: ${cafe.address}`)}
                    className="py-2.5 rounded-xl border border-primary/30 hover:bg-surface-beige text-primary text-xs font-serif font-bold flex items-center justify-center gap-1 spring-click"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    地图导航
                  </button>
                  <button
                    onClick={() => handleBooking(cafe.name)}
                    className="py-2.5 rounded-xl bg-primary text-white text-xs font-serif font-bold hover:opacity-95 flex items-center justify-center gap-1 spring-click"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    预约打席
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Coupon } from './types';
// @ts-ignore
import matchaShavedIce from './assets/images/matcha_shaved_ice_1779841723019.png';
// @ts-ignore
import matchaPearJelly from './assets/images/matcha_pear_jelly_1779841744781.png';

export const products: Product[] = [
  {
    id: 'mille-crepe',
    name: '经典宇治抹茶千层蛋糕',
    enName: 'Matcha Mille Crepe',
    price: 58,
    originalPrice: 68,
    category: 'cakes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy6vIHRQISVc928bPRzbbmAjMX4iTt3LSSA5787R3sQ2WxYYHlSUkkA33I1HfIly3DVAlgs4ifRmuFjusRS3OnTDqkf3uuGGLre_XCrU6I70TxOPEKDI0gKmLX3CKw_-C8QwPTm9ksLqNeX2r6pJlrRQ_ASIcIdnwxL8cV1mL2kHO4Yi2PbXMIYDvHVnm69PSzUr9ZvLqOdq596U27z45bR-m01rr1oa9SnnyB1hK3ydCB9Kz-KAdgebOg6-OauyGZQdmsoZsO5mKl',
    description: '24层手工轻薄法式绉饼，层层夹入香滑细腻的宇治极味茶香奶油，顶部洒有薄罗层纯正抹茶粉，口感极为柔滑，苦甜臻致。',
    tags: ['爆款必点', '纯手工', '少糖'],
    details: {
      ingredients: '宇治抹茶粉（特级A级）、法国进口伊斯尼黄油、本地初生有机鸡蛋、新西兰进口稀奶油、海藻糖。',
      calories: '285 kcal / 100g',
      sugar: '低糖（约8g / 100g）',
      sizeOptions: ['标准切片装', '双人分享装', '6英寸整个生日蛋糕'],
      sweetnessOptions: ['标准（少糖）', '半糖（微苦）']
    },
    subImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgXKCCZAxf3lqjF0nvalkDjdeJm3qZWvf5fMrhYvjQfml4zhhya9rrV207Ob9qQb3PVY8LsEpFjI0IiWD9pXYEDE2mwVSLAYW1EfupgO3nk_aVjW12gN9hM6mv_OzJFn7Q_goUx5z9P4Ugu6mPGsxZoeGpcwQZBLy1faTgzNvbUGO6T2aKRq02KW6o2myLAcBcUaGFqrkJIYYudRA5J0bbUuT9ugZpLT5WWP-NURr20PVe33VpzApVL3v-9fsny_axGmZoAwyUn5sm',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfd87Q33186GQpWptDHQqonM4YyypRQIYiazpapbIWOZ3gVv_lKwXAasBHdvkcFqw7jBGdrq7CeRt9q4Y-KmXeaUhdIjDzse1a2Fnb1AKUhbq_dzDjYgDBgMT-cBsPgGbW6jXTRwWkcuxqN0xWiGZ61vu25owLu8LA9700qhLe6Q7kiSVBWPrHXfU3h8sWBrXZNHdsxJomHpyTOUbGbpp_Fqz4qvxOAbRpGpesHIhPIN_B0xpeBl-q9TcuqyXSbZ7PD9Uvt6h1No6P'
    ],
    pairingIds: ['ceremonial-matcha', 'cold-brew-tea'],
    rating: 4.9,
    reviewsCount: 1240,
    reviews: [
      {
        id: 'r1',
        user: '林夕禅意',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop',
        rating: 5,
        comment: '抹茶的涩感和奶油的香甜绝妙平衡！吃了完全不腻，配上玉露冷泡简直是下午茶神仙搭配。包装超级精致！',
        date: '2026-05-18'
      },
      {
        id: 'r2',
        user: '茶道小林',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop',
        rating: 5,
        comment: '24层做得很工整，奶油和绉层入口即化。抹茶粉看得出分量很足、质量很高。',
        date: '2026-05-15'
      }
    ]
  },
  {
    id: 'sea-salt-foam',
    name: '海盐芝士奶盖抹茶拿铁',
    enName: 'Sea Salt Cheese Foam Matcha Latte',
    price: 32,
    originalPrice: 38,
    category: 'drinks',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNS_QGYv-ZquhytM1GdiubVOjZYSPsiy1IdnpG55VHS36LL_aZV7uKupBVLcet7VxJJbxgSSs0S2ZlcZ8X3wXouy7WjIQ7XRJ_-wRT0_7zY0bMnYT9Mncn3LKBfwrRPEsOQqLy_uLK-N01jjiT5_d0kIOrnsKL7u97wBxiJX1uDRAPiqdUFhpPDL0WLQQCfGTc3bCvJGPV_79DBYwUXv004uDuKyHf97VeLDRBaw5rwIVOyVP8yii9NsnVMhL2VGb3kDUlZKHpP1yP',
    description: '底层的石磨手打高山茶香抹茶，冲入绵密冰牛奶，顶层覆盖以喜马拉雅海盐调配的芝士奶油奶盖，咸甜交织，醇厚浓郁。',
    tags: ['人气王', '现打奶盖', '冷热皆宜'],
    details: {
      ingredients: '一番鲜采有机抹茶粉、新西兰天然干酪、海盐、优质燕麦奶/鲜牛奶可选。',
      calories: '185 kcal / 杯',
      sugar: '标准甜 / 微糖（自选）',
      sweetnessOptions: ['标准甜（微甜）', '三分甜', '不加糖（微苦）'],
      temperatureOptions: ['标准冰（推荐）', '去冰', '温热（不带奶盖，厚重浓厚）']
    },
    subImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtv7EjVQeZY5CfuYJVVOS56euheGvVZQtsbzOUANDPCeOVPL-gBPtO415dCxqc78u20_SKHBxizGRwYv6MRuP8dpsAIjE_jkDYbbaxjyR0QqMZZSl2cAFH5XOmkyS9-LljKVTPSj8waw4vxnAgy_HEokGkNgotDf40kkpR0A8OhI-AygOr6GG1bkg9C8M7SaqPoJP-UDBtOucf_xCPOH-xmMDyUFb1XijZJ5jjAJpEvq6HWWz-kaxp01PzaT_tUGCLRWexLAp3HBAm',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCxS1W_m_sa7c91SiCmyzYlKLsNyqz7essNUAwdqtkb8EQzpDexVof5Ge0Px3Kmk8PeEnS7B4x9xh94LARwmisiLl8-gKx9YIfN4XQDZn2eGbH1YTCvxUBzJEoWdsrl2S6BghsWjTrq3dHwTUY_mSs2qB-uRFd4zzVVwzIdgLx4dWyL5XNRSixsSFv94DMrUTsev4OtZabzYLXN_IYk2VNR79SdJHSc_1vaKHjOh-6DqGFi6y7A8wMnHq6NZXStxlXFLlfK5U8OBE1y'
    ],
    pairingIds: ['zen-macarons', 'cookie-box'],
    rating: 4.8,
    reviewsCount: 890,
    reviews: [
      {
        id: 'r3',
        user: '抹茶控101',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop',
        rating: 5,
        comment: '第一口一定要大口喝奶盖，海盐的微成中和了茶香的微苦，底下抹茶非常香醇！',
        date: '2026-05-19'
      }
    ]
  },
  {
    id: 'zen-macarons',
    name: '禅意手工抹茶马卡龙',
    enName: 'Zen Macarons',
    price: 18,
    category: 'cakes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBpKzehlxlWX_U1qpIRCR642NGM0Uby183QbvUZ22IBvJ4Clf5bC-vm6GW_Rteeg_gIzQCFutNXOxSfADTwI3f3NiQNqQ_lX65QVjlofqCvIXSwrbmiutzorRAZ8OrTUqYTFhecImzMC8SGwFAreaCcEsimDn347dHhPvMGFRxsv0dN669rEar1jdfo7XvW6t_EVmMl6WPdZya5RMyaMQdKfd1AHfZvNWF7ZqZEHqoq_vPgr-VJmKRfSNFY6gLsIVmYDMb8HmyZyvr',
    description: '和风改良版马卡龙，酥脆的淡绿色抹茶杏仁饼壳，夹着略带苦涩、醇厚浓郁的京都高汤松露抹茶甘纳许流心，酥脆而有回甘。',
    tags: ['和风创意', '精致点心', '下午茶精选'],
    details: {
      ingredients: '美国进口超细杏仁粉、宇治浓茶抹茶粉、比利时白巧克力、法式奶油。',
      calories: '110 kcal / 枚',
      sugar: '微甜（较传统法式款减糖40%）',
      sizeOptions: ['1枚单装', '3枚精致尝鲜礼盒装', '6枚尊享装']
    },
    subImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIQ-npEDB2FytoK9mNf2zj03JOotuFCkdOMNVTG9BLrfzjk34wZIjwCjpI95lFal3RfANHhvUo8OneGAxfuYiNgQjY3IeHC5kNQ0FRtu283V8URRPTOjBGC9i-Uj5nv5kHlJwlQL7oWfvhoo_LmB0kGTp40fq74qtFhELzXlq_I4Om1QV0nBpw55tF4tgke5bvjl_o5v3ffUUVMb33CUUbEGeVSdcDBNjZMhpRbK-04-DAmnAPG1cA_C_BVgVXiCANkIQWPQZNKvPU'
    ],
    pairingIds: ['sea-salt-foam', 'hojicha-lat'],
    rating: 4.7,
    reviewsCount: 430,
    reviews: [
      {
        id: 'r4',
        user: '少女阿莉',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&fit=crop',
        rating: 4,
        comment: '总算买到了完全不齁甜的马卡龙！抹茶香特别重，吃完甚至在嘴里有一种绿茶的清气。',
        date: '2026-05-11'
      }
    ]
  },
  {
    id: 'lava-cake',
    name: '宇治抹茶心太软熔岩蛋糕',
    enName: 'Matcha Lava Cake',
    price: 45,
    originalPrice: 52,
    category: 'cakes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSjnm8ptdDhpAWYSZ942FQSqRxWCG6CbrNatC4ctnSRFFHdJkuZlTMnzhkctoM0UBLu4pxRCTk1wClhcXQyY1MowzMgJ1UYJX8qsQaKhLDGjv5VkZGx2gAHM-zvvRl0sf_mT70CTChpNKKwrV_5EWKC4e8M8MDbznltMNStkMNKIBb_wfxM5fUko4AfmQj7R0dZnVwlYxeMfNYqBltYQv7HgECDpkLYczj5U3ggaXAuhkQqFa0oEE8-4prTjWoxUXAaTq-mSlmhtFp',
    description: '外部是质地松软的抹茶蛋糕外皮，切开的刹那，滚烫而鲜艳的抹茶白巧巧克力甘纳许岩浆顺势流下，冰火交织的极奢体验。',
    tags: ['招牌流心', '趁热食用'],
    details: {
      ingredients: '宇治首摘抹茶、比利时进口可可脂、纯天然高蛋白面粉、初榨黄油。',
      calories: '320 kcal / 件',
      sugar: '标准甜度',
      sizeOptions: ['标准切件装', '带香草冰淇淋双拼球']
    },
    subImages: [],
    pairingIds: ['cold-brew-tea'],
    rating: 4.9,
    reviewsCount: 310,
    reviews: []
  },
  {
    id: 'basque-cheese',
    name: '宇治巴斯克重乳酪蛋糕',
    enName: 'Matcha Basque Cheesecake',
    price: 62,
    category: 'cakes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDprcehpYNQfz9jRH8o59z4hK2RRFFUNeIlQhl_ylLf2YbeJKwmtRUobHW5n0VkYJY8MTIgpuknI3F3AdzynW0Ebva9AL0K0zHRUPHgGj8XCs8WH4R9h49BrblR0WkiyVC3Vx63f1M1UDSFTyBEvc_Atm_DSlMjMZaky7LJMRvTo8bZxkYDwucCcjRLvf15zfNXO6-YG_YT_4blwf7xFpPqaiMw7Zp1PcIrmB8vIVLgNCfkN1qO0a6DGFkzZ5vkyaZpNcYnxW_c94SU',
    description: '西班牙巴斯克地区的高温焦皮，内嵌着半熟柔软的、散发着幽微草木香气的抹茶高干酪乳酪湖，芝士控和茶鬼不能错过的灵魂救赎。',
    tags: ['浓郁重芝士', '半熟流心', '新品推荐'],
    details: {
      ingredients: '新西兰凯瑞奶油奶酪、特选浓茶抹茶、新鲜牛奶、海藻糖、新鲜蛋黄。',
      calories: '340 kcal / 100g',
      sugar: '少糖',
      sizeOptions: ['单人标准杯', '4英寸赏味装', '6英寸分享装']
    },
    subImages: [],
    pairingIds: ['hojicha-lat', 'ceremonial-matcha'],
    rating: 4.9,
    reviewsCount: 520,
    reviews: []
  },
  {
    id: 'roll-cake',
    name: '云朵抹茶双面奶油卷',
    enName: 'Matcha Roll Cake',
    price: 38,
    category: 'cakes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8l4ey58yGBbYk0wJut3nRt6Z6WIgrzmzjBULWMp0XLs9fDst24GMpVuBun82GhYRJBz6jGWuaHqZ1IINFjLSXJ76_wI_aW1LIXKj8CzHIG5Y5gEh-e37rx9YWPWudG_uei5tI_6JZ6WGaHa-Hg6sfhit7pEDeNCeikQJyvEP8XrA9waBt5Pnvm-BJJwhqS50v9ogq1uXVFWOv4NwKChLb-UoIPtJZ8ITWJ_T82zRgr81nn0zUf3vJ3pvhLSTR4sUrYHwWEyBDPwm9',
    description: '仿佛天边的云朵，湿润软弹的蓬松戚风抹茶蛋糕胚，大块包裹着北海道优质清爽原味白色奶油，以及抹茶微苦奶油，入口如微风佛面。',
    tags: ['老少咸宜', '经典热销', '轻盈无负担'],
    details: {
      ingredients: '北海道高品质稀奶油、一番宇治浅茶粉、本地农场鲜奶、土鸡蛋。',
      calories: '210 kcal / 切片',
      sugar: '三分微甜',
      sizeOptions: ['厚切单片装', '整卷家庭分享装']
    },
    subImages: [],
    pairingIds: ['cold-brew-tea'],
    rating: 4.8,
    reviewsCount: 1650,
    reviews: []
  },
  {
    id: 'ganache-tart',
    name: '宇治抹茶生硬巧克力挞',
    enName: 'Matcha Ganache Tart',
    price: 32,
    category: 'cakes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1gqyupN3OvnIUmH_8HmCi_V8zrAnsQrZOsMUHJvIk0m5fpGkfiwUM9aItU6JAOHzNepH6qQWbXwXGXcmZZcGfILpLDmA3lVGnOkqcgRSNYgR3NIPI_8m0NMkpaph45jsIzJqFZbYAlagB-HUJA1oFzTT6CfW1MvnS-rSNDb5ANlbSiCPbmsvSwEgqBTHK0H-5vikVpjkWhUOk2HEGqhzsbx5SvCagYcp2LXl9SEKxVYLdT90ysei1erZunrjPj0kwDJvZzqYDJWma',
    description: '法式酥脆黄油甜挞壳，盛装着由日本顶级特香纯抹茶粉和白巧克力配比出的深绿色生巧克力，浓缩了抹茶微甘的原生魅力。',
    tags: ['生巧质感', '酥脆挞底'],
    details: {
      ingredients: '进口顶级黄油甜壳、生巧克力酱、日本宇治首摘特磨抹茶、少许银箔装饰。',
      calories: '240 kcal / 个',
      sugar: '中度微甜',
      sizeOptions: ['单个装', '四枚精制下午茶礼格']
    },
    subImages: [],
    pairingIds: ['ceremonial-matcha'],
    rating: 4.7,
    reviewsCount: 220,
    reviews: []
  },
  {
    id: 'tiramisu',
    name: '京都和风抹茶提拉米苏',
    enName: 'Matcha Tiramisu',
    price: 48,
    category: 'cakes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpywv3GgZevwgQNwWcgRjA5ODG2pjj2lWegu0JKedp_MB1KJ1mVs45CcOiYUjxprMXkdKy-bH4XgjCes2TJtIldP_SCZWhcL8RxjYEvMn_d9_gsd6Ybpg7IRYvfPDQ7D7jaHuR2Th0TuJVFC4xSrFA8E6nNRm4rk-fHFZ5qTdhdQcTDIiLmZOODAg8B-IkDG7C3MI8ad96wtyfG_BEOfgcRPfGk-6wpsIOmVTV5qmiRy7NxXoSkIoAURRRAE28G2xafgjm25VPJRuQ',
    description: '现代香槟杯中装盛的层叠艺术：抹茶清酒浸润过的手指饼干，交替铺上马斯卡彭意大利奶酪，顶端用高等级覆网抹茶粉扑洒出无瑕平面。',
    tags: ['创新酒香', '多重口感', '精巧装皿'],
    details: {
      ingredients: '加尔巴尼珍藏马斯卡彭干酪、抹茶清香利口酒、纯宇治抹茶、手制香草蛋黄。',
      calories: '290 kcal / 杯',
      sugar: '标准甜',
      sizeOptions: ['杯装零售', '双杯情侣套装']
    },
    subImages: [],
    pairingIds: ['cold-brew-tea', 'hojicha-lat'],
    rating: 4.8,
    reviewsCount: 740,
    reviews: []
  },
  {
    id: 'cookie-box',
    name: '宇治特等手工抹茶奇礼盒',
    enName: 'Premium Matcha Cookie Gift Box',
    price: 168,
    originalPrice: 198,
    category: 'gifts',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzyoY8sIluIlB-91gAbeaa325hvcXErM7x1P1qzdr5A7ZWrVSadE3iCR_PUXrm6Cps4ww7ST9vUcWYwSyLPbYxi9nR2h1nD_xPc9q0QtG_Q_zwmvZPiEs3Hy0K0gZa69BGyCynUQudtrdBDjiIxUOf0BKDzPNny-xEJNbXMelFGO4hbtpMPyHKdJtLcqgPEFli_ITKfaaBS9tGOQ4XeNhB0VI-CGSiVQZJZdXkzq-X4UZZsCjecVi_Y3cezp93A5VepESFiQUFJ9v',
    description: '京都老铺手作抹茶风味咸甜黄油曲奇饼干。精美日式亚麻格米黄盒包装，配手写明信片贺卡、纯竹茶拨。高级送礼或自纳好物之选。',
    tags: ['高级茶礼', '手工定制', '顺丰即达'],
    details: {
      ingredients: '特等手磨有机抹茶粉、京都本地竹糖、比利时低卡黄油、纯杏仁脆粒。',
      calories: '45 kcal / 枚',
      sugar: '控纯少糖（5%糖）',
      sizeOptions: ['12枚精致亚麻包装', '24枚双层尊贵珍藏盒（含赠限量竹茶具）']
    },
    subImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC2qpT4sXM8IW4PDdmuNsZkTiSZOsGe3E_Uh6H97pTOVdF5s_dc884MZbRi_xDeyt8TLMh4jBkvR2OjFnFYFgsApEH2nTwe0DjQa5NAU7PLOraTcuZpU2y7WEgaj-2BKbH1BbQS2kp_mBrH8ycYnucR_YVZ9UQ6TXtpqwT2TAVvhgN11fAXoDVZsQjzE8aOjLVQEz9ICsxloe9sVQVa4uP-hm1WHLI3dyie69h3W-yLnyGGhbIl-EzO4vbCCiHnh2q8UuKIV5uFElld',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKK-r6F4WsSbcyLbyxm8tPHlcU9NqZ3GxgvB06qCmgK4QuVyXptGJF8N4yOYNnRhrUiLKOUjBlqMbOZm8Mk9yRnGGNQcPrP_k1HyXyvgDxXLzA1QLH1Gj6DS-1u1UHPL6umkCYdaFlp-Ocr5WDO2QcsIccMJniOjUMlA38uyLGCNOe7g8CPSTYXIYuBFMX7ekqBFHGSSAFqIUg9NdKTulIrcWKS4q0gxBUnSk9B9YjIdndc8nXP3fkv5zUAacCrHZsMn4N4yO15cJ5',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDz8ihuq94XSPecEIa6lJcNfi1Y6xjOzHX8-It04sXipcCxkfO1_WX8wlHFpnMNHegOLeZg38NDlftBdd3zDIopump8ZoSMzcAm09ANapMBAq4tJ9VhPsHgQjIC9ixkjDiL9RdM3XeJICxqyQhz_0xmRI7msDycH6cbBJa0z6yjShQ-zGtaJsJkyMJngnt3rqohMLmaGg7_k0uvh1ONUu093rS_rIO5JuwYMld9L5tzH1yLm7kBd5uuQkauitB5slKB54i8kZZtiKDf'
    ],
    pairingIds: ['cold-brew-tea', 'ceremonial-matcha'],
    rating: 4.95,
    reviewsCount: 380,
    reviews: [
      {
        id: 'r5',
        user: '雅致茶礼',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&fit=crop',
        rating: 5,
        comment: '包装实在太美丽了，打开盒子有一股浓天然茶香扑面而来。曲奇上粗糙的糖霜非常有古风和侘寂感，曲奇本身苏极了，甜度几乎感觉不到，完全是抹茶纯郁。拿来送客户非常拿得出手。',
        date: '2026-05-17'
      }
    ]
  },
  {
    id: 'ceremonial-matcha',
    name: '禅修仪式级手打薄茶',
    enName: 'Ceremonial Matcha Tea',
    price: 35,
    category: 'drinks',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaZk6B8Yd2oleSdSxnKWdRDgT_XwRpkuSly8l_A5GsS7TRz2cGvsVxP7i_E_vao-6ouGDvwqGM4d7Vic-iIfMMiS0hlhlRSyw3zijdqTb3YNikDnuTgHcnlnEbkqSBR2GlanPI7NwRPgdNEr7QyznD5j9k5j7RQuuMXdc1FzqL2CWuTT7V8jLhr2c2xnPxOZN5gg30-S2oVj6xXl_bU0YwfrD5PFe-vr14hOI-iDOyLWuu2BL65TiG1oVaRlw8IqYQqfXB1pMUcMQQ',
    description: '茶寮堂食专属手击薄茶。使用精选黑乐烧茶碗，茶艺师用百年竹制百本立茶筅，在85度天然山泉水中快速击拂出极其绵密的翡翠绿泡沫，茶汤鲜甜起伏。',
    tags: ['手打茶道', '深度茶香', '无糖健康'],
    details: {
      ingredients: '顶级春采覆网一番宇治纯抹茶粉、100%零糖。',
      calories: '15 kcal / 盏',
      sugar: '0 糖',
      sizeOptions: ['标准薄茶碗装', '浓茶（厚重苦涩，需提前预约）']
    },
    subImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuANPlQ-BwVU7Rw-pbwRWL7noSH4pRu6rxrhPtj_KL9IrA_hAc4sSNOi_7nCaT_7mSbsICACxW_bR2he2_j8N5DavcMJcJrRtquERoXZxn6uzdKUbt1SpnQ4LnPSOXKADAuzHmLhHKyAnANjvEt2EqGH3-ltMLDHiO8GDzAMgKqxddido-7lMI0tUYiwC3_wXYoNXMusTM7flMcJLii68GYxEcW9-__zgC_zh2CUpVx0tv1FKr6OU_ePtLI0FUNemHZxbU2S_sszli_S',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCQmg6GtobeEqsZC6k3Xs62PGNwQkuxOx7camTbKaoHR_ROIJcVjY6rNkHFAq5s7-glXbOHvOrdcLqs9krIoCBrUoSuqd-zVNRIIPzQVpPgvraA0RjiCRmeWMUr-C_cwmgFMEDPIc-8tQVzLoSGzMLljIq8Jth-rNWmT_5Ffqhcuf4W5rsLNi0EksudMNgESDykpangyknP6NNWpzxm4NOg21K_co-yl4BO86Aby2aE5fYEqas1nproEVH9nBBdwHtOEn6z9D8TNJoJ'
    ],
    pairingIds: ['mille-crepe', 'basque-cheese'],
    rating: 4.95,
    reviewsCount: 190,
    reviews: []
  },
  {
    id: 'cold-brew-tea',
    name: '精选高山玉露冷泡茶',
    enName: 'Cold Brew Gyokuro Tea',
    price: 28,
    category: 'drinks',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUubVp4ygzDkeNFGcwSLFZO0U3s1phksrXdsJmHiLpxwYEyDJHSpg2XZNpXtlhionrwGLdrl7m5mQS-MHt9TiE5OOYx1ZB5hwpmeWCg9jwFmcFPtIjIAxV4Ep46pVod7AQ44gGbGdizH5nxcW3CVaMrObIXIohlWgRORA1WGNN7EWPGYy9VNnKJMsaate3jOnpgJCPwu3T2CdxsqJmsiihfhKYTKVRONfra6VZHK7qa9PltEsrbYp6c-O1lXNT9LyaxE2PUgCbYT8X',
    description: '京都高山顶尖玉露。用过滤纯净水分装茶叶包，在5℃环境下持续缓慢冷萃24小时。茶色翠绿清洌，茶多酚缓缓析出，没有任何苦涩，清甜舒畅。',
    tags: ['冷萃特供', '清爽回甘', '沁人心脾'],
    details: {
      ingredients: '京都顶级 Gyokuro 玉露茶原叶、高纯冷水。',
      calories: '5 kcal / 瓶',
      sugar: '0 糖'
    },
    subImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuApEvTYuS-_oIJFiX9Q6RzwlkxipMCNbDCmeh2yRn4Y7dDWOzSoJdSIuri5yr-wS14EuPr6V8IuHdRxaRgQazloRb5gHSISBF3RVVW_4nqZmqunGuXMt6pE93luCDFK3TWa5Tj36wHZrB5JXvsq9TxbcmWZm4rcCIHnwAIIkHgv8wf9li2Kp3O0huk9UaSf2Zm2RM95Xvat9QttnklRW8vEjzmPlVM08_OxWxH9QCLIt25oEhXqnfCmJpNCfxQIzkmebn8YmmnSKvDN'
    ],
    pairingIds: ['lava-cake', 'roll-cake'],
    rating: 4.88,
    reviewsCount: 320,
    reviews: []
  },
  {
    id: 'hojicha-lat',
    name: '日式炭焙焙茶冷/热拿铁',
    enName: 'Roasted Hojicha Latte',
    price: 32,
    category: 'drinks',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9skt-zcNqnmx-tfd5_uzm83MDuX5ud_nglR3y5PqfFseWHct6U0cB2vSFEhARlD1bauBjU_lx6CAkFDiXRTu93LUa1TlxfZf1ZtIw--958Pdm203WLW0k6QMFeD6dV5WY3FY8P0TwKklIf0mJNIBZJe6vM6K28AzbE9rmYyKjm4xxexlgyyUr7i40-1EzW-Io-QBZ76w1ygclEiHwqbJRlUDbKB4Gop3jtI1V1oIHkpp6YZif-cxMxNBih8aGjyJp8-CIa4bUnqx9',
    description: '绿茶经红外深度炭火烘焙成为焙茶，大大降低了咖啡因。其自带天然红薯和坚果的焦香，融入绵密发泡牛奶，风味温柔暖融。',
    tags: ['低咖啡因', '炭火焦香', '暖心首选'],
    details: {
      ingredients: '熟焙茶茶粉、优质鲜牛奶或燕麦奶。',
      calories: '160 kcal / 杯',
      sugar: '标准 / 无糖'
    },
    subImages: [],
    pairingIds: ['basque-cheese', 'zen-macarons'],
    rating: 4.75,
    reviewsCount: 260,
    reviews: []
  },
  {
    id: 'autumn-montblanc',
    name: '金秋蜜栗抹茶蒙布朗',
    enName: 'Autumn Chestnut Matcha Mont Blanc',
    price: 68,
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&fit=crop',
    description: '秋季最高人气单品。法式温润板栗泥与京都宇治抹茶奶油在舌尖缠绕，内嵌手剥糖炒甘栗碎与乳酪慕斯底，口感如落叶般绵软醇厚。',
    tags: ['秋季限定新品', '主厨重磅推荐', '日式蒙布朗'],
    details: {
      ingredients: '特选甘栗泥、日本大师级宇治抹茶粉、法国伊斯尼鲜奶油、法式酥硬蛋白糖。',
      calories: '310 kcal / 件',
      sugar: '少糖（控糖配方约10g）',
      sizeOptions: ['单人赏味盒', '4英寸双人分享装']
    },
    subImages: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&fit=crop'
    ],
    pairingIds: ['hojicha-lat', 'ceremonial-matcha'],
    rating: 4.98,
    reviewsCount: 147,
    reviews: [
      {
        id: 'ra1',
        user: '秋色无边',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop',
        rating: 5,
        comment: '板栗泥超级绵密！抹茶的微苦正好中和了板栗的多余甜度，上面还撒了丹桂碎，实在是太有秋天氛围了，太喜欢了！',
        date: '2026-05-26'
      }
    ]
  },
  {
    id: 'autumn-parfait',
    name: '枫糖红薯抹茶芭菲',
    enName: 'Maple Yam Matcha Parfait',
    price: 52,
    category: 'icecream',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&fit=crop',
    description: '焦糖香烤红薯泥的温润甘甜，铺垫手打宇治抹茶冰淇淋，浇上加拿大纯质枫糖浆与香浓手工燕麦脆片，冷暖相融，层次分明，妙趣横生。',
    tags: ['秋季限定新品', '双重冰淇淋', '香甜软糯'],
    details: {
      ingredients: '精选糖心红薯泥、纯度99%枫树落糖、特级宇治抹茶粉、进口香草巴菲。',
      calories: '265 kcal / 杯',
      sugar: '标准微甜'
    },
    subImages: [],
    pairingIds: ['cold-brew-tea'],
    rating: 4.9,
    reviewsCount: 96,
    reviews: []
  },
  {
    id: 'autumn-latte',
    name: '桂雨丹枫桂花抹茶拿铁',
    enName: 'Sweet Osmanthus Matcha Latte',
    price: 36,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&fit=crop',
    description: '江南手作金桂蜜露，撞入沁甜厚鲜乳，缓缓注入一番宇治手打薄茶。馥郁的金色桂花香与微苦茶香完美交融，一口便如置身江南金秋桂雨。',
    tags: ['秋季限定新品', '经典桂香', '清甜回甘'],
    details: {
      ingredients: '当季金桂蜜露、特磨宇治抹茶、鲜牛乳/厚燕麦奶自选、轻盈奶泡。',
      calories: '150 kcal / 杯',
      sugar: '标准甜 / 去糖（只留桂花蜜香）',
      sweetnessOptions: ['标准甜（微甜）', '仅留桂蜜香（少糖）', '无桂蜜鲜茶拿铁'],
      temperatureOptions: ['标准冰', '热饮（秋季推荐，暖胃更馨香）']
    },
    subImages: [],
    pairingIds: ['autumn-montblanc', 'zen-macarons'],
    rating: 4.92,
    reviewsCount: 184,
    reviews: []
  },
  {
    id: 'autumn-fuying-shavedice',
    name: '霜覆枫影京都抹茶刨冰',
    enName: 'Autumn Maple Premium Shaved Ice',
    price: 58,
    category: 'icecream',
    image: matchaShavedIce,
    description: '秋季极上冰霜。超细羽毛棉刨冰，淋上浓郁手打宇治抹茶凝膏与特级生牛乳炼乳，点缀暖心炒栗子泥、极寒冷藏红豆沙与枫叶糯米糍，口口冰凉清雅。',
    tags: ['秋季限定新品', '特浓冰敷', '宇治极上刨冰'],
    details: {
      ingredients: '羽毛纯水刨冰、顶级宇治小森茶、精熬红豆沙、枫叶糯糯丸子、糖炒甘栗。',
      calories: '220 kcal / 碗',
      sugar: '标准甜 / 少甜 / 无额外炼乳',
      sizeOptions: ['标准双人深品大碗装', '单人精致冰爵盏'],
      sweetnessOptions: ['标准甜 (口感温和)', '少甜 (特浓茶感)', '无甜 (微带苦涩)']
    },
    subImages: [],
    pairingIds: ['autumn-osmanthus-pear', 'hojicha-lat'],
    rating: 4.95,
    reviewsCount: 112,
    reviews: [
      {
        id: 'ri1',
        user: '冷品爱好者',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop',
        rating: 5,
        comment: '即便秋凉也无法抗拒！这款抹茶冰极其细腻，入口即化，一点冰渣都没有，搭配上面的软糯栗泥简直绝配！',
        date: '2026-05-26'
      }
    ]
  },
  {
    id: 'autumn-osmanthus-pear',
    name: '冰酿桂花秋梨抹茶冻',
    enName: 'Chilled Sweet Osmanthus Pear & Matcha Gelée',
    price: 45,
    category: 'cakes',
    image: matchaPearJelly,
    description: '晶莹清润，极度消暑冰敷。下层为京都薄茶冷凝结成的弹嫩抹茶冻，上层为川贝冰糖慢炖的秋梨果肉水晶冻，顶部淋上冰镇手工金桂蜜、晶莹剔透，入口沁心。',
    tags: ['秋季限定新品', '清润冰晶', '控糖养生'],
    details: {
      ingredients: '精选砀山酥梨、古法桂花蜜糖、特级宇治抹茶粉、寒天晶球。',
      calories: '110 kcal / 杯',
      sugar: '淡淡桂蜜微甜（控糖友好）',
      sizeOptions: ['标准双层冷凝杯', '家庭分享罐'],
      temperatureOptions: ['冰镇冰温（推荐极致澄澈）', '常温弹滑']
    },
    subImages: [],
    pairingIds: ['autumn-montblanc', 'cold-brew-tea'],
    rating: 4.89,
    reviewsCount: 78,
    reviews: []
  },
  {
    id: 'autumn-affogato',
    name: '冰竹岩抹茶阿芙佳朵',
    enName: 'Cold Bamboo Matcha Affogato',
    price: 48,
    category: 'icecream',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&fit=crop',
    description: '冰火交织极品！手作优质浓缩生牛乳冰淇淋雕刻成绿竹形态置于冰盘，现场淋入滚烫如翡翠般、散发海苔清香的极浓手打御前抹茶液，冰淇淋渐渐融化，极具视觉冲击。',
    tags: ['秋季限定新品', '网红打卡首选', '冰火交错甜点'],
    details: {
      ingredients: '北海道重瓣牛乳冰淇淋、一番御前宇治抹茶（80目极细石磨）。',
      calories: '280 kcal / 盆',
      sugar: '茶液无糖，冰淇淋标准甜度',
      temperatureOptions: ['绝热极冰 (经典冰淇淋盆浴)', '微温交融']
    },
    subImages: [],
    pairingIds: ['autumn-fuying-shavedice', 'matcha-mille'],
    rating: 4.97,
    reviewsCount: 230,
    reviews: []
  }
];

export const coupons: Coupon[] = [
  {
    code: 'MATCHA88',
    discount: 20,
    type: 'flat',
    minSpend: 100,
    description: '满¥100立减¥20 (特惠尝鲜券)'
  },
  {
    code: 'ZENSHENG',
    discount: 50,
    type: 'flat',
    minSpend: 250,
    description: '礼赠季大额尊享券满¥250立减¥50'
  },
  {
    code: 'FREESHIP',
    discount: 10,
    type: 'flat',
    minSpend: 40,
    description: '下单冷链必达立减¥10'
  }
];

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  enName: string;
  price: number;
  originalPrice?: number;
  category: 'cakes' | 'drinks' | 'icecream' | 'gifts';
  image: string;
  description: string;
  tags: string[];
  details: {
    ingredients: string;
    calories: string;
    sugar: string;
    sizeOptions?: string[];
    sweetnessOptions?: string[];
    temperatureOptions?: string[];
  };
  subImages: string[];
  pairingIds: string[];
  rating: number;
  reviewsCount: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  id: string; // Unique combination of product.id + options
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedSweetness?: string;
  selectedTemperature?: string;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
  date: string;
  timeSlot: string;
  giftCardMessage: string;
  ecoPacking: boolean;
}

export interface Coupon {
  code: string;
  discount: number; // Flat discount value e.g. 20
  type: 'flat' | 'percentage';
  minSpend: number;
  description: string;
}

export type ViewType = 'home' | 'catalog' | 'autumn' | 'story' | 'cart' | 'detail' | 'checkout' | 'payment' | 'showroom' | 'cakelab';

export type PaymentMethod = 'wechat' | 'alipay' | 'card';


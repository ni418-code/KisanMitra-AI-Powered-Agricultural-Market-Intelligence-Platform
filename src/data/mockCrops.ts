import { CropMaster } from '../types';

export const MOCK_CROPS: CropMaster[] = [
  {
    id: 'tomato',
    name: 'Tomato',

    localNames: {
      en: 'Tomato',
      te: 'టమాట (Tomato)',
      hi: 'टमाटर (Tamatar)',
      ta: 'தக்காளி (Thakkali)',
      mr: 'टोमॅटो (Tomato)',
    },

    category: 'Vegetables',

    image:
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',

    defaultUnit: 'kg',

    // Tomato does not have a statutory central MSP
    mspPrice: null,

    marketPrice: 30,
    pricePerQuintal: 3000,

    lastUpdated: 'Today, 10:30 AM',

    nearbyMarkets: [
      {
        name: 'Kolar Market',
        price: 30,
      },
      {
        name: 'Vijayapura Market',
        price: 31,
      },
      {
        name: 'Bengaluru APMC',
        price: 32,
      },
      {
        name: 'Tumakuru Yard',
        price: 29,
      },
    ],

    description:
      'Fresh farm-gate tomatoes suitable for retail and processing. High pulp content, firm skin.',
  },

  {
    id: 'chilli',
    name: 'Green Chilli',

    localNames: {
      en: 'Green Chilli',
      te: 'పచ్చిమిర్చి (Pachimirchi)',
      hi: 'हरी मिर्च (Hari Mirch)',
      ta: 'பச்சை மிளகாய் (Pachai Milagai)',
      mr: 'हिरवी मिरची (Hirvi Mirchi)',
    },

    category: 'Spices',

    image:
      'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',

    defaultUnit: 'kg',

    // No statutory central MSP
    mspPrice: null,

    marketPrice: 85,
    pricePerQuintal: 8500,

    lastUpdated: 'Today, 10:30 AM',

    nearbyMarkets: [
      {
        name: 'Guntur Spices Yard',
        price: 88,
      },
      {
        name: 'Byadgi Market',
        price: 86,
      },
      {
        name: 'Bengaluru APMC',
        price: 85,
      },
      {
        name: 'Kolar Yard',
        price: 84,
      },
    ],

    description:
      'Pungent, dark green chillies with high shelf life, sorted and cleaned at farm-gate.',
  },

  {
    id: 'onion',
    name: 'Red Onion',

    localNames: {
      en: 'Red Onion',
      te: 'ఉల్లిపాయ (Ullipaya)',
      hi: 'लाल प्याज (Lal Pyaz)',
      ta: 'வெங்காயம் (Vengayam)',
      mr: 'कांदा (Kanda)',
    },

    category: 'Vegetables',

    image:
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',

    defaultUnit: 'kg',

    mspPrice: null,

    marketPrice: 28,
    pricePerQuintal: 2800,

    lastUpdated: 'Today, 10:30 AM',

    nearbyMarkets: [
      {
        name: 'Lasalgaon Mandi',
        price: 29,
      },
      {
        name: 'Bengaluru APMC',
        price: 28,
      },
      {
        name: 'Hubli Yard',
        price: 27,
      },
      {
        name: 'Kolar Market',
        price: 28,
      },
    ],

    description:
      'Medium to large size cured red onions with tight skins, low moisture, high storability.',
  },

  {
    id: 'paddy',
    name: 'Paddy (Basmati / Sona Masoori)',

    localNames: {
      en: 'Paddy / Rice',
      te: 'వరి ధాన్యం (Vari Dhanyam)',
      hi: 'धान (Dhan)',
      ta: 'நெல் (Nel)',
      mr: 'भात / धान (Bhaat)',
    },

    category: 'Grains',

    image:
      'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80',

    defaultUnit: 'quintal',

    // MSP represented per kg
    // ₹2,300 per quintal = ₹23 per kg
    mspPrice: 23,

    marketPrice: 24,
    pricePerQuintal: 2400,

    lastUpdated: 'Today, 10:30 AM',

    nearbyMarkets: [
      {
        name: 'Karnal Grain Market',
        price: 25,
      },
      {
        name: 'Mandya Rice Yard',
        price: 24,
      },
      {
        name: 'Raichur APMC',
        price: 24,
      },
      {
        name: 'Bengaluru Yard',
        price: 26,
      },
    ],

    description:
      'Well-dried grain with under 14% moisture content, directly bagged from farm harvest.',
  },

  {
    id: 'potato',
    name: 'Potato',

    localNames: {
      en: 'Potato',
      te: 'బంగాళాదుంప (Bangaladumpa)',
      hi: 'आलू (Aloo)',
      ta: 'உருளைக்கிழங்கு (Urulaikizhangu)',
      mr: 'बटाटा (Batata)',
    },

    category: 'Vegetables',

    image:
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',

    defaultUnit: 'kg',

    mspPrice: null,

    marketPrice: 22,
    pricePerQuintal: 2200,

    lastUpdated: 'Today, 10:30 AM',

    nearbyMarkets: [
      {
        name: 'Hassan Market',
        price: 22,
      },
      {
        name: 'Agra Mandi',
        price: 21,
      },
      {
        name: 'Bengaluru APMC',
        price: 23,
      },
    ],

    description:
      'Cleaned, graded Jyoti and Chipsona varieties suitable for bulk wholesale and snacking.',
  },

  {
    id: 'maize',
    name: 'Maize / Corn',

    localNames: {
      en: 'Maize / Corn',
      te: 'మొక్కజొన్న (Mokkajonna)',
      hi: 'मक्का (Makka)',
      ta: 'மக்காச்சோளம் (Makkacholam)',
      mr: 'मका (Maka)',
    },

    category: 'Grains',

    image:
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',

    defaultUnit: 'quintal',

    // MSP represented per kg
    // ₹2,225 per quintal = ₹22.25 per kg
    mspPrice: 22.25,

    marketPrice: 24.5,
    pricePerQuintal: 2450,

    lastUpdated: 'Today, 10:30 AM',

    nearbyMarkets: [
      {
        name: 'Davanagere APMC',
        price: 24.5,
      },
      {
        name: 'Chhindwara Mandi',
        price: 23.8,
      },
      {
        name: 'Bengaluru Yard',
        price: 25,
      },
    ],

    description:
      'Yellow feed and starch grade maize, sun-dried on clean threshing yards.',
  },

  {
    id: 'cabbage',
    name: 'Green Cabbage',

    localNames: {
      en: 'Cabbage',
      te: 'క్యాబేజీ (Cabbage)',
      hi: 'पत्ता गोभी (Patta Gobhi)',
      ta: 'முட்டைக்கோஸ் (Muttaikkos)',
      mr: 'कोबी (Kobi)',
    },

    category: 'Vegetables',

    image:
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',

    defaultUnit: 'kg',

    mspPrice: null,

    marketPrice: 18,
    pricePerQuintal: 1800,

    lastUpdated: 'Today, 10:30 AM',

    nearbyMarkets: [
      {
        name: 'Ooty Veg Market',
        price: 19,
      },
      {
        name: 'Belagavi APMC',
        price: 17.5,
      },
      {
        name: 'Bengaluru APMC',
        price: 18.5,
      },
    ],

    description:
      'Compact green heads, harvested fresh in the early morning for maximum crispness.',
  },
];
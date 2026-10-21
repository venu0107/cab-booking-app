import { CityConfig, CityId, LocationPoint, RideOption } from '@/types';

export const INDIAN_CITIES: Record<CityId, CityConfig> = {
  bengaluru: {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    center: { lat: 12.9716, lng: 77.5946 },
    defaultPickup: {
      name: 'MG Road Metro Station',
      address: 'MG Road, Shivaji Nagar, Bengaluru, Karnataka',
      coordinates: { lat: 12.9756, lng: 77.6066 },
    },
    defaultDropoff: {
      name: 'Indiranagar 100ft Road',
      address: '100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru',
      coordinates: { lat: 12.9719, lng: 77.6412 },
    },
    presets: [
      {
        name: 'MG Road Metro Station',
        address: 'MG Road, Shivaji Nagar, Bengaluru, Karnataka',
        coordinates: { lat: 12.9756, lng: 77.6066 },
      },
      {
        name: 'Indiranagar 100ft Road',
        address: '100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru',
        coordinates: { lat: 12.9719, lng: 77.6412 },
      },
      {
        name: 'Koramangala Sony World Signal',
        address: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
        coordinates: { lat: 12.9345, lng: 77.6266 },
      },
      {
        name: 'Kempegowda International Airport (BLR)',
        address: 'KIAL Road, Devanahalli, Bengaluru',
        coordinates: { lat: 13.1986, lng: 77.7066 },
      },
      {
        name: 'Whitefield ITPL Tech Park',
        address: 'International Tech Park, Whitefield, Bengaluru',
        coordinates: { lat: 12.9863, lng: 77.7329 },
      },
      {
        name: 'HSR Layout BDA Complex',
        address: 'Sector 6, HSR Layout, Bengaluru',
        coordinates: { lat: 12.9116, lng: 77.6389 },
      },
    ],
  },
  mumbai: {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    center: { lat: 19.076, lng: 72.8777 },
    defaultPickup: {
      name: 'Bandra Kurla Complex (BKC)',
      address: 'G Block BKC, Bandra East, Mumbai, Maharashtra',
      coordinates: { lat: 19.0657, lng: 72.8687 },
    },
    defaultDropoff: {
      name: 'Marine Drive & Nariman Point',
      address: 'Netaji Subhash Chandra Bose Road, Mumbai',
      coordinates: { lat: 18.9256, lng: 72.8242 },
    },
    presets: [
      {
        name: 'Bandra Kurla Complex (BKC)',
        address: 'G Block BKC, Bandra East, Mumbai',
        coordinates: { lat: 19.0657, lng: 72.8687 },
      },
      {
        name: 'Chhatrapati Shivaji Maharaj Airport (T2)',
        address: 'Sahar, Andheri East, Mumbai',
        coordinates: { lat: 19.0896, lng: 72.8656 },
      },
      {
        name: 'Marine Drive & Nariman Point',
        address: 'Netaji Subhash Chandra Bose Road, Mumbai',
        coordinates: { lat: 18.9256, lng: 72.8242 },
      },
      {
        name: 'Dadar TT Circle',
        address: 'Dadar East, Mumbai, Maharashtra',
        coordinates: { lat: 19.0178, lng: 72.8478 },
      },
      {
        name: 'Hiranandani Powai',
        address: 'Central Ave, Hiranandani Gardens, Powai, Mumbai',
        coordinates: { lat: 19.1197, lng: 72.9056 },
      },
    ],
  },
  delhi: {
    id: 'delhi',
    name: 'Delhi NCR',
    state: 'Delhi',
    center: { lat: 28.6139, lng: 77.209 },
    defaultPickup: {
      name: 'Connaught Place (Rajiv Chowk)',
      address: 'Inner Circle, Connaught Place, New Delhi',
      coordinates: { lat: 28.6328, lng: 77.2197 },
    },
    defaultDropoff: {
      name: 'Cyber Hub Gurugram',
      address: 'DLF Cyber City, Phase 2, Gurugram, Haryana',
      coordinates: { lat: 28.4952, lng: 77.0891 },
    },
    presets: [
      {
        name: 'Connaught Place (Rajiv Chowk)',
        address: 'Inner Circle, Connaught Place, New Delhi',
        coordinates: { lat: 28.6328, lng: 77.2197 },
      },
      {
        name: 'IGI Airport Terminal 3',
        address: 'Indira Gandhi International Airport, New Delhi',
        coordinates: { lat: 28.5562, lng: 77.1000 },
      },
      {
        name: 'Cyber Hub Gurugram',
        address: 'DLF Cyber City, Phase 2, Gurugram, Haryana',
        coordinates: { lat: 28.4952, lng: 77.0891 },
      },
      {
        name: 'India Gate & Kartavya Path',
        address: 'Rajpath, India Gate, New Delhi',
        coordinates: { lat: 28.6129, lng: 77.2295 },
      },
      {
        name: 'Noida Sector 18 Metro',
        address: 'Sector 18, Noida, Uttar Pradesh',
        coordinates: { lat: 28.5708, lng: 77.3261 },
      },
    ],
  },
  hyderabad: {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    center: { lat: 17.385, lng: 78.4867 },
    defaultPickup: {
      name: 'HITEC City Cyber Towers',
      address: 'Madhapur, HITEC City, Hyderabad, Telangana',
      coordinates: { lat: 17.4504, lng: 78.3808 },
    },
    defaultDropoff: {
      name: 'Jubilee Hills Check Post',
      address: 'Road No. 36, Jubilee Hills, Hyderabad',
      coordinates: { lat: 17.4319, lng: 78.4073 },
    },
    presets: [
      {
        name: 'HITEC City Cyber Towers',
        address: 'Madhapur, HITEC City, Hyderabad',
        coordinates: { lat: 17.4504, lng: 78.3808 },
      },
      {
        name: 'Rajiv Gandhi International Airport (RGIA)',
        address: 'Shamshabad, Hyderabad, Telangana',
        coordinates: { lat: 17.2403, lng: 78.4294 },
      },
      {
        name: 'Jubilee Hills Check Post',
        address: 'Road No. 36, Jubilee Hills, Hyderabad',
        coordinates: { lat: 17.4319, lng: 78.4073 },
      },
      {
        name: 'Charminar Historical Monument',
        address: 'Char Kaman, Ghansi Bazaar, Hyderabad',
        coordinates: { lat: 17.3616, lng: 78.4747 },
      },
      {
        name: 'Gachibowli DLF Cyber City',
        address: 'Gachibowli, Hyderabad, Telangana',
        coordinates: { lat: 17.4435, lng: 78.3582 },
      },
    ],
  },
  visakhapatnam: {
    id: 'visakhapatnam',
    name: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    center: { lat: 17.6868, lng: 83.2185 },
    defaultPickup: {
      name: 'RK Beach (Ramakrishna Beach)',
      address: 'Beach Road, Visakhapatnam, Andhra Pradesh',
      coordinates: { lat: 17.7109, lng: 83.3079 },
    },
    defaultDropoff: {
      name: 'MVP Colony Bus Stop',
      address: 'MVP Colony, Visakhapatnam, Andhra Pradesh',
      coordinates: { lat: 17.7301, lng: 83.3101 },
    },
    presets: [
      {
        name: 'RK Beach (Ramakrishna Beach)',
        address: 'Beach Road, Visakhapatnam, Andhra Pradesh',
        coordinates: { lat: 17.7109, lng: 83.3079 },
      },
      {
        name: 'Visakhapatnam Airport (VTZ)',
        address: 'Bheemunipatnam, Visakhapatnam, Andhra Pradesh',
        coordinates: { lat: 17.7212, lng: 83.2245 },
      },
      {
        name: 'MVP Colony Sector-8',
        address: 'MVP Colony, Visakhapatnam, Andhra Pradesh',
        coordinates: { lat: 17.7301, lng: 83.3101 },
      },
      {
        name: 'Rushikonda Beach & IT Park',
        address: 'Rushikonda, Visakhapatnam, Andhra Pradesh',
        coordinates: { lat: 17.7643, lng: 83.3782 },
      },
      {
        name: 'Steel Plant Main Gate (RINL)',
        address: 'Steel Plant Township, Visakhapatnam',
        coordinates: { lat: 17.6744, lng: 83.2177 },
      },
      {
        name: 'Vizag Railway Station (VSKP)',
        address: 'Railway Station Road, Dwaraka Nagar, Visakhapatnam',
        coordinates: { lat: 17.7104, lng: 83.2972 },
      },
    ],
  },
};

export const RIDE_OPTIONS: RideOption[] = [
  {
    id: 'auto',
    name: 'Auto Rickshaw',
    description: 'No meter hassle, direct doorstep pickup',
    baseFare: 30,
    perKmRate: 15,
    perMinuteRate: 1.5,
    capacity: 3,
    iconName: 'Auto',
    etaMinutes: 2,
    multiplier: 1.0,
    popular: true,
  },
  {
    id: 'bike',
    name: 'Bike Taxi',
    description: 'Fastest way to beat city traffic (Helmet provided)',
    baseFare: 20,
    perKmRate: 9,
    perMinuteRate: 1.0,
    capacity: 1,
    iconName: 'Bike',
    etaMinutes: 1,
    multiplier: 0.65,
  },
  {
    id: 'mini',
    name: 'Cab Mini',
    description: 'Comfy AC hatchbacks (WagonR / Indica / Swift)',
    baseFare: 60,
    perKmRate: 16,
    perMinuteRate: 2.0,
    capacity: 4,
    iconName: 'Car',
    etaMinutes: 4,
    multiplier: 1.2,
  },
  {
    id: 'sedan',
    name: 'Prime Sedan',
    description: 'Top-rated drivers in spacious sedans (Dzire / Etios)',
    baseFare: 90,
    perKmRate: 20,
    perMinuteRate: 2.5,
    capacity: 4,
    iconName: 'Sparkles',
    etaMinutes: 5,
    multiplier: 1.5,
  },
  {
    id: 'suv',
    name: 'Prime SUV (XL)',
    description: '6-seater spacious SUVs (Innova / Ertiga)',
    baseFare: 150,
    perKmRate: 26,
    perMinuteRate: 3.5,
    capacity: 6,
    iconName: 'Truck',
    etaMinutes: 6,
    multiplier: 2.0,
  },
];

export const PROMO_CODES: Record<string, { type: 'percent' | 'flat'; value: number; maxDiscount?: number }> = {
  DESI50: { type: 'percent', value: 50, maxDiscount: 100 },
  NAMASTE: { type: 'flat', value: 75 },
  AUTO20: { type: 'percent', value: 20, maxDiscount: 40 },
  FIRSTTRIP: { type: 'flat', value: 60 },
  SAVE25: { type: 'percent', value: 25, maxDiscount: 80 },
};

export const MOCK_DRIVERS = [
  {
    id: 'drv-01',
    name: 'Ramesh Gowda',
    phone: '+91 98451 23456',
    rating: 4.96,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    vehicle: 'Bajaj Compact Auto • Green/Yellow',
    plate: 'KA 01 MJ 4321',
  },
  {
    id: 'drv-02',
    name: 'Rajesh Sharma',
    phone: '+91 98112 34567',
    rating: 4.92,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    vehicle: 'Maruti Suzuki Dzire • White',
    plate: 'DL 3C AB 8901',
  },
  {
    id: 'drv-03',
    name: 'Mohammed Arif',
    phone: '+91 97401 98765',
    rating: 4.98,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    vehicle: 'Toyota Innova Crysta • Silver',
    plate: 'KA 05 EQ 7890',
  },
  {
    id: 'drv-04',
    name: 'Sunita Patil',
    phone: '+91 99201 12345',
    rating: 4.95,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    vehicle: 'Maruti Suzuki WagonR CNG • Silver',
    plate: 'MH 02 BG 3456',
  },
];

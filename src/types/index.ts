export type UserRole = 'rider' | 'driver';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
  role: UserRole;
  rating?: number;
  totalTrips?: number;
  vehicleDetails?: {
    model: string;
    plate: string;
    color: string;
    type: RideTier;
  };
}

export type RideTier = 'auto' | 'bike' | 'mini' | 'sedan' | 'suv';

export interface RideOption {
  id: RideTier;
  name: string;
  description: string;
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  capacity: number;
  iconName: string;
  etaMinutes: number;
  multiplier: number;
  popular?: boolean;
}

export type CityId = 'bengaluru' | 'mumbai' | 'delhi' | 'hyderabad' | 'visakhapatnam';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  avatarUrl?: string;
}

export interface CityConfig {
  id: CityId;
  name: string;
  state: string;
  center: Coordinates;
  defaultPickup: LocationPoint;
  defaultDropoff: LocationPoint;
  presets: LocationPoint[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationPoint {
  address: string;
  coordinates: Coordinates;
  name?: string;
}

export interface Waypoint {
  id: string;
  address: string;
  coordinates: Coordinates;
}

export type RideStatus =
  | 'idle'
  | 'searching'
  | 'driver_assigned'
  | 'arriving'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface ActiveRide {
  id: string;
  riderId: string;
  riderName: string;
  riderPhone: string;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  waypoints: Waypoint[];
  tier: RideTier;
  tierName: string;
  status: RideStatus;
  fare: number;
  distanceKm: number;
  durationMinutes: number;
  driver?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    avatarUrl: string;
    vehicle: string;
    plate: string;
    currentLocation: Coordinates;
  };
  promoCode?: string;
  discount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
  completedAt?: string;
  sosTriggered?: boolean;
  rating?: number;
  review?: string;
}

export type PaymentMethod = 'upi' | 'cash' | 'card' | 'netbanking';

export interface SupportTicket {
  id: string;
  userId: string;
  rideId?: string;
  category: 'lost_item' | 'fare_dispute' | 'safety' | 'driver_feedback' | 'other';
  subject: string;
  message: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
}

'use client';

import { ActiveRide, SupportTicket, UserProfile } from '@/types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const RIDER_KEY = 'apex_rider_profile';
const DRIVER_KEY = 'apex_driver_profile';
const ACTIVE_RIDE_KEY = 'apex_active_ride';
const RIDE_HISTORY_KEY = 'apex_ride_history';
const TICKETS_KEY = 'apex_support_tickets';

export const defaultRider: UserProfile = {
  id: 'usr-rider-001',
  email: 'arjun.verma@example.in',
  fullName: 'Arjun Verma',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  role: 'rider',
  rating: 4.96,
  totalTrips: 58,
};

export const defaultDriver: UserProfile = {
  id: 'usr-driver-001',
  email: 'ramesh.gowda@bharatride.in',
  fullName: 'Ramesh Gowda',
  phone: '+91 98451 23456',
  avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  role: 'driver',
  rating: 4.98,
  totalTrips: 2430,
  vehicleDetails: {
    model: 'Bajaj RE Auto',
    plate: 'KA 01 MJ 4321',
    color: 'Green & Yellow',
    type: 'auto',
  },
};

export function getRiderProfile(): UserProfile {
  if (typeof window === 'undefined') return defaultRider;
  const stored = localStorage.getItem(RIDER_KEY);
  if (!stored) {
    localStorage.setItem(RIDER_KEY, JSON.stringify(defaultRider));
    return defaultRider;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultRider;
  }
}

export function saveRiderProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RIDER_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event('apex_profile_updated'));
}

export function getDriverProfile(): UserProfile {
  if (typeof window === 'undefined') return defaultDriver;
  const stored = localStorage.getItem(DRIVER_KEY);
  if (!stored) {
    localStorage.setItem(DRIVER_KEY, JSON.stringify(defaultDriver));
    return defaultDriver;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultDriver;
  }
}

export function saveDriverProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DRIVER_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event('apex_profile_updated'));
}

export function getActiveRide(): ActiveRide | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(ACTIVE_RIDE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveActiveRide(ride: ActiveRide | null): void {
  if (typeof window === 'undefined') return;
  if (!ride) {
    localStorage.removeItem(ACTIVE_RIDE_KEY);
  } else {
    localStorage.setItem(ACTIVE_RIDE_KEY, JSON.stringify(ride));
  }
  window.dispatchEvent(new CustomEvent('apex_ride_updated', { detail: ride }));

  // If Supabase is connected, optionally sync asynchronously
  if (isSupabaseConfigured && supabase && ride) {
    Promise.resolve(
      supabase
        .from('rides')
        .upsert({
          id: ride.id,
          pickup_address: ride.pickup.address,
          pickup_lat: ride.pickup.coordinates.lat,
          pickup_lng: ride.pickup.coordinates.lng,
          dropoff_address: ride.dropoff.address,
          dropoff_lat: ride.dropoff.coordinates.lat,
          dropoff_lng: ride.dropoff.coordinates.lng,
          waypoints: ride.waypoints,
          tier: ride.tier,
          status: ride.status,
          fare: ride.fare,
          distance_km: ride.distanceKm,
          duration_minutes: ride.durationMinutes,
          promo_code: ride.promoCode,
          discount: ride.discount,
          payment_method: ride.paymentMethod,
          payment_status: ride.paymentStatus,
          driver_location: ride.driver?.currentLocation,
          rating: ride.rating,
          review: ride.review,
          sos_triggered: ride.sosTriggered,
        })
    )
      .then(({ error }: { error?: { message: string } | null }) => {
        if (error) console.warn('Supabase sync notice:', error.message);
      })
      .catch(() => {});
  }
}

export function getRideHistory(): ActiveRide[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(RIDE_HISTORY_KEY);
  if (!stored) {
    // Populate with 2 initial mock past trips for instant rich history view
    const initialHistory: ActiveRide[] = [
      {
        id: 'trip-past-101',
        riderId: defaultRider.id,
        riderName: defaultRider.fullName,
        riderPhone: defaultRider.phone,
        pickup: {
          name: 'MG Road Metro Station',
          address: 'MG Road, Shivaji Nagar, Bengaluru',
          coordinates: { lat: 12.9756, lng: 77.6066 },
        },
        dropoff: {
          name: 'Indiranagar 100ft Road',
          address: '100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru',
          coordinates: { lat: 12.9719, lng: 77.6412 },
        },
        waypoints: [],
        tier: 'auto',
        tierName: 'Auto Rickshaw',
        status: 'completed',
        fare: 85,
        distanceKm: 3.8,
        durationMinutes: 14,
        driver: {
          id: 'drv-01',
          name: 'Ramesh Gowda',
          phone: '+91 98451 23456',
          rating: 4.96,
          avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
          vehicle: 'Bajaj Compact Auto • Green/Yellow',
          plate: 'KA 01 MJ 4321',
          currentLocation: { lat: 12.9719, lng: 77.6412 },
        },
        discount: 0,
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        completedAt: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
        rating: 5,
        review: 'Quick pickup, polite driver and exact meter fare via UPI!',
      },
      {
        id: 'trip-past-102',
        riderId: defaultRider.id,
        riderName: defaultRider.fullName,
        riderPhone: defaultRider.phone,
        pickup: {
          name: 'Koramangala Sony World Signal',
          address: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
          coordinates: { lat: 12.9345, lng: 77.6266 },
        },
        dropoff: {
          name: 'Whitefield ITPL Tech Park',
          address: 'International Tech Park, Whitefield, Bengaluru',
          coordinates: { lat: 12.9863, lng: 77.7329 },
        },
        waypoints: [],
        tier: 'mini',
        tierName: 'Cab Mini',
        status: 'completed',
        fare: 310,
        distanceKm: 16.4,
        durationMinutes: 38,
        driver: {
          id: 'drv-02',
          name: 'Rajesh Sharma',
          phone: '+91 98112 34567',
          rating: 4.92,
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          vehicle: 'Maruti Suzuki Dzire • White',
          plate: 'DL 3C AB 8901',
          currentLocation: { lat: 12.9863, lng: 77.7329 },
        },
        promoCode: 'DESI50',
        discount: 60,
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        completedAt: new Date(Date.now() - 86400000 * 4 + 2500000).toISOString(),
        rating: 5,
        review: 'AC was cool, smooth ride on Outer Ring Road.',
      },
    ];
    localStorage.setItem(RIDE_HISTORY_KEY, JSON.stringify(initialHistory));
    return initialHistory;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addToRideHistory(ride: ActiveRide): void {
  if (typeof window === 'undefined') return;
  const history = getRideHistory();
  const updated = [ride, ...history.filter((h) => h.id !== ride.id)];
  localStorage.setItem(RIDE_HISTORY_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('apex_history_updated'));
}

export function getSupportTickets(): SupportTicket[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(TICKETS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveSupportTicket(ticket: SupportTicket): void {
  if (typeof window === 'undefined') return;
  const current = getSupportTickets();
  const updated = [ticket, ...current];
  localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
}

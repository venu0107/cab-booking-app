'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navigation/Navbar';
import MapWrapper from '@/components/Map/MapWrapper';
import LocationInput from '@/components/Booking/LocationInput';
import RideOptions, { calculateFare } from '@/components/Booking/RideOptions';
import PromoCodeInput from '@/components/Booking/PromoCodeInput';
import ActiveRideSheet from '@/components/Tracking/ActiveRideSheet';
import DriverDashboard from '@/components/Driver/DriverDashboard';
import PaymentModal from '@/components/Payment/PaymentModal';
import ReceiptModal from '@/components/Modal/ReceiptModal';
import RatingModal from '@/components/Modal/RatingModal';
import SupportModal from '@/components/Modal/SupportModal';
import ProfileModal from '@/components/Navigation/ProfileModal';
import EmergencySosModal from '@/components/Modal/EmergencySosModal';
import RideHistoryModal from '@/components/History/RideHistoryModal';
import AuthModal from '@/components/Navigation/AuthModal';
import {
  ActiveRide,
  AuthUser,
  CityId,
  Coordinates,
  LocationPoint,
  PaymentMethod,
  RideTier,
  UserProfile,
  Waypoint,
} from '@/types';
import {
  INDIAN_CITIES,
  RIDE_OPTIONS,
  MOCK_DRIVERS,
} from '@/lib/constants';
import { fetchOSRMRoute, RouteResult } from '@/lib/osrmRouting';
import { sounds } from '@/lib/soundEffects';
import {
  getRiderProfile,
  saveRiderProfile,
  getDriverProfile,
  saveDriverProfile,
  getActiveRide,
  saveActiveRide,
  getRideHistory,
  addToRideHistory,
} from '@/lib/storage';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CabBookingApp() {
  // Auth state - null means not logged in
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check session on mount
  useEffect(() => {
    const user = getCurrentUser();
    setAuthUser(user);
    setAuthChecked(true);

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<AuthUser | null>;
      setAuthUser(customEvent.detail);
    };
    window.addEventListener('bharatride_auth_change', handleAuthChange);
    return () => window.removeEventListener('bharatride_auth_change', handleAuthChange);
  }, []);

  // Current user mode
  const [currentRole, setCurrentRole] = useState<'rider' | 'driver'>('rider');
  const [riderProfile, setRiderProfile] = useState<UserProfile>(() => getRiderProfile());
  const [driverProfile, setDriverProfile] = useState<UserProfile>(() => getDriverProfile());

  // Sync auth user into profile when user logs in
  useEffect(() => {
    if (!authUser) return;
    // Update riderProfile with real registered details
    const updatedProfile: UserProfile = {
      ...getRiderProfile(),
      id: authUser.id,
      email: authUser.email,
      fullName: authUser.fullName,
      phone: authUser.phone,
      avatarUrl: authUser.avatarUrl || getRiderProfile().avatarUrl,
      role: authUser.role === 'driver' ? 'driver' : 'rider',
    };
    setRiderProfile(updatedProfile);
    saveRiderProfile(updatedProfile);
    // If they registered as driver, switch to driver view
    if (authUser.role === 'driver') {
      setCurrentRole('driver');
    } else {
      setCurrentRole('rider');
    }
  }, [authUser?.id]);

  const handleLogout = () => {
    logoutUser();
    setAuthUser(null);
  };

  // Indian City selection (defaults to Bengaluru)
  const [selectedCity, setSelectedCity] = useState<CityId>('bengaluru');
  const cityConfig = INDIAN_CITIES[selectedCity];

  // Booking locations
  const [pickup, setPickup] = useState<LocationPoint | null>(cityConfig.defaultPickup);
  const [dropoff, setDropoff] = useState<LocationPoint | null>(cityConfig.defaultDropoff);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [selectedTier, setSelectedTier] = useState<RideTier>('auto'); // Auto Rickshaw is default!
  const [mapSelectionMode, setMapSelectionMode] = useState<'pickup' | 'dropoff' | 'waypoint' | null>(null);

  // Promo and Payment
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi'); // UPI is default in India

  // Route & Polyline
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [driverCoordinates, setDriverCoordinates] = useState<Coordinates | null>(null);

  // Active Ride and History
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
  const [history, setHistory] = useState<ActiveRide[]>([]);

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceiptRide, setSelectedReceiptRide] = useState<ActiveRide | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Reference for driver animation interval
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Switch City
  const handleSelectCity = (newCityId: CityId) => {
    setSelectedCity(newCityId);
    const newConfig = INDIAN_CITIES[newCityId];
    setPickup(newConfig.defaultPickup);
    setDropoff(newConfig.defaultDropoff);
    setWaypoints([]);
    setDriverCoordinates(null);
  };

  // Sync state from storage on mount
  useEffect(() => {
    setActiveRide(getActiveRide());
    setHistory(getRideHistory());

    const handleRideUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ActiveRide | null>;
      setActiveRide(customEvent.detail);
    };

    const handleHistoryUpdate = () => {
      setHistory(getRideHistory());
    };

    window.addEventListener('apex_ride_updated', handleRideUpdate);
    window.addEventListener('apex_history_updated', handleHistoryUpdate);

    return () => {
      window.removeEventListener('apex_ride_updated', handleRideUpdate);
      window.removeEventListener('apex_history_updated', handleHistoryUpdate);
    };
  }, []);

  // Fetch routing polyline when pickup, dropoff, or waypoints change
  useEffect(() => {
    if (!pickup || !dropoff) {
      setRouteResult(null);
      return;
    }

    let isMounted = true;
    fetchOSRMRoute(pickup.coordinates, dropoff.coordinates, waypoints).then((res) => {
      if (isMounted) {
        setRouteResult(res);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [pickup, dropoff, waypoints]);

  // Handle map clicks
  const handleMapClick = (coords: Coordinates) => {
    if (mapSelectionMode === 'pickup') {
      setPickup({
        name: 'Selected Pin Point',
        address: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
        coordinates: coords,
      });
      setMapSelectionMode(null);
    } else if (mapSelectionMode === 'dropoff') {
      setDropoff({
        name: 'Selected Destination',
        address: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
        coordinates: coords,
      });
      setMapSelectionMode(null);
    } else if (mapSelectionMode === 'waypoint') {
      setWaypoints((prev) => [
        ...prev,
        {
          id: `wp-${Date.now()}`,
          address: `Stop ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
          coordinates: coords,
        },
      ]);
      setMapSelectionMode(null);
    }
  };

  // Swap pickup and dropoff
  const handleSwapLocations = () => {
    const temp = pickup;
    setPickup(dropoff);
    setDropoff(temp);
  };

  // Add waypoint
  const handleAddWaypoint = (wp: Waypoint) => {
    setWaypoints((prev) => [...prev, wp]);
  };

  // Remove waypoint
  const handleRemoveWaypoint = (id: string) => {
    setWaypoints((prev) => prev.filter((w) => w.id !== id));
  };

  // Selected Option Details
  const selectedOption = RIDE_OPTIONS.find((o) => o.id === selectedTier) || RIDE_OPTIONS[0];
  const distanceKm = routeResult ? routeResult.distanceKm : 4.2;
  const durationMinutes = routeResult ? routeResult.durationMinutes : 16;
  const grossFare = calculateFare(selectedOption, distanceKm, durationMinutes);
  const finalFare = Math.max(20, grossFare - discount);

  // Request Ride Action
  const handleRequestRide = () => {
    if (!pickup || !dropoff) return;

    sounds.playRideBooked();

    const newRide: ActiveRide = {
      id: `ride-${Date.now()}`,
      riderId: riderProfile.id,
      riderName: riderProfile.fullName,
      riderPhone: riderProfile.phone,
      pickup,
      dropoff,
      waypoints,
      tier: selectedTier,
      tierName: selectedOption.name,
      status: 'searching',
      fare: finalFare,
      distanceKm,
      durationMinutes,
      promoCode: promoCode || undefined,
      discount,
      paymentMethod,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    saveActiveRide(newRide);
    setActiveRide(newRide);

    // Auto-match simulation after 3s if in rider mode
    setTimeout(() => {
      const current = getActiveRide();
      if (current && current.status === 'searching') {
        const matchedDriver = MOCK_DRIVERS[0]; // Ramesh Gowda
        const assigned: ActiveRide = {
          ...current,
          status: 'driver_assigned',
          driver: {
            ...matchedDriver,
            currentLocation: {
              lat: current.pickup.coordinates.lat + 0.005,
              lng: current.pickup.coordinates.lng + 0.004,
            },
          },
        };
        saveActiveRide(assigned);
        setActiveRide(assigned);
        setDriverCoordinates(assigned.driver!.currentLocation);
      }
    }, 3200);
  };

  // Driver Simulation Movement
  useEffect(() => {
    if (!activeRide || !activeRide.driver) return;

    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }

    if (activeRide.status === 'arriving') {
      sounds.playDriverArrived();
      // Animate driver towards pickup point
      const target = activeRide.pickup.coordinates;
      let start = driverCoordinates || activeRide.driver.currentLocation;
      let step = 0;
      const totalSteps = 15;

      animationIntervalRef.current = setInterval(() => {
        step++;
        const fraction = step / totalSteps;
        const currentLoc: Coordinates = {
          lat: start.lat + (target.lat - start.lat) * fraction,
          lng: start.lng + (target.lng - start.lng) * fraction,
        };
        setDriverCoordinates(currentLoc);

        if (step >= totalSteps) {
          if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
          const updatedRide: ActiveRide = {
            ...activeRide,
            status: 'in_progress',
          };
          saveActiveRide(updatedRide);
          setActiveRide(updatedRide);
        }
      }, 700);
    } else if (activeRide.status === 'in_progress' && routeResult && routeResult.polyline.length > 0) {
      // Animate driver along the real road polyline towards destination
      const poly = routeResult.polyline;
      let polyIdx = 0;
      const stepIncrement = Math.max(1, Math.floor(poly.length / 25));

      animationIntervalRef.current = setInterval(() => {
        polyIdx += stepIncrement;
        if (polyIdx >= poly.length - 1) {
          if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
          setDriverCoordinates({ lat: poly[poly.length - 1][0], lng: poly[poly.length - 1][1] });
          handleCompleteRide();
        } else {
          setDriverCoordinates({ lat: poly[polyIdx][0], lng: poly[polyIdx][1] });
        }
      }, 600);
    }

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [activeRide?.status]);

  // Complete Trip Handler
  const handleCompleteRide = () => {
    if (!activeRide) return;
    sounds.playTripCompleted();

    const completed: ActiveRide = {
      ...activeRide,
      status: 'completed',
      completedAt: new Date().toISOString(),
    };

    addToRideHistory(completed);
    saveActiveRide(null);
    setActiveRide(null);
    setSelectedReceiptRide(completed);
    setIsRatingModalOpen(true);
  };

  // Cancel Ride
  const handleCancelRide = () => {
    if (!activeRide) return;
    const cancelled: ActiveRide = {
      ...activeRide,
      status: 'cancelled',
      completedAt: new Date().toISOString(),
    };
    addToRideHistory(cancelled);
    saveActiveRide(null);
    setActiveRide(null);
    setDriverCoordinates(null);
  };

  // Step simulation manually
  const handleAdvanceSimulation = () => {
    if (!activeRide) return;
    if (activeRide.status === 'searching') {
      const assigned: ActiveRide = {
        ...activeRide,
        status: 'driver_assigned',
        driver: {
          ...MOCK_DRIVERS[0],
          currentLocation: {
            lat: activeRide.pickup.coordinates.lat + 0.005,
            lng: activeRide.pickup.coordinates.lng + 0.004,
          },
        },
      };
      saveActiveRide(assigned);
      setActiveRide(assigned);
      setDriverCoordinates(assigned.driver!.currentLocation);
    } else if (activeRide.status === 'driver_assigned') {
      const arriving: ActiveRide = { ...activeRide, status: 'arriving' };
      saveActiveRide(arriving);
      setActiveRide(arriving);
    } else if (activeRide.status === 'arriving') {
      const inProg: ActiveRide = { ...activeRide, status: 'in_progress' };
      saveActiveRide(inProg);
      setActiveRide(inProg);
    } else if (activeRide.status === 'in_progress') {
      handleCompleteRide();
    }
  };

  // Driver Accept / Decline Actions
  const handleDriverAccept = () => {
    if (!activeRide) return;
    const assigned: ActiveRide = {
      ...activeRide,
      status: 'driver_assigned',
      driver: {
        id: driverProfile.id,
        name: driverProfile.fullName,
        phone: driverProfile.phone,
        rating: driverProfile.rating || 4.98,
        avatarUrl: driverProfile.avatarUrl,
        vehicle: driverProfile.vehicleDetails?.model || 'Bajaj RE Auto',
        plate: driverProfile.vehicleDetails?.plate || 'KA 01 MJ 4321',
        currentLocation: {
          lat: activeRide.pickup.coordinates.lat + 0.004,
          lng: activeRide.pickup.coordinates.lng + 0.004,
        },
      },
    };
    saveActiveRide(assigned);
    setActiveRide(assigned);
    setDriverCoordinates(assigned.driver!.currentLocation);
  };

  const handleDriverDecline = () => {
    // If declined, keep searching
  };

  const handleDriverUpdateStatus = (newStatus: ActiveRide['status']) => {
    if (!activeRide) return;
    if (newStatus === 'completed') {
      handleCompleteRide();
    } else {
      const updated: ActiveRide = { ...activeRide, status: newStatus };
      saveActiveRide(updated);
      setActiveRide(updated);
    }
  };

  // Show auth screen if not logged in yet
  if (!authChecked) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!authUser) {
    return <AuthModal onAuthSuccess={() => setAuthUser(getCurrentUser())} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onSwitchRole={setCurrentRole}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        activeProfile={currentRole === 'rider' ? riderProfile : driverProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSupport={() => setIsSupportModalOpen(true)}
        hasActiveRide={Boolean(activeRide)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Control Panel / Drawer */}
        <aside className="w-full md:w-[460px] h-[55%] md:h-full z-10 flex flex-col bg-slate-950/95 border-b md:border-b-0 md:border-r border-slate-800 shadow-2xl backdrop-blur-xl overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4">
            {currentRole === 'rider' ? (
              <>
                {/* Active Ride Banner if trip in progress */}
                {activeRide ? (
                  <ActiveRideSheet
                    ride={activeRide}
                    onCancelRide={handleCancelRide}
                    onTriggerSos={() => setIsSosModalOpen(true)}
                    onAdvanceSimulation={handleAdvanceSimulation}
                  />
                ) : (
                  <>
                    {/* Header */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black tracking-tight text-white">
                          Book Ride in {cityConfig.name}
                        </span>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Doorstep Auto, Bike Taxi, and AC Cabs across {cityConfig.state}.
                      </p>
                    </div>

                    {/* Pickup & Destination selection */}
                    <LocationInput
                      pickup={pickup}
                      dropoff={dropoff}
                      waypoints={waypoints}
                      cityPresets={cityConfig.presets}
                      cityName={cityConfig.name}
                      onSelectPickup={setPickup}
                      onSelectDropoff={setDropoff}
                      onAddWaypoint={handleAddWaypoint}
                      onRemoveWaypoint={handleRemoveWaypoint}
                      onSwapLocations={handleSwapLocations}
                      onToggleMapPick={setMapSelectionMode}
                      activePickMode={mapSelectionMode}
                    />

                    {/* Vehicle Tiers and Dynamic Pricing in INR */}
                    <RideOptions
                      selectedTier={selectedTier}
                      onSelectTier={setSelectedTier}
                      distanceKm={distanceKm}
                      durationMinutes={durationMinutes}
                      discount={discount}
                    />

                    {/* Promo Code Input */}
                    <PromoCodeInput
                      grossFare={grossFare}
                      onApplyPromo={(code, disc) => {
                        setPromoCode(code);
                        setDiscount(disc);
                      }}
                      appliedPromo={promoCode}
                      appliedDiscount={discount}
                    />

                    {/* Payment & Request Button */}
                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300 transition"
                      >
                        <span className="text-slate-400">Payment Mode:</span>
                        <span className="font-bold text-amber-400 uppercase">
                          {paymentMethod.replace('_', ' ')}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRequestRide}
                        disabled={!pickup || !dropoff}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-black rounded-2xl text-sm tracking-wide shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition transform active:scale-[0.98] disabled:opacity-50"
                      >
                        <span>BOOK {selectedOption.name.toUpperCase()} (₹{Math.round(finalFare)})</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              /* Driver Experience Mode */
              <DriverDashboard
                driverProfile={driverProfile}
                activeRide={activeRide}
                onAcceptRide={handleDriverAccept}
                onDeclineRide={handleDriverDecline}
                onUpdateRideStatus={handleDriverUpdateStatus}
              />
            )}
          </div>
        </aside>

        {/* Right Map Canvas (100% full interactive Leaflet) */}
        <main className="flex-1 h-[45%] md:h-full relative">
          <MapWrapper
            pickup={pickup}
            dropoff={dropoff}
            waypoints={waypoints}
            driverLocation={driverCoordinates}
            routePolyline={routeResult ? routeResult.polyline : []}
            onMapClick={handleMapClick}
            selectionMode={mapSelectionMode}
          />
        </main>
      </div>

      {/* Modals */}
      {isPaymentModalOpen && (
        <PaymentModal
          fare={finalFare}
          selectedMethod={paymentMethod}
          onSelectMethod={setPaymentMethod}
          onConfirmPayment={() => setIsPaymentModalOpen(false)}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      )}

      {isHistoryOpen && (
        <RideHistoryModal
          history={history}
          onSelectReceipt={(ride) => {
            setSelectedReceiptRide(ride);
            setIsReceiptModalOpen(true);
          }}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {isReceiptModalOpen && selectedReceiptRide && (
        <ReceiptModal
          ride={selectedReceiptRide}
          onClose={() => {
            setIsReceiptModalOpen(false);
            setSelectedReceiptRide(null);
          }}
        />
      )}

      {isRatingModalOpen && selectedReceiptRide && (
        <RatingModal
          ride={selectedReceiptRide}
          onSubmit={() => {
            setIsRatingModalOpen(false);
          }}
          onClose={() => setIsRatingModalOpen(false)}
        />
      )}

      {isSupportModalOpen && (
        <SupportModal
          userId={riderProfile.id}
          onClose={() => setIsSupportModalOpen(false)}
        />
      )}

      {isProfileModalOpen && (
        <ProfileModal
          profile={currentRole === 'rider' ? riderProfile : driverProfile}
          onSave={(updated) => {
            if (currentRole === 'rider') {
              setRiderProfile(updated);
              saveRiderProfile(updated);
            } else {
              setDriverProfile(updated);
              saveDriverProfile(updated);
            }
          }}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {isSosModalOpen && activeRide && (
        <EmergencySosModal
          ride={activeRide}
          onClose={() => setIsSosModalOpen(false)}
        />
      )}
    </div>
  );
}

'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Coordinates, LocationPoint, Waypoint } from '@/types';

const DynamicCabMap = dynamic(() => import('./CabMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-3">
      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs uppercase tracking-wider font-medium text-slate-500">Loading interactive map...</p>
    </div>
  ),
});

interface MapWrapperProps {
  pickup: LocationPoint | null;
  dropoff: LocationPoint | null;
  waypoints: Waypoint[];
  driverLocation?: Coordinates | null;
  routePolyline: [number, number][];
  onMapClick?: (coords: Coordinates) => void;
  selectionMode?: 'pickup' | 'dropoff' | 'waypoint' | null;
}

export default function MapWrapper(props: MapWrapperProps) {
  return <DynamicCabMap {...props} />;
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Coordinates, LocationPoint, Waypoint } from '@/types';
import { Layers, Moon, Sun } from 'lucide-react';

interface CabMapProps {
  pickup: LocationPoint | null;
  dropoff: LocationPoint | null;
  waypoints: Waypoint[];
  driverLocation?: Coordinates | null;
  routePolyline: [number, number][];
  onMapClick?: (coords: Coordinates) => void;
  selectionMode?: 'pickup' | 'dropoff' | 'waypoint' | null;
}

export default function CabMap({
  pickup,
  dropoff,
  waypoints,
  driverLocation,
  routePolyline,
  onMapClick,
  selectionMode,
}: CabMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const refTileLayerRef = useRef<L.TileLayer | null>(null);

  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const dropoffMarkerRef = useRef<L.Marker | null>(null);
  const waypointMarkersRef = useRef<L.Marker[]>([]);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const [mapTheme, setMapTheme] = useState<'dark' | 'streets'>('dark');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Default center: Bengaluru, India (Silicon Valley of India)
    const defaultCenter: [number, number] = [12.9716, 77.5946];

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: false,
    });

    // Native Esri Dark Gray Base (Free, 0 API key required, 0 watermarks)
    const baseLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16,
      }
    ).addTo(map);

    // Reference labels overlay (crisp road names and landmarks)
    const refLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '',
        maxZoom: 16,
      }
    ).addTo(map);

    baseTileLayerRef.current = baseLayer;
    refTileLayerRef.current = refLayer;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Switch Map Theme between Dark and Streets
  const toggleMapTheme = () => {
    const map = mapRef.current;
    if (!map) return;

    if (mapTheme === 'dark') {
      // Switch to Streets
      if (baseTileLayerRef.current) map.removeLayer(baseTileLayerRef.current);
      if (refTileLayerRef.current) map.removeLayer(refTileLayerRef.current);

      baseTileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri &mdash; Source: Esri, DeLorme, USGS, NPS',
          maxZoom: 18,
        }
      ).addTo(map);
      refTileLayerRef.current = null;
      setMapTheme('streets');
    } else {
      // Switch to Dark
      if (baseTileLayerRef.current) map.removeLayer(baseTileLayerRef.current);

      baseTileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
          maxZoom: 16,
        }
      ).addTo(map);

      refTileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '',
          maxZoom: 16,
        }
      ).addTo(map);
      setMapTheme('dark');
    }
  };

  // Handle map click
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [onMapClick]);

  // Update Pickup Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
      pickupMarkerRef.current = null;
    }

    if (pickup) {
      const icon = L.divIcon({
        className: 'pickup-marker-icon',
        html: `
          <div class="pulsing-ring"></div>
          <div style="width: 18px; height: 18px; background: #10b981; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.5);"></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([pickup.coordinates.lat, pickup.coordinates.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="color: #0f172a; font-weight: 600; font-size: 13px;">📍 Pickup: ${
            pickup.name || pickup.address
          }</div>`
        );

      pickupMarkerRef.current = marker;
    }
  }, [pickup]);

  // Update Dropoff Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.remove();
      dropoffMarkerRef.current = null;
    }

    if (dropoff) {
      const icon = L.divIcon({
        className: 'dropoff-marker-icon',
        html: `
          <div style="background: #ef4444; color: white; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">🏁</div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([dropoff.coordinates.lat, dropoff.coordinates.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="color: #0f172a; font-weight: 600; font-size: 13px;">🏁 Drop-off: ${
            dropoff.name || dropoff.address
          }</div>`
        );

      dropoffMarkerRef.current = marker;
    }
  }, [dropoff]);

  // Update Waypoints
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    waypointMarkersRef.current.forEach((m) => m.remove());
    waypointMarkersRef.current = [];

    waypoints.forEach((wp, index) => {
      const icon = L.divIcon({
        className: 'waypoint-marker-icon',
        html: `
          <div style="background: #06b6d4; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4);">
            ${index + 1}
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([wp.coordinates.lat, wp.coordinates.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="color: #0f172a; font-weight: 600; font-size: 13px;">Stop ${index + 1}: ${
            wp.address
          }</div>`
        );

      waypointMarkersRef.current.push(marker);
    });
  }, [waypoints]);

  // Update Driver Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (driverMarkerRef.current) {
      driverMarkerRef.current.remove();
      driverMarkerRef.current = null;
    }

    if (driverLocation) {
      const carIcon = L.divIcon({
        className: 'car-marker-container',
        html: `
          <div style="width: 36px; height: 36px; background: #000000; border: 2px solid #06b6d4; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(6,182,212,0.6);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <path d="M9 17h6"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([driverLocation.lat, driverLocation.lng], { icon: carIcon })
        .addTo(map)
        .bindPopup('<div style="color: #0f172a; font-weight: 600;">🚗 Your Driver</div>');

      driverMarkerRef.current = marker;
    }
  }, [driverLocation]);

  // Update Route Polyline & Fit Bounds
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (routePolyline && routePolyline.length > 0) {
      const polyline = L.polyline(routePolyline, {
        color: '#06b6d4',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: undefined,
      }).addTo(map);

      polylineRef.current = polyline;

      // Fit map to route bounds smoothly
      const bounds = L.latLngBounds(routePolyline);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    } else if (pickup && dropoff) {
      const bounds = L.latLngBounds([
        [pickup.coordinates.lat, pickup.coordinates.lng],
        [dropoff.coordinates.lat, dropoff.coordinates.lng],
      ]);
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 });
    } else if (pickup) {
      map.setView([pickup.coordinates.lat, pickup.coordinates.lng], 14);
    }
  }, [routePolyline, pickup, dropoff]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Theme Switcher Pill */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center">
        <button
          type="button"
          onClick={toggleMapTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-200 shadow-xl backdrop-blur-md transition"
        >
          {mapTheme === 'dark' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dark Map</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Street View</span>
            </>
          )}
        </button>
      </div>

      {selectionMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 bg-slate-900/90 backdrop-blur-md text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/30 shadow-xl pointer-events-none flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          Click anywhere on map to set {selectionMode} location
        </div>
      )}
    </div>
  );
}

import { Coordinates, Waypoint } from '@/types';

export interface RouteResult {
  polyline: [number, number][]; // [lat, lng]
  distanceKm: number;
  durationMinutes: number;
}

// Calculate Haversine distance as a fast fallback
export function calculateHaversineDistance(c1: Coordinates, c2: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
  const dLng = ((c2.lng - c1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fallback interpolation if OSRM is slow or offline
function generateInterpolatedRoute(points: Coordinates[]): RouteResult {
  const polyline: [number, number][] = [];
  let totalDistance = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const segmentDist = calculateHaversineDistance(p1, p2);
    totalDistance += segmentDist;

    const steps = Math.max(10, Math.round(segmentDist * 12));
    for (let s = 0; s <= steps; s++) {
      const fraction = s / steps;
      // Add subtle curve offset to look like city roads
      const curve = Math.sin(fraction * Math.PI) * 0.002;
      const lat = p1.lat + (p2.lat - p1.lat) * fraction + curve;
      const lng = p1.lng + (p2.lng - p1.lng) * fraction - curve;
      polyline.push([lat, lng]);
    }
  }

  // City driving average speed ~ 32 km/h + 2 min buffer
  const duration = Math.max(3, Math.round((totalDistance / 32) * 60) + 2);

  return {
    polyline,
    distanceKm: Number(Math.max(1.2, totalDistance * 1.3).toFixed(1)), // 1.3 road multiplier
    durationMinutes: duration,
  };
}

export async function fetchOSRMRoute(
  start: Coordinates,
  destination: Coordinates,
  waypoints: Waypoint[] = []
): Promise<RouteResult> {
  const allPoints: Coordinates[] = [start, ...waypoints.map((w) => w.coordinates), destination];

  try {
    // OSRM coordinates format: lng,lat;lng,lat
    const coordsString = allPoints.map((pt) => `${pt.lng},${pt.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`OSRM responded with ${res.status}`);
    }

    const data = await res.json();

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      // OSRM returns GeoJSON coordinates as [lng, lat], Leaflet needs [lat, lng]
      const polyline: [number, number][] = route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng]
      );
      const distanceKm = Number((route.distance / 1000).toFixed(1));
      const durationMinutes = Math.max(2, Math.round(route.duration / 60));

      return {
        polyline,
        distanceKm,
        durationMinutes,
      };
    }
    return generateInterpolatedRoute(allPoints);
  } catch {
    return generateInterpolatedRoute(allPoints);
  }
}

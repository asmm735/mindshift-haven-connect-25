
import { useEffect, useRef } from "react";

// Simple wrapper for embedding Google Maps
// Expects an array of therapists with lat/lng and verified status

type Therapist = {
  id: string,
  name: string,
  latitude: number,
  longitude: number,
  address: string,
  verified: boolean,
};

type MapProps = { therapists: Therapist[] };

const MAP_API_KEY = "AIzaSyD-W6vxaBSr4lqN86sDcigH6_6ZdEQDm5Q"; // Replace with your own; for demo purposes only.

const TheraConnectMap = ({ therapists }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        zoom: 11,
        center: { lat: 19.076, lng: 72.8777 }, // Mumbai
        mapTypeId: "roadmap",
      });
    }
    // Remove old markers
    (mapInstance.current as any).allMarkers = (mapInstance.current as any).allMarkers || [];
    (mapInstance.current as any).allMarkers.forEach((marker: any) => marker.setMap(null));
    (mapInstance.current as any).allMarkers = [];
    // Add therapists as markers
    therapists.forEach((therapist) => {
      if (therapist.latitude && therapist.longitude) {
        const marker = new window.google.maps.Marker({
          position: { lat: therapist.latitude, lng: therapist.longitude },
          map: mapInstance.current!,
          title: therapist.name,
          label: therapist.verified ? "✓" : "",
        });
        (mapInstance.current as any).allMarkers.push(marker);
      }
    });
  }, [therapists]);

  useEffect(() => {
    if (!window.google && !document.getElementById("gmap-script")) {
      var script = document.createElement("script");
      script.id = "gmap-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}`;
      script.async = true;
      script.onload = () => { /* Map will re-render on therapists */ };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div ref={mapRef} className="w-full h-72 rounded-xl shadow mb-6" />
  );
};

export default TheraConnectMap;

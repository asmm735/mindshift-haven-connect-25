
import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

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

const MAP_API_KEY = "AIzaSyD-W6vxaBSr4lqN86sDcigH6_6ZdEQDm5Q"; // For demo purposes only

const TheraConnectMap = ({ therapists }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const toast = useToast();
  
  // Initialize map when component mounts
  useEffect(() => {
    // Load the Google Maps script if it hasn't been loaded yet
    if (!window.google && !document.getElementById("gmap-script")) {
      const script = document.createElement("script");
      script.id = "gmap-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        toast.toast({
          title: "Error loading map",
          description: "Could not load Google Maps. Please try again later.",
          variant: "destructive"
        });
      };
      document.body.appendChild(script);
    } else if (window.google) {
      initMap();
    }
  }, []);

  // Update markers when therapists change
  useEffect(() => {
    if (window.google && mapInstance.current) {
      updateMarkers();
    }
  }, [therapists]);

  // Initialize the map
  const initMap = () => {
    if (!mapRef.current || !window.google) return;
    
    try {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        zoom: 11,
        center: { lat: 19.076, lng: 72.8777 }, // Mumbai
        mapTypeId: "roadmap",
      });
      
      updateMarkers();
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  // Update markers based on therapists list
  const updateMarkers = () => {
    if (!mapInstance.current || !window.google) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Add therapists as markers
    therapists.forEach((therapist) => {
      if (therapist.latitude && therapist.longitude) {
        try {
          const marker = new window.google.maps.Marker({
            position: { lat: therapist.latitude, lng: therapist.longitude },
            map: mapInstance.current!,
            title: therapist.name,
            label: therapist.verified ? "✓" : "",
          });
          
          markersRef.current.push(marker);
        } catch (error) {
          console.error("Error adding marker:", error);
        }
      }
    });
  };

  return (
    <div ref={mapRef} className="w-full h-72 rounded-xl shadow mb-6" />
  );
};

export default TheraConnectMap;

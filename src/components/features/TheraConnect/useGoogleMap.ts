
import { useEffect, useRef, useState, RefObject } from "react";
import { addTherapistMarkers, clearMapMarkers } from "./mapUtils";
import type { Therapist } from "./TheraConnectMap";
import { useToast } from "@/components/ui/use-toast";

const MAP_API_KEY = "AIzaSyD-W6vxaBSr4lqN86sDcigH6_6ZdEQDm5Q";
const SCRIPT_ID = "google-maps-script";

type UseGoogleMapProps = {
  mapRef: RefObject<HTMLDivElement>;
  therapists: Therapist[];
};

export function useGoogleMap({ mapRef, therapists }: UseGoogleMapProps) {
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const toast = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  // Load the Google Maps script and initialize map
  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Prevent duplicate script loading
    if (document.getElementById(SCRIPT_ID)) {
      const waitForLoad = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(waitForLoad);
          setIsLoaded(true);
        }
      }, 100);
      return () => clearInterval(waitForLoad);
    }

    // Create script
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&callback=Function.prototype`;
    script.async = true;
    script.defer = true;

    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      toast.toast({
        title: "Error loading map",
        description: "Could not load Google Maps. Please try again later.",
        variant: "destructive",
      });
    };

    document.body.appendChild(script);

    // cleanup: remove markers
    return () => {
      if (markersRef.current.length > 0) {
        clearMapMarkers(markersRef.current);
        markersRef.current = [];
      }
      if (infoWindowRef.current) infoWindowRef.current.close();
    };
    // eslint-disable-next-line
  }, []);

  // Initialize map and markers after loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return;

    // Only create map instance if it doesn't exist
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: { lat: 19.076, lng: 72.8777 }, // Mumbai
        mapTypeId: "roadmap",
        styles: [
          {
            featureType: "poi.medical",
            elementType: "geometry",
            stylers: [
              { visibility: "on" },
              { color: "#f5d8e9" },
            ],
          },
          {
            featureType: "water",
            stylers: [{ color: "#d3eaf8" }],
          },
        ],
      });
    }
    if (!infoWindowRef.current) {
      infoWindowRef.current = new window.google.maps.InfoWindow();
    }

    updateMarkers();

    function updateMarkers() {
      if (!mapInstance.current) return;
      // Clear and add
      clearMapMarkers(markersRef.current);
      markersRef.current = addTherapistMarkers({
        map: mapInstance.current,
        therapists,
        infoWindow: infoWindowRef.current!,
      });

      // Set map bounds
      if (markersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        let validMarkerFound = false;
        markersRef.current.forEach((marker) => {
          const position = marker.getPosition();
          if (position) {
            bounds.extend(position);
            validMarkerFound = true;
          }
        });
        if (validMarkerFound && mapInstance.current) {
          mapInstance.current.fitBounds(bounds);
          setTimeout(() => {
            const zoom = mapInstance.current?.getZoom();
            if (zoom && zoom > 15) {
              mapInstance.current?.setZoom(15);
            }
          }, 100);
        }
      }
    }

    // Re-run on therapists change
    // eslint-disable-next-line
  }, [isLoaded, therapists]);

  // Clear markers/infowindow on unmount
  useEffect(() => {
    return () => {
      if (markersRef.current.length > 0) clearMapMarkers(markersRef.current);
      if (infoWindowRef.current) infoWindowRef.current.close();
    };
  }, []);

  return { isLoaded };
}

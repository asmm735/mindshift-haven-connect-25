
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { MapPin } from "lucide-react";

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
const SCRIPT_ID = "google-maps-script"; // Consistent ID for the script element

const TheraConnectMap = ({ therapists }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const toast = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScriptLoading, setIsScriptLoading] = useState(false);
  
  // Initialize map when component mounts
  useEffect(() => {
    // Check if the script is already loaded
    if (window.google?.maps) {
      setIsLoaded(true);
      initMap();
      return;
    }

    // Prevent duplicate script loading
    if (document.getElementById(SCRIPT_ID)) {
      // Script is already being loaded by another instance
      const waitForLoad = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(waitForLoad);
          setIsLoaded(true);
          initMap();
        }
      }, 100);
      
      return () => clearInterval(waitForLoad);
    }

    if (!isScriptLoading) {
      setIsScriptLoading(true);
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&callback=Function.prototype`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
        setIsScriptLoading(false);
        initMap();
      };
      
      script.onerror = () => {
        setIsScriptLoading(false);
        toast.toast({
          title: "Error loading map",
          description: "Could not load Google Maps. Please try again later.",
          variant: "destructive"
        });
      };
      
      document.body.appendChild(script);
    }

    // Cleanup when component unmounts
    return () => {
      clearMapMarkers();
    };
  }, []);

  // Update markers when therapists change
  useEffect(() => {
    if (isLoaded && mapInstance.current) {
      updateMarkers();
    }
  }, [therapists, isLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearMapMarkers();
      
      // Close info window if open
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, []);

  // Clear all map markers
  const clearMapMarkers = () => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => {
        if (marker) {
          // Remove event listeners and then remove from map
          google.maps.event.clearInstanceListeners(marker);
          marker.setMap(null);
        }
      });
      markersRef.current = [];
    }
  };

  // Initialize the map
  const initMap = () => {
    if (!mapRef.current || !window.google) return;
    
    try {
      // Only create map instance if it doesn't exist
      if (!mapInstance.current) {
        // Create info window instance
        infoWindowRef.current = new window.google.maps.InfoWindow();
        
        // Create map instance
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          zoom: 12,
          center: { lat: 19.076, lng: 72.8777 }, // Mumbai
          mapTypeId: "roadmap",
          styles: [
            {
              "featureType": "poi.medical",
              "elementType": "geometry",
              "stylers": [{ "visibility": "on" }, { "color": "#f5d8e9" }]
            },
            {
              "featureType": "water",
              "stylers": [{ "color": "#d3eaf8" }]
            }
          ]
        });
      }
      
      updateMarkers();
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  // Update markers based on therapists list
  const updateMarkers = () => {
    if (!mapInstance.current || !window.google) return;
    
    // Clear existing markers first
    clearMapMarkers();
    
    // Add therapists as markers
    therapists.forEach((therapist) => {
      if (therapist.latitude && therapist.longitude) {
        try {
          const marker = new window.google.maps.Marker({
            position: { lat: therapist.latitude, lng: therapist.longitude },
            map: mapInstance.current!,
            title: therapist.name,
            icon: therapist.verified ? {
              url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23943c64' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E",
              scaledSize: new window.google.maps.Size(32, 32),
            } : undefined,
            animation: window.google.maps.Animation.DROP
          });
          
          // Add click listener to show info window
          marker.addListener('click', () => {
            const verifiedBadge = therapist.verified ? 
              `<span class="px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded">✓ Verified</span>` : '';
              
            const content = `
              <div class="p-2">
                <h3 class="font-semibold text-mindshift-raspberry text-base">${therapist.name}</h3>
                <p class="text-sm mt-1">${therapist.address}</p>
                ${verifiedBadge}
              </div>
            `;
            
            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(content);
              infoWindowRef.current.open(mapInstance.current!, marker);
            }
          });
          
          markersRef.current.push(marker);
        } catch (error) {
          console.error("Error adding marker:", error);
        }
      }
    });
    
    // Adjust map bounds if we have markers
    if (markersRef.current.length > 0 && mapInstance.current) {
      try {
        const bounds = new window.google.maps.LatLngBounds();
        let validMarkerFound = false;
        
        markersRef.current.forEach(marker => {
          const position = marker.getPosition();
          if (position) {
            bounds.extend(position);
            validMarkerFound = true;
          }
        });
        
        if (validMarkerFound && mapInstance.current) {
          mapInstance.current.fitBounds(bounds);
          
          // Don't zoom in too far
          setTimeout(() => {
            if (mapInstance.current) {
              const zoom = mapInstance.current.getZoom();
              if (zoom && zoom > 15) {
                mapInstance.current.setZoom(15);
              }
            }
          }, 100);
        }
      } catch (error) {
        console.error("Error setting map bounds:", error);
      }
    }
  };

  return (
    <div ref={mapRef} className="w-full h-80 md:h-96 rounded-xl shadow mb-6 relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
          <span className="text-gray-500">Loading map...</span>
        </div>
      )}
    </div>
  );
};

export default TheraConnectMap;

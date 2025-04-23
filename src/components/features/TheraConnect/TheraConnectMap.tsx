
import { useRef } from "react";
import { useGoogleMap } from "./useGoogleMap";

export type Therapist = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  verified: boolean;
};

// The props expect an array of therapists with geo coordinates
type MapProps = { therapists: Therapist[] };

const TheraConnectMap = ({ therapists }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useGoogleMap({ mapRef, therapists });

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

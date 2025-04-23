
import { ReactNode } from "react";

// Type definition for therapist data
export interface Therapist {
  id: number;
  name: string;
  title: string;
  specialty: string | undefined | null;
  rating: number;
  reviewCount: number;
  image: string;
  address: string;
  phone: string;
  distance: string;
  accepting: boolean;
  latitude?: number | null;
  longitude?: number | null;
  verified?: boolean | null;
}

export interface TheraConnectMapProps {
  therapists: Therapist[];
  children?: ReactNode;
}

// Main map component (placeholder for now)
const TheraConnectMap = ({ therapists }: TheraConnectMapProps) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 min-h-[400px] w-full flex items-center justify-center">
      <p className="text-gray-500 text-center">Map view is currently disabled. Please use the list view to find therapists.</p>
    </div>
  );
};

export default TheraConnectMap;

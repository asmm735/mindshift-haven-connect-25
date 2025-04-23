import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone } from "lucide-react";
import { Therapist } from "./TheraConnectMap";

interface TherapistCardProps {
  therapist: Therapist;
}

const TherapistCard = ({ therapist }: TherapistCardProps) => {
  // Safely handle specialty which might be undefined or null
  const specialties = therapist.specialty ? therapist.specialty.split(", ") : [];

  return (
    <div className="mindshift-card overflow-hidden p-0 border shadow-sm rounded-lg">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold text-mindshift-raspberry">{therapist.name}</h3>
            <p className="text-gray-600">{therapist.title}</p>
          </div>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700">
            <svg className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-bold">{therapist.rating}</span>
            <span className="text-xs ml-1">({therapist.reviewCount})</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {specialties.map((specialty, index) => (
            <span key={index} className="bg-mindshift-light text-mindshift-raspberry px-2 py-1 rounded-full text-xs">
              {specialty}
            </span>
          ))}
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm">{therapist.address}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <Phone className="h-4 w-4 mr-2" />
          <span className="text-sm">{therapist.phone}</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
          {therapist.accepting ? (
            <span className="bg-green-100 text-green-800 rounded px-2 py-1 text-xs">
              Accepting New Patients
            </span>
          ) : (
            <span className="border border-gray-300 text-gray-500 rounded px-2 py-1 text-xs">
              Not Accepting New Patients
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapistCard;


import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, Check } from "lucide-react";
import { Therapist } from "@/types/supabase-custom";

interface TherapistCardProps {
  therapist: Therapist;
}

const TherapistCard = ({ therapist }: TherapistCardProps) => {
  return (
    <Card className="mindshift-card overflow-hidden p-0 border shadow-sm rounded-lg">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-mindshift-raspberry flex items-center">
              {therapist.name}
              {therapist.verified && (
                <Check className="h-5 w-5 ml-2 text-green-600" />
              )}
            </h3>
            <p className="text-gray-600">{therapist.description || 'Mental Health Professional'}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-2 text-mindshift-raspberry" />
            <span>{therapist.address}, {therapist.city}</span>
          </div>

          {therapist.phone_number && (
            <div className="flex items-center text-gray-600">
              <Phone className="h-5 w-5 mr-2 text-mindshift-raspberry" />
              <span>{therapist.phone_number}</span>
            </div>
          )}

          {therapist.email && (
            <div className="flex items-center text-gray-600">
              <Mail className="h-5 w-5 mr-2 text-mindshift-raspberry" />
              <span>{therapist.email}</span>
            </div>
          )}
        </div>

        {therapist.verified && (
          <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs inline-block">
            Verified Professional
          </div>
        )}

        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            View Profile
          </Button>
          {therapist.phone_number && (
            <Button size="sm" className="bg-mindshift-raspberry text-white">
              Book Consultation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapistCard;

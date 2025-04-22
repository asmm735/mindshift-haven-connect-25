
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone } from "lucide-react";

interface Therapist {
  id: number;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  image: string;
  address: string;
  phone: string;
  distance: string;
  accepting: boolean;
}

interface TherapistCardProps {
  therapist: Therapist;
}

const TherapistCard = ({ therapist }: TherapistCardProps) => {
  const specialties = therapist.specialty.split(", ");

  return (
    <Card className="mindshift-card overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 relative">
            <div className="h-full min-h-[200px] bg-gray-100 relative overflow-hidden">
              <Avatar className="w-full h-full rounded-none">
                <AvatarImage src={therapist.image} alt={therapist.name} className="object-cover" />
                <AvatarFallback className="w-full h-full rounded-none">{therapist.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <span className="text-white font-medium">
                  {therapist.distance}
                </span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 p-6">
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
                <Badge key={index} variant="secondary" className="bg-mindshift-light text-mindshift-raspberry">
                  {specialty}
                </Badge>
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
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Accepting New Patients
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500">
                  Not Accepting New Patients
                </Badge>
              )}
              
              <div className="flex gap-3">
                <Button className="mindshift-button">
                  Book Appointment
                </Button>
                <Button variant="outline">
                  Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapistCard;

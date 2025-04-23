import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TherapistCard from "@/components/features/TheraConnect/TherapistCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin } from "lucide-react";
import { useState } from "react";

const locations = ["All", "Mumbai", "Navi Mumbai"];

const TheraConnect = () => {
  const { data: therapistsData, isLoading, error } = useQuery({
    queryKey: ['therapists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const mappedTherapists = therapistsData?.map(therapist => ({
    id: parseInt(therapist.id) || Math.floor(Math.random() * 1000),
    name: therapist.name || '',
    title: therapist.description || 'Mental Health Professional',
    specialty: null,
    rating: 4.8,
    reviewCount: 24,
    image: `https://source.unsplash.com/random/300x300/?portrait&sig=${therapist.id}`,
    address: therapist.address || '',
    phone: '+1 (555) 123-4567',
    distance: `${Math.floor(Math.random() * 5) + 1} miles away`,
    accepting: therapist.verified || false,
    city: therapist.city || '',
  }));

  const [filterLocation, setFilterLocation] = useState("All");

  const filteredTherapists = mappedTherapists
    ? filterLocation === "All"
      ? mappedTherapists
      : mappedTherapists.filter(t => t.city === filterLocation)
    : [];

  return (
    <PageLayout className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-mindshift-raspberry mb-2">TheraConnect</h1>
        <p className="text-gray-600 mb-8">Find and connect with mental health professionals in your area</p>
        
        <Card className="mindshift-card mb-8">
          <CardHeader>
            <CardTitle>Available Therapists</CardTitle>
            <CardDescription>
              Connect with qualified mental health professionals who can provide the support you need
            </CardDescription>
            <div className="flex gap-2 mt-4 flex-wrap">
              {locations.map(loc => (
                <button
                  key={loc}
                  className={`inline-flex items-center px-3 py-1 rounded-full border text-sm ${
                    filterLocation === loc
                      ? "bg-mindshift-raspberry text-white"
                      : "bg-white text-mindshift-raspberry border-mindshift-raspberry"
                  }`}
                  onClick={() => setFilterLocation(loc)}
                >
                  {loc !== "All" && <MapPin className="h-4 w-4 mr-1" />} {loc}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 text-mindshift-raspberry animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">
                Error loading therapists. Please try again later.
              </div>
            ) : filteredTherapists && filteredTherapists.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredTherapists.map((therapist) => (
                  <TherapistCard key={therapist.id} therapist={therapist} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No therapists available at the moment. Please check back later.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default TheraConnect;

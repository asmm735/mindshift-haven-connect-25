
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TherapistCard from "@/components/features/TheraConnect/TherapistCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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

  // Transform therapists data to match the Therapist interface
  const therapists = therapistsData?.map(therapist => ({
    id: parseInt(therapist.id) || Math.floor(Math.random() * 1000),
    name: therapist.name || '',
    title: therapist.description || 'Mental Health Professional',
    specialty: null, // We don't have this in the Supabase schema
    rating: 4.8, // Default rating
    reviewCount: 24, // Default review count
    image: `https://source.unsplash.com/random/300x300/?portrait&sig=${therapist.id}`, // Random image
    address: therapist.address || '',
    phone: '+1 (555) 123-4567', // Default phone
    distance: `${Math.floor(Math.random() * 5) + 1} miles away`, // Random distance
    accepting: therapist.verified || false,
  }));

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
            ) : therapists && therapists.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {therapists.map((therapist) => (
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

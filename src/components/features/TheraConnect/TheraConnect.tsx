import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Check } from "lucide-react";
import { Therapist } from "@/types/supabase-custom";

type TherapistData = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  verified: boolean | null;
};

const TheraConnect = () => {
  const [location, setLocation] = useState<string>("Mumbai");
  const [therapists, setTherapists] = useState<TherapistData[]>([]);
  const [filteredTherapists, setFilteredTherapists] = useState<TherapistData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTherapists = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("therapists")
      .select("*")
      .in("city", ["Mumbai", "Navi Mumbai"])
      .eq("verified", true);

    if (!error && data) {
      setTherapists(data);
      setFilteredTherapists(data);
    } else {
      console.error("Error fetching therapists:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  const handleLocationChange = (city: string) => {
    setLocation(city);
    if (city === "All") {
      setFilteredTherapists(therapists);
    } else {
      setFilteredTherapists(therapists.filter(t => t.city === city));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
      <div className="lg:col-span-1">
        <Card className="mindshift-card sticky top-24">
          <CardHeader>
            <CardTitle className="text-2xl text-mindshift-raspberry">Find a Therapist</CardTitle>
            <CardDescription>
              Verified professionals in Mumbai & Navi Mumbai
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Location</label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm"
                  variant={location === "All" ? "default" : "outline"}
                  onClick={() => handleLocationChange("All")}
                  className={location === "All" ? "bg-mindshift-raspberry" : ""}
                >
                  All Locations
                </Button>
                <Button 
                  size="sm"
                  variant={location === "Mumbai" ? "default" : "outline"}
                  onClick={() => handleLocationChange("Mumbai")}
                  className={location === "Mumbai" ? "bg-mindshift-raspberry" : ""}
                >
                  <MapPin size={14} className="mr-1" />
                  Mumbai
                </Button>
                <Button 
                  size="sm"
                  variant={location === "Navi Mumbai" ? "default" : "outline"}
                  onClick={() => handleLocationChange("Navi Mumbai")}
                  className={location === "Navi Mumbai" ? "bg-mindshift-raspberry" : ""}
                >
                  <MapPin size={14} className="mr-1" />
                  Navi Mumbai
                </Button>
              </div>
            </div>
            <Separator className="my-4" />
            <p className="text-xs text-gray-400">
              Online map feature is disabled. Browse verified therapists below.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-serif text-mindshift-raspberry">
          {loading ? "Loading therapists..." : 
            filteredTherapists.length === 0
              ? "No therapists found"
              : `${filteredTherapists.length} verified therapists ${location !== "All" ? `in ${location}` : "in Mumbai & Navi Mumbai"}`
          }
        </h2>
        {loading ? (
          <Card className="mindshift-card p-8 text-center">
            <p className="text-gray-500">Loading therapists data...</p>
          </Card>
        ) : filteredTherapists.length === 0 ? (
          <Card className="mindshift-card p-8 text-center">
            <p className="text-gray-500 mb-4">No therapists match your criteria.</p>
            <Button variant="outline" onClick={() => handleLocationChange("All")}>
              View All Locations
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredTherapists.map(therapist => (
              <Card className="p-6 hover:shadow-md transition-shadow" key={therapist.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-mindshift-raspberry flex items-center">
                      {therapist.name}
                      {therapist.verified && (
                        <Check size={16} className="ml-2 text-green-600" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">{therapist.description}</CardDescription>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-700 flex items-start">
                  <MapPin size={16} className="mr-1 mt-0.5 flex-shrink-0 text-mindshift-raspberry" />
                  <span>
                    {therapist.address} 
                    <span className="font-medium ml-1">({therapist.city})</span>
                  </span>
                </p>
                {therapist.verified && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs mt-4 inline-block">
                    Verified Professional
                  </span>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TheraConnect;

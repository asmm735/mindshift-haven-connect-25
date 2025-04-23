
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import TheraConnectMap from "./TheraConnectMap";

type Therapist = {
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [filteredTherapists, setFilteredTherapists] = useState<Therapist[]>([]);

  const fetchTherapists = async () => {
    const { data, error } = await supabase
      .from("therapists")
      .select("*")
      .in("city", ["Mumbai", "Navi Mumbai"])
      .eq("verified", true);
    if (!error) {
      setTherapists(data);
      setFilteredTherapists(data);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    setFilteredTherapists(
      therapists.filter(
        t =>
          t.name.toLowerCase().includes(query) ||
          (t.description?.toLowerCase() ?? "").includes(query) ||
          t.address.toLowerCase().includes(query)
      )
    );
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
              <label className="text-sm font-medium">Your Location</label>
              <Input
                value={location}
                onChange={e => setLocation(e.target.value)}
                disabled
                className="pl-3"
                placeholder="Mumbai"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Therapist</label>
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-3"
                placeholder="e.g., Dr. Patel"
              />
            </div>
            <Button onClick={handleSearch} className="w-full mindshift-button">Search Therapists</Button>
            <Separator className="my-4" />
            <TheraConnectMap therapists={filteredTherapists
              .filter(t => (t.latitude && t.longitude))
              .map(t => ({
                ...t,
                latitude: t.latitude ?? 0,
                longitude: t.longitude ?? 0,
                verified: t.verified ?? false,
              }))}
            />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-serif text-mindshift-raspberry">
          {filteredTherapists.length === 0
            ? "No therapists found"
            : `${filteredTherapists.length} verified therapists in Mumbai & Navi Mumbai`}
        </h2>
        {filteredTherapists.length === 0 ? (
          <Card className="mindshift-card p-8 text-center">
            <p className="text-gray-500 mb-4">No therapists match your search criteria.</p>
            <Button variant="outline" onClick={() => setFilteredTherapists(therapists)}>
              Clear Search
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredTherapists.map(therapist => (
              <Card className="p-4" key={therapist.id}>
                <CardTitle>{therapist.name}</CardTitle>
                <CardDescription>{therapist.description}</CardDescription>
                <p className="mt-2 text-sm text-gray-700">{therapist.address} <span className="font-semibold">({therapist.city})</span></p>
                {therapist.verified && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs mt-2 inline-block">Verified</span>
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

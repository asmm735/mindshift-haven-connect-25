
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { search, mapPin } from "lucide-react";
import TherapistCard from "./TherapistCard";

// Mock therapist data (would be fetched from a backend in a real implementation)
const therapists = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Licensed Clinical Psychologist",
    specialty: "Anxiety, Depression, Trauma",
    rating: 4.9,
    reviewCount: 124,
    image: "https://images.unsplash.com/photo-1525770041010-2a1233dd8152?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsJTIwd29tYW58ZW58MHx8MHx8fDA%3D",
    address: "123 Main Street, Seattle, WA",
    phone: "(206) 555-1234",
    distance: "0.8 miles away",
    accepting: true
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    title: "Licensed Marriage & Family Therapist",
    specialty: "Relationships, Family Conflict, LGBTQ+",
    rating: 4.7,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2Zlc3Npb25hbCUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D",
    address: "456 Elm Street, Seattle, WA",
    phone: "(206) 555-5678",
    distance: "1.2 miles away",
    accepting: true
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    title: "Clinical Social Worker",
    specialty: "Youth, Addiction Recovery, Grief",
    rating: 4.8,
    reviewCount: 87,
    image: "https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmVzc2lvbmFsJTIwd29tYW58ZW58MHx8MHx8fDA%3D",
    address: "789 Oak Avenue, Seattle, WA",
    phone: "(206) 555-9012",
    distance: "2.5 miles away",
    accepting: false
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    title: "Clinical Psychologist",
    specialty: "Stress Management, Work-Life Balance",
    rating: 4.6,
    reviewCount: 76,
    image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmVzc2lvbmFsJTIwbWFufGVufDB8fDB8fHww",
    address: "321 Pine Street, Seattle, WA",
    phone: "(206) 555-3456",
    distance: "3.1 miles away",
    accepting: true
  }
];

const TheraConnect = () => {
  const [location, setLocation] = useState("Seattle, WA");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTherapists, setFilteredTherapists] = useState(therapists);

  const handleSearch = () => {
    // In a real implementation, this would query an API with the location and search terms
    // For demo purposes, we'll just filter the mock data
    const filtered = therapists.filter(
      (therapist) =>
        therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        therapist.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTherapists(filtered);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
      <div className="lg:col-span-1">
        <Card className="mindshift-card sticky top-24">
          <CardHeader>
            <CardTitle className="text-2xl text-mindshift-raspberry">Find a Therapist</CardTitle>
            <CardDescription>
              Connect with mental health professionals in your area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Location</label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <mapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-9"
                    placeholder="Enter your city, state"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Specialties</label>
              <div className="relative">
                <search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  placeholder="e.g., anxiety, depression"
                />
              </div>
            </div>
            
            <Button
              onClick={handleSearch}
              className="w-full mindshift-button"
            >
              Search Therapists
            </Button>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <h3 className="font-medium">Common Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {["Anxiety", "Depression", "Trauma", "Relationships", "Stress", "Grief"].map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => {
                      setSearchQuery(tag);
                      handleSearch();
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-serif text-mindshift-raspberry">
          {filteredTherapists.length === 0
            ? "No therapists found"
            : `${filteredTherapists.length} Therapists near ${location}`}
        </h2>
        
        {filteredTherapists.length === 0 ? (
          <Card className="mindshift-card p-8 text-center">
            <p className="text-gray-500 mb-4">No therapists match your search criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilteredTherapists(therapists);
              }}
            >
              Clear Search
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredTherapists.map((therapist) => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TheraConnect;

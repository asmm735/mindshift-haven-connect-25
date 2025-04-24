
// Update the Therapist type to include new fields
export type Therapist = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  verified: boolean | null;
  phone_number: string | null;
  email: string | null;
};

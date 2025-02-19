
export type Child = {
  id: string;
  parent_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: string;
  allergies?: string[];
  medical_conditions?: string;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: 'parent' | 'provider';
  created_at: string;
  updated_at: string;
};

export type Activity = {
  id: string;
  provider_id: string | null;
  title: string;
  description: string;
  image_url?: string;
  location: string;
  category: string;
  age_range: string;
  capacity: number;
  price: number;
  duration: unknown;  // Changed from string to unknown to match Supabase's interval type
  created_at: string;
  updated_at: string;
  provider?: Profile;
};

export type ActivityDate = {
  id: string;
  activity_id: string;
  start_time: string;
  spots_left: number;
  created_at: string;
  updated_at: string;
  activity?: Activity;
};

export type Booking = {
  id: string;
  user_id: string;
  activity_date_id: string;
  child_id: string;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
  activity_date?: ActivityDate;
  child?: Child;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  booking_id?: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  sender?: Profile;
  receiver?: Profile;
  booking?: Booking;
};

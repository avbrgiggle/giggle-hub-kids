
export type Child = {
  id: string;
  parent_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: string;
  allergies?: string[];
  medical_conditions?: string;
  interests?: string[];
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: 'parent' | 'provider';
  location: string | null;
  username: string | null;
  preferred_communication: string | null;
  preferred_payment_method: string | null;
  referral_code: string | null;
  provider_info?: any;
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
  duration: string;  // Keep as string but handle conversion in components
  created_at: string;
  updated_at: string;
  provider?: Partial<Profile>;  // Make provider fields optional
  images?: ActivityImage[];  // Add relationship to activity images
};

export type ActivityImage = {
  id: string;
  activity_id: string;
  image_url: string;
  created_at: string;
  updated_at: string;
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
  sender?: Partial<Profile>;  // Change to Partial<Profile> to handle incomplete data
  receiver?: Partial<Profile>;  // Change to Partial<Profile> to handle incomplete data
  booking?: Booking;
};

export type ProviderSignupRequest = {
  id: string;
  name: string;
  email: string;
  website_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  tiktok_url?: string;
  activity_types: string[];
  location: string;
  age_range: string;
  duration_types: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
};

export type ProviderSignupCode = {
  id: string;
  code: string;
  email: string;
  expires_at: string;
  used: boolean;
  created_at: string;
  updated_at: string;
};

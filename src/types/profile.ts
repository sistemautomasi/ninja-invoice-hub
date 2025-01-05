export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
  company: string | null;
  job_title: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
}
export type Skill = {
  id?: number | undefined;
  providerId?: string | undefined;
  userId?: string | undefined;
  category: string;
  experience: number;
  nature_of_work: 'onsite' | 'online';
  hourly_rate: number;
  status?: 'open' | 'accepted' | 'completed' | 'rejected' | null | undefined;
  completion?: boolean | undefined;
  approval?: boolean | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
};
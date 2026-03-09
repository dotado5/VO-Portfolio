type EventEntity = {
  event_id: string;
  event_name: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: Date | string | null;
  completed: boolean | null;
};

export type { EventEntity };

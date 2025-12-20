export type PublicConfig = {
  key: string;
  value: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

export type PublicConfigCreate = {
  key: string;
  value: string;
  description?: string;
};

export type PublicConfigUpdate = {
  value: string;
  description?: string;
};

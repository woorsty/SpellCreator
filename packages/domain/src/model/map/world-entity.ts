export type WorldEntityBase = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  articleUrl?: string;
  activeFrom?: number;
  activeTo?: number;
  tags?: string[];
};

export type MapPoint = {
  x: number;
  y: number;
};

export interface AllSportsResponse {
  message: string;
  data: Sport[];
}

export interface Sport {
  SportID: number;
  SportType: string;
}
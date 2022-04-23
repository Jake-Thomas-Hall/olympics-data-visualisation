export interface SportPopularityResponse {
  message: string;
  data: SportPopularity[];
}

export interface SportPopularity {
  SportID: number;
  SportType: string;
  Medals: number;
}
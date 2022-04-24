export interface AthleteListResponse {
  message: string;
  data: AthleteListItem[];
}

export interface AthleteListItem {
  AthleteID: number;
  AthleteFullName: string;
  AthleteGender: string;
  CountryName: string;
  CountryISOalpha2: string;
  Medals: number;
  Golds: number;
  Silvers: number;
  Bronze: number;
  Weighting: number;
}
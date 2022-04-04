export interface CountryAthletesResponse {
  message: string;
  data: CountryAthlete[];
}

export interface CountryAthlete {
  AthleteID: number;
  AthleteFirstName: string;
  AthleteLastName: string;
  AthleteGender: string;
  AthleteMedals: number;
  Golds: number;
  Silvers: number;
  Bronze: number;
}
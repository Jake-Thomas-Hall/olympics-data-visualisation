import { Country } from "./country.response.model";

export interface CountryAthletesResponse {
  message: string;
  data: CountryAthleteResponseData;
}

export interface CountryAthleteResponseData {
  athletes: CountryAthlete[];
  country: Country;
  total?: number;
}

export interface CountryAthlete {
  AthleteID: number;
  AthleteFullName: string;
  AthleteGender: string;
  AthleteMedals: number;
  Golds: number;
  Silvers: number;
  Bronze: number;
  Weighted: number;
}
import { Country } from "./country.response.model";

export interface CountryAthletesResponse {
  message: string;
  data: CountryAthleteResponseData;
}

export interface CountryAthleteResponseData {
  athletes: CountryAthlete[];
  country: Country;
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
export interface CountryPerCapitaMedalsResponse {
  message: string;
  data: CountryPerCapitaMedals[];
}

export interface CountryPerCapitaMedals {
  CountryName: string;
  CountryPopulation: number;
  Medals: number;
  PopulationPerMedal: number;
  CountryID: number;
}
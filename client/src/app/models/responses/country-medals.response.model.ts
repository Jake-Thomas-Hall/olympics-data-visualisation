
export interface CountryMedalSummaryResponse {
  message: string;
  data: CountryMedalSummary;
}

export interface CountryMedalSummary {
  CountryID: number;
  CountryName: string;
  CountryCode: string;
  CountryPopulation: number;
  CountryGDP: number;
  Medals: number;
  Golds: number;
  Silvers: number;
  Bronze: number;
}

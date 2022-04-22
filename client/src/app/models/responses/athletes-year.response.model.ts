export interface AthletesYearResponse {
  message: string;
  data: AthletesYearResponseData;
}

export interface AthletesYearResponseData {
  topCountries: AthleteCountry[];
  allCountries: AthleteCountry[];
  totalAthletes: number;
}

export interface AthleteCountry {
  CountryID: number;
  CountryName: string;
  CountryCode: string;
  CountryISOalpha2?: string;
  TotalAthletes: number;
}
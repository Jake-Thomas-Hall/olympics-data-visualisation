export interface CountryListResponse {
  message: string;
  data: Country[];
}

export interface Country {
  CountryID: number;
  CountryName: string;
  CountryCode: string;
  CountryPopulation?: number;
  CountryGDP?: number;
  CountryISOalpha2?: string;
}
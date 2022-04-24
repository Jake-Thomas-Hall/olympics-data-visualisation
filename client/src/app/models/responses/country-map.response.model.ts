export interface CountryMapResponse {
  message: string;
  data: CountryMap[];
}

export interface CountryMap {
  CountryID: number;
  id: string;
  Medals: number;
}
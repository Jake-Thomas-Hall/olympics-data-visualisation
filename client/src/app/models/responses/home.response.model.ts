export interface HomeResponse {
  message: string;
  data: HomeData;
}

export interface HomeData {
  sports: number;
  athletes: number;
  countries: number;
  years: number;
  medals: number;
  disciplines: number;
  events: number;
  hostCities: number;
}
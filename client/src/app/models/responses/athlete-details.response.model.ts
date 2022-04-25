export interface AthleteDetailsResponse {
  message: string;
  data: AthleteDetail[];
}

export interface AthleteDetail {
  AthleteID: number;
  AthleteFullName: string;
  AthleteGender: string;
  CountryName: string;
  CountryISOalpha2: string;
  CountryID: string;
  VenueYear: number;
  VenueCity: string;
  WinType: string;
  MedalType: string;
  SportType: string;
}
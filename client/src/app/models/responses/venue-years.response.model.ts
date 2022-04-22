export interface VenueYearsResponse {
  message: string;
  data: VenueYear[];
}

export interface VenueYear {
  VenueYear: number;
  VenueCity: string;
}
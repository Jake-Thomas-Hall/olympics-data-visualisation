export interface SportGenderParticipationResponse {
  message: string;
  data: SportGenderParticipation[];
}

export interface SportGenderParticipation {
  VenueYear: number;
  TotalSports: number;
  Women: number;
  Men: number;
}
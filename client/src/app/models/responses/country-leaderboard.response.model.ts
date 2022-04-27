export interface CountryLeaderboardsResponse {
  message: string;
  data: CountryLeaderboardsData;
}

export interface CountryLeaderboardsData {
  summer: CountryLeaderboardItem[];
  winter: CountryLeaderboardItem[];
}

export interface CountryLeaderboardItem {
  CountryID: number;
  CountryISOalpha2?: string;
  CountryName: string;
  Medals: number;
  Golds: number;
  Silvers: number;
  Bronze: number;
  Weighted: number;
  icon: string;
}
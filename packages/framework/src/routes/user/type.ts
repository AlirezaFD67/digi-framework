export interface IUserProfile {
  user_ID: number;
  state_ID: number;
  city_ID: number;
  state_Name: string | null;
  city_Name: string | null;
  user_Name: string;
  user_Family: string;
  user_Sex: number;
  user_Age: number;
  user_Height: number;
  user_Weight: number;
  user_Blood: number;
  user_Phone: string;
  user_Adr: string;
  user_Lat: number;
  user_Lon: number;
  img_Path: string;
  user_Img: string | null;
}

export interface IUpdateProfileRequest {
  user_Name?: string;
  user_Family?: string;
  user_Sex?: number;
  user_Age?: number;
  user_Height?: number;
  user_Weight?: number;
  user_Blood?: number;
  user_Phone?: string;
  user_Adr?: string;
  user_Lat?: number;
  user_Lon?: number;
  user_Img?: string;
  state_ID?: number;
  city_ID?: number;
}


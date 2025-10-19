// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface DoctorEntity {
  doc_ID: number;
  id_Slug: string;
  state_ID: number;
  city_ID: number;
  state_Name: string;
  state_Slug: string;
  city_Name: string;
  city_Slug: string | null;
  doc_Nezam: number;
  doc_Name: string;
  doc_Family: string;
  docName_Slug: string;
  doc_Sex: number;
  ins_Details: string;
  doc_Ins: number | null;
  spc_Title: string;
  spc_Slug: string | null;
  doc_Exp: number;
  acc_Call: number;
  acc_Chat: number;
  acc_Office: number;
  doc_Cel: string;
  doc_Rate: number;
  doc_Like: number;
  avail_Seats: number;
  img_Path: string;
  doc_Img: string;
  doc_Add?: string | null;
  doc_Tel?: string | null;
  isOnline: boolean;
}

export interface DoctorsResponse {
  result: {
    status: string;
    message: string;
  };
  entries: DoctorEntity[];
}

export interface GetDoctorsParams {
  docFamily?: string;
}

export type GetDoctorsResponse = DoctorsResponse;


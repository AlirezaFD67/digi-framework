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

// ============================================================================
// DOCTOR PROFILE TYPES
// ============================================================================

export interface IInsertDoctorProfileRequest {
  proID: number;
  stateID: number;
  cityID: number;
  docNezam: number;
  docMelli: string;
  docName: string;
  docNameEn: string;
  docFamily: string;
  docFamilyEn: string;
  docSex: number;
  docSpc: number;
  docsub: number;
  docTel: string;
  docExp: number;
  visitPrice: number;
  accCall: number;
  accChat: number;
  accOffice: number;
}

export interface IInsertDoctorProfileResponse {
  result: {
    status: string;
    message: string;
  };
  entries: {
    doctorId?: number;
    success: boolean;
  };
}

// ============================================================================
// DOCTOR PROFILE GET TYPES
// ============================================================================

export interface IDoctorProfile {
  state_ID: number;
  city_ID: number;
  pro_ID: number;
  doc_Nezam: number;
  doc_Melli: string;
  doc_Name: string;
  doc_Family: string;
  doc_NameEn: string;
  doc_FamilyEn: string;
  doc_Sex: number;
  doc_Spc: number;
  doc_sub: number;
  doc_Exp: number;
  vis_Price: number;
  doc_Tel: string;
  acc_Call: number;
  acc_Chat: number;
  acc_Office: number;
  doc_Img_Path: string;
  doc_Img: string;
}

export interface IDoctorProfileResponse {
  result: {
    status: string;
    message: string;
  };
  entries: IDoctorProfile[];
  profileInfo: {
    is_Completed: boolean;
  };
}


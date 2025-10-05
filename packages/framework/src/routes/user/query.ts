import { useGenericQuery } from "../../utils/generic-query";
import { GetUserProfile } from "./get";
import { IUserProfile } from "./type";
import { HookOptions, APIHttpType } from "../../types";

export const useUserProfileQuery = (options?: HookOptions)=> {
  return useGenericQuery<APIHttpType<IUserProfile[]>>(
    () => GetUserProfile(),
    ["user", "profile"], 
    options
  );
};

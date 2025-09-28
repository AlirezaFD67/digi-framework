import { UseQueryResult } from "@tanstack/react-query";
import { useGenericQuery } from "../../utils/generic-query";
import { AxiosResponse } from "axios";
import { GetUserProfile } from "./get";
import { IUserProfile } from "./type";
import { HookOptions } from "../../types";

export const useUserProfileQuery = (options?: HookOptions): UseQueryResult<AxiosResponse<IUserProfile>, Error> => {
  return useGenericQuery<AxiosResponse<IUserProfile>>(
    () => GetUserProfile(),
    ["user", "profile"],
    options
  );
};

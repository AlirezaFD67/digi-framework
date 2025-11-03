import { useGenericQuery } from "../../utils/generic-query";
import { useGenericMutation } from "../../utils/generic-mutation";
import { GetUserProfile } from "./get";
import { updateUserProfile } from "./post";
import { IUserProfile, IUpdateUserProfileRequest, IUpdateUserProfileResponse } from "./type";
import { HookOptions, APIHttpType } from "../../types";

export const useUserProfileQuery = (options?: HookOptions)=> {
  return useGenericQuery<APIHttpType<IUserProfile[]>>(
    () => GetUserProfile(),
    ["user", "profile"], 
    options
  );
};

// ============================================================================
// USER PROFILE UPDATE MUTATION
// ============================================================================

export const useUpdateUserProfileMutation = () => {
  return useGenericMutation<APIHttpType<IUpdateUserProfileResponse>, IUpdateUserProfileRequest>(
    updateUserProfile,
    ["user-profile"], // queryKey for invalidation
    {
      onSuccess: () => {
        // Invalidate user profile to refresh data
      }
    }
  );
};

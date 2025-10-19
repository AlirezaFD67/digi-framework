// ============================================================================
// IMPORTS
// ============================================================================

import APIHttp from "../../utils/api-http";
import API_ENDPOINTS from "../../utils/api-endpoints";
import { AcceptLearningRequest, AcceptLearningResponse } from "./type";

// ============================================================================
// FUNCTIONS
// ============================================================================

export const AcceptLearning = async (data: AcceptLearningRequest): Promise<AcceptLearningResponse> => {
  return APIHttp.put(API_ENDPOINTS.ARTICLES.ACCEPT_LEARNING, data);
};


// ============================================================================
// IMPORTS
// ============================================================================

import { Loader } from "lucide-react";

// ============================================================================
// COMPONENT
// ============================================================================

export default function LoadingScreen() {
  return (
    <div className="w-[220px] h-[150px] absolute top-1/2 right-1/2 translate-x-1/2 shadow-md -translate-y-1/2 flex flex-col items-center justify-center bg-white border rounded">
      <Loader className="w-10 h-10 animate-spin" />
    </div>
  );
}

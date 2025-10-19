"use client";

import { Button, useAuthContext } from "@workspace/custom-ui";
import { LogOutIcon } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuthContext()
  const userData = user as any;
  
  return (
    <div>
      <h1>{userData?.user_Name} {userData?.user_Family} {userData?.user_Phone}</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Button onClick={() => {
        logout()
      }}>
        <LogOutIcon />
          Logout
      </Button>
    </div>
  )
}
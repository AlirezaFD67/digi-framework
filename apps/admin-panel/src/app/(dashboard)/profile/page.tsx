"use client";

import { Button, useAuthContext } from "@workspace/custom-ui";
import { LogOutIcon } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuthContext()
  return (
    <div>
      <h1>{user?.user_Name} {user?.user_Family} {user?.user_Phone}</h1>
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
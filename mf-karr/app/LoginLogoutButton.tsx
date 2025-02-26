"use client";
import { Button } from "@nextui-org/button";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginLogoutButton() {
  const { data: session }: any = useSession();
  if (session) {
    return (
      <div className="flex items-center gap-2">
        {/* <div>Hi, {session.user.name}! </div> */}
        <Button
          isIconOnly
          variant="bordered"
          onPress={() => signOut()}
          className="w-full p-2"
        >
          Sign out {session.user.name} ?
        </Button>
      </div>
    );
  }
  return <div></div>;
}

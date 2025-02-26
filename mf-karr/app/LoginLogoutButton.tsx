"use client";
import { Button } from "@nextui-org/button";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginLogoutButton() {
  const { data: session }: any = useSession();
  if (session) {
    return (
      <Button
        isIconOnly
        variant="bordered"
        onPress={() => signOut()}
        className="w-full"
      >
        Sign out
      </Button>
    );
  }
  return (
    <Button
      isIconOnly
      variant="bordered"
      onPress={() => signIn()}
      className="w-full"
    >
      Sign In
    </Button>
  );
}

"use client";
import { title } from "@/components/primitives";
import { useSession } from "next-auth/react";
export default function AboutPage() {
  const { data: session } = useSession();
  console.log(session?.user?.data?.name);
  return (
    <div>
      <h1 className={title()}>Dashboard</h1>
      <h1>Hallo {session?.user?.data?.name}</h1>
    </div>
  );
}

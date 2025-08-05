"use client";
import { useState, useEffect } from "react";
import { title } from "@/components/primitives";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then(({ ok, error }: any) => {
      if (error) {
        toast.error("Oops, something went wrong");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session]);
  return (
    <div>
      <h1 className={title()}>Login</h1>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className="mt-4"
          color="primary"
          type="submit"
          isLoading={loading}
        >
          Login
        </Button>
      </form>

      <p className="mt-2">
        Already have an account?{" "}
        <Link href="/login" className="text-primary">
          Login here
        </Link>
      </p>
    </div>
  );
}

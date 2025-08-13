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
      if (ok) {
        toast.success("Login successful");
      }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="bordered"
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="bordered"
          />
          <Button
            className="w-full"
            color="primary"
            type="submit"
            isLoading={loading}
          >
            Login
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

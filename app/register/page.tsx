"use client";
import { useState } from "react";
import { title } from "@/components/primitives";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Link from "next/link";
import fetchApi from "@/utils/fetchApi";
import { toast } from "react-toastify";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    const data = {
      email: email,
      password: password,
      name: name,
    };
    const { data: dataUser } = await fetchApi("/auth/register", "POST", data);
    setLoading(false);
    if (dataUser.status == 400) return toast.error("GAGAL REGISTER");
    return toast.success("BERHASIL REGISTER");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="bordered"
          />
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
            Register
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

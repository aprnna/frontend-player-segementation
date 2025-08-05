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
    <div>
      <h1 className={title()}>Register</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"
      >
        <Input
          placeholder="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          Register
        </Button>
        <p className="mt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

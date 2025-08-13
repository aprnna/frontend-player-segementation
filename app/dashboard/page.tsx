"use client";
import { title } from "@/components/primitives";
import { Input } from "@heroui/input";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";
import fetchApi from "@/utils/fetchApi";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(new FormData(e.currentTarget));
      console.log("Form data:", data);
      const { data: dataUser } = await fetchApi(
        "/analyze/full_steam_id",
        "POST",
        formData
      );

      if (dataUser.status === 400) {
        toast.error(dataUser.message || "Proses Gagal");
        return;
      }
      if (dataUser.status === "success") {
        router.push(`/dashboard/${dataUser.data.proses_id}`);
        toast.success("Proses berhasil");
      } else {
        toast.error("Proses Gagal");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat memproses request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className={title()}>Welcome, {session?.user.data.name}</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"
      >
        <Input
          id="steam_ids"
          name="steam_ids"
          label="Steam Id"
          labelPlacement="outside"
          placeholder="Masukkan List Steam id"
        />
        <Input
          name="file"
          id="name"
          type="file"
          label="File"
          labelPlacement="outside"
          placeholder="Masukkan File List Steam"
        />
        <Button
          type="submit"
          isLoading={loading}
          className="w-full"
          color="primary"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

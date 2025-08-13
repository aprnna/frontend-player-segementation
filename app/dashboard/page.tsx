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
  const [inputData, setInputData] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!inputData) {
      toast.error("Input cannot be empty");
      return;
    }
    const steamIds = inputData.split(",");
    console.log(steamIds);
    setLoading(true);
    const data = {
      steam_ids: steamIds,
    };
    const { data: dataUser } = await fetchApi(
      "/analyze/full_steam_id",
      "POST",
      data
    ).finally(() => setLoading(false));
    if (dataUser.status == 400) return toast.error("Proses Gagal");
    router.push(`/dashboard/${dataUser.data.proses_id}`);
    return toast.success("Proses berhasil");
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className={title()}>Welcome, {session?.user.data.name}</h1>
      <Form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"
      >
        <Input
          label="Steam Id"
          labelPlacement="outside"
          placeholder="Masukkan List Steam id"
          onChange={(e) => setInputData(e.target.value)}
        />
        <Button
          type="submit"
          isLoading={loading}
          className="w-full"
          color="primary"
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}

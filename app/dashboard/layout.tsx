"use client";

import Sidebar from "@/components/sidebar";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-full">
      <Sidebar />
      <div className="inline-block justify-start w-full container flex-1">
        {children}
      </div>
    </section>
  );
}

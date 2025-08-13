"use client";

import Sidebar from "@/components/sidebar";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex items-center justify-center h-full">
      <Sidebar />
      <div className="inline-block justify-center w-full container">
        {children}
      </div>
    </section>
  );
}

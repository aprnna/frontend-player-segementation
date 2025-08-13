"use client";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSession, signOut } from "next-auth/react";
import { title } from "./primitives";
import fetchApi from "@/utils/fetchApi";
import { Button } from "@heroui/button";

interface menuItems {
  text: string;
  href: string;
}

export default function Sidebar() {
  let pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [menuItems, setMenuItems] = useState<menuItems[]>([
    {
      text: "Dashboard",
      href: "/dashboard",
    },
  ]);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const { data: session } = useSession();
  async function getAnalyze() {
    try {
      const response = await fetchApi("/analyze", "GET");
      if (response.status_code === 200 && Array.isArray(response.data)) {
        const apiMenus = response.data.map((item: any) => {
          const steamIds = item.Steam_id.split(",").map((id: string) =>
            id.trim()
          );
          const countSteamIds = steamIds.length;

          return {
            href: `/dashboard/${item.Proses_id}`,
            text: `${countSteamIds} Steam ID`,
          };
        });

        setMenuItems((prev) => {
          const merged = [...prev, ...apiMenus];
          const unique = merged.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.href === item.href)
          );
          return unique;
        });
      }
    } catch (err) {
      console.error("Error fetching analyze menu:", err);
    }
  }
  useEffect(() => {
    if (!hasFetched) {
      setMenuItems([{ text: "Dashboard", href: "/dashboard" }]);
      getAnalyze();
      setHasFetched(true);
    }
  }, [hasFetched]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div
      className={clsx(
        "flex flex-col min-h-screen p-3  transition-all duration-300 drop-shadow-md relative z-50",
        isExpanded ? "w-64" : "w-16",
        "bg-primary h-full"
      )}
    >
      <button
        className={`mb-5 text-white hover:bg-white/20 hover:text-white transition-all duration-300 p-3.5 rounded-xl flex flex-col ${isExpanded ? " items-center" : "mx-auto"}`}
        // onClick={toggleSidebar}
      >
        {isExpanded ? (
          <div className="flex items-center gap-2 justify-between">
            <h1 className={clsx("font-bold text-xl")}>Player Segmentasi</h1>
          </div>
        ) : (
          <Icon icon="icon-park-outline:back" />
        )}
      </button>
      <div className="flex flex-col space-y-4 relative">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            className={clsx(
              "flex flex-col text-white",
              isExpanded ? "items-start px-3" : "items-center",
              "cursor-pointer hover:bg-white/20 hover:text-primary transition-all duration-300 p-3 py-4 rounded-xl relative",
              pathname === item.href ? "bg-white/20 font-bold" : ""
            )}
            href={item.href}
            onClick={() => console.log("pathnow:", pathname)}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="flex">
              {isExpanded && (
                <span className="ml-6 items-center justify-center flex text-start font-medium">
                  {item.text}
                </span>
              )}
            </div>
            {!isExpanded && (
              <div
                className={clsx(
                  "absolute left-full top-1/2 transform -translate-y-1/2  text-white shadow-md p-2 px-4 rounded ml-2 transition-all duration-300",
                  hoveredItem === index ? "opacity-100 z-50" : "opacity-0 -z-50"
                )}
              >
                {item.text}
              </div>
            )}
          </Link>
        ))}
        {session?.user?.data?.name && (
          <Button
            onClick={() => signOut()}
            className={clsx(
              "flex flex-col w-full bg-red-300/80 text-red-800",
              isExpanded ? "items-start px-3" : "items-center",
              "cursor-pointer hover:bg-white/20 hover:text-primary transition-all duration-300 p-3 py-4 rounded-xl relative"
            )}
          >
            <div className="flex w-full">
              <span className="ml-6 items-center justify-center flex text-start font-medium">
                Logout
              </span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}

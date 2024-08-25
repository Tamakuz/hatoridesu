"use client";
import useFetch from "@/hooks/useFetch";
import { AnimeDocument } from "@/types/anime.type";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { encodeId } from "@/lib/utils";

const PopularSection = () => {
  const { data, isLoading, error, get } = useFetch() as {
    data: AnimeDocument[] | null;
    isLoading: boolean;
    error: Error | null;
    get: (url: string) => void;
  };

  useEffect(() => {
    get("/api/popular?limit=12&isPopulate=false");
  }, []);

  const [imageLoading, setImageLoading] = useState<boolean[]>(
    new Array(6).fill(true)
  );

  const handleImageLoad = (index: number) => {
    setImageLoading((prev) => {
      const newLoading = [...prev];
      newLoading[index] = false;
      return newLoading;
    });
  };

  return (
    <section className="w-full h-fit px-3">
      <h1 className="text-2xl font-bold text-white mb-3">Popular</h1>
      <div className="grid grid-cols-3 gap-3 pb-[60px]">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-[160px] rounded-md border-none"
              />
            ))
          : data && Array.isArray(data)
          ? data.map((anime, index) => (
              <Link
                href={`/${encodeId(anime._id as string)}`}
                key={index}
                className="flex flex-col gap-2"
              >
                <div className="relative w-full h-[160px]">
                  {imageLoading[index] && (
                    <Skeleton className="absolute inset-0 rounded-md" />
                  )}
                  <img
                    src={anime.poster || ""}
                    alt={anime.title}
                    className="w-full h-full object-cover rounded-md"
                    onLoad={() => handleImageLoad(index)}
                  />
                </div>
                <p className="text-white text-sm line-clamp-2">{anime.title}</p>
              </Link>
            ))
          : null}
      </div>
    </section>
  );
};

export default PopularSection;

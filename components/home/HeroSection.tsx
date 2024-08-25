"use client";
import useFetch from "@/hooks/useFetch";
import { AnimeDocument } from "@/types/anime.type";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { encodeId } from "@/lib/utils";

const HeroSection = () => {
  const { data, isLoading, error, get } = useFetch() as {
    data: AnimeDocument[];
    isLoading: boolean;
    error: Error | null;
    get: (url: string) => void;
  };

  useEffect(() => {
    get("/api/popular?limit=1&genres=4&isPopulate=false");
  }, []);

  const genresSlice = data && data.length > 0 ? data[0].genres.slice(0, 4) : [];
  const encodedId = !isLoading && data && data.length > 0 ? encodeId(data[0]._id as string) : null;

  return (
    <section className="relative w-full h-[60vh] overflow-hidden">
      {isLoading ? (
        <Skeleton className="w-full h-full rounded-none border-none" />
      ) : (
        <>
          <img
            src={data[0]?.poster}
            alt={data[0]?.title}
            className="w-full h-full object-cover scale-105"
          />
          <h1 className="absolute z-10 top-0 left-0 right-0 text-white text-2xl font-bold py-4 px-3 line-clamp-2">
            {data[0]?.title}
          </h1>
        </>
      )}

      <div className="z-10 absolute bottom-0 h-fit w-full pb-3 space-y-5 px-3">
        <div className="flex justify-between items-center gap-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="w-1/4 h-4 bg-primary" />
              ))
            : genresSlice?.map((genre: any) => (
                <p key={genre._id} className="text-white text-sm">
                  {genre.label}
                </p>
              ))}
        </div>
        <div className="flex justify-center items-center w-full gap-3">
          <Button
            variant="ghost"
            className="text-white hover:text-white/80 hover:bg-transparent"
          >
            <Plus />
          </Button>
          <Link href={`/${encodedId}`} className="w-full">
            <Button
              variant="secondary"
              className="bg-primary hover:bg-primary/80 w-full"
            >
              Play
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent opacity-80"></div>
    </section>
  );
};

export default HeroSection;

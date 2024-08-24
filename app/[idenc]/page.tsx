"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useFetch from "@/hooks/useFetch";
import { AnimeDocument } from "@/types/anime.type";
import { Dot, MoveLeft, Play } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const StreamPage = ({ params }: { params: { idenc: string } }) => {
  const { data, isLoading, error, get } = useFetch() as {
    data: AnimeDocument | null;
    isLoading: boolean;
    error: Error | null;
    get: (url: string) => void;
  };
  const urlDecrypt = decodeURIComponent(params.idenc);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [episodeViewMode, setEpisodeViewMode] = useState('detailed'); // 'detailed' or 'simple'
  const [selectedEpisode, setSelectedEpisode] = useState<any | null>(null);

  useEffect(() => {
    get(`/api/anime/${urlDecrypt}`);
  }, []);

  useEffect(() => {
    if (data?.episodes) {
      setSelectedEpisode(data.episodes[0]);
    }
  }, [data]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleEpisodeView = () => {
    setEpisodeViewMode(episodeViewMode === 'detailed' ? 'simple' : 'detailed');
  };

  return (
    <main>
      <section>
        <Link href="/">
          <MoveLeft className="w-10 h-10 text-white py-2" />
        </Link>
      </section>
      <section className="px-3">
        {isLoading || !selectedEpisode ? (
          <Skeleton className="w-full aspect-video rounded-lg bg-gray-500" />
        ) : selectedEpisode.streams.length > 0 ? (
          <iframe
            src={selectedEpisode.streams[0].urlStream || ""}
            className="w-full h-full rounded-lg aspect-video"
            allowFullScreen
            allow="autoplay"
          />
        ) : null}
      </section>
      <section className="p-3 text-gray-300 flex flex-col gap-3">
        <div>
          {isLoading ? (
            <Skeleton className="h-10 bg-gray-500" />
          ) : (
            <h1 className="text-2xl font-semibold line-clamp-2 text-primary">
              {data?.title}
            </h1>
          )}
          {isLoading ? (
            <Skeleton className="w-20 bg-gray-500" />
          ) : (
            <span className="text-sm flex gap-1 items-center">
              {data?.rilis?.split(" ")[2]} {data?.type}
            </span>
          )}
        </div>
        <div onClick={toggleCollapse} className="text-sm cursor-pointer">
          {isLoading ? (
            <Skeleton className="w-full h-20 bg-gray-500" />
          ) : isCollapsed ? (
            `${data?.synopsis ? `${data?.synopsis?.substring(0, 100)}...` : ""}`
          ) : (
            data?.synopsis
          )}
        </div>
      </section>
      <section className="p-3">
        <div className="pb-2 flex justify-between items-center">
          {isLoading ? (
            <Skeleton className="w-20 h-6 bg-gray-500" />
          ) : (
            data &&
            data.episodes && (
              <>
                <span className="font-semibold text-gray-300">
                  Episodes ({data.episodes.length})
                </span>
                <button
                  onClick={toggleEpisodeView}
                  className="text-xs text-primary"
                >
                  {episodeViewMode === "detailed"
                    ? "Simplify View"
                    : "Detailed View"}
                </button>
              </>
            )
          )}
        </div>
        <div
          className={`grid ${
            episodeViewMode === "simple"
              ? "grid-cols-5 gap-2"
              : "flex flex-col gap-3"
          }`}
        >
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="w-full h-10 bg-gray-500" />
              ))
            : data?.episodes?.map((episode) => (
                <div
                  key={episode.episodeNumber}
                  onClick={() => setSelectedEpisode(episode)}
                  className={`bg-primary p-3 ${
                    episodeViewMode === "detailed"
                      ? "rounded-tr-xl rounded-b-xl justify-between"
                      : "rounded-lg justify-center"
                  } flex items-center ${
                    selectedEpisode && selectedEpisode.episodeNumber === episode.episodeNumber ? 'bg-red-400' : ''
                  }`}
                >
                  <span className="text-sm text-secondary-foreground">
                    {episodeViewMode === "detailed"
                      ? `Episode ${episode.episodeNumber}`
                      : episode.episodeNumber}
                  </span>
                  {episodeViewMode === "detailed" && (
                    <Play className="w-4 h-4 text-secondary-foreground" />
                  )}
                </div>
              ))}
        </div>
      </section>
    </main>
  );
};

export default StreamPage;

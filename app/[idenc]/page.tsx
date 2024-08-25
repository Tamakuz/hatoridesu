"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useFetch from "@/hooks/useFetch";
import { decodeId } from "@/lib/utils";
import { AnimeDocument } from "@/types/anime.type";
import { Bookmark, Dot, MoveLeft, Play, Zap } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {cn} from "@/lib/utils"
import {motion} from "framer-motion"

// Component for streaming anime episodes
const StreamPage = ({ params }: { params: { idenc: string } }) => {
  // Fetching data using custom hook
  const { data, isLoading, error, get } = useFetch() as {
    data: AnimeDocument | null;
    isLoading: boolean;
    error: Error | null;
    get: (url: string) => void;
  };
  // Decrypting URL parameter
  const urlDecrypt = decodeId(params.idenc);
  // State for UI control
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [episodeViewMode, setEpisodeViewMode] = useState('detailed'); // 'detailed' or 'simple'
  const [selectedEpisode, setSelectedEpisode] = useState<any | null>(null);
  const [streamIndex, setStreamIndex] = useState(0);

  // Fetch anime data on component mount
  useEffect(() => {
    get(`/api/anime/${urlDecrypt}`);
  }, []);

  // Set the first episode as selected when data is loaded
  useEffect(() => {
    if (data?.episodes) {
      setSelectedEpisode(data.episodes[0]);
    }
  }, [data]);

  // Toggle synopsis collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Toggle between detailed and simple episode views
  const toggleEpisodeView = () => {
    setEpisodeViewMode(episodeViewMode === 'detailed' ? 'simple' : 'detailed');
  };

  // Switch between available streams for the selected episode
  const switchStream = () => {
    if (selectedEpisode && selectedEpisode.streams.length > 1) {
      setStreamIndex((prevIndex) => (prevIndex + 1) % selectedEpisode.streams.length);
    }
  };

  return (
    <main className="pb-[60px]">
      {/* Navigation back link */}
      <section>
        <Link href="/">
          <MoveLeft className="w-10 h-10 text-white py-2" />
        </Link>
      </section>
      {/* Video player section */}
      <section className="px-3">
        {isLoading || !selectedEpisode ? (
          <Skeleton className="w-full aspect-video rounded-lg bg-gray-500" />
        ) : selectedEpisode.streams.length > 0 ? (
          <iframe
            src={selectedEpisode.streams[streamIndex].urlStream || ""}
            className="w-full h-full rounded-lg aspect-video"
            allowFullScreen
            allow="autoplay"
          />
        ) : null}
      </section>
      {/* Anime details and synopsis section */}
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
      {/* Stream switching and bookmarking section */}
      <section className="px-3 flex gap-2">
        {isLoading ? (
          <>
            <Skeleton className="w-24 h-10 bg-gray-500 rounded-tl-xl rounded-br-xl" />
            <Skeleton className="w-24 h-10 bg-gray-500 rounded-tl-xl rounded-br-xl" />
          </>
        ) : (
          selectedEpisode && (
            <>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={switchStream}
                className={cn("text-gray-300 bg-gray-800 text-xs px-3 py-2 rounded-tl-xl rounded-br-xl flex items-center gap-2", {
                  "opacity-50 cursor-not-allowed": selectedEpisode.streams.length <= 1
                })}
                disabled={selectedEpisode.streams.length <= 1}
              >
                <Zap className="w-4 h-4" />
                Switch Server
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="text-gray-300 bg-gray-800 text-xs px-3 py-2 rounded-tl-xl rounded-br-xl flex items-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Bookmark
              </motion.button>
            </>
          )
        )}
      </section>
      {/* Episode list and view mode toggle section */}
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
          className={cn({
            'grid grid-cols-5 gap-2': episodeViewMode === "simple",
            'flex flex-col gap-3': episodeViewMode !== "simple"
          })}
        >
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="w-full h-10 bg-gray-500" />
              ))
            : data?.episodes?.map((episode) => (
                <div
                  key={episode.episodeNumber}
                  onClick={() => setSelectedEpisode(episode)}
                  className={cn("bg-primary p-3 flex items-center", {
                    "rounded-tr-xl rounded-b-xl justify-between": episodeViewMode === "detailed",
                    "rounded-lg justify-center": episodeViewMode !== "detailed",
                    "bg-gray-800 text-gray-300": selectedEpisode && selectedEpisode.episodeNumber === episode.episodeNumber,
                    "text-secondary-foreground": !(selectedEpisode && selectedEpisode.episodeNumber === episode.episodeNumber)
                  })}
                >
                  <span className="text-sm ">
                    {episodeViewMode === "detailed"
                      ? `Episode ${episode.episodeNumber}`
                      : episode.episodeNumber}
                  </span>
                  {episodeViewMode === "detailed" && (
                    <Play className="w-4 h-4" />
                  )}
                </div>
              ))}
        </div>
      </section>
    </main>
  );
};

export default StreamPage;

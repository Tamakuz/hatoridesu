'use client'
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { debounce } from 'lodash';
import useFetch from '@/hooks/useFetch';
import { Skeleton } from '@/components/ui/skeleton';
import { encodeId } from '@/lib/utils';
import Link from 'next/link';

const SearchPage = () => {
  const {get, data, error, isLoading} = useFetch()
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const debouncer = debounce(() => {
      if (searchTerm && searchTerm !== debouncedSearchTerm) {
        setDebouncedSearchTerm(searchTerm);
      }
    }, 1000);
    debouncer();

    return () => {
      debouncer.cancel();
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      get(`/api/search?searchQuery=${debouncedSearchTerm}`)
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setImageLoading(new Array(data.length).fill(true));
    }
  }, [data]);

  const handleImageLoad = (index: number) => {
    setImageLoading((prev) => {
      const newLoading = [...prev];
      newLoading[index] = false;
      return newLoading;
    });
  };

  return (
    <main className="p-3 flex flex-col gap-3">
      <section className="flex items-center bg-gray-800 rounded-full p-2 px-4 text-gray-300">
        <Search className="w-5 h-5 text-white" />
        <input
          type="text"
          className="bg-transparent text-white placeholder-white outline-none w-full ml-2"
          placeholder="Search anime..."
          onChange={handleSearchChange}
          value={searchTerm}
        />
      </section>
      <section className="grid grid-cols-3 gap-3 pb-[60px]">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-[160px] rounded-md border-none"
              />
            ))
          : data && Array.isArray(data) && data.length > 0
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
                <p className="text-gray-300 text-sm line-clamp-2">{anime.title}</p>
              </Link>
            ))
          : <p className="text-gray-300 text-center col-span-3">No results found.</p>}
      </section>
    </main>
  );
};

export default SearchPage;
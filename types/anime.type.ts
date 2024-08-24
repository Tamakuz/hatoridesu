import { Document, Types } from 'mongoose';

export interface Season {
  label: string;
  slug: string;
}

export interface Studio {
  label: string;
  slug: string;
}

export interface Genre {
  label: string;
  slug: string;
}

export interface Episode {
  episodeNumber: string;
  episodeSlug: string;
  streams: Types.ObjectId[];
}

export interface AnimeDocument extends Document {
  title: string;
  altTitle?: string;
  poster: string;
  rating: string;
  author: string;
  season: Season;
  episode: string;
  rilis: string;
  studio: Studio;
  duration: string;
  type: string;
  status: string;
  genres: Genre[];
  synopsis: string;
  episodes: Episode[];
  createdAt: Date;
  updatedAt: Date;
}

export type AnimeModel = AnimeDocument;

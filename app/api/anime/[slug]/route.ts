import { NextRequest, NextResponse } from "next/server"
import Anime from "@/models/anime.model";
import Stream from "@/models/stream.model";
import dbConnect from "@/lib/dbConnect";

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  await dbConnect();
  const slug = params.slug;
  
  try {
    const anime = await Anime.findById(slug).populate({
      path: "episodes.streams",
      model: Stream,
      match: {
        urlStream: { $regex: /^(https:\/\/www\.blogger\.com\/|https:\/\/new\.uservideo\.xyz\/)/ }
      }
    });

    if (!anime.episodes.every((episode: any) => episode.streams.length > 0)) {
      const animeWithoutMatch = await Anime.findById(slug).populate("episodes.streams");
      return NextResponse.json(animeWithoutMatch);
    }
    
    if (!anime) {
      return NextResponse.json({ message: "Anime not found" }, { status: 404 });
    }
    return NextResponse.json(anime);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
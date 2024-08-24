import dbConnect from "@/lib/dbConnect";
import Anime from "@/models/anime.model";
import Stream from "@/models/stream.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  await dbConnect();
  try {
    const limitParam = request.nextUrl.searchParams.get('limit');
    const genresParam = request.nextUrl.searchParams.get('genres');
    const isPopulate = request.nextUrl.searchParams.get('isPopulate');
    const limit = parseInt(limitParam || '10', 10);
    
    const query = {
      $and: [
        {
          rating: {
            $exists: true,
            $nin: ["N/A", "?", "Menit"],
            $gte: 8
          }
        },
        genresParam ? { [`genres.${genresParam}`]: { $exists: true } } : {}
      ]
    };

    let anime = [];
    while (anime.length === 0) {
      const skip = Math.floor(Math.random() * 2000); // Generate a random skip value up to 2000
      let animeQuery = Anime.find(query).sort({ rating: -1, createdAt: -1 }).skip(skip).limit(limit);

      if (isPopulate === 'true') {
        animeQuery = animeQuery.populate({
          path: "episodes.streams",
          model: Stream
        });
      }

      anime = await animeQuery;
    }

    return NextResponse.json(anime);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
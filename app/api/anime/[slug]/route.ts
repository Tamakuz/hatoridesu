import { NextRequest, NextResponse } from "next/server"
import Anime from "@/models/anime.model";
import Stream from "@/models/stream.model";
import dbConnect from "@/lib/dbConnect";

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  await dbConnect();
  const slug = params.slug;
  
  try {
    const anime = await Anime.findOne({ title: slug }).populate({
      path: "episodes.streams",
      model: Stream
    });
    if (!anime) {
      return NextResponse.json({ message: "Anime not found" }, { status: 404 });
    }
    return NextResponse.json(anime);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
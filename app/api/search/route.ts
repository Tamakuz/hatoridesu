import dbConnect from '@/lib/dbConnect';
import Anime from '@/models/anime.model';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  try {
    await dbConnect();

    const searchQuery = request.nextUrl.searchParams.get('searchQuery') || '';

    // Bersihkan input pencarian
    const cleanInput = (input: string) => {
      return input.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();
    };

    const cleanedQuery = cleanInput(searchQuery);

    // Gunakan fitur search dari Mongoose
    const animeResults = await Anime.find({
      $text: { $search: cleanedQuery }
    }, {
      score: { $meta: "textScore" }
    }).sort({
      score: { $meta: "textScore" }
    }).limit(30);

    return new Response(JSON.stringify(animeResults), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

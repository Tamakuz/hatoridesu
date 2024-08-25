import dbConnect from '@/lib/dbConnect';
import Anime from '@/models/anime.model';
import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    await dbConnect();

    const searchQuery = request.nextUrl.searchParams.get('searchQuery') || '';

    // Bersihkan input pencarian
    const cleanInput = (input: string) => {
      return input.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();
    };

    const cleanedQuery = cleanInput(searchQuery);

    // Prioritaskan pencarian berdasarkan judul penuh
    const animeResults = await Anime.find({
      $or: [
        { title: { $regex: cleanedQuery, $options: 'i' } },
        { altTitle: { $regex: cleanedQuery, $options: 'i' } },
        { synopsis: { $regex: cleanedQuery, $options: 'i' } },
        { 'genres.label': { $regex: cleanedQuery, $options: 'i' } }
      ]
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

import { NextResponse } from 'next/server';
import { searchTracks } from '@/lib/spotify';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ tracks: [] });
    }

    const data = await searchTracks(query);
    
    if (data.error) {
      console.error('Spotify API Error:', data.error);
      // Jika butuh premium atau error lain, kirim list kosong agar tidak crash
      return NextResponse.json({ tracks: [], message: data.error.message || 'Spotify error' });
    }

    const tracks = data.tracks?.items?.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((_artist) => _artist.name).join(', '),
      album: track.album.name,
      thumbnail: track.album.images[0]?.url,
      external_url: track.external_urls.spotify,
    })) || [];

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Spotify Search Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}

import Parser from 'rss-parser';
import { sources } from '../../../lib/sources'; // <-- KESİN YOL (3 seviye yukarı çıkıyor)
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET(request) {
  const parser = new Parser({
    customFields: {
      item: [['media:content', 'mediaContent'], ['enclosure', 'enclosure'], ['image', 'image']],
    },
  });

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const region = searchParams.get('region');

  let activeSources = sources;

  if (category && category !== 'all') {
    activeSources = activeSources.filter(s => s.category === category);
  }
  
  if (region && region !== 'all') {
    activeSources = activeSources.filter(s => s.region === region);
  }

  const feedPromises = activeSources.map(async (source) => {
    try {
      const feed = await parser.parseURL(source.url);
      return feed.items.map(item => {
        let imageUrl = item.enclosure?.url || item['media:content']?.$.url || item.image || null;

        return {
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          snippet: item.contentSnippet || item.content,
          source: source.name,
          img: imageUrl, 
          category: source.category,
          region: source.region
        };
      });
    } catch (error) {
      return [];
    }
  });

  const results = await Promise.all(feedPromises);
  const flatNews = results.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return NextResponse.json(flatNews);
}
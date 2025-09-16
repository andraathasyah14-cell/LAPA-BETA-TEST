/**
 * @fileOverview This file provides a function to fetch OpenGraph metadata from a given URL.
 */

async function getOpenGraphData(url: string): Promise<{ title?: string; description?: string; imageUrl?: string; } | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch URL: ${response.statusText}`);
      return undefined;
    }
    const html = await response.text();

    const getMetaTag = (property: string) => {
      const regex = new RegExp(`<meta property="${property}" content="(.*?)"`);
      const match = html.match(regex);
      return match ? match[1] : undefined;
    };

    const title = getMetaTag('og:title');
    const description = getMetaTag('og:description');
    const imageUrl = getMetaTag('og:image');

    return { title, description, imageUrl };
  } catch (error) {
    console.error('Error fetching OpenGraph data:', error);
    return undefined;
  }
}

export { getOpenGraphData };

import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = `https://${siteConfig.domain}`;

  // 1. Definisikan Halaman Statis (Halaman Utama)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    // Kalau lu punya halaman list/settings dan mau di-index, bisa tambah di sini
    // { url: `${baseUrl}/list`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // 2. Ambil data URL dari Supabase (Dibatasi 10000 biar server gak jebol kalau link lu udah jutaan)
  const { data: urls, error } = await supabase
    .from('urls')
    .select('slug, created_at, fake_url')
    .order('created_at', { ascending: false })
    .limit(10000);

  if (error || !urls) {
    return staticRoutes; // Kalau database error, seenggaknya sitemap halaman utama tetep jalan
  }

  // 3. Looping data dan pisahin V1 sama V2
  const dynamicRoutes: MetadataRoute.Sitemap = urls.map((url) => {
    // Deteksi logika V1 atau V2 (sama kayak yang di halaman list)
    const isV2 = /^\d+$/.test(url.slug) || !!url.fake_url;
    
    // Tembok Pemisah Rute
    const fullUrl = isV2 ? `${baseUrl}/go/${url.slug}` : `${baseUrl}/${url.slug}`;

    return {
      url: fullUrl,
      lastModified: new Date(url.created_at),
      changeFrequency: 'never', // Karena link pendek biasanya gak berubah isinya
      priority: 0.5, // Priority standar buat link hasil generate
    };
  });

  // Gabungin halaman statis dan dinamis
  return [...staticRoutes, ...dynamicRoutes];
}

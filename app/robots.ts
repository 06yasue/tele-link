import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Kita blokir bot Google biar gak ngindeks halaman API dan Dashboard privasi user
      disallow: ['/api/', '/list', '/settings'], 
    },
    sitemap: `https://${siteConfig.domain}/sitemap.xml`,
  };
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;

  const { data, error } = await supabase
    .from('urls')
    .select('original_url, hitcount')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return NextResponse.redirect(new URL('/404-not-found', request.url));
  }

  await supabase
    .from('urls')
    .update({ hitcount: data.hitcount + 1 })
    .eq('slug', slug);

  return NextResponse.redirect(data.original_url);
}

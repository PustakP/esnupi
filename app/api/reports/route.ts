import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { Report } from '@/lib/definitions';

// GET /api/reports - fetch all reports (aka list)
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // map db rows -> app report shape (aka camel + nested location)
    const mapped: Report[] = (data ?? []).map((r: any) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      description: r.description,
      location: { lat: r.lat, lng: r.lng },
      address: r.address,
      imageUrl: r.image_url,
      status: r.status,
      createdAt: r.created_at,
      resolvedAt: r.resolved_at ?? undefined,
      upvotes: r.upvotes,
      priority: r.priority,
      assignedTo: r.assigned_to ?? undefined,
    }));

    return NextResponse.json(mapped);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}



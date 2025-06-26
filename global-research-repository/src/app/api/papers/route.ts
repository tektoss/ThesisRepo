import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }
  
  if (limit.count >= 10) { // 10 requests per minute
    return false;
  }
  
  limit.count++;
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.ip || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const country = searchParams.get('country') || '';
    const subject = searchParams.get('subject') || '';
    const level = searchParams.get('level') || '';

    let query = supabase
      .from('global_research_repository')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,authors.ilike.%${search}%,abstract.ilike.%${search}%`);
    }
    if (country) {
      query = query.eq('country', country);
    }
    if (subject) {
      query = query.eq('subject', subject);
    }
    if (level) {
      query = query.eq('level', level);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await query
      .order('submitted', { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Papers API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'authors', 'abstract', 'country', 'subject', 'level', 'type'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate file path
    if (!body.file_path) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('global_research_repository')
      .insert({
        ...body,
        authors: Array.isArray(body.authors) ? body.authors : body.authors.split(',').map((a: string) => a.trim()),
        submitted: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Paper creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
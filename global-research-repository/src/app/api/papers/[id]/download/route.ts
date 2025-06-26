import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get paper details from database
    const { data: paper, error: dbError } = await supabase
      .from('global_research_repository')
      .select('file_path, title')
      .eq('id', params.id)
      .single();

    if (dbError || !paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    // Download file from Supabase storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('papers')
      .download(paper.file_path);

    if (downloadError || !fileData) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(fileData.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Create response with proper headers
    const response = new NextResponse(fileData);
    response.headers.set('Content-Type', fileData.type);
    response.headers.set('Content-Disposition', `attachment; filename="${paper.title}.pdf"`);
    response.headers.set('Cache-Control', 'public, max-age=3600');

    return response;
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import GoogleDriveService from '@/lib/google-drive';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('google_access_token');
    const refreshToken = cookieStore.get('google_refresh_token');

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Google Drive authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '50');
    const query = searchParams.get('query') || '';

    // Set up Google Drive service with tokens from cookies
    const driveService = new GoogleDriveService();
    const tokens = {
      access_token: accessToken.value,
      refresh_token: refreshToken?.value
    };
    driveService.setTokens(tokens);

    // Get files from Google Drive
    const files = await driveService.listFiles(maxResults, query);

    return NextResponse.json({ 
      success: true, 
      files,
      count: files.length
    });

  } catch (error) {
    console.error('Error listing Google Drive files:', error);
    return NextResponse.json(
      { error: 'Failed to list Google Drive files' },
      { status: 500 }
    );
  }
}

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Google Drive OAuth2 Configuration
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback';

// OAuth2 Scopes for Google Drive access
const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.file'
];

export class GoogleDriveService {
  private oauth2Client: OAuth2Client;
  private drive: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      REDIRECT_URI
    );
    
    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  /**
   * Generate OAuth2 URL for user authentication
   */
  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
      include_granted_scopes: true,
      state: 'dev_mode'
    });
  }

  /**
   * Set OAuth2 credentials from authorization code
   */
  async setCredentials(code: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      return tokens;
    } catch (error) {
      console.error('Error setting credentials:', error);
      throw new Error('Failed to authenticate with Google Drive');
    }
  }

  /**
   * Set OAuth2 credentials directly (for already authenticated users)
   */
  setTokens(tokens: any) {
    this.oauth2Client.setCredentials(tokens);
  }

  /**
   * Search for files in Google Drive
   */
  async searchFiles(query: string, maxResults: number = 20): Promise<any[]> {
    try {
      const response = await this.drive.files.list({
        q: query,
        pageSize: maxResults,
        fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink)',
        orderBy: 'modifiedTime desc'
      });

      return response.data.files || [];
    } catch (error) {
      console.error('Error searching files:', error);
      throw new Error('Failed to search Google Drive files');
    }
  }

  /**
   * List all files from Google Drive
   */
  async listFiles(maxResults: number = 50, query: string = ''): Promise<any[]> {
    try {
      const listParams: any = {
        pageSize: maxResults,
        fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, parents)',
        orderBy: 'modifiedTime desc'
      };

      // Add query if provided
      if (query) {
        listParams.q = `name contains '${query}' and trashed=false`;
      } else {
        listParams.q = 'trashed=false';
      }

      const response = await this.drive.files.list(listParams);

      return response.data.files || [];
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error('Failed to list Google Drive files');
    }
  }

  /**
   * Get file content by ID
   */
  async getFileContent(fileId: string): Promise<string> {
    try {
      // Get file metadata first
      const fileMetadata = await this.drive.files.get({
        fileId,
        fields: 'mimeType, name'
      });

      const mimeType = fileMetadata.data.mimeType;
      const fileName = fileMetadata.data.name;

      let content = '';

      if (mimeType === 'application/vnd.google-apps.document') {
        // Google Docs - export as plain text
        const response = await this.drive.files.export({
          fileId,
          mimeType: 'text/plain'
        });
        content = response.data;
      } else if (mimeType === 'application/vnd.google-apps.presentation') {
        // Google Slides - export as plain text
        const response = await this.drive.files.export({
          fileId,
          mimeType: 'text/plain'
        });
        content = response.data;
      } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
        // Google Sheets - export as CSV
        const response = await this.drive.files.export({
          fileId,
          mimeType: 'text/csv'
        });
        content = response.data;
      } else if (mimeType === 'application/pdf') {
        // PDF files - get binary content (you'll need to process this)
        const response = await this.drive.files.get({
          fileId,
          alt: 'media'
        });
        content = response.data;
      } else if (mimeType.startsWith('text/')) {
        // Plain text files
        const response = await this.drive.files.get({
          fileId,
          alt: 'media'
        });
        content = response.data;
      } else {
        throw new Error(`Unsupported file type: ${mimeType}`);
      }

      return content;
    } catch (error) {
      console.error('Error getting file content:', error);
      throw new Error('Failed to retrieve file content from Google Drive');
    }
  }

  /**
   * Search for files containing specific keywords
   */
  async searchByKeywords(keywords: string[]): Promise<any[]> {
    const queries = keywords.map(keyword => `fullText contains '${keyword}'`);
    const query = queries.join(' or ');
    
    return this.searchFiles(query);
  }

  /**
   * Get files modified within a specific time range
   */
  async getRecentFiles(days: number = 7): Promise<any[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const isoDate = date.toISOString();
    
    const query = `modifiedTime > '${isoDate}'`;
    return this.searchFiles(query);
  }

  /**
   * Get file metadata by ID
   */
  async getFileMetadata(fileId: string): Promise<any> {
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, size, modifiedTime, webViewLink'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw new Error('Failed to retrieve file metadata from Google Drive');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const credentials = this.oauth2Client.credentials;
    return !!(credentials && credentials.access_token);
  }
}

export default GoogleDriveService;

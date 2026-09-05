import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot
} from 'firebase/storage';
import { storage } from '../firebase';

export interface UploadProgressInfo {
  progress: number; // 0 - 100
  bytesTransferred: number;
  totalBytes: number;
  state: 'running' | 'paused' | 'success' | 'error';
  error?: string;
  downloadUrl?: string;
}

export interface FileValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

const DEFAULT_MAX_SIZE_MB = 25; // 25 MB max for Firebase Storage assets

/**
 * Validates a file before uploading
 */
export function validateMediaFile(
  file: File,
  options?: FileValidationOptions
): { valid: boolean; error?: string } {
  const maxSize = (options?.maxSizeMB || DEFAULT_MAX_SIZE_MB) * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds limit (${(file.size / (1024 * 1024)).toFixed(1)}MB > ${options?.maxSizeMB || DEFAULT_MAX_SIZE_MB}MB)`
    };
  }

  if (options?.allowedTypes && options.allowedTypes.length > 0) {
    const isAllowed = options.allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const prefix = type.replace('/*', '');
        return file.type.startsWith(prefix);
      }
      return file.type === type;
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `File type "${file.type || 'unknown'}" is not supported.`
      };
    }
  }

  return { valid: true };
}

/**
 * Uploads a file to Firebase Storage with real-time percentage progress callback
 */
export function uploadFileToFirebaseStorage(
  file: File,
  folderPath: 'profile' | 'projects/web' | 'projects/graphic' | 'projects/video' | 'credentials' | 'site' | 'media',
  onProgress?: (info: UploadProgressInfo) => void,
  customFileName?: string
): {
  promise: Promise<string>;
  cancel: () => void;
} {
  // Sanitize filename and prevent collisions with timestamp
  const timestamp = Date.now();
  const sanitizedName = (customFileName || file.name).replace(/[^a-zA-Z0-9.-]/g, '_');
  const fullStoragePath = `${folderPath}/${timestamp}_${sanitizedName}`;

  const storageRef = ref(storage, fullStoragePath);
  const uploadTask = uploadBytesResumable(storageRef, file);

  const promise = new Promise<string>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) || 0;
        if (onProgress) {
          onProgress({
            progress,
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            state: snapshot.state as any
          });
        }
      },
      (error) => {
        console.error('[Firebase Storage] Upload failed:', error);
        if (onProgress) {
          onProgress({
            progress: 0,
            bytesTransferred: 0,
            totalBytes: file.size,
            state: 'error',
            error: error.message
          });
        }
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          if (onProgress) {
            onProgress({
              progress: 100,
              bytesTransferred: file.size,
              totalBytes: file.size,
              state: 'success',
              downloadUrl
            });
          }
          resolve(downloadUrl);
        } catch (urlErr) {
          reject(urlErr);
        }
      }
    );
  });

  return {
    promise,
    cancel: () => uploadTask.cancel()
  };
}

/**
 * Deletes a file from Firebase Storage given its full URL or storage path
 */
export async function deleteFileFromFirebaseStorage(urlOrPath: string): Promise<void> {
  try {
    let fileRef;
    if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
      fileRef = ref(storage, urlOrPath);
    } else {
      fileRef = ref(storage, urlOrPath);
    }
    await deleteObject(fileRef);
  } catch (err) {
    console.warn('[Firebase Storage] Delete file error (may already be deleted):', err);
  }
}

/**
 * Google Drive URL Validator and Formatter for Video Embeds
 */
export function formatGoogleDriveVideoUrl(rawUrl: string): { valid: boolean; embedUrl: string; fileId?: string } {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { valid: false, embedUrl: '' };
  }

  // Check for Google Drive file ID pattern
  // Formats:
  // drive.google.com/file/d/FILE_ID/view
  // drive.google.com/open?id=FILE_ID
  // docs.google.com/file/d/FILE_ID
  const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const fileId = match[1];
    return {
      valid: true,
      fileId,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`
    };
  }

  // If already in preview format
  if (trimmed.includes('drive.google.com') && trimmed.includes('/preview')) {
    return { valid: true, embedUrl: trimmed };
  }

  // If general URL
  if (trimmed.startsWith('https://drive.google.com')) {
    return { valid: true, embedUrl: trimmed };
  }

  return { valid: false, embedUrl: trimmed };
}

/**
 * Formats Cloudflare R2 URLs
 */
export function validateR2MediaUrl(rawUrl: string): { valid: boolean; formattedUrl: string } {
  const trimmed = rawUrl.trim();
  if (!trimmed) return { valid: false, formattedUrl: '' };
  
  const isValidUrl = trimmed.startsWith('https://') || trimmed.startsWith('http://');
  return {
    valid: isValidUrl,
    formattedUrl: trimmed
  };
}

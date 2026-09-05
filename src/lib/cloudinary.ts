/**
 * Cloudinary Integration Service
 * 
 * Provides configuration, validation, direct unsigned browser uploads with
 * upload progress tracking, cancellation, and asset delivery URL helpers.
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export interface CloudinaryProgressInfo {
  progress: number; // 0 - 100
  loaded: number;
  total: number;
  stage: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  error?: string;
}

export interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width?: number;
  height?: number;
  format: string;
  resource_type: 'image' | 'video' | 'raw';
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder?: string;
  original_filename: string;
  duration?: number;
  thumbnail_url?: string;
  [key: string]: unknown;
}

export type CloudinaryFolder =
  | 'portfolio/profile'
  | 'portfolio/graphics'
  | 'portfolio/videos'
  | 'portfolio/credentials'
  | 'portfolio/other'
  | string;

export interface CloudinaryUploadOptions {
  file: File | Blob;
  folder?: CloudinaryFolder;
  resourceType?: 'image' | 'video' | 'auto' | 'raw';
  tags?: string[];
  context?: Record<string, string>;
  onProgress?: (info: CloudinaryProgressInfo) => void;
  onSuccess?: (result: CloudinaryUploadResult) => void;
  onError?: (error: string) => void;
  maxSizeMB?: number;
  maxImageSizeMB?: number;
  maxVideoSizeMB?: number;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  fileType?: 'image' | 'video' | 'other';
}

// Fallback configuration if environment variables are not set
export const DEFAULT_CLOUDINARY_CLOUD_NAME = 'pegfrsqo';
export const DEFAULT_CLOUDINARY_UPLOAD_PRESET = 'portfolio_media';

/**
 * Retrieve active Cloudinary configuration from Vite environment
 */
export function getCloudinaryConfig(): CloudinaryConfig {
  const metaEnv = ((import.meta as unknown) as { env?: Record<string, string> })?.env || {};
  const cloudName =
    (metaEnv.VITE_CLOUDINARY_CLOUD_NAME as string | undefined)?.trim() ||
    DEFAULT_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    (metaEnv.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined)?.trim() ||
    DEFAULT_CLOUDINARY_UPLOAD_PRESET;

  return { cloudName, uploadPreset };
}

/**
 * Validates files specifically against allowed formats and size limits
 */
export function validateCloudinaryFile(
  file: File,
  options?: { maxImageSizeMB?: number; maxVideoSizeMB?: number; maxSizeMB?: number } | number
): FileValidationResult {
  let maxImageMB = 25;
  let maxVideoMB = 150;

  if (typeof options === 'number') {
    maxImageMB = options;
    maxVideoMB = options;
  } else if (options) {
    if (options.maxSizeMB) {
      maxImageMB = options.maxSizeMB;
      maxVideoMB = options.maxSizeMB;
    }
    if (options.maxImageSizeMB) maxImageMB = options.maxImageSizeMB;
    if (options.maxVideoSizeMB) maxVideoMB = options.maxVideoSizeMB;
  }

  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  const isJpg = mime === 'image/jpeg' || name.endsWith('.jpg') || name.endsWith('.jpeg');
  const isPng = mime === 'image/png' || name.endsWith('.png');
  const isWebp = mime === 'image/webp' || name.endsWith('.webp');

  const isMp4 = mime === 'video/mp4' || name.endsWith('.mp4');
  const isWebm = mime === 'video/webm' || name.endsWith('.webm');
  const isMov = mime === 'video/quicktime' || name.endsWith('.mov');

  if (isJpg || isPng || isWebp) {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxImageMB) {
      return {
        valid: false,
        error: `Image size (${sizeMB.toFixed(1)}MB) exceeds maximum allowed limit (${maxImageMB}MB).`,
        fileType: 'image'
      };
    }
    return { valid: true, fileType: 'image' };
  }

  if (isMp4 || isWebm || isMov) {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxVideoMB) {
      return {
        valid: false,
        error: `Video size (${sizeMB.toFixed(1)}MB) exceeds maximum allowed limit (${maxVideoMB}MB).`,
        fileType: 'video'
      };
    }
    return { valid: true, fileType: 'video' };
  }

  return {
    valid: false,
    error: `Unsupported file format. Allowed: Images (JPG, JPEG, PNG, WEBP) or Videos (MP4, WEBM, MOV).`,
    fileType: 'other'
  };
}

/**
 * Generates an optimized Cloudinary delivery URL with f_auto and q_auto
 */
export function getOptimizedImageUrl(
  urlOrPublicId: string,
  options?: { width?: number; height?: number; crop?: string; quality?: string; gravity?: string }
): string {
  if (!urlOrPublicId) return '';

  // If it's not a Cloudinary URL, return as-is
  if (!urlOrPublicId.includes('res.cloudinary.com')) {
    return urlOrPublicId;
  }

  const { width, height, crop = 'limit', quality = 'auto', gravity } = options || {};
  const transforms: string[] = ['f_auto', `q_${quality}`];

  if (gravity) transforms.push(`g_${gravity}`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  const transformStr = transforms.join(',');

  // Insert transformations into /upload/
  if (urlOrPublicId.includes('/upload/')) {
    return urlOrPublicId.replace('/upload/', `/upload/${transformStr}/`);
  }

  return urlOrPublicId;
}

export function getCloudinaryCloudName(): string {
  return getCloudinaryConfig().cloudName;
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const validateUploadFile = validateCloudinaryFile;

/**
 * Generates a video poster thumbnail from a Cloudinary video URL or public ID
 */
export function getVideoPosterUrl(
  videoUrl: string,
  options?: { width?: number; height?: number }
): string {
  if (!videoUrl) return '';

  if (!videoUrl.includes('res.cloudinary.com')) {
    return videoUrl;
  }

  const width = options?.width ? `w_${options.width},` : '';
  const height = options?.height ? `h_${options.height},` : '';
  const transform = `${width}${height}f_jpg,q_auto,so_auto`;

  // Replace extension with .jpg and insert transform
  let poster = videoUrl.replace(/\.(mp4|webm|mov|mkv)$/i, '.jpg');
  if (poster.includes('/upload/')) {
    poster = poster.replace('/upload/', `/upload/${transform}/`);
  }

  return poster;
}

/**
 * Upload a file directly to Cloudinary using XMLHttpRequest for granular progress tracking
 */
export function uploadDirectToCloudinary(
  options: CloudinaryUploadOptions,
  abortRef?: { abort?: () => void }
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const { cloudName, uploadPreset } = getCloudinaryConfig();

    if (!cloudName) {
      reject(new Error('Cloudinary cloud name is missing. Please check VITE_CLOUDINARY_CLOUD_NAME.'));
      return;
    }
    if (!uploadPreset) {
      reject(new Error('Cloudinary upload preset is missing. Please check VITE_CLOUDINARY_UPLOAD_PRESET.'));
      return;
    }

    // Determine resource type
    let resourceType: 'image' | 'video' | 'auto' | 'raw' = options.resourceType || 'auto';
    if (options.file instanceof File) {
      if (options.file.type.startsWith('image/')) {
        resourceType = 'image';
      } else if (options.file.type.startsWith('video/')) {
        resourceType = 'video';
      }
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const formData = new FormData();
    formData.append('file', options.file);
    formData.append('upload_preset', uploadPreset);

    if (options.folder) {
      formData.append('folder', options.folder);
    }

    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }

    if (options.context) {
      const contextStr = Object.entries(options.context)
        .map(([k, v]) => `${k}=${v}`)
        .join('|');
      formData.append('context', contextStr);
    }

    const xhr = new XMLHttpRequest();

    if (abortRef) {
      abortRef.abort = () => {
        xhr.abort();
      };
    }

    // Progress handler
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.min(Math.round((event.loaded / event.total) * 100), 99);
        options.onProgress?.({
          progress: percent,
          loaded: event.loaded,
          total: event.total,
          stage: percent >= 99 ? 'processing' : 'uploading'
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response: CloudinaryUploadResult = JSON.parse(xhr.responseText);

          // If it's a video, automatically set thumbnail_url
          if (response.resource_type === 'video' || resourceType === 'video') {
            response.thumbnail_url = getVideoPosterUrl(response.secure_url);
          }

          options.onProgress?.({
            progress: 100,
            loaded: response.bytes || 0,
            total: response.bytes || 0,
            stage: 'success'
          });

          resolve(response);
        } catch {
          const parseErr = 'Failed to parse Cloudinary response JSON.';
          options.onProgress?.({
            progress: 0,
            loaded: 0,
            total: 0,
            stage: 'error',
            error: parseErr
          });
          reject(new Error(parseErr));
        }
      } else {
        let errorMessage = `Cloudinary upload failed (Status: ${xhr.status})`;
        try {
          const errRes = JSON.parse(xhr.responseText);
          if (errRes.error?.message) {
            errorMessage = errRes.error.message;
          }
        } catch {
          // ignore JSON parse error
        }

        options.onProgress?.({
          progress: 0,
          loaded: 0,
          total: 0,
          stage: 'error',
          error: errorMessage
        });
        reject(new Error(errorMessage));
      }
    };

    xhr.onerror = () => {
      const networkError = 'Network error during Cloudinary upload. Please check your connection.';
      options.onProgress?.({
        progress: 0,
        loaded: 0,
        total: 0,
        stage: 'error',
        error: networkError
      });
      reject(new Error(networkError));
    };

    xhr.onabort = () => {
      const abortError = 'Upload was cancelled.';
      options.onProgress?.({
        progress: 0,
        loaded: 0,
        total: 0,
        stage: 'idle',
        error: abortError
      });
      reject(new Error(abortError));
    };

    options.onProgress?.({
      progress: 0,
      loaded: 0,
      total: options.file instanceof File ? options.file.size : 0,
      stage: 'uploading'
    });

    xhr.open('POST', endpoint, true);
    xhr.send(formData);
  });
}

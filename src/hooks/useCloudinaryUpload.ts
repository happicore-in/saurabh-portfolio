import { useState, useRef, useCallback, useEffect } from 'react';
import {
  CloudinaryUploadOptions,
  CloudinaryUploadResult,
  CloudinaryProgressInfo,
  getCloudinaryConfig,
  uploadDirectToCloudinary,
  validateCloudinaryFile,
  FileValidationResult
} from '../lib/cloudinary';

export interface UseCloudinaryUploadState {
  isUploading: boolean;
  progress: number;
  stage: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  progressInfo: CloudinaryProgressInfo | null;
  error: string | null;
  result: CloudinaryUploadResult | null;
  file: File | null;
  isSuccess: boolean;
  isError: boolean;
}

export interface UseCloudinaryUploadReturn extends UseCloudinaryUploadState {
  selectFile: (file: File | null) => void;
  startUpload: (folderOrFile?: string | File) => Promise<CloudinaryUploadResult>;
  retry: (folderOrFile?: string | File) => Promise<CloudinaryUploadResult>;
  upload: (
    fileOrOptions?: File | CloudinaryUploadOptions,
    extraOptions?: Partial<CloudinaryUploadOptions>
  ) => Promise<CloudinaryUploadResult>;
  cancel: () => void;
  reset: () => void;
  validate: (
    file: File,
    options?: { maxImageSizeMB?: number; maxVideoSizeMB?: number; maxSizeMB?: number } | number
  ) => FileValidationResult;
  config: {
    cloudName: string;
    uploadPreset: string;
  };
}

/**
 * Custom hook for direct, unsigned uploads to Cloudinary with real-time
 * progress tracking, stage notifications, cancellation, and validation.
 */
export function useCloudinaryUpload(
  initialOptions?: Partial<CloudinaryUploadOptions>
): UseCloudinaryUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [stage, setStage] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progressInfo, setProgressInfo] = useState<CloudinaryProgressInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CloudinaryUploadResult | null>(null);

  const abortRef = useRef<{ abort?: () => void }>({});

  // Clean up any ongoing upload when component unmounts
  useEffect(() => {
    return () => {
      if (abortRef.current.abort) {
        abortRef.current.abort();
      }
    };
  }, []);

  const reset = useCallback(() => {
    if (abortRef.current.abort) {
      abortRef.current.abort();
    }
    setFile(null);
    setIsUploading(false);
    setProgress(0);
    setStage('idle');
    setProgressInfo(null);
    setError(null);
    setResult(null);
  }, []);

  const cancel = useCallback(() => {
    if (abortRef.current.abort) {
      abortRef.current.abort();
    }
    setIsUploading(false);
    setStage('idle');
    setError('Upload cancelled.');
  }, []);

  const validate = useCallback(
    (
      targetFile: File,
      options?: { maxImageSizeMB?: number; maxVideoSizeMB?: number; maxSizeMB?: number } | number
    ) => {
      return validateCloudinaryFile(targetFile, options);
    },
    []
  );

  const selectFile = useCallback((newFile: File | null) => {
    setFile(newFile);
    setError(null);
    setStage('idle');
    setProgress(0);
    setResult(null);
  }, []);

  const upload = useCallback(
    async (
      fileOrOptions?: File | CloudinaryUploadOptions,
      extraOptions?: Partial<CloudinaryUploadOptions>
    ): Promise<CloudinaryUploadResult> => {
      // Normalize options
      let uploadOptions: CloudinaryUploadOptions;
      const target = fileOrOptions || file;
      
      if (!target) {
        const noFileErr = 'No file selected for upload.';
        setError(noFileErr);
        setStage('error');
        throw new Error(noFileErr);
      }

      if (target instanceof File || target instanceof Blob) {
        uploadOptions = {
          file: target,
          ...initialOptions,
          ...extraOptions
        };
      } else {
        uploadOptions = {
          ...initialOptions,
          ...target,
          ...extraOptions
        };
      }

      // Pre-upload validation if it's a File
      if (uploadOptions.file instanceof File) {
        const validation = validateCloudinaryFile(uploadOptions.file);
        if (!validation.valid) {
          const validationError = validation.error || 'Invalid file format or size.';
          setError(validationError);
          setStage('error');
          throw new Error(validationError);
        }
      }

      // Reset state for new upload
      setIsUploading(true);
      setProgress(0);
      setStage('uploading');
      setError(null);
      setResult(null);

      const handleProgress = (info: CloudinaryProgressInfo) => {
        setProgress(info.progress);
        setStage(info.stage);
        setProgressInfo(info);
        if (info.error) {
          setError(info.error);
        }
        if (uploadOptions.onProgress) {
          uploadOptions.onProgress(info);
        }
      };

      try {
        const uploadResult = await uploadDirectToCloudinary(
          {
            ...uploadOptions,
            onProgress: handleProgress
          },
          abortRef.current
        );

        setResult(uploadResult);
        setProgress(100);
        setStage('success');
        setIsUploading(false);
        initialOptions?.onSuccess?.(uploadResult);
        return uploadResult;
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : 'Upload failed. Please try again.';
        setError(errMessage);
        setStage('error');
        setIsUploading(false);
        initialOptions?.onError?.(errMessage);
        throw err;
      }
    },
    [file, initialOptions]
  );

  const startUpload = useCallback(
    (folderOrFile?: string | File) => {
      if (typeof folderOrFile === 'string') {
        return upload(file || undefined, { folder: folderOrFile });
      }
      return upload(folderOrFile || file || undefined);
    },
    [upload, file]
  );

  const retry = useCallback(
    (folderOrFile?: string | File) => {
      if (typeof folderOrFile === 'string') {
        return upload(file || undefined, { folder: folderOrFile });
      }
      return upload(folderOrFile || file || undefined);
    },
    [upload, file]
  );

  const isSuccess = stage === 'success';
  const isError = stage === 'error' || Boolean(error);

  return {
    isUploading,
    progress,
    stage,
    progressInfo,
    error,
    result,
    file,
    isSuccess,
    isError,
    selectFile,
    startUpload,
    retry,
    upload,
    cancel,
    reset,
    validate,
    config: getCloudinaryConfig()
  };
}

export default useCloudinaryUpload;

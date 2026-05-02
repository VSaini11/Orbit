'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileArchive, Github, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  onGitHub?: (url: string, token?: string) => void;
  isLoading?: boolean;
}

export function UploadZone({ onFileSelect, onGitHub, isLoading = false }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [tab, setTab] = useState<'upload' | 'github'>('upload');
  const [gitHubUrl, setGitHubUrl] = useState('');
  const [gitHubToken, setGitHubToken] = useState('');
  const [urlValidation, setUrlValidation] = useState<{ valid: boolean; message: string } | null>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validate GitHub URL format
  const validateGitHubUrl = (url: string) => {
    if (!url.trim()) {
      setUrlValidation(null);
      return;
    }

    const gitHubUrlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;
    const isValid = gitHubUrlPattern.test(url.trim());

    if (isValid) {
      setUrlValidation({ valid: true, message: 'Valid GitHub repository URL' });
      
      // Auto-trigger analysis after validation
      if (validationTimeoutRef.current) clearTimeout(validationTimeoutRef.current);
      validationTimeoutRef.current = setTimeout(() => {
        if (onGitHub) {
          onGitHub(url.trim(), gitHubToken);
        }
      }, 800);
    } else {
      setUrlValidation({ 
        valid: false, 
        message: 'Invalid GitHub URL. Format: https://github.com/username/repo' 
      });
    }
  };

  const handleGitHubUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGitHubUrl(value);
    validateGitHubUrl(value);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('upload')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            tab === 'upload'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground border border-border'
          }`}
        >
          <Upload className="w-4 h-4 inline-block mr-2" />
          Upload ZIP
        </button>
        <button
          onClick={() => setTab('github')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            tab === 'github'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground border border-border'
          }`}
        >
          <Github className="w-4 h-4 inline-block mr-2" />
          GitHub
        </button>
      </div>

      {/* Upload Zone */}
      {tab === 'upload' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-all ${
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-border/50 bg-card/30 hover:bg-card/50'
          }`}
        >
          <input
            type="file"
            accept=".zip"
            onChange={handleFileInput}
            disabled={isLoading}
            className="hidden"
            id="file-input"
          />

          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileArchive className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div>
              <label
                htmlFor="file-input"
                className="text-foreground font-medium cursor-pointer hover:text-primary transition-colors"
              >
                Drag and drop your ZIP file here
              </label>
              <p className="text-sm text-muted-foreground mt-1">or click to select from your computer</p>
            </div>

            <p className="text-xs text-muted-foreground">
              ZIP files up to 100MB. Must contain source code files.
            </p>
          </div>
        </motion.div>
      )}

      {/* GitHub Input */}
      {tab === 'github' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Repository URL</label>
            <div className="relative">
              <input
                ref={urlInputRef}
                type="text"
                value={gitHubUrl}
                placeholder="https://github.com/username/repo"
                disabled={isLoading}
                onChange={handleGitHubUrlChange}
                className={`w-full px-4 py-3 pr-10 rounded-lg border transition-all bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                  urlValidation?.valid
                    ? 'border-emerald-600/50 focus:ring-emerald-500/30'
                    : urlValidation?.valid === false
                      ? 'border-red-600/50 focus:ring-red-500/30'
                      : 'border-border focus:ring-primary/50'
                }`}
              />
              {urlValidation && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {urlValidation.valid ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-muted-foreground">
                Public repositories only. Auto-analysis starts when URL is valid.
              </p>
              {urlValidation && (
                <p className={`text-xs font-medium ${
                  urlValidation.valid ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {urlValidation.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">GitHub Token (Optional)</label>
            <input
              type="password"
              value={gitHubToken}
              onChange={(e) => setGitHubToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground mt-2">
              For private repositories or higher rate limits. Optional.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

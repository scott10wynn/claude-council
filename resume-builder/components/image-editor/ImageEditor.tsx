'use client';

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react';

type Status = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

const POLL_INTERVAL_MS = 2500;
const MAX_POLLS = 60;

export function ImageEditor() {
  const [status, setStatus] = useState<Status>('idle');
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [instruction, setInstruction] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<File | null>(null);
  const pollCountRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload an image file.');
      return;
    }
    fileRef.current = file;
    setOriginalUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setErrorMsg('');
    setStatus('idle');
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  };

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }, []);

  const pollPrediction = async (id: string) => {
    pollCountRef.current = 0;

    const poll = async () => {
      if (pollCountRef.current >= MAX_POLLS) {
        setStatus('error');
        setErrorMsg('Timed out waiting for result.');
        return;
      }
      pollCountRef.current++;

      const res = await fetch(`/api/image-edit?id=${id}`);
      const data = await res.json();

      if (data.error) {
        setStatus('error');
        setErrorMsg(data.error);
        return;
      }

      if (data.status === 'succeeded') {
        const url = Array.isArray(data.output) ? data.output[0] : data.output;
        setResultUrl(url);
        setStatus('done');
        return;
      }

      if (data.status === 'failed' || data.status === 'canceled') {
        setStatus('error');
        setErrorMsg('Image editing failed. Try a different instruction or image.');
        return;
      }

      setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();
  };

  const handleSubmit = async () => {
    if (!fileRef.current || !instruction.trim()) return;

    setStatus('uploading');
    setErrorMsg('');
    setResultUrl(null);

    const form = new FormData();
    form.append('image', fileRef.current);
    form.append('instruction', instruction.trim());

    try {
      const res = await fetch('/api/image-edit', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok || data.error) {
        setStatus('error');
        setErrorMsg(data.error ?? 'Something went wrong.');
        return;
      }

      if (data.status === 'succeeded' && data.output) {
        const url = Array.isArray(data.output) ? data.output[0] : data.output;
        setResultUrl(url);
        setStatus('done');
      } else {
        setStatus('processing');
        pollPrediction(data.id);
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  const reset = () => {
    fileRef.current = null;
    setOriginalUrl(null);
    setResultUrl(null);
    setInstruction('');
    setErrorMsg('');
    setStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isLoading = status === 'uploading' || status === 'processing';

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2 text-white">Image Editor</h1>
        <p className="text-gray-400 mb-8">
          Upload a photo and describe what you want to change — e.g. &ldquo;give the person a hat&rdquo; or &ldquo;make it sunset&rdquo;.
        </p>

        {/* Upload zone */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-400 bg-blue-900/20'
              : 'border-gray-600 hover:border-gray-400 bg-gray-900/40'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
          {originalUrl ? (
            <div className="flex flex-col items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={originalUrl}
                alt="Original"
                className="max-h-48 rounded-lg object-contain"
              />
              <span className="text-sm text-gray-400">Click or drag to replace</span>
            </div>
          ) : (
            <div className="space-y-2">
              <svg className="mx-auto h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400">Click or drag & drop an image here</p>
              <p className="text-xs text-gray-600">PNG, JPG, WEBP supported</p>
            </div>
          )}
        </div>

        {/* Instruction input */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What would you like to change?
          </label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder='e.g. "give the person a red baseball hat" or "change the background to a beach"'
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3 items-center">
          <button
            onClick={handleSubmit}
            disabled={!originalUrl || !instruction.trim() || isLoading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner />
                {status === 'uploading' ? 'Sending…' : 'Editing image…'}
              </span>
            ) : (
              'Edit Image'
            )}
          </button>

          {(originalUrl || resultUrl) && (
            <button
              onClick={reset}
              className="px-4 py-2.5 text-gray-400 hover:text-gray-200 transition-colors text-sm"
            >
              Start over
            </button>
          )}
        </div>

        {/* Error */}
        {status === 'error' && errorMsg && (
          <div className="mt-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Progress hint */}
        {status === 'processing' && (
          <p className="mt-3 text-sm text-gray-500">
            AI is editing your image — this usually takes 20–60 seconds…
          </p>
        )}

        {/* Before / After */}
        {resultUrl && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-200 mb-4">Result</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Before</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalUrl!}
                  alt="Original"
                  className="w-full rounded-xl object-contain border border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">After</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultUrl}
                  alt="Edited"
                  className="w-full rounded-xl object-contain border border-gray-800"
                />
              </div>
            </div>

            <a
              href={resultUrl}
              download="edited-image.png"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
            >
              Download edited image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

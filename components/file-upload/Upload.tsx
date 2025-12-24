"use client";

import { useSession } from "@/lib/auth-client";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

type UploadProps = {
  value?: string;
  onUploaded: (fileKey: string) => void;
};

export default function Upload({ onUploaded }: UploadProps) {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("mediUploader", {
    onClientUploadComplete: (res) => {
      const uploadedFile = res?.[0];
      if (!uploadedFile) return;

      onUploaded(uploadedFile.key);

      setFile(null);
      setPreview((p) => {
        if (p) URL.revokeObjectURL(p);
        return null;
      });
    },
    onUploadError: (e) => {
      setError(e?.message ?? "Upload failed");
    },
  });

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    disabled: isUploading || !session,
    onDrop: async (files) => {
      setError(null);
      const f = files?.[0];
      if (!f) return;

      // preview
      const url = URL.createObjectURL(f);
      setFile(f);
      setPreview(url);

      // auto upload
      await startUpload([f]);
    },
  });

  return (
    <div {...getRootProps()} className="border p-6 rounded">
      <input {...getInputProps()} />

      {preview && (
        <Image
          src={preview}
          alt="preview"
          width={300}
          height={200}
          className="rounded"
        />
      )}

      {isUploading && <p className="text-sm mt-2">Uploading...</p>}
      {error && <p className="text-sm mt-2 text-red-500">{error}</p>}
    </div>
  );
}

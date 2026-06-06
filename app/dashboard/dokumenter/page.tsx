"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileText,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  CloudUpload,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

type DocumentType = "PASSPORT" | "PROOF_OF_ADDRESS" | "OTHER";

const TYPE_LABELS: Record<DocumentType, string> = {
  PASSPORT: "Pas",
  PROOF_OF_ADDRESS: "Adressebevis",
  OTHER: "Andet",
};

const REQUIRED_DOCS: { type: DocumentType; label: string; description: string }[] = [
  {
    type: "PASSPORT",
    label: "Pas",
    description: "Gyldigt pas med foto og personlige oplysninger",
  },
  {
    type: "PROOF_OF_ADDRESS",
    label: "Adressebevis",
    description: "Bankudskrift, forsyningsregning eller officielt brev (maks. 3 mdr. gammelt)",
  },
];

interface DocumentFile {
  id: string;
  name: string;
  type: DocumentType;
  uploadedAt: Date;
  size: number;
  status: "uploaded" | "pending";
}

const INITIAL_DOCUMENTS: DocumentFile[] = [
  {
    id: "1",
    name: "pas_anders_jensen.pdf",
    type: "PASSPORT",
    uploadedAt: new Date("2024-11-01T10:35:00"),
    size: 1234567,
    status: "uploaded",
  },
];

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentCard({
  doc,
  onDelete,
}: {
  doc: DocumentFile;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl transition-all duration-150"
      style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#cbd5e1";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 8px rgba(0,0,0,0.04)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "#fff", border: "1px solid #e2e8f0" }}
      >
        <FileText size={18} style={{ color: "#0f172a" }} />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 truncate">{doc.name}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-slate-400">
            {TYPE_LABELS[doc.type]}
          </span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-slate-400">
            {formatFileSize(doc.size)}
          </span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-slate-400">
            {formatDate(doc.uploadedAt)}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {doc.status === "uploaded" ? (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
            style={{ background: "#f0fdf4", color: "#16a34a" }}>
            <CheckCircle2 size={11} />
            Uploadet
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
            style={{ background: "#fff7ed", color: "#f97316" }}>
            <AlertCircle size={11} />
            Afventer
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          className="p-2 rounded-lg transition-colors"
          style={{ color: "#64748b" }}
          title="Se dokument"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#e2e8f0";
            (e.currentTarget as HTMLButtonElement).style.color = "#0f172a";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
          }}
        >
          <Eye size={15} />
        </button>
        <button
          className="p-2 rounded-lg transition-colors"
          style={{ color: "#64748b" }}
          title="Download"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#e2e8f0";
            (e.currentTarget as HTMLButtonElement).style.color = "#0f172a";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
          }}
        >
          <Download size={15} />
        </button>
        <button
          className="p-2 rounded-lg transition-colors"
          style={{ color: "#94a3b8" }}
          title="Slet"
          onClick={() => onDelete(doc.id)}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
            (e.currentTarget as HTMLButtonElement).style.color = "#dc2626";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
          }}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default function DokumenterPage() {
  const [documents, setDocuments] = useState<DocumentFile[]>(INITIAL_DOCUMENTS);
  const [selectedType, setSelectedType] = useState<DocumentType>("PASSPORT");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadedTypes = new Set(documents.map((d) => d.type));

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      const newDoc: DocumentFile = {
        id: Date.now().toString(),
        name: file.name,
        type: selectedType,
        uploadedAt: new Date(),
        size: file.size,
        status: "uploaded",
      };
      setDocuments((prev) => [...prev, newDoc]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    },
    [selectedType]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dokumenter</h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload og administrer dine dokumenter til NIE-ansøgningen.
        </p>
      </div>

      {/* Required documents checklist */}
      <div
        className="bg-white rounded-2xl p-6 mb-6"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
      >
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Påkrævede dokumenter
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REQUIRED_DOCS.map((req) => {
            const isUploaded = uploadedTypes.has(req.type);
            return (
              <div
                key={req.type}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{
                  background: isUploaded ? "#f0fdf4" : "#fff7ed",
                  border: `1px solid ${isUploaded ? "#bbf7d0" : "#fed7aa"}`,
                }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isUploaded ? (
                    <CheckCircle2 size={18} style={{ color: "#16a34a" }} />
                  ) : (
                    <AlertCircle size={18} style={{ color: "#f97316" }} />
                  )}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: isUploaded ? "#15803d" : "#c2410c" }}
                  >
                    {req.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: isUploaded ? "#166534" : "#9a3412" }}>
                    {req.description}
                  </p>
                  {!isUploaded && (
                    <button
                      className="mt-2 text-xs font-semibold underline"
                      style={{ color: "#f97316" }}
                      onClick={() => {
                        setSelectedType(req.type);
                        fileInputRef.current?.click();
                      }}
                    >
                      Upload nu
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload area */}
      <div
        className="bg-white rounded-2xl p-6 mb-6"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
      >
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Upload nyt dokument
        </h2>

        {/* Type selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
            Dokumenttype
          </label>
          <div className="flex gap-2 flex-wrap">
            {(Object.entries(TYPE_LABELS) as [DocumentType, string][]).map(
              ([type, label]) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                  style={{
                    background:
                      selectedType === type
                        ? "linear-gradient(135deg, #d4af37, #f0c830)"
                        : "#f8fafc",
                    color: selectedType === type ? "#0f172a" : "#64748b",
                    border:
                      selectedType === type
                        ? "1px solid transparent"
                        : "1px solid #e2e8f0",
                  }}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Drag & drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative cursor-pointer rounded-2xl transition-all duration-200 flex flex-col items-center justify-center py-12 px-6 text-center"
          style={{
            border: `2px dashed ${isDragging ? "#d4af37" : "#e2e8f0"}`,
            background: isDragging ? "rgba(212,175,55,0.04)" : "#f8fafc",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.heic"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: isDragging
                ? "linear-gradient(135deg, #d4af37, #f0c830)"
                : "#e2e8f0",
            }}
          >
            <CloudUpload
              size={24}
              style={{ color: isDragging ? "#0f172a" : "#64748b" }}
            />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Træk og slip dit dokument her
          </p>
          <p className="text-xs text-slate-400 mt-1">
            eller klik for at vælge en fil
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: "#e2e8f0", color: "#64748b" }}>
              <Upload size={11} />
              {TYPE_LABELS[selectedType]}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Accepterede formater: PDF, JPG, PNG · Maks. 10 MB
          </p>
        </div>

        {/* Upload success */}
        {uploadSuccess && (
          <div
            className="flex items-center gap-3 mt-4 px-4 py-3 rounded-xl"
            style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
          >
            <CheckCircle2 size={16} style={{ color: "#16a34a" }} />
            <p className="text-sm font-semibold" style={{ color: "#15803d" }}>
              Dokumentet er uploadet!
            </p>
          </div>
        )}
      </div>

      {/* Uploaded documents list */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">
            Uploadede dokumenter
          </h2>
          <span className="text-sm font-semibold" style={{ color: "#d4af37" }}>
            {documents.length} dokument{documents.length !== 1 ? "er" : ""}
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="py-10 text-center">
            <FileText
              size={40}
              className="mx-auto mb-3"
              style={{ color: "#e2e8f0" }}
            />
            <p className="text-sm text-slate-400">
              Ingen dokumenter uploadet endnu.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

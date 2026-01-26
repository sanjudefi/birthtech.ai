'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ArrowLeft,
  FileText,
  Upload,
  File,
  Image,
  Trash2,
  Eye,
  Calendar,
  Loader2,
} from 'lucide-react';

interface Report {
  id: string;
  fileName: string;
  fileType: string;
  reportType: string;
  reportDate: string;
  aiSummary?: string;
  notes?: string;
  createdAt: string;
}

const reportTypes = [
  { value: 'ultrasound', label: 'Ultrasound', icon: '' },
  { value: 'blood_test', label: 'Blood Test', icon: '' },
  { value: 'prescription', label: 'Prescription', icon: '' },
  { value: 'general', label: 'General Report', icon: '' },
];

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    reportType: 'general',
    reportDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchReports(token);
  }, [router]);

  const fetchReports = async (token: string) => {
    try {
      const res = await fetch('/api/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setUploading(true);

    try {
      // For now, create a placeholder entry
      // In production, you'd upload to cloud storage
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type.includes('pdf') ? 'pdf' : 'image',
          ...uploadForm,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReports((prev) => [data.report, ...prev]);
        setShowUpload(false);
        setSelectedFile(null);
        setUploadForm({
          reportType: 'general',
          reportDate: new Date().toISOString().split('T')[0],
          notes: '',
        });
      }
    } catch (error) {
      console.error('Error uploading report:', error);
      alert('Failed to upload report. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const deleteReport = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const res = await fetch(`/api/reports?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'pdf') return FileText;
    return Image;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <Heart className="w-12 h-12 text-pink-500 mx-auto animate-pulse" fill="#ec4899" />
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Medical Reports</h1>
              <p className="text-xs text-gray-500">Upload & track your documents</p>
            </div>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Empty State */}
        {reports.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Keep Your Records Safe</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Upload your pregnancy reports, ultrasounds, and prescriptions to track your journey.
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center gap-2 mx-auto"
            >
              <Upload className="w-5 h-5" />
              Upload Your First Report
            </button>
          </div>
        )}

        {/* Reports List */}
        {reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report) => {
              const FileIcon = getFileIcon(report.fileType);
              const typeInfo = reportTypes.find((t) => t.value === report.reportType);

              return (
                <div key={report.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileIcon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-gray-900 truncate">{report.fileName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {typeInfo?.icon} {typeInfo?.label || report.reportType}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(report.reportDate || report.createdAt)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {report.notes && (
                        <p className="mt-2 text-sm text-gray-600">{report.notes}</p>
                      )}
                      {report.aiSummary && (
                        <div className="mt-2 text-sm bg-purple-50 text-purple-700 p-2 rounded-lg">
                          <strong>AI Summary:</strong> {report.aiSummary}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Report</h2>

              <div className="space-y-4">
                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                  {!selectedFile ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Click to select file</span>
                      <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileSelect}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <File className="w-8 h-8 text-blue-500" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Report Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {reportTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setUploadForm({ ...uploadForm, reportType: type.value })}
                        className={`p-3 rounded-xl text-sm text-left transition-colors ${
                          uploadForm.reportType === type.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-1">{type.icon}</span> {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Report Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Date</label>
                  <input
                    type="date"
                    value={uploadForm.reportDate}
                    onChange={(e) => setUploadForm({ ...uploadForm, reportDate: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                  <textarea
                    value={uploadForm.notes}
                    onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                    className="input-field min-h-[80px]"
                    placeholder="Add any notes about this report..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowUpload(false);
                    setSelectedFile(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

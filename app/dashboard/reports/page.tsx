'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ArrowLeft,
  FileText,
  Upload,
  Loader2,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  X,
  Trash2,
  Calendar,
  Utensils,
  Dumbbell,
  FileSearch,
  ChevronRight,
  Plus,
  AlertCircle,
  Check,
  History,
  File,
  Image as ImageIcon,
  FileUp,
} from 'lucide-react';

interface MedicalReport {
  id: string;
  fileName: string;
  fileType: string;
  reportType: string;
  reportDate: string;
  aiSummary?: string;
  notes?: string;
  createdAt: string;
}

interface ReportAnalysis {
  summary?: {
    keyFindings: string[];
    normalResults: string[];
    attentionNeeded: string[];
    recommendations: string[];
  };
  dietPlan?: {
    focus: string;
    recommendations: { food: string; reason: string; frequency: string }[];
    avoid: { item: string; reason: string }[];
    sampleMeals: { breakfast: string; lunch: string; dinner: string };
  };
  workoutPlan?: {
    intensity: string;
    focus: string;
    exercises: { name: string; duration: string; benefit: string; precaution: string }[];
    avoid: string[];
    weeklySchedule: string;
  };
}

const REPORT_TYPES = [
  { value: 'ultrasound', label: 'Ultrasound' },
  { value: 'blood_test', label: 'Blood Test' },
  { value: 'general', label: 'General Check-up' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'glucose', label: 'Glucose Test' },
  { value: 'urine', label: 'Urine Test' },
];

export default function ReportsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'diet' | 'workout'>('summary');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, image (JPG/PNG), or text file.');
      return;
    }

    setSelectedFile(file);

    // Read file content for text files
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
      };
      reader.readAsText(file);
    } else {
      // For PDF and images, we'll extract text on the server or prompt for manual entry
      setFileContent('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setUploading(true);
    try {
      // For MVP: Convert file to base64 and send
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Content = e.target?.result as string;

        // Create report record
        const res = await fetch('/api/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: selectedFile.name,
            fileType: selectedFile.type.split('/')[1] || 'unknown',
            fileContent: base64Content,
            reportType: uploadForm.reportType,
            reportDate: uploadForm.reportDate,
            notes: uploadForm.notes || fileContent,
          }),
        });

        if (res.ok) {
          const { report } = await res.json();

          // Analyze the report
          setAnalyzing(true);
          setShowUploadModal(false);
          setSelectedReport(report);

          const analysisRes = await fetch('/api/ai/analyze-report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              reportId: report.id,
              reportContent: uploadForm.notes || fileContent || `Uploaded file: ${selectedFile.name}`,
              reportType: uploadForm.reportType,
            }),
          });

          if (analysisRes.ok) {
            const analysisData = await analysisRes.json();
            setAnalysis(analysisData.analysis);
            setActiveTab('summary');
          }

          // Refresh reports list
          fetchReports(token);
          resetUploadForm();
        }
        setUploading(false);
        setAnalyzing(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error uploading report:', error);
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setFileContent('');
    setUploadForm({
      reportType: 'general',
      reportDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const viewReportAnalysis = async (report: MedicalReport) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setSelectedReport(report);
    setAnalyzing(true);
    setAnalysis(null);

    try {
      const res = await fetch(`/api/ai/analyze-report?reportId=${report.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const deleteReport = async (reportId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`/api/reports?id=${reportId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setReports(reports.filter((r) => r.id !== reportId));
        if (selectedReport?.id === reportId) {
          setSelectedReport(null);
          setAnalysis(null);
        }
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image') || ['jpg', 'jpeg', 'png'].includes(type)) {
      return <ImageIcon className="w-5 h-5" />;
    }
    if (type === 'pdf') {
      return <FileText className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
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
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Medical Reports</h1>
                <p className="text-xs text-gray-500">Upload & analyze your reports</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Upload Report
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Reports List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-600" />
                  Your Reports ({reports.length})
                </h2>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {reports.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No reports uploaded yet</p>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="mt-4 text-purple-600 hover:underline text-sm"
                    >
                      Upload your first report
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedReport?.id === report.id ? 'bg-purple-50' : ''
                        }`}
                        onClick={() => viewReportAnalysis(report)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-purple-600">
                                {getFileIcon(report.fileType)}
                              </span>
                              <p className="font-medium text-gray-900 truncate">{report.fileName}</p>
                            </div>
                            <p className="text-sm text-gray-500 capitalize">
                              {report.reportType.replace('_', ' ')}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-400">
                                {formatDate(report.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {report.aiSummary && (
                              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                                Analyzed
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteReport(report.id);
                              }}
                              className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Analysis with 3 Tabs */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Report Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-purple-600">
                        {getFileIcon(selectedReport.fileType)}
                      </span>
                      <div>
                        <h2 className="font-semibold text-gray-900">{selectedReport.fileName}</h2>
                        <p className="text-sm text-gray-500 capitalize">
                          {selectedReport.reportType.replace('_', ' ')} • {formatDate(selectedReport.createdAt)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedReport(null);
                        setAnalysis(null);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* 3 Tabs */}
                <div className="flex border-b border-gray-100">
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 font-medium transition-colors ${
                      activeTab === 'summary'
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <FileSearch className="w-5 h-5" />
                    Summary
                  </button>
                  <button
                    onClick={() => setActiveTab('diet')}
                    className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 font-medium transition-colors ${
                      activeTab === 'diet'
                        ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Utensils className="w-5 h-5" />
                    Diet Plan
                  </button>
                  <button
                    onClick={() => setActiveTab('workout')}
                    className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 font-medium transition-colors ${
                      activeTab === 'workout'
                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Dumbbell className="w-5 h-5" />
                    Workout
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  {analyzing ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 text-purple-500 mx-auto animate-spin" />
                      <p className="mt-4 text-gray-600">Analyzing your report...</p>
                      <p className="text-sm text-gray-400 mt-2">Generating personalized recommendations</p>
                    </div>
                  ) : !analysis || (!analysis.summary && !analysis.dietPlan && !analysis.workoutPlan) ? (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No analysis available for this report</p>
                      <p className="text-sm text-gray-400">Upload report content to get AI analysis</p>
                    </div>
                  ) : (
                    <>
                      {/* Summary Tab */}
                      {activeTab === 'summary' && analysis.summary && (
                        <div className="space-y-6">
                          {analysis.summary.keyFindings?.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-500" />
                                Key Findings
                              </h3>
                              <div className="space-y-2">
                                {analysis.summary.keyFindings.map((finding, i) => (
                                  <div key={i} className="flex items-start gap-2 p-3 bg-purple-50 rounded-xl">
                                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-700">{finding}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {analysis.summary.normalResults?.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Normal Results
                              </h3>
                              <div className="space-y-2">
                                {analysis.summary.normalResults.map((result, i) => (
                                  <div key={i} className="flex items-start gap-2 p-3 bg-green-50 rounded-xl">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-700">{result}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {analysis.summary.attentionNeeded?.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                Needs Attention
                              </h3>
                              <div className="space-y-2">
                                {analysis.summary.attentionNeeded.map((item, i) => (
                                  <div key={i} className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-700">{item}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {analysis.summary.recommendations?.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
                              <ul className="space-y-2">
                                {analysis.summary.recommendations.map((rec, i) => (
                                  <li key={i} className="flex items-start gap-2 text-gray-700">
                                    <ChevronRight className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Diet Plan Tab */}
                      {activeTab === 'diet' && analysis.dietPlan && (
                        <div className="space-y-6">
                          {analysis.dietPlan.focus && (
                            <div className="bg-pink-50 rounded-xl p-4">
                              <h3 className="font-semibold text-pink-700 mb-2">Focus Area</h3>
                              <p className="text-gray-700">{analysis.dietPlan.focus}</p>
                            </div>
                          )}

                          {analysis.dietPlan.recommendations?.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-3">Recommended Foods</h3>
                              <div className="space-y-3">
                                {analysis.dietPlan.recommendations.map((rec, i) => (
                                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <p className="font-medium text-gray-900">{rec.food}</p>
                                        <p className="text-sm text-gray-600">{rec.reason}</p>
                                      </div>
                                      <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                                        {rec.frequency}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {analysis.dietPlan.avoid?.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Foods to Avoid
                              </h3>
                              <div className="space-y-2">
                                {analysis.dietPlan.avoid.map((item, i) => (
                                  <div key={i} className="flex items-start gap-2 p-3 bg-red-50 rounded-xl">
                                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-medium text-gray-900">{item.item}</p>
                                      <p className="text-sm text-gray-600">{item.reason}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {analysis.dietPlan.sampleMeals && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-3">Sample Day</h3>
                              <div className="grid gap-3">
                                <div className="p-3 bg-amber-50 rounded-xl">
                                  <p className="text-xs text-amber-600 font-medium">BREAKFAST</p>
                                  <p className="text-gray-900">{analysis.dietPlan.sampleMeals.breakfast}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-xl">
                                  <p className="text-xs text-orange-600 font-medium">LUNCH</p>
                                  <p className="text-gray-900">{analysis.dietPlan.sampleMeals.lunch}</p>
                                </div>
                                <div className="p-3 bg-indigo-50 rounded-xl">
                                  <p className="text-xs text-indigo-600 font-medium">DINNER</p>
                                  <p className="text-gray-900">{analysis.dietPlan.sampleMeals.dinner}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Workout Tab */}
                      {activeTab === 'workout' && analysis.workoutPlan && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            {analysis.workoutPlan.intensity && (
                              <div className="bg-indigo-50 rounded-xl p-4">
                                <p className="text-xs text-indigo-600 font-medium">INTENSITY</p>
                                <p className="font-semibold text-gray-900">{analysis.workoutPlan.intensity}</p>
                              </div>
                            )}
                            {analysis.workoutPlan.focus && (
                              <div className="bg-purple-50 rounded-xl p-4">
                                <p className="text-xs text-purple-600 font-medium">FOCUS</p>
                                <p className="font-semibold text-gray-900">{analysis.workoutPlan.focus}</p>
                              </div>
                            )}
                          </div>

                          {analysis.workoutPlan.exercises?.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-3">Recommended Exercises</h3>
                              <div className="space-y-3">
                                {analysis.workoutPlan.exercises.map((ex, i) => (
                                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-start justify-between mb-2">
                                      <p className="font-medium text-gray-900">{ex.name}</p>
                                      <span className="text-sm text-purple-600">{ex.duration}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{ex.benefit}</p>
                                    {ex.precaution && (
                                      <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block">
                                        {ex.precaution}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {analysis.workoutPlan.avoid?.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Avoid
                              </h3>
                              <ul className="space-y-2">
                                {analysis.workoutPlan.avoid.map((item, i) => (
                                  <li key={i} className="flex items-center gap-2 text-gray-700">
                                    <X className="w-4 h-4 text-red-500" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {analysis.workoutPlan.weeklySchedule && (
                            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-4 text-white">
                              <h3 className="font-semibold mb-2">Weekly Schedule</h3>
                              <p>{analysis.workoutPlan.weeklySchedule}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    This analysis is for informational purposes only. Always consult your healthcare provider for medical advice.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <FileSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a Report</h2>
                <p className="text-gray-500 mb-6">
                  Click on a report to view its AI-powered analysis with personalized diet and workout recommendations.
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                >
                  <Upload className="w-5 h-5" />
                  Upload New Report
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Upload Modal with File Upload */}
      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowUploadModal(false);
            resetUploadForm();
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Upload Medical Report</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* File Upload Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-purple-500 bg-purple-50'
                    : selectedFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.txt"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type.split('/')[1]?.toUpperCase()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resetUploadForm();
                      }}
                      className="mt-3 text-sm text-purple-600 hover:underline"
                    >
                      Choose different file
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileUp className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="font-medium text-gray-900 mb-1">
                      {isDragging ? 'Drop your file here' : 'Drag & drop your report here'}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">or click to browse</p>
                    <p className="text-xs text-gray-400">
                      Supports PDF, JPG, PNG, TXT (Max 10MB)
                    </p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <select
                    value={uploadForm.reportType}
                    onChange={(e) => setUploadForm({ ...uploadForm, reportType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {REPORT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Date
                  </label>
                  <input
                    type="date"
                    value={uploadForm.reportDate}
                    onChange={(e) => setUploadForm({ ...uploadForm, reportDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes / Key Findings (Optional)
                </label>
                <textarea
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                  placeholder="Enter any key findings or notes from your report for better AI analysis..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Adding key values helps the AI provide more accurate recommendations
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Upload & Analyze
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

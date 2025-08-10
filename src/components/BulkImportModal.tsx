import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from './ui/Toaster';
import Papa from 'papaparse';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose, onImportComplete }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const requiredFields = ['title', 'date', 'category', 'country', 'description'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        previewFile(selectedFile);
      } else {
        addToast({
          title: 'Invalid File Type',
          description: 'Please select a CSV file',
          type: 'error'
        });
      }
    }
  };

  const previewFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: 5,
      complete: (results) => {
        setPreviewData(results.data);
        validateData(results.data);
      },
      error: (error) => {
        addToast({
          title: 'File Parse Error',
          description: error.message,
          type: 'error'
        });
      }
    });
  };

  const validateData = (data: any[]) => {
    const errors: string[] = [];
    
    if (data.length === 0) {
      errors.push('File is empty');
      setValidationErrors(errors);
      return;
    }

    const firstRow = data[0];
    const missingFields = requiredFields.filter(field => !(field in firstRow));
    
    if (missingFields.length > 0) {
      errors.push(`Missing required columns: ${missingFields.join(', ')}`);
    }

    // Validate date formats
    data.forEach((row, index) => {
      if (row.date && isNaN(Date.parse(row.date))) {
        errors.push(`Invalid date format in row ${index + 1}: ${row.date}`);
      }
    });

    setValidationErrors(errors);
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    setUploadStatus('Parsing file...');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const data = results.data.map((row: any) => ({
            ...row,
            user_id: user.id,
            status: user.role === 'admin' ? 'approved' : 'pending',
            created_at: new Date().toISOString(),
            is_personal: false
          }));

          setUploadStatus(`Uploading ${data.length} events...`);

          const { error } = await supabase
            .from('events')
            .insert(data);

          if (error) throw error;

          addToast({
            title: 'Import Successful',
            description: `${data.length} events imported successfully`,
            type: 'success'
          });

          onImportComplete();
          onClose();
          resetModal();
        } catch (error: any) {
          addToast({
            title: 'Import Failed',
            description: error.message || 'Failed to import events',
            type: 'error'
          });
        } finally {
          setIsUploading(false);
          setUploadStatus(null);
        }
      },
      error: (error) => {
        addToast({
          title: 'Parse Error',
          description: error.message,
          type: 'error'
        });
        setIsUploading(false);
        setUploadStatus(null);
      }
    });
  };

  const downloadTemplate = () => {
    const template = [
      {
        title: 'Example Event',
        date: '2024-01-01',
        category: 'Historical',
        country: 'USA',
        description: 'This is an example event description',
        image_url: 'https://example.com/image.jpg'
      }
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setFile(null);
    setPreviewData([]);
    setValidationErrors([]);
    setUploadStatus(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="glass-card dark:glass-card-dark rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto soft-shadow dark:soft-shadow-dark"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-ink-900 dark:text-white">
                Bulk Import Events
              </h2>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5 text-ink-500" />
              </motion.button>
            </div>

            <div className="space-y-6">
              {/* Template Download */}
              <div className="glass-card dark:glass-card-dark rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-ink-900 dark:text-white">Download Template</h3>
                    <p className="text-sm text-ink-600 dark:text-ink-400">
                      Get the CSV template with required columns
                    </p>
                  </div>
                  <motion.button
                    onClick={downloadTemplate}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-xl hover:from-sage-600 hover:to-sage-700 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Template</span>
                  </motion.button>
                </div>
              </div>

              {/* File Upload */}
              <div className="glass-card dark:glass-card-dark rounded-2xl p-6">
                <div className="border-2 border-dashed border-ink-300 dark:border-ink-600 rounded-xl p-8 text-center">
                  <Upload className="h-12 w-12 text-ink-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-ink-900 dark:text-white mb-2">
                    Upload CSV File
                  </h3>
                  <p className="text-sm text-ink-600 dark:text-ink-400 mb-4">
                    Select a CSV file with your events data
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="csv-file-input"
                  />
                  <label
                    htmlFor="csv-file-input"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Choose File</span>
                  </label>
                  {file && (
                    <p className="mt-4 text-sm text-ink-600 dark:text-ink-400">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Validation Results */}
              {validationErrors.length > 0 && (
                <div className="glass-card dark:glass-card-dark rounded-2xl p-4 border-l-4 border-coral-500">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-coral-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-coral-700 dark:text-coral-300">
                        Validation Errors
                      </h4>
                      <ul className="mt-2 text-sm text-coral-600 dark:text-coral-400 space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Data */}
              {previewData.length > 0 && validationErrors.length === 0 && (
                <div className="glass-card dark:glass-card-dark rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-sage-500" />
                    <h4 className="font-medium text-ink-900 dark:text-white">
                      Preview (First 5 rows)
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-ink-200 dark:border-ink-700">
                          {Object.keys(previewData[0]).map((key) => (
                            <th key={key} className="text-left p-2 font-medium text-ink-700 dark:text-ink-300">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, index) => (
                          <tr key={index} className="border-b border-ink-100 dark:border-ink-800">
                            {Object.values(row).map((value: any, cellIndex) => (
                              <td key={cellIndex} className="p-2 text-ink-600 dark:text-ink-400">
                                {String(value).substring(0, 50)}
                                {String(value).length > 50 ? '...' : ''}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Upload Status */}
              {uploadStatus && (
                <div className="glass-card dark:glass-card-dark rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <span className="text-ink-900 dark:text-white">{uploadStatus}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <motion.button
                  onClick={onClose}
                  className="px-6 py-3 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleUpload}
                  disabled={!file || validationErrors.length > 0 || isUploading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span>{isUploading ? 'Importing...' : 'Import Events'}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BulkImportModal;
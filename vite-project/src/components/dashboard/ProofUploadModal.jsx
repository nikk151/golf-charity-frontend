// src/components/dashboard/ProofUploadModal.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Check, Loader2, FileImage } from 'lucide-react';
import { winnerService } from '../../services/api';

const ProofUploadModal = ({ win, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid image file (PNG, JPG).');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('screenshot', file);

    try {
      await winnerService.uploadProof(win.id, formData);
      onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-brand-dark/95 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 relative border-brand-primary/20"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-brand-primary" />
          </div>
          <h3 className="text-2xl font-display text-white font-bold">Proof of Performance</h3>
          <p className="text-gray-400 text-sm mt-1">Upload a clear photo of your scorecard for Round #{win.id}</p>
        </div>

        <div className="space-y-6">
          {/* Custom Dropzone/Input */}
          <label className={`block border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            file ? 'border-brand-primary bg-brand-primary/5' : 'border-white/10 hover:border-brand-primary/30 hover:bg-white/5'
          }`}>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            
            {file ? (
              <div className="flex flex-col items-center">
                <Check className="w-8 h-8 text-brand-primary mb-2" />
                <span className="text-white font-medium text-sm truncate max-w-[200px]">{file.name}</span>
                <span className="text-gray-500 text-[10px] uppercase mt-1">Click to Replace</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FileImage className="w-8 h-8 text-gray-700 mb-2" />
                <span className="text-gray-400 text-sm">Select Image</span>
                <span className="text-gray-600 text-xs mt-1">Max size: 5MB</span>
              </div>
            )}
          </label>

          {error && <div className="text-red-400 text-xs text-center font-medium">{error}</div>}

          <button
            disabled={!file || isUploading}
            onClick={handleUpload}
            className="w-full py-4 rounded-xl bg-brand-primary text-brand-dark font-display font-bold shadow-xl shadow-brand-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Upload'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProofUploadModal;

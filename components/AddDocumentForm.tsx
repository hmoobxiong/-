import React, { useState, useRef } from 'react';
import { DocumentData, DocType, DocStatus } from '../types';
import { Upload, Sparkles, Save, X, Loader2, FileCheck } from 'lucide-react';
import { extractDocumentInfo } from '../services/geminiService';

interface AddDocumentFormProps {
  onSave: (doc: DocumentData) => void;
  onCancel: () => void;
}

const AddDocumentForm: React.FC<AddDocumentFormProps> = ({ onSave, onCancel }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<DocumentData>>({
    refNo: '',
    title: '',
    type: DocType.INTERNAL,
    fromDept: '',
    date: new Date().toISOString().split('T')[0],
    status: DocStatus.DRAFT,
    summary: '',
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto analyze on upload
      await analyzeFile(selectedFile);
    }
  };

  const analyzeFile = async (fileToAnalyze: File) => {
    setIsAnalyzing(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1]; // Remove data url prefix
        
        try {
          const extracted = await extractDocumentInfo(base64Data, fileToAnalyze.type);
          setFormData(prev => ({
            ...prev,
            ...extracted,
            // Keep default if extraction fails for these
            status: extracted.status || prev.status,
            type: extracted.type as DocType || prev.type,
            date: extracted.date || prev.date,
          }));
        } catch (err) {
          console.error("AI Analysis failed", err);
          alert("AI Analysis failed, please enter details manually.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(fileToAnalyze);
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: DocumentData = {
      id: Date.now().toString(),
      refNo: formData.refNo || `DOC-${Date.now()}`,
      title: formData.title || 'Untitled',
      type: formData.type as DocType,
      fromDept: formData.fromDept || 'Unknown',
      date: formData.date || new Date().toISOString().split('T')[0],
      status: formData.status as DocStatus,
      summary: formData.summary || '',
      fileName: file?.name
    };
    onSave(newDoc);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          ເພີ່ມເອກະສານໃໝ່ (Add Document)
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* AI Upload Section */}
      <div className="mb-8 p-6 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
            <p className="text-blue-600 font-medium animate-pulse">Gemini AI ກຳລັງວິເຄາະຂໍ້ມູນ...</p>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
          accept="image/*,application/pdf"
        />
        
        {file ? (
          <div className="flex items-center gap-3 text-green-700 bg-green-100 px-4 py-2 rounded-lg">
            <FileCheck className="w-5 h-5" />
            <span className="font-medium">{file.name}</span>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-xs underline ml-2"
            >
              ປ່ຽນ (Change)
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">ອັບໂຫລດເອກະສານເພື່ອໃຫ້ AI ອ່ານຂໍ້ມູນ</h3>
            <p className="text-sm text-slate-500 mb-4">ຮອງຮັບຮູບພາບ (JPG, PNG) ແລະ PDF</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              ເລືອກຟາຍ (Select File)
            </button>
          </>
        )}
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">ຫົວຂໍ້ເອກະສານ (Title)</label>
          <input 
            required
            type="text" 
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ເລກທີ (Ref No.)</label>
          <input 
            type="text" 
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.refNo}
            onChange={(e) => setFormData({...formData, refNo: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ວັນທີ (Date)</label>
          <input 
            type="date" 
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ປະເພດ (Type)</label>
          <select 
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value as DocType})}
          >
            {Object.values(DocType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ສະຖານະ (Status)</label>
          <select 
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as DocStatus})}
          >
            {Object.values(DocStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">ມາຈາກພາກສ່ວນ (From Department/Person)</label>
          <input 
            type="text" 
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.fromDept}
            onChange={(e) => setFormData({...formData, fromDept: e.target.value})}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">ເນື້ອໃນຫຍໍ້ (Summary)</label>
          <textarea 
            rows={4}
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            value={formData.summary}
            onChange={(e) => setFormData({...formData, summary: e.target.value})}
            placeholder="ລາຍລະອຽດຫຍໍ້ຂອງເອກະສານ..."
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
          >
            ຍົກເລີກ (Cancel)
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            ບັນທຶກ (Save)
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDocumentForm;
import React, { useState } from 'react';
import { DocumentData, DocStatus, DocType } from '../types';
import { Search, Filter, FileText, Eye } from 'lucide-react';

interface DocumentListProps {
  documents: DocumentData[];
  onView: (doc: DocumentData) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fromDept.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || doc.type === filterType;

    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: DocStatus) => {
    switch (status) {
      case DocStatus.APPROVED: return 'bg-green-100 text-green-800';
      case DocStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case DocStatus.REJECTED: return 'bg-red-100 text-red-800';
      case DocStatus.DRAFT: return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          ລາຍການເອກະສານ (Document List)
        </h2>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="ຄົ້ນຫາ... (Search)" 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">ທັງໝົດ (All)</option>
              {Object.values(DocType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-600 text-sm sticky top-0">
            <tr>
              <th className="p-4 font-semibold">ເລກທີ (Ref No)</th>
              <th className="p-4 font-semibold">ຫົວຂໍ້ (Title)</th>
              <th className="p-4 font-semibold">ວັນທີ (Date)</th>
              <th className="p-4 font-semibold">ປະເພດ (Type)</th>
              <th className="p-4 font-semibold">ສະຖານະ (Status)</th>
              <th className="p-4 font-semibold text-right">ຈັດການ (Action)</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono text-xs">{doc.refNo}</td>
                  <td className="p-4 font-medium">
                    <div className="flex flex-col">
                      <span>{doc.title}</span>
                      <span className="text-xs text-slate-400 font-light">{doc.fromDept}</span>
                    </div>
                  </td>
                  <td className="p-4">{doc.date}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-slate-100 rounded-md text-xs text-slate-600 border border-slate-200">
                      {doc.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onView(doc)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="ເບິ່ງລາຍລະອຽດ"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  ບໍ່ພົບຂໍ້ມູນເອກະສານ (No documents found)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentList;
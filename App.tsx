import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import DocumentList from './components/DocumentList';
import AddDocumentForm from './components/AddDocumentForm';
import AiSearch from './components/AiSearch';
import { DocumentData, DocType, DocStatus } from './types';
import { FileText, Inbox, Send as SendIcon, Clock, AlertCircle } from 'lucide-react';

// Mock Data for Initial State
const INITIAL_DOCS: DocumentData[] = [
  {
    id: '1',
    refNo: 'MOF-2024-001',
    title: 'ແຈ້ງການ ເລື່ອງ ການພັກວຽກ ປີໃໝ່ລາວ 2024',
    type: DocType.INTERNAL,
    fromDept: 'ກະຊວງການເງິນ',
    date: '2024-04-01',
    status: DocStatus.APPROVED,
    summary: 'ແຈ້ງການກ່ຽວກັບການພັກຊົດເຊີຍໃນໂອກາດປີໃໝ່ລາວ ຕັ້ງແຕ່ວັນທີ 14-18 ເມສາ.',
  },
  {
    id: '2',
    refNo: 'EXT-2024-045',
    title: 'ສັນຍາ ການຮ່ວມມືໂຄງການພັດທະນາ IT',
    type: DocType.CONTRACT,
    fromDept: 'ບໍລິษัท ລາວໂທລະຄົມ',
    date: '2024-05-10',
    status: DocStatus.PENDING,
    summary: 'ຮ່າງສັນຍາການຕິດຕັ້ງລະບົບ Network ພາຍໃນສຳນັກງານ.',
  },
  {
    id: '3',
    refNo: 'INT-2024-112',
    title: 'ບົດລາຍງານ ການເງິນ ປະຈຳໄຕມາດ 1',
    type: DocType.INTERNAL,
    fromDept: 'ພະແນກບັນຊີ',
    date: '2024-03-30',
    status: DocStatus.COMPLETED,
    summary: 'ສະຫຼຸບລາຍຮັບ-ລາຍຈ່າຍ ປະຈຳໄຕມາດ 1 ປີ 2024.',
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [documents, setDocuments] = useState<DocumentData[]>(INITIAL_DOCS);
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);

  // Computed Stats
  const stats = useMemo(() => {
    return {
      total: documents.length,
      incoming: documents.filter(d => d.type === DocType.INCOMING).length,
      outgoing: documents.filter(d => d.type === DocType.OUTGOING).length,
      pending: documents.filter(d => d.status === DocStatus.PENDING).length,
    };
  }, [documents]);

  const handleAddDocument = (newDoc: DocumentData) => {
    setDocuments(prev => [newDoc, ...prev]);
    setActiveTab('list');
  };

  const handleViewDocument = (doc: DocumentData) => {
    setSelectedDoc(doc);
    // In a real app, this might open a modal or navigate to a detail page
    // For now, we'll just alert or console log, or maybe switch to a detail view if we implemented one
    // Let's just show the list for now but maybe highlight it or use a simple overlay?
    // For simplicity in this prompt, I'll keep it on the list view but user sees interaction.
    alert(`Viewing: ${doc.title}\n\nSummary: ${doc.summary}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">ພາບລວມ (Dashboard)</h2>
                <p className="text-slate-500 text-sm">ສະບາຍດີ, ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບຈັດການເອກະສານ</p>
              </div>
              <button 
                onClick={() => setActiveTab('add')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors text-sm font-medium"
              >
                + ເພີ່ມເອກະສານ
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="ເອກະສານທັງໝົດ" value={stats.total} icon={FileText} color="bg-blue-500" />
              <StatCard title="ຂາເຂົ້າ (Incoming)" value={stats.incoming} icon={Inbox} color="bg-green-500" />
              <StatCard title="ຂາອອກ (Outgoing)" value={stats.outgoing} icon={SendIcon} color="bg-purple-500" />
              <StatCard title="ລໍຖ້າອະນຸມັດ" value={stats.pending} icon={Clock} color="bg-orange-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
              <div className="lg:col-span-2 h-full">
                <DocumentList documents={documents.slice(0, 5)} onView={handleViewDocument} />
              </div>
              <div className="h-full">
                 <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-full">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      ແຈ້ງເຕືອນ (Notifications)
                    </h3>
                    <div className="space-y-4">
                      {/* Mock Notifications */}
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg">
                          <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm text-slate-700 font-medium">ເອກະສານໃໝ່ຈາກ ພະແນກບຸກຄະລາກອນ</p>
                            <p className="text-xs text-slate-400">2 ຊົ່ວໂມງກ່ອນ</p>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'list':
        return <DocumentList documents={documents} onView={handleViewDocument} />;
      case 'add':
        return <AddDocumentForm onSave={handleAddDocument} onCancel={() => setActiveTab('dashboard')} />;
      case 'ai':
        return <AiSearch documents={documents} />;
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
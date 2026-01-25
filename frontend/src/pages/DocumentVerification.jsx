import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, FileText, ExternalLink, Clock, ShieldCheck } from 'lucide-react';

const DocumentVerification = ({ onRefresh }) => {
  const [pendingDocs, setPendingDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Load the Queue (Uses your GET route) ---
  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/pending-documents');
      setPendingDocs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  // --- 2. Process Action (Uses your PUT route) ---
  const handleVerify = async (docId, status) => {
    try {
      // status will be 'Approved' or 'Rejected'
      await axios.put(`http://localhost:5000/api/admin/verify-document/${docId}`, { status });
      
      alert(`Document marked as ${status}`);
      
      // Refresh the local list to remove the processed card
      fetchPending(); 
      
      // Trigger a master sync for the main dashboard counters
      if (onRefresh) onRefresh(); 
    } catch (err) {
      alert("Verification failed");
    }
  };

  if (loading) return <div className="p-10 text-center text-blue-400 font-bold animate-pulse">Scanning Database...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="text-blue-500" /> Verification Center
          </h1>
          <p className="text-gray-400 text-sm mt-1">Review student uploads for academic validation</p>
        </div>
        <div className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full text-xs font-bold border border-blue-500/20">
          {pendingDocs.length} Pending Requests
        </div>
      </div>

      {pendingDocs.length === 0 ? (
        <div className="bg-[#111] border border-dashed border-gray-800 rounded-2xl p-20 text-center">
          <CheckCircle size={48} className="text-emerald-500/20 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No pending documents to verify.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingDocs.map((doc) => (
            <div key={doc.id} className="bg-[#111] border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <FileText className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm truncate w-48">{doc.doc_name}</h3>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                       {doc.student_name} ({doc.enrollmentNo})
                    </p>
                  </div>
                </div>
                {/* PREVIEW BUTTON: Opens the actual file from server */}
                <button 
                  onClick={() => window.open(`http://localhost:5000/${doc.file_path}`, '_blank')}
                  className="text-gray-500 hover:text-white transition-colors"
                  title="Preview Document"
                >
                  <ExternalLink size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2 text-orange-400 text-[10px] font-bold uppercase">
                  <Clock size={12} /> Verification Required
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleVerify(doc.id, 'Rejected')}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <XCircle size={20} />
                  </button>
                  <button 
                    onClick={() => handleVerify(doc.id, 'Approved')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle size={14} /> APPROVE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentVerification;
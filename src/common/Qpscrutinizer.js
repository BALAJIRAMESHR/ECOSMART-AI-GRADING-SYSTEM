import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  FileText, 
  Check, 
  X, 
  Clock, 
  Search, 
  Filter, 
  Info, 
  ArrowUpRight 
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusColors = {
    Accepted: 'bg-green-100 text-green-800 border-green-200',
    Declined: 'bg-red-100 text-red-800 border-red-200',
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Under Review': 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
    >
      {status || 'Pending'}
    </span>
  );
};

const QATableManagement = () => {
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [detailsModal, setDetailsModal] = useState(null);

  // Fetch question papers
  const fetchQuestionPapers = async () => {
    try {
      const { data, error } = await supabase.from('QATABLE').select('*');
      if (error) throw error;

      // Ensure every paper has a status, defaulting to 'Pending'
      const processedData = (data || []).map((paper) => ({
        ...paper,
        status: paper.status?.trim() || 'Pending'
      }));

      setPapers(processedData);
      // Apply initial filtering
      applyFilters(processedData, searchTerm, 'All');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching question papers:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionPapers();
  }, []);

  // New function to apply both search and status filters
  const applyFilters = (papersList, search, statusFilter) => {
    let filtered = [...papersList];

    // Apply search filter if there's a search term
    if (search.trim()) {
      filtered = filtered.filter(paper => 
        paper.exam_name?.toLowerCase().includes(search.toLowerCase()) ||
        paper.course_id?.toLowerCase().includes(search.toLowerCase()) ||
        paper.question_paper_id?.toString().includes(search)
      );
    }

    // Apply status filter if it's not 'All'
    if (statusFilter !== 'All') {
      filtered = filtered.filter(paper => paper.status === statusFilter);
    }

    setFilteredPapers(filtered);
  };

  // Handle search input changes
  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFilters(papers, term, filter);
  };

  // Handle status filter changes
  const handleStatusFilter = (statusFilter) => {
    setFilter(statusFilter);
    applyFilters(papers, searchTerm, statusFilter);
  };

  // Update paper status
  const updatePaperStatus = async (id, status = 'Pending') => {
    try {
      const { data, error } = await supabase
        .from('QATABLE')
        .update({ status })
        .eq('question_paper_id', id)
        .select();

      if (error) {
        setError(`Failed to update: ${error.message}`);
        return false;
      }

      if (data && data.length > 0) {
        // Refresh the papers list and maintain current filters
        await fetchQuestionPapers();
        setDetailsModal(null);
        return true;
      } else {
        setError(`No changes made for Paper ID: ${id}.`);
        return false;
      }
    } catch (err) {
      setError(`Error updating paper ID: ${id}. ${err.message}`);
      return false;
    }
  };

  // Render QAP content
  const renderQAPContent = (qap) => {
    try {
      const qapData = typeof qap === 'string' ? JSON.parse(qap) : qap;
      return (
        <div className="space-y-4 bg-gray-50 rounded-lg p-4">
          {Array.isArray(qapData) ? (
            qapData.map((qa, index) => (
              <div
                key={index}
                className="bg-white border rounded-md p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">Question {index + 1}</h4>
                  <span className="text-sm text-gray-600 font-medium">Marks: {qa.marks}</span>
                </div>
                <p className="text-gray-700 mb-2">{qa.question}</p>
                <div className="bg-gray-100 rounded p-3">
                  <p className="text-sm text-gray-600">
                    <strong>Model Answer:</strong> {qa.answer}
                  </p>
                  {qa.prompt && (
                    <p className="text-sm text-gray-500 mt-1">
                      <strong>Prompt:</strong> {qa.prompt}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-red-500 text-center">Invalid Question Paper Format</p>
          )}
        </div>
      );
    } catch (e) {
      return <p className="text-red-500">Error parsing question paper</p>;
    }
  };

  // Modal for paper details
  const PaperDetailsModal = ({ paper, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-in">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {paper.exam_name || 'Unnamed Exam'}
                  </h3>
                  <p className="text-sm text-gray-600">Course: {paper.course_id || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <StatusBadge status={paper.status} />
                <button 
                  onClick={onClose} 
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4 text-sm text-gray-700 bg-white/70 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-blue-500" />
                <span><strong>Paper ID:</strong> {paper.question_paper_id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="w-5 h-5 text-green-500" />
                <span><strong>Faculty:</strong> {paper.faculty_id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span><strong>Submitted:</strong> {new Date(paper.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {renderQAPContent(paper.qap)}

            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => updatePaperStatus(paper.question_paper_id, 'Accepted')}
                className="w-full flex items-center justify-center bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors space-x-2"
              >
                <Check className="w-5 h-5" />
                <span>Accept Paper</span>
              </button>
              <button
                onClick={() => updatePaperStatus(paper.question_paper_id, 'Declined')}
                className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Decline Paper</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container p-4">
      {detailsModal && (
        <PaperDetailsModal paper={detailsModal} onClose={() => setDetailsModal(null)} />
      )}

      <div className="overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-white border-b flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <span>Question Paper Management</span>
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search papers..." 
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Search className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="flex space-x-2">
              {['All', 'Pending', 'Accepted', 'Declined'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-all space-x-2 ${
                    filter === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>{status}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-24 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-4 rounded relative">
            {error}
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="text-center py-12 text-gray-500 space-y-4">
            <FileText className="mx-auto w-16 h-16 text-gray-300" />
            <p className="text-xl">No question papers found matching your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredPapers.map((paper) => (
              <div
                key={paper.question_paper_id}
                className="bg-white border rounded-lg p-5 shadow-md hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {paper.exam_name || 'Unnamed Exam'}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">Course: {paper.course_id || 'N/A'}</p>
                  </div>
                  <StatusBadge status={paper.status} />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">ID: {paper.question_paper_id}</span>
                  <button
                    onClick={() => setDetailsModal(paper)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <Info className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QATableManagement;
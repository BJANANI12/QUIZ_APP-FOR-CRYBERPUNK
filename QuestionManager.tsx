import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Database, Filter } from 'lucide-react';
import { quizDatabase, Question, QuestionInput } from '../database/database';

interface QuestionManagerProps {
  onClose: () => void;
}

const QuestionManager: React.FC<QuestionManagerProps> = ({ onClose }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');

  const [formData, setFormData] = useState<QuestionInput>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    category: '',
    difficulty: ''
  });

  useEffect(() => {
    loadQuestions();
    loadFilters();
  }, [filterCategory, filterDifficulty]);

  const loadQuestions = () => {
    let loadedQuestions: Question[];
    
    if (filterCategory && filterDifficulty) {
      loadedQuestions = quizDatabase.getAllQuestions().filter(q => 
        q.category === filterCategory && q.difficulty === filterDifficulty
      );
    } else if (filterCategory) {
      loadedQuestions = quizDatabase.getQuestionsByCategory(filterCategory);
    } else if (filterDifficulty) {
      loadedQuestions = quizDatabase.getQuestionsByDifficulty(filterDifficulty);
    } else {
      loadedQuestions = quizDatabase.getAllQuestions();
    }
    
    setQuestions(loadedQuestions);
  };

  const loadFilters = () => {
    setCategories(quizDatabase.getCategories());
    setDifficulties(quizDatabase.getDifficulties());
  };

  const resetForm = () => {
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      category: '',
      difficulty: ''
    });
  };

  const handleAdd = () => {
    if (validateForm()) {
      quizDatabase.createQuestion(formData);
      loadQuestions();
      loadFilters();
      setShowAddForm(false);
      resetForm();
    }
  };

  const handleEdit = (question: Question) => {
    setFormData({
      question: question.question,
      options: Array.isArray(question.options) ? question.options : JSON.parse(question.options as string),
      correctAnswer: question.correctAnswer,
      category: question.category,
      difficulty: question.difficulty
    });
    setEditingId(question.id);
  };

  const handleUpdate = () => {
    if (editingId && validateForm()) {
      quizDatabase.updateQuestion(editingId, formData);
      loadQuestions();
      loadFilters();
      setEditingId(null);
      resetForm();
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      quizDatabase.deleteQuestion(id);
      loadQuestions();
      loadFilters();
    }
  };

  const validateForm = (): boolean => {
    if (!formData.question.trim()) {
      alert('Question is required');
      return false;
    }
    if (formData.options.some(opt => !opt.trim())) {
      alert('All options must be filled');
      return false;
    }
    if (!formData.category.trim()) {
      alert('Category is required');
      return false;
    }
    if (!formData.difficulty.trim()) {
      alert('Difficulty is required');
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="terminal-window max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="terminal-header">
          <Database className="w-4 h-4" />
          <span>QUESTION DATABASE MANAGER</span>
          <button 
            onClick={onClose}
            className="ml-auto hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="cyber-button cyber-button-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              ADD QUESTION
            </button>

            {/* Filters */}
            <div className="flex gap-2 items-center">
              <Filter className="w-4 h-4 text-cyan-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-black/50 border border-green-400 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="bg-black/50 border border-green-400 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Difficulties</option>
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add/Edit Form */}
          {(showAddForm || editingId) && (
            <div className="terminal-small mb-6 p-4">
              <h3 className="text-cyan-400 font-bold mb-4">
                {editingId ? 'EDIT QUESTION' : 'ADD NEW QUESTION'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-green-400 mb-2">Question:</label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    className="w-full bg-black/50 border border-green-400 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-cyan-400"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-green-400 mb-2">Options:</label>
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.correctAnswer === index}
                        onChange={() => setFormData({...formData, correctAnswer: index})}
                        className="text-green-400"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...formData.options];
                          newOptions[index] = e.target.value;
                          setFormData({...formData, options: newOptions});
                        }}
                        className="flex-1 bg-black/50 border border-green-400 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-cyan-400"
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-green-400 mb-2">Category:</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-black/50 border border-green-400 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-cyan-400"
                      placeholder="e.g., Cybersecurity"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-green-400 mb-2">Difficulty:</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                      className="w-full bg-black/50 border border-green-400 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">Select Difficulty</option>
                      <option value="Basic">Basic</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={editingId ? handleUpdate : handleAdd}
                    className="cyber-button cyber-button-primary"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'UPDATE' : 'ADD'}
                  </button>
                  
                  <button
                    onClick={handleCancel}
                    className="cyber-button cyber-button-secondary"
                  >
                    <X className="w-4 h-4 mr-2" />
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className="text-center text-cyan-400 py-8">
                NO QUESTIONS FOUND
              </div>
            ) : (
              questions.map((question) => (
                <div key={question.id} className="terminal-small p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-green-400 font-bold mb-2">
                        #{question.id}: {question.question}
                      </h4>
                      <div className="text-sm text-cyan-400 mb-2">
                        Category: {question.category} | Difficulty: {question.difficulty}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(question)}
                        className="cyber-button cyber-button-accent text-xs px-2 py-1"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="cyber-button cyber-button-secondary text-xs px-2 py-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {(Array.isArray(question.options) ? question.options : JSON.parse(question.options as string)).map((option: string, index: number) => (
                      <div key={index} className={`text-sm ${index === question.correctAnswer ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                        {String.fromCharCode(65 + index)}: {option} {index === question.correctAnswer && '✓'}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionManager;
import React, { useState, useEffect } from 'react';
import { quizDatabase, Question as QuestionType } from '../database/database';
import Question from './Question';
import Leaderboard from './Leaderboard';
import Certificate from './Certificate';
import QuestionManager from './QuestionManager';
import { Zap, Trophy, Download, FileText, Database, Settings } from 'lucide-react';

interface QuizResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  timestamp: Date;
  playerName: string;
}

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [showQuestionManager, setShowQuestionManager] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    const loadedQuestions = quizDatabase.getAllQuestions();
    setQuestions(loadedQuestions);
  };

  useEffect(() => {
    const savedResults = localStorage.getItem('hackQuizResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  useEffect(() => {
    if (gameStarted && !quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      completeQuiz();
    }
  }, [timeLeft, gameStarted, quizCompleted]);

  const startQuiz = () => {
    if (playerName.trim() && studentId.trim()) {
      loadQuestions(); // Reload questions before starting
      setGameStarted(true);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        completeQuiz();
      }
    }, 2000);
  };

  const completeQuiz = () => {
    const timeSpent = 300 - timeLeft;
    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      timeSpent,
      timestamp: new Date(),
      playerName: playerName || 'Anonymous Hacker'
    };

    const updatedResults = [...results, result];
    setResults(updatedResults);
    localStorage.setItem('hackQuizResults', JSON.stringify(updatedResults));
    
    setQuizCompleted(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setScore(0);
    setTimeLeft(300);
    setQuizCompleted(false);
    setGameStarted(false);
    setShowLeaderboard(false);
    setShowQuestionManager(false);
    setShowCertificate(false);
    loadQuestions(); // Reload questions when resetting
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadCSV = () => {
    const headers = ['Player Name', 'Score', 'Total Questions', 'Percentage', 'Time Spent', 'Date'];
    const csvRows = [headers];
    
    results.forEach(result => {
      const percentage = ((result.score / result.totalQuestions) * 100).toFixed(1);
      const row = [
        `"${result.playerName}"`,
        result.score.toString(),
        result.totalQuestions.toString(),
        `"${percentage}%"`,
        `"${formatTime(result.timeSpent)}"`,
        `"${new Date(result.timestamp).toLocaleDateString()}"`
      ];
      csvRows.push(row);
    });

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberpunk-quiz-results-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalResults: results.length,
      results: results.map(result => ({
        ...result,
        timestamp: new Date(result.timestamp).toISOString(),
        percentage: ((result.score / result.totalQuestions) * 100).toFixed(1)
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberpunk-quiz-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-cyberpunk flex items-center justify-center p-4">
        <div className="terminal-window max-w-md w-full">
          <div className="terminal-header">
            <span className="text-green-400">SYSTEM INITIALIZATION</span>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <Zap className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
              <h1 className="text-2xl font-bold text-green-400 mb-2 glitch">CYBERPUNK</h1>
              <h2 className="text-lg text-cyan-400">INFILTRATION PROTOCOL</h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <label className="block text-green-400 mb-2">Enter Hacker Alias:</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-black/50 border border-green-400 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="Anonymous"
                maxLength={20}
              />
              
              <label className="block text-green-400 mb-2">Enter Student ID:</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-black/50 border border-green-400 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="STU001"
                maxLength={15}
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={startQuiz}
                disabled={!playerName.trim() || !studentId.trim()}
                className="w-full cyber-button cyber-button-primary"
              >
                <Zap className="w-4 h-4 mr-2" />
                INITIATE HACK SEQUENCE
              </button>
              
              <button
                onClick={() => setShowLeaderboard(true)}
                className="w-full cyber-button cyber-button-secondary"
              >
                <Trophy className="w-4 h-4 mr-2" />
                VIEW SCOREBOARD
              </button>
              
              <button
                onClick={() => setShowQuestionManager(true)}
                className="w-full cyber-button cyber-button-accent"
              >
                <Settings className="w-4 h-4 mr-2" />
                MANAGE QUESTIONS
              </button>
            </div>
          </div>
        </div>

        {showQuestionManager && (
          <QuestionManager 
            onClose={() => {
              setShowQuestionManager(false);
              loadQuestions();
            }}
          />
        )}

        {showLeaderboard && (
          <Leaderboard 
            results={results} 
            onClose={() => setShowLeaderboard(false)}
            onDownloadCSV={downloadCSV}
            onDownloadJSON={downloadJSON}
          />
        )}
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    const grade = percentage >= 80 ? 'ELITE HACKER' : 
                 percentage >= 60 ? 'SKILLED OPERATIVE' : 
                 percentage >= 40 ? 'SCRIPT KIDDIE' : 'ACCESS REVOKED';

    return (
      <div className="min-h-screen bg-cyberpunk flex items-center justify-center p-4">
        <div className="terminal-window max-w-md w-full">
          <div className="terminal-header">
            <span className="text-green-400">MISSION COMPLETE</span>
          </div>
          <div className="p-6 text-center">
            <div className="mb-6">
              {percentage >= 60 ? (
                <div className="neon-fireworks">
                  <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">❌</span>
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-green-400 mb-2 glitch">{grade}</h2>
              <div className="text-cyan-400">
                <p>Score: {score}/{questions.length} ({percentage.toFixed(1)}%)</p>
                <p>Time: {formatTime(300 - timeLeft)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowCertificate(true)}
                className="w-full cyber-button cyber-button-primary"
                disabled={percentage < 60}
              >
                <FileText className="w-4 h-4 mr-2" />
                {percentage >= 60 ? 'GENERATE CERTIFICATE' : 'INSUFFICIENT SCORE'}
              </button>
              
              <button
                onClick={() => setShowLeaderboard(true)}
                className="w-full cyber-button cyber-button-secondary"
              >
                <Trophy className="w-4 h-4 mr-2" />
                VIEW LEADERBOARD
              </button>
              
              <button
                onClick={resetQuiz}
                className="w-full cyber-button cyber-button-accent"
              >
                <Zap className="w-4 h-4 mr-2" />
                RESTART PROTOCOL
              </button>
            </div>
          </div>
        </div>

        {showCertificate && (
          <Certificate 
            playerName={playerName}
            score={score}
            totalQuestions={questions.length}
            onClose={() => setShowCertificate(false)}
          />
        )}

        {showQuestionManager && (
          <QuestionManager 
            onClose={() => {
              setShowQuestionManager(false);
              loadQuestions();
            }}
          />
        )}

        {showLeaderboard && (
          <Leaderboard 
            results={results} 
            onClose={() => setShowLeaderboard(false)}
            onDownloadCSV={downloadCSV}
            onDownloadJSON={downloadJSON}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyberpunk flex flex-col p-4">
      {questions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="terminal-window max-w-md w-full">
            <div className="terminal-header">
              <span className="text-red-400">NO QUESTIONS AVAILABLE</span>
            </div>
            <div className="p-6 text-center">
              <Database className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-cyan-400 mb-4">
                No questions found in database. Please add questions to start the quiz.
              </p>
              <button
                onClick={() => setShowQuestionManager(true)}
                className="cyber-button cyber-button-primary"
              >
                <Settings className="w-4 h-4 mr-2" />
                MANAGE QUESTIONS
              </button>
            </div>
          </div>
          
          {showQuestionManager && (
            <QuestionManager 
              onClose={() => {
                setShowQuestionManager(false);
                loadQuestions();
              }}
            />
          )}
        </div>
      ) : (
        <>
      {/* HUD Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="terminal-small">
          <div className="text-green-400 font-mono">
            SCORE: <span className="text-cyan-400">{score}/{questions.length}</span>
          </div>
        </div>
        
        <div className="terminal-small">
          <div className="text-green-400 font-mono">
            TIME: <span className={`${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Scanner */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-green-400 mb-2">
          <span>INFILTRATION PROGRESS</span>
          <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="progress-scanner">
          <div 
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Component */}
      <div className="flex-1 flex items-center justify-center">
        <Question
          question={questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
          onAnswerSelect={handleAnswerSelect}
          selectedAnswer={selectedAnswers[currentQuestion]}
        />
      </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
import React from 'react';
import { Trophy, Download, FileText, Database, X } from 'lucide-react';

interface QuizResult {
  playerName: string;
  studentId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  timestamp: number;
}

interface LeaderboardProps {
  results: QuizResult[];
  onClose: () => void;
  onDownloadCSV: () => void;
  onDownloadJSON: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ results, onClose, onDownloadCSV, onDownloadJSON }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedResults = [...results].sort((a, b) => {
    const scoreA = (a.score / a.totalQuestions) * 100;
    const scoreB = (b.score / b.totalQuestions) * 100;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a.timeSpent - b.timeSpent;
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="terminal-window max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="terminal-header">
          <Trophy className="w-4 h-4" />
          <span>HACKER LEADERBOARD</span>
          <button 
            onClick={onClose}
            className="ml-auto hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Download Controls */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <button
              onClick={onDownloadCSV}
              className="cyber-button cyber-button-secondary flex-1 min-w-[150px]"
            >
              <FileText className="w-4 h-4 mr-2" />
              EXPORT CSV
            </button>
            <button
              onClick={onDownloadJSON}
              className="cyber-button cyber-button-accent flex-1 min-w-[150px]"
            >
              <Database className="w-4 h-4 mr-2" />
              EXPORT JSON
            </button>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-green-400/30">
                  <th className="text-green-400 py-3 px-2 font-mono">RANK</th>
                  <th className="text-green-400 py-3 px-2 font-mono">HACKER ALIAS</th>
                  <th className="text-green-400 py-3 px-2 font-mono">STUDENT ID</th>
                  <th className="text-green-400 py-3 px-2 font-mono">SCORE</th>
                  <th className="text-green-400 py-3 px-2 font-mono">ACCURACY</th>
                  <th className="text-green-400 py-3 px-2 font-mono">TIME</th>
                  <th className="text-green-400 py-3 px-2 font-mono">DATE</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-cyan-400 py-8 font-mono">
                      NO HACKS RECORDED
                    </td>
                  </tr>
                ) : (
                  sortedResults.map((result, index) => {
                    const percentage = (result.score / result.totalQuestions) * 100;
                    return (
                      <tr key={index} className="border-b border-green-400/10 hover:bg-green-400/5 transition-colors">
                        <td className="py-3 px-2 font-mono">
                          <span className={`${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-cyan-400'}`}>
                            #{index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-mono text-green-400">
                          {result.playerName}
                        </td>
                        <td className="py-3 px-2 font-mono text-cyan-400">
                          {result.studentId}
                        </td>
                        <td className="py-3 px-2 font-mono text-cyan-400">
                          {result.score}/{result.totalQuestions}
                        </td>
                        <td className="py-3 px-2 font-mono">
                          <span className={`${percentage >= 80 ? 'text-green-400' : percentage >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-2 font-mono text-cyan-400">
                          {formatTime(result.timeSpent)}
                        </td>
                        <td className="py-3 px-2 font-mono text-green-400 text-sm">
                          {new Date(result.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
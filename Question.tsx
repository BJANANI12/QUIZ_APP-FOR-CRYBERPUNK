import React, { useState, useEffect } from 'react';
import { Question as QuestionType } from '../database/database';
import { Terminal, Zap } from 'lucide-react';

interface QuestionProps {
  question: QuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelect: (answerIndex: number) => void;
  selectedAnswer?: number;
}

const Question: React.FC<QuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelect,
  selectedAnswer
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typing effect for question text
  useEffect(() => {
    if (currentIndex < question.question.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + question.question[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, question.question]);

  // Reset typing effect when question changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setShowFeedback(false);
  }, [question.id]);

  const handleAnswerClick = (answerIndex: number) => {
    if (selectedAnswer !== undefined) return;

    const correct = answerIndex === question.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      onAnswerSelect(answerIndex);
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="terminal-window">
        <div className="terminal-header">
          <Terminal className="w-4 h-4" />
          <span>SECURITY CHALLENGE {questionNumber}/{totalQuestions}</span>
          <div className="terminal-controls">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div className="terminal-content">
          {/* Background Matrix Effect */}
          <div className="matrix-bg"></div>
          
          {/* Question Header */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-cyan-400 text-sm font-mono">
              [{question.category}] - {question.difficulty}
            </span>
            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>

          {/* Question Text */}
          <div className="mb-8">
            <h3 className="text-xl text-green-400 font-mono leading-relaxed">
              {displayedText}
              <span className="animate-pulse">|</span>
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {(Array.isArray(question.options) ? question.options : JSON.parse(question.options as string)).map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={selectedAnswer !== undefined}
                className={`
                  w-full text-left p-4 rounded-lg border-2 transition-all duration-300
                  cyber-button-option font-mono
                  ${selectedAnswer === index ? 
                    (index === question.correctAnswer ? 'border-green-400 bg-green-400/10' : 'border-red-400 bg-red-400/10') :
                    'hover:border-cyan-400 hover:bg-cyan-400/5'
                  }
                  ${selectedAnswer !== undefined ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                `}
              >
                <span className="text-cyan-400 mr-3">[{String.fromCharCode(65 + index)}]</span>
                <span className="text-green-400">{option}</span>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className="mt-6 text-center">
              {isCorrect ? (
                <div className="text-green-400 text-xl font-bold glitch animate-pulse">
                  ⚡ ACCESS GRANTED ⚡
                </div>
              ) : (
                <div className="text-red-400 text-xl font-bold shake">
                  ❌ ACCESS DENIED ❌
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;
import React, { useState } from 'react';
import { QuizData } from '../types';

interface QuizProps {
  quiz: QuizData;
  onComplete: (success: boolean) => void;
}

export const Quiz: React.FC<QuizProps> = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentQ = quiz.questions[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    
    const correct = index === currentQ.correctIndex;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (!correct) {
      setMistakes(prev => prev + 1);
    }

    setTimeout(() => {
      if (correct) {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedOption(null);
          setShowFeedback(false);
        } else {
          onComplete(mistakes < 2); // Allow 1 mistake total for success, else fail
        }
      } else {
        setSelectedOption(null);
        setShowFeedback(false);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="bg-accent p-4 text-center">
          <h3 className="text-xl font-bold text-yellow-900">
            Soru {currentQuestionIndex + 1} / {quiz.questions.length}
          </h3>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-dark">{currentQ.text}</h2>

          <div className="space-y-4">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showFeedback}
                className={`w-full p-4 text-lg font-medium rounded-xl transition-all border-2 
                  ${selectedOption === idx 
                    ? isCorrect 
                      ? 'bg-green-100 border-green-500 text-green-700' 
                      : 'bg-red-100 border-red-500 text-red-700'
                    : 'bg-white border-slate-200 hover:border-secondary hover:bg-slate-50'
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
          
          {showFeedback && (
            <div className={`mt-4 text-center font-bold text-xl animate-bounce ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? "Doğru! 🎉" : "Hata! Tekrar dene! 🙈"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
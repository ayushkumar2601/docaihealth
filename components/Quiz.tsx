
import React, { useState } from 'react';
import { UI_CLASSES } from '../constants';
import { UserProfile } from '../types';

interface QuizProps {
  onComplete: (profileUpdates: Partial<UserProfile>) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserProfile>>({
    age: '',
    gender: '',
    conditions: '',
    goal: ''
  });

  const steps = [
    {
      key: 'age',
      question: "What is your current age?",
      type: 'number',
      placeholder: 'Years'
    },
    {
      key: 'gender',
      question: "Select your gender",
      type: 'select',
      options: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    {
      key: 'conditions',
      question: "Existing conditions?",
      type: 'text',
      placeholder: 'e.g. None, Hypertension, etc.'
    },
    {
      key: 'goal',
      question: "What is your primary goal?",
      type: 'select',
      options: ['Early diagnosis', 'Understanding reports', 'Preventive care']
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };

  const currentStep = steps[step];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#FAF9F6]">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-xl shadow-black/5 p-12 border border-neutral-100 animate-fade-in">
        <div className="flex justify-between items-center mb-12">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i <= step ? 'bg-[#1A1A1A]' : 'bg-neutral-100'}`}></div>
            ))}
          </div>
          <button onClick={() => onComplete(answers)} className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900">Skip</button>
        </div>
        
        <h2 className="text-3xl font-semibold mb-10 text-neutral-900">{currentStep.question}</h2>

        {currentStep.type === 'select' ? (
          <div className="grid grid-cols-1 gap-3">
            {currentStep.options?.map(opt => (
              <button
                key={opt}
                onClick={() => setAnswers({...answers, [currentStep.key]: opt})}
                className={`p-5 rounded-2xl border text-left transition-all font-medium ${answers[currentStep.key as keyof UserProfile] === opt ? 'bg-[#1A1A1A] text-white border-black' : 'bg-neutral-50 border-neutral-100 hover:border-neutral-300'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <input 
            type={currentStep.type}
            placeholder={currentStep.placeholder}
            className={UI_CLASSES.input}
            value={(answers[currentStep.key as keyof UserProfile] as string) || ''}
            onChange={(e) => setAnswers({...answers, [currentStep.key]: e.target.value})}
            autoFocus
          />
        )}

        <div className="mt-12 flex gap-4">
          {step > 0 && (
            <button 
              onClick={() => setStep(step - 1)}
              className={`${UI_CLASSES.buttonSecondary} flex-1`}
            >
              Back
            </button>
          )}
          <button 
            onClick={handleNext}
            className={`${UI_CLASSES.button} flex-1 shadow-lg shadow-black/5`}
            disabled={!answers[currentStep.key as keyof UserProfile] && currentStep.key !== 'conditions'}
          >
            {step === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

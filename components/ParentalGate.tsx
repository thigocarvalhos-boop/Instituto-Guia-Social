import React, { useState, useEffect } from 'react';
import KidButton from './KidButton';

interface ParentalGateProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const ParentalGate: React.FC<ParentalGateProps> = ({ isOpen, onSuccess, onCancel }) => {
  const [answer, setAnswer] = useState('');
  const [problem, setProblem] = useState({ q: '', a: 0 });

  useEffect(() => {
    if (isOpen) {
      const num1 = Math.floor(Math.random() * 10) + 10; // 10-19
      const num2 = Math.floor(Math.random() * 9) + 1;   // 1-9
      setProblem({ q: `${num1} + ${num2} = ?`, a: num1 + num2 });
      setAnswer('');
    }
  }, [isOpen]);

  const checkAnswer = () => {
    if (parseInt(answer) === problem.a) {
      onSuccess();
    } else {
      alert("Resposta incorreta. Tente novamente.");
      setAnswer('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center border-4 border-gray-300">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Área dos Adultos 🔒</h2>
        <p className="text-gray-500 mb-6">Resolva para continuar:</p>
        
        <div className="text-4xl font-bold text-blue-600 mb-6 font-mono">
          {problem.q}
        </div>

        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full text-center text-3xl p-4 border-2 border-gray-300 rounded-xl mb-6 focus:border-blue-500 outline-none"
          placeholder="?"
        />

        <div className="flex gap-4 justify-center">
          <KidButton onClick={onCancel} colorClass="bg-red-400" size="sm">
            Voltar
          </KidButton>
          <KidButton onClick={checkAnswer} colorClass="bg-green-500" size="sm">
            Entrar
          </KidButton>
        </div>
      </div>
    </div>
  );
};

export default ParentalGate;

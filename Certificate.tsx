import React from 'react';
import { Download, X, Award } from 'lucide-react';

interface CertificateProps {
  playerName: string;
  score: number;
  totalQuestions: number;
  onClose: () => void;
}

const Certificate: React.FC<CertificateProps> = ({
  playerName,
  score,
  totalQuestions,
  onClose
}) => {
  const percentage = (score / totalQuestions) * 100;
  const grade = percentage >= 80 ? 'ELITE HACKER' : 'SKILLED OPERATIVE';

  const downloadCertificate = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a0a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Border
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 760, 560);

    // Grid pattern
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 0.5;
    for (let i = 40; i < 800; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 40);
      ctx.lineTo(i, 580);
      ctx.stroke();
    }
    for (let i = 40; i < 600; i += 20) {
      ctx.beginPath();
      ctx.moveTo(40, i);
      ctx.lineTo(780, i);
      ctx.stroke();
    }

    // Title
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CYBERSECURITY CERTIFICATION', 400, 120);

    // Subtitle
    ctx.fillStyle = '#22c55e';
    ctx.font = '18px monospace';
    ctx.fillText('INFILTRATION PROTOCOL COMPLETED', 400, 160);

    // Player name
    ctx.fillStyle = '#ec4899';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(playerName.toUpperCase(), 400, 240);

    // Achievement
    ctx.fillStyle = '#22c55e';
    ctx.font = '20px monospace';
    ctx.fillText(`HAS ACHIEVED THE RANK OF`, 400, 280);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(grade, 400, 320);

    // Score details
    ctx.fillStyle = '#06b6d4';
    ctx.font = '18px monospace';
    ctx.fillText(`Score: ${score}/${totalQuestions} (${percentage.toFixed(1)}%)`, 400, 380);

    // Date
    ctx.fillStyle = '#22c55e';
    ctx.font = '16px monospace';
    ctx.fillText(`Certified on: ${new Date().toLocaleDateString()}`, 400, 420);

    // Footer
    ctx.fillStyle = '#ec4899';
    ctx.font = '14px monospace';
    ctx.fillText('CYBER ACADEMY - DIGITAL SECURITY DIVISION', 400, 500);

    // Download
    const link = document.createElement('a');
    link.download = `cybersecurity-certificate-${playerName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="terminal-window max-w-2xl w-full">
        <div className="terminal-header">
          <Award className="w-4 h-4" />
          <span>CERTIFICATION GENERATED</span>
          <button 
            onClick={onClose}
            className="ml-auto hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="certificate-preview border border-green-400/30 rounded-lg p-8 mb-6 bg-gradient-to-br from-green-900/10 to-cyan-900/10">
            <div className="text-center space-y-4">
              <Award className="w-16 h-16 text-yellow-400 mx-auto animate-pulse" />
              
              <h2 className="text-2xl font-bold text-cyan-400">
                CYBERSECURITY CERTIFICATION
              </h2>
              
              <p className="text-green-400 font-mono">
                INFILTRATION PROTOCOL COMPLETED
              </p>
              
              <h3 className="text-3xl font-bold text-pink-400 glitch">
                {playerName.toUpperCase()}
              </h3>
              
              <p className="text-green-400">
                HAS ACHIEVED THE RANK OF
              </p>
              
              <p className="text-2xl font-bold text-yellow-400">
                {grade}
              </p>
              
              <div className="text-cyan-400 space-y-1">
                <p>Score: {score}/{totalQuestions} ({percentage.toFixed(1)}%)</p>
                <p>Certified on: {new Date().toLocaleDateString()}</p>
              </div>
              
              <p className="text-sm text-pink-400 font-mono">
                CYBER ACADEMY - DIGITAL SECURITY DIVISION
              </p>
            </div>
          </div>

          <button
            onClick={downloadCertificate}
            className="cyber-button cyber-button-primary"
          >
            <Download className="w-4 h-4 mr-2" />
            DOWNLOAD CERTIFICATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
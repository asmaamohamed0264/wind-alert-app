import React from 'react';

const AlertDisplay = ({ alertLevel }) => {
  if (!alertLevel.isForecast) return null;

  const alertDetails = {
    yellow: {
      title: 'AVERTISMENT PROGNOZĂ: Atenție Sporită',
      icon: '⚠️',
      recommendations: [
        'Asigurați obiectele exterioare (mobilier de grădină, ghivece).',
        'Planificați-vă rutele cu prudență, în special pentru vehiculele înalte.',
        'Luați în considerare amânarea activităților în aer liber.',
        'Verificați prognoza înainte de a ieși din casă.',
      ],
      color: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
      bgGradient: 'from-yellow-500/5 to-orange-500/5',
    },
    red: {
      title: 'AVERTISMENT PROGNOZĂ: Pericol Major',
      icon: '🚨',
      recommendations: [
        'Rămâneți în interior pe cât posibil în timpul prognozat.',
        'Evitați parcurile și zonele cu copaci bătrâni.',
        'Nu parcați mașinile sub copaci sau panouri publicitare.',
        'Pregătiți-vă pentru posibile întreruperi de curent.',
        'Anulați călătoriile neesențiale.',
        'Țineți la îndemână o lanternă și baterii.',
      ],
      color: 'bg-red-500/10 text-red-300 border-red-500/30',
      bgGradient: 'from-red-500/5 to-pink-500/5',
    },
  };

  const details = alertDetails[alertLevel.level];
  if (!details) return null;

  return (
    <div className={`p-6 rounded-lg mt-6 border-2 ${details.color} bg-gradient-to-br ${details.bgGradient} backdrop-blur-sm`}>
      <div className="flex items-start space-x-3">
        <div className="text-3xl">{details.icon}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-3 flex items-center">
            {details.title}
            <div className="ml-3 px-2 py-1 bg-black/20 rounded-full text-xs font-normal">
              PROGNOZĂ
            </div>
          </h3>
          
          <div className="mb-4 p-3 bg-black/10 rounded-lg">
            <p className="font-medium">{alertLevel.message}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide">
              Recomandări de siguranță:
            </h4>
            <ul className="space-y-2">
              {details.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0"></span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-current/20">
            <p className="text-xs opacity-75">
              Această alertă este bazată pe prognoza meteorologică și poate fi actualizată.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDisplay;
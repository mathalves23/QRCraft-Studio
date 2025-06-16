import React, { useState, useEffect } from 'react';

const Onboarding = ({ isOpen, onClose, darkMode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const steps = [
    {
      id: 'welcome',
      title: '🎉 Bem-vindo ao QRCraft Studio!',
      description: 'Vamos fazer um tour rápido para você descobrir como criar QR Codes incríveis em segundos.',
      target: null,
      position: 'center'
    },
    {
      id: 'templates',
      title: '📱 Escolha um Template',
      description: 'Comece selecionando um template. WiFi, vCard, URLs... temos tudo que você precisa!',
      target: '.template-selector',
      position: 'bottom'
    },
    {
      id: 'input',
      title: '✍️ Adicione seu Conteúdo',
      description: 'Digite o texto, URL ou dados que você quer transformar em QR Code.',
      target: '.input-area',
      position: 'right'
    },
    {
      id: 'customization',
      title: '🎨 Personalize o Design',
      description: 'Ajuste cores, tamanho e estilo para criar um QR Code único da sua marca.',
      target: '.customization-panel',
      position: 'left'
    },
    {
      id: 'preview',
      title: '👁️ Preview em Tempo Real',
      description: 'Veja seu QR Code sendo criado em tempo real. Você pode até testá-lo!',
      target: '.preview-area',
      position: 'left'
    },
    {
      id: 'generate',
      title: '⚡ Gere e Baixe',
      description: 'Pronto! Clique em "Craft QR Code" e baixe em alta qualidade.',
      target: '.generate-button',
      position: 'top'
    },
    {
      id: 'features',
      title: '🚀 Recursos Avançados',
      description: 'Explore Scanner QR, Encurtar URLs, Analytics e muito mais no menu de configurações!',
      target: '.advanced-features',
      position: 'bottom'
    },
    {
      id: 'finish',
      title: '🎯 Você está pronto!',
      description: 'Agora você sabe tudo para criar QR Codes profissionais. Divirta-se explorando!',
      target: null,
      position: 'center'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    localStorage.setItem('qrcraft-onboarding-completed', 'true');
    finishTour();
  };

  const finishTour = () => {
    localStorage.setItem('qrcraft-onboarding-completed', 'true');
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getStepPosition = (step) => {
    if (!step.target) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const element = document.querySelector(step.target);
    if (!element) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const rect = element.getBoundingClientRect();
    const positions = {
      top: { top: rect.top - 10, left: rect.left + rect.width / 2, transform: 'translate(-50%, -100%)' },
      bottom: { top: rect.bottom + 10, left: rect.left + rect.width / 2, transform: 'translate(-50%, 0)' },
      left: { top: rect.top + rect.height / 2, left: rect.left - 10, transform: 'translate(-100%, -50%)' },
      right: { top: rect.top + rect.height / 2, left: rect.right + 10, transform: 'translate(0, -50%)' },
      center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    };
    
    return positions[step.position] || positions.center;
  };

  const highlightElement = (selector) => {
    // Remove highlight anterior
    document.querySelectorAll('.onboarding-highlight').forEach(el => {
      el.classList.remove('onboarding-highlight');
    });
    
    if (selector) {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add('onboarding-highlight');
      }
    }
  };

  useEffect(() => {
    if (isVisible && steps[currentStep]) {
      setTimeout(() => {
        highlightElement(steps[currentStep].target);
      }, 100);
    }
    
    return () => {
      document.querySelectorAll('.onboarding-highlight').forEach(el => {
        el.classList.remove('onboarding-highlight');
      });
    };
  }, [currentStep, isVisible]);

  if (!isOpen || !isVisible) return null;

  const currentStepData = steps[currentStep];
  const stepPosition = getStepPosition(currentStepData);

  return (
    <>
      {/* Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9999,
        backdropFilter: 'blur(2px)'
      }} />
      
      {/* Tour Card */}
      <div style={{
        position: 'fixed',
        ...stepPosition,
        zIndex: 10000,
        background: darkMode ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '16px',
        padding: '1.5rem',
        maxWidth: '320px',
        width: 'calc(100vw - 2rem)',
        boxShadow: darkMode 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: darkMode 
          ? '1px solid rgba(71, 85, 105, 0.5)' 
          : '1px solid rgba(229, 231, 235, 0.8)',
        animation: 'slideIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <div style={{
            background: '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            {currentStep + 1} de {steps.length}
          </div>
          
          <button
            onClick={skipTour}
            style={{
              background: 'none',
              border: 'none',
              color: darkMode ? '#94a3b8' : '#6b7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Pular tour
          </button>
        </div>

        {/* Content */}
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: darkMode ? '#f1f5f9' : '#1f2937',
          marginBottom: '0.5rem',
          margin: 0
        }}>
          {currentStepData.title}
        </h3>
        
        <p style={{
          fontSize: '0.875rem',
          color: darkMode ? '#94a3b8' : '#6b7280',
          lineHeight: '1.5',
          marginBottom: '1.5rem'
        }}>
          {currentStepData.description}
        </p>

        {/* Progress Bar */}
        <div style={{
          background: darkMode ? '#475569' : '#e5e7eb',
          borderRadius: '4px',
          height: '4px',
          marginBottom: '1.5rem',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
            height: '100%',
            width: `${((currentStep + 1) / steps.length) * 100}%`,
            transition: 'width 0.3s ease',
            borderRadius: '4px'
          }} />
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            style={{
              background: 'none',
              border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: darkMode ? '#cbd5e1' : '#374151',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 0 ? 0.5 : 1,
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            ← Anterior
          </button>

          <button
            onClick={nextStep}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {currentStep === steps.length - 1 ? '🎉 Finalizar' : 'Próximo →'}
          </button>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        :global(.onboarding-highlight) {
          position: relative;
          z-index: 9998;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.6), 0 0 0 8px rgba(59, 130, 246, 0.3) !important;
          border-radius: 8px !important;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.6), 0 0 0 8px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.8), 0 0 0 12px rgba(59, 130, 246, 0.2); }
        }
      `}</style>
    </>
  );
};

export default Onboarding; 
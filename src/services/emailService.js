// Configuração do EmailJS para envio de emails
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_qrcraft',
  TEMPLATE_ID: 'template_verification',
  PUBLIC_KEY: 'your_emailjs_public_key'
};

// Função para inicializar EmailJS
export const initEmailJS = () => {
  // Em produção, você colocaria as credenciais reais do EmailJS
  console.log('📧 Serviço de email inicializado (modo desenvolvimento)');
};

// Função para gerar token de verificação
export const generateVerificationToken = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Função para enviar email de verificação
export const sendVerificationEmail = async (userData) => {
  try {
    const token = generateVerificationToken();
    const verificationUrl = `${window.location.origin}/verify-email?token=${token}&email=${encodeURIComponent(userData.email)}`;
    
    // Salvar token no localStorage para validação posterior
    const verificationTokens = JSON.parse(localStorage.getItem('qrcraft-verification-tokens') || '{}');
    verificationTokens[userData.email] = {
      token,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      userId: userData.id
    };
    localStorage.setItem('qrcraft-verification-tokens', JSON.stringify(verificationTokens));
    
    // Em produção, enviaria email real via EmailJS
    // await emailjs.send(
    //   EMAILJS_CONFIG.SERVICE_ID,
    //   EMAILJS_CONFIG.TEMPLATE_ID,
    //   {
    //     to_email: userData.email,
    //     to_name: userData.name,
    //     verification_url: verificationUrl,
    //     app_name: 'QRCraft Studio'
    //   },
    //   EMAILJS_CONFIG.PUBLIC_KEY
    // );
    
    // Para desenvolvimento, simular envio e mostrar no console
    console.log(`
📧 =============== EMAIL DE VERIFICAÇÃO ===============
Para: ${userData.email}
Nome: ${userData.name}
URL de Verificação: ${verificationUrl}
Token: ${token}
=====================================================
    `);
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: 'Email de verificação enviado com sucesso!',
      verificationUrl // Para desenvolvimento
    };
    
  } catch (error) {
    console.error('❌ Erro ao enviar email de verificação:', error);
    return {
      success: false,
      error: 'Erro ao enviar email de verificação'
    };
  }
};

// Função para verificar email com token
export const verifyEmailToken = (email, token) => {
  try {
    const verificationTokens = JSON.parse(localStorage.getItem('qrcraft-verification-tokens') || '{}');
    const tokenData = verificationTokens[email];
    
    if (!tokenData) {
      return {
        success: false,
        error: 'Token de verificação não encontrado'
      };
    }
    
    // Verificar se token expirou
    if (new Date() > new Date(tokenData.expiresAt)) {
      // Remover token expirado
      delete verificationTokens[email];
      localStorage.setItem('qrcraft-verification-tokens', JSON.stringify(verificationTokens));
      
      return {
        success: false,
        error: 'Token de verificação expirado'
      };
    }
    
    // Verificar se token coincide
    if (tokenData.token !== token) {
      return {
        success: false,
        error: 'Token de verificação inválido'
      };
    }
    
    // Token válido - marcar email como verificado
    const users = JSON.parse(localStorage.getItem('qrcraft-users') || '[]');
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].emailVerified = true;
      users[userIndex].emailVerifiedAt = new Date().toISOString();
      localStorage.setItem('qrcraft-users', JSON.stringify(users));
      
      // Atualizar usuário logado se necessário
      const currentUser = JSON.parse(localStorage.getItem('qrcraft-currentUser') || 'null');
      if (currentUser && currentUser.email === email) {
        currentUser.emailVerified = true;
        currentUser.emailVerifiedAt = users[userIndex].emailVerifiedAt;
        localStorage.setItem('qrcraft-currentUser', JSON.stringify(currentUser));
      }
    }
    
    // Remover token usado
    delete verificationTokens[email];
    localStorage.setItem('qrcraft-verification-tokens', JSON.stringify(verificationTokens));
    
    return {
      success: true,
      message: 'Email verificado com sucesso!'
    };
    
  } catch (error) {
    console.error('❌ Erro ao verificar token:', error);
    return {
      success: false,
      error: 'Erro ao verificar email'
    };
  }
};

// Função para reenviar email de verificação
export const resendVerificationEmail = async (userData) => {
  try {
    // Verificar se já não está verificado
    if (userData.emailVerified) {
      return {
        success: false,
        error: 'Email já está verificado'
      };
    }
    
    // Verificar se pode reenviar (evitar spam)
    const verificationTokens = JSON.parse(localStorage.getItem('qrcraft-verification-tokens') || '{}');
    const existingToken = verificationTokens[userData.email];
    
    if (existingToken) {
      const timeDiff = new Date() - new Date(existingToken.createdAt);
      const minutesDiff = timeDiff / (1000 * 60);
      
      if (minutesDiff < 2) { // Pode reenviar apenas após 2 minutos
        return {
          success: false,
          error: `Aguarde ${Math.ceil(2 - minutesDiff)} minuto(s) para reenviar`
        };
      }
    }
    
    return await sendVerificationEmail(userData);
    
  } catch (error) {
    console.error('❌ Erro ao reenviar email:', error);
    return {
      success: false,
      error: 'Erro ao reenviar email de verificação'
    };
  }
};

// Função para verificar se email está verificado
export const isEmailVerified = (userData) => {
  return userData?.emailVerified === true;
};

// Função para limpar tokens expirados (housekeeping)
export const cleanupExpiredTokens = () => {
  try {
    const verificationTokens = JSON.parse(localStorage.getItem('qrcraft-verification-tokens') || '{}');
    const now = new Date();
    
    let hasChanges = false;
    Object.keys(verificationTokens).forEach(email => {
      if (new Date(verificationTokens[email].expiresAt) < now) {
        delete verificationTokens[email];
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      localStorage.setItem('qrcraft-verification-tokens', JSON.stringify(verificationTokens));
    }
  } catch (error) {
    console.error('❌ Erro ao limpar tokens expirados:', error);
  }
}; 
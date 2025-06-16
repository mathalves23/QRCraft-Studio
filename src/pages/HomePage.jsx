import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  QrCode, 
  Smartphone, 
  Palette, 
  History, 
  Shield, 
  Zap, 
  ArrowRight, 
  Star, 
  Users, 
  TrendingUp,
  Download,
  Globe,
  Sparkles
} from 'lucide-react';

export function HomePage() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      title: 'Geração Instantânea',
      description: 'Crie QR Codes em segundos com nossa tecnologia otimizada e interface intuitiva'
    },
    {
      icon: <Palette className="h-8 w-8 text-purple-500" />,
      title: 'Personalização Total',
      description: 'Cores customizadas, logos e designs únicos para sua marca se destacar'
    },
    {
      icon: <Smartphone className="h-8 w-8 text-green-500" />,
      title: '100% Compatível',
      description: 'Funciona em todos os dispositivos e leitores de QR Code do mercado'
    },
    {
      icon: <History className="h-8 w-8 text-orange-500" />,
      title: 'Histórico Completo',
      description: 'Gerencie e organize todos os seus QR Codes criados em um só lugar'
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-500" />,
      title: 'Seguro & Privado',
      description: 'Seus dados são protegidos com criptografia avançada e política de privacidade'
    },
    {
      icon: <Download className="h-8 w-8 text-pink-500" />,
      title: 'Múltiplos Formatos',
      description: 'Download em PNG, JPEG, SVG e vetores de alta qualidade para qualquer uso'
    }
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: '50K+', label: 'Usuários Ativos' },
    { icon: <QrCode className="h-6 w-6" />, value: '2M+', label: 'QR Codes Gerados' },
    { icon: <TrendingUp className="h-6 w-6" />, value: '99.9%', label: 'Uptime' },
    { icon: <Star className="h-6 w-6" />, value: '4.9/5', label: 'Avaliação' }
  ];

  const useCases = [
    {
      title: 'Marketing Digital',
      description: 'Campanhas, promoções e links para redes sociais',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Eventos & Networking',
      description: 'Cartões de visita digitais e check-ins rápidos',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Restaurantes & Menus',
      description: 'Cardápios digitais e sistemas de pedidos',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Educação & Treinamento',
      description: 'Materiais didáticos e recursos online',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-5xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-800 dark:text-blue-200 border-0">
              <Sparkles className="h-4 w-4 mr-2" />
              Ferramenta #1 em Geração de QR Codes
            </Badge>
            
            <h1 className="text-5xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Gerador de QR Code
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Profissional
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              Crie QR Codes personalizados com design profissional. 
              Controle total sobre cores, logos e funcionalidades avançadas para sua marca se destacar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/generator">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center group">
                  Criar QR Code Grátis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300 backdrop-blur-sm">
                  Ver Demonstração
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Globe className="h-4 w-4 mr-2" />
              Recursos Avançados
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Tudo que você precisa
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ferramentas profissionais para criar QR Codes impactantes e funcionais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:scale-105 overflow-hidden">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Casos de Uso
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Perfeito para qualquer negócio
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Descubra como QR Codes podem transformar sua estratégia digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {useCases.map((useCase, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${useCase.color}`}></div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {useCase.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    {useCase.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Pronto para começar?
            </h2>
            <p className="text-xl lg:text-2xl mb-10 opacity-90 leading-relaxed">
              Junte-se a milhares de usuários que já criaram QR Codes incríveis. 
              Comece agora mesmo, é gratuito!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/generator">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center group">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm">
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


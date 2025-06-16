import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  QrCode, 
  Zap, 
  Shield, 
  Palette, 
  Download, 
  Smartphone, 
  Globe,
  Heart,
  Star,
  Users,
  TrendingUp,
  Award,
  Target,
  Lightbulb,
  ArrowRight,
  Github,
  Mail,
  Twitter
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutPage() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: 'Geração Instantânea',
      description: 'Crie QR Codes em segundos com nossa tecnologia otimizada'
    },
    {
      icon: <Palette className="h-6 w-6 text-purple-500" />,
      title: 'Personalização Completa',
      description: 'Cores, tamanhos e formatos totalmente customizáveis'
    },
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: 'Segurança Garantida',
      description: 'Seus dados são processados localmente, sem armazenamento'
    },
    {
      icon: <Download className="h-6 w-6 text-blue-500" />,
      title: 'Múltiplos Formatos',
      description: 'PNG, JPEG, SVG e outros formatos de alta qualidade'
    },
    {
      icon: <Smartphone className="h-6 w-6 text-indigo-500" />,
      title: 'Responsivo',
      description: 'Funciona perfeitamente em todos os dispositivos'
    },
    {
      icon: <Globe className="h-6 w-6 text-cyan-500" />,
      title: 'Acesso Universal',
      description: 'Compatível com todos os leitores de QR Code'
    }
  ];

  const stats = [
    { icon: <Users className="h-8 w-8" />, value: '50K+', label: 'Usuários Satisfeitos' },
    { icon: <QrCode className="h-8 w-8" />, value: '2M+', label: 'QR Codes Gerados' },
    { icon: <TrendingUp className="h-8 w-8" />, value: '99.9%', label: 'Uptime Garantido' },
    { icon: <Star className="h-8 w-8" />, value: '4.9/5', label: 'Avaliação Média' }
  ];

  const team = [
    {
      name: 'Equipe de Desenvolvimento',
      role: 'Full Stack Developers',
      description: 'Especialistas em React, Node.js e tecnologias modernas'
    },
    {
      name: 'Equipe de Design',
      role: 'UI/UX Designers',
      description: 'Focados em criar experiências intuitivas e atrativas'
    },
    {
      name: 'Equipe de Qualidade',
      role: 'QA Engineers',
      description: 'Garantindo a melhor qualidade e performance'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              Sobre Nós
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Criando o futuro dos
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QR Codes
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              Nossa missão é democratizar a criação de QR Codes, oferecendo uma ferramenta 
              poderosa, gratuita e acessível para todos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/generator">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center group">
                  Experimente Agora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <Target className="h-4 w-4 mr-2" />
                Nossa Missão
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Simplificar a criação de QR Codes
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Acreditamos que a tecnologia deve ser acessível a todos. Por isso, criamos uma 
                plataforma que combina simplicidade com poder, permitindo que qualquer pessoa 
                crie QR Codes profissionais sem complicações.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Seja você um pequeno empresário, designer, desenvolvedor ou apenas alguém que 
                precisa de um QR Code rápido, nossa ferramenta foi pensada para você.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <Award className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">Qualidade</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Padrões profissionais</p>
              </Card>
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">Inovação</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Sempre evoluindo</p>
              </Card>
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <Heart className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">Paixão</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Amor pelo que fazemos</p>
              </Card>
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <Users className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">Comunidade</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Focados no usuário</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Zap className="h-4 w-4 mr-2" />
              Recursos Principais
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Combinamos tecnologia de ponta com design intuitivo para oferecer a melhor experiência
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-105">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              Nossos Números
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Resultados que falam por si
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:scale-105">
                <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Users className="h-4 w-4 mr-2" />
              Nossa Equipe
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Pessoas apaixonadas por tecnologia
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Um time dedicado a criar as melhores soluções para nossos usuários
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {member.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Vamos conversar?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Tem alguma dúvida, sugestão ou quer colaborar conosco? 
              Adoraríamos ouvir de você!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Enviar E-mail
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center">
                <Github className="mr-2 h-5 w-5" />
                Ver no GitHub
              </Button>
            </div>

            <div className="flex justify-center space-x-6">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Github className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Twitter className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Mail className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


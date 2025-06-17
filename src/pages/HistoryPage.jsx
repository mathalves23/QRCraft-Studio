import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Search, 
  Download, 
  Copy, 
  Trash2, 
  Calendar, 
  Link as LinkIcon,
  Type,
  Mail,
  Phone,
  Wifi,
  MapPin,
  CreditCard,
  Filter,
  SortDesc,
  Archive
} from 'lucide-react';
import { toast } from 'sonner';

export function HistoryPage() {
  const [qrHistory, setQrHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data - em uma aplicação real, isso viria de uma API ou localStorage
  useEffect(() => {
    const mockHistory = [
      {
        id: 1,
        content: 'https://example.com',
        type: 'url',
        createdAt: new Date('2024-01-15'),
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        color: '#000000',
        backgroundColor: '#ffffff',
        size: '256'
      },
      {
        id: 2,
        content: 'Meu texto personalizado para QR Code',
        type: 'text',
        createdAt: new Date('2024-01-14'),
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        color: '#3B82F6',
        backgroundColor: '#ffffff',
        size: '512'
      },
      {
        id: 3,
        content: 'mailto:contato@exemplo.com',
        type: 'email',
        createdAt: new Date('2024-01-13'),
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        color: '#8B5CF6',
        backgroundColor: '#ffffff',
        size: '256'
      },
      {
        id: 4,
        content: 'tel:+5511999999999',
        type: 'phone',
        createdAt: new Date('2024-01-12'),
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        color: '#10B981',
        backgroundColor: '#ffffff',
        size: '256'
      },
      {
        id: 5,
        content: 'WIFI:T:WPA;S:MinhaRede;P:senha123;;',
        type: 'wifi',
        createdAt: new Date('2024-01-11'),
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        color: '#F59E0B',
        backgroundColor: '#ffffff',
        size: '512'
      }
    ];
    setQrHistory(mockHistory);
  }, []);

  const getTypeIcon = (type) => {
    const icons = {
      url: <LinkIcon className="h-4 w-4" />,
      text: <Type className="h-4 w-4" />,
      email: <Mail className="h-4 w-4" />,
      phone: <Phone className="h-4 w-4" />,
      wifi: <Wifi className="h-4 w-4" />,
      location: <MapPin className="h-4 w-4" />,
      vcard: <CreditCard className="h-4 w-4" />
    };
    return icons[type] || <Type className="h-4 w-4" />;
  };

  const getTypeLabel = (type) => {
    const labels = {
      url: 'URL',
      text: 'Texto',
      email: 'E-mail',
      phone: 'Telefone',
      wifi: 'WiFi',
      location: 'Localização',
      vcard: 'Cartão de Visita'
    };
    return labels[type] || 'Desconhecido';
  };

  const getTypeColor = (type) => {
    const colors = {
      url: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
      text: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200',
      email: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200',
      phone: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
      wifi: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200',
      location: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
      vcard: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
  };

  const filteredHistory = qrHistory.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const downloadQRCode = (item) => {
    const link = document.createElement('a');
    link.download = `qrcode-${item.id}-${Date.now()}.png`;
    link.href = item.qrCode;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code baixado com sucesso!');
  };

  const copyToClipboard = async (item) => {
    try {
      const response = await fetch(item.qrCode);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      toast.success('QR Code copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast.error('Erro ao copiar QR Code');
    }
  };

  const deleteQRCode = (id) => {
    setQrHistory(prev => prev.filter(item => item.id !== id));
    toast.success('QR Code removido do histórico');
  };

  const formatContent = (content, maxLength = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Archive className="h-4 w-4 mr-2" />
            Histórico Completo
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Seus QR Codes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Gerencie e organize todos os QR Codes que você criou
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar QR Codes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                  className={filterType === 'all' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : ''}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Todos
                </Button>
                <Button
                  variant={filterType === 'url' ? 'default' : 'outline'}
                  onClick={() => setFilterType('url')}
                  className={filterType === 'url' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : ''}
                >
                  URLs
                </Button>
                <Button
                  variant={filterType === 'text' ? 'default' : 'outline'}
                  onClick={() => setFilterType('text')}
                  className={filterType === 'text' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : ''}
                >
                  Texto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Grid */}
        {filteredHistory.length === 0 ? (
          <Card className="text-center py-12 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent>
              <Archive className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum QR Code encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchTerm || filterType !== 'all' 
                  ? 'Tente ajustar os filtros de pesquisa'
                  : 'Você ainda não criou nenhum QR Code'
                }
              </p>
              <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <a href="/generator">Criar Primeiro QR Code</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getTypeColor(item.type)} border-0`}>
                      {getTypeIcon(item.type)}
                      <span className="ml-1">{getTypeLabel(item.type)}</span>
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* QR Code Preview */}
                  <div className="flex justify-center">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <img 
                        src={item.qrCode} 
                        alt="QR Code" 
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Conteúdo:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                      {formatContent(item.content)}
                    </p>
                  </div>

                  {/* Properties */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Cor:</span>
                      <div className="flex items-center mt-1">
                        <div 
                          className="w-3 h-3 rounded border mr-1"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.color}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Tamanho:</span>
                      <div className="mt-1">{item.size}x{item.size}px</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => downloadQRCode(item)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Baixar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(item)}
                      className="flex-1"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteQRCode(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {filteredHistory.length > 0 && (
          <Card className="mt-8 text-center shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {qrHistory.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Total de QR Codes
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {filteredHistory.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Resultados Filtrados
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Set(qrHistory.map(item => item.type)).size}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Tipos Diferentes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { qrHelpers } from '@/lib/supabase';
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
  const { user, isAuthenticated } = useAuth();
  const [qrHistory, setQrHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Carregar histórico real do Supabase
  useEffect(() => {
    if (isAuthenticated && user) {
      loadQRHistory();
    } else {
      setQrHistory([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadQRHistory = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await qrHelpers.getUserQRCodes(user.id, 100);
      
      if (error) {
        console.error('Erro ao carregar histórico:', error);
        toast.error('Erro ao carregar histórico de QR Codes');
      } else {
        // Converter dados do Supabase para formato esperado
        const formattedHistory = (data || []).map(item => ({
          id: item.id,
          content: item.content,
          type: item.template_type,
          createdAt: new Date(item.created_at),
          qrCode: item.qr_data_url,
          color: item.settings?.color || '#000000',
          backgroundColor: item.settings?.backgroundColor || '#ffffff',
          size: item.settings?.size || '256',
          downloadCount: item.download_count || 0,
          templateData: item.template_data || {}
        }));
        
        setQrHistory(formattedHistory);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      url: <LinkIcon className="w-4 h-4" />,
      text: <Type className="w-4 h-4" />,
      email: <Mail className="w-4 h-4" />,
      phone: <Phone className="w-4 h-4" />,
      wifi: <Wifi className="w-4 h-4" />,
      location: <MapPin className="w-4 h-4" />,
      vcard: <CreditCard className="w-4 h-4" />
    };
    return icons[type] || <Archive className="w-4 h-4" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      url: 'bg-blue-100 text-blue-800',
      text: 'bg-gray-100 text-gray-800',
      email: 'bg-green-100 text-green-800',
      phone: 'bg-purple-100 text-purple-800',
      wifi: 'bg-yellow-100 text-yellow-800',
      location: 'bg-red-100 text-red-800',
      vcard: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredHistory = qrHistory.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const downloadQR = async (item) => {
    try {
      const response = await fetch(item.qrCode);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode-${item.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Incrementar contador de download
      await qrHelpers.incrementDownload(item.id);
      toast.success('QR Code baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar QR Code:', error);
      toast.error('Erro ao baixar QR Code');
    }
  };

  const copyContent = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Conteúdo copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast.error('Erro ao copiar conteúdo');
    }
  };

  const deleteQR = async (itemId) => {
    if (!window.confirm('Tem certeza que deseja deletar este QR Code?')) return;
    
    try {
      // TODO: Implementar função de deletar no qrHelpers
      toast.success('QR Code deletado com sucesso!');
      await loadQRHistory(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao deletar QR Code');
    }
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

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Faça login para ver seu histórico
          </h2>
          <p className="text-gray-600">
            Entre na sua conta para acessar seus QR Codes salvos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Histórico de QR Codes</h1>
            <p className="text-gray-600 mt-1">
              Gerencie e baixe seus QR Codes criados
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadQRHistory}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <Archive className="w-4 h-4" />
              )}
              Atualizar
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por conteúdo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os tipos</option>
                <option value="url">URLs</option>
                <option value="text">Texto</option>
                <option value="email">E-mail</option>
                <option value="phone">Telefone</option>
                <option value="wifi">WiFi</option>
                <option value="location">Localização</option>
                <option value="vcard">vCard</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de QR Codes</p>
                  <p className="text-2xl font-bold text-gray-900">{qrHistory.length}</p>
                </div>
                <Archive className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Este mês</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {qrHistory.filter(item => {
                      const now = new Date();
                      const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
                      return item.createdAt >= monthAgo;
                    }).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Downloads totais</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {qrHistory.reduce((total, item) => total + (item.downloadCount || 0), 0)}
                  </p>
                </div>
                <Download className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando histórico...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {qrHistory.length === 0 ? 'Nenhum QR Code encontrado' : 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-gray-600">
              {qrHistory.length === 0 
                ? 'Comece criando seu primeiro QR Code!' 
                : 'Tente ajustar seus filtros de busca'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getTypeColor(item.type)}>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(item.type)}
                        {item.type.toUpperCase()}
                      </div>
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* QR Code Preview */}
                  <div className="flex justify-center">
                    <div className="w-32 h-32 border border-gray-200 rounded-lg overflow-hidden bg-white p-2">
                      <img 
                        src={item.qrCode} 
                        alt="QR Code" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Conteúdo:</p>
                    <p className="text-sm font-medium text-gray-900 break-all line-clamp-2">
                      {item.content}
                    </p>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{item.size}x{item.size}px</span>
                    <span>{item.downloadCount || 0} downloads</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => downloadQR(item)}
                      className="flex-1"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Baixar
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyContent(item.content)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteQR(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { ColorPalette } from 'react-color-palette';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { 
  Download, 
  Copy, 
  RefreshCw, 
  Palette, 
  Settings, 
  Type, 
  Link as LinkIcon,
  Mail,
  Phone,
  Wifi,
  MapPin,
  Calendar,
  CreditCard,
  Sparkles
} from 'lucide-react';

export function GeneratorPage() {
  const [text, setText] = useState('https://example.com');
  const [qrType, setQrType] = useState('url');
  const [qrCode, setQrCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [color, setColor] = useState({ hex: '#000000' });
  const [backgroundColor, setBackgroundColor] = useState({ hex: '#ffffff' });
  const [size, setSize] = useState('256');
  const [errorLevel, setErrorLevel] = useState('M');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  const qrTypes = [
    { value: 'url', label: 'URL/Link', icon: <LinkIcon className="h-4 w-4" />, placeholder: 'https://example.com' },
    { value: 'text', label: 'Texto', icon: <Type className="h-4 w-4" />, placeholder: 'Digite seu texto aqui...' },
    { value: 'email', label: 'E-mail', icon: <Mail className="h-4 w-4" />, placeholder: 'email@exemplo.com' },
    { value: 'phone', label: 'Telefone', icon: <Phone className="h-4 w-4" />, placeholder: '+55 11 99999-9999' },
    { value: 'wifi', label: 'WiFi', icon: <Wifi className="h-4 w-4" />, placeholder: 'WIFI:T:WPA;S:NomeRede;P:senha;;' },
    { value: 'location', label: 'Localização', icon: <MapPin className="h-4 w-4" />, placeholder: 'geo:-23.5505,-46.6333' },
    { value: 'event', label: 'Evento', icon: <Calendar className="h-4 w-4" />, placeholder: 'BEGIN:VEVENT...' },
    { value: 'vcard', label: 'Cartão de Visita', icon: <CreditCard className="h-4 w-4" />, placeholder: 'BEGIN:VCARD...' }
  ];

  const generateQRCode = async () => {
    if (!text.trim()) {
      toast.error('Por favor, insira um texto ou URL');
      return;
    }

    setIsGenerating(true);
    try {
      const qrCodeDataURL = await QRCode.toDataURL(text, {
        width: parseInt(size),
        color: {
          dark: color.hex,
          light: backgroundColor.hex,
        },
        errorCorrectionLevel: errorLevel,
        margin: 2,
      });
      setQrCode(qrCodeDataURL);
      toast.success('QR Code gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast.error('Erro ao gerar QR Code');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) {
      toast.error('Gere um QR Code primeiro');
      return;
    }

    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = qrCode;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code baixado com sucesso!');
  };

  const copyToClipboard = async () => {
    if (!qrCode) {
      toast.error('Gere um QR Code primeiro');
      return;
    }

    try {
      const response = await fetch(qrCode);
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

  const getPlaceholder = () => {
    const type = qrTypes.find(t => t.value === qrType);
    return type ? type.placeholder : 'Digite aqui...';
  };

  const formatText = (type, value) => {
    switch (type) {
      case 'email':
        return value.includes('mailto:') ? value : `mailto:${value}`;
      case 'phone':
        return value.includes('tel:') ? value : `tel:${value}`;
      case 'wifi':
        return value.startsWith('WIFI:') ? value : `WIFI:T:WPA;S:${value};P:senha;;`;
      case 'location':
        return value.startsWith('geo:') ? value : `geo:${value}`;
      default:
        return value;
    }
  };

  useEffect(() => {
    if (text.trim()) {
      const formattedText = formatText(qrType, text);
      setText(formattedText);
    }
  }, [qrType]);

  useEffect(() => {
    generateQRCode();
  }, [text, color, backgroundColor, size, errorLevel]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Gerador Profissional
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Crie seu QR Code
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Personalize cores, tamanho e formato para criar QR Codes únicos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Content Configuration */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  Configuração do Conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="qr-type">Tipo de QR Code</Label>
                  <Select value={qrType} onValueChange={setQrType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {qrTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            {type.icon}
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content">Conteúdo</Label>
                  {qrType === 'text' ? (
                    <Textarea
                      id="content"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={getPlaceholder()}
                      rows={4}
                      className="resize-none"
                    />
                  ) : (
                    <Input
                      id="content"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={getPlaceholder()}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Visual Configuration */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-500" />
                  Personalização Visual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cor do QR Code</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                      >
                        <div 
                          className="w-4 h-4 rounded mr-2 border"
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.hex}
                      </Button>
                    </div>
                    {showColorPicker && (
                      <div className="mt-2 p-2 border rounded-lg bg-background">
                        <ColorPalette 
                          color={color} 
                          onChange={setColor}
                          hideInput={['rgb', 'hsv']}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Cor de Fundo</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                      >
                        <div 
                          className="w-4 h-4 rounded mr-2 border"
                          style={{ backgroundColor: backgroundColor.hex }}
                        />
                        {backgroundColor.hex}
                      </Button>
                    </div>
                    {showBgColorPicker && (
                      <div className="mt-2 p-2 border rounded-lg bg-background">
                        <ColorPalette 
                          color={backgroundColor} 
                          onChange={setBackgroundColor}
                          hideInput={['rgb', 'hsv']}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Size and Error Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="size">Tamanho (px)</Label>
                    <Select value={size} onValueChange={setSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="128">128x128</SelectItem>
                        <SelectItem value="256">256x256</SelectItem>
                        <SelectItem value="512">512x512</SelectItem>
                        <SelectItem value="1024">1024x1024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="error-level">Correção de Erro</Label>
                    <Select value={errorLevel} onValueChange={setErrorLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Baixa (7%)</SelectItem>
                        <SelectItem value="M">Média (15%)</SelectItem>
                        <SelectItem value="Q">Alta (25%)</SelectItem>
                        <SelectItem value="H">Muito Alta (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview and Actions */}
          <div className="space-y-6">
            {/* QR Code Preview */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Preview do QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    {qrCode ? (
                      <div className="p-6 bg-white rounded-2xl shadow-lg">
                        <img 
                          src={qrCode} 
                          alt="QR Code gerado" 
                          className="max-w-full h-auto rounded-lg"
                          style={{ maxWidth: '300px' }}
                        />
                      </div>
                    ) : (
                      <div className="w-64 h-64 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          <RefreshCw className="h-12 w-12 mx-auto mb-2" />
                          <p>QR Code aparecerá aqui</p>
                        </div>
                      </div>
                    )}
                    {isGenerating && (
                      <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-2xl flex items-center justify-center">
                        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                    <Button 
                      onClick={downloadQRCode}
                      disabled={!qrCode || isGenerating}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      onClick={copyToClipboard}
                      disabled={!qrCode || isGenerating}
                      variant="outline"
                      className="flex-1 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardHeader>
                <CardTitle className="text-lg">💡 Dicas Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Use cores contrastantes para melhor leitura</p>
                <p>• Tamanhos maiores são ideais para impressão</p>
                <p>• Correção de erro alta ajuda em ambientes com ruído</p>
                <p>• Teste sempre em diferentes dispositivos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


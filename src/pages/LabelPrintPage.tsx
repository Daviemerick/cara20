import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderNavigation from '@/components/HeaderNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import completeClientData from '@/data/completeClientData.json';
import { ArrowLeft, Printer, Copy, CheckCircle2, AlertCircle } from 'lucide-react';

type LabelFormState = {
  recipient: string;
  identifier: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  note: string;
  weight: string;
  dimensions: string;
  serviceType: string;
};

const formatPhone = (value?: string | null) => {
  if (!value) return '';
  const cleaned = value.replace('@s.whatsapp.net', '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';

  const countryRemoved = cleaned.startsWith('55') ? cleaned.substring(2) : cleaned;
  if (countryRemoved.length < 10) return countryRemoved;

  return countryRemoved.replace(
    /(\d{2})(\d{5})(\d{4})/,
    (_match, ddd, prefix, suffix) => `(${ddd}) ${prefix}-${suffix}`
  );
};

const clampCopies = (value: number) => {
  if (Number.isNaN(value)) return 1;
  return Math.min(20, Math.max(1, value));
};

const PrintableLabel = ({
  formData,
  copyNumber,
}: {
  formData: LabelFormState;
  copyNumber?: number;
}) => {
  const identifier = formData.identifier || 'CLI-0000';

  return (
    <div
      className="label-sheet bg-white text-gray-900 rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
      style={{ width: '100mm', height: '150mm' }}
    >
      <div className="h-full flex flex-col p-4 gap-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
              Nexus Fulfillment
            </p>
            <p className="text-xl font-black leading-tight">
              {formData.recipient || 'Destinatário não informado'}
            </p>
            <p className="text-[11px] text-gray-600">
              {formData.serviceType || 'Envio padrão'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-gray-500 tracking-[0.2em]">
              Código
            </p>
            <p className="text-2xl font-black tracking-[0.2em]">{identifier}</p>
            {copyNumber && (
              <p className="text-[10px] text-gray-500">
                cópia {copyNumber.toString().padStart(2, '0')}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <p className="text-[10px] uppercase text-gray-500 tracking-[0.4em]">
              Endereço
            </p>
            <p className="font-semibold text-gray-900">
              {formData.addressLine1 || 'Preencha o endereço principal'}
            </p>
            {formData.addressLine2 && (
              <p className="text-gray-600">{formData.addressLine2}</p>
            )}
            <p className="text-gray-700">
              {formData.city || 'Cidade'}/{formData.state || 'UF'} •{' '}
              {formData.postalCode || 'CEP'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div>
              <p className="text-[10px] uppercase text-gray-500 tracking-[0.3em]">
                Contato
              </p>
              <p className="text-sm font-semibold">
                {formData.phone || 'Telefone não informado'}
              </p>
              <p className="text-[11px] text-gray-500 truncate">
                {formData.email || 'email@exemplo.com'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase text-gray-500 tracking-[0.3em]">
                Dimensões
              </p>
              <p className="text-sm font-semibold">{formData.dimensions}</p>
              <p className="text-[11px] text-gray-500">{formData.weight} kg</p>
            </div>
          </div>
        </div>

        <div className="flex-1 border-t border-dashed pt-3 text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
          {formData.note || 'Observações da entrega aparecerão aqui.'}
        </div>

        <div
          className="h-16 w-full rounded-sm border border-gray-300 flex items-end justify-center"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg,#111 0,#111 2px,#fff 2px,#fff 4px)',
          }}
        >
          <span className="bg-white px-2 text-[10px] tracking-[0.35em] font-semibold">
            {identifier}
          </span>
        </div>

        <div className="text-[10px] text-gray-500 flex items-center justify-between">
          <span>Emitido por Nexus • Serviço {formData.serviceType}</span>
          <span>{new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
};

const LabelPrintPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const client = useMemo(() => {
    if (!clientId) return null;
    return completeClientData.find((item) => String(item.idx + 1) === clientId) || null;
  }, [clientId]);

  const [copies, setCopies] = useState(1);

  const [formData, setFormData] = useState<LabelFormState>(() => ({
    recipient: client?.nome_completo || '',
    identifier: client ? `CLI-${String(client.idx + 1).padStart(4, '0')}` : '',
    phone: formatPhone(client?.telefone),
    email: client?.email_principal || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    note: '',
    weight: '0.800',
    dimensions: '10 x 15 cm',
    serviceType: 'Entrega expressa',
  }));

  useEffect(() => {
    if (!client) return;
    setFormData({
      recipient: client.nome_completo || '',
      identifier: `CLI-${String(client.idx + 1).padStart(4, '0')}`,
      phone: formatPhone(client.telefone),
      email: client.email_principal || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      note: '',
      weight: '0.800',
      dimensions: '10 x 15 cm',
      serviceType: 'Entrega expressa',
    });
  }, [client]);

  const handleFieldChange = (field: keyof LabelFormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCopiesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = clampCopies(Number(event.target.value));
    setCopies(nextValue);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!client) {
    return (
      <div className="min-h-screen bg-luxury relative overflow-hidden">
        <HeaderNavigation />
        <main className="relative z-10 container-luxury pt-32 pb-16">
          <Card className="glass-card max-w-xl mx-auto text-center space-y-4 p-8">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold">Cliente não encontrado</h1>
            <p className="text-sm text-muted-foreground">
              Não conseguimos localizar o cliente solicitado. Volte para a listagem e tente novamente.
            </p>
            <Button onClick={() => navigate('/clients')}>Ir para clientes</Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury relative overflow-hidden">
      <HeaderNavigation />
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-muted/10" />
      <div className="fixed top-0 left-1/2 w-[32rem] h-[32rem] bg-primary/10 rounded-full blur-3xl" />
      <div className="fixed bottom-0 right-1/3 w-[28rem] h-[28rem] bg-secondary/20 rounded-full blur-3xl" />

      <main className="relative z-10 container-luxury pt-32 pb-16 space-y-8">
        <div className="flex items-center justify-between no-print">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Impressão de etiquetas</p>
            <p className="text-lg font-semibold">{client.nome_completo}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
          <Card className="glass-card no-print">
            <CardHeader>
              <CardTitle>Configurar etiqueta</CardTitle>
              <p className="text-sm text-muted-foreground">
                Preencha o que deve aparecer na etiqueta antes de enviar para a impressora.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Destinatário</Label>
                <Input value={formData.recipient} onChange={handleFieldChange('recipient')} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={formData.email} onChange={handleFieldChange('email')} />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={formData.phone} onChange={handleFieldChange('phone')} placeholder="(31) 99999-0000" />
              </div>
              <div className="space-y-2">
                <Label>Código da etiqueta</Label>
                <Input value={formData.identifier} onChange={handleFieldChange('identifier')} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input value={formData.city} onChange={handleFieldChange('city')} />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Input value={formData.state} onChange={handleFieldChange('state')} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CEP</Label>
                  <Input value={formData.postalCode} onChange={handleFieldChange('postalCode')} />
                </div>
                <div className="space-y-2">
                  <Label>Peso (kg)</Label>
                  <Input value={formData.weight} onChange={handleFieldChange('weight')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Endereço principal</Label>
                <Input value={formData.addressLine1} onChange={handleFieldChange('addressLine1')} placeholder="Rua, número e bairro" />
              </div>
              <div className="space-y-2">
                <Label>Complemento</Label>
                <Input value={formData.addressLine2} onChange={handleFieldChange('addressLine2')} placeholder="Apartamento, bloco, ponto de referência" />
              </div>
              <div className="space-y-2">
                <Label>Dimensões (cm)</Label>
                <Input value={formData.dimensions} onChange={handleFieldChange('dimensions')} />
              </div>
              <div className="space-y-2">
                <Label>Tipo de serviço</Label>
                <Input value={formData.serviceType} onChange={handleFieldChange('serviceType')} />
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea rows={4} value={formData.note} onChange={handleFieldChange('note')} placeholder="Instruções especiais, referência, tipo de pacote..." />
              </div>
              <div className="space-y-2">
                <Label>Cópias</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={copies}
                  onChange={handleCopiesChange}
                />
                <p className="text-xs text-muted-foreground">
                  Imprimiremos {copies} {copies === 1 ? 'cópia' : 'cópias'} consecutivas desta etiqueta.
                </p>
              </div>

              <Button className="w-full" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimir agora
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="glass-card no-print">
              <CardHeader>
                <CardTitle>Pré-visualização</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Assim a etiqueta será enviada para a impressora térmica.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    <span>{copies} {copies === 1 ? 'cópia' : 'cópias'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pronto para imprimir</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <PrintableLabel formData={formData} />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-dashed border-muted no-print">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Antes de imprimir</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Utilize margens zero no diálogo de impressão do navegador.</p>
                <p>• Selecione sua impressora térmica Zebra, Elgin ou compatível.</p>
                <p>• As {copies} etiquetas serão duplicadas automaticamente na área de impressão.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="print-area">
          {Array.from({ length: copies }).map((_, index) => (
            <div key={index} className="print-label-wrapper">
              <PrintableLabel formData={formData} copyNumber={index + 1} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LabelPrintPage;

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Header from '../components/Header';
import Input from '../components/Input';
import Select from '../components/Select';
import QrCodeScanner from '../components/QrCodeScanner';
import AbastecimentosTabela from '../components/AbastecimentosTabela';
import { emptyAbastecimento } from '../utils/forms';

export default function Abastecimentos() {
  const [items, setItems] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [urlConsulta, setUrlConsulta] = useState('');
  const [scannerAtivo, setScannerAtivo] = useState(false);
  const [filtro, setFiltro] = useState({ veiculoId: '', motoristaId: '' });
  const [form, setForm] = useState(emptyAbastecimento());

  const load = useCallback(() => {
    api.get('/abastecimentos', { params: filtro }).then((r) => setItems(r.data));
    api.get('/veiculos').then((r) => setVeiculos(r.data));
    api.get('/motoristas').then((r) => setMotoristas(r.data));
  }, [filtro]);

  useEffect(() => { load(); }, []);

  function aplicarDadosNota(data) {
    if (!data.sucesso) {
      toast.warning(data.mensagem || 'Não foi possível analisar a nota.');
      return;
    }

    setForm((f) => ({
      ...f,
      veiculoId: data.veiculoId || f.veiculoId,
      motoristaId: data.motoristaId || f.motoristaId,
      kmAtual: data.kmAtual ?? f.kmAtual,
      litros: data.litros ?? f.litros,
      valorTotal: data.valorTotal ?? f.valorTotal,
      posto: data.posto || f.posto,
      dataAbastecimento: data.dataAbastecimento ? data.dataAbastecimento.substring(0, 16) : f.dataAbastecimento,
      observacao: [
        data.urlConsulta ? `URL NFC-e: ${data.urlConsulta}` : '',
        data.combustivel ? `Combustível: ${data.combustivel}` : '',
        data.placa ? `Placa: ${data.placa}` : '',
        data.motorista ? `Motorista: ${data.motorista}` : ''
      ].filter(Boolean).join('\n') || f.observacao
    }));

    toast.success(data.mensagem || 'Nota analisada.');
  }

  async function analisar() {
    if (!foto && !urlConsulta.trim()) {
      toast.warning('Selecione a foto ou cole a URL da NFC-e.');
      return;
    }

    const fd = new FormData();
    if (foto) fd.append('fotoNotaFiscal', foto);
    if (urlConsulta.trim()) fd.append('urlConsulta', urlConsulta.trim());

    try {
      const { data } = await api.post('/abastecimentos/analisar-nota', fd);
      aplicarDadosNota(data);
    } catch (err) {
      toast.error(err.response?.data?.mensagem || 'Erro ao analisar nota.');
    }
  }

  async function analisarUrl(url) {
    try {
      setUrlConsulta(url);
      const fd = new FormData();
      fd.append('urlConsulta', url);
      const { data } = await api.post('/abastecimentos/analisar-nota', fd);
      aplicarDadosNota(data);
      setScannerAtivo(false);
    } catch (err) {
      toast.error(err.response?.data?.mensagem || 'Erro ao analisar QR Code.');
    }
  }

  async function save(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (foto) fd.append('fotoNotaFiscal', foto);

    try {
      await api.post('/abastecimentos', fd);
      toast.success('Abastecimento salvo.');
      setForm(emptyAbastecimento());
      setFoto(null);
      setPreview('');
      setUrlConsulta('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.mensagem || 'Erro ao salvar.');
    }
  }

  function fileChange(file) {
    setFoto(file);
    setPreview(file ? URL.createObjectURL(file) : '');
  }

  return (
    <>
      <Header title="Abastecimentos" subtitle="Registre abastecimentos, leia QR Code e anexe a nota fiscal" />

      <form className="card card-soft p-3 mb-4" onSubmit={save}>
        <div className="row">
          <div className="col-md-12 mb-3">
            <label>Foto da nota fiscal para salvar no registro</label>
            <input className="form-control" type="file" accept="image/*" onChange={(e) => fileChange(e.target.files[0])} />
            {preview && <img src={preview} className="preview-img" />}

            <div className="d-flex gap-2 mt-3 flex-wrap">
              <button type="button" className="btn btn-outline-dark" onClick={() => setScannerAtivo((v) => !v)}>
                {scannerAtivo ? 'Fechar leitor QR Code' : 'Abrir leitor QR Code'}
              </button>
              <button type="button" className="btn btn-outline-primary" onClick={analisar}>Analisar Nota</button>
            </div>

            <QrCodeScanner ativo={scannerAtivo} onRead={analisarUrl} />

            <label className="mt-3">URL da NFC-e / QR Code</label>
            <input className="form-control" placeholder="Cole aqui a URL da NFC-e" value={urlConsulta} onChange={(e) => setUrlConsulta(e.target.value)} />
            <small className="text-muted">A leitura pelo QR Code/URL é mais confiável que OCR da imagem inteira.</small>
          </div>

          <Select label="Veículo" value={form.veiculoId} onChange={(v) => setForm({ ...form, veiculoId: v })} items={veiculos} text={(x) => `${x.modelo} - ${x.placa}`} />
          <Select label="Motorista/Técnico" value={form.motoristaId} onChange={(v) => setForm({ ...form, motoristaId: v })} items={motoristas} text={(x) => x.nome} />
          <Input label="Data" type="datetime-local" value={form.dataAbastecimento} onChange={(v) => setForm({ ...form, dataAbastecimento: v })} />
          <Input label="KM atual" type="number" value={form.kmAtual} onChange={(v) => setForm({ ...form, kmAtual: v })} />
          <Input label="Litros" value={form.litros} onChange={(v) => setForm({ ...form, litros: v })} />
          <Input label="Valor total" value={form.valorTotal} onChange={(v) => setForm({ ...form, valorTotal: v })} />
          <Input label="Posto" value={form.posto} onChange={(v) => setForm({ ...form, posto: v })} />
        </div>

        <label>Observação</label>
        <textarea className="form-control mb-3" rows="3" value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} />
        <button className="btn btn-success">Salvar Abastecimento</button>
      </form>

      <div className="card card-soft p-3 mb-3">
        <div className="row">
          <Select label="Filtrar veículo" value={filtro.veiculoId} onChange={(v) => setFiltro({ ...filtro, veiculoId: v })} items={veiculos} text={(x) => `${x.modelo} - ${x.placa}`} />
          <Select label="Filtrar motorista" value={filtro.motoristaId} onChange={(v) => setFiltro({ ...filtro, motoristaId: v })} items={motoristas} text={(x) => x.nome} />
          <div className="col-md-2 d-flex align-items-end mb-3"><button type="button" className="btn btn-primary w-100" onClick={load}>Filtrar</button></div>
        </div>
      </div>

      <div className="card card-soft table-card"><AbastecimentosTabela items={items} /></div>
    </>
  );
}

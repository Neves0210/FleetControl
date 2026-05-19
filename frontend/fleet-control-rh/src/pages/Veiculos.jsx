import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Header from '../components/Header';
import Search from '../components/Search';
import Input from '../components/Input';
import { number } from '../utils/formatters';

function combustivel(v) { return ({ 1: 'Gasolina', 2: 'Etanol', 3: 'Diesel', 4: 'Flex' })[v] || v; }

export default function Veiculos() {
  const [items, setItems] = useState([]);
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState({ modelo: '', placa: '', kmAtual: 0, tipoCombustivel: 2, ativo: true });
  const [edit, setEdit] = useState(null);

  const filtered = useMemo(() => items.filter((x) => (x.modelo + x.placa).toLowerCase().includes(busca.toLowerCase())), [items, busca]);
  const load = () => api.get('/veiculos').then((r) => setItems(r.data));
  useEffect(load, []);

  async function save(e) {
    e.preventDefault();
    try {
      if (edit) await api.put(`/veiculos/${edit}`, form);
      else await api.post('/veiculos', form);
      toast.success('Veículo salvo.');
      setForm({ modelo: '', placa: '', kmAtual: 0, tipoCombustivel: 2, ativo: true });
      setEdit(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.mensagem || 'Erro ao salvar.');
    }
  }

  async function del(id) {
    if (confirm('Remover veículo?')) {
      await api.delete(`/veiculos/${id}`);
      toast.success('Veículo removido.');
      load();
    }
  }

  return (
    <>
      <Header title="Veículos" subtitle="Cadastro e manutenção da frota" />
      <form className="card card-soft p-3 mb-3" onSubmit={save}>
        <div className="row">
          <Input label="Modelo" value={form.modelo} onChange={(v) => setForm({ ...form, modelo: v })} />
          <Input label="Placa" value={form.placa} onChange={(v) => setForm({ ...form, placa: v })} />
          <Input label="KM" type="number" value={form.kmAtual} onChange={(v) => setForm({ ...form, kmAtual: +v })} />
          <div className="col-md-2 mb-3"><label>Combustível</label><select className="form-select" value={form.tipoCombustivel} onChange={(e) => setForm({ ...form, tipoCombustivel: +e.target.value })}><option value="1">Gasolina</option><option value="2">Etanol</option><option value="3">Diesel</option><option value="4">Flex</option></select></div>
          <div className="col-md-2 mb-3 d-flex align-items-end"><button className="btn btn-success w-100">{edit ? 'Atualizar' : 'Cadastrar'}</button></div>
        </div>
      </form>
      <Search value={busca} setValue={setBusca} />
      <div className="card card-soft table-card"><table className="table table-hover"><thead><tr><th>Modelo</th><th>Placa</th><th>KM atual</th><th>Combustível</th><th width="180"></th></tr></thead><tbody>{filtered.map((x) => <tr key={x.id}><td>{x.modelo}</td><td><span className="badge-soft">{x.placa}</span></td><td>{number(x.kmAtual)}</td><td>{combustivel(x.tipoCombustivel)}</td><td><button className="btn btn-sm btn-warning me-2" onClick={() => { setEdit(x.id); setForm(x); }}>Editar</button><button className="btn btn-sm btn-danger" onClick={() => del(x.id)}>Remover</button></td></tr>)}</tbody></table></div>
    </>
  );
}

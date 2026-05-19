import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Header from '../components/Header';
import Search from '../components/Search';
import Input from '../components/Input';

export default function Motoristas() {
  const [items, setItems] = useState([]);
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState({ nome: '', documento: '', telefone: '', cargo: 'Técnico', ativo: true });
  const [edit, setEdit] = useState(null);
  const filtered = items.filter((x) => (x.nome + x.cargo).toLowerCase().includes(busca.toLowerCase()));
  const load = () => api.get('/motoristas').then((r) => setItems(r.data));
  useEffect(load, []);

  async function save(e) {
    e.preventDefault();
    try {
      if (edit) await api.put(`/motoristas/${edit}`, form);
      else await api.post('/motoristas', form);
      toast.success('Motorista salvo.');
      setForm({ nome: '', documento: '', telefone: '', cargo: 'Técnico', ativo: true });
      setEdit(null);
      load();
    } catch { toast.error('Erro ao salvar.'); }
  }

  async function del(id) {
    if (confirm('Remover motorista?')) {
      await api.delete(`/motoristas/${id}`);
      toast.success('Motorista removido.');
      load();
    }
  }

  return <><Header title="Motoristas/Técnicos" subtitle="Equipe vinculada aos abastecimentos" /><form className="card card-soft p-3 mb-3" onSubmit={save}><div className="row"><Input label="Nome" value={form.nome} onChange={(v) => setForm({ ...form, nome: v })} /><Input label="Documento" value={form.documento || ''} onChange={(v) => setForm({ ...form, documento: v })} /><Input label="Telefone" value={form.telefone || ''} onChange={(v) => setForm({ ...form, telefone: v })} /><Input label="Cargo" value={form.cargo || ''} onChange={(v) => setForm({ ...form, cargo: v })} /><div className="col-md-2 mb-3 d-flex align-items-end"><button className="btn btn-success w-100">Salvar</button></div></div></form><Search value={busca} setValue={setBusca} /><div className="card card-soft table-card"><table className="table table-hover"><thead><tr><th>Nome</th><th>Documento</th><th>Telefone</th><th>Cargo</th><th></th></tr></thead><tbody>{filtered.map((x) => <tr key={x.id}><td>{x.nome}</td><td>{x.documento}</td><td>{x.telefone}</td><td>{x.cargo}</td><td><button className="btn btn-sm btn-warning me-2" onClick={() => { setEdit(x.id); setForm(x); }}>Editar</button><button className="btn btn-sm btn-danger" onClick={() => del(x.id)}>Remover</button></td></tr>)}</tbody></table></div></>;
}

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { getUser } from '../utils/auth';
import Header from '../components/Header';
import Input from '../components/Input';

function perfil(p) { return ({ 1: 'Master', 2: 'RH', 3: 'Técnico' })[p] || p; }

export default function Usuarios() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', senha: '123456', perfil: 3, ativo: true });
  const [edit, setEdit] = useState(null);
  const user = getUser();
  const load = () => api.get('/usuarios').then((r) => setItems(r.data)).catch(() => toast.error('Apenas Master acessa usuários.'));
  useEffect(load, []);

  async function save(e) {
    e.preventDefault();
    try {
      if (edit) await api.put(`/usuarios/${edit}`, form);
      else await api.post('/usuarios', form);
      toast.success('Usuário salvo.');
      setForm({ nome: '', email: '', senha: '123456', perfil: 3, ativo: true });
      setEdit(null);
      load();
    } catch (err) { toast.error(err.response?.data?.mensagem || 'Erro ao salvar usuário.'); }
  }

  if (user?.perfil !== 1) return <p>Apenas Master pode acessar esta tela.</p>;

  return <><Header title="Usuários" subtitle="Controle de acesso e perfis" /><form className="card card-soft p-3 mb-3" onSubmit={save}><div className="row"><Input label="Nome" value={form.nome} onChange={(v) => setForm({ ...form, nome: v })} /><Input label="E-mail" value={form.email} onChange={(v) => setForm({ ...form, email: v })} /><Input label="Senha" value={form.senha || ''} onChange={(v) => setForm({ ...form, senha: v })} /><div className="col-md-2 mb-3"><label>Perfil</label><select className="form-select" value={form.perfil} onChange={(e) => setForm({ ...form, perfil: +e.target.value })}><option value="1">Master</option><option value="2">RH</option><option value="3">Técnico</option></select></div><div className="col-md-2 d-flex align-items-end mb-3"><button className="btn btn-success w-100">Salvar</button></div></div></form><div className="card card-soft table-card"><table className="table table-hover"><thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Status</th><th></th></tr></thead><tbody>{items.map((x) => <tr key={x.id}><td>{x.nome}</td><td>{x.email}</td><td>{perfil(x.perfil)}</td><td>{x.ativo ? 'Ativo' : 'Inativo'}</td><td><button className="btn btn-sm btn-warning" onClick={() => { setEdit(x.id); setForm({ ...x, senha: '' }); }}>Editar</button></td></tr>)}</tbody></table></div></>;
}

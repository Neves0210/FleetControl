import { useEffect, useState } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import { litros, money } from '../utils/formatters';

export default function Relatorios() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/abastecimentos').then((r) => setItems(r.data)); }, []);

  const porVeiculo = Object.values(items.reduce((acc, x) => {
    const k = x.veiculo?.placa || 'Sem placa';
    acc[k] ??= { nome: k, litros: 0, valor: 0, qtd: 0 };
    acc[k].litros += Number(x.litros || 0);
    acc[k].valor += Number(x.valorTotal || 0);
    acc[k].qtd++;
    return acc;
  }, {}));

  return <><Header title="Relatórios RH" subtitle="Consolidação por veículo" /><div className="card card-soft table-card"><table className="table table-hover"><thead><tr><th>Veículo</th><th>Qtd.</th><th>Litros</th><th>Total</th></tr></thead><tbody>{porVeiculo.map((x) => <tr key={x.nome}><td>{x.nome}</td><td>{x.qtd}</td><td>{litros(x.litros)}</td><td>{money(x.valor)}</td></tr>)}</tbody></table></div></>;
}

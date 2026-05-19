import { useEffect, useState } from 'react';
import api from '../services/api';
import { money, number } from '../utils/formatters';
import Metric from '../components/Metric';
import AbastecimentosTabela from '../components/AbastecimentosTabela';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [abastecimentos, setAbastecimentos] = useState([]);

  useEffect(() => {
    api.get('/dashboard').then((r) => setData(r.data));
    api.get('/abastecimentos').then((r) => setAbastecimentos(r.data.slice(0, 5)));
  }, []);

  if (!data) return <p>Carregando...</p>;

  return (
    <>
      <h2 className="mb-3">Dashboard RH</h2>
      <div className="row g-3 mb-4">
        <Metric title="Veículos ativos" value={data.veiculos} />
        <Metric title="Motoristas ativos" value={data.motoristas} />
        <Metric title="Abastecimentos" value={data.abastecimentos} />
        <Metric title="Litros totais" value={number(data.totalLitros)} />
        <Metric title="Gasto total" value={money(data.totalValor)} />
      </div>
      <div className="card card-soft table-card">
        <div className="card-body"><h5>Últimos abastecimentos</h5></div>
        <AbastecimentosTabela items={abastecimentos} />
      </div>
    </>
  );
}

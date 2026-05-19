import { litros, money, number } from '../utils/formatters';

export default function AbastecimentosTabela({ items }) {
  return (
    <table className="table table-hover">
      <thead>
        <tr><th>Data</th><th>Veículo</th><th>Motorista</th><th>KM</th><th>Litros</th><th>Valor</th><th>Nota</th></tr>
      </thead>
      <tbody>
        {items.map((x) => (
          <tr key={x.id}>
            <td>{new Date(x.dataAbastecimento).toLocaleString('pt-BR')}</td>
            <td>{x.veiculo?.placa}</td>
            <td>{x.motorista?.nome}</td>
            <td>{number(x.kmAtual)}</td>
            <td>{litros(x.litros)}</td>
            <td>{money(x.valorTotal)}</td>
            <td>{x.fotoNotaFiscalPath && <a href={`http://localhost:5000${x.fotoNotaFiscalPath}`} target="_blank">Ver</a>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

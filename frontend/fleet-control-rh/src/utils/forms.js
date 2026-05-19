export function emptyAbastecimento() {
  return {
    veiculoId: '',
    motoristaId: '',
    dataAbastecimento: new Date().toISOString().slice(0, 16),
    kmAtual: '',
    litros: '',
    valorTotal: '',
    posto: '',
    observacao: ''
  };
}

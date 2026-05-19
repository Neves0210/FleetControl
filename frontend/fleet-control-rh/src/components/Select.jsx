export default function Select({ label, value, onChange, items, text, col = 'col-md-4' }) {
  return (
    <div className={`${col} mb-3`}>
      <label>{label}</label>
      <select className="form-select" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">Selecione</option>
        {items.map((x) => <option key={x.id} value={x.id}>{text(x)}</option>)}
      </select>
    </div>
  );
}

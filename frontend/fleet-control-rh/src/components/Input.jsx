export default function Input({ label, value, onChange, type = 'text', col = 'col-md-2' }) {
  return (
    <div className={`${col} mb-3`}>
      <label>{label}</label>
      <input type={type} className="form-control" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-neutral-600 text-sm">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className="bg-white px-3 py-2 border rounded-lg w-full text-sm"
      />
    </div>
  );
}

export function Textarea({
  label,
  name,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
  rows?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="text-neutral-600 text-sm">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="bg-white px-3 py-2 border rounded-lg w-full text-sm"
      />
    </div>
  );
}
'use client'

import { FiSearch } from "react-icons/fi";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Cari...",
}: SearchInputProps) {
  return (
    <div className="relative">
      <FiSearch className="top-1/2 left-3 absolute text-neutral-400 -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white px-3 py-2 pl-10 border rounded-lg w-full text-sm"
      />
    </div>
  );
}
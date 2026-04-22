/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";
import { login } from "./page";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default function ClientPage() {

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!form.username || !form.password) {
        return;
      }

      await login(form);

    } catch (err: any) {

      if (isRedirectError(err)) {
        throw err;
      }

      alert(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">

      <div className="space-y-4 p-6 border rounded-xl w-full max-w-sm">

        <h1 className="font-bold text-xl text-center">
          Login
        </h1>

        <div>
          <p className="mb-1 text-xs">Username</p>
          <input
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            className="px-3 py-2 border rounded-lg w-full text-sm"
          />
        </div>

        <div>
          <p className="mb-1 text-xs">Password</p>
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="px-3 py-2 border rounded-lg w-full text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black py-2 rounded-lg w-full text-white text-sm"
        >
          {loading ? "Loading..." : "Login"}
        </button>

      </div>

    </div>
  );
}
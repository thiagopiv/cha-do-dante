"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function FormularioNovoConvidado() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [numeroMesa, setNumeroMesa] = useState("");
  const [salvando, setSalvando] = useState(false);

  function gerarCodigoUnico() {
    return Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 6);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;

    setSalvando(true);
    const codigo = gerarCodigoUnico();

    const { error } = await supabase.from("convidados").insert([
      {
        nome: nome.trim(),
        whatsapp: whatsapp.trim() || null,
        numero_mesa: numeroMesa.trim() || null,
        codigo_exclusivo: codigo,
        status_presenca: null,
        tamanho_fralda: null,
      },
    ]);

    setSalvando(false);
    if (error) {
      alert("Erro ao cadastrar convidado!");
    } else {
      setNome("");
      setWhatsapp("");
      setNumeroMesa("");
      window.location.reload();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Adicionar Novo Convidado ➕</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Nome completo..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-slate-800"
        />
        <input
          type="text"
          placeholder="WhatsApp (ex: 43999998888)..."
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-slate-800"
        />
        <input
          type="text"
          placeholder="Mesa (ex: Mesa 01)..."
          value={numeroMesa}
          onChange={(e) => setNumeroMesa(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-slate-800"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={salvando}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm cursor-pointer disabled:opacity-50"
        >
          {salvando ? "Cadastrando..." : "Cadastrar Convidado 🚀"}
        </button>
      </div>
    </form>
  );
}
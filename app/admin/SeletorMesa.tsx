"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function SeletorMesa({ 
  id, 
  mesaAtual 
}: { 
  id: string | number; 
  mesaAtual?: string | number | null; 
}) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  // Função que limpa o valor e extrai apenas o número (ex: "Mesa 2" -> "2", 2 -> "2")
  const extrairNumero = (valor: string | number | null | undefined) => {
    if (!valor) return "";
    const apenasNumeros = String(valor).replace(/\D/g, "");
    return apenasNumeros || String(valor).trim();
  };

  const [mesa, setMesa] = useState(extrairNumero(mesaAtual));

  // Garante que o estado sincronize caso os dados mudem
  useEffect(() => {
    setMesa(extrairNumero(mesaAtual));
  }, [mesaAtual]);

  async function alterarMesa(novaMesa: string) {
    setCarregando(true);
    const valorFinal = novaMesa === "" ? null : novaMesa;

    const { error } = await supabase
      .from("convidados")
      .update({ numero_mesa: valorFinal })
      .eq("id", id);

    setCarregando(false);

    if (error) {
      alert("Erro ao atualizar a mesa!");
    } else {
      setMesa(novaMesa);
      router.refresh();
    }
  }

  return (
    <div className="relative inline-block">
      <select
        value={mesa}
        onChange={(e) => alterarMesa(e.target.value)}
        disabled={carregando}
        className={`text-xs font-bold py-1.5 px-3 rounded-xl border transition-all cursor-pointer outline-none ${
          mesa 
            ? "bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100" 
            : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
        } ${carregando ? "opacity-50 cursor-wait" : ""}`}
      >
        <option value="">🪑 Sem mesa</option>
        {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map((num) => (
          <option key={num} value={num}>
            Mesa {num}
          </option>
        ))}
      </select>
    </div>
  );
}
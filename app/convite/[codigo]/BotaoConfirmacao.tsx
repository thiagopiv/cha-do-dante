"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function BotaoConfirmacao({ 
  codigo, 
  statusAtual, 
  numeroMesa,
  tamanhoFraldaAtual
}: { 
  codigo: string; 
  statusAtual: string | null; 
  numeroMesa?: string | null;
  tamanhoFraldaAtual?: string | null;
}) {
  const router = useRouter(); // Hook para limpar o cache do Next.js

  const [status, setStatus] = useState(statusAtual);
  const [fraldaEscolhida, setFraldaEscolhida] = useState<string | null>(tamanhoFraldaAtual || null);
  const [carregando, setCarregando] = useState(false);
  const [mostrarOpcoesFralda, setMostrarOpcoesFralda] = useState(false);

  // ✨ MAGIA AQUI: Garante que a tela sempre reflita exatamente o que está no banco
  useEffect(() => {
    setStatus(statusAtual);
    setFraldaEscolhida(tamanhoFraldaAtual || null);
  }, [statusAtual, tamanhoFraldaAtual]);

  // Limites máximos de fraldas
  const LIMITES = { P: 15, M: 35, G: 20 };
  const [contagens, setContagens] = useState({ P: 0, M: 0, G: 0 });

  async function checarVagasFraldas() {
    const { data } = await supabase.from("convidados").select("tamanho_fralda");
    if (data) {
      const p = data.filter(c => c.tamanho_fralda === "P").length;
      const m = data.filter(c => c.tamanho_fralda === "M").length;
      const g = data.filter(c => c.tamanho_fralda === "G").length;
      setContagens({ P: p, M: m, G: g });
    }
  }

  async function abrirOpcoes() {
    await checarVagasFraldas();
    setMostrarOpcoesFralda(true);
  }

  async function atualizarPresenca(novoStatus: string, tamanhoFralda?: string) {
    setCarregando(true);

    const dadosAtualizacao: { status_presenca: string; tamanho_fralda?: string | null } = { 
      status_presenca: novoStatus 
    };

    if (novoStatus === "Confirmado" && tamanhoFralda) {
      dadosAtualizacao.tamanho_fralda = tamanhoFralda;
    } else if (novoStatus === "Recusado") {
      dadosAtualizacao.tamanho_fralda = null;
    }

    const { error } = await supabase
      .from("convidados")
      .update(dadosAtualizacao)
      .eq("codigo_exclusivo", codigo);

    setCarregando(false);

    if (error) {
      alert("Erro ao atualizar. Tente novamente!");
    } else {
      setStatus(novoStatus);
      if (tamanhoFralda) setFraldaEscolhida(tamanhoFralda);
      setMostrarOpcoesFralda(false);
      
      // ✨ Força o site a buscar os dados novos do servidor
      router.refresh(); 
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Exibição quando a presença estiver CONFIRMADA */}
      {status === "Confirmado" ? (
        <div className="bg-emerald-50 border-2 border-emerald-200 p-6 rounded-2xl text-center space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-4xl">🎉</span>
            <h3 className="font-black text-xl text-emerald-900">Presença Confirmada!</h3>
            <p className="text-sm text-emerald-800 font-medium">
              Sua presença e seu apoio ao Dante foram registrados com sucesso! 💙
            </p>
          </div>

          {/* Destaque do Tamanho da Fralda e da Mesa Reservada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Bloco Fralda */}
            <div className="bg-blue-600 text-white p-3.5 rounded-xl shadow-sm space-y-0.5">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200">
                Tamanho da Fralda 🧷
              </p>
              <p className="text-xl font-black tracking-wide">
                {fraldaEscolhida ? `Fralda ${fraldaEscolhida}` : "Confirmada"}
              </p>
            </div>

            {/* Bloco Mesa */}
            <div className="bg-white border-2 border-emerald-300 text-emerald-950 p-3.5 rounded-xl shadow-sm space-y-0.5">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                Sua Mesa Reservada 🪑
              </p>
              <p className="text-xl font-black text-emerald-900">
                {numeroMesa || "Reservada"}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium pt-1">
            Esperamos você por lá no <strong>Domingo, 08 de Novembro de 2026</strong>! 🧸✨
          </p>

          <button 
            onClick={() => { setStatus(null); setMostrarOpcoesFralda(false); }}
            className="text-xs text-emerald-700 underline font-bold cursor-pointer hover:text-emerald-900 pt-1"
          >
            Mudar resposta ou tamanho da fralda
          </button>
        </div>
      ) : status === "Recusado" ? (
        /* Exibição quando RECUSADO */
        <div className="bg-slate-100 border border-slate-200 text-slate-700 p-6 rounded-2xl text-center space-y-2">
          <span className="text-3xl">😢</span>
          <p className="font-extrabold text-lg">Resposta Registrada</p>
          <p className="text-xs text-slate-500">Sentiremos sua falta no Chá do Dante!</p>
          <button 
            onClick={() => { setStatus(null); setMostrarOpcoesFralda(false); }}
            className="mt-3 text-xs text-blue-600 underline font-semibold cursor-pointer"
          >
            Mudar resposta
          </button>
        </div>
      ) : (
        /* Exibição Padrão antes de responder */
        <>
          {mostrarOpcoesFralda ? (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-3 animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="font-extrabold text-blue-900 text-sm">Qual o tamanho da fralda que você vai levar? 🧷</h3>
                <p className="text-xs text-blue-700">Escolha um tamanho disponível abaixo:</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Botão Fralda P */}
                <button
                  onClick={() => atualizarPresenca("Confirmado", "P")}
                  disabled={carregando || contagens.P >= LIMITES.P}
                  className={`border py-3 rounded-xl transition-all shadow-sm text-xs font-bold flex flex-col items-center justify-center gap-1 ${
                    contagens.P >= LIMITES.P 
                      ? "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed" 
                      : "bg-white hover:bg-blue-600 hover:text-white border-blue-300 text-blue-900 cursor-pointer"
                  }`}
                >
                  <span>Fralda P</span>
                  <span className="text-[10px] font-normal">
                    {contagens.P >= LIMITES.P ? "Esgotado!" : `${contagens.P}/${LIMITES.P}`}
                  </span>
                </button>

                {/* Botão Fralda M */}
                <button
                  onClick={() => atualizarPresenca("Confirmado", "M")}
                  disabled={carregando || contagens.M >= LIMITES.M}
                  className={`border py-3 rounded-xl transition-all shadow-sm text-xs font-bold flex flex-col items-center justify-center gap-1 ${
                    contagens.M >= LIMITES.M 
                      ? "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed" 
                      : "bg-white hover:bg-blue-600 hover:text-white border-blue-300 text-blue-900 cursor-pointer"
                  }`}
                >
                  <span>Fralda M</span>
                  <span className="text-[10px] font-normal">
                    {contagens.M >= LIMITES.M ? "Esgotado!" : `${contagens.M}/${LIMITES.M}`}
                  </span>
                </button>

                {/* Botão Fralda G */}
                <button
                  onClick={() => atualizarPresenca("Confirmado", "G")}
                  disabled={carregando || contagens.G >= LIMITES.G}
                  className={`border py-3 rounded-xl transition-all shadow-sm text-xs font-bold flex flex-col items-center justify-center gap-1 ${
                    contagens.G >= LIMITES.G 
                      ? "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed" 
                      : "bg-white hover:bg-blue-600 hover:text-white border-blue-300 text-blue-900 cursor-pointer"
                  }`}
                >
                  <span>Fralda G</span>
                  <span className="text-[10px] font-normal">
                    {contagens.G >= LIMITES.G ? "Esgotado!" : `${contagens.G}/${LIMITES.G}`}
                  </span>
                </button>
              </div>

              <button
                onClick={() => setMostrarOpcoesFralda(false)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-700 pt-1 cursor-pointer"
              >
                Voltar
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={abrirOpcoes}
                disabled={carregando}
                className="font-black py-4 rounded-2xl transition-all shadow-md cursor-pointer bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 text-base"
              >
                {carregando ? "Salvando..." : "Vou Sim! 🎉"}
              </button>

              <button
                onClick={() => atualizarPresenca("Recusado")}
                disabled={carregando}
                className="font-bold py-3.5 rounded-2xl transition-all cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm"
              >
                {carregando ? "Salvando..." : "Não Poderei 😔"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
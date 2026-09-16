"use client";
import { useState } from "react";

type Convidado = {
  id: string;
  nome: string;
  numero_mesa: string | null;
  status_presenca: string | null;
  tamanho_fralda: string | null;
};

type Props = {
  convidados: Convidado[];
};

export default function AbaMesas({ convidados }: Props) {
  const [mesaSelecionada, setMesaSelecionada] = useState<string | null>(null);

  // Lista fixa de 12 mesas
  const numerosMesas = Array.from({ length: 12 }, (_, i) => `Mesa ${String(i + 1).padStart(2, "0")}`);

  // Filtra os convidados da mesa aberta no pop-up
  const convidadosDaMesa = mesaSelecionada
    ? convidados.filter((c) => {
        if (!c.numero_mesa) return false;
        // Compara ignorando maiúsculas e zeros à esquerda (ex: "Mesa 1" ou "Mesa 01" ou "1")
        const mesaConvidado = c.numero_mesa.toLowerCase().replace("mesa", "").trim();
        const mesaAlvo = mesaSelecionada.toLowerCase().replace("mesa", "").trim();
        return parseInt(mesaConvidado, 10) === parseInt(mesaAlvo, 10);
      })
    : [];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>🪑</span> Visão Geral das Mesas (1 a 12)
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Clique em qualquer mesa abaixo para ver a lista de convidados atribuídos a ela.
          </p>
        </div>
      </div>

      {/* Grade com os 12 Botões de Mesas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {numerosMesas.map((nomeMesa, index) => {
          const numInt = index + 1;
          const qtdPessoas = convidados.filter((c) => {
            if (!c.numero_mesa) return false;
            const mesaC = c.numero_mesa.toLowerCase().replace("mesa", "").trim();
            return parseInt(mesaC, 10) === numInt;
          }).length;

          return (
            <button
              key={nomeMesa}
              onClick={() => setMesaSelecionada(nomeMesa)}
              className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 p-4 rounded-2xl text-center transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col items-center justify-center gap-1"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🪑</span>
              <p className="font-extrabold text-slate-800 text-sm group-hover:text-blue-900">{nomeMesa}</p>
              <span className="text-[11px] font-medium text-slate-500 group-hover:text-blue-700 bg-white group-hover:bg-blue-100 px-2 py-0.5 rounded-full border border-slate-200 group-hover:border-blue-200 mt-1">
                {qtdPessoas} {qtdPessoas === 1 ? "pessoa" : "pessoas"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pop-up (Modal) da Mesa Selecionada */}
      {mesaSelecionada && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-blue-200 space-y-5 animate-fadeIn">
            
            {/* Cabeçalho do Pop-up */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🪑</span>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-lg">{mesaSelecionada}</h3>
                  <p className="text-xs text-slate-500">
                    {convidadosDaMesa.length} convidado(s) atribuído(s)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMesaSelecionada(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo: Lista de Pessoas na Mesa */}
            {convidadosDaMesa.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Nenhum convidado cadastrado nesta mesa ainda.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {convidadosDaMesa.map((c) => (
                  <div
                    key={c.id}
                    className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{c.nome}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Fralda:{" "}
                        <strong className="text-blue-700">
                          {c.tamanho_fralda ? `Fralda ${c.tamanho_fralda}` : "Não escolhida"}
                        </strong>
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          c.status_presenca === "Confirmado"
                            ? "bg-green-100 text-green-700"
                            : c.status_presenca === "Recusado"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {c.status_presenca || "Pendente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botão Fechar */}
            <div className="pt-2">
              <button
                onClick={() => setMesaSelecionada(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
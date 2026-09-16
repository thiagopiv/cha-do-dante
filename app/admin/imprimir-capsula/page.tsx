import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import BotaoImprimir from "./page";

export const dynamic = 'force-dynamic';

export default async function ImprimirCapsula() {
  // Busca todas as mensagens da cápsula do tempo
  const { data: brincadeiras } = await supabase
    .from("brincadeiras")
    .select("nome_convidado, capsula_mensagem, criado_at")
    .not("capsula_mensagem", "is", null)
    .order("criado_at", { ascending: true });

  const mensagens = brincadeiras || [];

  return (
    <main className="min-h-screen bg-white text-slate-800 p-8 print:p-0">
      
      {/* Botões de Ação (Aparecem na tela, somem na hora de imprimir) */}
      <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center print:hidden bg-slate-100 p-4 rounded-2xl border border-slate-200">
        <div>
          <h1 className="font-bold text-slate-800 text-sm">Modo de Impressão - Cápsula do Tempo</h1>
          <p className="text-xs text-slate-500">Clique no botão para salvar como PDF ou imprimir.</p>
        </div>
        <div className="flex gap-2 items-center">
          <Link 
            href="/admin" 
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            ← Voltar ao Painel
          </Link>
          <BotaoImprimir />
        </div>
      </div>

      {/* Conteúdo Impresso (Formato Livro / Documento) */}
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Cabeçalho do Documento */}
        <div className="text-center border-b-2 border-slate-200 pb-6 space-y-2">
          <span className="text-4xl">⏳🧸</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cápsula do Tempo - Chá do Dante</h1>
          <p className="text-slate-500 text-sm">Mensagens e conselhos dos convidados para o Dante ler no futuro.</p>
        </div>

        {/* Lista de Mensagens */}
        {mensagens.length === 0 ? (
          <p className="text-center text-slate-400 py-12">Nenhuma mensagem registrada na cápsula até o momento.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {mensagens.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50/50 border border-slate-200 p-6 rounded-2xl break-inside-avoid space-y-2 shadow-sm"
              >
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <h3 className="font-bold text-slate-900 text-base">#{idx + 1} — {item.nome_convidado}</h3>
                  <span className="text-xs text-slate-400">
                    {new Date(item.criado_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed pt-1">
                  &ldquo;{item.capsula_mensagem}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Rodapé do Documento */}
        <div className="text-center pt-10 border-t border-slate-100 text-xs text-slate-400 print:mt-16">
          <p>Chá de Bebê do Dante • Com amor da família e amigos 💙</p>
        </div>

      </div>
    </main>
  );
}
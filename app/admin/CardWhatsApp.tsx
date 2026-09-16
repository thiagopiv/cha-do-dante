"use client";
import { useState } from "react";
import Image from "next/image";
import { toJpeg } from "html-to-image";

type Props = {
  nome: string;
  tamanhoFralda: string | null;
  numeroMesa?: string | null;
};

export default function CardWhatsApp({ nome, tamanhoFralda, numeroMesa }: Props) {
  const [aberto, setAberto] = useState(false);
  const [baixando, setBaixando] = useState(false);

  const textoMesa = numeroMesa ? ` (Sua mesa reservada é a ${numeroMesa} 🪑)` : "";
  const textoWhatsApp = `Olá, ${nome}! 💙 Passando para agradecer de coração. Recebemos a confirmação da sua presença no Chá de Bebê do Dante (com a fralda tamanho ${tamanhoFralda || "escolhida"} 🧷)!${textoMesa} Estamos muito felizes e mal podemos esperar para te ver lá no domingo, dia 08 de novembro! 🧸✨`;

  async function baixarImagemJPG() {
    const node = document.getElementById(`card-arte-${nome.replace(/\s+/g, '-')}`);
    if (!node) return;

    setBaixando(true);
    try {
      const dataUrl = await toJpeg(node, { quality: 0.95, cacheBust: true });
      const link = document.createElement("a");
      link.download = `confirmacao-${nome.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
      alert("Erro ao gerar a imagem JPG. Tente novamente!");
    } finally {
      setBaixando(false);
    }
  }

  const cardId = `card-arte-${nome.replace(/\s+/g, '-')}`;

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
      >
        Gerar Card 🎨
      </button>

      {aberto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-200 space-y-6 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-base">Card de Agradecimento para WhatsApp</h3>
              <button 
                onClick={() => setAberto(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* O Card Visual Ajustado */}
            <div 
              id={cardId} 
              className="bg-sky-100/70 rounded-2xl overflow-hidden border-2 border-sky-300 shadow-inner p-4 space-y-4 text-center w-full box-border"
            >
              {/* Mini Capa */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
                <Image 
                  src="/capa-cha.jpg" 
                  alt="Chá do Dante" 
                  fill 
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Conteúdo do Card */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 space-y-3 w-full box-border overflow-hidden break-words">
                <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest">
                  Chá de Bebê do Dante 🧸
                </p>

                <h4 className="text-lg md:text-xl font-black text-sky-950 leading-tight break-words">
                  Obrigado pela presença, <br />
                  <span className="text-blue-900">{nome}! 💙</span>
                </h4>

                <p className="text-xs text-slate-600 font-medium">
                  Recebemos a confirmação da sua presença!
                </p>

                {/* Destaque BEM EVIDENTE do tamanho da fralda e mesa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pb-1">
                  {/* Bloco Fralda */}
                  <div className="bg-blue-600 text-white p-3 rounded-xl shadow-sm space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                      Tamanho da Fralda 🧷
                    </p>
                    <p className="text-lg font-black tracking-wide">
                      {tamanhoFralda ? `Fralda ${tamanhoFralda}` : "Não escolhida"}
                    </p>
                  </div>

                  {/* Bloco Mesa */}
                  <div className="bg-sky-100 border border-sky-200 text-sky-950 p-3 rounded-xl shadow-sm space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
                      Mesa Reservada 🪑
                    </p>
                    <p className="text-lg font-black">
                      {numeroMesa || "Não definida"}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium leading-normal break-words">
                  📅 Domingo, 08 de Novembro de 2026 às 13h30 <br />
                  📍 Clube House - Condomínio Gran Residence (Arapongas - PR)
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-2">
              <button
                onClick={baixarImagemJPG}
                disabled={baixando}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl transition-all text-xs cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {baixando ? "Gerando imagem JPG..." : "Baixar Imagem JPG 📥"}
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(textoWhatsApp);
                  alert("Mensagem pronta copiada para a área de transferência! Cole no chat do WhatsApp.");
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all text-xs cursor-pointer shadow-sm"
              >
                Copiar Mensagem do WhatsApp 📋
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
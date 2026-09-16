"use client";

export default function BotaoImprimir() {
  return (
    <button 
      onClick={() => typeof window !== 'undefined' && window.print()}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
    >
      🖨️ Baixar PDF / Imprimir
    </button>
  );
}
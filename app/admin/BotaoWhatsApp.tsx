"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function BotaoWhatsApp({ id, nome, codigo, whatsappInicial, enviadoInicial }: { 
  id: string, 
  nome: string, 
  codigo: string, 
  whatsappInicial: string | null, 
  enviadoInicial: boolean 
}) {
  const [enviado, setEnviado] = useState(enviadoInicial);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleEnviar() {
    let numero = whatsappInicial;

    if (!numero) {
      const inputNumero = prompt(`Digite o WhatsApp de ${nome} (com DDD, ex: 43999999999):`);
      if (!inputNumero) return;
      numero = inputNumero.replace(/\D/g, "");
    } else {
      numero = numero.replace(/\D/g, "");
    }

    const urlConvite = `${window.location.origin}/convite/${codigo}`;
    
    // Forçando o emoji de urso através da sua representação em bytes codificados para URL
    const emojiUrso = decodeURIComponent("%F0%9F%A7%B8");
    
    const mensagem = encodeURIComponent(
      `Oii, ${nome}! Aguardo a confirmação da sua presença e escolha do tamanho da fralda =) ${urlConvite}`
    );

    window.open(`https://wa.me/55${numero}?text=${mensagem}`, "_blank");

    startTransition(async () => {
      await fetch(`/api/marcar-enviado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, enviado: true })
      });
      setEnviado(true);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={handleEnviar}
        disabled={isPending}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm ${
          enviado 
            ? "bg-green-100 text-green-700 hover:bg-green-200" 
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        }`}
      >
        {enviado ? "📱 Reenviar Zap" : "📤 Enviar Zap"}
      </button>
    </div>
  );
}
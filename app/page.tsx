"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  // Controle do relógio
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  
  // Link direto para gerar rota no Google Maps com as coordenadas exatas do local
  const linkGoogleMapsRota = "https://www.google.com/maps/dir/?api=1&destination=-23.3682722,-51.4412005";

  useEffect(() => {
    const targetDate = new Date("2026-11-08T13:30:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        dias: Math.floor(distance / (1000 * 60 * 60 * 24)),
        horas: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-sky-100/70 flex flex-col items-center pb-20 relative">
      
      {/* Card Principal Envolvendo a Capa e o Conteúdo */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-sky-200 overflow-hidden my-6 sm:my-10">
        
        {/* Imagem de Capa em 16:9 */}
        <div className="relative w-full aspect-video bg-sky-100">
          <Image 
            src="/capa-cha.jpg" 
            alt="Chá do Dante" 
            fill 
            className="object-cover"
            priority
          />
        </div>

        <div className="p-6 md:p-10 flex flex-col items-center text-center">
          
          <p className="text-blue-600 font-semibold tracking-widest uppercase mb-3 text-xs">
            Está chegando a Hora
          </p>
          
          {/* Contagem Regressiva */}
          <div className="flex gap-2 sm:gap-4 mb-10 w-full justify-center">
            <div className="bg-blue-600 text-white flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-lg">
              <span className="text-xl sm:text-2xl font-bold">{timeLeft.dias}</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wide">Dias</span>
            </div>
            <div className="bg-blue-600 text-white flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-lg">
              <span className="text-xl sm:text-2xl font-bold">{timeLeft.horas}</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wide">Horas</span>
            </div>
            <div className="bg-blue-600 text-white flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-lg">
              <span className="text-xl sm:text-2xl font-bold">{timeLeft.minutos}</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wide">Min</span>
            </div>
            <div className="bg-blue-600 text-white flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-lg">
              <span className="text-xl sm:text-2xl font-bold">{timeLeft.segundos}</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wide">Seg</span>
            </div>
          </div>
          
          {/* Card de Informações (Tudo Centralizado) */}
          <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 w-full mb-8 flex flex-col items-center text-center space-y-6">
            
            <h3 className="text-lg font-bold text-slate-700 border-b border-slate-200 pb-3 w-full">
              A mamãe e eu estamos te esperando! 💙
            </h3>
            
            {/* Bloco de Data e Horário com Destaque */}
            <div className="space-y-4 w-full">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Data do Evento</p>
                <p className="text-lg font-bold text-slate-800 flex items-center justify-center gap-2">
                  <span>📅</span> 08 de Novembro de 2026
                </p>
              </div>

              {/* Horário com super destaque */}
              <div className="bg-blue-50 border border-blue-100 py-4 px-6 rounded-2xl shadow-inner">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Horário</p>
                <p className="text-4xl font-black text-blue-900 tracking-tight flex items-center justify-center gap-2">
                  <span>⏰</span> 13h30
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Local</p>
                <p className="text-sm md:text-base font-medium text-slate-700">
                  📍 Clube House - Condomínio Gran Residence <br />
                  <span className="text-slate-500 text-xs">Arapongas - PR</span>
                </p>
              </div>
            </div>

            {/* Mapa do Google */}
            <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200 mt-2">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d640.1341127733469!2d-51.4412005!3d-23.3682722!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94eca50061c36ab7%3A0xe204d9a41bb1c793!2sClube%20House%20-%20Condom%C3%ADnio%20Gran%20Residence!5e1!3m2!1spt-BR!2sbr!4v1789528539553!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>

            {/* Botão Gerar Rota no Google Maps */}
            <div className="w-full pt-2">
              <a 
                href={linkGoogleMapsRota}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                🚗 Gerar Rota no Google Maps ↗
              </a>
            </div>

          </div>

        </div>
      </div>

    </main>
  );
}
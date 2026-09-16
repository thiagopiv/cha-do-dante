"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Image from "next/image";

export default function PaginaBrincadeiras() {
  const [nome, setNome] = useState("");
  const [circunferencia, setCircunferencia] = useState("");
  const [cotonetes, setCotonetes] = useState("");
  const [mensagemCapsula, setMensagemCapsula] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      alert("Por favor, digite o seu nome!");
      return;
    }

    setEnviando(true);

    const { error } = await supabase.from("brincadeiras").insert([
      {
        nome_convidado: nome,
        circunferencia: circunferencia ? parseInt(circunferencia) : null,
        cotonetes: cotonetes ? parseInt(cotonetes) : null,
        capsula_mensagem: mensagemCapsula || null,
      },
    ]);

    setEnviando(false);

    if (error) {
      alert("Erro ao enviar. Tente novamente!");
    } else {
      setSucesso(true);
    }
  }

  return (
    <main className="min-h-screen bg-sky-100/75 py-10 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-sky-200 overflow-hidden">
        
        {/* Imagem de Capa em 16:9 (aspect-video) */}
        <div className="relative w-full aspect-video bg-sky-100">
          <Image 
            src="/capa-cha.jpg" 
            alt="Chá do Dante" 
            fill 
            className="object-cover"
            priority
          />
        </div>

        <div className="p-6 md:p-10 space-y-8">

          {/* Mensagem de Boas-Vindas */}
          <div className="text-center bg-sky-50 border border-sky-200 p-6 rounded-2xl shadow-sm space-y-2">
            <p className="text-sky-950 font-black text-xl md:text-2xl">
              Seja bem-vinda ao meu Chá de Bebê! 💙
            </p>
            <p className="text-slate-700 text-base">Deixe seus palpites e sua mensagem especial para a Cápsula do Tempo.</p>
          </div>

          {sucesso ? (
            <div className="space-y-6">
              {/* Aviso de Sucesso */}
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl text-center space-y-3">
                <span className="text-5xl">🎉</span>
                <h2 className="text-2xl md:text-3xl font-black">Palpites Salvos com Sucesso!</h2>
                <p className="text-base md:text-lg text-emerald-800">
                  Muito obrigado, <strong className="font-bold">{nome}</strong>! Seus palpites e mensagem foram guardados.
                </p>
              </div>

              {/* Seção de Curiosidades do Dante (Em Primeira Pessoa) */}
              <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="font-black text-sky-950 text-xl">👶 Oi, pessoal! Sou eu, o Dante</h3>
                  <p className="text-base text-sky-800 font-medium">Olha só como estou crescendo por aqui:</p>
                </div>

                <div className="space-y-4">
                  
                  {/* Curiosidade 1 */}
                  <div className="bg-white p-5 rounded-2xl border border-sky-100 flex items-start gap-4 shadow-sm">
                    <span className="text-4xl">🍈</span>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-900">Já estou do tamanho de um melão pequeno</p>
                      <p className="text-base text-slate-700 leading-relaxed">Tenho cerca de 40 cm e peso em torno de 1,4 kg. Pareço um melão pequeno ou um mamão formosa bem gordinho!</p>
                    </div>
                  </div>

                  {/* Curiosidade 2 */}
                  <div className="bg-white p-5 rounded-2xl border border-sky-100 flex items-start gap-4 shadow-sm">
                    <span className="text-4xl">👁️</span>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-900">Já abro e fecho os olhos</p>
                      <p className="text-base text-slate-700 leading-relaxed">Se vocês jogarem uma luz bem forte na barriga da mamãe, eu consigo ver o clarão e até me viro para olhar!</p>
                    </div>
                  </div>

                  {/* Curiosidade 3 */}
                  <div className="bg-white p-5 rounded-2xl border border-sky-100 flex items-start gap-4 shadow-sm">
                    <span className="text-4xl">💤</span>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-900">Acho que já estou sonhando</p>
                      <p className="text-base text-slate-700 leading-relaxed">Meu cérebro não para de treinar. Os médicos dizem que, no meu cochilinho de sono, eu já devo estar sonhando bastante.</p>
                    </div>
                  </div>

                  {/* Curiosidade 4 */}
                  <div className="bg-white p-5 rounded-2xl border border-sky-100 flex items-start gap-4 shadow-sm">
                    <span className="text-4xl">🤸‍♂️</span>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-900">Adoro treinar meus movimentos</p>
                      <p className="text-base text-slate-700 leading-relaxed">Fico me exercitando por aqui! Chupo o dedo, pego nos meus pezinhos e mando uns chutinhos bem fortes para a mamãe sentir.</p>
                    </div>
                  </div>

                  {/* Curiosidade 5 */}
                  <div className="bg-white p-5 rounded-2xl border border-sky-100 flex items-start gap-4 shadow-sm">
                    <span className="text-4xl">🍉</span>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-900">Sinto o gosto do que a mamãe come</p>
                      <p className="text-base text-slate-700 leading-relaxed">O sabor das comidas da mamãe chega até mim, então eu já estou descobrindo quais são os meus pratos favoritos!</p>
                    </div>
                  </div>

                  {/* Curiosidade 6 */}
                  <div className="bg-white p-5 rounded-2xl border border-sky-100 flex items-start gap-4 shadow-sm">
                    <span className="text-4xl">💙</span>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-900">Sinto o carinho de vocês</p>
                      <p className="text-base text-slate-700 leading-relaxed">Eu já escuto a voz de todo mundo e sinto direitinho quando vocês passam a mão na barriga para falar comigo.</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-base text-slate-600 font-semibold">Pode fechar esta página quando quiser! 🧸✨</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Nome do Convidado */}
              <div className="space-y-3">
                <h2 className="text-xl font-black text-blue-700">Seu Nome</h2>
                <div>
                  <label className="block text-base font-bold text-slate-800 mb-2">Seu Nome Completo</label>
                  <input
                    type="text"
                    placeholder="Ex: Tio Carlos"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-blue-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Seção Palpites */}
              <div className="border-t-2 border-slate-200 pt-6 space-y-6">
                <h2 className="text-xl font-black text-blue-700">🍼 Palpites do Chá</h2>
                
                {/* Jogo da Circunferência */}
                <div className="space-y-2">
                  <label className="block text-base font-bold text-slate-800 leading-snug">
                    Qual a circunferência da barriga da mamãe? (em cm)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 95"
                    value={circunferencia}
                    onChange={(e) => setCircunferencia(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-blue-600 text-slate-900 font-medium"
                  />
                </div>

                {/* Jogo dos Cotonetes */}
                <div className="space-y-2">
                  <label className="block text-base font-bold text-slate-800 leading-snug">
                    Quantos cotonetes tem dentro do pote?
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 142"
                    value={cotonetes}
                    onChange={(e) => setCotonetes(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-blue-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Seção Cápsula do Tempo */}
              <div className="border-t-2 border-slate-200 pt-6 space-y-6">
                <h2 className="text-xl font-black text-blue-700">⏳ Cápsula do Tempo</h2>
                <div className="space-y-2">
                  <label className="block text-base font-bold text-slate-800 leading-snug">
                    Deixe uma mensagem ou conselho para o Dante ler quando fizer 8 anos:
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Ex: Dante, quando você abrir isso, lembre-se que..."
                    value={mensagemCapsula}
                    onChange={(e) => setMensagemCapsula(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 text-lg focus:outline-none focus:border-blue-600 text-slate-900 font-medium leading-relaxed"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4.5 rounded-2xl transition-all shadow-lg text-lg cursor-pointer disabled:opacity-50"
              >
                {enviando ? "Enviando palpites..." : "Enviar Palpites e Mensagem 🚀"}
              </button>
            </form>
          )}

        </div>
      </div>
    </main>
  );
}
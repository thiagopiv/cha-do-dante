import { supabase } from "../../lib/supabase";
import Link from "next/link";
import FormularioNovoConvidado from "./FormularioNovoConvidado";
import BotaoExcluir from "./BotaoExcluir";
import BotaoWhatsApp from "./BotaoWhatsApp";
import CardWhatsApp from "./CardWhatsApp";
import AbaMesas from "./AbaMesas";
import SeletorMesa from "./SeletorMesa";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export default async function PainelAdmin({ searchParams }: { searchParams: Promise<{ gabarito_circ?: string, gabarito_cot?: string }> }) {
  const params = await searchParams;
  const gabaritoCirc = params.gabarito_circ ? parseInt(params.gabarito_circ) : null;
  const gabaritoCot = params.gabarito_cot ? parseInt(params.gabarito_cot) : null;

  async function deletarConvidado(formData: FormData) {
    'use server'
    const id = formData.get("id");
    if (!id) return;

    await supabase.from("convidados").delete().eq("id", id);
    revalidatePath("/admin");
  }

  // Busca os convidados
  const { data: convidados, error: erroConvidados } = await supabase
    .from("convidados")
    .select("*")
    .order("nome", { ascending: true });

  // Busca os palpites e cápsula do tempo
  const { data: brincadeiras, error: erroBrincadeiras } = await supabase
    .from("brincadeiras")
    .select("*")
    .order("criado_at", { ascending: false });

  if (erroConvidados || erroBrincadeiras) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <p className="text-red-500 font-bold">Erro ao carregar o painel administrativo.</p>
      </main>
    );
  }

  // Totais de presença e envios
  const totalConvidados = convidados?.length || 0;
  const confirmados = convidados?.filter(c => c.status_presenca === "Confirmado").length || 0;
  const recusados = convidados?.filter(c => c.status_presenca === "Recusado").length || 0;
  const pendentes = convidados?.filter(c => c.status_presenca === "Pendente" || !c.status_presenca).length || 0;
  const enviadosCount = convidados?.filter(c => c.convite_enviado).length || 0;
  const totalBrincadeiras = brincadeiras?.length || 0;

  // Contagem de fraldas
  const totalFraldaP = convidados?.filter(c => c.tamanho_fralda === "P").length || 0;
  const totalFraldaM = convidados?.filter(c => c.tamanho_fralda === "M").length || 0;
  const totalFraldaG = convidados?.filter(c => c.tamanho_fralda === "G").length || 0;

  // Lógica para encontrar todos os vencedores da circunferência em caso de empate
  let vencedoresCirc: { nome: string, palpite: number, diff: number }[] = [];
  if (gabaritoCirc !== null && brincadeiras) {
    const validos = brincadeiras.filter(b => b.circunferencia !== null);
    if (validos.length > 0) {
      const menorDiff = Math.min(...validos.map(b => Math.abs(b.circunferencia! - gabaritoCirc!)));
      const empatados = validos.filter(b => Math.abs(b.circunferencia! - gabaritoCirc!) === menorDiff);
      
      vencedoresCirc = empatados.map(b => ({
        nome: b.nome_convidado,
        palpite: b.circunferencia!,
        diff: menorDiff
      }));
    }
  }

  // Lógica para encontrar todos os vencedores dos cotonetes em caso de empate
  let vencedoresCot: { nome: string, palpite: number, diff: number }[] = [];
  if (gabaritoCot !== null && brincadeiras) {
    const validos = brincadeiras.filter(b => b.cotonetes !== null);
    if (validos.length > 0) {
      const menorDiff = Math.min(...validos.map(b => Math.abs(b.cotonetes! - gabaritoCot!)));
      const empatados = validos.filter(b => Math.abs(b.cotonetes! - gabaritoCot!) === menorDiff);
      
      vencedoresCot = empatados.map(b => ({
        nome: b.nome_convidado,
        palpite: b.cotonetes!,
        diff: menorDiff
      }));
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-blue-600 font-semibold tracking-widest uppercase text-xs">Painel de Controle</p>
            <h1 className="text-3xl font-extrabold text-slate-800">Chá do Dante 🧸</h1>
          </div>
          <div className="flex gap-2">
            <Link 
              href="/brincadeiras" 
              target="_blank"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              Ver Página de Brincadeiras ↗
            </Link>
            <span className="bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm">
              Área Administrativa
            </span>
          </div>
        </div>

        {/* Formulário para Adicionar Novo Convidado */}
        <div>
          <FormularioNovoConvidado />
        </div>

        {/* Cards de Resumo de Presença */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-400 text-xs font-semibold uppercase">Total</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{totalConvidados}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100">
            <p className="text-emerald-600 text-xs font-semibold uppercase">Enviados</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{enviadosCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-100">
            <p className="text-green-600 text-xs font-semibold uppercase">Confirmados</p>
            <p className="text-2xl font-black text-green-700 mt-1">{confirmados}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-100">
            <p className="text-amber-600 text-xs font-semibold uppercase">Pendentes</p>
            <p className="text-2xl font-black text-amber-700 mt-1">{pendentes}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-100">
            <p className="text-red-500 text-xs font-semibold uppercase">Recusados</p>
            <p className="text-2xl font-black text-red-600 mt-1">{recusados}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-purple-100 col-span-2 md:col-span-1">
            <p className="text-purple-600 text-xs font-semibold uppercase">Palpites</p>
            <p className="text-2xl font-black text-purple-700 mt-1">{totalBrincadeiras}</p>
          </div>
        </div>

        {/* Cards de Resumo de Fraldas com Limites */}
        <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-md space-y-4">
          <h2 className="text-base font-extrabold flex items-center gap-2">
            <span>🧷</span> Controle de Fraldas (P: 15 | M: 35 | G: 20)
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-700/60 backdrop-blur-sm p-4 rounded-2xl text-center border border-blue-400/30">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Fralda P</p>
              <p className="text-3xl font-black mt-1">{totalFraldaP} <span className="text-xs font-normal text-blue-200">/ 15</span></p>
            </div>
            <div className="bg-blue-700/60 backdrop-blur-sm p-4 rounded-2xl text-center border border-blue-400/30">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Fralda M</p>
              <p className="text-3xl font-black mt-1">{totalFraldaM} <span className="text-xs font-normal text-blue-200">/ 35</span></p>
            </div>
            <div className="bg-blue-700/60 backdrop-blur-sm p-4 rounded-2xl text-center border border-blue-400/30">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Fralda G</p>
              <p className="text-3xl font-black mt-1">{totalFraldaG} <span className="text-xs font-normal text-blue-200">/ 20</span></p>
            </div>
          </div>
        </div>

        {/* Tabela de Convidados */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Lista de Convidados 📋</h2>
            <span className="text-xs text-slate-400">Atualizado em tempo real</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4 font-semibold">Nome</th>
                  <th className="p-4 font-semibold">Mesa</th>
                  <th className="p-4 font-semibold">WhatsApp</th>
                  <th className="p-4 font-semibold">Status Presença</th>
                  <th className="p-4 font-semibold">Fralda Escolhida</th>
                  <th className="p-4 font-semibold text-center">Card Confirmação</th>
                  <th className="p-4 font-semibold text-center">Enviar Zap</th>
                  <th className="p-4 font-semibold text-center">Convite</th>
                  <th className="p-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {convidados?.map((convidado) => (
                  <tr key={convidado.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-700">{convidado.nome}</td>
                    
                    {/* Célula da Mesa Editável */}
                    <td className="p-4 whitespace-nowrap">
                      <SeletorMesa id={convidado.id} mesaAtual={convidado.numero_mesa} />
                    </td>

                    <td className="p-4 text-slate-500 whitespace-nowrap">{convidado.whatsapp || "Não cadastrado"}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        convidado.status_presenca === "Confirmado" ? "bg-green-100 text-green-700" :
                        convidado.status_presenca === "Recusado" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {convidado.status_presenca || "Pendente"}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700 whitespace-nowrap">
                      {convidado.tamanho_fralda ? (
                        <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full">
                          Fralda {convidado.tamanho_fralda} 🧷
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Não escolhida</span>
                      )}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <CardWhatsApp 
                        nome={convidado.nome} 
                        tamanhoFralda={convidado.tamanho_fralda} 
                        numeroMesa={convidado.numero_mesa} 
                      />
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <BotaoWhatsApp 
                        id={convidado.id} 
                        nome={convidado.nome} 
                        codigo={convidado.codigo_exclusivo} 
                        whatsappInicial={convidado.whatsapp}
                        enviadoInicial={convidado.convite_enviado}
                      />
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <Link 
                        href={`/convite/${convidado.codigo_exclusivo}`} 
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs underline"
                      >
                        Ver Convite ↗
                      </Link>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <BotaoExcluir id={convidado.id} nome={convidado.nome} onDelete={deletarConvidado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visão Geral e Botões das Mesas */}
        <div>
          <AbaMesas convidados={convidados || []} />
        </div>

        {/* Seção de Gabarito e Apuração dos Vencedores */}
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <span>🏆</span> Apuração do Bolão (Vencedores em Tempo Real)
              </h2>
              <p className="text-slate-500 text-xs mt-1">Insira os valores reais abaixo para descobrir quem chegou mais perto (em caso de empate, todos aparecem)!</p>
            </div>
          </div>

          {/* Formulário para definir o gabarito */}
          <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
            <div>
              <label className="block text-xs font-bold text-purple-900 uppercase mb-1">Valor Real da Circunferência (cm)</label>
              <input 
                type="number" 
                name="gabarito_circ"
                defaultValue={gabaritoCirc !== null ? gabaritoCirc : ""}
                placeholder="Ex: 98"
                className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-purple-900 uppercase mb-1">Quantidade Real de Cotonetes</label>
              <input 
                type="number" 
                name="gabarito_cot"
                defaultValue={gabaritoCot !== null ? gabaritoCot : ""}
                placeholder="Ex: 150"
                className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-slate-700"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button 
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                Calcular Vencedores 🎯
              </button>
            </div>
          </form>

          {/* Destaque dos Vencedores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Vencedor Barriga */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vencedor(a) - Circunferência da Barriga</p>
              {gabaritoCirc === null ? (
                <p className="text-xs text-slate-400 italic">Digite o valor real da circunferência acima para ver o vencedor.</p>
              ) : vencedoresCirc.length > 0 ? (
                <div className="space-y-2">
                  {vencedoresCirc.map((v, idx) => (
                    <div key={idx} className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-emerald-900 font-black text-sm">🎉 {v.nome}</p>
                        <p className="text-xs text-emerald-700 mt-0.5">Palpite: <strong>{v.palpite} cm</strong> (Diferença: {v.diff} cm)</p>
                      </div>
                      <span className="text-xl">🥇</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Nenhum palpite registrado para esta brincadeira ainda.</p>
              )}
            </div>

            {/* Vencedor Cotonetes */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vencedor(a) - Pote de Cotonetes</p>
              {gabaritoCot === null ? (
                <p className="text-xs text-slate-400 italic">Digite a quantidade real de cotonetes acima para ver o vencedor.</p>
              ) : vencedoresCot.length > 0 ? (
                <div className="space-y-2">
                  {vencedoresCot.map((v, idx) => (
                    <div key={idx} className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-emerald-900 font-black text-sm">🎉 {v.nome}</p>
                        <p className="text-xs text-emerald-700 mt-0.5">Palpite: <strong>{v.palpite} unidades</strong> (Diferença: {v.diff})</p>
                      </div>
                      <span className="text-xl">🥇</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Nenhum palpite registrado para esta brincadeira ainda.</p>
              )}
            </div>

          </div>

        </div>

        {/* Seção de Palpites e Cápsula do Tempo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Bolão */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>🍼</span> Todos os Palpites do Bolão
            </h2>
            {brincadeiras?.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">Nenhum palpite enviado ainda.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {brincadeiras?.map((item) => (
                  <div key={item.id} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-700 text-sm">{item.nome_convidado}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Barriga: <strong className="text-slate-700">{item.circunferencia ? `${item.circunferencia} cm` : "Não opinou"}</strong> | 
                        Cotonetes: <strong className="text-slate-700">{item.cotonetes ?? "Não opinou"}</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cápsula do Tempo */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>⏳</span> Cápsula do Tempo (Mensagens)
              </h2>
              <Link 
                href="/admin/imprimir-capsula" 
                target="_blank"
                className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
              >
                🖨️ Imprimir / PDF
              </Link>
            </div>
            {brincadeiras?.filter(i => i.capsula_mensagem).length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">Nenhuma mensagem na cápsula ainda.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {brincadeiras?.filter(i => i.capsula_mensagem).map((item) => (
                  <div key={item.id} className="bg-amber-50/50 border border-amber-100/60 p-4 rounded-2xl">
                    <p className="font-bold text-slate-700 text-sm mb-1">{item.nome_convidado}</p>
                    <p className="text-xs text-slate-600 italic leading-relaxed">&ldquo;{item.capsula_mensagem}&rdquo;</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
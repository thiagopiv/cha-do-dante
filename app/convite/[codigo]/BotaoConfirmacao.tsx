import { supabase } from "../../../lib/supabase";
import Image from "next/image";
import BotaoConfirmacao from "./BotaoConfirmacao";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ codigo: string }> }): Promise<Metadata> {
  const { codigo } = await params;

  let nomeConvidado = "";
  try {
    const { data: convidado } = await supabase
      .from("convidados")
      .select("nome")
      .eq("codigo_exclusivo", codigo)
      .maybeSingle();

    if (convidado?.nome) {
      nomeConvidado = `, ${convidado.nome}`;
    }
  } catch (e) {
    console.error("Erro ao buscar metadata:", e);
  }

  const title = `Chá do Dante 🧸 - Convite Especial${nomeConvidado}`;
  const description = "Confirme sua presença e escolha o tamanho da fralda!";
  const urlConvite = `https://cha-do-dante.vercel.app/convite/${codigo}`;
  const imageUrl = "https://cha-do-dante.vercel.app/capa-quadrada.jpg";

  return {
    metadataBase: new URL("https://cha-do-dante.vercel.app"),
    title,
    description,
    openGraph: {
      title,
      description,
      url: urlConvite,
      siteName: "Chá do Dante",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: "Chá de Bebê do Dante",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ConviteVIP({ params }: { params: Promise<{ codigo: string }> }) {
  const resolvedParams = await params;
  const codigoLimpo = resolvedParams.codigo;

  const { data: convidado, error } = await supabase
    .from("convidados")
    .select("*")
    .eq("codigo_exclusivo", codigoLimpo)
    .single();

  if (error || !convidado) {
    return (
      <main className="min-h-screen bg-sky-100/70 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-sky-200">
          <span className="text-4xl">😔</span>
          <h1 className="text-xl font-bold text-red-500 mb-2 mt-2">Ops! Convite não encontrado</h1>
          <p className="text-sm text-slate-500">Não encontramos nenhum convite com esse código.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sky-100/70 py-10 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-sky-200 overflow-hidden">
        
        {/* Imagem de Capa */}
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
          
          {/* Saudação com o nome do Convidado */}
          <div className="text-center bg-sky-50 border border-sky-200 p-6 rounded-2xl shadow-sm space-y-2">
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest">
              Com muito Carinho
            </p>
            <p className="text-sm text-slate-600 uppercase tracking-wider">Convidamos você:</p>
            <p className="text-3xl font-black text-sky-950">{convidado.nome}</p>
          </div>

          <p className="text-slate-700 text-base md:text-lg text-center leading-relaxed px-2 font-medium">
            Confirma sua presença no Chá de Bebê do Dante <br/>
            <strong className="text-slate-900 font-bold">Domingo, 08 de Novembro de 2026 às 13h30?</strong>
            <br/>Arapongas - PR
          </p>

          {/* Botões interativos de confirmação */}
          <div className="pt-2">
            <BotaoConfirmacao 
              codigo={convidado.codigo_exclusivo} 
              statusAtual={convidado.status_presenca} 
              numeroMesa={convidado.numero_mesa}
              tamanhoFraldaAtual={convidado.tamanho_fralda} 
            />
          </div>

        </div>
      </div>
    </main>
  );
}
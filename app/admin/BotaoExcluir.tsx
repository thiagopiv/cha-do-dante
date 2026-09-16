"use client";
import { useTransition } from "react";

export default function BotaoExcluir({ id, nome, onDelete }: { id: string, nome: string, onDelete: (formData: FormData) => Promise<void> }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form 
      action={async (formData) => {
        if (window.confirm(`Tem certeza absoluta que deseja remover ${nome}?`)) {
          startTransition(async () => {
            await onDelete(formData);
          });
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit"
        disabled={isPending}
        className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
      >
        {isPending ? "Excluindo..." : "Excluir 🗑️"}
      </button>
    </form>
  );
}
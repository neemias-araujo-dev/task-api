"use client";

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function TaskModal({
  isOpen,
  onClose,
}: TaskModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Nova tarefa
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="titulo"
              className="mb-1 block text-sm font-medium"
            >
              Título
            </label>

            <input
              id="titulo"
              name="titulo"
              type="text"
              required
              className="w-full rounded-md border p-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o título da tarefa"
            />
          </div>

          <div>
            <label
              htmlFor="descricao"
              className="mb-1 block text-sm font-medium"
            >
              Descrição
            </label>

            <textarea
              id="descricao"
              name="descricao"
              rows={4}
              className="w-full resize-none rounded-md border p-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva sua tarefa"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-4 py-2 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Salvar tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useToast, type Toast } from "~/context/toastProvider";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const bgColors = {
    success: "bg-green-900/90 border-green-700",
    error: "bg-red-900/90 border-red-700",
    info: "bg-blue-900/90 border-blue-700",
    warning: "bg-yellow-900/90 border-yellow-700",
  };

  const textColors = {
    success: "text-green-100",
    error: "text-red-100",
    info: "text-blue-100",
    warning: "text-yellow-100",
  };

  const iconColors = {
    success: "text-green-400",
    error: "text-red-400",
    info: "text-blue-400",
    warning: "text-yellow-400",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColors[toast.type]} ${textColors[toast.type]} backdrop-blur-sm animate-in fade-in slide-in-from-right-4 duration-300`}
    >
      <span className={`text-lg font-bold ${iconColors[toast.type]}`}>
        {icons[toast.type]}
      </span>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-75 transition-opacity"
      >
        X
      </button>
    </div>
  );
}

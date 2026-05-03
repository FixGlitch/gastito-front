type ToastType = "success" | "error" | "warning" | "info";

interface ToastOptions {
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

function showToast(options: ToastOptions) {
  const { message, type = "info", duration = 4000 } = options;

  const colors: Record<ToastType, string> = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    warning: "bg-yellow-600 text-white",
    info: "bg-blue-600 text-white",
  };

  const icons: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const container = document.createElement("div");
  container.className = `fixed top-4 right-4 z-50 ${colors[type]} rounded-lg px-4 py-3 shadow-lg max-w-sm animate-slide-in-left`;
  container.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="font-semibold">${icons[type]}</span>
      <p class="text-sm">${message}</p>
    </div>
  `;

  document.body.appendChild(container);

  setTimeout(() => {
    container.style.opacity = "0";
    container.style.transition = "opacity 0.3s";
    setTimeout(() => container.remove(), 300);
  }, duration);
}

export const toast = {
  success: (message: string) => showToast({ message, type: "success" }),
  error: (message: string) => showToast({ message, type: "error" }),
  warning: (message: string) => showToast({ message, type: "warning" }),
  info: (message: string) => showToast({ message, type: "info" }),
};

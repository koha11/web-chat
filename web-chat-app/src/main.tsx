import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // Giữ cache 30 phút, không fetch lại nếu chưa hết hạn
      refetchOnWindowFocus: false, // Không fetch lại khi chuyển tab
      refetchOnReconnect: true, // Không fetch lại khi mất mạng rồi có lại
      refetchOnMount: true, // Fetch lại khi component mount lại
      retry: 2, // Retry API tối đa 2 lần nếu lỗi
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* <Toaster position="top-right" />
      <ToastContainer /> */}
    </QueryClientProvider>
  </StrictMode>
);

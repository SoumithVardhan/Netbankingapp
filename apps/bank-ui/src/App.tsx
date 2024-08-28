import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "./utils/trpc";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Banks } from "./Banks";
import { Appbar } from "./components/Appbar";
import { ConfirmPayment } from "./ConfirmPayment";
import { Success } from "./Success";
import { Error } from "./components/Error";
import { Center } from "./components/Center";
import { Failed } from "./Failed";

export function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_TRPC_SERVER_URL,

          // You can pass any HTTP headers you wish here

          async headers() {
            const token = localStorage.getItem("token");
            const bToken = localStorage.getItem("bToken");
            console.log("Token:", token);  // Debug log
            console.log("Bank Auth Token:", bToken);  // Debug log
            return {
              authorization: "Bearer " + localStorage.getItem("token"),
              "x-bankAuth-token": "Bearer " + localStorage.getItem("bToken"),
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* Your app here */}
        <BrowserRouter>
          <Appbar />
          <Routes>
            <Route path="/banks" element={<Banks />} />{" "}
            {/* 👈 Renders at /app/ */}
            <Route path="/confirm" element={<ConfirmPayment />} />{" "}
            {/* 👈 Renders at /app/ */}
            <Route path="/success" element={<Success />} />{" "}
            {/* 👈 Renders at /app/ */}
            <Route path="/failed" element={<Failed />} />{" "}
            {/* 👈 Renders at /app/ */}
            <Route
              path="*"
              element={
                <Center>
                  <Error msg={"Not authorized to view this page."} />
                </Center>
              }
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
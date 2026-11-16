import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import Home from "./pages/Home";
import SceneBackground from "./pages/SceneBackground";
import Fog from "./pages/Fog";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scene-background" element={<SceneBackground />} />
          <Route path="/fog" element={<Fog />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import GlobalStyle from "./components/GlobalStyle/GlobalStyle";
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalStyle>
      <AppProvider>
        <App />
      </AppProvider>
    </GlobalStyle>
  </StrictMode>
);

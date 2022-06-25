//import logo from "./logo.svg";
import Alert from "./Components/Alert";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import CoinPage from "./Pages/CoinPage";
import Homepage from "./Pages/Homepage";

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          backgroundColor: "#efeae3", //14161a
          minHeight: "100vh",
          color: "#361848",
        }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} exact />
          <Route path="/coins/:id" element={<CoinPage />} exact />
        </Routes>
      </div>
      <Alert />
    </BrowserRouter>
  );
}

export default App;

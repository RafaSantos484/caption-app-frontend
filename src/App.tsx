import { BrowserRouter, Route, Routes } from "react-router-dom";
import AttachFile from "./views/attach_file";

import "./globals.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AttachFile />} path="/" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

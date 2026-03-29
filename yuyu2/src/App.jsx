import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  FrontPage,
  Oficial,
  Fanon,
  FrontImages,
  Sprites,
  Mangas,
  FanArts,
  PostFanArt,
  CreateAccount,
  ValidateUser,
  Login,
  ChangePassword,
} from "@features";
import "./App.css";
function App() {
  return (
    <div className="body">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FrontPage />}></Route>
          <Route path="/oficial" element={<Oficial></Oficial>}></Route>
          <Route path="/fanon" element={<Fanon></Fanon>}></Route>
          <Route path="/images" element={<FrontImages></FrontImages>}></Route>
          <Route path="/sprites" element={<Sprites></Sprites>}></Route>
          <Route path="/mangas" element={<Mangas></Mangas>}></Route>
          <Route path="/fanArts" element={<FanArts></FanArts>}></Route>
          <Route path="/fanArts/Post" element={<PostFanArt />} />
          <Route path="/auth/create" element={<CreateAccount />} />
          <Route path="/auth/validate" element={<ValidateUser />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/changePassword" element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

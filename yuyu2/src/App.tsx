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
  AccountConfig,
  ToValidateFanArts,
  ValidateFanArts
} from "@features";
import "./i18n";
import "./App.css";
function App() {
  return (
    <div className="body">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FrontPage />}></Route>
          <Route path="/oficial" element={<Oficial />}></Route>
          <Route path="/fanon" element={<Fanon />}></Route>
          <Route path="/images" element={<FrontImages />}></Route>
          <Route path="/sprites" element={<Sprites />}></Route>
          <Route path="/mangas" element={<Mangas />}></Route>
          <Route path="/fanArts" element={<FanArts />}></Route>
          <Route path="/fanArts/Post" element={<PostFanArt />} />
          <Route path="/fanArts/toValidate" element={<ToValidateFanArts />} />
          <Route path="/fanArts/validatePost" element={<ValidateFanArts />} />
          <Route path="/auth/create" element={<CreateAccount />} />
          <Route path="/auth/validate" element={<ValidateUser />} />


          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/changePassword" element={<ChangePassword />} />
          <Route path="/auth/accountConfig" element={<AccountConfig />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

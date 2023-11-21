import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Gab from './gab';
import LogInPage from './pages/login';
import SignUpPage from './pages/signup';
import Alert from './component/Alert';
import VerifyAccount from './pages/verify-account';
import NoData from './component/NoData';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        
        <Alert />
        <Routes>
          <Route path='/login' element={<LogInPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/verify-account/:token' element={<VerifyAccount />} />
          <Route path='/app/*' element={<Gab />} />
          <Route path='*' element={<NoData page={true} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

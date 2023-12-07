import { lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Alert from './component/Alert';
import SuspenseLoading from './component/suspense';
// import Gab from './gab';
// import LogInPage from './pages/login';
// import SignUpPage from './pages/signup';
// import VerifyAccount from './pages/verify-account';
// import NoData from './component/NoData';
const Gab = lazy(() => import('./gab'));
const LogInPage = lazy(() => import('./pages/login'));
const SignUpPage = lazy(() => import('./pages/signup'));
const VerifyAccount = lazy(() => import('./pages/verify-account'));
const NoData = lazy(() => import('./component/NoData'));

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        
        <Alert />
        <Routes>
          <Route path='/login' element={
            <Suspense fallback={<SuspenseLoading />}><LogInPage /></Suspense>
          } />

          <Route path='/signup' element={
            <Suspense fallback={<SuspenseLoading />}><SignUpPage /></Suspense>
          } />

          <Route path='/verify-account/:token' element={
            <Suspense fallback={<SuspenseLoading />}><VerifyAccount /></Suspense>
          } />

          <Route path='/app/*' element={
            <Suspense fallback={<SuspenseLoading />}><Gab /></Suspense>
          } />

          <Route path='*' element={
            <Suspense fallback={<SuspenseLoading />}><NoData page={true} /></Suspense>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider } from './context/AppContext';

const Explore = lazy(() => import('./pages/Explore'));
const Home = lazy(() => import('./pages/Home'));
const Result = lazy(() => import('./pages/Result'));
const Review = lazy(() => import('./pages/Review'));
const Survey = lazy(() => import('./pages/Survey'));
const Safeguard = lazy(() => import('./pages/Safeguard'));

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="grid min-h-[60vh] place-items-center text-sm text-slate-500">正在打开你的决策空间…</div>}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/result" element={<Result />} />
              <Route path="/review" element={<Review />} />
              <Route path="/safeguard" element={<Safeguard />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
}

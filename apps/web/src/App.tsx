import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider } from './context/AppContext';
import Explore from './pages/Explore';
import Home from './pages/Home';
import Result from './pages/Result';
import Review from './pages/Review';
import Survey from './pages/Survey';
import Safeguard from './pages/Safeguard';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AppProvider>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BackToTop } from './components/ui/BackToTop';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { BlogPage } from './components/pages/BlogPage';
import BlogPost from './components/pages/BlogPost';
import { ContactPage } from './components/pages/ContactPage';
import { AppointmentPage } from './components/pages/AppointmentPage';
import { PublicationsPage } from './components/pages/PublicationsPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about-me" element={<AboutPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/before-and-after" element={<GalleryPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          <Route path="/reach-me" element={<ContactPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <BackToTop />
    </BrowserRouter>
  );
}

export default App;

import Navbar from '@/components/NavBar/NavBar';
import Background from "@/components/Background/Background";
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Projects from '@/components/Projects/Projects';
import Experience from '@/components/Experience/Experience';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
//import UnderConstruction from '@/components/UnderConstruction/UnderConstruction';
// import {Section} from './components/Section';
export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col height-full">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
      <Background />
    </div>
  );
}

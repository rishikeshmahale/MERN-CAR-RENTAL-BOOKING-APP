import Hero from "../components/Hero.jsx";
import FeaturedSection from "../components/FeaturedSection.jsx";
import Banner from "../components/Banner.jsx";
import Testimonial from "../components/Testimonial.jsx";
import NewsLetter from "../components/NewsLetter.jsx";
import Footer from "../components/Footer.jsx";

const Home = () => {
  return (
    <div>
        <Hero />
        <FeaturedSection />
        <Banner />
        <Testimonial/>
        <NewsLetter/>
        <Footer/>
    </div>
  )
}

export default Home;
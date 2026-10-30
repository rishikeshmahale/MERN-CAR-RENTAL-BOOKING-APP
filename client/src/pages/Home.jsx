import Hero from "../components/Hero.jsx";
import FeaturedSection from "../components/FeaturedSection.jsx";
import Banner from "../components/Banner.jsx";
import Testimonial from "../components/Testimonial.jsx";

const Home = () => {
  return (
    <div>
        <Hero />
        <FeaturedSection />
        <Banner />
        <Testimonial/>
    </div>
  )
}

export default Home;
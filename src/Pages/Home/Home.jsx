import React from "react";
import HomeNavbar from "../../Components/HomeNavbar/HomeNavbar.jsx";
import Banner from "../../Components/Banner/Banner.jsx";
import Brand from "../../Components/Brand/Brand.jsx";
import Deals from "../../Components/Deals/Deals.jsx";
import NewArrival from "../../Components/NewArrival/NewArrival.jsx";
import Blinder from "../../Components/Blinder/Blinder.jsx";
import FollowUs from "../../Components/FollowUs/FollowUs.jsx";
import Testimonial from "../../Components/Testimonial/Testimonial.jsx";
import ShoppingCardDrawer from "../../Components/shoppingCardDrawer/shoppingCardDrawer.jsx";
import Footer from "../../Components/Footer/Footer.jsx";
const Home = () => {
  return (
    <div>
      {/* Home page Navbar */}
      <HomeNavbar />

      {/* banner */}
      <div>
        <Banner />
      </div>

      {/* brand */}
      <div>
        <Brand />
      </div>

      {/* deals */}
      <div>
        <Deals />
      </div>
      {/* arrivals */}
      <div>
        <NewArrival />
      </div>

      {/* blinder */}
      <div>
        <Blinder />
      </div>

      {/* follow us */}
      <div>
        <FollowUs />
      </div>

      <div>
        <Testimonial />
      </div>
      <ShoppingCardDrawer />
    </div>
  );
};

export default Home;

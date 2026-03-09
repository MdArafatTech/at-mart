import { Outlet } from "react-router-dom";
import Footer from "../component/Footer";
import Header from "../component/Header";
import ScrolltoTop from "../component/ScrolltoTop";
import PageMeta from "../component/PageMeta";
import ScrollTopButton from "../component/ScrollTopButton";


const Root = () => {
  return (
    <div>
      <ScrolltoTop></ScrolltoTop>
     
      <PageMeta></PageMeta>
      <ScrollTopButton></ScrollTopButton>
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default Root;

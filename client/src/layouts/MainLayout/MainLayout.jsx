import Header from "../components/Header/Header";
import SubcribeFooter from "../components/SubscribeFooter/SubcribeFooter";
import Footer from "../components/Footer/Footer";

function MainLayout({ children }) {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">{children}</div>
      <SubcribeFooter />
      <Footer />
    </div>
  );
}

export default MainLayout;

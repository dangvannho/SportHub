import Header from "../components/Header/Header";
import SubcribeFooter from "../components/SubscribeFooter/SubcribeFooter";
import Footer from "../components/Footer/Footer";

import "./MainLayout.scss";

function MainLayout({ children }) {
  return (
    <>
      <Header />
      <div className="page-content">{children}</div>
      <SubcribeFooter />
      <Footer />
    </>
  );
}

export default MainLayout;

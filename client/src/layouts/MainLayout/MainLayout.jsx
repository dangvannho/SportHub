import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

import "./MainLayout.scss";

function MainLayout({ children }) {
  return (
    <>
      <Header />
      <div className="page-content">{children}</div>
      <Footer />
    </>
  );
}

export default MainLayout;

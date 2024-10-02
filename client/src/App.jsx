import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import publicRoutes from "./routes/routes";
import MainLayout from "./layouts/MainLayout/MainLayout";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((item, index) => {
            let Layout = MainLayout;
            return (
              <Route
                key={index}
                path={item.path}
                element={
                  <Layout>
                    <item.component />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

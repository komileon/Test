import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Test from "./features/errors/pages/Test";
import NotFoundPage from "./pages/NotFoundPage";
import EditingPage from "./features/blogEdit/pages/EditingPage";
import EditingHomePage from "./features/blogEdit/pages/EditingHomePage";

function App() {
  return (
    <>
      <Routes>
        {/* Home Page */}
        <Route index element={<Home />} />

        {/* Test Page */}
        <Route path="test" element={<Test />} />

        {/* Editing Page */}

        <Route path="editing">
          <Route index element={<NotFoundPage />} />
          <Route path="saved" element={<EditingHomePage />} />
          <Route path="p/:id/edit" element={<EditingPage />} />
        </Route>

        {/* Page not found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;

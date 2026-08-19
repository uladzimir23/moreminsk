import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { COLLECTIONS } from "./lib/collections";
import { useAuth } from "./lib/auth";
import { CollectionEdit } from "./pages/CollectionEdit";
import { CollectionList } from "./pages/CollectionList";
import { Bookings } from "./pages/Bookings";
import { Leads } from "./pages/Leads";
import { Login } from "./pages/Login";
import type { ReactNode } from "react";

function Protected({ children }: { children: ReactNode }) {
  const { email } = useAuth();
  return email ? <>{children}</> : <Navigate to="/login" replace />;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<Navigate to={`/c/${COLLECTIONS[0].name}`} replace />} />
        <Route path="c/:name" element={<CollectionList />} />
        <Route path="c/:name/new" element={<CollectionEdit />} />
        <Route path="c/:name/:id" element={<CollectionEdit />} />
        <Route path="leads" element={<Leads />} />
        <Route path="bookings" element={<Bookings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

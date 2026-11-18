import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import ProtectedRoute from "./Routes/ProtectedRoute";
import AppLayout from "./AppLayout/Applayout";
import Login from "./Pages/Login";
import { AuthProvider } from "./context/AuthContext";
import AddProperty from "./forms/AddProperty";
import Signup from "./forms/Signup";
import OwnerMyListing from "./components/OwnerMyListing";
import UpdateProperty from "./components/UpdateProperty";
import HomePage from "./Pages/HomePage";
import OwnerDashboard from "./Pages/OwnerDashboard";
import PropertyDetail from "./components/PropertyDetail";
import BookingPage from "./Pages/BookingPage";
import MyBookingsPage from "./Pages/MyBookingsPage";
import OwnerBookingDashboard from "./components/OwnerBookingDashboard";
import Accommodations from "./Pages/Accommodations";
import NotFound from "./components/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      // ─── Public Routes ───────────────────────────────────────────
      { index: true, element: <HomePage /> },
      { path: "accommodations", element: <Accommodations /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "property/:id", element: <PropertyDetail /> },

      // ─── Owner Routes ─────────────────────────────────────────────
      {
        path: "owner",
        element: (
          <ProtectedRoute userRole="OWNER">
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <OwnerDashboard /> },
          { path: "addProperty", element: <AddProperty /> },
          { path: "browse", element: <OwnerMyListing /> },
          { path: "bookings", element: <OwnerBookingDashboard /> },
          { path: "update/property/:id", element: <UpdateProperty /> },
        ],
      },

      // ─── Tenant Routes ────────────────────────────────────────────
      {
        path: "tenant",
        element: (
          <ProtectedRoute userRole="TENANT">
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: "my-bookings", element: <MyBookingsPage /> },
        ],
      },

      // ─── Booking Routes ───────────────────────────────────────────
      {
        path: "booking",
        element: (
          <ProtectedRoute userRole="TENANT">
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: ":propertyId", element: <BookingPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;

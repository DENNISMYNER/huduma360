import { useState } from "react";
import { Outlet } from "react-router-dom";
import DemoBanner from "../components/layout/DemoBanner";
import Navbar from "../components/layout/Navbar";
import MobileDrawer from "../components/layout/MobileDrawer";
import Footer from "../components/layout/Footer";
import ToastStack from "../components/layout/ToastStack";

export default function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <DemoBanner />
      <Navbar onOpenDrawer={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main id="mainContent">
        <Outlet />
      </main>

      <Footer />
      <ToastStack />
    </>
  );
}

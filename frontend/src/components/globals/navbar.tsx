import {  LayoutDashboard, Home, PlusIcon } from "lucide-react";
import { FloatingNav } from "../ui/floating-navbar";

const Navbar = () => {
  return (
    <FloatingNav
      navItems={[
        {
          name: "Home",
          link: "/",
          icon: <Home size={24} />,
        },
        {
          name: "DashBoard",
          link: "/dashboard",
          icon: <LayoutDashboard size={24} />,
              },
        {
          name: "Create Form",
          link: "/form-builder",
          icon: <PlusIcon size={24} />,
              },
      ]}
    />
  );
};

export default Navbar;

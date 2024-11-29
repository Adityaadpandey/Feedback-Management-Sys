import { Contact, Home } from "lucide-react";
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
          name: "About",
          link: "/about",
        },
        {
          name: "Contact",
          link: "/contact",
          icon: <Contact size={24} />,
        },
      ]}
    />
  );
};

export default Navbar;

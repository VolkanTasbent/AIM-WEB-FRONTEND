import React, { useState } from "react";
import "../App.css";

const Navbar = () => {
  const [active, setActive] = useState("Home");

  return (
    <header className="navbar">
      <div className="logo">AIM AGENCY</div>
      <nav>
        {["Home", "Works", "References", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className={active === item ? "active" : ""}
            onClick={() => setActive(item)}
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  // ✅ Tự động lấy chiều cao navbar
  useEffect(() => {
    const navbar = document.getElementById("main-navbar");
    if (navbar) {
      const updateHeight = () => {
        const height = navbar.offsetHeight;
        setNavHeight(height);
        document.documentElement.style.setProperty("--navbar-height", `${height}px`);
      };
      updateHeight();
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }
  }, []);

  const scrollToSection = (id) => {
  navigate("/");
  setTimeout(() => {
    const section = document.getElementById(id);
    if (section) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const targetScroll = sectionTop - navHeight;

      window.scrollTo({
        top: targetScroll < 0 ? 0 : targetScroll, // tránh scroll âm
        behavior: "smooth",
      });
    }
  }, 300);
  setMenuOpen(false);
};



  return (
    <nav
      id="main-navbar"
      className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-md transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* ✨ Logo */}
        <h1
          onClick={() => scrollToSection("home_pic")}
          className="text-lg sm:text-2xl font-bold text-zinc-900 cursor-pointer select-none whitespace-nowrap"
        >
          ✨ Nails by Oni
        </h1>

        {/* 🖥 Desktop menu */}
        <div className="hidden sm:flex space-x-6">
          <button
            onClick={() => scrollToSection("home_pic")}
            className="text-zinc-900 transition font-medium"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-zinc-900  transition font-medium"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className="text-zinc-900 transition font-medium"
          >
            Service
          </button>
          <button
            onClick={() => scrollToSection("gallery")}
            className="text-zinc-900 hover:text-pink-600transition font-medium"
          >
            Gallery
          </button>
        </div>

        {/* 📱 Mobile menu toggle */}
        <button
          className="sm:hidden p-2 rounded-md transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X className="h-6 w-6 text-zinc-900" />
          ) : (
            <Menu className="h-6 w-6 text-zinc-900" />
          )}
        </button>
      </div>

      {/* 📱 Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-white/95 backdrop-blur-md border-t shadow-md animate-slideDown">
          <div className="flex flex-col items-center py-4 space-y-3">
            <button
              onClick={() => scrollToSection("home_pic")}
              className="text-gray-800 font-medium transition"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-800  font-medium transition"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-gray-800  font-medium transition"
            >
              Service
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="text-gray-800  font-medium transition"
            >
              Gallery
            </button>
          </div>
        </div>
      )}

      {/* 🔧 Animation CSS */}
      <style>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-in-out;
        }
      `}</style>
    </nav>
  );
}

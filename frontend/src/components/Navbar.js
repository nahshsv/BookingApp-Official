import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // ✅ Lấy chiều cao navbar khi resize
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

  // ✅ Theo dõi scroll, fix bug border & giữ navbar luôn hiện
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 10) {
        // Khi ở đầu trang → trong suốt, không border
        setIsScrolled(false);
      } else {
        // Khi cuộn xuống → có blur và border
        setIsScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Cuộn mượt đến section
  const scrollToSection = (id) => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const targetScroll = sectionTop - navHeight;
        window.scrollTo({
          top: targetScroll < 0 ? 0 : targetScroll,
          behavior: "smooth",
        });
      }
    }, 300);
    setMenuOpen(false);
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/45 backdrop-blur-xl border-b border-white/10 shadow-sm"
          : "bg-transparent backdrop-blur-none border-none shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* ✨ Logo */}
        <h1
          onClick={() => scrollToSection("home_pic")}
          className={`text-lg sm:text-2xl font-bold cursor-pointer select-none whitespace-nowrap transition-colors duration-300 ${
            isScrolled ? "text-zinc-900" : "text-white drop-shadow"
          }`}
        >
          ✨ Nails by Jessie
        </h1>

        {/* 🖥 Desktop menu */}
        <div className="hidden sm:flex space-x-6">
          {["home_pic", "about", "services", "gallery"].map((id, index) => {
            const labels = ["Home", "About", "Service", "Gallery"];
            return (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`transition font-medium ${
                  isScrolled
                    ? "text-zinc-900 hover:text-amber-600"
                    : "text-white hover:text-amber-300"
                }`}
              >
                {labels[index]}
              </button>
            );
          })}
        </div>

        {/* 📱 Mobile menu toggle */}
        <button
          className="sm:hidden p-2 rounded-md transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X
              className={`h-6 w-6 transition ${
                isScrolled ? "text-zinc-900" : "text-white"
              }`}
            />
          ) : (
            <Menu
              className={`h-6 w-6 transition ${
                isScrolled ? "text-zinc-900" : "text-white"
              }`}
            />
          )}
        </button>
      </div>

      {/* 📱 Mobile dropdown */}
      {menuOpen && (
        <div
          className={`sm:hidden border-t animate-slideDown ${
            isScrolled
              ? "bg-white/90 backdrop-blur-md shadow-md"
              : "bg-zinc-900/80 backdrop-blur-lg"
          }`}
        >
          <div className="flex flex-col items-center py-4 space-y-3">
            {["home_pic", "about", "services", "gallery"].map((id, index) => {
              const labels = ["Home", "About", "Service", "Gallery"];
              return (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`font-medium transition ${
                    isScrolled
                      ? "text-zinc-800 hover:text-amber-600"
                      : "text-white hover:text-amber-300"
                  }`}
                >
                  {labels[index]}
                </button>
              );
            })}
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

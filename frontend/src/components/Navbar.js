import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

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

  // ✅ Theo dõi scroll (mượt hơn, không flicker)
  useEffect(() => {
    if (location.pathname === "/client") {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // ✅ Cuộn mượt đến section
  const scrollToSection = (id) => {
    if (location.pathname !== "/") navigate("/");

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

  const menuItems = [
    { id: "home_pic", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Service" },
    { id: "gallery", label: "Gallery" },
    { id: "reviews", label: "Review" },
  ];

  // 🎨 Style logic
  const isClientPage = location.pathname === "/client";
  const baseBg =
    isClientPage || isScrolled
      ? isClientPage
        ? "bg-white shadow-md"
        : "bg-white/60 backdrop-blur-lg shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
      : "bg-transparent";

  const baseTransition =
    "transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]";

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 ${baseBg} ${baseTransition}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* ✨ Logo */}
        <h1
          onClick={() => scrollToSection("home_pic")}
          className={`text-lg sm:text-2xl font-bold cursor-pointer select-none whitespace-nowrap transition-colors duration-500 ${
            isScrolled || isClientPage ? "text-zinc-900" : "text-white drop-shadow"
          }`}
        >
          ✨ Nails by Jessie
        </h1>

        {/* 🖥 Desktop menu */}
        <div className="hidden sm:flex space-x-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`transition font-medium duration-300 ${
                isScrolled || isClientPage
                  ? "text-zinc-900"
                  : "text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 📱 Mobile toggle */}
        <button
          className="sm:hidden p-2 rounded-md transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X
              className={`h-6 w-6 transition ${
                isScrolled || isClientPage ? "text-zinc-900" : "text-white"
              }`}
            />
          ) : (
            <Menu
              className={`h-6 w-6 transition ${
                isScrolled || isClientPage ? "text-zinc-900" : "text-white"
              }`}
            />
          )}
        </button>
      </div>

      {/* 📱 Mobile dropdown */}
      {menuOpen && (
        <div
          className={`sm:hidden border-t animate-slideDown ${
            isScrolled || isClientPage
              ? "bg-white/95 backdrop-blur-md shadow-md"
              : "bg-zinc-900/80 backdrop-blur-lg"
          }`}
        >
          <div className="flex flex-col items-center py-4 space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium transition ${
                  isScrolled || isClientPage
                    ? "text-zinc-800 hover:text-amber-600"
                    : "text-white hover:text-amber-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🔧 Animation */}
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

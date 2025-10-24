import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { motion } from "framer-motion";

export default function HomePage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [index, setIndex] = useState(-1);
  const [currentIndex, setCurrentIndex] = useState(0);
  //Comment section
  const [comments, setComments] = useState([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 3;

useEffect(() => {
  fetch("http://localhost:5000/comments")
    .then((res) => res.json())
    .then((data) => setComments(data));
}, []);
  // Service data
  const services = [
    {
      title: "Nails 💅",
      duration: "30 min",
      price: "$40",
      description:
        "Professional manicure with cuticle care, shaping, and polish. Choose your favorite color or bring your own design idea.",
    },
    {
      title: "Pedicure 🦶",
      duration: "45 min",
      price: "$30",
      description:
        "Relaxing foot soak, exfoliation, nail trimming, and polish. Great for rejuvenating tired feet.",
    },
    {
      title: "Eyebrows ✨",
      duration: "15 min",
      price: "$10",
      description:
        "Quick eyebrow shaping and grooming for a clean, natural look that enhances your face.",
    },
  ];

  // Toggle service card open
  const toggleService = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const images = [
    "/pics/dump7.jpg",
    "/pics/dump2.jpg",
    "/pics/dump3.jpg",
    "/pics/dump4.jpg",
    "/pics/dump5.jpg",
    "/pics/dump9.jpg",
  ];

  return (
    <div className="relative">
  {/* 🌸 Hero Section */}
  <section
    id="home_pic"
    className="relative flex flex-col items-center justify-center text-white text-center h-screen overflow-hidden"
  >
    {/* 🎥 Responsive video background */}
    <video
      className="absolute inset-0 w-full h-full object-cover object-center"
      src="/videos/herovid.mp4"
      autoPlay
      loop
      muted
      playsInline
      style={{
        objectPosition: "center 40%",
      }}
    />

    {/* 🌫 Overlay gradient for readability */}
    <div className="absolute inset-0 bg-black/50"></div>

    {/* 🌸 Hero Content */}
    <div className="relative z-10 px-4 sm:px-8 md:px-10 max-w-4xl text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 drop-shadow-2xl leading-tight tracking-tight">
        Nails That Tell Your Story
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md">
        From classic to creative — every design is made with love & care.
      </p>
       <div className="mt-12 flex justify-center">
  <button
    onClick={() => navigate("/client")}
    className="px-8 py-3 sm:px-10 sm:py-4 bg-zinc-100 text-zinc-900 font-semibold text-lg sm:text-xl rounded-xl shadow-md border border-zinc-300 hover:bg-zinc-100 hover:scale-105 hover:shadow-lg transition-all duration-300"
  >
    Book Appointment
  </button>
</div>

    </div>
  </section>



{/* 💖 About Jessie - Responsive Presentation Style */}
 <section
      id="about"
      className="bg-[#18181B] flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-16 lg:px-28 min-h-screen overflow-hidden"
    >
      {/* LEFT SIDE - TEXT */}
      <motion.div
        className="text-amber-100 flex-1 max-w-2xl space-y-4 sm:space-y-6 text-center md:text-left pt-10 sm:pt-16 md:pt-0"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <p className="text-xs sm:text-sm tracking-widest uppercase text-gray-400">
          Creative Nail Artist
        </p>

        <h1
          className="font-extrabold tracking-tight text-[2.5rem] sm:text-[3.5rem] md:text-[6rem] lg:text-[7rem] leading-[0.9]"
          style={{ letterSpacing: "-1px" }}
        >
          JESSIE
          <br />
          NGUYEN
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-lg mx-auto md:mx-0">
          A certified nail technician and creative designer based in Fort Worth,
          TX. Jessie believes every nail design is a form of self-expression —
          blending elegance, precision, and a spark of personality. ✨
        </p>

        <p className="text-gray-400 italic text-xs sm:text-sm">
          “Beauty begins the moment you decide to express yourself.” 💅
        </p>
      </motion.div>

      {/* RIGHT SIDE - IMAGE */}
      <motion.div
        className="flex-1 flex justify-center md:justify-end items-end md:items-center mt-10 md:mt-0 relative"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }} // 👈 cùng thời gian, không delay
        viewport={{ once: true }}
      >
        <img
          src="/pics/OniBlack.png"
          alt="Oni portrait"
          className="w-[80%] sm:w-[70%] md:w-[85%] lg:w-[85%] max-w-[600px] object-contain md:object-cover drop-shadow-xl"
          style={{
            filter: "brightness(1) contrast(1.05)",
          }}
        />
      </motion.div>
    </section>






      {/* 💅 Services Section */}
      <section
        id="services"
        className="py-14 sm:py-20 bg-zinc-100 text-center flex flex-col items-center"
      >
        <h2 className="text-2xl sm:text-4xl font-bold mb-5 text-zinc-900">
          Services
        </h2>
          <p className="text-gray-500 text-base mb-8">
          Select your preferred beauty service crafted with care and precision.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 sm:px-8 items-start w-full">
          {services.map((s, index) => (
            <div
              key={index}
              onClick={() => toggleService(index)}
              className={`bg-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl cursor-pointer transition-all duration-500 ease-in-out w-full max-w-sm mx-auto ${
                openIndex === index
                  ? "ring-2 ring-zinc-900 scale-[1.03]"
                  : "ring-0 scale-100"
              }`}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-900">
                {s.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {s.duration} • {s.price}
              </p>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? "max-h-40 mt-3 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 📸 Gallery Section */}
      <section
        id="gallery"
        className="py-14 sm:py-20 bg-zinc-100 text-center"
      >
        <h2 className="text-2xl sm:text-4xl font-bold mb-5 text-zinc-900">
          Gallery
        </h2>
          <p className="text-gray-500 text-base mb-8">
          Explore some of our favorite nail designs crafted with passion 
        </p>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-8">
  <div className="block sm:hidden">
  <div className="relative overflow-hidden rounded-2xl">
    <div
      className="flex transition-transform duration-500 ease-out will-change-transform"
      style={{ transform: `translate3d(-${currentIndex * 100}%,0,0)` }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative w-full basis-full shrink-0">
          {/* Khung tỉ lệ cố định: đổi 4/3 -> 3/2 hoặc 16/9 tùy bạn muốn ít crop hơn */}
          <div className="relative w-full aspect-[4/3]">
            <img
              src={src}
              alt={`Nail design ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover block select-none"
              onClick={() => setIndex(i)}
              draggable={false}
            />
          </div>
        </div>
      ))}
    </div>

    {/* Buttons */}
    <button
      onClick={() =>
        setCurrentIndex((p) => (p === 0 ? images.length - 1 : p - 1))
      }
      className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
    >
      ‹
    </button>
    <button
      onClick={() =>
        setCurrentIndex((p) => (p === images.length - 1 ? 0 : p + 1))
      }
      className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
    >
      ›
    </button>
  </div>
</div>



  {/* Desktop Grid */}
  <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-6">
    {images.map((src, i) => (
      <div
        key={i}
        className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer"
        onClick={() => setIndex(i)}
      >
        <img
          src={src}
          alt={`Nail design ${i + 1}`}
          className="w-full h-52 sm:h-64 object-cover transform group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <p className="text-white font-medium text-lg sm:text-xl">
            View Design ✨
          </p>
        </div>
      </div>
    ))}
  </div>
</div>


        <Lightbox
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          slides={images.map((src) => ({ src }))}
          plugins={[Thumbnails]}
        />
      </section>

      {/* 💬 Customer Reviews Section */}
<section id="reviews" className="py-14 sm:py-20 bg-zinc-100 text-center">
  <h2 className="text-2xl sm:text-4xl font-bold mb-5 text-zinc-900">
    Customer Reviews
  </h2>
  <p className="text-gray-500 text-base mb-8">
    Share your experience with our nail service 
  </p>

  {/* Comments List with Pagination */}
  <div className="max-w-2xl mx-auto space-y-4 px-4">
    {comments.length === 0 ? (
      <p className="text-gray-400">No reviews yet. Be the first to share!</p>
    ) : (
      comments
        .slice((currentPage - 1) * commentsPerPage, currentPage * commentsPerPage)
        .map((c, i) => (
          <div
            key={i}
            className="bg-zinc-200 p-5 rounded-2xl text-left shadow-sm"
          >
            <p className="text-gray-800 text-base break-words">{c.message}</p>
            <div className="mt-3 text-sm text-gray-500 flex justify-between flex-wrap">
              <span className="italic">— {c.name}</span>
              <span className="text-right">
                {new Date(c.date).toLocaleString()}
              </span>
            </div>
          </div>
        ))
    )}
  </div>

  {/* Pagination Controls */}
  {comments.length > commentsPerPage && (
    <div className="flex justify-center mt-6 gap-2">
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        className="px-3 py-1 rounded-lg border text-sm text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition disabled:opacity-50"
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {Array.from({ length: Math.ceil(comments.length / commentsPerPage) }).map(
        (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-lg text-sm transition ${
              currentPage === i + 1
                ? "bg-[#18181B] text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {i + 1}
          </button>
        )
      )}
      <button
        onClick={() =>
          setCurrentPage((p) =>
            Math.min(p + 1, Math.ceil(comments.length / commentsPerPage))
          )
        }
        className="px-3 py-1 rounded-lg border text-sm text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition disabled:opacity-50"
        disabled={
          currentPage === Math.ceil(comments.length / commentsPerPage)
        }
      >
        Next
      </button>
    </div>
  )}

  {/* Toggle Add Review Button */}
  <div className="mt-10">
    {!showForm ? (
      <button
        onClick={() => setShowForm(true)}
        className="px-6 py-2 bg-[#18181B] text-white font-semibold rounded-lg shadow-md transition"
      >
        Post a Review
      </button>
    ) : (
      <button
        onClick={() => setShowForm(false)}
        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md transition"
      >
        Cancel
      </button>
    )}
  </div>

  {/* Review Form (hidden until toggled) */}
  {showForm && (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!reviewName || !reviewMessage) return;

        try {
          const res = await fetch("http://localhost:5000/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: reviewName,
              message: reviewMessage,
            }),
          });

          if (!res.ok) throw new Error("Failed to post review");

          const data = await res.json();
          setComments([data, ...comments]);
          setReviewName("");
          setReviewMessage("");
          setShowForm(false);
          setCurrentPage(1);
        } catch (err) {
          console.error("Error posting review:", err);
        }
      }}
      className="max-w-lg mx-auto mt-8 bg-zinc-50 rounded-2xl shadow-md p-6 text-left px-4 sm:px-6"
    >
      <h3 className="text-lg font-semibold mb-4 text-zinc-800">
        Leave a review
      </h3>
      <input
        type="text"
        placeholder="Your name"
        value={reviewName}
        onChange={(e) => setReviewName(e.target.value)}
        className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#18181B]"
      />
      <textarea
        placeholder="Write your review..."
        value={reviewMessage}
        onChange={(e) => setReviewMessage(e.target.value)}
        className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#18181B]"
        rows="4"
      />
      <button
        type="submit"
        className="w-full bg-[#18181B] text-white font-semibold py-2 rounded-lg transition"
      >
        Post Review
      </button>
    </form>
  )}
</section>


    </div>
  );
}

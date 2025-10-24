export default function Footer() {
  return (
    <footer className="bg-[#18181B] text-white pt-12 pb-6">
      {/* Grid 3 cột */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center md:text-left place-items-center">
        {/* 🔹 Cột 1: Google Map */}
        <div className="rounded-xl overflow-hidden shadow-md border border-gray-700 w-[90%] md:w-[80%]">
          <iframe
            title="Google Map - Bing Grace Nails"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6712.241707287895!2d-97.4290957254962!3d32.7359814736807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e733abba9d9f1%3A0x44d2264abffd0013!2s2512%20Ridgmar%20Blvd%2C%20Fort%20Worth%2C%20TX%2076116!5e0!3m2!1sen!2sus!4v1760473880420!5m2!1sen!2sus"
            width="100%"
            height="220"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* 🔹 Cột 2: Thông tin liên hệ */}
        <div className="flex flex-col items-start text-left">
          <h3 className="text-2xl font-semibold mb-4 text-gray-300">
            <a href="/admin-login">Nails by Oni</a>
          </h3>
          <ul className="space-y-2 text-gray-300 text-base">
            <li>📍 2512 Ridgmar Blvd, Fort Worth, TX 76116</li>
            <li>📞 (123) 456-7890</li>
            <li>📧 binggracenails@gmail.com</li>
            <li>🕒 Mon - Sat: 9:00 AM – 7:00 PM</li>
          </ul>
        </div>

        {/* 🔹 Cột 3: Social Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-2xl font-semibold mb-4 text-gray-300">Follow Us</h3>
          <div className="flex gap-5 text-2xl">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 p-3 rounded-full hover:bg-amber-500/30 transition"
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 p-3 rounded-full hover:bg-amber-500/30 transition"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="tel:+11234567890"
              className="bg-white/10 p-3 rounded-full hover:bg-amber-500/30 transition"
            >
              <i className="fas fa-phone"></i>
            </a>
            <a
              href="mailto:binggracenails@gmail.com"
              className="bg-white/10 p-3 rounded-full hover:bg-amber-500/30 transition"
            >
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>

      {/* 🔸 Dòng bản quyền */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-700 text-center">
        <p className="text-gray-400 text-sm sm:text-base tracking-wide">
          © {new Date().getFullYear()} Nails by Jessie. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

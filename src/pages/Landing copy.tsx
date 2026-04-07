import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Star, Tag, TagIcon } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Landing() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: triggerRef,
    offset: ["start end", "start start"],
  });
  const opacity = useTransform(scrollYProgress, [1, 1, 0], [1, 1, 0]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center space-x-2">
              <Bookmark className="h-7 w-7 text-emerald-500" />
              <span className="text-xl font-bold text-emerald-500">
                Bookmarkly
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
              </a>
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Login/ Sign Up
                </Link>
              </div>
            </nav>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 relative"
            >
              <div
                className={`w-6 h-0.5 bg-gray-900 absolute transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45" : "translate-y-1"
                }`}
              ></div>
              <div
                className={`w-6 h-0.5 bg-gray-900 absolute transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45" : "-translate-y-1"
                }`}
              ></div>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200/50 px-6 py-4 space-y-4">
              <a
                href="#pricing"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#about"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>

              <Link
                to="/login"
                className="block bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login/ Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-26">
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-16 h-16 bg-green-400 rounded-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-12 h-12 bg-yellow-400 rounded-lg opacity-30 animate-bounce"></div>
            <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-blue-400 rounded-2xl opacity-25 animate-pulse"></div>
            <div className="absolute top-60 right-1/3 w-14 h-14 bg-purple-400 rounded-xl opacity-20 animate-bounce"></div>
          </div>

          <div className="text-center relative">
            <h1 className="landing-header-text text-4xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-2 leading-tight">
              One place for all
              <br />
              your bookmarks
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Save, organize, and access your favorite links with smart tagging,
              reminders, and seamless synchronization across all devices.
            </p>

            <Link
              to="/signup"
              className="landing-header-text inline-block bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Smart Organization */}
          <div className="bg-gradient-to-br max-h-min from-green-400 to-green-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <Tag className="h-8 w-8 mr-3" />
                <span className="text-lg font-semibold">Smart Tags</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Organize with ease!</h3>
              <p className="text-green-100 mb-3">
                Automatically categorize and tag your bookmarks for instant
                discovery.
              </p>
              <p className="text-green-100">
                It’s fast, looks good, and saves you from scrolling through
                browser history like a mad person.
              </p>
            </div>
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/20 rounded-full"></div>
          </div>

          {/* Bookmark Management */}
          <div className="bg-gradient-to-br  max-h-min from-gray-800 to-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">
                Build the bookmark collection you want.
              </h3>
              <div className="space-y-3">
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                  <span className="flex items-center h-14 w-14 bg-black rounded-full justify-center mr-3">
                    <TagIcon className="h-5 w-5" />
                  </span>
                  <span className="text-sm">Pocket App Links</span>
                </div>
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                  <span className="flex items-center h-14 w-14 bg-black rounded-full justify-center mr-3">
                    <Bookmark className="h-5 w-5" />
                  </span>
                  <span className="text-sm">Personal Links</span>
                </div>
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                  <span className="flex items-center h-14 w-14 bg-black rounded-full justify-center mr-3">
                    <Star className="h-5 w-5" />
                  </span>
                  <span className="text-sm">Favorites</span>
                </div>
              </div>
            </div>
          </div>

          {/* Community */}
          <div className="bg-gradient-to-br  max-h-min from-yellow-400 to-yellow-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">
                Join our users worldwide
              </h3>
              <p className="mb-2">
                We make saving and finding your favourite links ridiculously
                easy. No stress, no clutter, just clean bookmark management that
                actually works.
              </p>
              <div className="flex -space-x-2 mb-4">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="inline-block size-8 rounded-full ring-2 ring-yellow-100 outline -outline-offset-1 outline-white"
                />
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="inline-block size-8 rounded-full ring-2 ring-yellow-100 outline -outline-offset-1 outline-white"
                />
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                  className="inline-block size-8 rounded-full ring-2 ring-yellow-100 outline -outline-offset-1 outline-white"
                />
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="inline-block size-8 rounded-full ring-2 ring-yellow-100 outline -outline-offset-1 outline-white"
                />
              </div>
              <Link
                to="/signup"
                className="inline-block bg-white text-yellow-500 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
      <motion.section
        id="about"
        style={{ opacity }}
        ref={triggerRef}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        {/* Community */}
        <motion.div className="bg-slate-200 rounded-2xl p-8 text-black relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl lg:text-4xl font-bold mb-4">About</h3>
            <p className="text-5xl text-slate-600 leading-tight font-extrabold landing-header-text">
              {/* <p className="text-3xl text-slate-600 max-w-2xl"> */}
              Bookmarkly is basically my version of Pocket, but fresher, faster,
              and fully mine. You can save links, tag them, search them, and
              come back later without fear that some company will shut down and
              carry your bookmarks to heaven. You can use it if you’re the type
              that always says “I’ll read it later” but never actually does. At
              least now you’ll have somewhere fine to keep all those links. You
              can even pin your favourites, archive the old ones, and pretend
              you’re organised.
            </p>
            {/* <p className="text-md landing-header-text">
              Built with 💚 by Kizito
            </p> */}
          </div>

          <Link
            to="/signup"
            className="my-6 landing-header-text inline-block bg-black text-white px-6 py-4 rounded-lg font-medium hover:bg-emerald-500 transition-colors"
          >
            Get Started
          </Link>
        </motion.div>
        <p className="text-center my-2 text-md landing-header-text">
          Built with 💚 by Kizito
        </p>
      </motion.section>
    </div>
  );
}

import {
  useState,

  // useRef
} from "react";
import { Link } from "react-router-dom";
import { Bookmark, Star, Tag, TagIcon } from "lucide-react";
import {
  motion,
  // useScroll,
  // useTransform
} from "framer-motion";
import Logo from "@/assets/logo.svg";

export default function Landing() {
  // const triggerRef = useRef<HTMLDivElement>(null);
  // const { scrollYProgress } = useScroll({
  //   target: triggerRef,
  //   offset: ["start end", "start start"],
  // });
  // const opacity = useTransform(scrollYProgress, [1, 1, 0], [1, 1, 0]);
  // const downloadRef = useRef<HTMLDivElement>(null);
  // const { scrollYProgress: downloadProgress } = useScroll({
  //   target: downloadRef,
  //   offset: ["start end", "end start"],
  // });
  // const downloadY = useTransform(downloadProgress, [0, 0.5, 1], [60, 0, -80]);
  // const downloadOpacity = useTransform(
  //   downloadProgress,
  //   [0, 0.3, 1],
  //   [0.75, 1, 0.65],
  // );
  // const downloadBlur = useTransform(downloadProgress, [0, 0.4, 1], [6, 0, 6]);
  // const downloadFilter = useTransform(
  //   downloadBlur,
  //   (value) => `blur(${value}px)`
  // );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg">
          <div className="flex justify-between items-center px-6 py-4">
            <Link to="/" className="flex items-center space-x-2">
              {/* <Bookmark className="h-7 w-7 text-emerald-500" /> */}
              <img src={Logo} alt="Logo" className="h-7 w-7" />
              <span className="text-xl font-bold text-black">Bookmarkly</span>
            </Link>

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
        {/* Mobile Menu end */}
      </header>
      {/* Floating Header end */}

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
      {/* Hero Section end */}

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 lg:px-8">
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
          {/* Bookmark Management end */}

          {/* Community start*/}
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
      {/* Feature Cards end */}

      {/* Download start */}
      <motion.section
        id="download"
        // ref={downloadRef}
        // style={{
        //   y: downloadY,
        //   // opacity: downloadOpacity,
        //   filter: downloadFilter,
        // }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-indigo-50 rounded-[32px]" />
          <div className="absolute -bottom-24 left-12 w-64 h-64 bg-emerald-300/30 blur-3xl rounded-full" />
          <div className="absolute -top-16 right-6 w-48 h-48 bg-indigo-300/40 blur-3xl rounded-full" />
        </div>
        <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white/80 shadow-sm shadow-emerald-200/50 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-10 lg:gap-14 p-8 sm:p-12">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Download
              </p>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                Take Bookmarkly everywhere you browse
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Grab the desktop app to save, tag, and reopen links without
                breaking your flow. Built-in offline mode keeps your essentials
                handy, while smart sync mirrors your collections instantly.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <a className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 text-white text-base font-semibold shadow-lg shadow-gray-900/15 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/20">
                  <span>Download for macOS</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M12 16V4m0 12-3.5-3.5M12 16l3.5-3.5M5 18h14"
                    />
                  </svg>
                </a>
                <button className="inline-flex items-center gap-2 text-gray-800 font-semibold">
                  <span>Use in browser</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {[
                  {
                    title: "Instant capture",
                    desc: "Save links + metadata in 1 click",
                  },
                  {
                    title: "Tag on the fly",
                    desc: "Smart suggestions that learn you",
                  },
                  {
                    title: "Offline ready",
                    desc: "Keep your essentials cached",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-3 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-6 right-6 h-16 w-16 rounded-full bg-white/70 backdrop-blur border border-black/5 shadow-lg shadow-indigo-200/40 animate-ping" />
              <div className="relative rounded-[28px] border border-black/5 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 shadow-2xl shadow-emerald-300/30">
                <div className="flex justify-between items-center text-sm text-white/70 mb-6">
                  <span className="px-3 py-1 rounded-full bg-white/10">
                    Live preview
                  </span>
                  <span className="inline-flex items-center gap-2 text-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Syncing
                  </span>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      title: "Pocket guide to Tokyo",
                      tag: "Travel",
                      color: "bg-emerald-400/40",
                    },
                    {
                      title: "Next.js 15 release notes",
                      tag: "Dev",
                      color: "bg-indigo-400/40",
                    },
                    {
                      title: "Minimalist home office setups",
                      tag: "Inspiration",
                      color: "bg-amber-400/40",
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className="rounded-2xl bg-white/10 border border-white/10 p-4 text-white"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{card.title}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${card.color} text-gray-900 font-semibold`}
                        >
                          {card.tag}
                        </span>
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-300 to-indigo-300" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-white/80">
                  <div className="flex -space-x-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-gray-900 text-xs font-bold">
                      BK
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-gray-900 text-xs font-bold">
                      LY
                    </span>
                  </div>
                  <div className="text-sm leading-tight">
                    <p className="font-semibold text-white">
                      Syncing across devices
                    </p>
                    <p className="text-white/60">
                      Bookmarks stay fresh everywhere
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      {/* Download end */}

      {/* Footer start*/}
      <motion.section
        id="about"
        // style={{ opacity }}
        // ref={triggerRef}
        // transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-[32px] border border-black/5 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white shadow-md shadow-emerald-300/20">
          <div className="absolute inset-0">
            <div className="absolute -top-20 left-10 h-64 w-64 rounded-full bg-emerald-400/25 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.05),transparent_25%)]" />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-12 p-8 sm:p-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                About Bookmarkly
              </div>
              <h3 className="text-4xl lg:text-5xl font-black leading-tight">
                The calm way to remember everything you find on the web
              </h3>
              <p className="text-lg text-gray-200/90 leading-relaxed">
                Bookmarkly keeps your discoveries tidy with tags, lightning-fast
                search, and pinned shortcuts. Save from any device, reopen
                instantly, and never worry about losing what inspired you.
                Former Pocket App by Mozilla was the motivation behind building
                this tool to solve my personal bookmark chaos. Now the public
                can benefit from it too!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "2.5k+", subtitle: "links organized weekly" },
                  { title: "300ms", subtitle: "average search response" },
                  { title: "100%", subtitle: "your data, RLS protected" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg shadow-emerald-500/10"
                  >
                    <p className="text-2xl font-black">{item.title}</p>
                    <p className="text-sm text-gray-200/80">{item.subtitle}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-gray-900 text-base font-semibold shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-400/30"
                >
                  Start saving now
                </Link>
                <a
                  href="#download"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
                >
                  See how it works
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M5 12h14m0 0-4-4m4 4-4 4"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Tag-first organization",
                  desc: "Smart suggestions learn your habits so everything stays searchable.",
                  icon: <Tag className="h-5 w-5" />,
                },
                {
                  title: "Pinned favorites",
                  desc: "Surface the links you revisit daily with a single tap.",
                  icon: <Star className="h-5 w-5" />,
                },
                {
                  title: "Real-time sync",
                  desc: "Supabase-backed sync keeps every device aligned instantly.",
                  icon: <Bookmark className="h-5 w-5" />,
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {feature.title}
                    </p>
                    <p className="text-sm text-gray-200/80">{feature.desc}</p>
                  </div>
                </div>
              ))}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-gray-200/80 shadow-lg shadow-emerald-500/10">
                Built with security in mind, RLS-protected tables, and real-time
                subscriptions so you own your data from day one.
              </div>
            </div>
          </div>
        </div>
        <p className="text-center mt-4 text-md landing-header-text text-gray-700">
          Built with 💚 by Kizito
        </p>
      </motion.section>
      {/* Footer end */}
      {/* Footer Section */}
      <footer className="bg-gray-100 text-gray-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center space-x-6">
          <Link
            to="/privacy-policy"
            className="hover:text-gray-900 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-use"
            className="hover:text-gray-900 transition-colors"
          >
            Terms of Use
          </Link>
        </div>
      </footer>
    </div>
  );
}

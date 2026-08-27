import React, { useState, useEffect, useRef } from "react";
import logo_b from "./assets/iOSC Final Logo from Figma (1).svg";
import logo_w from "./assets/iOSC Final Logo from Figma.svg";
import swift from "./assets/swift_logo.png";
import app_store from "./assets/app_store.png";
import appleGradient from "./assets/Rectangle 9.png";

export default function IOSCLanding() {
  const [scrollY, setScrollY] = useState(0);
  const aboutRef = useRef(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const timelineRef = useRef(null);
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAboutVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "-50px",
      }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  const timelineEvents = [
    {
      date: "January 21",
      title: "Information Session",
      description: "Meet the team.",
    },
    {
      date: "January 23",
      title: "Applications Close",
      description: "Final deadline.",
    },
    {
      date: "January 25-27",
      title: "Interviews",
      description: "Meet the team.",
    },
    {
      date: "January 28",
      title: "Decisions Released",
      description: "Welcome to iOSC.",
    },
  ];

  const headerOptions = [
    "Welcome to the start of<br/>something *special.*",
    "Build *experiences* not apps.",
    "Join a community of *passionate* builders.",
    "For the love of the *craft.*",
    "Create the *next big app.*",
    "The future is *yours* to create.",
  ];

  const selectedHeader = React.useMemo(() => {
    return headerOptions[Math.floor(Math.random() * headerOptions.length)];
  }, []);

  const renderEmphasis = (text) => {
    const segments = text.split("<br/>");
    const nodes = [];

    segments.forEach((seg, si) => {
      const tokens = seg.split(/(\*[^*]+\*)/g);
      tokens.forEach((tok, ti) => {
        if (tok.startsWith("*") && tok.endsWith("*")) {
          nodes.push(
            <span className="gradient-text" key={`g-${si}-${ti}`}>
              {tok.slice(1, -1)}
            </span>
          );
        } else {
          nodes.push(tok);
        }
      });
      if (si < segments.length - 1) nodes.push(<br key={`br-${si}`} />);
    });

    return nodes;
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const targetPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1200; // 1.2 seconds for slower scroll
    let start = null;

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f]">
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/sf-pro-display');
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.28, 0.11, 0.32, 1) forwards;
        }

        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(0.28, 0.11, 0.32, 1) forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s cubic-bezier(0.28, 0.11, 0.32, 1) forwards;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }

        .apple-card {
          background: #f5f5f7;
          border-radius: 18px;
        }

        .apple-button {
          background: #0071e3;
          border-radius: 980px;
          transition: background 0.3s cubic-bezier(0.28, 0.11, 0.32, 1), color 0.15s ease;
          color: white;
        }

        .apple-button:hover {
          background: radial-gradient(at top left, #ffb347 0%, rgba(255,179,71,0) 60%),
                      radial-gradient(at top right, #ff4f8b 0%, rgba(255,79,139,0) 60%),
                      radial-gradient(at bottom left, #6ec6ff 0%, rgba(110,198,255,0) 60%),
                      radial-gradient(at bottom right, #c77dff 0%, rgba(199,125,255,0) 60%);
          filter: saturate(1.25) contrast(1.8);
          color: white;
        }

        .apple-link {
          color: #333333;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .apple-link:hover {
          color: black;
          text-decoration: none;
        }

        .timeline-item {
          transition: transform 0.3s cubic-bezier(0.28, 0.11, 0.32, 1);
        }

        .timeline-item:hover {
          transform: scale(1.02);
        }

        h1, h2, h3 {
          letter-spacing: -0.02em;
          font-weight: 600;
        }

        .large-text {
          font-size: clamp(40px, 5vw, 80px);
          line-height: 1.05;
          font-weight: 600;
          letter-spacing: -0.015em;
        }

        .headline {
          font-size: clamp(24px, 3vw, 48px);
          line-height: 1.1;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .subheadline {
          font-size: clamp(18px, 2vw, 28px);
          line-height: 1.3;
          font-weight: 400;
          letter-spacing: -0.005em;
        }

        .body-text {
          font-size: 17px;
          line-height: 1.47059;
          font-weight: 400;
          letter-spacing: -0.022em;
        }

        .nav-bar {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
        }

        .gradient-text {
  background: radial-gradient(at top left, #ffb347 0%, rgba(255,179,71,0) 60%),
              radial-gradient(at top right, #ff4f8b 0%, rgba(255,79,139,0) 60%),
              radial-gradient(at bottom left, #6ec6ff 0%, rgba(110,198,255,0) 60%),
              radial-gradient(at bottom right, #c77dff 0%, rgba(199,125,255,0) 60%);
              filter: saturate(1.25) contrast(1.8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
        }

        .button-vec {
          display: inline-block;
        }

        .button-vec-bg {
          position: absolute;
          inset: 0;
          background: #000;
          border-radius: 980px;
          transform: none;
          z-index: 0;
          pointer-events: none;
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="nav-bar sticky top-0 z-50">
        <div className="max-w-[980px] mx-auto px-6 h-[50px] flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={logo_b}
              alt="iOSC logo black"
              className="h-[30px] object-contain"
              onClick={() => scrollToSection("header")}
            />
          </div>
          <div className="flex gap-8 text-[15px]">
            <button
              onClick={() => scrollToSection("about")}
              className="apple-link"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("timeline")}
              className="apple-link"
            >
              Timeline
            </button>
            <button
              onClick={() => scrollToSection("apply")}
              className="apple-link"
            >
              Apply
            </button>
          </div>
        </div>
      </nav>

      {/* header */}
      <div id="header" className="relative overflow-hidden bg-black text-white">
        <div className="max-w-[980px] mx-auto px-6 pt-[70px] pb-[100px] min-h-[740px] text-center flex items-center">
          <div className="w-full opacity-0 animate-fade-in">
            <div className="mb-6">
              <img
                src={logo_w}
                alt="iOSC logo"
                className="h-[225px] object-contain mx-auto opacity-0 animate-fade-in-up delay-100"
              />
            </div>

            <h1 className="large-text mb-[24px] opacity-0 animate-fade-in-up delay-200">
              {renderEmphasis(selectedHeader)}
            </h1>

            <p className="subheadline text-[white] max-w-[600px] mx-auto mb-[40px] opacity-0 animate-fade-in-up delay-300">
              USC's first-ever Apple Platforms development club. <br /> Where
              innovation meets execution.
            </p>

            <div className="flex gap-4 justify-center mb-[0px] opacity-0 animate-fade-in-up delay-400">
              <button
                onClick={() =>
                  window.open("https://forms.gle/4oxNupZL9mjX9EXe8", "_blank")
                }
                className="apple-button text-white px-[22px] py-[12px] text-[17px] font-normal"
              >
                Apply now
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="bg-transparent border border-[#424245] text-white px-[22px] py-[12px] rounded-[980px] text-[17px] font-normal hover:bg-white hover:text-black transition-colors duration-300"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* about*/}
      <div id="about" className="bg-white">
        <div className="max-w-[980px] mx-auto px-6 py-[100px]">
          <div className="text-center mb-[60px] opacity-0 animate-fade-in-up delay-600">
            <h2 className="headline mb-[20px]">About iOSC</h2>
            <p className="subheadline text-[#6e6e73] max-w-[600px] mx-auto">
              USC's first-ever Apple Platforms development club.
            </p>
          </div>

          <div ref={aboutRef} className="grid md:grid-cols-3 gap-[30px]">
            <div
              className={`apple-card p-[40px] text-center transition-all duration-700 ${
                isAboutVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <img
                src={swift}
                alt="Swift logo"
                className="h-[56px] w-[56px] mt-[20px] mb-[12px] object-contain mx-auto"
              />
              <h3 className="text-[24px] font-semibold mb-[12px] text-[#1d1d1f]">
                Community
              </h3>
              <p className="body-text text-[#1d1d1f]">
                Work with fellow Swift developers and build community.
              </p>
            </div>

            <div
              className={`apple-card p-[40px] text-center transition-all duration-700 delay-100 ${
                isAboutVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <img
                src={app_store}
                alt="App Store logo"
                className="h-[56px] w-[56px] mt-[20px] mb-[12px] object-contain mx-auto"
              />
              <h3 className="text-[24px] font-semibold mb-[12px] text-[#1d1d1f]">
                Build
              </h3>
              <p className="body-text text-[#1d1d1f]">
                Push real apps to the App Store.
              </p>
            </div>

            <div
              className={`apple-card p-[40px] text-center transition-all duration-700 delay-200 ${
                isAboutVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="text-[56px] mt-[4px] mb-[0px] text-[#1d1d1f]">
                👥
              </div>
              <h3 className="text-[24px] font-semibold mb-[12px] text-[#1d1d1f]">
                Connect
              </h3>
              <p className="body-text text-[#1d1d1f]">
                Learn from Swift Student Challenge Winners and meet industry
                professionals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* timeline*/}
      <div id="timeline" className="bg-[#f5f5f7]">
        <div className="max-w-[980px] mx-auto px-6 py-[100px]">
          <div className="text-center mb-[80px]">
            <h2
              className="headline mb-[20px] opacity-0 animate-fade-in-up"
              style={{ animationDelay: "1s" }}
            >
              Application Timeline
            </h2>
            <p
              className="subheadline text-[#6e6e73] opacity-0 animate-fade-in-up"
              style={{ animationDelay: "1.1s" }}
            >
              Your journey to joining iOSC.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-[40px] max-w-[800px] mx-auto">
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className="timeline-item p-[40px] opacity-0 animate-fade-in-up bg-white rounded-[18px]"
                style={{ animationDelay: `${1.2 + index * 0.1}s` }}
              >
                <div className="text-[#0071e3] text-[14px] font-semibold mb-[8px] tracking-wide">
                  {event.date}
                </div>
                <h3 className="text-[28px] text-[#1d1d1f] font-semibold mb-[8px] leading-tight">
                  {event.title}
                </h3>
                <p className="text-[20px] text-[#1d1d1f]">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* footer*/}
      <div id="apply" className="bg-white">
        <div className="max-w-[980px] mx-auto px-6 py-[120px] text-center">
          <h2
            className="large-text mb-[30px] opacity-0 animate-fade-in-up"
            style={{ animationDelay: "1.6s" }}
          >
            Ready to create?
          </h2>
          <p
            className="subheadline text-[#6e6e73] mb-[40px] max-w-[600px] mx-auto opacity-0 animate-fade-in-up"
            style={{ animationDelay: "1.7s" }}
          >
            Join USC's most innovative iOS development community and start
            building the apps of tomorrow.
          </p>
          <div
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: "1.8s" }}
          >
            <div className="button-vec inline-block relative">
              <div className="button-vec-bg" aria-hidden="true" />
              <button
                onClick={() =>
                  window.open("https://forms.gle/4oxNupZL9mjX9EXe8", "_blank")
                }
                className="apple-button relative z-10 text-white px-[28px] py-[16px] text-[17px] font-normal"
              >
                Submit your application
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] border-t border-[#d2d2d7]">
        <div className="max-w-[980px] mx-auto px-6 py-[21px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[12px] text-[#6e6e73]">
              Copyright © 2026 iOSC.
            </div>
            <div className="flex gap-6 text-[12px]">
              <a href="#" className="apple-link"></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

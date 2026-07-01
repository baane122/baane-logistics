
import React, { useState, useEffect, useCallback, Suspense, lazy, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Ship, Plane, ShieldCheck, MapPin, Compass, Cpu, Anchor,
  Activity, Clock, ChevronRight, Layers, Phone, Mail, HelpCircle, Bot,
  AlertTriangle, Globe, Menu, X, Star, TrendingUp, ArrowRight, Zap, Shield
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { Logo } from "./components/Logo";
import { InteractiveMap } from "./components/InteractiveMap";
import TrackingSection from "./components/TrackingSection";
import SourcingSection from "./components/SourcingSection";
import InspectionSection from "./components/InspectionSection";
import PaymentSection from "./components/PaymentSection";
import ChatAssistant from "./components/ChatAssistant";
import { TrackingData } from "./types";
import { ConvexAppProvider } from "./convexClient";
import { translations } from "./translations";
import { useGsapCleanup } from "./hooks/useGsapAnimations";

const LazyInteractiveMap = lazy(() => import("./components/InteractiveMap"));
const LazyTrackingSection = lazy(() => import("./components/TrackingSection"));
const LazySourcingSection = lazy(() => import("./components/SourcingSection"));
const LazyInspectionSection = lazy(() => import("./components/InspectionSection"));
const LazyPaymentSection = lazy(() => import("./components/PaymentSection"));
const LazyChatAssistant = lazy(() => import("./components/ChatAssistant"));

function SectionFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex gap-1.5">
        {[0, 150, 300].map((d) => (
          <span key={d} className="h-2.5 w-2.5 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
    </div>
  );
}

export default function AppWithConvex() {
  return (
    <ConvexAppProvider>
      <App />
    </ConvexAppProvider>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<"tracking" | "sourcing" | "inspection" | "payment" | "copilot">("tracking");
  const [activeTrack, setActiveTrack] = useState<TrackingData | null>(null);
  const [utcTime, setUtcTime] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "so">(() => {
    const saved = localStorage.getItem("baane_lang");
    return (saved === "en" || saved === "so") ? saved : "en";
  });

  const t = translations[lang];
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const corridorsRef = useRef<HTMLDivElement>(null);

  useGsapCleanup();

  // ─── GSAP Entrance Animations ──────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Navbar stagger
    if (navRef.current) {
      tl.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );
    }

    // Hero content staggered
    const heroEl = heroRef.current;
    if (heroEl) {
      const heroChildren = heroEl.querySelectorAll(".hero-animate");
      tl.fromTo(
        heroChildren,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
        "-=0.3"
      );
    }

    return () => tl.kill();
  }, []);

  // ─── Scroll-triggered stats counter ─────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const counters = document.querySelectorAll(".stat-number");
      counters.forEach((el) => {
        const finalText = el.textContent || "0";
        const finalNum = parseInt(finalText.replace(/[^0-9]/g, "")) || 0;
        if (finalNum === 0) return;
        gsap.fromTo(el, { textContent: 0 }, {
          textContent: finalNum, duration: 2, ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reset" },
        });
      });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  // ─── Corridors scroll reveal ────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".corridor-card",
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: "power2.out",
          scrollTrigger: { trigger: corridorsRef.current, start: "top 80%", toggleActions: "play none none reset" }
        }
      );
    }, corridorsRef);
    return () => ctx.revert();
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "so" : "en";
      localStorage.setItem("baane_lang", next);
      return next;
    });
  }, []);

  const handleTabChange = useCallback((tabId: "tracking" | "sourcing" | "inspection" | "payment" | "copilot") => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    requestAnimationFrame(() => {
      document.getElementById("command-station")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  useEffect(() => {
    fetch("/api/tracking/BAANE-SEA-8821").then((r) => r.ok && r.json().then(setActiveTrack)).catch(() => {});
  }, []);

  useEffect(() => {
    const update = () => setUtcTime(new Date().toUTCString().replace("GMT", "UTC"));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const navTabs = [
    { id: "tracking", label: t.tracking },
    { id: "sourcing", label: t.sourcing },
    { id: "inspection", label: t.inspection },
    { id: "payment", label: t.payment },
    { id: "copilot", label: t.copilot },
  ] as const;

  return (
    <div className="min-h-screen bg-brand-deep text-gray-100 font-sans selection:bg-brand-teal/30 selection:text-white overflow-x-hidden scanline">
      {/* ═══════════════ 1. NAVBAR ═══════════════ */}
      <header ref={navRef} className="sticky top-0 z-50 bg-brand-deep/80 backdrop-blur-xl border-b border-brand-teal/10 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo className="h-9 sm:h-11 w-auto" />

          {/* Desktop Nav — glass pill */}
          <nav className="hidden lg:flex items-center gap-1 glass-panel p-1 rounded-2xl shadow-lg shadow-brand-teal/5">
            {navTabs.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`relative px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 cursor-pointer ${
                  activeTab === item.id
                    ? "text-brand-navy"
                    : "text-gray-400 hover:text-brand-teal"
                }`}
              >
                {activeTab === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-brand-teal rounded-xl shadow-lg shadow-brand-teal/25"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button onClick={toggleLang}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider glass-panel text-brand-teal hover:bg-brand-teal/10 transition-all duration-300 cursor-pointer group">
              <Globe className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform duration-300" />
              <span>{lang === "en" ? "Somali (SO)" : "English (EN)"}</span>
            </button>
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <button onClick={toggleLang}
              className="flex items-center gap-1 glass-panel px-2.5 py-1.5 rounded-lg text-brand-teal text-[11px] font-bold">
              <Globe className="h-3.5 w-3.5" />
              <span>{lang === "en" ? "SO" : "EN"}</span>
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-teal glass-panel rounded-lg hover:bg-brand-teal/10 transition-all">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-brand-teal/10 mt-3 pt-4 pb-2 space-y-1"
            >
              {navTabs.map((tab) => (
                <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                  className={`block w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-brand-teal/15 text-brand-teal border-l-2 border-brand-teal"
                      : "text-gray-400 hover:bg-surface-dark hover:text-white"
                  }`}>
                  {tab.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════ 2. HERO SECTION ═══════════════ */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute inset-0 radial-glow" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-20 md:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Hero Text */}
            <div className="space-y-6">
              <div className="hero-animate inline-flex items-center gap-2 bg-brand-teal/10 border border-brand-teal/20 rounded-full px-4 py-1.5">
                <Zap className="h-3.5 w-3.5 text-brand-teal" />
                <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest font-mono">
                  {t.activeSatellite}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-brand-teal animate-pulse" />
              </div>

              <h1 className="hero-animate text-4xl md:text-5xl lg:text-6xl font-extrabold font-display leading-tight">
                <span className="text-white">{t.heroTitle1}</span>
                <br />
                <span className="text-gradient">{t.heroTitle2}</span>
              </h1>

              <p className="hero-animate text-sm md:text-base text-gray-400 font-sans leading-relaxed max-w-xl">
                {t.heroDesc}
              </p>

              <div className="hero-animate flex flex-wrap gap-3 pt-2">
                <button onClick={() => handleTabChange("tracking")}
                  className="group relative inline-flex items-center gap-2 bg-brand-teal text-brand-navy font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-brand-teal/25 hover:scale-[1.02] active:scale-[0.98]">
                  <span className="relative z-10 flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    {t.launchRadar}
                  </span>
                  <motion.span className="absolute inset-0 bg-gradient-to-r from-brand-teal to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <button onClick={() => handleTabChange("copilot")}
                  className="group inline-flex items-center gap-2 glass-panel text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all duration-300 hover:border-brand-teal/40 hover:shadow-lg hover:shadow-brand-teal/10">
                  <Bot className="h-4 w-4 text-brand-gold group-hover:animate-bounce" />
                  {t.askSourcingAi}
                </button>
              </div>

              {/* Mini stats row */}
              <div className="hero-animate flex items-center gap-6 pt-4 text-xs font-mono text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-brand-teal" />
                  <span>{t.secureShip}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-brand-gold" />
                  <span>{t.uplinkActive}</span>
                </div>
              </div>
            </div>

            {/* Right — Logo / Globe Seal */}
            <div className="hero-animate hidden lg:flex justify-center items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-teal/10 rounded-full blur-3xl animate-pulse" />
                <Logo variant="seal" className="h-72 w-72 md:h-80 md:w-80 opacity-90 relative z-10 drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 3. REAL-TIME STATS BAR ═══════════════ */}
      <section ref={statsRef} className="relative border-y border-brand-teal/10 bg-surface-dark/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: "2,450+", label: t.statContainers, icon: Ship },
              { value: "$12M+", label: t.statEscrowed, icon: Shield },
              { value: "48", suffix: "h", label: t.statInspector, icon: Clock },
              { value: "99.8%", label: t.statClearance, icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center group">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="h-4 w-4 text-brand-teal/60 group-hover:text-brand-teal transition-colors" />
                </div>
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="stat-number text-2xl md:text-3xl font-extrabold font-display text-white">
                    {stat.value}
                  </span>
                  {"suffix" in stat && <span className="text-xl font-bold text-brand-teal">{stat.suffix}</span>}
                </div>
                <div className="text-[10px] md:text-xs text-gray-500 font-mono mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 4. COMMAND STATION (Tabs) ═══════════════ */}
      <div id="command-station" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-brand-teal/5 border border-brand-teal/10 rounded-full px-4 py-1.5 mb-4">
            <Cpu className="h-3.5 w-3.5 text-brand-teal" />
            <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest font-mono">{t.hologramCommand}</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
            {t.commandStationTitle}
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-sans max-w-2xl mx-auto">{t.commandStationDesc}</p>
        </motion.div>

        {/* Tab Switcher — Glass Pill */}
        <div className="flex justify-center mb-8">
          <div className="glass-panel p-1 rounded-2xl inline-flex flex-wrap justify-center shadow-lg">
            {navTabs.map((item) => (
              <button key={item.id} onClick={() => handleTabChange(item.id)}
                className={`relative px-3.5 md:px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === item.id
                    ? "text-brand-navy"
                    : "text-gray-400 hover:text-brand-teal"
                }`}>
                {activeTab === item.id && (
                  <motion.span layoutId="tab-pill"
                    className="absolute inset-0 bg-brand-teal rounded-xl shadow-lg shadow-brand-teal/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Panels */}
        <Suspense fallback={<SectionFallback />}>
          <AnimatePresence mode="wait">
            {activeTab === "tracking" && (
              <motion.div key="tracking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <LazyTrackingSection onSelectTrack={setActiveTrack} activeTrack={activeTrack} lang={lang} />
              </motion.div>
            )}
            {activeTab === "sourcing" && (
              <motion.div key="sourcing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <LazySourcingSection lang={lang} />
              </motion.div>
            )}
            {activeTab === "inspection" && (
              <motion.div key="inspection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <LazyInspectionSection lang={lang} />
              </motion.div>
            )}
            {activeTab === "payment" && (
              <motion.div key="payment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <LazyPaymentSection lang={lang} />
              </motion.div>
            )}
            {activeTab === "copilot" && (
              <motion.div key="copilot" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-xl mx-auto">
                <LazyChatAssistant lang={lang} />
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </div>

      {/* ═══════════════ 5. INTERACTIVE MAP ═══════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 md:px-8 pb-10"
      >
        <div className="glass-card rounded-2xl overflow-hidden p-4 md:p-6">
          <LazyInteractiveMap
            activeTrackingId={activeTrack?.id}
            activeRouteProgress={activeTrack?.progress}
            routeType={activeTrack?.type || null}
            lang={lang}
          />
        </div>
      </motion.div>

      {/* ═══════════════ 6. CORRIDORS ═══════════════ */}
      <section ref={corridorsRef} className="border-t border-brand-teal/10 bg-surface-dark/50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-brand-gold/5 border border-brand-gold/10 rounded-full px-4 py-1.5 mb-4">
              <Layers className="h-3.5 w-3.5 text-brand-gold" />
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest font-mono">{t.activeCorridors}</span>
            </div>
            <h2 className="font-display text-xl md:text-2xl font-extrabold text-white">{t.standardLines}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Plane, title: t.airCargo, route: t.yiwuToHargeisa,
                checkpoints: t.yiwuCheckpoints, eta: t.expressDays, cls: "text-brand-teal",
              },
              {
                icon: Ship, title: t.seaCargo, route: t.shenzhenToBerbera,
                checkpoints: t.shenzhenCheckpoints, eta: t.seaDays, cls: "text-blue-400",
              },
              {
                icon: Anchor, title: t.consolidatedCargo, route: t.guangzhouToBurao,
                checkpoints: t.guangzhouCheckpoints, eta: t.buraoDays, cls: "text-brand-gold",
              },
            ].map((corridor, i) => (
              <div key={i}
                className="corridor-card glass-card rounded-2xl p-6 hover:border-brand-teal/25 transition-all duration-500 group hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-teal/5">
                <div className={`w-10 h-10 rounded-xl bg-current/10 ${corridor.cls} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <corridor.icon className={`h-5 w-5 ${corridor.cls}`} />
                </div>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">{corridor.title}</div>
                <h4 className="text-sm font-bold text-white font-display mb-2">{corridor.route}</h4>
                <div className="space-y-1.5 text-xs text-gray-400 font-sans">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3 w-3 text-brand-teal shrink-0 mt-0.5" />
                    <span>{corridor.checkpoints}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Clock className="h-3 w-3 text-brand-gold" />
                    <span className="text-brand-gold font-bold">{t.transitEta} {corridor.eta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 7. FOOTER ═══════════════ */}
      <footer className="border-t border-brand-teal/10 bg-brand-deep">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4 space-y-4">
              <Logo className="h-10 w-auto" />
              <p className="text-xs text-gray-400 font-sans leading-relaxed">{t.footerDesc}</p>
              <div className="flex gap-3 pt-2">
                {[
                  { icon: Mail, href: "mailto:info@baanelogistics.com" },
                  { icon: Phone, href: "tel:+2526337066667" },
                  { icon: Globe, href: "#" },
                ].map(({ icon: Icon, href }, i) => (
                  <a key={i} href={href}
                    className="w-8 h-8 rounded-lg bg-surface-dark border border-brand-teal/10 flex items-center justify-center text-gray-400 hover:text-brand-teal hover:border-brand-teal/30 transition-all">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 flex justify-center py-4">
              <Logo variant="seal" className="h-36 w-36 opacity-80 hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="md:col-span-4 space-y-4">
              <h5 className="font-display font-extrabold text-brand-gold text-xs uppercase tracking-wider">{t.physicalHubs}</h5>
              <div className="space-y-3 text-xs text-gray-300">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">{t.hargeisaOffice}</strong><br />
                    {t.hargeisaAddr}<br />
                    <a href="tel:06337066667" className="text-brand-teal font-semibold hover:underline">Phone: 06337066667</a>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">{t.yiwuOffice}</strong><br />
                    {t.yiwuAddr}<br />
                    <a href="tel:008615277074143" className="text-brand-teal font-semibold hover:underline">Phone: 008615277074143</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-brand-teal/5 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-gray-500 gap-3">
            <span>&copy; {new Date().getFullYear()} {t.copyright}</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                {t.chronoFeed}
              </span>
              <span>{t.systemAudit}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════ 8. WHATSAPP FLOATING ═══════════════ */}
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
        href="https://wa.me/8615277074143"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:scale-110 active:scale-95 transition-all duration-300 relative">
          <span className="absolute inset-0 rounded-full border-4 border-[#25D366] opacity-60 animate-ping" />
          <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.83.001-2.624-1.017-5.092-2.87-6.948C16.512 1.982 14.047 1.24 11.433 1.24c-5.41 0-9.821 4.403-9.824 9.814-.001 1.701.453 3.361 1.311 4.816L1.87 20.31l4.777-1.156z" />
          </svg>
          <span className="absolute right-16 bg-surface-dark text-white text-[10px] font-bold font-sans py-2 px-3 rounded-xl border border-brand-teal/20 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 translate-x-2 group-hover:translate-x-0 shadow-2xl">
            {t.whatsappTooltip}
          </span>
        </div>
      </motion.a>
    </div>
  );
}

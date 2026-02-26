"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Orbitron, Rajdhani, Share_Tech_Mono } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const shareTechMono = Share_Tech_Mono({ subsets: ["latin"], weight: "400" });
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function HomePage() {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState("");

  useEffect(() => {
    const cur = document.getElementById("cur");
    const ring = document.getElementById("cur-ring");
    if (!cur || !ring) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.transform = `translate(${mx - 4}px,${my - 4}px)`;
    };

    const animateRing = () => {
      rx += (mx - rx - 18) * 0.13;
      ry += (my - ry - 18) * 0.13;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      rafId = requestAnimationFrame(animateRing);
    };

    document.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(animateRing);

    const interactive = document.querySelectorAll(
      "a,button,.product-row,.feat,.cta-card,.why-item,.stat",
    );

    const enter = () => {
      ring.style.width = "54px";
      ring.style.height = "54px";
    };
    const leave = () => {
      ring.style.width = "36px";
      ring.style.height = "36px";
    };

    interactive.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.transitionDelay =
              `${i * 0.07}s`;
            entry.target.classList.add("on");
          }
        });
      },
      { threshold: 0.08 },
    );

    const revealEls = document.querySelectorAll(".reveal");
    revealEls.forEach((el) => observer.observe(el));

    const agentSpendEl = document.getElementById("agent-spend-amount");
    const businessEarnEl = document.getElementById("business-earn-amount");
    let agentBalance = 49.0;
    let businessEarnings = 88.0;

    const flowTimer = window.setInterval(() => {
      agentBalance = Math.max(
        18,
        Number((agentBalance - (Math.random() * 0.55 + 0.12)).toFixed(2)),
      );
      businessEarnings = Number(
        (businessEarnings + (Math.random() * 0.95 + 0.22)).toFixed(2),
      );

      if (agentSpendEl) {
        agentSpendEl.textContent = `$${agentBalance.toFixed(2)}`;
      }
      if (businessEarnEl) {
        businessEarnEl.textContent = `$${businessEarnings.toFixed(2)}`;
      }

      if (agentBalance <= 18.5) {
        agentBalance = 49.0;
      }
      if (businessEarnings >= 188) {
        businessEarnings = 88.0;
      }
    }, 1550);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      revealEls.forEach((el) => observer.unobserve(el));
      observer.disconnect();
      window.clearInterval(flowTimer);
    };
  }, []);

  const onContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contactEmail.trim()) return;
    const body = encodeURIComponent(
      `Please reach me at: ${contactEmail.trim()}`,
    );
    window.location.href = `mailto:hello@actumx.com?subject=Actumx%20Contact&body=${body}`;
    setContactOpen(false);
    setContactEmail("");
  };

  return (
    <>
      <style>{`
        :root {
          --bg: #020408;
          --bg2: #03060f;
          --bg3: #050a1a;
          --cyan: #dce0f8;
          --cyan2: #c7cff6;
          --cyan-dim: rgba(220, 224, 248, 0.12);
          --cyan-glow: rgba(220, 224, 248, 0.4);
          --teal: #eef0ff;
          --orange: #ff6b35;
          --white: #eef0ff;
          --muted: #8a90b4;
          --border: rgba(238, 240, 255, 0.14);
          --border-bright: rgba(238, 240, 255, 0.35);
          --cta-blue: #4d6fff;
          --cta-blue-2: #0231ff;
          --cta-blue-glow: rgba(77, 111, 255, 0.55);
          --scanline: rgba(0, 0, 0, 0.07);
        }
        :root[data-theme="light"] {
          --bg: #f4f7fc;
          --bg2: #ffffff;
          --bg3: #eef3fb;
          --cyan: #1d4ed8;
          --cyan2: #1e40af;
          --cyan-dim: rgba(30, 64, 175, 0.08);
          --cyan-glow: rgba(30, 64, 175, 0.28);
          --teal: #2563eb;
          --white: #0f172a;
          --muted: #4b5568;
          --border: rgba(30, 41, 59, 0.16);
          --border-bright: rgba(30, 41, 59, 0.3);
          --cta-blue: #2563eb;
          --cta-blue-2: #1d4ed8;
          --cta-blue-glow: rgba(37, 99, 235, 0.35);
          --scanline: rgba(37, 99, 235, 0.04);
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          background: var(--bg);
          color: var(--white);
          overflow-x: hidden;
          cursor: none;
        }
        body::after {
          content: "";
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            var(--scanline) 2px,
            var(--scanline) 4px
          );
          pointer-events: none;
          z-index: 9990;
        }
        #cur {
          position: fixed;
          width: 8px;
          height: 8px;
          background: var(--cta-blue);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          box-shadow:
            0 0 12px var(--cyan),
            0 0 30px var(--cyan-glow);
        }
        #cur-ring {
          position: fixed;
          width: 36px;
          height: 36px;
          border: 1px solid var(--cyan-glow);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transition:
            width 0.3s,
            height 0.3s;
        }
        .bg-mesh {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(
              ellipse 60% 50% at 85% 15%,
              rgba(238, 240, 255, 0.08) 0%,
              transparent 60%
            ),
            radial-gradient(
              ellipse 40% 40% at 5% 85%,
              rgba(238, 240, 255, 0.06) 0%,
              transparent 60%
            ),
            radial-gradient(
              ellipse 50% 30% at 50% 100%,
              rgba(238, 240, 255, 0.05) 0%,
              transparent 70%
            );
        }
        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 64px;
          border-bottom: 1px solid var(--border);
          background: rgba(2, 4, 8, 0.85);
          backdrop-filter: blur(24px);
        }
        .nav-logo {
          font-weight: 900;
          font-size: 22px;
          letter-spacing: 8px;
          color: var(--cyan);
          text-decoration: none;
          text-shadow: none;
        }
        .nav-links {
          display: flex;
          gap: 40px;
          list-style: none;
        }
        .nav-links a {
          font-size: 13px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition:
            color 0.3s,
            text-shadow 0.3s;
        }
        .nav-links button {
          font-size: 13px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          background: transparent;
          border: none;
          padding: 0;
          transition:
            color 0.3s,
            text-shadow 0.3s;
          cursor: none;
        }
        .nav-links a:hover {
          color: var(--cyan);
          text-shadow: 0 0 12px var(--cyan-glow);
        }
        .nav-links button:hover {
          color: var(--cyan);
          text-shadow: 0 0 12px var(--cyan-glow);
        }
        .nav-btn {
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--cyan);
          background: transparent;
          padding: 12px 28px;
          border: 1px solid var(--cyan-glow);
          cursor: none;
          position: relative;
          overflow: hidden;
          transition: color 0.3s;
        }
        .nav-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--cyan);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s;
          z-index: -1;
        }
        .nav-btn:hover {
          color: #ffffff;
        }
        .nav-btn:hover::before {
          transform: scaleX(1);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        :root[data-theme="light"] body {
          color: #0f172a;
        }
        :root[data-theme="light"] nav {
          background: rgba(255, 255, 255, 0.92);
          border-bottom: 1px solid rgba(30, 41, 59, 0.16);
          backdrop-filter: blur(14px);
        }
        :root[data-theme="light"] .nav-logo {
          color: #1d4ed8;
          text-shadow: none;
        }
        :root[data-theme="light"] .hero-grid {
          background:
            radial-gradient(
              ellipse 75% 55% at 18% 10%,
              rgba(37, 99, 235, 0.14) 0%,
              transparent 60%
            ),
            radial-gradient(
              ellipse 68% 45% at 85% 16%,
              rgba(30, 64, 175, 0.1) 0%,
              transparent 62%
            ),
            radial-gradient(
              ellipse 60% 45% at 50% 88%,
              rgba(37, 99, 235, 0.08) 0%,
              transparent 70%
            );
          opacity: 0.8;
        }
        :root[data-theme="light"] .hero-grid::before {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(30, 64, 175, 0.12) 48%,
            transparent 100%
          );
        }
        :root[data-theme="light"] .hero-grid::after {
          opacity: 0.15;
          filter: blur(30px);
        }
        :root[data-theme="light"] .hero-orb {
          background: radial-gradient(
            circle,
            rgba(37, 99, 235, 0.08) 0%,
            rgba(37, 99, 235, 0.03) 45%,
            transparent 72%
          );
        }
        :root[data-theme="light"] .hero-spark {
          background: #1d4ed8;
          box-shadow: 0 0 12px rgba(37, 99, 235, 0.45);
        }
        :root[data-theme="light"] .hero-h1 .l1 {
          color: #1f2937;
        }
        :root[data-theme="light"] .hero-h1 .l2 {
          background: linear-gradient(90deg, #2563eb, #1d4ed8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: none;
        }
        :root[data-theme="light"] .hero-h1 .l3 {
          color: #111827;
        }
        :root[data-theme="light"] .hero-desc {
          color: #334155;
        }
        :root[data-theme="light"] .hero-flow {
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.86),
            rgba(241, 245, 255, 0.9)
          );
          border-color: rgba(30, 41, 59, 0.16);
          box-shadow: 0 14px 38px rgba(15, 23, 42, 0.08);
        }
        :root[data-theme="light"] .flow-lane {
          background: rgba(37, 99, 235, 0.04);
          border-color: rgba(30, 64, 175, 0.18);
        }
        :root[data-theme="light"] .flow-label {
          color: #475569;
        }
        :root[data-theme="light"] .flow-amount.dec {
          color: #1f2937;
        }
        :root[data-theme="light"] .status-text,
        :root[data-theme="light"] .status-right {
          color: #475569;
        }
        :root[data-theme="light"] .marquee-wrap,
        :root[data-theme="light"] .products-bg,
        :root[data-theme="light"] .cta-section,
        :root[data-theme="light"] footer {
          background: #f8fbff;
        }
        :root[data-theme="light"] .stat {
          background: rgba(255, 255, 255, 0.74);
        }
        :root[data-theme="light"] .stat-lbl {
          color: #475569;
        }
        :root[data-theme="light"] .product-row {
          border-color: rgba(30, 41, 59, 0.16);
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08);
        }
        :root[data-theme="light"] .product-row.wallet-row {
          background: linear-gradient(
            145deg,
            rgba(244, 251, 255, 0.98),
            rgba(236, 247, 255, 0.96)
          );
        }
        :root[data-theme="light"] .product-row.gateway-row {
          background: linear-gradient(
            145deg,
            rgba(248, 250, 255, 0.98),
            rgba(240, 245, 255, 0.96)
          );
        }
        :root[data-theme="light"] .product-type,
        :root[data-theme="light"] .product-subcopy,
        :root[data-theme="light"] .wallet-label,
        :root[data-theme="light"] .chat-pill.action,
        :root[data-theme="light"] .earnings-label,
        :root[data-theme="light"] .ledger-item {
          color: #475569;
        }
        :root[data-theme="light"] .product-p,
        :root[data-theme="light"] .wallet-balance,
        :root[data-theme="light"] .earnings-value {
          color: #0f172a;
        }
        :root[data-theme="light"] .chat-pill.prompt {
          background: rgba(37, 99, 235, 0.08);
          color: #1f2937;
        }
        :root[data-theme="light"] .product-visual,
        :root[data-theme="light"] .wallet-card,
        :root[data-theme="light"] .chart-wrap,
        :root[data-theme="light"] .ledger,
        :root[data-theme="light"] .how-wrap,
        :root[data-theme="light"] .how-step {
          background: rgba(255, 255, 255, 0.7);
          border-color: rgba(30, 41, 59, 0.16);
          box-shadow: none;
        }
        :root[data-theme="light"] .how-title {
          color: #0f172a;
        }
        :root[data-theme="light"] .how-text,
        :root[data-theme="light"] .how-num {
          color: #475569;
        }
        :root[data-theme="light"] .cta-sub,
        :root[data-theme="light"] .cta-card-desc,
        :root[data-theme="light"] .footer-copy {
          color: #475569;
        }
        :root[data-theme="light"] .cta-card,
        :root[data-theme="light"] .contact-modal {
          box-shadow: 0 14px 40px rgba(15, 23, 42, 0.12);
        }
        .nav-x-link {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(238, 240, 255, 0.35);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          text-decoration: none;
          transition:
            border-color 0.25s,
            background 0.25s,
            transform 0.2s;
        }
        .nav-x-link:hover {
          border-color: rgba(255, 255, 255, 0.85);
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-1px);
        }
        .contact-overlay {
          position: fixed;
          inset: 0;
          background: rgba(1, 2, 6, 0.62);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5000;
          padding: 20px;
        }
        .contact-modal {
          width: min(640px, 92vw);
          border-radius: 26px;
          border: 1px solid #d5dbe6;
          background: #f8f9fb;
          padding: 28px 30px 30px;
          box-shadow: 0 24px 90px rgba(3, 6, 14, 0.55);
          position: relative;
          color: #111827;
        }
        .contact-close {
          position: absolute;
          top: 20px;
          right: 20px;
          border: none;
          background: transparent;
          color: #5b6474;
          font-size: 34px;
          line-height: 1;
          cursor: none;
        }
        .contact-title {
          font-family:
            system-ui,
            -apple-system,
            Segoe UI,
            Roboto,
            Helvetica,
            Arial,
            sans-serif;
          font-size: 44px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.4px;
        }
        .contact-sub {
          font-family:
            system-ui,
            -apple-system,
            Segoe UI,
            Roboto,
            Helvetica,
            Arial,
            sans-serif;
          font-size: 20px;
          color: #5d6778;
          margin-bottom: 22px;
        }
        .contact-input {
          width: 100%;
          height: 82px;
          border-radius: 22px;
          border: 2px solid #9fc7ff;
          background: #ffffff;
          color: #0f172a;
          font-family:
            system-ui,
            -apple-system,
            Segoe UI,
            Roboto,
            Helvetica,
            Arial,
            sans-serif;
          font-size: 42px;
          padding: 0 22px;
          margin-bottom: 18px;
          outline: none;
          cursor: text;
        }
        .contact-input::placeholder {
          color: #9aa3b2;
        }
        .contact-send {
          width: 100%;
          height: 84px;
          border-radius: 22px;
          border: none;
          background: #020812;
          color: #f3f6ff;
          font-family:
            system-ui,
            -apple-system,
            Segoe UI,
            Roboto,
            Helvetica,
            Arial,
            sans-serif;
          font-size: 48px;
          font-weight: 700;
          cursor: none;
          transition: background 0.2s;
        }
        .contact-send:hover {
          background: var(--cta-blue);
          box-shadow: 0 0 24px var(--cta-blue-glow);
        }
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 140px 64px 80px;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse 78% 58% at 18% 8%,
              rgba(77, 111, 255, 0.14) 0%,
              transparent 60%
            ),
            radial-gradient(
              ellipse 62% 44% at 88% 12%,
              rgba(238, 240, 255, 0.1) 0%,
              transparent 66%
            ),
            radial-gradient(
              ellipse 60% 48% at 50% 88%,
              rgba(77, 111, 255, 0.08) 0%,
              transparent 72%
            );
          opacity: 0.55;
          mask-image: radial-gradient(
            ellipse 84% 64% at 50% 26%,
            black 40%,
            transparent 90%
          );
          animation: nebulaShift 22s ease-in-out infinite alternate;
        }
        .hero-grid::before {
          content: "";
          position: absolute;
          inset: -25%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(238, 240, 255, 0.14) 48%,
            transparent 100%
          );
          transform: skewX(-16deg);
          filter: blur(10px);
          opacity: 0.35;
          animation: scanSweep 9s ease-in-out infinite;
        }
        .hero-grid::after {
          content: "";
          position: absolute;
          width: 1200px;
          height: 1200px;
          top: -560px;
          right: -420px;
          border-radius: 50%;
          background: conic-gradient(
            from 40deg,
            rgba(238, 240, 255, 0.24) 0deg,
            rgba(238, 240, 255, 0) 38deg,
            rgba(77, 111, 255, 0.2) 60deg,
            rgba(238, 240, 255, 0) 118deg,
            rgba(238, 240, 255, 0.15) 180deg,
            rgba(238, 240, 255, 0) 240deg,
            rgba(77, 111, 255, 0.18) 300deg,
            rgba(238, 240, 255, 0.1) 360deg
          );
          filter: blur(24px);
          opacity: 0.42;
          animation: arcSpin 42s linear infinite;
        }
        @keyframes nebulaShift {
          0% {
            transform: scale(1) translateY(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.06) translateY(-8px);
            opacity: 0.7;
          }
        }
        @keyframes scanSweep {
          0%,
          100% {
            transform: translateX(-28%) skewX(-16deg);
            opacity: 0.15;
          }
          50% {
            transform: translateX(28%) skewX(-16deg);
            opacity: 0.42;
          }
        }
        @keyframes arcSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .hero-orb {
          position: absolute;
          right: -80px;
          top: 50%;
          transform: translateY(-50%);
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(238, 240, 255, 0.1) 0%,
            rgba(238, 240, 255, 0.05) 40%,
            transparent 70%
          );
          animation: orbPulse 10s ease infinite;
          pointer-events: none;
        }
        .hero-sparks {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }
        .hero-spark {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.98);
          box-shadow:
            0 0 12px rgba(255, 255, 255, 0.85),
            0 0 26px rgba(77, 111, 255, 0.7);
          mix-blend-mode: screen;
          opacity: 0;
          animation: sparkDrift 6.5s ease-in-out infinite;
        }
        .hero-spark:nth-child(1) {
          top: 16%;
          left: 18%;
          animation-delay: 0.2s;
        }
        .hero-spark:nth-child(2) {
          top: 22%;
          left: 34%;
          animation-delay: 1.1s;
        }
        .hero-spark:nth-child(3) {
          top: 12%;
          left: 56%;
          animation-delay: 2.1s;
        }
        .hero-spark:nth-child(4) {
          top: 28%;
          left: 72%;
          animation-delay: 3.2s;
        }
        .hero-spark:nth-child(5) {
          top: 40%;
          left: 26%;
          animation-delay: 4s;
        }
        .hero-spark:nth-child(6) {
          top: 48%;
          left: 46%;
          animation-delay: 4.8s;
        }
        .hero-spark:nth-child(7) {
          top: 34%;
          left: 62%;
          animation-delay: 5.6s;
        }
        .hero-spark:nth-child(8) {
          top: 54%;
          left: 78%;
          animation-delay: 6.4s;
        }
        .hero-spark:nth-child(odd) {
          width: 5px;
          height: 5px;
        }
        @keyframes sparkDrift {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, 0) scale(0.6);
          }
          35% {
            opacity: 0.95;
            transform: translate3d(10px, -14px, 0) scale(1.2);
          }
          70% {
            opacity: 0.45;
            transform: translate3d(26px, -30px, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate3d(46px, -42px, 0) scale(0.45);
          }
        }
        @keyframes orbPulse {
          0%,
          100% {
            transform: translateY(-50%) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-50%) scale(1.08);
            opacity: 1;
          }
        }
        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 36px;
          opacity: 0;
          animation: slideIn 0.8s ease 0.1s forwards;
        }
        .hero-eyebrow-line {
          width: 48px;
          height: 1px;
          background: var(--cyan);
          box-shadow: 0 0 8px var(--cyan);
        }
        .hero-eyebrow-text {
          font-size: 14px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--cyan);
        }
        .hero-h1 {
          font-weight: 900;
          font-size: clamp(52px, 7.2vw, 122px);
          line-height: 0.92;
          letter-spacing: -1px;
          opacity: 0;
          animation: slideIn 0.9s ease 0.25s forwards;
        }
        .hero-h1 .l1 {
          color: var(--white);
          display: block;
        }
        .hero-h1 .l2 {
          display: block;
          background: linear-gradient(90deg, var(--cyan), var(--teal));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 18px rgba(238, 240, 255, 0.35));
        }
        .hero-h1 .l3 {
          display: block;
          color: var(--white);
        }
        .hero-body {
          display: grid;
          grid-template-columns: minmax(520px, 1fr) minmax(420px, 560px);
          align-items: stretch;
          margin-top: 14px;
          gap: 56px;
          width: 100%;
          max-width: none;
          opacity: 0;
          animation: slideIn 0.9s ease 0.45s forwards;
        }
        .hero-copy {
          display: grid;
          align-content: start;
          gap: 30px;
          padding-top: 6px;
        }
        .hero-flow {
          margin-top: 0;
          width: 100%;
          justify-self: end;
          border: 1px solid rgba(238, 240, 255, 0.16);
          border-radius: 20px;
          background: linear-gradient(
            145deg,
            rgba(10, 14, 26, 0.5),
            rgba(3, 6, 14, 0.34)
          );
          backdrop-filter: blur(10px);
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 18px;
          min-height: 420px;
          position: relative;
          opacity: 0;
          animation: slideIn 0.9s ease 0.52s forwards;
        }
        .hero-flow::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            rgba(77, 111, 255, 0.12),
            transparent 35%,
            transparent 65%,
            rgba(77, 111, 255, 0.12)
          );
          pointer-events: none;
        }
        .flow-lane {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 10px;
          border: 1px solid rgba(238, 240, 255, 0.1);
          border-radius: 14px;
          background: rgba(2, 4, 8, 0.42);
          padding: 20px;
        }
        .flow-label {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(232, 244, 248, 0.58);
        }
        .flow-amount {
          font-size: 44px;
          letter-spacing: 1px;
          color: var(--white);
        }
        .flow-amount.dec {
          color: rgba(238, 240, 255, 0.84);
        }
        .flow-amount.inc {
          color: var(--cta-blue);
          text-shadow: 0 0 14px rgba(77, 111, 255, 0.35);
        }
        .flow-rail {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 11px;
          letter-spacing: 3px;
          color: rgba(232, 244, 248, 0.7);
          text-transform: uppercase;
          text-align: center;
        }
        .flow-rail::before,
        .flow-rail::after {
          content: "";
          width: 1px;
          height: 54px;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(77, 111, 255, 0.55),
            transparent
          );
        }
        .flow-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--cta-blue);
          box-shadow: 0 0 12px rgba(77, 111, 255, 0.55);
          animation: flowPulse 1.8s ease infinite;
        }
        @keyframes flowPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(0.66);
            opacity: 0.45;
          }
        }
        .hero-desc {
          font-size: 22px;
          line-height: 1.65;
          color: rgba(232, 244, 248, 0.5);
          max-width: 700px;
          font-weight: 400;
          margin: 0;
        }
        .hero-btns {
          display: flex;
          gap: 16px;
          flex-shrink: 0;
        }
        .btn-primary,
        .btn-outline,
        .btn-sm {
          text-decoration: none;
          display: inline-block;
        }
        .text-blue-key {
          color: var(--cta-blue) !important;
          text-shadow: 0 0 14px var(--cta-blue-glow);
        }
        .btn-blue-key {
          background: var(--cta-blue) !important;
          border-color: var(--cta-blue) !important;
          color: #eef0ff !important;
          box-shadow:
            0 0 26px var(--cta-blue-glow),
            inset 0 0 18px rgba(255, 255, 255, 0.08);
        }
        .btn-primary {
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--bg);
          background: var(--cyan);
          padding: 18px 40px;
          border: none;
          cursor: none;
          box-shadow:
            0 0 30px var(--cta-blue-glow),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
          transition:
            box-shadow 0.3s,
            transform 0.2s;
        }
        .btn-primary:hover {
          background: var(--cta-blue);
          color: #ffffff;
          border-color: var(--cta-blue);
          box-shadow:
            0 0 60px var(--cta-blue-glow),
            inset 0 0 30px rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        .btn-outline {
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--cta-blue);
          background: transparent;
          padding: 18px 40px;
          border: 1px solid var(--cta-blue-glow);
          cursor: none;
          transition:
            background 0.3s,
            transform 0.2s;
        }
        .btn-outline:hover {
          background: var(--cta-blue);
          border-color: var(--cta-blue);
          color: #ffffff;
          transform: translateY(-2px);
        }
        .hero-status {
          position: absolute;
          bottom: 40px;
          left: 64px;
          right: 64px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          opacity: 0;
          animation: slideIn 0.9s ease 0.65s forwards;
        }
        .status-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          background: var(--cyan);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--cyan);
          animation: blink 2s ease infinite;
        }
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        .status-text,
        .status-right {
          font-size: 13px;
          letter-spacing: 2px;
        }
        .status-text {
          color: var(--muted);
        }
        .status-right {
          color: rgba(238, 240, 255, 0.28);
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .marquee-wrap {
          overflow: hidden;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: var(--bg2);
          padding: 14px 0;
          position: relative;
          z-index: 1;
        }
        .marquee-track {
          display: flex;
          white-space: nowrap;
          animation: marq 30s linear infinite;
        }
        .marquee-item {
          font-size: 14px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--muted);
          padding: 0 32px;
        }
        .marquee-item span {
          color: var(--cyan);
          margin: 0 8px;
        }
        @keyframes marq {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
          z-index: 1;
        }
        .stat {
          padding: 52px 48px;
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          transition: background 0.4s;
        }
        .stat:hover {
          background: rgba(238, 240, 255, 0.05);
        }
        .stat::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--cyan2), var(--cyan));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s;
        }
        .stat:hover::after {
          transform: scaleX(1);
        }
        .stat-val {
          font-weight: 900;
          font-size: 48px;
          color: var(--white);
          text-shadow: 0 0 14px rgba(238, 240, 255, 0.22);
        }
        .stat-lbl {
          font-size: 13px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 8px;
        }
        .section {
          padding: 120px 64px;
          position: relative;
          z-index: 1;
        }
        section#products.section {
          padding-bottom: 48px;
        }
        section#protocol.section {
          padding-top: 56px;
        }
        .section-eyebrow {
          font-size: 14px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--cyan);
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 48px;
        }
        .section-eyebrow::before {
          content: "//";
          color: rgba(238, 240, 255, 0.35);
        }
        .section-h2 {
          font-weight: 900;
          font-size: clamp(40px, 5vw, 80px);
          line-height: 0.95;
          color: var(--white);
          margin-bottom: 80px;
        }
        .section-h2 em {
          font-style: normal;
          background: linear-gradient(90deg, var(--cyan2), var(--cyan));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .products-bg {
          background: var(--bg2);
          border-top: 1px solid var(--border);
        }
        .product-showcase {
          display: grid;
          gap: 22px;
        }
        .product-row {
          display: grid;
          grid-template-columns: minmax(280px, 0.9fr) minmax(400px, 1.1fr);
          gap: 28px;
          border: 1px solid var(--border);
          background: linear-gradient(
            145deg,
            rgba(7, 10, 18, 0.98),
            rgba(3, 6, 13, 0.95)
          );
          border-radius: 26px;
          padding: 38px;
          position: relative;
          overflow: hidden;
        }
        .product-row.wallet-row {
          background: linear-gradient(
            145deg,
            rgba(14, 18, 30, 0.98),
            rgba(7, 10, 18, 0.95)
          );
        }
        .product-row.gateway-row {
          background: linear-gradient(
            145deg,
            rgba(16, 20, 34, 0.98),
            rgba(8, 11, 20, 0.95)
          );
        }
        .product-row::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 90% 20%,
            rgba(238, 240, 255, 0.12) 0,
            transparent 38%
          );
          pointer-events: none;
        }
        .product-row.wallet-row::before {
          background: radial-gradient(
            circle at 86% 16%,
            rgba(215, 235, 255, 0.22) 0,
            transparent 42%
          );
        }
        .product-row.gateway-row::before {
          background: radial-gradient(
            circle at 86% 16%,
            rgba(225, 230, 255, 0.2) 0,
            transparent 44%
          );
        }
        .product-row::after {
          content: "";
          position: absolute;
          inset: -20%;
          background: linear-gradient(
            118deg,
            transparent 34%,
            rgba(238, 244, 255, 0.12) 47%,
            rgba(77, 111, 255, 0.2) 52%,
            rgba(238, 244, 255, 0.1) 58%,
            transparent 70%
          );
          transform: translateX(-65%) rotate(4deg);
          animation: diamondSweep 8.5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes diamondSweep {
          0%,
          100% {
            transform: translateX(-65%) rotate(4deg);
            opacity: 0.2;
          }
          45% {
            transform: translateX(25%) rotate(4deg);
            opacity: 0.75;
          }
          60% {
            transform: translateX(32%) rotate(4deg);
            opacity: 0.35;
          }
        }
        .product-copy {
          position: relative;
          z-index: 1;
        }
        .product-type {
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(238, 240, 255, 0.66);
          margin-bottom: 18px;
        }
        .product-name {
          font-weight: 900;
          font-size: clamp(34px, 4.2vw, 58px);
          letter-spacing: 1px;
          color: var(--white);
          line-height: 1.02;
          margin-bottom: 18px;
        }
        .product-name .accent {
          color: var(--cyan);
          text-shadow: 0 0 16px rgba(238, 240, 255, 0.3);
        }
        .product-row.wallet-row .product-name .accent {
          color: #f0f5ff;
          text-shadow: 0 0 14px rgba(77, 111, 255, 0.35);
        }
        .product-row.gateway-row .product-name .accent {
          color: #eef3ff;
          text-shadow: 0 0 14px rgba(77, 111, 255, 0.35);
        }
        .product-p {
          font-size: clamp(34px, 3.1vw, 50px);
          line-height: 1.16;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--white);
          max-width: 460px;
          margin-bottom: 16px;
        }
        .product-subcopy {
          font-size: 18px;
          line-height: 1.72;
          letter-spacing: 0.01em;
          color: rgba(232, 244, 248, 0.62);
          max-width: 460px;
          margin-bottom: 26px;
        }
        .product-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 26px;
          border-radius: 999px;
          border: 1px solid var(--border-bright);
          color: var(--white);
          text-decoration: none;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          background: rgba(2, 49, 255, 0.12);
          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }
        .product-cta:hover {
          background: var(--cta-blue);
          border-color: var(--cta-blue);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 0 18px rgba(238, 240, 255, 0.25);
        }
        .product-row.wallet-row .product-cta {
          border-color: rgba(77, 111, 255, 0.6);
          background: rgba(77, 111, 255, 0.26);
        }
        .product-row.wallet-row .product-cta:hover {
          box-shadow: 0 0 24px rgba(77, 111, 255, 0.42);
        }
        .product-row.gateway-row .product-cta {
          border-color: rgba(77, 111, 255, 0.52);
          background: rgba(77, 111, 255, 0.18);
        }
        .product-row.gateway-row .product-cta:hover {
          box-shadow: 0 0 22px rgba(77, 111, 255, 0.34);
        }
        .product-visual {
          position: relative;
          z-index: 1;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: linear-gradient(
            160deg,
            rgba(13, 16, 26, 0.96),
            rgba(6, 8, 16, 0.94)
          );
          padding: 24px;
          min-height: 320px;
          overflow: hidden;
        }
        .product-row.wallet-row .product-visual {
          background: linear-gradient(
            160deg,
            rgba(19, 25, 39, 0.95),
            rgba(8, 12, 24, 0.94)
          );
        }
        .product-row.gateway-row .product-visual {
          background: linear-gradient(
            160deg,
            rgba(20, 24, 41, 0.95),
            rgba(10, 13, 27, 0.94)
          );
        }
        .wallet-visual {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          align-items: center;
        }
        .wallet-card {
          border: 1px solid rgba(238, 240, 255, 0.2);
          border-radius: 18px;
          min-height: 190px;
          background: linear-gradient(
            130deg,
            rgba(22, 24, 35, 1),
            rgba(7, 8, 14, 0.95)
          );
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .product-row.wallet-row .wallet-card {
          border-color: rgba(210, 228, 255, 0.35);
          box-shadow:
            inset 0 0 26px rgba(210, 228, 255, 0.09),
            0 0 20px rgba(77, 111, 255, 0.12);
        }
        .wallet-balance {
          font-size: 48px;
          letter-spacing: 1px;
          color: var(--white);
        }
        .wallet-balance::after {
          content: "";
          animation: balanceTick 6s steps(1, end) infinite;
        }
        @keyframes balanceTick {
          0%,
          20% {
            content: "9";
          }
          21%,
          40% {
            content: "3";
          }
          41%,
          60% {
            content: "6";
          }
          61%,
          80% {
            content: "1";
          }
          81%,
          100% {
            content: "8";
          }
        }
        .wallet-label {
          font-size: 12px;
          letter-spacing: 3px;
          color: rgba(232, 244, 248, 0.55);
          text-transform: uppercase;
        }
        .wallet-chat {
          display: grid;
          gap: 12px;
        }
        .chat-pill {
          border-radius: 16px;
          padding: 14px 16px;
          font-size: 15px;
          line-height: 1.45;
        }
        .chat-pill.prompt {
          background: rgba(238, 240, 255, 0.08);
          color: var(--white);
        }
        .chat-pill.action {
          background: rgba(238, 240, 255, 0.04);
          color: rgba(232, 244, 248, 0.78);
        }
        .chat-pill.spend {
          color: var(--white);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding-left: 0;
          background: transparent;
        }
        .chat-pill.spend::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 10px rgba(238, 240, 255, 0.55);
          animation: spendPulse 1.8s ease infinite;
        }
        @keyframes spendPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(0.62);
            opacity: 0.45;
          }
        }
        .wall-visual {
          display: grid;
          grid-template-rows: auto auto;
          gap: 16px;
        }
        .earnings-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .earnings-label {
          letter-spacing: 4px;
          font-size: 12px;
          color: rgba(232, 244, 248, 0.55);
          text-transform: uppercase;
        }
        .earnings-value {
          font-size: 62px;
          color: var(--white);
          line-height: 0.95;
        }
        .chart-wrap {
          position: relative;
          height: 136px;
          border-radius: 14px;
          border: 1px solid rgba(238, 240, 255, 0.14);
          background: linear-gradient(
            180deg,
            rgba(238, 240, 255, 0.08),
            rgba(238, 240, 255, 0.02)
          );
          overflow: hidden;
        }
        .product-row.gateway-row .chart-wrap {
          border-color: rgba(198, 217, 255, 0.34);
          background: linear-gradient(
            180deg,
            rgba(215, 230, 255, 0.16),
            rgba(77, 111, 255, 0.05)
          );
        }
        .chart-line {
          position: absolute;
          inset: auto 0 0 0;
          height: 88%;
          background: linear-gradient(
            180deg,
            rgba(2, 49, 255, 0.18),
            rgba(2, 49, 255, 0.02)
          );
          clip-path: polygon(
            0% 88%,
            10% 87%,
            22% 83%,
            34% 82%,
            46% 74%,
            58% 68%,
            70% 62%,
            82% 49%,
            92% 40%,
            100% 34%,
            100% 100%,
            0% 100%
          );
        }
        .product-row.gateway-row .chart-line {
          background: linear-gradient(
            180deg,
            rgba(208, 224, 255, 0.22),
            rgba(77, 111, 255, 0.05)
          );
        }
        .chart-line::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.16) 42%,
            transparent 82%
          );
          transform: translateX(-100%);
          animation: chartSweep 4.2s linear infinite;
        }
        @keyframes chartSweep {
          to {
            transform: translateX(100%);
          }
        }
        .chart-stroke {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to top, transparent 10%, transparent 10%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 44' preserveAspectRatio='none'%3E%3Cpath d='M0 39 L10 38 L22 36 L34 35 L46 30 L58 27 L70 24 L82 19 L92 15 L100 13' fill='none' stroke='%23eef0ff' stroke-width='1.8'/%3E%3C/svg%3E")
              center/100% 100% no-repeat;
        }
        .ledger {
          border: 1px solid rgba(238, 240, 255, 0.14);
          border-radius: 12px;
          overflow: hidden;
        }
        .ledger-item {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 18px;
          align-items: center;
          padding: 12px 14px;
          font-size: 14px;
          color: rgba(232, 244, 248, 0.72);
          border-bottom: 1px solid rgba(238, 240, 255, 0.12);
          background: rgba(238, 240, 255, 0.03);
        }
        .ledger-item:last-child {
          border-bottom: none;
        }
        .ledger-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ledger-left::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(238, 240, 255, 0.95);
          box-shadow: 0 0 10px rgba(238, 240, 255, 0.45);
        }
        .ledger-item:nth-child(2) .ledger-left::before {
          animation: dotBlink 1.9s ease infinite;
        }
        .ledger-item:nth-child(3) {
          opacity: 0.55;
        }
        @keyframes dotBlink {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.7);
          }
        }
        .how-wrap {
          border: 1px solid var(--border);
          border-radius: 18px;
          background: rgba(238, 240, 255, 0.02);
          padding: 24px;
          display: grid;
          gap: 18px;
        }
        .how-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }
        .how-step {
          border: 1px solid rgba(238, 240, 255, 0.12);
          border-radius: 12px;
          padding: 14px;
          background: rgba(238, 240, 255, 0.02);
        }
        .how-num {
          font-size: 12px;
          letter-spacing: 2px;
          color: rgba(232, 244, 248, 0.6);
          margin-bottom: 8px;
        }
        .how-title {
          font-size: 16px;
          color: var(--white);
          margin-bottom: 6px;
          font-weight: 700;
        }
        .how-text {
          font-size: 13px;
          line-height: 1.55;
          color: var(--muted);
        }
        .how-example {
          border: 1px solid rgba(238, 240, 255, 0.12);
          border-radius: 12px;
          padding: 14px 16px;
          background: rgba(238, 240, 255, 0.02);
          font-size: 13px;
          line-height: 1.6;
          color: rgba(232, 244, 248, 0.8);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        .feat {
          background: var(--bg2);
          border: 1px solid var(--border);
          padding: 52px 48px;
          display: flex;
          gap: 28px;
          align-items: flex-start;
          position: relative;
          overflow: hidden;
          transition: background 0.3s;
          cursor: none;
        }
        .feat:hover {
          background: var(--bg3);
        }
        .feat-icon {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 15px;
          color: var(--white);
          transition:
            border-color 0.3s,
            box-shadow 0.3s,
            color 0.3s,
            background 0.3s;
        }
        .feat:hover .feat-icon {
          border-color: var(--cta-blue);
          color: var(--cta-blue);
          background: rgba(77, 111, 255, 0.1);
          box-shadow: 0 0 20px var(--cta-blue-glow);
        }
        .feat-title {
          font-weight: 700;
          font-size: 17px;
          color: var(--white);
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }
        .feat-desc {
          font-size: 14px;
          line-height: 1.85;
          color: var(--muted);
        }
        .why-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
          align-items: center;
        }
        .why-list {
          list-style: none;
          margin-top: 8px;
        }
        .why-item {
          padding: 24px 0;
          border-bottom: 1px solid var(--border);
          display: flex;
          gap: 20px;
          align-items: center;
          font-size: 18px;
          color: rgba(232, 244, 248, 0.5);
          transition: color 0.3s;
          cursor: none;
        }
        .why-item:hover {
          color: var(--white);
        }
        .why-item-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.3s;
        }
        .why-item:hover .why-item-icon {
          border-color: var(--cyan-glow);
        }
        .why-item-icon svg {
          width: 14px;
          height: 14px;
          stroke: var(--cyan);
          fill: none;
          stroke-width: 1.5;
        }
        .holo-card {
          border: 1px solid var(--border);
          position: relative;
          padding: 56px 48px;
          background: linear-gradient(
            135deg,
            rgba(238, 240, 255, 0.06) 0%,
            rgba(238, 240, 255, 0.03) 50%,
            rgba(238, 240, 255, 0.06) 100%
          );
          overflow: hidden;
        }
        .holo-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(238, 240, 255, 0.02) 20px,
            rgba(238, 240, 255, 0.02) 21px
          );
        }
        .holo-title {
          font-weight: 900;
          font-size: 30px;
          color: var(--white);
          margin-bottom: 20px;
          position: relative;
        }
        .holo-sub {
          font-size: 15px;
          line-height: 1.9;
          color: var(--muted);
          margin-bottom: 32px;
          position: relative;
        }
        .holo-badge {
          display: inline-block;
          font-size: 13px;
          letter-spacing: 2px;
          color: var(--cyan);
          border: 1px solid rgba(238, 240, 255, 0.35);
          padding: 7px 16px;
          margin-bottom: 32px;
          box-shadow: 0 0 12px rgba(238, 240, 255, 0.18);
          position: relative;
        }
        .cta-section {
          padding: 140px 64px;
          position: relative;
          overflow: hidden;
          z-index: 1;
          background: linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%);
          border-top: 1px solid var(--border);
        }
        .cta-glow {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse,
            rgba(2, 49, 255, 0.1) 0%,
            transparent 70%
          );
          pointer-events: none;
        }
        .cta-inner {
          position: relative;
          text-align: center;
        }
        .cta-h2 {
          font-weight: 900;
          font-size: clamp(48px, 6vw, 100px);
          line-height: 0.9;
          margin-bottom: 24px;
        }
        .cta-h2 span {
          background: linear-gradient(
            90deg,
            var(--cta-blue),
            var(--white),
            var(--cta-blue-2)
          );
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s ease infinite;
        }
        @keyframes shimmer {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .cta-sub {
          font-size: 19px;
          color: rgba(232, 244, 248, 0.45);
          max-width: 520px;
          margin: 0 auto 56px;
          line-height: 1.7;
        }
        .cta-btns {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 900px;
          margin: 80px auto 0;
        }
        .cta-card {
          border: 1px solid var(--border);
          padding: 40px;
          text-align: left;
          position: relative;
          overflow: hidden;
          transition:
            border-color 0.3s,
            background 0.3s;
        }
        .cta-card:hover {
          border-color: var(--border-bright);
          background: rgba(0, 245, 255, 0.03);
        }
        .cta-card-label {
          font-size: 13px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--cta-blue);
          margin-bottom: 16px;
        }
        .cta-card-title {
          font-weight: 700;
          font-size: 20px;
          color: var(--white);
          margin-bottom: 12px;
        }
        .cta-card-desc {
          font-size: 14px;
          line-height: 1.8;
          color: var(--muted);
          margin-bottom: 28px;
        }
        .btn-sm {
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--cta-blue);
          background: transparent;
          padding: 12px 24px;
          border: 1px solid var(--cta-blue-glow);
          cursor: none;
          transition:
            background 0.2s,
            color 0.2s;
        }
        .btn-sm:hover {
          background: var(--cta-blue);
          color: #ffffff;
        }
        .btn-sm.text-blue-key:hover {
          color: #ffffff !important;
        }
        footer {
          border-top: 1px solid var(--border);
          padding: 48px 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
          background: var(--bg);
        }
        .footer-logo {
          font-weight: 900;
          font-size: 18px;
          letter-spacing: 6px;
          color: var(--cyan);
          text-shadow: 0 0 14px var(--cyan-glow);
        }
        .footer-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }
        .footer-links a {
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.3s;
        }
        .footer-links a:hover {
          color: var(--cyan);
        }
        .footer-copy {
          font-size: 13px;
          color: rgba(74, 122, 138, 0.5);
          letter-spacing: 1px;
        }
        .reveal {
          opacity: 0;
          transform: translateY(36px);
          transition:
            opacity 0.9s ease,
            transform 0.9s ease;
        }
        .reveal.on {
          opacity: 1;
          transform: none;
        }
        @media (max-width: 900px) {
          nav {
            padding: 20px 24px;
          }
          .nav-links {
            display: none;
          }
          .hero {
            padding: 120px 24px 60px;
          }
          .hero-body {
            grid-template-columns: 1fr;
            align-items: flex-start;
            gap: 22px;
            margin-top: 20px;
          }
          .hero-copy {
            gap: 22px;
            padding-top: 0;
          }
          .hero-flow {
            width: 100%;
            justify-self: stretch;
            margin-top: 8px;
            padding: 16px;
            min-height: 0;
            display: grid;
            gap: 12px;
          }
          .flow-lane {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            padding: 14px;
          }
          .flow-amount {
            font-size: 34px;
          }
          .flow-rail {
            flex-direction: row;
            font-size: 10px;
            gap: 8px;
          }
          .flow-rail::before,
          .flow-rail::after {
            width: auto;
            height: 1px;
            flex: 1;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(77, 111, 255, 0.55),
              transparent
            );
          }
          .hero-status {
            left: 24px;
            right: 24px;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .section {
            padding: 80px 24px;
          }
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .product-row,
          .wallet-visual,
          .wall-visual,
          .cta-cards {
            grid-template-columns: 1fr;
          }
          .product-row {
            padding: 28px 22px;
          }
          .product-visual {
            min-height: 0;
          }
          .product-p {
            font-size: 32px;
            line-height: 1.2;
          }
          .product-subcopy {
            font-size: 16px;
            line-height: 1.65;
          }
          .earnings-value {
            font-size: 46px;
          }
          .how-grid {
            grid-template-columns: 1fr;
          }
          .why-inner {
            grid-template-columns: 1fr;
          }
          footer {
            flex-direction: column;
            gap: 24px;
            text-align: center;
          }
        }
      `}</style>

      <main className={rajdhani.className}>
        <div className="bg-mesh" />
        <div id="cur" />
        <div id="cur-ring" />

        <nav className={shareTechMono.className}>
          <a href="#" className={`${orbitron.className} nav-logo`}>
            ACTUM
            <span
              style={{
                fontSize: "0.55em",
                color: "#ffffff",
                verticalAlign: "middle",
                textShadow: "none",
                letterSpacing: "2px",
              }}
            >
              x
            </span>
          </a>
          <ul className="nav-links">
            <li>
              <a href="#wallet">Wallets</a>
            </li>
            <li>
              <a href="#gateway">Gateway</a>
            </li>
            <li>
              <a href="#protocol">Docs</a>
            </li>
            <li>
              <button type="button" onClick={() => setContactOpen(true)}>
                Contact
              </button>
            </li>
          </ul>
          <div className="nav-actions">
            <a
              href="https://x.com/intent/follow?screen_name=Actumx"
              target="_blank"
              rel="noreferrer"
              className="nav-x-link"
              aria-label="Follow Actumx on X"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.29 19.494h2.04L6.486 3.24H4.298l13.313 17.407Z" />
              </svg>
            </a>
            <Link
              href="/login"
              className="nav-btn text-blue-key pointer-events-none"
            >
              Launch App
            </Link>
          </div>
        </nav>
        {contactOpen && (
          <div
            className="contact-overlay"
            onClick={() => setContactOpen(false)}
          >
            <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="contact-close"
                onClick={() => setContactOpen(false)}
                aria-label="Close contact form"
              >
                ×
              </button>
              <div className="contact-title">Talk to Actumx</div>
              <div className="contact-sub">
                Leave an email and we&apos;ll reach out.
              </div>
              <form onSubmit={onContactSubmit}>
                <input
                  type="email"
                  className="contact-input"
                  placeholder="you@company.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
                <button type="submit" className="contact-send">
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        <section className="hero">
          <div className="hero-grid" />
          <div className="hero-orb" />
          <div className="hero-sparks">
            <span className="hero-spark" />
            <span className="hero-spark" />
            <span className="hero-spark" />
            <span className="hero-spark" />
            <span className="hero-spark" />
            <span className="hero-spark" />
            <span className="hero-spark" />
            <span className="hero-spark" />
          </div>
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-line" />
            <span className={`${shareTechMono.className} hero-eyebrow-text`}>
              The Payment Rail for the Agentic Economy
            </span>
          </div>
          <div className="hero-body">
            <div className="hero-copy">
              <h1 className={`${orbitron.className} hero-h1`}>
                <span className="l1 text-blue-key">WALLET</span>
                <span className="l2">FOR AI</span>
                <span className="l3">AGENTS</span>
              </h1>
              <p className="hero-desc">
                Actumx gives AI agents a native wallet to discover, pay, and
                transact across the internet without human intervention. If an
                agent can call an API, it can pay for it.
              </p>
            </div>
            <div className={`${shareTechMono.className} hero-flow`}>
              <div className="flow-lane">
                <span className="flow-label">Agent Wallet Spend</span>
                <span
                  id="agent-spend-amount"
                  className={`${orbitron.className} flow-amount dec`}
                >
                  $49.00
                </span>
              </div>
              <div className="flow-rail">
                <span className="flow-dot" />
                x402 protocol settlement rail
              </div>
              <div className="flow-lane">
                <span className="flow-label">
                  Business Earnings from API calls
                </span>
                <span
                  id="business-earn-amount"
                  className={`${orbitron.className} flow-amount inc`}
                >
                  $88.00
                </span>
              </div>
            </div>
          </div>
          <div className="hero-status">
            <div className="status-left">
              <div className="status-dot" />
              <span className={`${shareTechMono.className} status-text`}>
                NETWORK ONLINE — x402 PROTOCOL ACTIVE
              </span>
            </div>
            <span className={`${shareTechMono.className} status-right`}>
              BUILD 2026.02.19 // v1.0.0
            </span>
          </div>
        </section>

        <div className="marquee-wrap">
          <div className={`${shareTechMono.className} marquee-track`}>
            <span className="marquee-item">
              Autonomous Payments <span>{"///"}</span>
            </span>
            <span className="marquee-item">
              x402 Protocol <span>{"///"}</span>
            </span>
            <span className="marquee-item">
              Pay Per Request APIs <span>{"///"}</span>
            </span>
            <span className="marquee-item">
              Microtransactions from $0.001 <span>{"///"}</span>
            </span>
            <span className="marquee-item">
              No Accounts. No Subscriptions. <span>{"///"}</span>
            </span>
            <span className="marquee-item">
              Instant Access. Pure Execution. <span>{"///"}</span>
            </span>
            <span className="marquee-item">
              Autonomous Payments <span>{"///"}</span>
            </span>
            <span className="marquee-item">
              x402 Protocol <span>{"///"}</span>
            </span>
            <span className="marquee-item">
              Pay Per Request APIs <span>{"///"}</span>
            </span>
            <span className="marquee-item">
              Microtransactions from $0.001 <span>{"///"}</span>
            </span>
            <span className="marquee-item">
              No Accounts. No Subscriptions. <span>{"///"}</span>
            </span>
            <span className="marquee-item">
              Instant Access. Pure Execution. <span>{"///"}</span>
            </span>
          </div>
        </div>

        <div className="stats reveal">
          <div className="stat">
            <div className={`${orbitron.className} stat-val`}>$0.001</div>
            <div className={`${shareTechMono.className} stat-lbl`}>
              Min Transaction Size
            </div>
          </div>
          <div className="stat">
            <div className={`${orbitron.className} stat-val`}>HTTP 402</div>
            <div className={`${shareTechMono.className} stat-lbl`}>
              Native Protocol
            </div>
          </div>
          <div className="stat">
            <div className={`${orbitron.className} stat-val`}>0ms</div>
            <div className={`${shareTechMono.className} stat-lbl`}>
              Auth Friction
            </div>
          </div>
          <div className="stat">
            <div className={`${orbitron.className} stat-val`}>∞</div>
            <div className={`${shareTechMono.className} stat-lbl`}>
              API Endpoints
            </div>
          </div>
        </div>

        <section className="section products-bg" id="products">
          <div className="product-showcase reveal">
            <div className="product-row wallet-row" id="wallet">
              <div className="product-copy">
                <div className={`${shareTechMono.className} product-type`}>
                  For Agents
                </div>
                <div className={`${orbitron.className} product-name`}>
                  <span className="accent">Wallet</span>
                </div>
                <p className="product-p">Give your agent an account.</p>
                <p className="product-subcopy">
                  Let your AI autonomously pay for services across the internet.
                  If an agent can call an API, it can settle and execute
                  instantly.
                </p>
                <Link
                  href="/login"
                  className={`${shareTechMono.className} product-cta pointer-events-none`}
                >
                  Launch Wallet →
                </Link>
              </div>
              <div className="product-visual wallet-visual">
                <div className="wallet-card">
                  <div className={`${shareTechMono.className} wallet-label`}>
                    ACTUMx Wallet // Agent Account
                  </div>
                  <div className={`${orbitron.className} wallet-balance`}>
                    $49.0
                  </div>
                  <div className={`${shareTechMono.className} wallet-label`}>
                    ERIC&apos;S AGENT
                  </div>
                </div>
                <div className={`${shareTechMono.className} wallet-chat`}>
                  <div className="chat-pill prompt">
                    Scrape pricing data from 100 competitor websites.
                  </div>
                  <div className="chat-pill action">
                    Using WebScrape API to process all 100 sites in parallel.
                  </div>
                  <div className="chat-pill spend">Spent $1</div>
                </div>
              </div>
            </div>

            <div className="product-row gateway-row" id="gateway">
              <div className="product-copy">
                <div className={`${shareTechMono.className} product-type`}>
                  For Businesses
                </div>
                <div className={`${orbitron.className} product-name`}>
                  <span className="accent">Gateway</span>
                </div>
                <p className="product-p">Sell directly to agents.</p>
                <p className="product-subcopy">
                  Turn any API into programmable revenue with x402 payments.
                  Onboard once, then earn from autonomous agent calls without
                  manual billing.
                </p>
                <Link
                  href="/dashboard"
                  className={`${shareTechMono.className} product-cta pointer-events-none`}
                >
                  Launch Gateway →
                </Link>
              </div>
              <div className="product-visual wall-visual">
                <div>
                  <div className="earnings-head">
                    <div
                      className={`${shareTechMono.className} earnings-label`}
                    >
                      Earnings
                    </div>
                    <div className={`${orbitron.className} earnings-value`}>
                      $0.20
                    </div>
                  </div>
                  <div className="chart-wrap">
                    <div className="chart-line" />
                    <div className="chart-stroke" />
                  </div>
                </div>
                <div className={`${shareTechMono.className} ledger`}>
                  <div className="ledger-item">
                    <div className="ledger-left">Agent #576 /v1/scrape</div>
                    <div>$0.05</div>
                  </div>
                  <div className="ledger-item">
                    <div className="ledger-left">Agent #3301 /v1/scrape</div>
                    <div>$0.05</div>
                  </div>
                  <div className="ledger-item">
                    <div className="ledger-left">Agent #892 /v1/scrape</div>
                    <div>$0.05</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="protocol">
          <div className={`${shareTechMono.className} section-eyebrow`}>
            Protocol
          </div>
          <h2 className={`${orbitron.className} section-h2 reveal`}>
            HOW IT <em>WORKS</em>
          </h2>
          <div className="how-wrap reveal">
            <div className="how-grid">
              <div className="how-step">
                <div className={`${shareTechMono.className} how-num`}>01</div>
                <div className={`${orbitron.className} how-title`}>
                  Agent Requests
                </div>
                <div className={`${shareTechMono.className} how-text`}>
                  Agent calls your API endpoint normally.
                </div>
              </div>
              <div className="how-step">
                <div className={`${shareTechMono.className} how-num`}>02</div>
                <div className={`${orbitron.className} how-title`}>
                  Server Returns 402
                </div>
                <div className={`${shareTechMono.className} how-text`}>
                  Response includes price and payment details.
                </div>
              </div>
              <div className="how-step">
                <div className={`${shareTechMono.className} how-num`}>03</div>
                <div className={`${orbitron.className} how-title`}>
                  Wallet Pays
                </div>
                <div className={`${shareTechMono.className} how-text`}>
                  Agent wallet signs and sends payment.
                </div>
              </div>
              <div className="how-step">
                <div className={`${shareTechMono.className} how-num`}>04</div>
                <div className={`${orbitron.className} how-title`}>
                  Access Granted
                </div>
                <div className={`${shareTechMono.className} how-text`}>
                  API returns the paid response instantly.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-glow" />
          <div className="cta-inner reveal">
            <h2 className={`${orbitron.className} cta-h2`}>
              <span>
                ACTIVATE
                <br />
                AGENT COMMERCE
              </span>
            </h2>
            <p className="cta-sub">
              Join the frontier of the agentic economy. Deploy in minutes. Earn
              from day one. No accounts needed.
            </p>
            <div className="cta-cards">
              <div className="cta-card">
                <div className={`${shareTechMono.className} cta-card-label`}>
                  {"// For Agents"}
                </div>
                <div className={`${orbitron.className} cta-card-title`}>
                  Agentic Wallet
                </div>
                <div className={`${shareTechMono.className} cta-card-desc`}>
                  Spin up an x402 wallet and start paying across the open
                  internet. Your agents become economically sovereign.
                </div>
                <Link
                  href="/login"
                  className={`${shareTechMono.className} btn-sm text-blue-key pointer-events-none`}
                >
                  Create Wallet →
                </Link>
              </div>
              <div className="cta-card">
                <div className={`${shareTechMono.className} cta-card-label`}>
                  {"// For Builders"}
                </div>
                <div className={`${orbitron.className} cta-card-title`}>
                  API Monetization
                </div>
                <div className={`${shareTechMono.className} cta-card-desc`}>
                  Turn any API or digital resource into a revenue stream with
                  programmable payments. Deploy and earn in minutes.
                </div>
                <Link
                  href="/dashboard"
                  className={`${shareTechMono.className} btn-sm pointer-events-none`}
                >
                  List Your API →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className={shareTechMono.className}>
          <div className={`${orbitron.className} footer-logo`}>
            ACTUM
            <span
              style={{
                fontSize: "0.55em",
                color: "#ffffff",
                verticalAlign: "middle",
                textShadow: "none",
                letterSpacing: "2px",
              }}
            >
              x
            </span>
          </div>
          <ul className="footer-links">
            <li>
              <Link href="/docs">Docs</Link>
            </li>
            <li>
              <Link href="/protocol">Protocol</Link>
            </li>
            <li>
              <Link href="/status">Status</Link>
            </li>
          </ul>
          <div className="footer-copy">
            © 2026 ACTUMX. ALL RIGHTS RESERVED.
          </div>
        </footer>
      </main>
    </>
  );
}

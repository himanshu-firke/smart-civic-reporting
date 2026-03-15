import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../auth/authStorage";

import { Header } from "../components/Header";
import { HeroSection } from "../components/ui/hero-section-dark";
import { IssueTrackingSection } from "../components/IssueTrackingSection";
import { AdminManagementSection } from "../components/AdminManagementSection";
import { Features } from "../components/Features";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";

export function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    if (auth?.token) {
      navigate('/app', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <IssueTrackingSection />
        <AdminManagementSection />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import LeadPopup from "@/components/layout/LeadPopup";
import HomePage from "@/components/home/HomePage";

export default function Page() {
  return (
    <>
      <Navbar />
      <HomePage />
      <Footer />
      <MobileCTA />
      <LeadPopup />
    </>
  );
}

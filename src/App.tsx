import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import ImportAudit from "./pages/ImportAudit";
import GenerateLetters from "./pages/GenerateLetters";
import DisputeItems from "./pages/DisputeItems";
import Educate from "./pages/Educate";
import Invoice from "./pages/Invoice";
import CreditReportPreview from "./pages/CreditReportPreview";
import Schedule from "./pages/Schedule";
import MyCompany from "./pages/MyCompany";
import Billing from "./pages/Billing";
import LetterLibrary from "./pages/LetterLibrary";
import Affiliates from "./pages/Affiliates";
import Creditors from "./pages/Creditors";
import Everything from "./pages/Everything";
import Dashboard from "./pages/Dashboard";
import AffiliatePaymentsAffiliates from "./pages/AffiliatePaymentsAffiliates";
import AffiliatePaymentsCommissionSettings from "./pages/AffiliatePaymentsCommissionSettings";
import PdfEditor from "./pages/PdfEditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen w-full">
          <Header />
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/clients/:id/import-audit" element={<ImportAudit />} />
            <Route path="/clients/:id/generate-letters" element={<GenerateLetters />} />
            <Route path="/clients/:id/dispute-items" element={<DisputeItems />} />
            <Route path="/clients/:id/educate" element={<Educate />} />
            <Route path="/clients/:id/invoice" element={<Invoice />} />
            <Route path="/clients/:id/credit-report/:reportId" element={<CreditReportPreview />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/my-company" element={<MyCompany />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/letter-library" element={<LetterLibrary />} />
            <Route path="/affiliates" element={<Affiliates />} />
            <Route path="/creditors" element={<Creditors />} />
            <Route path="/everything" element={<Everything />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-company/affiliate-payments/affiliates" element={<AffiliatePaymentsAffiliates />} />
            <Route path="/my-company/affiliate-payments/commission-settings" element={<AffiliatePaymentsCommissionSettings />} />
            <Route path="/my-company/affiliate-payments/advanced-settings" element={<AffiliatePaymentsCommissionSettings />} />
            <Route path="/pdf-editor" element={<PdfEditor />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

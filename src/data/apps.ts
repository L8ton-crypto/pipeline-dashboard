// Curated list of shipped apps. Pulled from MEMORY.md, kept in code so the
// dashboard stays useful even before any pipeline runs are logged. Edit this
// file when adding or retiring apps.

export type ShippedApp = {
  name: string;
  slug: string;
  url: string;
  category: "family" | "dev-tool" | "business" | "client" | "monitoring" | "globe" | "games" | "dashboard" | "finance" | "work" | "other";
  description: string;
};

export const APPS: ShippedApp[] = [
  { name: "Dragon Windows", slug: "dragon-windows", url: "https://dragonwindowsupvc.co.uk", category: "client", description: "Client site." },
  { name: "TY Logistics", slug: "ty-logistics", url: "https://ty-logistics.co.uk", category: "client", description: "Client site." },
  { name: "Arc Forge", slug: "arc-forge", url: "https://arc-forge-rho.vercel.app", category: "dashboard", description: "Overnight build kanban." },
  { name: "Mission Control", slug: "mission-control", url: "https://mission-control-phi-azure.vercel.app", category: "dashboard", description: "Personal AI dashboard." },
  { name: "TinyQuotes", slug: "tiny-quotes", url: "https://tiny-quotes.vercel.app", category: "family", description: "Family memory keeper." },
  { name: "PortfolioTracker", slug: "portfolio-tracker", url: "https://portfolio-tracker-ten-psi.vercel.app", category: "finance", description: "Stock holdings tracker." },
  { name: "FeedbackPop", slug: "feedback-pop", url: "https://feedback-pop-eta.vercel.app", category: "dev-tool", description: "Inline site feedback widget." },
  { name: "API Wrapper Studio", slug: "api-wrapper-studio", url: "https://api-wrapper-studio.vercel.app", category: "dev-tool", description: "API client generator." },
  { name: "ActivityDeck", slug: "activity-deck", url: "https://activity-deck.vercel.app", category: "family", description: "Kid activity randomiser." },
  { name: "PromptVault", slug: "prompt-vault", url: "https://prompt-vault-ruddy.vercel.app", category: "dev-tool", description: "AI prompt library." },
  { name: "MeetingCost", slug: "meeting-cost", url: "https://meeting-cost-one.vercel.app", category: "business", description: "Live meeting cost ticker." },
  { name: "PackingPal", slug: "packing-pal", url: "https://packing-pal.vercel.app", category: "family", description: "Trip packing checklist." },
  { name: "FirstsTracker", slug: "firsts-tracker", url: "https://firsts-tracker.vercel.app", category: "family", description: "Kid milestones logger." },
  { name: "QuickAuth", slug: "quick-auth", url: "https://quick-auth.vercel.app", category: "dev-tool", description: "Drop-in auth pages." },
  { name: "APIHub", slug: "api-hub", url: "https://api-hub-delta-tan.vercel.app", category: "dev-tool", description: "Public API directory." },
  { name: "ReadmeForge", slug: "readme-forge", url: "https://readme-forge-nine.vercel.app", category: "dev-tool", description: "Readme generator." },
  { name: "DevToolkit", slug: "dev-toolkit", url: "https://dev-toolkit-cyan.vercel.app", category: "dev-tool", description: "Daily dev utilities." },
  { name: "AppianCheat", slug: "appian-cheat", url: "https://appian-cheat.vercel.app", category: "work", description: "Appian function reference." },
  { name: "VectorLab", slug: "vector-lab", url: "https://vector-lab-gold.vercel.app", category: "dev-tool", description: "Embeddings playground." },
  { name: "OGImageGen", slug: "og-image-gen", url: "https://og-image-gen-eight.vercel.app", category: "dev-tool", description: "OG image creator." },
  { name: "SitterSheet", slug: "sitter-sheet", url: "https://sitter-sheet.vercel.app", category: "family", description: "Babysitter handover sheet." },
  { name: "DevSetup Pro", slug: "dev-setup", url: "https://dev-setup-tau.vercel.app", category: "dev-tool", description: "New machine setup tracker." },
  { name: "MealSpin", slug: "meal-spin", url: "https://meal-spin-bay.vercel.app", category: "family", description: "Weekly meal randomiser." },
  { name: "CodeTime", slug: "codetime", url: "https://codetime-gamma.vercel.app", category: "dev-tool", description: "Coding session tracker." },
  { name: "ChoreQuest", slug: "chore-quest", url: "https://chore-quest-three.vercel.app", category: "family", description: "Kids' chore game." },
  { name: "QuietTime", slug: "quiet-time", url: "https://quiet-time-bay.vercel.app", category: "family", description: "Kid wind-down timer." },
  { name: "PocketMoney", slug: "pocket-money", url: "https://pocket-money-five.vercel.app", category: "family", description: "Allowance tracker." },
  { name: "FamilySync", slug: "family-sync", url: "https://family-sync-ruddy.vercel.app", category: "family", description: "Shared family notes." },
  { name: "CigarScanner", slug: "cigar-scanner", url: "https://cigar-scanner-app.vercel.app", category: "other", description: "Price comparison." },
  { name: "Arcade", slug: "arcade", url: "https://arcade-dusky.vercel.app", category: "games", description: "Browser games." },
  { name: "Isca Electrical", slug: "isca-electrical", url: "https://isca-electrical.vercel.app", category: "client", description: "Client site." },
  { name: "HistoryGlobe", slug: "history-globe", url: "https://history-globe.vercel.app", category: "globe", description: "242 historical sites." },
  { name: "SpaceWatch", slug: "space-watch", url: "https://space-watch.vercel.app", category: "globe", description: "Live satellite tracker." },
  { name: "InvoiceForge", slug: "invoice-forge", url: "https://invoice-forge.vercel.app", category: "business", description: "Invoice generator." },
  { name: "QuickContract", slug: "quick-contract", url: "https://quick-contract.vercel.app", category: "business", description: "Contract templates." },
  { name: "RoutineHero", slug: "routine-hero", url: "https://routine-hero.vercel.app", category: "family", description: "Morning routine helper." },
  { name: "Skin & Soul Studio", slug: "skin-and-soul-studio", url: "https://skin-and-soul-studio.vercel.app", category: "client", description: "Client site." },
  { name: "WeatherGlobe", slug: "weather-globe", url: "https://weather-globe-nu.vercel.app", category: "globe", description: "Live weather globe." },
  { name: "FlightRadar", slug: "flight-radar", url: "https://flight-radar-chi.vercel.app", category: "globe", description: "Live aircraft globe." },
  { name: "StatusPulse", slug: "status-pulse", url: "https://status-pulse.vercel.app", category: "monitoring", description: "Endpoint monitoring." },
  { name: "Parent Log", slug: "parent-log", url: "https://parent-log.vercel.app", category: "family", description: "Parent communication tracker." },
  { name: "AI-Washing Detector", slug: "ai-washing-detector", url: "https://ai-washing-detector.vercel.app", category: "business", description: "SEC 10-K AI-washing scorer." },
  { name: "Pipeline Dashboard", slug: "pipeline-dashboard", url: "https://pipeline-dashboard-beta.vercel.app", category: "dashboard", description: "Live overnight pipeline readout." },
];

export const APP_COUNT = APPS.length;

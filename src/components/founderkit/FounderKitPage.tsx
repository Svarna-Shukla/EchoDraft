import { useState } from "react";
import { Download } from "lucide-react";
import type { FounderKit } from "../../types/founderKit";
import type { Theme } from "../../hooks/useTheme";
import { exportFounderKitToPdf } from "../../lib/exportPdf";
import FounderKitPanel from "./FounderKitPanel";

type Props = { founderKit: FounderKit | null; isGenerating: boolean; failed: boolean; theme: Theme };

// Full-width Founder Kit tab page: heading, download-all button, and the generated document grid
export default function FounderKitPage({ founderKit, isGenerating, failed, theme }: Props) {
  const [exporting, setExporting] = useState(false);
  const isDark = theme === "dark";

  // Downloads every Founder Kit document as a single PDF
  const handleDownload = () => {
    if (!founderKit) return;
    setExporting(true);
    try {
      exportFounderKitToPdf(founderKit, theme);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pb-28 pt-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}>Founder Kit</h2>
        <button
          onClick={handleDownload}
          disabled={!founderKit || exporting}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" /> {exporting ? "Exporting…" : "Download All as PDF"}
        </button>
      </div>
      <FounderKitPanel founderKit={founderKit} isGenerating={isGenerating} failed={failed} theme={theme} />
    </div>
  );
}

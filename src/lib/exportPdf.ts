import { jsPDF } from "jspdf";
import type { Slide } from "../types/slide";
import type { FounderKit } from "../types/founderKit";
import type { Theme } from "../hooks/useTheme";
import { slideColor, slideLabel, hexToRgb } from "./slideTheme";

const PAGE_W = 960;
const PAGE_H = 540; // true 16:9 landscape

type RGB = [number, number, number];

// Linearly blends two RGB colours, used to approximate a CSS gradient with flat jsPDF fills
function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

// Draws one slide's content onto the current PDF page, approximating the card's gradient with two flat tints
function drawSlide(doc: jsPDF, slide: Slide, index: number, total: number, isDark: boolean) {
  const accent = hexToRgb(slideColor(slide.type));
  const bg: RGB = isDark ? [11, 11, 18] : [255, 255, 255];
  const textPrimary: RGB = isDark ? [255, 255, 255] : [17, 17, 17];
  const textSecondary: RGB = isDark ? [220, 220, 220] : [60, 60, 60];
  const margin = 50;

  doc.setFillColor(...mix(bg, accent, 0.06));
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  doc.setFillColor(...mix(bg, accent, 0.22));
  doc.triangle(0, 0, PAGE_W * 0.65, 0, 0, PAGE_H * 0.8, "F");

  doc.setFillColor(...accent);
  doc.rect(0, 0, 8, PAGE_H, "F");

  doc.setFontSize(11);
  doc.setTextColor(...accent);
  doc.text(slideLabel(slide.type).toUpperCase(), margin, 70);

  doc.setFontSize(30);
  doc.setTextColor(...textPrimary);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(slide.title, PAGE_W - margin * 2) as string[];
  doc.text(titleLines, margin, 110);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(15);
  doc.setTextColor(...textSecondary);
  let y = 110 + titleLines.length * 26 + 30;
  for (const bullet of slide.bullets) {
    doc.setFillColor(...accent);
    doc.circle(margin + 3, y - 4, 2.5, "F");
    const lines = doc.splitTextToSize(bullet, PAGE_W - margin * 2 - 20) as string[];
    doc.text(lines, margin + 16, y);
    y += lines.length * 19 + 10;
  }

  doc.setFontSize(9);
  doc.setTextColor(...(isDark ? ([120, 120, 120] as RGB) : ([160, 160, 160] as RGB)));
  doc.text("Pitchr", margin, PAGE_H - 24);
  doc.text(`${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, PAGE_W - margin - 40, PAGE_H - 24);
}

// Renders every slide as its own 16:9 page, matching the app's current theme, and downloads the deck as a PDF
export function exportSlidesToPdf(slides: Slide[], theme: Theme = "dark") {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: [PAGE_W, PAGE_H] });
  const isDark = theme === "dark";
  slides.forEach((slide, i) => {
    if (i > 0) doc.addPage([PAGE_W, PAGE_H], "landscape");
    drawSlide(doc, slide, i, slides.length, isDark);
  });
  doc.save("pitchr-pitch-deck.pdf");
}

const FOUNDER_KIT_MARGIN = 56;

// Draws one Founder Kit document as its own page
function drawFounderKitPage(doc: jsPDF, label: string, content: string | string[], isDark: boolean) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(...(isDark ? ([11, 11, 18] as RGB) : ([255, 255, 255] as RGB)));
  doc.rect(0, 0, pageW, pageH, "F");

  doc.setFontSize(11);
  doc.setTextColor(168, 85, 247);
  doc.text(label.toUpperCase(), FOUNDER_KIT_MARGIN, 70);

  doc.setFontSize(15);
  doc.setTextColor(...(isDark ? ([255, 255, 255] as RGB) : ([17, 17, 17] as RGB)));
  const text = Array.isArray(content) ? content.map((c) => `- ${c}`).join("\n") : content;
  const lines = doc.splitTextToSize(text, pageW - FOUNDER_KIT_MARGIN * 2) as string[];
  doc.text(lines, FOUNDER_KIT_MARGIN, 100);

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Pitchr", FOUNDER_KIT_MARGIN, pageH - 30);
}

// Renders every Founder Kit document as its own page and downloads the bundle as a PDF
export function exportFounderKitToPdf(kit: FounderKit, theme: Theme = "dark") {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const isDark = theme === "dark";
  const cards: { label: string; content: string | string[] }[] = [
    { label: "One-liner", content: kit.oneLiner },
    { label: "Elevator pitch — 15 sec", content: kit.elevatorPitch.fifteenSec },
    { label: "Elevator pitch — 30 sec", content: kit.elevatorPitch.thirtySec },
    { label: "Elevator pitch — 60 sec", content: kit.elevatorPitch.sixtySec },
    { label: "Problem statement", content: kit.problemStatement },
    { label: "Target customer", content: kit.targetCustomer },
    { label: "Value proposition", content: kit.valueProposition },
    { label: "GTM strategy", content: kit.gtmStrategy },
    { label: "Validation questions", content: kit.validationQuestions },
  ];
  cards.forEach((card, i) => {
    if (i > 0) doc.addPage();
    drawFounderKitPage(doc, card.label, card.content, isDark);
  });
  doc.save("pitchr-founder-kit.pdf");
}

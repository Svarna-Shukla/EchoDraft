import { Suspense, lazy } from "react";
import type { MeshConfig } from "../../../types/investor";
import { isWebGLAvailable } from "../../../lib/webgl";

const InvestorHeadScene = lazy(() => import("./InvestorHeadScene"));

type Props = { meshConfig: MeshConfig };

// Plain CSS fallback shown in place of the Canvas when the browser can't create a WebGL context
function NoWebGLFallback({ color }: { color: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-24 w-24 rounded-full" style={{ background: `radial-gradient(circle, ${color}55, transparent 70%)`, boxShadow: `0 0 50px 18px ${color}33` }} />
    </div>
  );
}

// Sizeable, self-contained 3D preview: one investor's rotating wireframe head, gated behind a WebGL
// availability check like the hero/arena masks. Used inside PersonalityCard (idle thumbnail) and
// InvestorPreviewModal (larger live preview) — both just pass a different container size around it.
export default function InvestorHeadPreview({ meshConfig }: Props) {
  if (!isWebGLAvailable()) return <NoWebGLFallback color={meshConfig.color} />;

  return (
    <Suspense fallback={<NoWebGLFallback color={meshConfig.color} />}>
      <InvestorHeadScene meshConfig={meshConfig} />
    </Suspense>
  );
}

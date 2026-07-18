import { AlertTriangle } from "lucide-react";

type Props = { color: string };

// Large warning icon emphasizing the severity of the problem
export default function ProblemStat({ color }: Props) {
  return (
    <div
      className="flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-full"
      style={{ background: `${color}18` }}
    >
      <AlertTriangle className="h-12 w-12" style={{ color }} strokeWidth={2.5} />
    </div>
  );
}

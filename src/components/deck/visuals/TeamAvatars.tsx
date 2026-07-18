type Props = { bullets: string[]; color: string; isDark: boolean };

// Splits a "Name — Role" style bullet into its parts, falling back to a generic label
function parseMember(bullet: string, i: number) {
  const [name, role] = bullet.split(/[-–—]/).map((s) => s.trim());
  return { name: name || `Founder ${i + 1}`, role: role || "Team Member" };
}

// Placeholder avatar circles with name and role for each team member bullet
export default function TeamAvatars({ bullets, color, isDark }: Props) {
  const members = bullets.slice(0, 3).map(parseMember);
  return (
    <div className="flex gap-5">
      {members.map((m, i) => (
        <div key={i} className="flex flex-col items-center text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: color }}
          >
            {m.name.slice(0, 1).toUpperCase()}
          </div>
          <p className={`mt-2 text-xs font-semibold ${isDark ? "text-white" : "text-black"}`}>{m.name}</p>
          <p className={`text-[10px] ${isDark ? "text-white/50" : "text-black/50"}`}>{m.role}</p>
        </div>
      ))}
    </div>
  );
}

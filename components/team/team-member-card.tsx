import Image from "next/image";
import { Mail, Phone, BadgeCheck } from "lucide-react";
import { getInitials, getTeamRoleLabel } from "@/lib/utils";
import type { TeamMember } from "@prisma/client";

interface TeamMemberCardProps {
  member: Pick<
    TeamMember,
    "name" | "title" | "role" | "photoUrl" | "bio" | "certifications" | "email" | "phone"
  >;
}

const ROLE_BADGE_STYLES: Record<TeamMember["role"], { background: string; color: string }> = {
  LAWYER: { background: "rgba(15,23,42,0.08)", color: "#0f172a" },
  NOTARY: { background: "rgba(212,175,55,0.14)", color: "#a3791f" },
  ADVISOR: { background: "rgba(59,130,246,0.1)", color: "#1d4ed8" },
};

/**
 * Professional team-member card used on the public "Om os" page.
 * Shows a photo (or a gold-gradient initials avatar fallback), name, title,
 * role badge, bio, certification pills, and contact icons.
 */
export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const badgeStyle = ROLE_BADGE_STYLES[member.role] ?? ROLE_BADGE_STYLES.ADVISOR;

  return (
    <div
      className="bg-white rounded-2xl p-6 flex flex-col items-center text-center h-full"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
    >
      {/* Avatar */}
      {member.photoUrl ? (
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-4 flex-shrink-0">
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #d4af37, #f0d060)",
            color: "#0f172a",
          }}
        >
          {getInitials(member.name)}
        </div>
      )}

      <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
      <p className="text-sm text-slate-500 mt-0.5">{member.title}</p>

      {/* Role badge */}
      <div
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mt-3"
        style={{ background: badgeStyle.background, color: badgeStyle.color }}
      >
        <BadgeCheck size={12} />
        {getTeamRoleLabel(member.role)}
      </div>

      {/* Bio */}
      <p className="text-sm text-slate-600 leading-relaxed mt-4">{member.bio}</p>

      {/* Certifications */}
      {member.certifications.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-5">
          {member.certifications.map((cert) => (
            <span
              key={cert}
              className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                color: "#475569",
              }}
            >
              {cert}
            </span>
          ))}
        </div>
      )}

      {/* Contact icons */}
      {(member.email || member.phone) && (
        <div
          className="flex items-center justify-center gap-3 mt-5 pt-5 w-full"
          style={{ borderTop: "1px solid #f1f5f9" }}
        >
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              aria-label={`Send e-mail til ${member.name}`}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#d4af37";
                (e.currentTarget as HTMLAnchorElement).style.color = "#d4af37";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e2e8f0";
                (e.currentTarget as HTMLAnchorElement).style.color = "#0f172a";
              }}
            >
              <Mail size={15} />
            </a>
          )}
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              aria-label={`Ring til ${member.name}`}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#d4af37";
                (e.currentTarget as HTMLAnchorElement).style.color = "#d4af37";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e2e8f0";
                (e.currentTarget as HTMLAnchorElement).style.color = "#0f172a";
              }}
            >
              <Phone size={15} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

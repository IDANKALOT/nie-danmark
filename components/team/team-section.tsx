"use client";

import { useEffect, useState } from "react";
import { TeamMemberCard } from "./team-member-card";
import type { TeamMember } from "@prisma/client";

/**
 * Client-side grid of active team members fetched from `/api/team` —
 * replaces the "Om os" page's old hardcoded `TEAM` array. Renders nothing
 * if the fetch fails or no active members are configured, so the page
 * never shows stale placeholder data.
 */
export function TeamSection() {
  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/team")
      .then((res) => {
        if (!res.ok) throw new Error("Kunne ikke hente teamet");
        return res.json();
      })
      .then((json: { data: TeamMember[] }) => {
        if (!cancelled) setMembers(json.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (members === null && !error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 h-64 animate-pulse"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4"
              style={{ background: "rgba(15,23,42,0.06)" }}
            />
            <div className="h-3 w-2/3 mx-auto rounded mb-2" style={{ background: "rgba(15,23,42,0.06)" }} />
            <div className="h-3 w-1/2 mx-auto rounded" style={{ background: "rgba(15,23,42,0.05)" }} />
          </div>
        ))}
      </div>
    );
  }

  if (error || !members || members.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {members.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?mode=signup");
  }, [router]);

  return (
    <main className="section-wrap py-10 text-sm text-[color:var(--muted)]">
      Redirecting to signup...
    </main>
  );
}

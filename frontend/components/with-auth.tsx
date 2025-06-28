// components/with-auth.tsx
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  allowedRoles: ("ADMIN" | "CLIENTE")[];
};

export default function WithAuth({ children, allowedRoles }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (!allowedRoles.includes(user.rol)) {
      router.replace("/login"); // o "/403"
    }
  }, [user, router, allowedRoles]);

  if (!user || !allowedRoles.includes(user.rol)) {
    return null; // o un loading spinner
  }

  return <>{children}</>;
}

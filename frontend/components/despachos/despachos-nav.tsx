"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  Truck,
  BarChart3,
  ArrowLeft,
  Home,
} from "lucide-react";

export default function DespachosNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: Home,
      description: "Volver al panel principal",
    },
    {
      href: "/admin/despachos",
      label: "Gestión",
      icon: Package,
      description: "Administrar despachos",
      active: pathname === "/admin/despachos",
    },
    {
      href: "/admin/despachos/tracking",
      label: "Seguimiento",
      icon: Truck,
      description: "Monitoreo visual",
      active: pathname === "/admin/despachos/tracking",
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/admin">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Despachos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra y controla el estado de los despachos
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                item.active 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
                  : "hover:border-gray-300"
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      item.active 
                        ? "bg-blue-100 dark:bg-blue-900" 
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        item.active 
                          ? "text-blue-600 dark:text-blue-400" 
                          : "text-gray-600 dark:text-gray-400"
                      }`} />
                    </div>
                    <div>
                      <h3 className={`font-medium ${
                        item.active 
                          ? "text-blue-900 dark:text-blue-100" 
                          : "text-gray-900 dark:text-white"
                      }`}>
                        {item.label}
                      </h3>
                      <p className={`text-sm ${
                        item.active 
                          ? "text-blue-700 dark:text-blue-300" 
                          : "text-gray-600 dark:text-gray-400"
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 
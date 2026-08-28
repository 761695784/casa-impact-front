import React from "react"
import { AdminLayout } from "@/components/admin/layout/admin-layout"

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}

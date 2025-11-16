import Navbar from "@/components/common/navbar/navbar"
import React from "react"

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto min-h-screen w-full px-0 sm:px-6 lg:px-8 bg-slate-100 sm:max-w-2xl lg:max-w-4xl 2xl:max-w-4xl">
      <Navbar />
      <main className="pt-0 sm:pt-4">{children}</main>
    </div>
  )
}

export default Layout

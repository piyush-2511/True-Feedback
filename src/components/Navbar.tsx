"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from 'next-auth'
import { Mail, LayoutDashboard, LogOut } from 'lucide-react'
import { Button } from './ui/button'

function Navbar() {
  const {data: session} = useSession()

  const user:User = session?.user as User

  return (
    <nav className="border-b border-[#1C1E29] bg-[#0D0E13]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-3 py-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-[#E8B65A]" />
          <span className="font-[family-name:var(--font-fraunces)] italic text-lg text-[#F5EFE6]">
            TrueFeedback
          </span>
        </Link>

        {session ? (
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-geist-mono)] text-xs text-[#8B8D9E] hidden sm:inline">
              {user?.username || user?.email}
            </span>
            <Link href="/dashboard">
              <Button
                size="sm"
                variant="outline"
                className="border-[#2A2C3A] bg-transparent text-[#F5EFE6] hover:bg-[#171922] hover:text-[#E8B65A]"
              >
                <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
                Dashboard
              </Button>
            </Link>
            <Button
              onClick={() => signOut()}
              size="sm"
              variant="outline"
              className="border-[#2A2C3A] bg-transparent text-[#F5EFE6] hover:bg-[#171922] hover:text-[#E8B65A]"
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Log out
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button
              size="sm"
              variant="outline"
              className="border-[#2A2C3A] bg-transparent text-[#F5EFE6] hover:bg-[#171922] hover:text-[#E8B65A]"
            >
              Sign in
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import * as z from "zod"
import Link from "next/link"

import axios, {AxiosError} from "axios"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ApiResponse } from "@/types/apiResponse"



import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Loader2, Mail } from "lucide-react"
import { SignInSchema } from "@/Schemas/signInSchema"
import { useState } from "react"
import { signIn } from "next-auth/react"


export default function Page(){

  const [isSubmitting, setIsSubmitting] = useState(false);


  const router = useRouter()

  //zod implementation 
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver : zodResolver(SignInSchema),
    defaultValues : {
      identifier : '',
      password : '',
    }
  })



  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {

    setIsSubmitting(true)
    
    const result = await signIn('credentials',{
      redirect: false,
      identifier : data.identifier,
      password : data.password
    })

    if (result?.error){
      toast.error(result.error || 'Login Failed : Incorrect Credentials')
    }

    if (result?.url){
      router.replace('/dashboard')
    }

    setIsSubmitting(false)

  }

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-[#0D0E13] px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#171922] border border-[#262837] rounded-md">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E8B65A]/10">
            <Mail className="h-5 w-5 text-[#E8B65A]" />
          </div>
          <p className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.2em] uppercase text-[#5C5E6E] mb-3">
            Welcome back
          </p>
          <h1 className="font-[family-name:var(--font-fraunces)] italic text-3xl text-[#F5EFE6] mb-3">
            Sign in to TrueFeedback
          </h1>
          <p className="text-sm text-[#8B8D9E]">Continue your anonymous inbox.</p>
        </div>
      
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="identifier" className="text-[#F5EFE6]">
                    Email / Username
                  </FieldLabel>

                  <Input
                    {...field}
                    id="identifier"
                    placeholder="Enter your email or username"
                    autoComplete="username"
                    aria-invalid={fieldState.invalid}
                    className="bg-[#0D0E13] border-[#262837] text-[#F5EFE6] placeholder:text-[#5C5E6E] focus-visible:ring-[#E8B65A]/40"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password" className="text-[#F5EFE6]">
                    Password
                  </FieldLabel>

                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                    className="bg-[#0D0E13] border-[#262837] text-[#F5EFE6] placeholder:text-[#5C5E6E] focus-visible:ring-[#E8B65A]/40"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            className="w-full bg-[#E8B65A] hover:bg-[#D9A648] text-[#1A1408] font-medium"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-[#8B8D9E]">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-[#E8B65A] hover:text-[#D9A648]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  )
}
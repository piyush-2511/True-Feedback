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

import { Loader2 } from "lucide-react"
import { SignInSchema } from "@/Schemas/signInSchema"
import { useState } from "react"
import { signIn } from "next-auth/react"


export default function page(){


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

  }

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
      
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="identifier">
                    Email / Username
                  </FieldLabel>

                  <Input
                    {...field}
                    id="identifier"
                    placeholder="Enter your email or username"
                    autoComplete="username"
                    aria-invalid={fieldState.invalid}
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
                  <FieldLabel htmlFor="password">
                    Password
                  </FieldLabel>

                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button className="w-full" type="submit">
            Sign In
          </Button>
        </form>

        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  )
}
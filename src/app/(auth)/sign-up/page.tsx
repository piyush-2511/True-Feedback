"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import {useDebounceValue} from 'usehooks-ts'

import axios, {AxiosError} from "axios"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { SignUpSchema } from "@/Schemas/signUpSchema"
import { ApiResponse } from "@/types/apiResponse"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Loader2, Check, X, Mail } from "lucide-react"


export default function page(){

  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingusername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [debouncedUsername] = useDebounceValue(username, 300)

  const router = useRouter()

  //zod implementation 
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver : zodResolver(SignUpSchema),
    defaultValues : {
      username : '',
      email : '',
      password : '',
    }
  })

  useEffect(() =>{
    const checkUsernameUnique = async () => {
      if (debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage("")
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
          console.log(response)
          setUsernameMessage(response.data.message)

        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking message"
          )
        } finally{
          setIsCheckingUsername(false)
        }
      }
    }

    checkUsernameUnique()
  },[debouncedUsername])

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsSubmitting(true)
    try {
      await axios.post<ApiResponse>('/api/sign-up', data)
      toast.success("User Registered Successfully, please verify your email")
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in sign-up:", error)
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message ?? "Error signing up"
      toast.error(errorMessage)
      setIsSubmitting(false)
    }

  }

  const isUnique = usernameMessage === "Username is unique"

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-[#0D0E13] px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#171922] border border-[#262837] rounded-md">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E8B65A]/10">
            <Mail className="h-5 w-5 text-[#E8B65A]" />
          </div>
          <p className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.2em] uppercase text-[#5C5E6E] mb-3">
            Get started
          </p>
          <h1 className="font-[family-name:var(--font-fraunces)] italic text-3xl text-[#F5EFE6] mb-3">
            Join TrueFeedback
          </h1>
          <p className="text-sm text-[#8B8D9E]">Start your anonymous inbox.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username" className="text-[#F5EFE6]">
                    Username
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id="username"
                      placeholder="Username"
                      autoComplete="username"
                      aria-invalid={fieldState.invalid}
                      className="bg-[#0D0E13] border-[#262837] text-[#F5EFE6] placeholder:text-[#5C5E6E] focus-visible:ring-[#E8B65A]/40 pr-9"
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />
                    {isCheckingusername && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#5C5E6E]" />
                    )}
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          {usernameMessage && !isCheckingusername && (
            <p
              className={`flex items-center gap-1.5 text-xs -mt-4 ${
                isUnique ? "text-[#6FCF97]" : "text-[#E24B4A]"
              }`}
            >
              {isUnique ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
              {usernameMessage}
            </p>
          )}

          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email" className="text-[#F5EFE6]">
                    Email
                  </FieldLabel>

                  <Input
                    {...field}
                    id="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    className="bg-[#0D0E13] border-[#262837] text-[#F5EFE6] placeholder:text-[#5C5E6E] focus-visible:ring-[#E8B65A]/40"
                    onChange={(e) => {
                      field.onChange(e);
                    }}
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
                    placeholder="Password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    className="bg-[#0D0E13] border-[#262837] text-[#F5EFE6] placeholder:text-[#5C5E6E] focus-visible:ring-[#E8B65A]/40"
                    onChange={(e) => {
                      field.onChange(e);
                    }}
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
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait
              </>
            ) : ("Sign up")}
          </Button>
        </form>

        <div className="text-center">
            <p className="text-sm text-[#8B8D9E]">
              Already a member?{' '}
              <Link href="/sign-in" className="text-[#E8B65A] hover:text-[#D9A648]">
                Sign in
              </Link>
            </p>
        </div>
      </div>    
    </div>
    </>
  )
}
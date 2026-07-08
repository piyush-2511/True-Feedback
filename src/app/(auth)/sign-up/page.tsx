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

import { Loader2 } from "lucide-react"


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

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign Up to start your anonymous adventure</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username">
                    Username
                  </FieldLabel>

                  <Input
                    {...field}
                    id="username"
                    placeholder="Username"
                    autoComplete="username"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          {usernameMessage && (
            <p
              className={`text-sm ${
                usernameMessage === "Username is unique"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {usernameMessage}
            </p>
          )}

          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">
                    Email
                  </FieldLabel>

                  <Input
                    {...field}
                    id="email"
                    placeholder="email"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
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
                  <FieldLabel htmlFor="password">
                    Email
                  </FieldLabel>

                  <Input
                    {...field}
                    id="password"
                    placeholder="password"
                    autoComplete="password"
                    aria-invalid={fieldState.invalid}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait
            </> : ("Sign Up")}
          </Button>
        </form>

        <div className="text-center mt-4">
            <p>
              Already a member? {' '}
              <Link href = "/sign-in" className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </p>
        </div>
      </div>    
    </div>
    </>
  )
}
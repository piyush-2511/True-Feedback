"use client"

import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import { Controller, useForm } from 'react-hook-form'
import { VerifySchema } from '@/Schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios,{AxiosError} from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


function VerifyAccount() {
  const router = useRouter()
  const params = useParams<{username: string}>()
  
  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver : zodResolver(VerifySchema),
    defaultValues:{
      code:""
    }
  })

  const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`,{
        username: params.username,
        code : data.code
      })

      toast.success(response.data.message)
      router.replace('/sign-in')
    } catch (error) {
      console.error("Error in Verifying:", error)
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message ?? "Error in Verifying "
      toast.error(errorMessage)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Verify Your Account
        </h1>
        <p className="mb-4">Enter the verification code sent to your email</p>
      </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="code">
                    Verification Code
                  </FieldLabel>

                  <Input
                    {...field}
                    id="code"
                    placeholder="Enter verification code"
                    autoComplete="one-time-code"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button type="submit">
            Verify
          </Button>
        </form>
    </div>
  </div>
  )
}

export default VerifyAccount
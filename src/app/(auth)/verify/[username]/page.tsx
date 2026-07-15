"use client"

import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
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
import { Loader2, ShieldCheck } from 'lucide-react'


function VerifyAccount() {
  const router = useRouter()
  const params = useParams<{username: string}>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver : zodResolver(VerifySchema),
    defaultValues:{
      code:""
    }
  })

  const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
    setIsSubmitting(true)
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
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0D0E13] px-4">
    <div className="w-full max-w-md p-8 space-y-8 bg-[#171922] border border-[#262837] rounded-md">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E8B65A]/10">
          <ShieldCheck className="h-5 w-5 text-[#E8B65A]" />
        </div>
        <p className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.2em] uppercase text-[#5C5E6E] mb-3">
          One last step
        </p>
        <h1 className="font-[family-name:var(--font-fraunces)] italic text-3xl text-[#F5EFE6] mb-3">
          Verify your account
        </h1>
        <p className="text-sm text-[#8B8D9E]">
          Enter the code sent to your email to activate @{params.username}.
        </p>
      </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="code" className="text-[#F5EFE6]">
                    Verification code
                  </FieldLabel>

                  <Input
                    {...field}
                    id="code"
                    placeholder="Enter verification code"
                    autoComplete="one-time-code"
                    aria-invalid={fieldState.invalid}
                    className="bg-[#0D0E13] border-[#262837] text-[#F5EFE6] placeholder:text-[#5C5E6E] focus-visible:ring-[#E8B65A]/40 tracking-[0.3em] text-center font-[family-name:var(--font-geist-mono)]"
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
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
          </Button>
        </form>
    </div>
  </div>
  )
}

export default VerifyAccount
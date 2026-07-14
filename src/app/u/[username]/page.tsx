"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { Loader2, Send, Sparkles, MessageCircleOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { MessageSchema } from "@/Schemas/messageSchema"
import { ApiResponse } from "@/types/apiResponse"

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>()
  const username = params.username

  const [isSending, setIsSending] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [notAccepting, setNotAccepting] = useState(false)

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsSending(true)
    try {
      const response = await axios.post<ApiResponse>("/api/send-messages", {
        username,
        content: data.content,
      })

      toast.success(response.data.message)
      form.reset({ content: "" })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      if (axiosError.response?.status === 403) {
        setNotAccepting(true)
      }

      toast.error(
        axiosError.response?.data.message ?? "Failed to send message"
      )
    } finally {
      setIsSending(false)
    }
  }

  const fetchSuggestions = async () => {
    setIsSuggesting(true)
    try {
      const response = await axios.post("/api/suggest-messages")
      const raw: string = response.data.message
      const parsed = raw
        .split("||")
        .map((s) => s.trim())
        .filter(Boolean)

      setSuggestions(parsed)
    } catch (error) {
      toast.error("Failed to fetch suggestions")
    } finally {
      setIsSuggesting(false)
    }
  }

  const handleSuggestionClick = (text: string) => {
    form.setValue("content", text, { shouldValidate: true })
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0D0E13] px-4 py-12">
      <Card className="w-full max-w-lg bg-[#171922] border border-[#262837] rounded-md">
        <CardHeader className="space-y-3 text-center pb-2">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#E8B65A]/10">
            <Send className="h-5 w-5 text-[#E8B65A]" />
          </div>
          <p className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.2em] uppercase text-[#5C5E6E]">
            To ●●●●●●●●
          </p>
          <h1 className="font-[family-name:var(--font-fraunces)] italic text-2xl text-[#F5EFE6]">
            @{username}
          </h1>
          <p className="text-sm text-[#8B8D9E]">
            Your identity stays completely anonymous.
          </p>
        </CardHeader>

        <CardContent className="pt-4">
          {notAccepting ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <MessageCircleOff className="h-8 w-8 text-[#5C5E6E]" />
              <p className="text-sm font-medium text-[#F5EFE6]">
                @{username} isn&apos;t accepting messages right now.
              </p>
              <p className="text-xs text-[#8B8D9E]">
                Check back later — this link will work again once they turn it back on.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FieldGroup>
                  <Controller
                    name="content"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="content" className="text-[#F5EFE6]">
                          Your message
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id="content"
                          placeholder="Say what's on your mind..."
                          className="min-h-[120px] resize-none bg-[#0D0E13] border-[#262837] text-[#F5EFE6] placeholder:text-[#5C5E6E] focus-visible:ring-[#E8B65A]/40"
                          aria-invalid={fieldState.invalid}
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
                  disabled={isSending}
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send anonymously
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#262837]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#171922] px-2 text-[#5C5E6E] font-[family-name:var(--font-geist-mono)]">
                    or
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-[#2A2C3A] bg-transparent text-[#F5EFE6] hover:bg-[#1C1E29] hover:text-[#E8B65A]"
                  onClick={fetchSuggestions}
                  disabled={isSuggesting}
                >
                  {isSuggesting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Suggest a message
                    </>
                  )}
                </Button>

                {suggestions.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSuggestionClick(s)}
                        className="w-full text-left p-3 border border-[#262837] rounded-md hover:bg-[#1C1E29] hover:border-[#E8B65A]/40 transition-colors text-sm text-[#D8D5C8]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
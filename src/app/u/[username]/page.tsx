"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
    // sets value AND triggers validation so the error clears immediately
    form.setValue("content", text, { shouldValidate: true })
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 px-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">
          Send an anonymous message to @{username}
        </h1>

        {notAccepting ? (
          <p className="text-center text-red-500">
            This user is not currently accepting messages.
          </p>
        ) : (
          <>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FieldGroup>
                <Controller
                  name="content"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="content">Your message</FieldLabel>

                      <Textarea
                        {...field}
                        id="content"
                        placeholder="Write your anonymous message here..."
                        className="min-h-[120px]"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button className="w-full" type="submit" disabled={isSending}>
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={fetchSuggestions}
                disabled={isSuggesting}
              >
                {isSuggesting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Suggest Messages"
                )}
              </Button>

              {suggestions.length > 0 && (
                <div className="space-y-2 pt-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full text-left p-3 border rounded-md hover:bg-gray-50 text-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
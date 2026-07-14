"use client"

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/models/User'
import { AcceptMessageSchema } from '@/Schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Copy, Loader2, Mail, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setisloading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [baseUrl, setBaseUrl] = useState('') // NEW

    const handleDeleteMessage = (messageId: string) =>{
      setMessages(messages.filter((message) => message._id.toString() !== messageId))
    }

    const {data: session} = useSession()

    const form = useForm({
      resolver : zodResolver(AcceptMessageSchema)
    })
    const {register, watch, setValue} = form;
    const acceptMessage = watch('acceptMessage', )

    const fetchAcceptMessage = useCallback(async()=>{
      setIsSwitchLoading(true)
      try {
        const response = await axios.get<ApiResponse>('/api/accept-messages')
        setValue('acceptMessage', response.data.isAcceptingMessage ?? false )

      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast.error("Failed To Fetch Message")
      } finally {
        setIsSwitchLoading(false)
      }
    },[setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false)=>{
      setisloading(true)
      setIsSwitchLoading(false)

      try {
        const response = await axios.get<ApiResponse>('/api/get-messages')
        setMessages(response.data.messages || [])
        if (refresh){
          toast.error("Showing Latest messages")

        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        console.error(axiosError.response?.data ?? axiosError.message)
        toast.error(axiosError.response?.data.message ?? "Failed To Fetch Messages")
      }finally{
        setisloading(false)
        setIsSwitchLoading(false)
      }
    },[setisloading, setMessages])


    useEffect(()=>{
      if (!session || !session.user) return
      fetchMessages()
      fetchAcceptMessage()
    },[session, setValue, fetchAcceptMessage, fetchMessages])

    //handle switch change 
    const handleSwitchChange = async () => {
      const newValue = !acceptMessage
      try {
        const response = await axios.post<ApiResponse>('/api/accept-messages', {
          acceptMessages: newValue
        })
        if (response.data.success) {
          setValue('acceptMessage', newValue)
          toast.info(response.data.message)
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast.error(axiosError.response?.data.message ?? "Failed To Update")
      }
    }

    useEffect(() => {
      if (typeof window !== 'undefined') {
        setBaseUrl(`${window.location.protocol}//${window.location.host}`)
      }
    }, [])


    const username = session?.user?.username
    const profileUrl = `${baseUrl}/u/${username}`

    // do more research
    // const baseUrl = `${window.location.protocol}//${window.location.host}`

    const copyToClipboard = () =>{
      navigator.clipboard.writeText(profileUrl)
      toast.info('URL Copied')
    }
    if (!session || !session.user){
      return <div className="flex-1 flex items-center justify-center text-[#8B8D9E]">Please log in.</div>
    }

    return (
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 md:p-8 bg-[#0D0E13] rounded w-full max-w-6xl">
        <p className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.2em] uppercase text-[#E8B65A] mb-2">
          Dashboard
        </p>
        <h1 className="font-[family-name:var(--font-fraunces)] italic text-3xl md:text-4xl text-[#F5EFE6] mb-8">
          Your inbox
        </h1>

        <div className="mb-6 bg-[#171922] border border-[#262837] rounded-md p-5">
          <h2 className="text-sm font-medium text-[#F5EFE6] mb-3">Your unique link</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 bg-[#0D0E13] border border-[#262837] rounded-md p-2 font-[family-name:var(--font-geist-mono)] text-xs text-[#8B8D9E]"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-[#E8B65A] hover:bg-[#D9A648] text-[#1A1408] flex-shrink-0"
            >
              <Copy className="h-4 w-4 mr-1.5" />
              Copy
            </Button>
          </div>
        </div>

        <div className="mb-6 bg-[#171922] border border-[#262837] rounded-md p-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-[#F5EFE6]">Accept messages</h2>
            <p className="text-xs text-[#8B8D9E] mt-1">
              {acceptMessage
                ? "Your link is open — anyone can send you a message."
                : "Your link is closed — no new messages can come in."}
            </p>
          </div>
          <Switch
            {...register('acceptMessage')}
            checked={acceptMessage}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
        </div>

        <Separator className="bg-[#1C1E29]" />

        <div className="flex items-center justify-between mt-6 mb-4">
          <p className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.2em] uppercase text-[#8B8D9E]">
            Messages
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-[#2A2C3A] bg-transparent text-[#F5EFE6] hover:bg-[#1C1E29] hover:text-[#E8B65A]"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="md:col-span-2 flex flex-col items-center gap-3 py-16 text-center border border-dashed border-[#262837] rounded-md">
              <Mail className="h-6 w-6 text-[#5C5E6E]" />
              <p className="text-sm text-[#8B8D9E]">
                Nothing yet. Share your link to start receiving messages.
              </p>
            </div>
          )}
        </div>
      </div>
    );
}

export default Dashboard
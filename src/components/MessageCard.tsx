"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/models/User'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/apiResponse'
import axios, { AxiosError } from 'axios'

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void
}

function MessageCard({ message, onMessageDelete }: MessageCardProps) {

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
      toast.info(response.data.message)
      onMessageDelete(message._id.toString())
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message ?? "Failed to delete message")
    }
  }

  return (
    <Card className="bg-[#171922] border-0 border-l-2 border-l-[#E8B65A] rounded-md">
      <CardHeader>
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-[#F5EFE6] text-base font-normal leading-relaxed">
            {message.content}
          </CardTitle>

          <AlertDialog>
            <AlertDialogTrigger render={
              <Button
                variant="ghost"
                size="icon"
                className="text-[#5C5E6E] hover:text-[#E24B4A] hover:bg-[#1C1E29] flex-shrink-0"
              >
                <X className='w-4 h-4' />
              </Button>
            } />
            <AlertDialogContent className="bg-[#171922] border border-[#262837] text-[#F5EFE6]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#F5EFE6]">Delete this message?</AlertDialogTitle>
                <AlertDialogDescription className="text-[#8B8D9E]">
                  This can't be undone. The message will be gone for good.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-[#2A2C3A] bg-transparent text-[#F5EFE6] hover:bg-[#1C1E29] hover:text-[#F5EFE6]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-[#E24B4A] hover:bg-[#C93F3E] text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <CardDescription className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#5C5E6E] tracking-wide">
          {new Date(message.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export default MessageCard
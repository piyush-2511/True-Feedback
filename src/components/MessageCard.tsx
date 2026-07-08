"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-normal">
            {message.content}
          </CardTitle>

          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" size="icon"><X className='w-5 h-5' /></Button>} />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <CardDescription>
          {new Date(message.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export default MessageCard
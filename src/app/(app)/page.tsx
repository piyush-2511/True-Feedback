"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

import messages from '../../messages.json'
import Autoplay from 'embla-carousel-autoplay'

function Home() {
  return (
    <>
      <main className="flex-grow flex flex-col items-center px-4 md:px-24 py-16 md:py-24">
        <section className="text-center mb-12 md:mb-16 max-w-2xl">
          <p className="font-[family-name:var(--font-geist-mono)] text-xs md:text-sm tracking-[0.2em] uppercase text-[#E8B65A] mb-4">
            Anonymous inbox
          </p>
          <h1 className="font-[family-name:var(--font-fraunces)] italic text-4xl md:text-6xl leading-[1.1] text-[#F5EFE6]">
            Say it. Skip the name.
          </h1>
          <p className="mt-5 text-base md:text-lg text-[#8B8D9E] max-w-md mx-auto">
            Share your link. Receive honest, unfiltered feedback — no account
            required to send, no way to trace it back.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-[#E8B65A] hover:bg-[#D9A648] text-[#1A1408] font-medium px-6 py-6 "
            >
              <Link href="/sign-up">
                Create your link <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              
              variant="outline"
              className="px-6 py-6 border-[#2A2C3A] bg-transparent text-[#F5EFE6] hover:bg-[#171922] hover:text-[#F5EFE6] px-6"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="w-full max-w-lg md:max-w-xl">
          <p className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.2em] uppercase text-[#8B8D9E] mb-4 text-center">
            Recent whispers
          </p>

          <Carousel
            plugins={[Autoplay({ delay: 2500, stopOnMouseEnter: true })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-3">
                  <Card
                    className={`bg-[#171922] border-0 border-l-2 border-l-[#E8B65A] rounded-md ${
                      index % 2 === 0 ? "rotate-[0.4deg]" : "-rotate-[0.4deg]"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-[#F5EFE6] text-base font-medium">
                          {message.title}
                        </CardTitle>
                        <Mail className="h-4 w-4 text-[#8B8D9E] flex-shrink-0" />
                      </div>
                      <p className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-wide text-[#5C5E6E]">
                        FROM ●●●●●●●●
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#D8D5C8] text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <p className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#5C5E6E] mt-3">
                        {message.received}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </main>

      <footer className="text-center py-6 border-t border-[#1C1E29]">
        <p className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.15em] uppercase text-[#5C5E6E]">
          TrueFeedback · Anonymous by design · © {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}

export default Home
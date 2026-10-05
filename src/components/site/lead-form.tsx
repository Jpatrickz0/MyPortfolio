"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { profile } from "@/content";

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email."),
  company: z.string().optional(),
  message: z.string().min(10, "Tell me a little about the project."),
  // Honeypot — bots fill this; humans never see it.
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

export function LeadForm() {
  const [done, setDone] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", company: "", message: "", website: "" },
  });

  async function onSubmit(values: FormValues) {
    if (values.website) return; // honeypot tripped
    try {
      // FormSubmit forwards the submission straight to profile.email (Gmail).
      // The very first submission triggers a one-time activation email.
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          company: values.company || "—",
          message: values.message,
          _subject: `New portfolio inquiry from ${values.name}`,
          _replyto: values.email,
          _template: "table",
          _captcha: "false",
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || String(result.success) !== "true") {
        const msg: string = result.message || `Request failed (${res.status})`;
        console.error("Lead form:", res.status, result);
        // First-ever submission: FormSubmit emails an activation link instead.
        if (/activat/i.test(msg)) {
          toast.info("Almost there — check your Gmail and click “Activate Form”, then send again.", {
            duration: 10000,
          });
          return;
        }
        throw new Error(msg);
      }
      setDone(true);
      toast.success("Message sent — I'll be in touch within a day.");
      form.reset();
    } catch (err) {
      console.error("Lead form:", err);
      toast.error("Something went wrong. Email me directly instead.");
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/60 p-12 text-center">
        <CheckCircle2 className="size-12 text-brand" />
        <h3 className="mt-6 font-display text-2xl tracking-tight">
          Thanks — message received.
        </h3>
        <p className="mt-3 max-w-sm text-muted-foreground">
          I read every inquiry personally and reply within one business day.
          Talk soon.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setDone(false)}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-2xl border border-border bg-card/40 p-6 sm:p-8"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="jane@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Company <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What are you building?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A few lines about your project, goals, and timeline…"
                  className="min-h-[140px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot field — visually hidden, off the tab order */}
        <div className="hidden" aria-hidden>
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <input tabIndex={-1} autoComplete="off" {...field} />
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send project details
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          No spam, ever. I&apos;ll only use this to reply to your inquiry.
        </p>
      </form>
    </Form>
  );
}

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";

interface Subject {
  value: string;
  label: string;
}

interface FormLabels {
  formTitle: string;
  name: string;
  namePlaceholder: string;
  company: string;
  companyPlaceholder: string;
  email: string;
  emailPlaceholder: string;
  subject: string;
  subjectPlaceholder: string;
  subjects: Subject[];
  message: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  successTitle: string;
  successDesc: string;
  successReset: string;
  error: string;
  validation: Record<string, string>;
}

interface Props {
  labels: FormLabels;
  defaultSubject?: string;
}

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-text-main placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

const errorClass = "mt-1 text-xs text-red-500";

export default function ContactForm({ labels, defaultSubject }: Props) {
  const schema = contactSchema(labels.validation as Parameters<typeof contactSchema>[0]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
  });

  // Map URL ?subject=proje → matching select value
  useEffect(() => {
    if (!defaultSubject) return;
    const match = labels.subjects.find(
      (s) =>
        s.value === defaultSubject ||
        s.value.toLowerCase().includes(defaultSubject.toLowerCase())
    );
    if (match) setValue("subject", match.value);
  }, [defaultSubject, labels.subjects, setValue]);


  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? labels.error);
      }
    } catch (err) {
      throw err; // react-hook-form catches this and sets isSubmitSuccessful = false
    }
  };

  // Success state
  if (isSubmitSuccessful) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-white py-16 text-center px-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <div>
          <p className="text-lg font-bold text-text-main">{labels.successTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{labels.successDesc}</p>
        </div>
        <button
          onClick={() => reset()}
          className="rounded-lg border border-border px-5 py-2 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          {labels.successReset}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
      <h2 className="mb-6 text-lg font-bold text-text-main">{labels.formTitle}</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

        {/* Name + Company */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text-main">
              {labels.name} <span className="text-red-400">*</span>
            </label>
            <input
              {...register("name")}
              placeholder={labels.namePlaceholder}
              className={inputClass}
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text-main">
              {labels.company}
            </label>
            <input
              {...register("company")}
              placeholder={labels.companyPlaceholder}
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-text-main">
            {labels.email} <span className="text-red-400">*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder={labels.emailPlaceholder}
            className={inputClass}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        {/* Subject */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-text-main">
            {labels.subject}
          </label>
          <select
            {...register("subject")}
            className={`${inputClass} cursor-pointer`}
            defaultValue=""
          >
            <option value="" disabled>
              {labels.subjectPlaceholder}
            </option>
            {labels.subjects.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-text-main">
            {labels.message} <span className="text-red-400">*</span>
          </label>
          <textarea
            {...register("message")}
            rows={5}
            placeholder={labels.messagePlaceholder}
            className={inputClass}
          />
          {errors.message && (
            <p className={errorClass}>{errors.message.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              {labels.sending}
            </>
          ) : (
            labels.send
          )}
        </button>

        {/* Root error (server error) */}
        {errors.root && (
          <p className="text-center text-sm text-red-500">{errors.root.message}</p>
        )}
      </form>
    </div>
  );
}

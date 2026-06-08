"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { SignaturePad, type SignatureValue } from "@/components/forms/signature-pad";

// ─── Schemas ────────────────────────────────────────────────────────────────

const personalSchema = z.object({
  fullName: z.string().min(2, "Navn skal være mindst 2 tegn"),
  dateOfBirth: z.string().min(1, "Vælg fødselsdato"),
  passportNumber: z.string().min(5, "Ugyldigt pasnummer"),
});

const contactSchema = z.object({
  email: z.string().email("Ugyldig email"),
  phone: z.string().min(8, "Ugyldigt telefonnummer"),
  address: z.string().min(5, "Indtast adresse"),
  city: z.string().min(2, "Indtast by"),
  postalCode: z.string().min(4, "Ugyldigt postnummer"),
  country: z.string().min(1, "Vælg land"),
});

const accountSchema = z
  .object({
    password: z
      .string()
      .min(8, "Adgangskode skal være mindst 8 tegn")
      .regex(/[A-Z]/, "Adgangskode skal indeholde mindst ét stort bogstav")
      .regex(/[0-9]/, "Adgangskode skal indeholde mindst ét tal"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Adgangskoderne er ikke ens",
    path: ["confirmPassword"],
  });

type PersonalData = z.infer<typeof personalSchema>;
type ContactData = z.infer<typeof contactSchema>;
type AccountData = z.infer<typeof accountSchema>;

// ─── Step definitions ────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, title: "Personlige oplysninger", short: "Person" },
  { id: 2, title: "Kontaktoplysninger", short: "Kontakt" },
  { id: 3, title: "Upload dokumenter", short: "Filer" },
  { id: 4, title: "Gennemgang & betaling", short: "Betaling" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
    >
      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </motion.p>
  );
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-300 mb-1.5">
      {children}
      {required && <span className="text-[#d4af37] ml-1">*</span>}
    </label>
  );
}

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37]/60 hover:border-white/20";

const inputErrorClass =
  "w-full bg-red-500/5 border border-red-500/40 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50";

// ─── File Upload ─────────────────────────────────────────────────────────────

interface UploadedFile {
  file: File;
  preview?: string;
  uploading: boolean;
  url?: string;
  error?: string;
}

function FileUploadZone({
  label,
  accept,
  onFile,
  file,
}: {
  label: string;
  accept: string;
  onFile: (f: File) => void;
  file?: UploadedFile;
}) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFile(dropped);
    },
    [onFile]
  );

  return (
    <div>
      <Label htmlFor={label}>{label}</Label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-200 ${
          dragging
            ? "border-[#d4af37] bg-[#d4af3710]"
            : file
            ? "border-green-500/40 bg-green-500/5"
            : "border-white/10 bg-white/5 hover:border-white/20"
        }`}
      >
        <label className="flex flex-col items-center justify-center py-8 px-4 cursor-pointer">
          <input
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
          {file ? (
            <div className="text-center">
              {file.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={file.preview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg mx-auto mb-2 border border-white/10"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-[#d4af3720] flex items-center justify-center mx-auto mb-2">
                  <svg className="w-7 h-7 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              <p className="text-green-400 text-sm font-medium">{file.file.name}</p>
              <p className="text-slate-500 text-xs mt-1">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
              <p className="text-[#d4af37] text-xs mt-2 underline">Skift fil</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-slate-300 text-sm font-medium">
                Træk fil hertil eller{" "}
                <span className="text-[#d4af37]">vælg fil</span>
              </p>
              <p className="text-slate-500 text-xs mt-1">PDF, JPG, PNG – maks. 10 MB</p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ApplicationForm() {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const needsAccount = sessionStatus === "unauthenticated";
  const [accountMode, setAccountMode] = useState<"register" | "login">("register");
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSubmitting, setAccountSubmitting] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [passportFile, setPassportFile] = useState<UploadedFile | undefined>();
  const [addressFile, setAddressFile] = useState<UploadedFile | undefined>();
  const [otherFiles, setOtherFiles] = useState<UploadedFile[]>([]);
  const [signature, setSignature] = useState<SignatureValue | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ─ Step 1 form
  const form1 = useForm<PersonalData>({
    resolver: zodResolver(personalSchema),
    defaultValues: personalData ?? { fullName: "", dateOfBirth: "", passportNumber: "" },
  });

  // ─ Step 2 form
  const form2 = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactData ?? { email: "", phone: "", address: "", city: "", postalCode: "", country: "Danmark" },
  });

  // ─ Inline account-creation form (only rendered/used when not logged in)
  const formAccount = useForm<AccountData>({
    resolver: zodResolver(accountSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const goTo = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const handleFile = (
    setter: React.Dispatch<React.SetStateAction<UploadedFile | undefined>>,
    file: File
  ) => {
    const isImage = file.type.startsWith("image/");
    const preview = isImage ? URL.createObjectURL(file) : undefined;
    setter({ file, preview, uploading: false });
  };

  const uploadFile = async (uploadedFile: UploadedFile): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", uploadedFile.file);
    try {
      const res = await fetch("/api/documents/upload", { method: "POST", body: formData });
      if (!res.ok) return null;
      const data = await res.json();
      return data.url as string;
    } catch {
      return null;
    }
  };

  // Step 2 → 3: validates contact info and, for logged-out visitors, creates
  // (or signs into) their account inline so they're authenticated before the
  // document upload step — which requires a session — and before payment.
  const onContactSubmit = form2.handleSubmit(async (data) => {
    if (!needsAccount) {
      setContactData(data);
      goTo(3);
      return;
    }

    setAccountError(null);

    if (accountMode === "login") {
      if (!loginPassword) {
        setAccountError("Indtast din adgangskode");
        return;
      }
      setAccountSubmitting(true);
      try {
        const result = await signIn("credentials", { email: data.email, password: loginPassword, redirect: false });
        if (result?.error) {
          setAccountError("Forkert adgangskode. Prøv igen.");
          return;
        }
      } finally {
        setAccountSubmitting(false);
      }
      setContactData(data);
      goTo(3);
      return;
    }

    const accountValid = await formAccount.trigger();
    if (!accountValid) return;
    const { password } = formAccount.getValues();

    setAccountSubmitting(true);
    try {
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: personalData?.fullName, email: data.email, password }),
      });

      if (regRes.status === 409) {
        setAccountMode("login");
        setAccountError("Der findes allerede en konto med denne e-mail. Indtast din adgangskode for at fortsætte.");
        return;
      }
      if (!regRes.ok) {
        const err = await regRes.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Kunne ikke oprette konto");
      }

      const result = await signIn("credentials", { email: data.email, password, redirect: false });
      if (result?.error) throw new Error("Konto oprettet, men login fejlede. Prøv igen.");
    } catch (err) {
      setAccountError(err instanceof Error ? err.message : "Der opstod en fejl");
      return;
    } finally {
      setAccountSubmitting(false);
    }

    setContactData(data);
    goTo(3);
  });

  const handleSubmit = async () => {
    if (!personalData || !contactData) return;
    if (!signature) {
      setSubmitError("Du skal underskrive og acceptere samtykkeerklæringen, før du kan fortsætte");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Upload documents
      const docs: { url: string; name: string; type: string }[] = [];

      if (passportFile) {
        const url = await uploadFile(passportFile);
        if (url) docs.push({ url, name: passportFile.file.name, type: "PASSPORT" });
      }
      if (addressFile) {
        const url = await uploadFile(addressFile);
        if (url) docs.push({ url, name: addressFile.file.name, type: "PROOF_OF_ADDRESS" });
      }
      for (const f of otherFiles) {
        const url = await uploadFile(f);
        if (url) docs.push({ url, name: f.file.name, type: "OTHER" });
      }

      // Create application
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...personalData, ...contactData, documents: docs, signature }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Der opstod en fejl");
      }

      const { applicationId } = await res.json() as { applicationId: string };

      // Create Stripe checkout
      const checkoutRes = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });

      if (!checkoutRes.ok) throw new Error("Betalingslink kunne ikke oprettes");

      const { url } = await checkoutRes.json() as { url: string };
      router.push(url);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Der opstod en ukendt fejl");
    } finally {
      setSubmitting(false);
    }
  };

  // Animation variants
  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Progress header */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 mb-4">
        {/* Step labels */}
        <div className="flex justify-between mb-4">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center gap-1 flex-1 ${step.id < currentStep ? "cursor-pointer" : ""}`}
              onClick={() => step.id < currentStep && goTo(step.id)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step.id === currentStep
                    ? "bg-[#d4af37] text-[#0f172a] shadow-lg shadow-[#d4af3740]"
                    : step.id < currentStep
                    ? "bg-[#d4af3730] text-[#d4af37] border border-[#d4af37]"
                    : "bg-white/5 text-slate-500 border border-white/10"
                }`}
              >
                {step.id < currentStep ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block transition-colors ${
                  step.id === currentStep ? "text-[#d4af37]" : step.id < currentStep ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {step.short}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#d4af37] to-[#f0d060] rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>

        <p className="text-center text-slate-400 text-xs mt-3">
          Trin {currentStep} af {STEPS.length} — {STEPS[currentStep - 1].title}
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-6 sm:p-8"
          >
            {/* ── Step 1 ── */}
            {currentStep === 1 && (
              <form
                onSubmit={form1.handleSubmit((data) => {
                  setPersonalData(data);
                  goTo(2);
                })}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Personlige oplysninger</h2>
                  <p className="text-slate-400 text-sm">Dine grundlæggende identifikationsoplysninger</p>
                </div>

                <div>
                  <Label htmlFor="fullName" required>Fulde navn (som i pas)</Label>
                  <input
                    id="fullName"
                    {...form1.register("fullName")}
                    placeholder="Anders Andersen"
                    className={form1.formState.errors.fullName ? inputErrorClass : inputClass}
                  />
                  <FieldError message={form1.formState.errors.fullName?.message} />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth" required>Fødselsdato</Label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    {...form1.register("dateOfBirth")}
                    className={`${form1.formState.errors.dateOfBirth ? inputErrorClass : inputClass} [color-scheme:dark]`}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  <FieldError message={form1.formState.errors.dateOfBirth?.message} />
                </div>

                <div>
                  <Label htmlFor="passportNumber" required>Pasnummer</Label>
                  <input
                    id="passportNumber"
                    {...form1.register("passportNumber")}
                    placeholder="PA1234567"
                    className={form1.formState.errors.passportNumber ? inputErrorClass : inputClass}
                  />
                  <FieldError message={form1.formState.errors.passportNumber?.message} />
                </div>

                <StepNavigation
                  onBack={null}
                  submitLabel="Næste"
                  isSubmit
                />
              </form>
            )}

            {/* ── Step 2 ── */}
            {currentStep === 2 && (
              <form onSubmit={onContactSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Kontaktoplysninger</h2>
                  <p className="text-slate-400 text-sm">Hvor kan vi kontakte dig?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" required>E-mail</Label>
                    <input
                      id="email"
                      type="email"
                      {...form2.register("email")}
                      placeholder="dig@eksempel.dk"
                      className={form2.formState.errors.email ? inputErrorClass : inputClass}
                    />
                    <FieldError message={form2.formState.errors.email?.message} />
                  </div>
                  <div>
                    <Label htmlFor="phone" required>Telefon</Label>
                    <input
                      id="phone"
                      type="tel"
                      {...form2.register("phone")}
                      placeholder="+45 12 34 56 78"
                      className={form2.formState.errors.phone ? inputErrorClass : inputClass}
                    />
                    <FieldError message={form2.formState.errors.phone?.message} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" required>Adresse</Label>
                  <input
                    id="address"
                    {...form2.register("address")}
                    placeholder="Storgade 1"
                    className={form2.formState.errors.address ? inputErrorClass : inputClass}
                  />
                  <FieldError message={form2.formState.errors.address?.message} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <Label htmlFor="postalCode" required>Postnummer</Label>
                    <input
                      id="postalCode"
                      {...form2.register("postalCode")}
                      placeholder="1000"
                      className={form2.formState.errors.postalCode ? inputErrorClass : inputClass}
                    />
                    <FieldError message={form2.formState.errors.postalCode?.message} />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <Label htmlFor="city" required>By</Label>
                    <input
                      id="city"
                      {...form2.register("city")}
                      placeholder="København"
                      className={form2.formState.errors.city ? inputErrorClass : inputClass}
                    />
                    <FieldError message={form2.formState.errors.city?.message} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country" required>Land</Label>
                  <select
                    id="country"
                    {...form2.register("country")}
                    className={`${form2.formState.errors.country ? inputErrorClass : inputClass} [color-scheme:dark]`}
                  >
                    <option value="Danmark">Danmark</option>
                    <option value="Sverige">Sverige</option>
                    <option value="Norge">Norge</option>
                    <option value="Finland">Finland</option>
                    <option value="Island">Island</option>
                    <option value="Spanien">Spanien</option>
                    <option value="Andet">Andet</option>
                  </select>
                  <FieldError message={form2.formState.errors.country?.message} />
                </div>

                {needsAccount && (
                  <div className="border border-white/10 rounded-xl p-5 bg-white/[0.02] space-y-4">
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-1">
                        {accountMode === "register" ? "Opret din konto" : "Log ind på din konto"}
                      </h3>
                      <p className="text-slate-400 text-xs">
                        {accountMode === "register"
                          ? "Du skal bruge en konto for at uploade dokumenter og følge din ansøgning. Vi opretter den automatisk med e-mailen ovenfor — du behøver ikke registrere dig separat."
                          : "Der findes allerede en konto med denne e-mail. Indtast din adgangskode for at fortsætte — så er du logget ind resten af forløbet."}
                      </p>
                    </div>

                    {accountMode === "register" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="password" required>Adgangskode</Label>
                          <input
                            id="password"
                            type="password"
                            {...formAccount.register("password")}
                            placeholder="Mindst 8 tegn, 1 stort bogstav, 1 tal"
                            className={formAccount.formState.errors.password ? inputErrorClass : inputClass}
                          />
                          <FieldError message={formAccount.formState.errors.password?.message} />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword" required>Bekræft adgangskode</Label>
                          <input
                            id="confirmPassword"
                            type="password"
                            {...formAccount.register("confirmPassword")}
                            placeholder="Gentag adgangskode"
                            className={formAccount.formState.errors.confirmPassword ? inputErrorClass : inputClass}
                          />
                          <FieldError message={formAccount.formState.errors.confirmPassword?.message} />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="loginPassword" required>Adgangskode</Label>
                        <input
                          id="loginPassword"
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Din adgangskode"
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMode("register");
                            setAccountError(null);
                            setLoginPassword("");
                          }}
                          className="text-xs text-[#d4af37] hover:underline mt-2"
                        >
                          Opret en ny konto i stedet
                        </button>
                      </div>
                    )}

                    {accountError && <FieldError message={accountError} />}
                  </div>
                )}

                <StepNavigation
                  onBack={() => goTo(1)}
                  submitLabel={accountSubmitting ? "Et øjeblik…" : "Næste"}
                  isSubmit
                  disabled={accountSubmitting}
                />
              </form>
            )}

            {/* ── Step 3 ── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Upload dokumenter</h2>
                  <p className="text-slate-400 text-sm">
                    Upload de nødvendige dokumenter til din ansøgning
                  </p>
                </div>

                <FileUploadZone
                  label="Pasfoto (obligatorisk)"
                  accept="image/jpeg,image/png,application/pdf"
                  file={passportFile}
                  onFile={(f) => handleFile(setPassportFile, f)}
                />

                <FileUploadZone
                  label="Adressebevis (obligatorisk)"
                  accept="image/jpeg,image/png,application/pdf"
                  file={addressFile}
                  onFile={(f) => handleFile(setAddressFile, f)}
                />

                <div>
                  <Label htmlFor="other-files">Andre dokumenter (valgfrit)</Label>
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/5 hover:border-white/20 transition-all">
                    <label className="flex flex-col items-center justify-center py-6 px-4 cursor-pointer">
                      <input
                        id="other-files"
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        multiple
                        className="sr-only"
                        onChange={(e) => {
                          const files = Array.from(e.target.files ?? []);
                          setOtherFiles((prev) => [
                            ...prev,
                            ...files.map((f) => ({
                              file: f,
                              preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
                              uploading: false,
                            })),
                          ]);
                        }}
                      />
                      <svg className="w-6 h-6 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-slate-400 text-sm">Tilføj flere filer</span>
                    </label>
                  </div>
                  {otherFiles.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {otherFiles.map((f, i) => (
                        <li key={i} className="flex items-center justify-between text-xs text-slate-400 bg-white/5 rounded-lg px-3 py-2">
                          <span className="truncate">{f.file.name}</span>
                          <button
                            type="button"
                            onClick={() => setOtherFiles((prev) => prev.filter((_, idx) => idx !== i))}
                            className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-[#d4af3710] border border-[#d4af3730] rounded-xl p-4 text-sm text-slate-300">
                  <p className="font-medium text-[#d4af37] mb-1">Hvad skal du uploade?</p>
                  <ul className="space-y-0.5 text-slate-400 text-xs">
                    <li>• Alle relevante sider af dit pas</li>
                    <li>• Folkeregisterattest eller lignende adressebevis</li>
                    <li>• Eventuelle støttedokumenter (ansættelseskontrakt, ejendomsdokumenter osv.)</li>
                  </ul>
                </div>

                <StepNavigation
                  onBack={() => goTo(2)}
                  onNext={() => goTo(4)}
                  submitLabel="Næste"
                />
              </div>
            )}

            {/* ── Step 4 ── */}
            {currentStep === 4 && personalData && contactData && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Gennemgang & betaling</h2>
                  <p className="text-slate-400 text-sm">Kontroller dine oplysninger inden betaling</p>
                </div>

                {/* Summary cards */}
                <div className="space-y-3">
                  <SummaryCard title="Personlige oplysninger">
                    <SummaryRow label="Navn" value={personalData.fullName} />
                    <SummaryRow label="Fødselsdato" value={new Date(personalData.dateOfBirth).toLocaleDateString("da-DK")} />
                    <SummaryRow label="Pasnummer" value={personalData.passportNumber} />
                  </SummaryCard>

                  <SummaryCard title="Kontaktoplysninger">
                    <SummaryRow label="E-mail" value={contactData.email} />
                    <SummaryRow label="Telefon" value={contactData.phone} />
                    <SummaryRow label="Adresse" value={`${contactData.address}, ${contactData.postalCode} ${contactData.city}`} />
                    <SummaryRow label="Land" value={contactData.country} />
                  </SummaryCard>

                  <SummaryCard title="Dokumenter">
                    <SummaryRow label="Pasfoto" value={passportFile ? passportFile.file.name : "Ikke uploadet"} warn={!passportFile} />
                    <SummaryRow label="Adressebevis" value={addressFile ? addressFile.file.name : "Ikke uploadet"} warn={!addressFile} />
                    {otherFiles.length > 0 && (
                      <SummaryRow label="Andre" value={`${otherFiles.length} fil(er)`} />
                    )}
                  </SummaryCard>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-br from-[#d4af3715] to-[#d4af3705] border border-[#d4af3740] rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">NIE Ansøgning</p>
                      <p className="text-slate-400 text-xs mt-0.5">Professionel hjælp inkl. notarbekræftelse</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#d4af37] text-2xl font-bold">210 EUR</p>
                      <p className="text-slate-500 text-xs">inkl. moms</p>
                    </div>
                  </div>
                </div>

                <DisclaimerBanner variant="dark" size="sm" />

                <SignaturePad onChange={setSignature} />

                {submitError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                    {submitError}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => goTo(3)}
                    className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-all"
                  >
                    Tilbage
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || !signature}
                    className="flex-[2] py-3 px-4 rounded-xl bg-[#d4af37] text-[#0f172a] text-sm font-bold hover:bg-[#e5c040] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#d4af3730]"
                  >
                    {submitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Behandler...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Gå til betaling — 210 EUR
                      </>
                    )}
                  </button>
                </div>

                <p className="text-slate-500 text-xs text-center">
                  Sikker betaling via Stripe. Du bliver videresendt til Stripes betalingsside.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Helper UI Components ────────────────────────────────────────────────────

function StepNavigation({
  onBack,
  onNext,
  submitLabel,
  isSubmit,
  disabled,
}: {
  onBack: (() => void) | null;
  onNext?: () => void;
  submitLabel: string;
  isSubmit?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-3 pt-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-all"
        >
          Tilbage
        </button>
      )}
      {isSubmit ? (
        <button
          type="submit"
          disabled={disabled}
          className={`${onBack ? "flex-[2]" : "w-full"} py-3 px-4 rounded-xl bg-[#d4af37] text-[#0f172a] text-sm font-bold hover:bg-[#e5c040] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#d4af3720] disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {submitLabel}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className={`${onBack ? "flex-[2]" : "w-full"} py-3 px-4 rounded-xl bg-[#d4af37] text-[#0f172a] text-sm font-bold hover:bg-[#e5c040] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#d4af3720]`}
        >
          {submitLabel}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-white/5 border-b border-white/10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
      </div>
      <div className="px-4 py-3 space-y-2">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={warn ? "text-amber-400" : "text-slate-200"}>{value}</span>
    </div>
  );
}

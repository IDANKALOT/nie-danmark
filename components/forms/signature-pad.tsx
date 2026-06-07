"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Eraser } from "lucide-react";

export const SIGNATURE_CONSENT_TEXT =
  "Jeg bekræfter, at oplysningerne i denne ansøgning er korrekte efter bedste overbevisning, og at min underskrift herunder udgør mit digitale samtykke til, at NIE Danmark må forberede og koordinere indsendelsen af min NIE-ansøgning på mine vegne.";

export interface SignatureValue {
  dataUrl: string;
  consentGiven: boolean;
  consentText: string;
}

interface SignaturePadProps {
  onChange: (value: SignatureValue | null) => void;
}

export function SignaturePad({ onChange }: SignaturePadProps) {
  const sigRef = useRef<SignatureCanvas>(null);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const emit = useCallback(
    (drawing: boolean, consent: boolean) => {
      if (!drawing || !consent || !sigRef.current || sigRef.current.isEmpty()) {
        onChange(null);
        return;
      }
      onChange({
        dataUrl: sigRef.current.toDataURL("image/png"),
        consentGiven: true,
        consentText: SIGNATURE_CONSENT_TEXT,
      });
    },
    [onChange]
  );

  const handleEnd = useCallback(() => {
    const empty = sigRef.current?.isEmpty() ?? true;
    setHasDrawing(!empty);
    emit(!empty, consentGiven);
  }, [consentGiven, emit]);

  const handleClear = useCallback(() => {
    sigRef.current?.clear();
    setHasDrawing(false);
    emit(false, consentGiven);
  }, [consentGiven, emit]);

  const handleConsentChange = useCallback(
    (checked: boolean) => {
      setConsentGiven(checked);
      emit(hasDrawing, checked);
    },
    [hasDrawing, emit]
  );

  // Re-emit on resize so a stale data URL from a different canvas size isn't kept.
  useEffect(() => {
    const onResize = () => emit(hasDrawing, consentGiven);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hasDrawing, consentGiven, emit]);

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-white mb-1">Digital underskrift</h3>
        <p className="text-slate-400 text-xs">
          Skriv din underskrift med fingeren (mobil/tablet) eller musen herunder.
        </p>
      </div>

      <div className="relative rounded-xl border border-white/10 bg-white overflow-hidden">
        <SignatureCanvas
          ref={sigRef}
          penColor="#0f172a"
          canvasProps={{
            className: "w-full touch-none",
            style: { height: 180, display: "block" },
          }}
          onEnd={handleEnd}
        />
        {!hasDrawing && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-slate-300 text-sm">
            Underskriv her
          </p>
        )}
        <button
          type="button"
          onClick={handleClear}
          className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/90 text-slate-600 border border-slate-200 hover:bg-white transition-all"
        >
          <Eraser size={13} />
          Ryd
        </button>
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={consentGiven}
          onChange={(e) => handleConsentChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded cursor-pointer flex-shrink-0"
        />
        <span className="text-xs text-slate-400 leading-relaxed">{SIGNATURE_CONSENT_TEXT}</span>
      </label>
    </div>
  );
}

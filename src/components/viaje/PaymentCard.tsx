import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface PaymentCardProps {
  label: string;
  value: string;
  subline?: string;
  featured?: boolean;
  mono?: boolean;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  label,
  value,
  subline,
  featured = false,
  mono = false,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(t("viaje.copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Error");
    }
  };

  return (
    <div
      className={`rounded-2xl border border-amber-900/20 bg-[#fdfaf3] shadow-sm transition-shadow hover:shadow-md ${
        featured ? "p-6 md:p-8" : "p-5"
      }`}
    >
      <p
        className={`font-cinzel uppercase tracking-widest text-amber-900/70 ${
          featured ? "text-sm" : "text-xs"
        }`}
      >
        {label}
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span
          className={`${mono ? "font-mono" : "font-cinzel"} text-amber-950 break-all ${
            featured ? "text-lg md:text-xl" : "text-base"
          }`}
        >
          {value}
        </span>
        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1.5 rounded-md border border-amber-900/30 bg-amber-50 px-3 py-1.5 text-xs font-cinzel text-amber-900 hover:bg-amber-100 transition-colors"
          aria-label={t("viaje.copy")}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">
            {copied ? t("viaje.copied") : t("viaje.copy")}
          </span>
        </button>
      </div>
      {subline && (
        <p className="mt-2 text-xs text-amber-900/60 font-antiqua">{subline}</p>
      )}
    </div>
  );
};

export default PaymentCard;
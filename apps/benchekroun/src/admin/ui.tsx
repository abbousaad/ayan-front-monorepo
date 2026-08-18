import { createImageUrl } from '@acme/api-client';
import { FiX } from 'react-icons/fi';

import type { LocalizedInput } from './admin-api';

export const EMPTY_LOCALIZED: LocalizedInput = { en: '', fr: '', ar: '' };

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4" dir="ltr">
      <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button aria-label="Close" className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={onClose} type="button">
            <FiX size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200';
export const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-slate-500';
export const primaryBtn =
  'inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50';
export const ghostBtn =
  'inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100';
export const dangerBtn =
  'inline-flex items-center justify-center rounded-lg border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50';

const LOCALES: { code: keyof LocalizedInput; label: string; dir?: 'rtl' }[] = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'AR', dir: 'rtl' }
];

export function ImagePicker({
  currentImageUrl,
  files,
  onChange
}: {
  currentImageUrl?: string | null;
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const previews = files.map((file) => URL.createObjectURL(file));

  return (
    <div className="space-y-2">
      <span className={labelClass}>Images</span>
      <div className="flex flex-wrap items-center gap-2">
        {files.length > 0
          ? previews.map((src, index) => (
              <img alt="" className="h-16 w-16 rounded-lg border border-slate-200 object-cover" key={index} src={src} />
            ))
          : currentImageUrl && (
              <img alt="" className="h-16 w-16 rounded-lg border border-slate-200 object-cover" src={createImageUrl(currentImageUrl)} />
            )}
      </div>
      <input
        accept="image/*"
        className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700"
        multiple
        onChange={(event) => onChange(Array.from(event.target.files ?? []))}
        type="file"
      />
      {files.length > 0 && <p className="text-xs text-slate-500">{files.length} new file(s) — replaces current on save.</p>}
    </div>
  );
}

type LocalizedFieldProps = {
  label: string;
  value: LocalizedInput;
  onChange: (value: LocalizedInput) => void;
  textarea?: boolean;
  required?: boolean;
};

export function LocalizedField({ label, value, onChange, textarea, required }: LocalizedFieldProps) {
  return (
    <fieldset className="space-y-2">
      <legend className={labelClass}>
        {label} {required && <span className="text-rose-600">*</span>}
      </legend>
      <div className="grid gap-2">
        {LOCALES.map((locale) => (
          <div className="flex items-start gap-2" key={locale.code}>
            <span className="mt-2 w-8 shrink-0 text-xs font-bold text-slate-400">{locale.label}</span>
            {textarea ? (
              <textarea
                className={`${inputClass} min-h-16 resize-none`}
                dir={locale.dir}
                onChange={(event) => onChange({ ...value, [locale.code]: event.target.value })}
                value={value[locale.code]}
              />
            ) : (
              <input
                className={inputClass}
                dir={locale.dir}
                onChange={(event) => onChange({ ...value, [locale.code]: event.target.value })}
                value={value[locale.code]}
              />
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
}

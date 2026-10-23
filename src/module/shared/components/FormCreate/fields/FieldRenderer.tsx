import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import type { Field, FieldType } from "../types";

const CONTROL =
  "w-full rounded-tarjeta border border-linea bg-white px-4 py-3 text-base text-tinta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento-600 aria-[invalid=true]:border-error";

type Control = (props: React.ComponentProps<"input"> & React.ComponentProps<"textarea">) => React.ReactNode;

// Registro tipo de campo → control (en vez de un switch).
const CONTROLES: Record<FieldType, Control> = {
  text: (props) => <input type="text" className={CONTROL} {...props} />,
  textarea: (props) => <textarea rows={6} className={CONTROL} {...props} />,
  lines: (props) => <textarea rows={4} className={CONTROL} {...props} />,
};

type Props = { field: Field; register: UseFormRegisterReturn; error?: FieldError; length: number };

// Etiqueta, control, ayuda con contador y el error bajo el campo.
export function FieldRenderer({ field, register, error, length }: Readonly<Props>) {
  const { key, label, type, required, maxLength, help, placeholder } = field;
  const Control = CONTROLES[type];
  const ayuda = `${key}-ayuda`;
  const errorId = `${key}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={key} className="text-sm font-semibold text-marca-900">
        {label} {required && <span className="text-acento-700">*</span>}
      </label>
      <Control
        id={key}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${ayuda} ${errorId}` : ayuda}
        {...register}
      />
      <p id={ayuda} className="flex justify-between gap-3 text-sm text-tinta-suave">
        <span>{help}</span>
        {maxLength && <span aria-hidden="true">{length} / {maxLength}</span>}
      </p>
      {error && (
        <p id={errorId} className="text-sm font-semibold text-error">
          {error.message}
        </p>
      )}
    </div>
  );
}

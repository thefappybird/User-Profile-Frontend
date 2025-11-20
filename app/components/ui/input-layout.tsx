import React, { type ReactNode } from "react";

function InputLayout({
  label,
  errMessage,
  children,
}: {
  label: string;
  errMessage: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {errMessage && <span className="text-sm text-red-500">{errMessage}</span>}
    </div>
  );
}

export default InputLayout;

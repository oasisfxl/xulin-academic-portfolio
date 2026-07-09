import clsx from "clsx";
import { ReactNode } from "react";

type CalloutProps = {
  children: ReactNode;
  title?: string;
  type?: "note" | "warning" | "idea";
};

const calloutStyles = {
  note: "border-mist/26 bg-mist/[0.055]",
  warning: "border-antique/30 bg-antique/[0.065]",
  idea: "border-violetAsh/30 bg-violetAsh/[0.065]",
};

export function Callout({ children, title, type = "note" }: CalloutProps) {
  return (
    <aside className={clsx("my-8 border p-5", calloutStyles[type])}>
      {title ? (
        <p className="mb-3 text-sm font-medium uppercase text-white/72">
          {title}
        </p>
      ) : null}
      <div className="text-sm leading-7 text-white/68">{children}</div>
    </aside>
  );
}

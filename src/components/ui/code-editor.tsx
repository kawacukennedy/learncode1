import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-200">{label}</label>
        )}
        <textarea
          className={cn(
            "flex min-h-[200px] w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 font-mono",
            error && "border-red-500 focus:ring-red-500",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  },
);

CodeEditor.displayName = "CodeEditor";

export { CodeEditor };

import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  label: string;
  value: number;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({
  label,
  value,
  showPercentage = true,
  className,
}: ProgressBarProps) {
  return (
    <div className={className ? className : "space-y-2"}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        {showPercentage && (
          <span className="text-sm font-semibold text-primary">{value}%</span>
        )}
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}

import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

export default function Index({
  color,
  className,
}: {
  className?: string | undefined;
  color?:
    | "inherit"
    | "disabled"
    | "action"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | undefined;
}) {
  return (
    <HourglassEmptyIcon
      className="animate-pulse"
      color={color}></HourglassEmptyIcon>
  );
}

import clsx from "clsx";

export default function SelectButton({
  active,
  onToggleSelectionActive,
}: {
  active?: boolean;
  onToggleSelectionActive: () => void;
}) {
  return (
    <button
      className={clsx([
        "text-lg font-bold w-6 h-6 rounded-md cursor-pointer flex items-center justify-center",
        active ? "bg-gray-300 text-gray-900" : "text-gray-300 bg-transparent",
      ])}
      onPointerDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.preventDefault();
        onToggleSelectionActive();
      }}
    >
      <span>S</span>
    </button>
  );
}

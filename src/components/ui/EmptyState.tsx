import { FiInbox } from "react-icons/fi";

interface Props {
  message?: string;
}

export default function EmptyState({ message = "No items found" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <FiInbox size={48} className="mb-4" />
      <p className="text-lg">{message}</p>
    </div>
  );
}

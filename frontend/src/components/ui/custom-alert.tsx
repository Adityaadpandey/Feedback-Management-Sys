import { useEffect, useState } from "react";

interface CustomAlertProps {
  title: string;
  desc: string;
  duration?: number; // Duration for auto-dismissal in milliseconds
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"; // Position of the toast
  onClose?: () => void; // Callback when the toast is closed
}

const Custom_Alert = ({
  title,
  desc,
  duration = 3000, // Default to 3 seconds
  position = "bottom-right", // Default position
  onClose,
}: CustomAlertProps) => {
  const [show, setShow] = useState(true);

  // Auto-dismiss after the specified duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose(); // Call the onClose callback if provided
    }, duration);

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, [duration, onClose]);

  // Handle the close button click
  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  if (!show) return null;

  // Dynamically set the position classes
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div
      className={`fixed z-50 ${positionClasses[position]} bg-red-100 border min-w-[200px] border-red-400 text-red-700 px-4 py-3 rounded shadow-md transform transition-all duration-300 ease-in-out opacity-100`}
    >
      <strong className="font-bold">{title}</strong>
      <br />
      <span className="block sm:inline">{desc}</span>
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-red-700 bg-transparent border-none text-xl cursor-pointer"
      >
        &times;
      </button>
    </div>
  );
};

export default Custom_Alert;

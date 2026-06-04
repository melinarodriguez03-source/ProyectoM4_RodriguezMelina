import { useState } from "react";
import type { Task } from "../types";

interface Props {
  tasks: Task[];
  userEmail: string;
}

type Status = "idle" | "loading" | "success" | "error";

const EmailButton = ({ tasks, userEmail }: Props) => {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const sendSummary = async () => {
    if (!userEmail || tasks.length === 0) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toEmail: userEmail, tasks }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al enviar el email.");
      }

      setStatus("success");
      setMessage("¡Email enviado con éxito!");
    } catch (err: unknown) {
      setStatus("error");
      setMessage((err as Error).message ?? "Error desconocido.");
    } finally {
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 4000);
    }
  };

  return (
    <div className="email-btn-wrapper">
      <button
        className="btn-email"
        onClick={sendSummary}
        disabled={status === "loading" || tasks.length === 0}
        title={tasks.length === 0 ? "No hay tareas para enviar" : "Enviar resumen por email"}
      >
        {status === "loading" ? "Enviando..." : "📧 Enviar resumen"}
      </button>
      {message && (
        <span
          className={`email-feedback ${status === "error" ? "email-feedback--error" : ""}`}
        >
          {message}
        </span>
      )}
    </div>
  );
};

export default EmailButton;
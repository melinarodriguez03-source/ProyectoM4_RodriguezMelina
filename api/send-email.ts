import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { toEmail, tasks } = req.body;

  if (!toEmail || !tasks) {
    return res.status(400).json({ error: "Faltan datos requeridos." });
  }

  const pending = tasks.filter((t: any) => t.status === "pending");
  const completed = tasks.filter((t: any) => t.status === "completed");

  const html = `
    <h2>📋 Resumen de tus tareas</h2>

    <h3>✅ Completadas (${completed.length})</h3>
    <ul>
      ${completed.length > 0
        ? completed.map((t: any) => `<li><s>${t.title}</s></li>`).join("")
        : "<li>Ninguna</li>"}
    </ul>

    <h3>⏳ Pendientes (${pending.length})</h3>
    <ul>
      ${pending.length > 0
        ? pending.map((t: any) => `<li>${t.title}</li>`).join("")
        : "<li>Ninguna</li>"}
    </ul>

    <p>Total: ${tasks.length} tarea/s</p>
  `;

  try {
    await ses.send(
      new SendEmailCommand({
        Source: process.env.AWS_SES_FROM_EMAIL!,
        Destination: { ToAddresses: [toEmail] },
        Message: {
          Subject: { Data: "📋 Resumen de tus tareas" },
          Body: { Html: { Data: html } },
        },
      })
    );

    return res.status(200).json({ message: "Email enviado correctamente." });
  } catch (error: any) {
    console.error("SES error:", error);
    return res.status(500).json({ error: "Error al enviar el email." });
  }
}
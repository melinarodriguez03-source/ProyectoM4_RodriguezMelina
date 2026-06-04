# 📋 Todo App — Gestor de Tareas

Aplicación web SPA de gestión de tareas con autenticación, persistencia en la nube, envío de notificaciones por email y deploy en producción.

🔗 **URL de producción:** https://todo-app-pi-one-50.vercel.app

---

## Descripción

Todo App permite a usuarios autenticados gestionar sus tareas diarias de forma organizada y persistente. Cada usuario solo puede ver y modificar sus propias tareas. Incluye la posibilidad de recibir un resumen del estado de las tareas por email.

---

## Stack tecnológico

- **Frontend:** React + TypeScript + Vite
- **Autenticación y base de datos:** Firebase (Auth + Firestore)
- **Envío de emails:** AWS SES via Vercel Functions
- **Deploy:** Vercel
- **Testing:** Vitest + React Testing Library

---

## Decisiones arquitectónicas

El proyecto está organizado por capas con responsabilidades claras:

- `src/pages` — Vistas principales (Login, Register, Tasks)
- `src/components` — Componentes UI reutilizables
- `src/features` — Lógica de dominio (auth, tasks)
- `src/hooks` — Custom hooks (useAuth, useTasks)
- `src/services` — Integraciones con Firebase
- `src/types` — Interfaces y tipos compartidos
- `api/` — Vercel Functions (serverless) para el envío de emails

La lógica de negocio está separada de los componentes de UI mediante custom hooks y servicios. Los componentes solo describen qué se muestra, no cómo se obtienen los datos.

Las credenciales de AWS se manejan exclusivamente en el servidor (Vercel Functions) y nunca llegan al frontend.

---

## Instalación local

### Requisitos
- Node.js 18+
- npm

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/melinarodriguez03-source/ProyectoM4_todo-app.git
cd ProyectoM4_todo-app

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Completar .env con tus credenciales de Firebase y AWS

# 4. Iniciar en modo desarrollo
npm run dev
```

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_FIREBASE_API_KEY` | API key de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain del proyecto Firebase |
| `VITE_FIREBASE_PROJECT_ID` | ID del proyecto Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket de Firebase |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID de Firebase |
| `VITE_FIREBASE_APP_ID` | App ID de Firebase |
| `AWS_ACCESS_KEY_ID` | Access key de AWS IAM |
| `AWS_SECRET_ACCESS_KEY` | Secret key de AWS IAM |
| `AWS_REGION` | Región de AWS SES (ej: `sa-east-1`) |
| `AWS_SES_FROM_EMAIL` | Email verificado en AWS SES |

Las variables `VITE_` son accesibles desde el frontend. Las variables de AWS solo existen en el servidor (Vercel Functions).

---

## Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run preview   # Preview del build
npm run test      # Correr tests
npm run lint      # Linting
```

---

## Flujo de envío de emails

```
Usuario hace click en "Enviar resumen"
        ↓
Frontend hace POST a /api/send-email
con { toEmail, tasks }
        ↓
Vercel Function recibe la solicitud
y construye el HTML del resumen
        ↓
La función llama a AWS SES
con las credenciales del servidor
        ↓
AWS SES envía el email al usuario
```

Las credenciales de AWS nunca son expuestas al frontend. El cliente solo conoce la ruta `/api/send-email` de la propia aplicación.

---

## Testing

```bash
npm run test
```

El proyecto incluye:
- Tests unitarios de funciones utilitarias (`Utils.test.tsx`)
- Tests de componentes principales (`TodoForm.test.tsx`, `TodoList.test.tsx`)
- Mocks de Firebase para aislar los tests de servicios externos

---

## Uso de IA en el desarrollo

Durante el desarrollo se utilizó Claude (Anthropic) como asistente técnico en las siguientes situaciones:

**Resolución de errores de TypeScript:** Al encontrar incompatibilidades de tipos entre componentes, se consultó el error completo y se obtuvo una explicación del problema y la solución. Esto permitió entender el sistema de tipos de TypeScript más profundamente, especialmente el uso de `Pick<T>` y la diferencia entre tipos estructuralmente equivalentes.

**Configuración de AWS SES:** La integración con AWS fue la parte más compleja del proyecto. Se usó IA para entender el flujo correcto (frontend → Vercel Function → AWS SES), el motivo por el que las credenciales no pueden estar en el cliente, y cómo manejar el modo sandbox de SES.

**Depuración del deploy:** Ante errores en Vercel, se compartieron los logs y se obtuvo orientación para identificar la causa raíz de cada problema.

**Patrón aprendido:** La IA fue más efectiva cuando se le proporcionó contexto completo (código, error exacto, logs) en lugar de descripciones vagas. Las respuestas fueron más precisas y accionables con ese nivel de detalle.
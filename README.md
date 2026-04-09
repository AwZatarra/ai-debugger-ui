# 🧠 AI Debugger UI mínima

Frontend del proyecto **AI Debugger**, pensado para visualizar incidentes, ejecutar análisis de causa raíz y seguir el flujo operativo de propuestas de PR hasta la creación de un PR real en GitHub.

---

## ✨ ¿Qué hace?

Esta UI mínima permite:

- ver incidentes detectados por el backend
- entrar al detalle de un incidente
- revisar contexto, summary, incidentes similares y knowledge matches
- ejecutar RCA heurístico
- ejecutar RCA con LLM
- generar una **PR proposal**
- aprobar o rechazar la proposal
- seguir el pipeline operativo del PR:
  - prepare execution
  - generate file edits
  - regenerate file edits
  - validate file edits
  - run local checks
  - create GitHub PR
- visualizar el timeline de **PR Actions**
- abrir el PR real creado en GitHub cuando exista

En resumen: esta UI convierte un backend técnico de debugging en una experiencia visual y operable de punta a punta.

---

## 🛠️ Tecnologías

- **Next.js**
- **TypeScript**
- **React**
- **SWR**
- **Tailwind CSS**
- **API client propio** vía `lib/api`
- integración contra backend **Node.js + TypeScript + ClickHouse + OpenAI**

---

## 📦 Cómo instalar

### 1) Clonar el frontend

```bash
git clone https://github.com/AwZatarra/ai-debugger-ui.git
cd ai-debugger-ui


### 2) Instalar dependencias

```bash
npm install
```

### 3) Crear `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3020
```

---

## ▶️ Cómo arrancarlo

Levanta la UI en local:

```bash
npm run dev
```

La app debería quedar disponible en:

- UI: `http://localhost:3000`

Y debe apuntar al backend en:

- Backend API: `http://localhost:3020`

---

## 🚀 Flujo rápido de uso

1. entrar a `/incidents`
2. abrir un incidente
3. revisar:
   - contexto
   - summary final
   - RCA heurístico
   - RCA LLM
   - similares
   - knowledge
4. generar una **PR proposal**
5. aprobar o rechazar la proposal
6. si está aprobada, ejecutar el pipeline:
   - prepare execution
   - generate/regenerate file edits
   - validate file edits
   - run local checks
   - create GitHub PR
7. abrir el PR real desde la UI si fue creado

---

## 💼 ¿Por qué destaca este proyecto?

Esta UI demuestra trabajo real en:

- integración frontend-backend sobre flujos no triviales
- visualización de incidentes y RCA
- operación de pipelines técnicos desde interfaz
- consumo de múltiples endpoints con estados intermedios persistidos
- diseño de UX mínima pero funcional para herramientas internas
- conexión entre observabilidad, análisis con LLM y automatización de cambios

No es una landing bonita para posar. Es una interfaz operativa para un sistema técnico de verdad.

---

## 👨‍💻 Autor

**Pool Rivera Molina**

- LinkedIn: [Pool Rivera Molina](https://www.linkedin.com/in/pool-rivera-molina/)
- GitHub: [poolriveramolina](https://github.com/AwZatarra)

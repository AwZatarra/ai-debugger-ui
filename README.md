# FRONTEND_PLAYBOOK.md

# AI Debugger UI mínima — Frontend Playbook

## 1. Objetivo

Este playbook documenta el flujo exacto para probar manualmente la **UI mínima** de AI Debugger, validar su conexión con el backend y detectar fallos comunes durante desarrollo local.

Está centrado únicamente en el comportamiento **ya confirmado** de la UI y del backend integrados en este chat.

---

## 2. Alcance actual de la UI

La UI mínima permite operar estos flujos ya confirmados:

- navegar entre **Inicio**, **Incidents** y **Stats**
- listar incidentes
- abrir el detalle de un incidente
- visualizar:
  - contexto
  - summary
  - RCA heurístico
  - RCA LLM
  - similar incidents
  - knowledge matches
  - LLM ranking history
  - LLM feedback
  - LLM evaluation
  - PR Proposal
  - PR Proposal History
  - PR Actions
- ejecutar acciones desde UI:
  - Run heuristic RCA
  - Run LLM RCA
  - Generate PR proposal
  - Approve proposal / Reject proposal
  - Prepare execution
  - Generate file edits
  - Regenerate file edits
  - Validate file edits
  - Run local checks
  - Create GitHub PR

No cubre todavía nada fuera de los endpoints ya confirmados.

---

## 3. Prerrequisitos

### Frontend

- Node.js: **pendiente de validación**
- npm: **pendiente de validación**
- proyecto frontend con Next.js + TypeScript ya instalado

### Backend

Debe estar levantado y respondiendo en:

- `http://localhost:3020`

### Configuración de entorno confirmada

Archivo `/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3020
```

### URL local esperada

- frontend: `http://localhost:3000`
- incidents: `http://localhost:3000/incidents`
- stats: `http://localhost:3000/stats`

---

## 4. Checklist de arranque rápido

Antes de probar la UI, valida esto:

- [ ] backend responde en `http://localhost:3020`
- [ ] frontend responde en `http://localhost:3000`
- [ ] `NEXT_PUBLIC_API_BASE_URL` apunta a `http://localhost:3020`
- [ ] reiniciaste el frontend si cambiaste `.env.local`
- [ ] el incidente de prueba existe en backend
- [ ] no estás usando host de red por error si tu setup local espera `localhost`

---

## 5. Smoke test inicial de conectividad

## 5.1 Probar backend directamente

Abre en navegador o Postman:

- `GET http://localhost:3020/incidents`

### Resultado esperado

- response `200 OK`
- payload con forma similar a:
  - `ok: true`
  - `incidents: []`

Si falla aquí, el problema no es del frontend.

## 5.2 Probar frontend

Abre:

- `http://localhost:3000`

### Resultado esperado

Debe mostrar navegación básica hacia:

- Inicio
- Incidents
- Stats

## 5.3 Probar integración frontend → backend

Abre:

- `http://localhost:3000/incidents`

### Resultado esperado

La pantalla debe mostrar lista de incidentes reales cargados desde backend.

Si la página carga pero no muestra datos:

- revisar consola del navegador
- revisar pestaña Network
- validar `NEXT_PUBLIC_API_BASE_URL`

---

## 6. Flujo manual completo por pantalla

## 6.1 Home

### Ruta

- `/`

### Qué validar

- [ ] se ve el header de la app
- [ ] aparecen links a navegación principal
- [ ] el link a **Incidents** funciona
- [ ] el link a **Stats** funciona

---

## 6.2 Incidents list

### Ruta

- `/incidents`

### Endpoint esperado

- `GET /incidents`

### Qué debe mostrar

Por cada incidente:

- title
- incident_id
- primary_service
- error_type
- error_message
- severity
- status
- created_at
- trace_id
- botón / link para abrir detalle

### Validaciones manuales

- [ ] la lista carga sin error
- [ ] el contador de resultados funciona
- [ ] la búsqueda local filtra por campos visibles
- [ ] el botón **Refrescar** vuelve a consultar backend
- [ ] el link **Ver detalle** abre `/incidents/:id`

### Fallos típicos

**Síntoma:** se ve JSON crudo o campos vacíos

**Causa probable:** componente desalineado con shape real del endpoint

**Solución:** revisar `IncidentList.tsx` y confirmar que use:
- `title`
- `primary_service`
- `error_type`
- `error_message`
- `severity`
- `status`
- `created_at`

---

## 6.3 Incident detail

### Ruta

- `/incidents/:id`

### Caso de prueba usado en este proyecto

Ejemplo usado repetidamente:

- `c086c415-e647-499a-aca2-647b51049ea1`

### Endpoints que deben dispararse al abrir detalle

- `GET /incidents/:id/context`
- `GET /incidents/:id/analysis-summary`
- `GET /incidents/:id/similar`
- `GET /incidents/:id/knowledge`
- `GET /incidents/:id/cause-ranking-llm/history`
- `GET /incidents/:id/llm-cause-ranking/feedback`
- `GET /incidents/:id/llm-cause-ranking/evaluation`
- `GET /incidents/:id/pr-proposal`
- `GET /incidents/:id/pr-proposal/history`
- `GET /incidents/:id/pr-actions`
- `GET /pr-proposals/:proposalId/actions` cuando exista latest proposal

### Qué validar visualmente

- [ ] Contexto
- [ ] Summary final
- [ ] RCA heurístico
- [ ] RCA LLM
- [ ] PR Proposal
- [ ] PR Proposal History
- [ ] PR Actions
- [ ] LLM ranking history
- [ ] Registrar feedback LLM
- [ ] LLM feedback
- [ ] LLM evaluation
- [ ] Similar incidents
- [ ] Knowledge matches

### Botones esperados siempre visibles en cabecera del detalle

- [ ] Refrescar detalle
- [ ] Volver a incidentes

---

## 7. Validación del panel Contexto

### Endpoint

- `GET /incidents/:id/context`

### Qué muestra hoy

El panel actualmente puede mostrar la respuesta del contexto de forma amplia, incluyendo:

- incident
- summary
- evidence
- trace_logs
- nearby_logs
- correlated_errors

### Qué validar

- [ ] la respuesta no rompe el render
- [ ] aparecen logs trazados al incidente
- [ ] no hay error tipo React child inválido

### Fallo típico

**Síntoma:** `Objects are not valid as a React child`

**Causa probable:** se intenta renderizar directamente un objeto completo en JSX

**Solución:** transformar o desestructurar el objeto antes de renderizarlo

---

## 8. Validación del Summary final

### Endpoint

- `GET /incidents/:id/analysis-summary`

### Qué debe mostrar

- Incident ID
- Comparison
  - has_heuristic
  - has_llm
  - agree_on_root_cause
- Final decision
  - final_root_cause
  - final_confidence
  - final_source
  - final_explanation
  - final_suggested_fix
  - final_suggested_patch

### Qué validar

- [ ] comparison se ve legible
- [ ] final_decision no aparece como objeto crudo
- [ ] el summary coincide con el estado del incidente

---

## 9. Validación de RCA heurístico y LLM

## 9.1 Run heuristic RCA

### Botón

- `Run heuristic RCA`

### Endpoint

- `POST /incidents/:id/analyze`

### Qué validar

- [ ] el botón muestra loading
- [ ] aparece mensaje de éxito o error
- [ ] se refresca el detalle
- [ ] el panel de RCA heurístico se actualiza

## 9.2 Run LLM RCA

### Botón

- `Run LLM RCA`

### Endpoint

- `POST /incidents/:id/analyze-llm`

### Qué validar

- [ ] el botón muestra loading
- [ ] aparece mensaje de éxito o error
- [ ] se refresca el detalle
- [ ] el panel de RCA LLM se actualiza

---

## 10. Validación de Similar incidents

### Endpoint

- `GET /incidents/:id/similar`

### Qué debe mostrar

- incident_id
- title
- primary_service
- severity
- similarity_score
- similarity_reason
- created_at

### Qué validar

- [ ] si hay resultados, se renderizan tarjetas
- [ ] si no hay resultados, aparece empty state
- [ ] no se intenta leer `data.similar_incidents` si la respuesta real está en `result.similar_incidents`

---

## 11. Validación de Knowledge matches

### Endpoint

- `GET /incidents/:id/knowledge`

### Qué debe mostrar

- source_type
- source_name
- service
- route
- error_code
- match_score
- match_reason
- text

### Qué validar

- [ ] aparecen los matches reales
- [ ] no se queda en “No hay knowledge matches” cuando backend sí devuelve `result.matches`

---

## 12. Validación de LLM ranking history

### Endpoint

- `GET /incidents/:id/cause-ranking-llm/history`

### Qué debe mostrar

Por entrada de history:

- incident_id
- analyzed_at
- llm_model
- summary
- ranked_causes
  - rank
  - cause
  - confidence
  - classification
  - why
  - evidence_points
  - based_on_candidates

### Qué validar

- [ ] el historial carga
- [ ] cada ranking muestra sus causas
- [ ] el panel no rompe por keys repetidas internas

---

## 13. Validación de Feedback y Evaluation

## 13.1 Feedback existente

### Endpoint

- `GET /incidents/:id/llm-cause-ranking/feedback`

### Qué validar

- [ ] muestra reviewer
- [ ] verdict
- [ ] selected rank
- [ ] selected cause
- [ ] actual root cause
- [ ] actual fix
- [ ] notes

## 13.2 Registrar feedback

### Endpoint

- `POST /incidents/:id/llm-cause-ranking/feedback`

### Qué validar

- [ ] el formulario envía reviewer fijo `pool`
- [ ] muestra mensaje de éxito/error
- [ ] refresca panel de feedback
- [ ] refresca evaluación

## 13.3 Evaluation

### Endpoint

- `GET /incidents/:id/llm-cause-ranking/evaluation`

### Qué validar

- [ ] muestra ranking resumido
- [ ] muestra feedback relacionado
- [ ] muestra si top1 coincide
- [ ] muestra summary de evaluación

---

## 14. Validación de PR Proposal

## 14.1 Generar proposal

### Botón

- `Generate PR proposal`

### Endpoint

- `POST /incidents/:id/pr-proposal`

### Qué validar

- [ ] loading al hacer click
- [ ] mensaje de éxito/error
- [ ] se refresca latest proposal
- [ ] se refresca proposal history
- [ ] el bloque principal muestra la proposal actual

### Body default hoy en UI

```json
{
  "repository": "poolriveramolina/ai-debugger",
  "target_branch": "main",
  "allowlisted_paths": [
    "services/service-b/src/",
    "incident-detector/src/"
  ]
}
```

## 14.2 Latest proposal

### Endpoint

- `GET /incidents/:id/pr-proposal`

### Qué validar

- [ ] muestra proposal_id
- [ ] title
- [ ] status
- [ ] repository
- [ ] target_branch
- [ ] risk_level
- [ ] summary
- [ ] why
- [ ] allowlisted_paths
- [ ] changed_files
- [ ] checks
- [ ] implementation_plan
- [ ] tests
- [ ] guardrails

## 14.3 Proposal history

### Endpoint

- `GET /incidents/:id/pr-proposal/history`

### Qué validar

- [ ] muestra lista histórica
- [ ] renderiza proposal_id
- [ ] created_at
- [ ] status
- [ ] risk_level
- [ ] reviewer / reviewed_at / review_notes cuando existan

### Fallo típico

**Síntoma:** `Encountered two children with the same key`

**Causa probable:** elementos repetidos con el mismo `proposal_id`

**Solución:** usar key compuesta en `PrProposalHistoryPanel.tsx`

---

## 15. Validación de review humana de proposal

## 15.1 Approve proposal

### Endpoint

- `POST /pr-proposals/:proposalId/approve`

### Body esperado

```json
{
  "reviewer": "pool",
  "notes": "Aprobada. Cambio acotado y consistente con la RCA."
}
```

### Qué validar

- [ ] textarea de notes visible solo si status = `pending_review`
- [ ] botón visible solo si status = `pending_review`
- [ ] loading al aprobar
- [ ] mensaje de éxito/error
- [ ] latest proposal cambia a `approved`
- [ ] history refleja reviewer y reviewed_at

## 15.2 Reject proposal

### Endpoint

- `POST /pr-proposals/:proposalId/reject`

### Qué validar

- [ ] comportamiento análogo a approve
- [ ] status cambia a `rejected`
- [ ] desaparecen botones de review

---

## 16. Validación del pipeline de PR execution

Esta parte depende del bloque actual de **PR Proposal** y de la timeline **PR Actions**.

## 16.1 Endpoints involucrados

- `POST /pr-proposals/:proposalId/prepare-execution`
- `POST /pr-proposals/:proposalId/generate-file-edits`
- `POST /pr-proposals/:proposalId/regenerate-file-edits`
- `POST /pr-proposals/:proposalId/validate-file-edits`
- `POST /pr-proposals/:proposalId/run-local-checks`
- `POST /pr-proposals/:proposalId/create-github-pr`
- `GET /incidents/:id/pr-actions`
- `GET /pr-proposals/:proposalId/actions`

## 16.2 Secuencia visual esperada

1. Proposal `approved`
   - aparece **Prepare execution**
2. Existe acción `prepared`
   - aparece **Generate file edits**
3. Existe `edits_generation_failed` o `edits_validation_failed`
   - aparece **Regenerate file edits**
4. Existe `edits_generated` o `edits_regenerated`
   - aparece **Validate file edits**
5. Existe `edits_validated`
   - aparece **Run local checks**
6. Existe `local_checks_passed`
   - aparece **Create GitHub PR**
7. Existe `pr_created`
   - desaparece **Create GitHub PR**
   - se muestran detalles del PR real

## 16.3 Qué validar por paso

### Prepare execution

- [ ] botón visible solo cuando proposal está `approved`
- [ ] al ejecutarlo aparece acción `prepared`
- [ ] si falla, aparece `prepare_failed`

### Generate file edits

- [ ] visible solo después de `prepared`
- [ ] crea acción `edits_generated`
- [ ] si falla, aparece `edits_generation_failed`

### Regenerate file edits

- [ ] visible solo cuando hubo `edits_generation_failed` o `edits_validation_failed`
- [ ] crea acción `edits_regenerated`

### Validate file edits

- [ ] visible con `edits_generated` o `edits_regenerated`
- [ ] crea acción `edits_validated` o `edits_validation_failed`

### Run local checks

- [ ] visible solo con `edits_validated`
- [ ] crea acción `local_checks_passed`, `local_checks_failed` o `local_checks_inconclusive`
- [ ] si es `failed` o `inconclusive`, no debe aparecer `Create GitHub PR`

### Create GitHub PR

- [ ] visible solo con `local_checks_passed`
- [ ] al ejecutarse crea acción `pr_created`
- [ ] desaparece el botón después del éxito
- [ ] aparece link clickable al PR
- [ ] aparecen base branch y head branch
- [ ] aparecen archivos y commit link si existe

---

## 17. Validación de PR Actions

### Endpoint principal

- `GET /incidents/:id/pr-actions`

### Endpoint secundario para proposal actual

- `GET /pr-proposals/:proposalId/actions`

### Qué debe mostrar cada acción

Base:

- action_id
- status
- created_at
- branch_name
- pr_url
- stage si existe
- error si existe
- workspace_path si existe
- applied_files si existe
- has_real_checks si existe
- executed_checks_count si existe

### Detalles por status

#### prepared / prepare_failed

- ready
- reasons
- suggested_branch_name
- execution_plan.files

#### edits_generated / edits_regenerated

- summary
- edits
  - path
  - purpose
  - change_summary

#### edits_validated / edits_validation_failed

- validation.valid o payload.valid
- reasons
- file_validations
- source_action_status

#### local_checks_passed / failed / inconclusive

- has_real_checks
- executed_checks_count
- checks
  - name
  - command
  - ok
  - skipped
  - exit_code
  - stdout
  - stderr

#### pr_created

- pull_request.number
- pull_request.title
- pull_request.state
- pull_request.html_url o action.pr_url
- base
- head
- files
- commit_url por archivo si existe

#### pr_failed

- stage
- error
- partial_files si existen

---

## 18. Tabla de validación rápida por pantalla

| Pantalla / bloque | Ruta | Endpoint principal | Validación mínima |
|---|---|---|---|
| Home | `/` | N/A | Navegación visible |
| Incidents | `/incidents` | `GET /incidents` | Lista carga y links funcionan |
| Incident detail | `/incidents/:id` | múltiples GET | Paneles visibles sin crash |
| Contexto | detalle | `GET /context` | Logs y evidencia visibles |
| Summary | detalle | `GET /analysis-summary` | comparison + final_decision legibles |
| Heuristic RCA | detalle | `POST /analyze` | loading + resultado |
| LLM RCA | detalle | `POST /analyze-llm` | loading + resultado |
| Similar incidents | detalle | `GET /similar` | resultados o empty state |
| Knowledge matches | detalle | `GET /knowledge` | matches reales visibles |
| LLM feedback | detalle | `GET/POST /llm-cause-ranking/feedback` | form + historial |
| LLM evaluation | detalle | `GET /llm-cause-ranking/evaluation` | ranking + feedback + summary |
| PR Proposal | detalle | `GET /pr-proposal` | proposal actual visible |
| PR Proposal History | detalle | `GET /pr-proposal/history` | historial visible |
| Review proposal | detalle | `POST approve/reject` | status cambia y botones desaparecen |
| PR Actions | detalle | `GET /pr-actions` | timeline visible |
| PR execution | detalle | múltiples POST | botones secuenciales correctos |
| Stats | `/stats` | `GET /llm-cause-ranking/stats` | métricas visibles |

---

## 19. Qué revisar en Network del navegador

En DevTools > Network, confirma:

- [ ] los requests salen contra `http://localhost:3020`
- [ ] no están saliendo contra `http://localhost:3000/api/...`
- [ ] latest proposal devuelve `200`
- [ ] pr-actions devuelve `200`
- [ ] proposal actions devuelve `200` si hay proposal actual
- [ ] después de cada acción exitosa, los GET relevantes se vuelven a disparar

### Requests clave a observar

- `GET /incidents`
- `GET /incidents/:id/context`
- `GET /incidents/:id/analysis-summary`
- `GET /incidents/:id/pr-proposal`
- `GET /incidents/:id/pr-proposal/history`
- `GET /incidents/:id/pr-actions`
- `GET /pr-proposals/:proposalId/actions`

---

## 20. Fallos comunes y cómo detectarlos

## 20.1 `.env.local` cambia pero la UI sigue igual

**Síntoma**
- el frontend sigue pegando al host viejo

**Causa probable**
- Next.js no recargó variables de entorno

**Solución**
- detener y reiniciar el dev server completo

## 20.2 Problemas con host de red en vez de localhost

**Síntoma**
- assets o fetch se comportan raro usando IP de red

**Causa probable**
- frontend corriendo con host distinto al esperado

**Solución**
- usar `localhost` en desarrollo si ese fue el setup validado
- si usas host de red, revisar configuración adicional de Next.js

---

## 21. Orden recomendado de prueba manual end-to-end

Ejecuta esta secuencia exacta:

- [ ] abrir `/incidents`
- [ ] validar que la lista carga
- [ ] abrir un incidente real
- [ ] validar contexto, summary, similares y knowledge
- [ ] ejecutar **Run heuristic RCA**
- [ ] ejecutar **Run LLM RCA**
- [ ] generar **PR proposal**
- [ ] validar latest proposal + history
- [ ] aprobar la proposal
- [ ] validar status `approved`
- [ ] ejecutar **Prepare execution**
- [ ] ejecutar **Generate file edits**
- [ ] validar timeline en **PR Actions**
- [ ] ejecutar **Validate file edits**
- [ ] ejecutar **Run local checks**
- [ ] si pasa, ejecutar **Create GitHub PR**
- [ ] validar que aparezca link al PR abierto
- [ ] abrir `/stats`
- [ ] confirmar métricas globales

---

## 22. Señales de que la UI está correctamente conectada al backend

Puedes considerar que la UI está bien conectada si se cumplen todas estas:

- [ ] `/incidents` muestra incidentes reales
- [ ] `/incidents/:id` muestra contenido no vacío en múltiples paneles
- [ ] los botones de análisis disparan requests reales y refrescan UI
- [ ] la proposal se ve igual que en backend latest proposal
- [ ] approve / reject actualizan estado visible
- [ ] PR Actions se alimenta de timeline real persistida
- [ ] `pr_created` muestra PR real con link clickable a GitHub
- [ ] `/stats` muestra métricas reales del backend

---

## 23. Limitaciones actuales del playbook

- varios comandos exactos de instalación del frontend están **pendientes de validación** si no están fijados en `package.json`
- no documenta tests automáticos del frontend porque **pendiente de validación**
- no cubre autenticación de usuarios porque reviewer está fijo como `pool`
- no cubre diseño visual avanzado; este playbook es operativo

---

## 24. Quick debug checklist

Si algo falla, sigue este orden:

1. backend responde en Postman o navegador
2. `NEXT_PUBLIC_API_BASE_URL` está bien
3. reinicia frontend
4. revisa Network
5. revisa consola del navegador
6. valida shape real del endpoint que falló
7. confirma que la UI normaliza `result` vs `result.proposal` cuando aplica
8. revisa si hay keys duplicadas en listas

---

## 25. Resultado esperado final

Al final de una prueba completa exitosa, deberías poder:

- navegar la UI sin escribir rutas manuales
- abrir un incidente y entender su contexto técnico
- comparar RCA heurístico vs LLM
- revisar evidencia relacionada y knowledge matches
- generar y revisar una proposal de PR
- aprobarla o rechazarla
- ejecutar el pipeline operacional de PR paso a paso
- visualizar la timeline completa en `PR Actions`
- crear un PR real en GitHub y abrirlo desde la UI


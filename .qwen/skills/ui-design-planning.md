# 🎨 UI/UX Design Planning Skill

> **Skill para planificación de diseño UI/UX profesional**
> 
> **Cuándo usar:**
> - Cuando el usuario pide "diseño bonito" o "UI profesional"
> - Cuando se va a crear un nuevo componente o pantalla
> - Cuando hay inconsistencia de estilos
> - Cuando se necesita planificar la experiencia de usuario completa
> - Antes de implementar cualquier cambio visual significativo
> - Cuando el usuario menciona "estética", "profesional", "moderno", "limpio"
> - Cuando hay que unificar diseños dispersos
> - Cuando se necesitan animaciones o transiciones
> - Para definir arquitectura de componentes reutilizables

**IMPORTANTE:** Este skill SIEMPRE debe usarse ANTES de implementar cambios de diseño. No implementar diseño sin planificar primero.

---

## 🎯 PROPÓSITO

Crear un **plan de diseño UI/UX completo** que incluya:
1. Definición de estilo visual (look & feel)
2. Arquitectura de componentes reutilizables
3. Sistema de diseño consistente
4. Plan de animaciones y transiciones
5. Flujo de navegación optimizado
6. Guidelines para el equipo de desarrollo

---

## 📋 PROCESO DE PLANIFICACIÓN

### Paso 1: Entender Necesidades del Cliente

**Preguntas clave:**
1. ¿Qué estilo visual buscas? (moderno, minimalista, corporativo, juvenil, etc.)
2. ¿Quién es el usuario final? (edad, nivel técnico, contexto de uso)
3. ¿Qué apps te gustan como referencia? (Apple, Google, Stripe, Linear, Vercel, etc.)
4. ¿Qué emociones debe transmitir la app? (confianza, profesionalismo, diversión, urgencia)
5. ¿Hay marca/colores corporativos que respetar?
6. ¿Prioridad: velocidad o estética?

### Paso 2: Definir Estilo Visual

**Referencia: iOS Design Guidelines + Material Design 3**

**Principios de diseño:**
- ✅ **Limpio y espacioso** → Mucho whitespace, jerarquía clara
- ✅ **Consistente** → Mismos patrones en toda la app
- ✅ **Accesible** → Contraste WCAG AA mínimo, fonts legibles
- ✅ **Animado** → Transiciones suaves, feedback visual inmediato
- ✅ **Profesional** → No sobrecargar, menos es más

### Paso 3: Definir Arquitectura de Componentes

**Jerarquía de componentes:**

```
Design System (src/components/design-system/)
├── Atoms (átomos)
│   ├── Text (variantes tipográficas)
│   ├── Button (7 variantes)
│   ├── Icon (wrapper consistente)
│   ├── Badge (estados visuales)
│   ├── Input (formularios)
│   └── Avatar (usuarios)
│
├── Molecules (moléculas)
│   ├── Card (contenedor base)
│   ├── ListItem (lista items)
│   ├── FormField (label + input + error)
│   ├── Toolbar (acciones agrupadas)
│   └── SearchBar (búsqueda)
│
├── Organisms (organismos)
│   ├── Header (navegación superior)
│   ├── Sidebar (navegación lateral)
│   ├── BottomNav (navegación inferior mobile)
│   ├── DataTable (tablas de datos)
│   └── Feed (timeline/actividad)
│
└── Templates (plantillas)
    ├── ScreenLayout (layout base de pantallas)
    ├── FormLayout (formularios)
    ├── DetailLayout (detalle de items)
    └── ListLayout (listados)
```

### Paso 4: Plan de Animaciones

**Principios:**
- Duración: 200-300ms para microinteracciones
- Curva: `ease-in-out` para naturales
- No bloquear interacción del usuario
- Feedback inmediato (<100ms)

**Animaciones requeridas:**
| Tipo | Duración | Uso |
|------|----------|-----|
| **Press** | 100ms | Botones, cards clicables |
| **Fade In** | 200ms | Aparición de elementos |
| **Slide In** | 300ms | Navegación entre screens |
| **Scale** | 200ms | Loading, confirmaciones |
| **Swipe** | Gesture | Lists con acciones |
| **Expand/Collapse** | 250ms | Accordions, dropdowns |
| **Skeleton Loading** | Infinite | placeholders |

### Paso 5: Definir Navegación

**Patrones de navegación:**

**Mobile:**
- Bottom Navigation (3-5 items principales)
- Stack Navigation (drill-down)
- Drawers (menú lateral para opciones secundarias)
- Modals (acciones contextuales)

**Animaciones de navegación:**
- Push: slide desde derecha
- Pop: slide hacia derecha
- Modal: slide desde abajo
- Tab: fade crossfade

### Paso 6: Crear Implementation Plan

**Checklist de implementación:**
- [ ] Actualizar `tamagui.config.ts` con tokens finales
- [ ] Crear/actualizar componentes en `design-system/`
- [ ] Crear hooks de animación (`useAnimatedPress`, etc.)
- [ ] Crear componentes de navegación reutilizables
- [ ] Crear templates de pantallas
- [ ] Documentar en `DESIGN_SYSTEM.md`
- [ ] Crear storybook/demo de componentes
- [ ] Migrar pantallas existentes al nuevo sistema

---

## 🎨 REFERENCIAS DE DISEÑO

### Inspiración Recomendada

| App | Por qué |
|-----|---------|
| **Apple** | Minimalismo, whitespace, jerarquía tipográfica |
| **Linear** | Profesional, rápido, animaciones sutiles |
| **Stripe** | Dashboard limpio, datos claros |
| **Notion** | Simple pero poderoso |
| **Vercel** | Moderno, dark mode elegante |
| **Raycast** | Productividad, keyboard-first |
| **Discord** | Comunidades, chat UX |
| **Slack** | Mensajería empresarial |

### Design Guidelines

- **iOS Human Interface Guidelines** → https://developer.apple.com/design/human-interface-guidelines
- **Material Design 3** → https://m3.material.io
- **Nielsen Norman Group** → UX research y best practices

---

## 📐 DESIGN TOKENS ESTÁNDAR

### Colores (ya definidos en tamagui.config.ts)

✅ **Mantener actuales:**
- Primary: `#007AFF` (iOS blue)
- Secondary: `#5856D6` (iOS purple)
- Success: `#34C759` (iOS green)
- Warning: `#FF9500` (iOS orange)
- Error: `#FF3B30` (iOS red)

### Tipografía

✅ **Mantener San Francisco / System font**

### Espaciado

✅ **Mantener tokens actuales** ($xs a $6xl)

---

## 🤖 AGENTES DE DISEÑO

Para proyectos grandes, usar subagentes especializados:

### Agent 1: Design System Architect
**Responsabilidad:** Definir tokens, componentes base, variantes
**Output:** Especificación técnica del design system

### Agent 2: UX Flow Designer
**Responsabilidad:** Mapear flujos de usuario, wireframes
**Output:** Diagramas de flujo, user journeys

### Agent 3: Animation Specialist
**Responsabilidad:** Definir animaciones, transiciones
**Output:** Catálogo de animaciones con parámetros

### Agent 4: Accessibility Auditor
**Responsabilidad:** Verificar WCAG, contraste, accesibilidad
**Output:** Reporte de accesibilidad

---

## ✅ CHECKLIST DE CALIDAD DE DISEÑO

Antes de aprobar cualquier diseño:

- [ ] **Consistencia:** Mismos componentes, mismos estilos
- [ ] **Accesibilidad:** Contraste WCAG AA, font sizes legibles
- [ ] **Responsive:** Funciona en móvil y tablet
- [ ] **Feedback visual:** Estados loading, error, success
- [ ] **Touch targets:** Mínimo 44x44px
- [ ] **Espaciado:** Whitespace adecuado, no sobrecargado
- [ ] **Jerarquía:** Títulos claros, contenido organizado
- [ ] **Animaciones:** Suaves, no intrusivas
- [ ] **Performance:** No más de 200ms en interacciones
- [ ] **Dark mode:** Funciona en ambos modos

---

## 📝 TEMPLATE DE PLAN DE DISEÑO

Cuando completes la planificación, usar este template:

```markdown
# Plan de Diseño - [Nombre del Módulo]

## Estilo Visual
- **Look & Feel:** [descripción]
- **Referencias:** [apps similares]
- **Paleta:** [colores principales]

## Componentes Requeridos
1. [Componente 1] - [variantes]
2. [Componente 2] - [variantes]

## Animaciones
1. [Animación 1] - [duración] - [uso]
2. [Animación 2] - [duración] - [uso]

## Flujo de Navegación
[Pantalla A] → [Pantalla B] → [Pantalla C]
   ↓
[Pantalla D]

## Implementation Steps
1. Crear/actualizar componentes en design-system/
2. Implementar pantallas
3. Agregar animaciones
4. Testear accesibilidad
5. Documentar en DESIGN_SYSTEM.md
```

---

## 🚨 REGLAS IMPORTANTES

1. **NUNCA implementar diseño sin planificar primero**
2. **Siempre mostrar mockups o descripciones antes de codificar**
3. **Mantener consistencia con DESIGN_SYSTEM.md existente**
4. **Si hay conflicto entre estética y funcionalidad → funcionalidad primero**
5. **Documentar TODO en DESIGN_SYSTEM.md**
6. **Testear en móvil real, no solo simulador**
7. **Dark mode obligatorio**
8. **Accesibilidad WCAG AA mínimo**

---

> **NOTA:** Este skill debe ejecutarse ANTES de cualquier implementación de diseño significativo.

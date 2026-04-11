# 📱 ÍNDICE DEL FRONTEND - C_Ticket_Apk_STV/

> **Mapa detallado de archivos y rutas del frontend React Native - ARQUITECTURA MULTI-MÓDULO**
> 
> **Propósito:** Referencia rápida para localizar archivos en TODOS los módulos

---

## 🏗️ ARQUITECTURA MULTI-MÓDULO

El frontend tiene **5 módulos** que se conectan al `src` principal (padre):

```
C_Ticket_Apk_STV/
├── src/                    # 🎯 PRINCIPAL (PADRE) - Auth, Home, Users, Store, Services
├── src_Archivero_STV/      # 📁 ARCHIVERO - Gestión documental
├── src_Chat_STV/           # 💬 CHAT - Chat, Email, Noticias
├── src_Instalaciones_STV/  # 🏢 INSTALACIONES - Gestión de instalaciones
└── src_P_Ticket_IT/        # 🎫 TICKETS IT - Sistema de tickets
```

**Conexión:** Todos se conectan vía `src/navigation/AppNavigator.tsx`

---

## 🎯 MÓDULO PRINCIPAL - src/

### Entry Points

```
C_Ticket_Apk_STV/
├── package.json                    # Dependencias y scripts
├── tsconfig.json                   # Configuración TypeScript
├── app.json                        # Configuración de Expo
├── babel.config.js                 # Configuración Babel
├── App.tsx                         # 🚀 COMPONENTE RAÍZ (comentado)
├── index.ts                        # Entry point de la app
└── src/                            # 📁 CÓDIGO FUENTE PRINCIPAL
```

### Estructura de src/

```
src/
├── components/          # Componentes reutilizables globales
│   ├── design-system/   # Sistema de diseño
│   ├── Button.tsx
│   ├── index.ts
│   └── useResponsive.ts
├── screens/             # 🖼️ PANTALLAS PRINCIPALES
│   ├── index.ts         # Export central
│   ├── P_Auth/          # 🔐 Autenticación
│   │   ├── index.ts
│   │   └── LoginScreen.tsx
│   ├── P_Principal/     # 🏠 Principal
│   │   ├── index.ts
│   │   └── HomeScreen.tsx
│   └── Components_Usuarios/  # 👥 Gestión de usuarios
├── navigation/          # 🧭 NAVEGACIÓN PRINCIPAL
│   ├── index.ts
│   └── AppNavigator.tsx # ⭐ Conecta TODOS los módulos
├── store/               # 🗄️ ESTADO GLOBAL (Zustand)
│   ├── index.ts
│   └── authStore.ts     # 🔐 Store de autenticación (comentado)
├── services/            # 📡 SERVICIOS API
│   ├── index.ts
│   ├── api.ts           # Configuración de Axios
│   ├── auth.service.ts  # Servicio de auth
│   ├── userService.ts   # Servicio de usuarios
│   └── emailService.ts  # Servicio de email
├── hooks/               # Custom hooks
├── constants/           # Constantes globales (API_URL, roles)
├── types/               # TypeScript types globales
├── utils/               # Funciones utilitarias
├── lib/                 # Configuraciones (tamagui)
└── modules/             # [Vacío - Para futuros módulos]
```

---

## 📁 MÓDULO ARCHIVERO - src_Archivero_STV/

**Propósito:** Gestión documental y archivos
**Screens:** 7
**Navegación:** ArchiveroNavigator

```
src_Archivero_STV/
├── index.ts                    # Export del módulo
├── navigation/
│   ├── index.ts
│   └── ArchiveroNavigator.tsx  # Navegación interna
├── screens/                    # 7 screens
│   ├── index.ts
│   ├── ArchiveroHomeScreen.tsx         # Home del archivero
│   ├── ArchiveroDetalleScreen.tsx      # Detalle de archivero
│   ├── CarpetaDetalleScreen.tsx        # Detalle de carpeta
│   ├── CrearArchiveroScreen.tsx        # Crear nuevo archivero
│   ├── GestionarMiembrosScreen.tsx     # Gestionar miembros
│   └── EscanearDocumentoScreen.tsx     # Escanear documento
└── types/                      # Types específicos
    └── index.ts
```

**Rutas del módulo:**
- `ArchiveroHome` → Home
- `CrearArchivero` → Crear
- `ArchiveroDetalle` → Detalle
- `GestionarMiembros` → Miembros
- `EscanearDocumento` → Escanear
- `CarpetaDetalle` → Carpeta

**Conexiones:**
- Se conecta en: `src/navigation/AppNavigator.tsx` → `ArchiveroHome`
- Usa store global: `src/store/authStore.ts`
- Usa servicios globales: `src/services/`

---

## 💬 MÓDULO CHAT - src_Chat_STV/

**Propósito:** Chat empresarial, email y noticias
**Screens:** 8
**Navegación:** ChatNavigator

```
src_Chat_STV/
├── index.ts                    # Export del módulo
├── navigation/
│   ├── index.ts
│   └── ChatNavigator.tsx       # Navegación interna
├── screens/                    # 8 screens
│   ├── index.ts
│   ├── ChatHomeScreen.tsx              # Home del chat
│   ├── PrivateChatsScreen.tsx          # Chats privados
│   ├── GroupChatsScreen.tsx            # Chats grupales
│   ├── EmployeeDirectoryScreen.tsx     # Directorio empleados
│   ├── NewsBoardScreen.tsx             # Tablero noticias
│   ├── ChatSearchScreen.tsx            # Búsqueda
│   └── Componets_Correos/              # Componentes de email
├── services/                   # Servicios de email
│   ├── emailCache.service.ts   # Cache de emails
│   └── emailMessages.service.ts # Mensajes de email
└── types/                      # Types específicos
    └── index.ts
```

**Rutas del módulo:**
- `ChatHome` → Home
- `PrivateChats` → Chats privados
- `GroupChats` → Chats grupales
- `EmployeeDirectory` → Directorio
- `NewsBoard` → Noticias
- `ChatSearch` → Búsqueda
- `EmailMain` → Email

**TODO (pendiente):**
- `ChatConversation` → Conversación
- `NewsDetail` → Detalle noticia
- `CreateGroup` → Crear grupo
- `UserProfile` → Perfil usuario

**Conexiones:**
- Se conecta en: `src/navigation/AppNavigator.tsx` → `ChatHome`
- Usa store global: `src/store/authStore.ts`
- Servicios propios: `src_Chat_STV/services/` (email)
- Servicios globales: `src/services/` (api)

---

## 🏢 MÓDULO INSTALACIONES - src_Instalaciones_STV/

**Propósito:** Gestión de instalaciones y áreas
**Screens:** 4
**Navegación:** InstalacionNavigator

```
src_Instalaciones_STV/
├── navigation/
│   ├── index.ts
│   └── InstalacionNavigator.tsx  # Navegación interna
├── screens/                      # 4 screens
│   ├── index.ts
│   ├── InstalacionesHomeScreen.tsx       # Home
│   ├── RegistroInstalacionScreen.tsx     # Registrar instalación
│   ├── DetalleInstalacionScreen.tsx      # Detalle
│   └── RegistroAreaScreen.tsx            # Registrar área
├── components/                   # Componentes específicos
├── module/                       # Configuración del módulo
│   └── index.ts
├── lib/                          # Configuraciones específicas
└── types/                        # Types específicos
    └── index.ts
```

**Rutas del módulo:**
- `InstalacionesHome` → Home
- `RegistroInstalacion` → Registrar
- `DetalleInstalacion` → Detalle
- `RegistroArea` → Registrar área

**Conexiones:**
- Se conecta en: `src/navigation/AppNavigator.tsx` → `InstalacionesHome`
- Usa store global: `src/store/authStore.ts`
- Usa servicios globales: `src/services/`

---

## 🎫 MÓDULO TICKETS IT - src_P_Ticket_IT/

**Propósito:** Sistema de tickets de soporte IT
**Screens:** 1 (en desarrollo)
**Navegación:** TicketNavigator

```
src_P_Ticket_IT/
├── index.ts                    # Export del módulo
├── navigation/
│   ├── index.ts
│   └── TicketNavigator.tsx     # Navegación interna
├── screens/                    # 1 screen (más en desarrollo)
│   ├── index.ts
│   └── TicketHomeScreen.tsx    # Home de tickets
├── module/                     # SUBMÓDULOS
│   ├── P_Chat_IT-Usuarios/     # Chat entre IT y usuarios
│   ├── P_Registro_Solicitudo/  # Registro de solicitudes
│   ├── P_Registro_Usuario/     # Registro de usuarios
│   └── P_Solicitudes_R_S/      # Solicitudes R/S
├── lib/                        # Configuraciones
└── types/                      # Types específicos
    └── index.ts
```

**Rutas del módulo:**
- `TicketHome` → Home

**TODO (pendiente):**
- `CrearTicket` → Crear ticket
- `MisTickets` → Mis tickets
- `TodosTickets` → Todos los tickets
- `ReportesTickets` → Reportes
- `DetalleTicket` → Detalle
- `EditarTicket` → Editar

**Conexiones:**
- Se conecta en: `src/navigation/AppNavigator.tsx` → `TicketsHome`
- Usa store global: `src/store/authStore.ts`
- Usa servicios globales: `src/services/`
- Submódulos internos en `module/`

---

## 🔗 CONEXIÓN ENTRE MÓDULOS

### AppNavigator - El Conector Central

**Archivo:** `src/navigation/AppNavigator.tsx`

```typescript
import { InstalacionNavigator } from '../../src_Instalaciones_STV/navigation'
import { TicketNavigator } from '../../src_P_Ticket_IT/navigation'
import { ChatNavigator } from '../../src_Chat_STV/navigation'
import { ArchiveroNavigator } from '../../src_Archivero_STV/navigation'

<Stack.Navigator>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="InstalacionesHome" component={InstalacionNavigator} />
  <Stack.Screen name="TicketsHome" component={TicketNavigator} />
  <Stack.Screen name="ChatHome" component={ChatNavigator} />
  <Stack.Screen name="ArchiveroHome" component={ArchiveroNavigator} />
  <Stack.Screen name="UserManagement" component={UserManagementScreen} />
</Stack.Navigator>
```

### Flujo de Navegación

```
App.tsx
  └─ AppNavigator (src/navigation/)
      ├─ Login (src/screens/P_Auth/)
      └─ Home (src/screens/P_Principal/)
          ├─→ InstalacionesHome (src_Instalaciones_STV/)
          │   └─ InstalacionNavigator
          │       ├─ InstalacionesHome
          │       ├─ RegistroInstalacion
          │       ├─ DetalleInstalacion
          │       └─ RegistroArea
          │
          ├─→ TicketsHome (src_P_Ticket_IT/)
          │   └─ TicketNavigator
          │       ├─ TicketHome
          │       └─ (más en desarrollo)
          │
          ├─→ ChatHome (src_Chat_STV/)
          │   └─ ChatNavigator
          │       ├─ ChatHome
          │       ├─ PrivateChats
          │       ├─ GroupChats
          │       ├─ EmployeeDirectory
          │       ├─ NewsBoard
          │       ├─ ChatSearch
          │       └─ EmailMain
          │
          ├─→ ArchiveroHome (src_Archivero_STV/)
          │   └─ ArchiveroNavigator
          │       ├─ ArchiveroHome
          │       ├─ CrearArchivero
          │       ├─ ArchiveroDetalle
          │       ├─ GestionarMiembros
          │       ├─ EscanearDocumento
          │       └─ CarpetaDetalle
          │
          └─→ UserManagement (src/screens/Components_Usuarios/)
```

### Recursos Compartidos

| Recurso | Ubicación | Uso |
|---------|-----------|-----|
| Store (auth) | `src/store/authStore.ts` | Todos los módulos |
| Services (api) | `src/services/` | Todos los módulos |
| Constants | `src/constants/` | Todos los módulos |
| Types globales | `src/types/` | Todos los módulos |
| Componentes UI | `src/components/` | Todos los módulos |

---

## 📌 PUNTOS CLAVE PARA MODIFICACIONES

### Agregar nueva pantalla a módulo existente

1. Ir al módulo: `src_[NombreModulo]/screens/`
2. Crear `NuevaScreen.tsx`
3. Exportar en `index.ts` del módulo
4. Agregar ruta en el Navigator del módulo: `src_[NombreModulo]/navigation/[Modulo]Navigator.tsx`

### Agregar nuevo módulo

1. Crear carpeta: `src_NuevoModulo/`
2. Estructura básica:
   ```
   src_NuevoModulo/
   ├── index.ts
   ├── navigation/
   │   └── NuevoNavigator.tsx
   ├── screens/
   │   └── NuevoHomeScreen.tsx
   └── types/
   ```
3. Importar en `src/navigation/AppNavigator.tsx`
4. Agregar ruta en el Stack

### Cambiar navegación principal

- Editar: `src/navigation/AppNavigator.tsx`

### Cambiar URL del backend

- Editar: `src/constants/index.ts`

### Modificar estado global

- Editar: `src/store/authStore.ts`

---

## 🚨 REGLAS IMPORTANTES

1. **Cada módulo es independiente** - Tiene su propia navegación, screens y types
2. **El src principal comparte recursos** - store, services, constants, types
3. **AppNavigator conecta todo** - Es el punto central de conexión
4. **Usar Tamagui** para estilos - no usar StyleSheet.create
5. **Verificar permisos** con `hasPermission()` o `usePermissions()` antes de mostrar UI
6. **Exportar desde index.ts** en cada carpeta
7. **Backend y frontend en misma red WiFi** para comunicarse

---

> **NOTA:** Este índice debe actualizarse cuando se agreguen nuevos módulos o pantallas.

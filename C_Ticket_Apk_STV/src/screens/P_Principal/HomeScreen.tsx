import { YStack, XStack, Text, Button, Card } from 'tamagui'
import { useAuthStore } from '../../store'
import { ROLE_PERMISSIONS } from '../../constants'

export default function HomeScreen() {
  const { user, logout, hasPermission, hasRole } = useAuthStore()

  const permissions = user ? ROLE_PERMISSIONS[user.rol] : null

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      padding="$4"
    >
      {/* Header */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        marginBottom="$6"
        paddingTop="$2"
      >
        <YStack>
          <Text fontSize="$8" fontWeight="700" color="$color">
            C Ticket STV
          </Text>
          <Text fontSize="$4" color="$color2">
            Panel Principal
          </Text>
        </YStack>

        <Button
          onPress={logout}
          backgroundColor="$error"
          size="$3"
        >
          <Text color="white">Cerrar Sesión</Text>
        </Button>
      </XStack>

      {/* Info del Usuario */}
      <Card
        backgroundColor="$background2"
        borderRadius={16}
        padding="$4"
        marginBottom="$4"
        borderColor="$borderColor"
        borderWidth={1}
      >
        <Text fontSize="$6" fontWeight="600" color="$color" marginBottom="$2">
          Bienvenido, {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
        </Text>
        <XStack gap="$2" alignItems="center">
          <Text fontSize="$4" color="$color2">
            Usuario:
          </Text>
          <Text fontSize="$4" color="$color">
            {user?.Control_Usuario}
          </Text>
        </XStack>
        <XStack gap="$2" alignItems="center" marginTop="$1">
          <Text fontSize="$4" color="$color2">
            Rol:
          </Text>
          <Text
            fontSize="$4"
            color="$primary"
            fontWeight="600"
            textTransform="uppercase"
          >
            {user?.rol}
          </Text>
        </XStack>
      </Card>

      {/* Permisos RBAC */}
      <Text fontSize="$6" fontWeight="600" color="$color" marginBottom="$3">
        Tus Permisos (RBAC)
      </Text>

      <XStack gap="$3" flexWrap="wrap" marginBottom="$4">
        {permissions && (
          <>
            <PermissionBadge label="Crear" active={permissions.create} />
            <PermissionBadge label="Leer" active={permissions.read} />
            <PermissionBadge label="Actualizar" active={permissions.update} />
            <PermissionBadge label="Eliminar" active={permissions.delete} />
          </>
        )}
      </XStack>

      {/* Acciones por Rol */}
      <Text fontSize="$6" fontWeight="600" color="$color" marginBottom="$3">
        Acciones Disponibles
      </Text>

      <YStack gap="$3">
        {hasRole('it') && (
          <ActionButton
            title="Gestionar Usuarios"
            description="Administra usuarios y roles del sistema"
            icon="👥"
          />
        )}

        {(hasRole('it') || hasRole('rh') || hasRole('supervisor')) && (
          <ActionButton
            title="Gestionar Tickets"
            description="Crea, asigna y da seguimiento a tickets"
            icon="🎫"
          />
        )}

        {hasRole('supervisor') && (
          <ActionButton
            title="Reportes y Métricas"
            description="Visualiza reportes del equipo"
            icon="📊"
          />
        )}

        {hasRole('vigilante') && (
          <ActionButton
            title="Mis Tickets"
            description="Consulta y da seguimiento a tus tickets"
            icon="📋"
          />
        )}
      </YStack>
    </YStack>
  )
}

// Componente auxiliar para badges de permisos
function PermissionBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <XStack
      backgroundColor={active ? '$success' : '$error'}
      opacity={0.2}
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius={8}
    >
      <Text
        color={active ? '$success' : '$error'}
        fontWeight="600"
        fontSize="$3"
      >
        {active ? '✓' : '✗'} {label}
      </Text>
    </XStack>
  )
}

// Componente auxiliar para botones de acción
function ActionButton({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) {
  return (
    <XStack
      backgroundColor="$background2"
      padding="$4"
      borderRadius={16}
      alignItems="center"
      gap="$4"
      borderColor="$borderColor"
      borderWidth={1}
    >
      <Text fontSize="$6">{icon}</Text>
      <YStack flex={1}>
        <Text fontSize="$5" fontWeight="600" color="$color">
          {title}
        </Text>
        <Text fontSize="$3" color="$color2">
          {description}
        </Text>
      </YStack>
    </XStack>
  )
}

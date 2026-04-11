# 🔗 GUÍA DE IMPORTS Y DEPENDENCIAS

> **Referencia completa de importaciones para backend y frontend**
> 
> **Propósito:** No perder tiempo buscando rutas de imports

---

## 🗄️ BACKEND - IMPORTS (NestJS)

### 📦 Imports Base de un Módulo

```typescript
// nuevo-modulo.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NuevoModuloController } from './nuevo-modulo.controller';
import { NuevoModuloService } from './nuevo-modulo.service';
import { NuevoModel, NuevoModelSchema } from '../../Models/NuevoModulo';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NuevoModel.name, schema: NuevoModelSchema },
    ]),
  ],
  controllers: [NuevoModuloController],
  providers: [NuevoModuloService],
  exports: [NuevoModuloService], // Si otros módulos lo necesitan
})
export class NuevoModulo {}
```

---

### 🎮 Imports de un Controller

```typescript
// nuevo-modulo.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NuevoModuloService } from './nuevo-modulo.service';
import { CreateNuevoDto } from './dto/create-nuevo.dto';
import { UpdateNuevoDto } from './dto/update-nuevo.dto';
import { JwtAuthGuard } from '../../Guards/jwt-auth.guard';
import { RolesGuard } from '../../Guards/roles.guard';
import { Roles } from '../../Guards/decorators';
import { RolUsuario } from '../../Models/Usuarios/usuario.schema';

@Controller('nombre-endpoint')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NuevoModuloController {
  constructor(private readonly service: NuevoModuloService) {}

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.IT)
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() createDto: CreateNuevoDto) {
    return this.service.create(createDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateNuevoDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
```

---

### ⚙️ Imports de un Service

```typescript
// nuevo-modulo.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NuevoModel, NuevoModelDocument } from '../../Models/NuevoModulo';
import { CreateNuevoDto } from './dto/create-nuevo.dto';
import { UpdateNuevoDto } from './dto/update-nuevo.dto';

@Injectable()
export class NuevoModuloService {
  constructor(
    @InjectModel(NuevoModel.name)
    private nuevoModel: Model<NuevoModelDocument>,
  ) {}

  async create(createDto: CreateNuevoDto): Promise<NuevoModelDocument> {
    const createdModel = new this.nuevoModel(createDto);
    return createdModel.save();
  }

  async findAll(): Promise<NuevoModelDocument[]> {
    return this.nuevoModel.find().exec();
  }

  async findOne(id: string): Promise<NuevoModelDocument> {
    const model = await this.nuevoModel.findById(id).exec();
    if (!model) {
      throw new NotFoundException(`Modelo con ID ${id} no encontrado`);
    }
    return model;
  }

  async update(id: string, updateDto: UpdateNuevoDto): Promise<NuevoModelDocument> {
    const updatedModel = await this.nuevoModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updatedModel) {
      throw new NotFoundException(`Modelo con ID ${id} no encontrado`);
    }
    return updatedModel;
  }

  async remove(id: string): Promise<void> {
    const result = await this.nuevoModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Modelo con ID ${id} no encontrado`);
    }
  }
}
```

---

### 📊 Imports de un Schema (Model)

```typescript
// nuevo.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NuevoModelDocument = NuevoModel & Document;

@Schema({ timestamps: true }) // createdAt y updatedAt automáticos
export class NuevoModel {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  codigo: string;

  @Prop({ default: true })
  activo: boolean;

  @Prop()
  descripcion: string;

  @Prop({ type: Date })
  fecha: Date;
}

export const NuevoModelSchema = SchemaFactory.createForClass(NuevoModel);

// Índices opcionales
NuevoModelSchema.index({ nombre: 1, codigo: 1 });
```

---

### 📝 Imports de un DTO

```typescript
// create-nuevo.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDate } from 'class-validator';

export class CreateNuevoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsDate()
  @IsOptional()
  fecha?: Date;
}
```

```typescript
// update-nuevo.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateNuevoDto } from './create-nuevo.dto';

export class UpdateNuevoDto extends PartialType(CreateNuevoDto) {}
```

---

### 🛡️ Imports de Guards

```typescript
// Uso en controller
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../Guards/jwt-auth.guard';
import { RolesGuard } from '../../Guards/roles.guard';
import { PermissionsGuard } from '../../Guards/permissions.guard';
import { Roles, Permissions } from '../../Guards/decorators';
import { RolUsuario, Permiso } from '../../Models/Usuarios/usuario.schema';

// Protección con rol
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.IT)
@Get('admin-only')
adminEndpoint() { ... }

// Protección con permiso
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions(Permiso.USUARIOS_CREAR)
@Post('create')
createEndpoint() { ... }
```

---

### 🔐 Imports de Auth

```typescript
// auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario, UsuarioDocument, RolUsuario } from '../../Models/Usuarios/usuario.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    private jwtService: JwtService,
  ) {}

  async register(userData: RegisterDto): Promise<any> {
    // Verificar si ya existe
    const existingUser = await this.usuarioModel
      .findOne({ Control_Usuario: userData.Control_Usuario })
      .exec();

    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Crear usuario
    const user = new this.usuarioModel({
      ...userData,
      password: hashedPassword,
    });

    await user.save();

    // Generar token JWT
    const payload = { sub: user._id, control: user.Control_Usuario };
    return {
      access_token: this.jwtService.sign(payload),
      user: { ...user.toObject(), password: undefined },
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.usuarioModel
      .findOne({ Control_Usuario: loginDto.Control_Usuario })
      .exec();

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user._id, control: user.Control_Usuario };
    return {
      access_token: this.jwtService.sign(payload),
      user: { ...user.toObject(), password: undefined },
    };
  }
}
```

---

### 📦 Importar Módulo en app.module.ts

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NuevoModuloModule } from './Modules/NuevoModulo/nuevo-modulo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    // Agregar nuevo módulo aquí
    NuevoModuloModule,
  ],
})
export class AppModule {}
```

---

## 📱 FRONTEND - IMPORTS (React Native)

### 🖼️ Imports de un Screen

```typescript
// NuevoScreen.tsx
import React, { useState, useEffect } from 'react';
import { YStack, XStack, Text, Button, Input, Card, Spinner } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store';
import { usePermissions } from '../../hooks';
import { nuevoService } from '../../services';
import type { RootStackParamList } from '../../types';

interface NuevoScreenProps {
  route: { params: { id?: string } };
}

export const NuevoScreen: React.FC<NuevoScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { can } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await nuevoService.getById(route.params.id);
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner size="large" />;
  }

  return (
    <YStack f={1} p="$4" bg="$background">
      <Text fontSize="$8" fontWeight="bold">
        Nuevo Screen
      </Text>
      {can('create') && (
        <Button
          mt="$4"
          onPress={() => navigation.navigate('CrearNuevo' as never)}
        >
          Crear Nuevo
        </Button>
      )}
    </YStack>
  );
};
```

---

### 📡 Imports de un Servicio

```typescript
// nuevo.service.ts
import { api } from './api';

export interface NuevoModel {
  _id: string;
  nombre: string;
  codigo: string;
  activo: boolean;
}

export interface CreateNuevoDto {
  nombre: string;
  codigo: string;
  descripcion?: string;
}

export const nuevoService = {
  getAll: () => api.get<NuevoModel[]>('/nuevo-modulo'),

  getById: (id: string) => api.get<NuevoModel>(`/nuevo-modulo/${id}`),

  create: (data: CreateNuevoDto) => api.post<NuevoModel>('/nuevo-modulo', data),

  update: (id: string, data: Partial<CreateNuevoDto>) =>
    api.patch<NuevoModel>(`/nuevo-modulo/${id}`, data),

  delete: (id: string) => api.delete(`/nuevo-modulo/${id}`),
};
```

---

### 🗄️ Imports de Store (Zustand)

```typescript
// miStore.ts
import { create } from 'zustand';

interface MiEstado {
  items: any[];
  loading: boolean;
  setItems: (items: any[]) => void;
  setLoading: (loading: boolean) => void;
  addItem: (item: any) => void;
}

export const useMiStore = create<MiEstado>((set) => ({
  items: [],
  loading: false,
  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));
```

**Uso:**
```typescript
import { useMiStore } from '../../store/miStore';

const { items, loading, addItem } = useMiStore();
```

---

### 🎨 Imports de Componentes UI

```typescript
// Componente personalizado
import React from 'react';
import { Button as TamaguiButton } from 'tamagui';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <TamaguiButton
      onPress={onPress}
      disabled={disabled}
      bg={variant === 'danger' ? '$error' : '$primary'}
    >
      {title}
    </TamaguiButton>
  );
};
```

---

### 🧭 Imports de Navegación

```typescript
// AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store';
import { LoginScreen } from '../screens/P_Auth';
import { HomeScreen } from '../screens/P_Principal';
import { NuevoScreen } from '../screens/P_Nuevo';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Nuevo" component={NuevoScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};
```

---

### 🎭 Imports de Hooks

```typescript
// usePermissions.ts
import { useAuthStore } from '../store';

export const usePermissions = () => {
  const { user, isAuthenticated, hasPermission, hasRole } = useAuthStore();

  return {
    user,
    isAuthenticated,
    can: (permission: string) => hasPermission(permission),
    is: (role: string | string[]) => hasRole(role),
  };
};
```

**Uso:**
```typescript
import { usePermissions } from '../../hooks';

const { can, is, user } = usePermissions();

if (can('tickets_crear')) { /* ... */ }
if (is('admin')) { /* ... */ }
```

---

## 🔗 RUTAS RELATIVAS ENTRE CARPETAS

### Backend (desde src/)

| Desde | Hacia | Ruta Relativa |
|-------|-------|---------------|
| `Modules/Auth/` | `Models/` | `../../Models/` |
| `Modules/Chat/` | `Guards/` | `../../Guards/` |
| `Controllers/` | `Modules/` | `../Modules/` |
| `Modules/TicketIT/` | `DTOs/` | `./dto/` |
| `app.module.ts` | `Modules/` | `./Modules/` |

### Frontend (desde src/)

| Desde | Hacia | Ruta Relativa |
|-------|-------|---------------|
| `screens/P_Auth/` | `store/` | `../../store/` |
| `screens/P_Principal/` | `services/` | `../../services/` |
| `navigation/` | `screens/` | `../screens/` |
| `components/` | `constants/` | `../constants/` |
| `hooks/` | `store/` | `../store/` |
| `services/` | `constants/` | `../constants/` |

---

## 📚 DEPENDENCIAS CLAVE

### Backend (package.json)

```json
{
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/core": "^11.0.1",
    "@nestjs/mongoose": "^11.0.4",
    "@nestjs/jwt": "^11.0.2",
    "@nestjs/passport": "^11.0.5",
    "@nestjs/config": "^4.0.3",
    "mongoose": "^9.3.1",
    "bcrypt": "^6.0.0",
    "class-validator": "^0.15.1",
    "passport-jwt": "^4.0.1"
  }
}
```

### Frontend (package.json)

```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "react-native": "0.73.0",
    "tamagui": "^1.0.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/native-stack": "^6.9.0",
    "zustand": "^4.5.0",
    "axios": "^1.6.0"
  }
}
```

---

> **NOTA:** Esta guía se actualiza con cada nuevo módulo o componente agregado.

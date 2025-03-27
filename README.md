# Gestión de Proyectos API

Backend API para el sistema de gestión de proyectos y tareas.

## Requisitos

- Node.js (versión 18 o superior)
- PostgreSQL
- npm o yarn

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/micki-lahor-ucb/proyectos_backend.git
   cd proyectos_backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:

   - Crear archivo `.env` basado en `.env.example`
   - Completar las variables necesarias (conexión a base de datos, JWT secret, etc.)

4. Crear la base de datos en PostgreSQL:
   ```bash
   createdb project_management
   ```
   Mejor opcion con Docker (ya esta configurado el compose.yml):
    ```bash
   docker compose up -d
   ```

5. Ejecutar migraciones de base de datos:
   ```bash
   npx prisma migrate dev
   ```

6. Ejecutar sembrado de datos en BD:
   ```bash
   npm run seed
   ```

## Ejecución

### Para desarrollo:
```bash
npm run start:dev
```

### Para producción:
```bash
npm run build
npm run start:prod
```

## Endpoints API

### Autenticación

- **POST** `/api/auth/register` - Registrar nuevo usuario
- **POST** `/api/auth/login` - Iniciar sesión
- **GET** `/api/auth/profile` - Obtener perfil del usuario autenticado

### Usuarios

- **GET** `/api/users` - Obtener todos los usuarios
- **GET** `/api/users/:id` - Obtener usuario por ID
- **PATCH** `/api/users/:id` - Actualizar usuario
- **DELETE** `/api/users/:id` - Eliminar usuario

### Proyectos

- **POST** `/api/projects` - Crear proyecto
- **GET** `/api/projects` - Obtener todos los proyectos del usuario
- **GET** `/api/projects/:id` - Obtener proyecto por ID
- **PATCH** `/api/projects/:id` - Actualizar proyecto
- **DELETE** `/api/projects/:id` - Eliminar proyecto

### Tareas

- **POST** `/api/tasks` - Crear tarea
- **GET** `/api/tasks` - Obtener todas las tareas del usuario
- **GET** `/api/tasks/project/:projectId` - Obtener tareas por proyecto
- **GET** `/api/tasks/:id` - Obtener tarea por ID
- **PATCH** `/api/tasks/:id` - Actualizar tarea
- **DELETE** `/api/tasks/:id` - Eliminar tarea

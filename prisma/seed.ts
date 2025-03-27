import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpiar la base de datos
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log('Base de datos limpia');

  // Crear usuario demo
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Usuario Demo',
      email: 'demo@example.com',
      password: hashedPassword,
    },
  });

  console.log(`Usuario creado: ${user.name} (${user.email})`);

  // Crear proyectos
  const project1 = await prisma.project.create({
    data: {
      title: 'Desarrollo Web',
      description: 'Proyecto de desarrollo web con React y Node.js',
      userId: user.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Aplicación Móvil',
      description: 'Desarrollo de aplicación móvil con React Native',
      userId: user.id,
    },
  });

  console.log(`Proyectos creados: ${project1.title}, ${project2.title}`);

  // Crear tareas
  const task1 = await prisma.task.create({
    data: {
      title: 'Diseño de UI',
      description: 'Crear diseños de interfaz de usuario',
      status: 'PENDING',
      priority: 'HIGH',
      dueDate: new Date(2025, 3, 15),
      projectId: project1.id,
      userId: user.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Implementar API',
      description: 'Desarrollar endpoints de API REST',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date(2025, 3, 20),
      projectId: project1.id,
      userId: user.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Diseño de UX',
      description: 'Crear flujos de experiencia de usuario',
      status: 'PENDING',
      priority: 'HIGH',
      dueDate: new Date(2025, 3, 15),
      projectId: project2.id,
      userId: user.id,
    },
  });

  console.log(`Tareas creadas: ${task1.title}, ${task2.title}, ${task3.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

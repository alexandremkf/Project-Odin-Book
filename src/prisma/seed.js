require('dotenv').config();
const { PrismaClient } = require("@prisma/client");
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpar dados antigos
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  const users = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username(), // CORREÇÃO AQUI
        email: faker.internet.email(),
        passwordHash: faker.internet.password(),
      },
    });
    // Criar profile
    await prisma.profile.create({
      data: {
        userId: user.id,
        bio: faker.lorem.sentence(),
        profileImageUrl: faker.image.avatar(),
      },
    });
    users.push(user);
  }

  // Criar follow (todos seguem o usuário 1)
  for (let i = 1; i < users.length; i++) {
    await prisma.follow.create({
      data: {
        followerId: users[i].id,
        followingId: users[0].id,
        status: "ACCEPTED",
      },
    });
  }

  // Criar posts
  const posts = [];
  for (let i = 0; i < 10; i++) {
    const post = await prisma.post.create({
      data: {
        content: faker.lorem.paragraph(),
        authorId: users[Math.floor(Math.random() * users.length)].id,
      },
    });
    posts.push(post);
  }

  // Criar comentários aleatórios
  for (const post of posts) {
    const nComments = faker.number.int({ min: 0, max: 5 });
    for (let i = 0; i < nComments; i++) {
      await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          postId: post.id,
          authorId: users[Math.floor(Math.random() * users.length)].id,
        },
      });
    }
  }

  // Criar likes aleatórios
  for (const post of posts) {
    const nLikes = faker.number.int({ min: 0, max: users.length });
    const shuffledUsers = faker.helpers.shuffle(users);
    for (let i = 0; i < nLikes; i++) {
      await prisma.like.create({
        data: {
          postId: post.id,
          userId: shuffledUsers[i].id,
        },
      });
    }
  }

  console.log("✅ Seed finalizada!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hashPassword, slugify } from './auth.js';

const prisma = new PrismaClient();

// Sample data configurations
const USERS_COUNT = 20;
const CATEGORIES_COUNT = 8;
const TAGS_COUNT = 15;
const POSTS_COUNT = 50;
const COMMENTS_COUNT = 150;

// Predefined categories
const CATEGORIES = [
  { name: 'Technology', description: 'Latest tech news and tutorials', color: '#3B82F6', icon: 'laptop' },
  { name: 'Programming', description: 'Coding tutorials and best practices', color: '#10B981', icon: 'code' },
  { name: 'Web Development', description: 'Frontend and backend development', color: '#8B5CF6', icon: 'globe' },
  { name: 'Mobile', description: 'Mobile app development', color: '#F59E0B', icon: 'smartphone' },
  { name: 'Design', description: 'UI/UX design and creativity', color: '#EF4444', icon: 'palette' },
  { name: 'DevOps', description: 'Development operations and infrastructure', color: '#6B7280', icon: 'server' },
  { name: 'AI & Machine Learning', description: 'Artificial intelligence and ML', color: '#EC4899', icon: 'brain' },
  { name: 'Career', description: 'Career advice and professional growth', color: '#14B8A6', icon: 'briefcase' }
];

// Predefined tags
const TAGS = [
  { name: 'JavaScript', color: '#F7DF1E' },
  { name: 'React', color: '#61DAFB' },
  { name: 'Node.js', color: '#339933' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Python', color: '#3776AB' },
  { name: 'CSS', color: '#1572B6' },
  { name: 'HTML', color: '#E34F26' },
  { name: 'Vue.js', color: '#4FC08D' },
  { name: 'Angular', color: '#DD0031' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'GraphQL', color: '#E10098' },
  { name: 'REST API', color: '#25D366' }
];

async function clearDatabase() {
  console.log('🧹 Clearing existing data...');
  
  // Delete in correct order to avoid foreign key constraints
  await prisma.postTag.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ Database cleared');
}

async function createUsers() {
  console.log('👥 Creating users...');
  
  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@blog.com',
      username: 'admin',
      fullName: 'Admin User',
      hashedPassword: adminPassword,
      isSuperuser: true,
      bio: 'System administrator and blog manager',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`
    }
  });

  // Create regular users
  const users = [admin];
  
  for (let i = 0; i < USERS_COUNT - 1; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.username({ firstName, lastName }).toLowerCase();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const password = await hashPassword('password123');
    
    const user = await prisma.user.create({
      data: {
        email,
        username,
        fullName: `${firstName} ${lastName}`,
        hashedPassword: password,
        bio: faker.lorem.paragraph({ min: 1, max: 3 }),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        isSuperuser: Math.random() < 0.1, // 10% chance of being superuser
      }
    });
    
    users.push(user);
  }
  
  console.log(`✅ Created ${users.length} users`);
  return users;
}

async function createCategories() {
  console.log('📂 Creating categories...');
  
  const categories = [];
  
  for (const categoryData of CATEGORIES) {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        slug: slugify(categoryData.name),
        description: categoryData.description,
        color: categoryData.color,
        icon: categoryData.icon
      }
    });
    
    categories.push(category);
  }
  
  console.log(`✅ Created ${categories.length} categories`);
  return categories;
}

async function createTags() {
  console.log('🏷️  Creating tags...');
  
  const tags = [];
  
  for (const tagData of TAGS) {
    const tag = await prisma.tag.create({
      data: {
        name: tagData.name,
        slug: slugify(tagData.name),
        description: `Everything about ${tagData.name}`,
        color: tagData.color
      }
    });
    
    tags.push(tag);
  }
  
  console.log(`✅ Created ${tags.length} tags`);
  return tags;
}

async function createPosts(users, categories, tags) {
  console.log('📝 Creating posts...');
  
  const posts = [];
  
  for (let i = 0; i < POSTS_COUNT; i++) {
    const author = faker.helpers.arrayElement(users);
    const category = faker.helpers.arrayElement(categories);
    const isPublished = Math.random() > 0.3; // 70% published
    const isFeatured = Math.random() < 0.15; // 15% featured
    
    const title = faker.lorem.sentence({ min: 3, max: 8 });
    const slug = slugify(title) + '-' + faker.string.alphanumeric(4);
    const content = generateBlogContent();
    const excerpt = faker.lorem.paragraph({ min: 1, max: 3 });
    
    // Select 1-4 random tags
    const selectedTags = faker.helpers.arrayElements(tags, { min: 1, max: 4 });
    
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage: `https://picsum.photos/800/400?random=${i}`,
        isPublished,
        isFeatured,
        viewCount: faker.number.int({ min: 0, max: 1000 }),
        likeCount: faker.number.int({ min: 0, max: 100 }),
        authorId: author.id,
        categoryId: category.id,
        publishedAt: isPublished ? faker.date.past() : null,
        tags: {
          create: selectedTags.map(tag => ({
            tag: {
              connect: { id: tag.id }
            }
          }))
        }
      }
    });
    
    posts.push(post);
  }
  
  // Update category and tag post counts
  for (const category of categories) {
    const postCount = await prisma.post.count({
      where: { categoryId: category.id }
    });
    await prisma.category.update({
      where: { id: category.id },
      data: { postCount }
    });
  }
  
  for (const tag of tags) {
    const postCount = await prisma.postTag.count({
      where: { tagId: tag.id }
    });
    await prisma.tag.update({
      where: { id: tag.id },
      data: { postCount }
    });
  }
  
  console.log(`✅ Created ${posts.length} posts`);
  return posts;
}

async function createComments(users, posts) {
  console.log('💬 Creating comments...');
  
  const comments = [];
  
  for (let i = 0; i < COMMENTS_COUNT; i++) {
    const author = Math.random() > 0.2 ? faker.helpers.arrayElement(users) : null; // 80% authenticated, 20% guest
    const post = faker.helpers.arrayElement(posts);
    const isReply = Math.random() < 0.3 && comments.length > 0; // 30% chance of being a reply
    
    let parentId = null;
    if (isReply) {
      // Find a comment from the same post to reply to
      const parentComments = comments.filter(c => c.postId === post.id && !c.parentId);
      if (parentComments.length > 0) {
        parentId = faker.helpers.arrayElement(parentComments).id;
      }
    }
    
    const commentData = {
      content: faker.lorem.paragraphs({ min: 1, max: 3 }),
      isApproved: Math.random() > 0.1, // 90% approved
      isSpam: Math.random() < 0.05, // 5% spam
      likeCount: faker.number.int({ min: 0, max: 50 }),
      postId: post.id,
      parentId,
      authorId: author?.id || null,
      authorEmail: !author ? faker.internet.email() : null,
      authorName: !author ? faker.person.fullName() : null,
      authorWebsite: !author && Math.random() > 0.7 ? faker.internet.url() : null,
    };
    
    const comment = await prisma.comment.create({
      data: commentData
    });
    
    comments.push(comment);
  }
  
  console.log(`✅ Created ${comments.length} comments`);
  return comments;
}

function generateBlogContent() {
  const paragraphs = [];
  const numParagraphs = faker.number.int({ min: 5, max: 12 });
  
  // Introduction
  paragraphs.push(faker.lorem.paragraph({ min: 3, max: 6 }));
  
  // Main content with headers
  for (let i = 1; i < numParagraphs - 1; i++) {
    if (i % 3 === 0) {
      // Add a subheading
      paragraphs.push(`## ${faker.lorem.sentence({ min: 2, max: 5 })}`);
    }
    
    paragraphs.push(faker.lorem.paragraph({ min: 3, max: 8 }));
    
    // Occasionally add a code block or list
    if (Math.random() < 0.2) {
      if (Math.random() < 0.5) {
        // Add code block
        paragraphs.push('```javascript\nconst example = "Hello, World!";\nconsole.log(example);\n```');
      } else {
        // Add list
        const listItems = Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () => 
          `- ${faker.lorem.sentence()}`
        ).join('\n');
        paragraphs.push(listItems);
      }
    }
  }
  
  // Conclusion
  paragraphs.push(faker.lorem.paragraph({ min: 2, max: 4 }));
  
  return paragraphs.join('\n\n');
}

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await clearDatabase();
    
    const users = await createUsers();
    const categories = await createCategories();
    const tags = await createTags();
    const posts = await createPosts(users, categories, tags);
    const comments = await createComments(users, posts);
    
    console.log('\n📊 Seeding Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`📂 Categories: ${categories.length}`);
    console.log(`🏷️  Tags: ${tags.length}`);
    console.log(`📝 Posts: ${posts.length}`);
    console.log(`💬 Comments: ${comments.length}`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@blog.com / admin123');
    console.log('Users: All users have password "password123"');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
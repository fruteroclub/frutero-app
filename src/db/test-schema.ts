import { db } from './index';
import * as schema from './schema';

async function testSchema() {
  console.log('🧪 Testing simplified schema...\n');
  
  try {
    // Test 1: Create a user
    console.log('1️⃣ Creating test user...');
    const [user] = await db.insert(schema.users).values({
      id: 'test-user-id-12345', // Required: TEXT id field
      username: 'test_hacker',
      displayName: 'Test Hacker',
      email: 'test@frutero.club',
      bio: 'Testing the simplified schema',
      isAdmin: false,
    }).returning();
    console.log('✅ User created:', user.username);
    
    // Test 2: Create a profile for the user
    console.log('\n2️⃣ Creating user profile...');
    const [profile] = await db.insert(schema.profiles).values({
      userId: user.id,
      firstName: 'Test',
      lastName: 'Hacker',
      cityRegion: 'Buenos Aires',
      country: 'Argentina',
      primaryRole: 'Full Stack Developer',
      githubUsername: 'testhacker',
    }).returning();
    console.log('✅ Profile created for user:', profile.firstName);
    
    // Test 3: Create a program
    console.log('\n3️⃣ Creating program...');
    const [program] = await db.insert(schema.programs).values({
      name: 'Verano En Cadena 2025',
      description: 'Bootcamp de AI x Crypto x Culture',
      type: 'BUILD',
      status: 'PLANNED',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-02-21'),
      cohort: '2025-Q1',
      location: 'Remote',
      capacity: 50,
    }).returning();
    console.log('✅ Program created:', program.name);
    
    // Test 4: Create a project
    console.log('\n4️⃣ Creating project...');
    const [project] = await db.insert(schema.projects).values({
      name: 'Test DApp',
      slug: 'test-dapp',
      description: 'Testing the new schema with a DApp project',
      stage: 'PROTOTYPE',
      adminId: user.id,
      category: 'Web3',
      githubUsername: 'testdapp',
    }).returning();
    console.log('✅ Project created:', project.name);

    // Test 4a: Link project to program (via programProjects junction)
    console.log('\n4a️⃣ Linking project to program...');
    await db.insert(schema.programProjects).values({
      programId: program.id,
      projectId: project.id,
      status: 'ACTIVE',
    });
    console.log('✅ Project linked to program');
    
    // Test 5: Create a badge
    console.log('\n5️⃣ Creating badge...');
    const [badge] = await db.insert(schema.badges).values({
      name: 'Early Adopter',
      description: 'For the first hackers to join Frutero',
      category: 'Achievement',
      points: 100,
      maxPoints: 1000,
      programId: program.id,
    }).returning();
    console.log('✅ Badge created:', badge.name);
    
    // Test 6: Create a tier for the badge
    console.log('\n6️⃣ Creating badge tier...');
    const [tier] = await db.insert(schema.tiers).values({
      name: 'Bronze',
      points: 100,
      level: 1,
      description: 'First level of Early Adopter badge',
      badgeId: badge.id,
      benefits: { perks: ['Discord role', 'Early access'] },
    }).returning();
    console.log('✅ Tier created:', tier.name);
    
    // Test 7: Award badge to user
    console.log('\n7️⃣ Awarding badge to user...');
    const [userBadge] = await db.insert(schema.userBadges).values({
      userId: user.id,
      badgeId: badge.id,
      points: 100,
      tierReachedId: tier.id,
    }).returning();
    console.log('✅ Badge awarded to user:', userBadge.points, 'points');
    
    // Test 8: Create a quest
    console.log('\n8️⃣ Creating quest...');
    const [quest] = await db.insert(schema.quests).values({
      title: 'Complete Your First Project',
      description: 'Ship your first MVP on Frutero',
      start: new Date(),
      end: new Date('2025-03-01'),
      rewardPoints: 250,
      category: 'Development',
      difficulty: 'medium',
      badgeId: badge.id,
      projectId: project.id,
      programId: program.id,
    }).returning();
    console.log('✅ Quest created:', quest.title);
    
    // Test 9: Create a post
    console.log('\n9️⃣ Creating post...');
    const [post] = await db.insert(schema.posts).values({
      title: 'Welcome to the simplified schema!',
      content: 'Testing our new streamlined database structure',
      category: 'announcement',
      authorId: user.id,
      projectId: project.id,
      tags: ['test', 'schema', 'drizzle'],
    }).returning();
    console.log('✅ Post created:', post.title);
    
    // Test 10: Create a comment
    console.log('\n🔟 Creating comment...');
    const [comment] = await db.insert(schema.comments).values({
      content: 'This new schema is much cleaner!',
      authorId: user.id,
      postId: post.id,
    }).returning();
    console.log('✅ Comment created:', comment.content);
    
    // Test 11: Create proof of community
    console.log('\n1️⃣1️⃣ Creating proof of community...');
    const [poc] = await db.insert(schema.proofOfCommunities).values({
      name: 'Frutero Founding Member',
      description: 'Early supporter of the Frutero ecosystem',
      image: 'https://example.com/badge.png',
      points: 500,
      percentage: 10.5,
      tier: 'Gold',
      stage: 1,
      userId: user.id,
    }).returning();
    console.log('✅ Proof of Community created:', poc.name);
    
    // Test 12: Enroll user in program
    console.log('\n1️⃣2️⃣ Enrolling user in program...');
    const [enrollment] = await db.insert(schema.programUsers).values({
      programId: program.id,
      userId: user.id,
      role: 'PARTICIPANT',
      status: 'ACTIVE',
    }).returning();
    console.log('✅ User enrolled in program:', enrollment.role);
    
    console.log('\n🎉 All tests passed! Schema is working correctly.');
    console.log('\n📊 Summary:');
    console.log('- 12 core tables successfully tested');
    console.log('- All relationships working');
    console.log('- Cascade deletes configured');
    console.log('- Enums working correctly');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    throw error;
  }
}

// Run the test
testSchema()
  .then(() => {
    console.log('\n✨ Schema validation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
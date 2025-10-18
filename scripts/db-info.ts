import { db } from '../src/db'

async function showDatabaseInfo() {
  try {
    console.log('📊 Database Information\n')

    // List all tables
    const tables = await db.execute(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    console.log('📋 Tables:')
    tables.forEach((row: any) => {
      console.log(`  - ${row.table_name}`)
    })

    console.log('\n📈 Row counts:')
    for (const row of tables) {
      const tableName = (row as any).table_name
      const count = await db.execute(`SELECT COUNT(*) as count FROM "${tableName}"`)
      console.log(`  ${tableName}: ${(count[0] as any).count} rows`)
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

showDatabaseInfo()

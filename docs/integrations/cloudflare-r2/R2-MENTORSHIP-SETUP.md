# Cloudflare R2 Mentorship Logs Setup Guide

## 🎯 Overview

This guide walks you through setting up Cloudflare R2 storage for persistent mentorship log storage in the Frutero App. The system provides scalable cloud storage with automatic fallback to the filesystem.

## 🏗️ Architecture

```
R2 Bucket: frutero-data (or your-bucket-name)
└── mobil3-mentorships/
    ├── by-user/
    │   ├── {user_id}/
    │   │   ├── {year}/
    │   │   │   ├── {month}/
    │   │   │   │   └── {memory_id}-{timestamp}.json
    │   │   └── metadata.json
    ├── all/
    │   └── {date}/
    │       └── {user_id}-{memory_id}-{timestamp}.json
    └── analytics/
        ├── daily-summaries/
        └── user-stats/
```

## 🚀 Quick Setup

### Step 1: Create Cloudflare R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2 Object Storage**
3. Click **Create Bucket**
4. Name: `frutero-data` (or your preferred name)
5. Location: **Automatic** (recommended)
6. Click **Create Bucket**

### Step 2: Generate R2 API Tokens

1. In R2 Dashboard, go to **Manage R2 API tokens**
2. Click **Create API token**
3. **Token name**: `frutero-mentorship-logs`
4. **Permissions**: 
   - `Object:Edit` (for uploading/updating)
   - `Object:Read` (for retrieving)
5. **TTL**: No expiry (or set based on your security policy)
6. **Bucket restriction**: Select your bucket (`frutero-data`)
7. **IP Address filtering**: Optional (leave empty for development)
8. Click **Create API token**
9. **Important**: Copy and save the credentials immediately!

### Step 3: Configure Environment Variables

Create or update your `.env.local` file:

```bash
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_here
R2_SECRET_ACCESS_KEY=your_secret_key_here
R2_BUCKET_NAME=frutero-data
R2_PUBLIC_URL=https://your-public-r2-url.com  # Optional, only if bucket is public
```

**Where to find these values:**
- **R2_ACCOUNT_ID**: Cloudflare Dashboard → R2 → Account ID (right sidebar)
- **R2_ACCESS_KEY_ID**: From the API token creation step
- **R2_SECRET_ACCESS_KEY**: From the API token creation step
- **R2_BUCKET_NAME**: The bucket name you created
- **R2_PUBLIC_URL**: Only if you configured public access (optional)

### Step 4: Test the Integration

Run the integration test to verify everything is working:

```bash
bun run test:r2
```

Expected output:
```
🧪 Testing R2 Integration...

1. Testing R2 Client Connection...
   Circuit breaker state: closed
   Circuit breaker failures: 0

2. Testing R2 User Manager Connection...
   Connection test result: ✅ Success

3. Testing Memory Storage...
   Memory saved successfully:
   - R2 Key: mobil3-mentorships/by-user/test-user-1234567890/2025/01/test-memory-1234567890-1234567890.json
   - All Key: mobil3-mentorships/all/2025-01-23/test-user-1234567890-test-memory-1234567890-1234567890.json

4. Testing Memory Retrieval...
   Retrieved 1 memories for user
   First memory ID: test-memory-1234567890
   First memory title: R2 Integration Test

5. Testing User Statistics...
   User stats:
   - Total memories: 1
   - Total duration: 0 minutes
   - Languages detected: [ 'en' ]
   - Action items: 1
   - Insights: 1

6. Testing Recent Memories Retrieval...
   Retrieved 1 recent memories from today

✅ All R2 integration tests passed!
```

## 📦 Migration from Filesystem

If you have existing logs stored in the filesystem, migrate them to R2:

```bash
bun run migrate:r2
```

This will:
- Find all existing logs in `omi-logs/`
- Upload them to R2 with proper organization
- Preserve all original data with migration metadata
- Provide a summary of the migration process

## 🔧 API Usage

### Memory Webhook (Automatic)

The system automatically uses R2 when properly configured:

```
POST /api/omi/memory?uid=user123
```

Response includes storage information:
```json
{
  "success": true,
  "storage": {
    "type": "r2",
    "r2Key": "mobil3-mentorships/by-user/user123/2025/01/memory-id-timestamp.json",
    "publicUrl": "https://your-r2-url.com/..."
  }
}
```

### Logs Retrieval

Retrieve logs with automatic R2/filesystem fallback:

```bash
# Get user-specific logs
GET /api/omi/logs?userId=user123&limit=20

# Get all recent logs
GET /api/omi/logs?limit=50

# Force specific source
GET /api/omi/logs?source=r2&limit=20
GET /api/omi/logs?source=filesystem&limit=20
```

## 🔒 Security Best Practices

### 1. API Token Security
- Use minimal required permissions
- Set IP restrictions for production
- Rotate tokens regularly
- Never commit tokens to version control

### 2. Bucket Security
- Keep bucket private unless public access is specifically needed
- Use CORS settings if browser access is required
- Enable encryption at rest

### 3. Environment Variables
```bash
# ❌ DON'T do this - never commit secrets
R2_SECRET_ACCESS_KEY=actual_secret_here

# ✅ DO this - use placeholder in examples
R2_SECRET_ACCESS_KEY=your_secret_key_here
```

## 🔄 Fallback Behavior

The system automatically handles failures:

1. **Primary**: Try R2 storage
2. **Fallback**: Use filesystem if R2 fails
3. **Circuit Breaker**: Temporarily disable R2 if multiple failures
4. **Recovery**: Automatically retry R2 when available

## 📊 Monitoring

### Circuit Breaker Status

Check circuit breaker health:
```typescript
import { R2StorageClient } from '@/lib/r2/client';

const client = new R2StorageClient();
console.log('State:', client.getCircuitBreakerState()); // closed, open, half-open
console.log('Failures:', client.getCircuitBreakerFailureCount());
```

### Connection Testing

Test R2 connectivity:
```typescript
import { R2UserManager } from '@/lib/omi/r2-user-manager';

const manager = new R2UserManager();
const isConnected = await manager.testConnection();
console.log('R2 Available:', isConnected);
```

## 🐛 Troubleshooting

### Common Issues

**❌ "Missing required R2 environment variables"**
- Solution: Check all R2_* variables are set in `.env.local`

**❌ "Circuit breaker is OPEN"**
- Solution: Multiple R2 operations failed, wait 1 minute or restart application

**❌ "R2 connection test failed"**
- Check R2 credentials
- Verify bucket exists
- Check network connectivity
- Verify API token permissions

**❌ "The AWS Access Key Id you provided does not exist"**
- Double-check R2_ACCESS_KEY_ID
- Ensure token hasn't been deleted/rotated
- Verify account ID matches token

### Debug Mode

Enable detailed logging by setting:
```bash
NODE_ENV=development
```

This will show detailed error messages and retry attempts.

## 🚀 Production Deployment

### Environment Variables
Set these in your production environment:
- Vercel: Dashboard → Project → Settings → Environment Variables
- Railway: Dashboard → Project → Variables
- Netlify: Dashboard → Site → Environment Variables

### Performance Optimization

1. **Caching**: Implement caching layer for frequently accessed data
2. **Compression**: Use compression for large memory objects
3. **Batch Operations**: Group multiple uploads when possible
4. **Regional Optimization**: Choose R2 region closest to your users

## 📈 Next Steps

1. **Analytics Dashboard**: Implement analytics using the `/analytics/` folder structure
2. **Search**: Add search capabilities across stored memories
3. **Export**: Create export functionality for bulk data access
4. **Cleanup**: Implement scheduled cleanup of old logs
5. **Real-time**: Add WebSocket support for real-time updates

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the test output for specific error details
3. Verify all environment variables are correctly set
4. Check Cloudflare R2 dashboard for any service issues

---

✅ **Ready to use**: The R2 mentorship system is now ready for production use with automatic fallback and comprehensive error handling!
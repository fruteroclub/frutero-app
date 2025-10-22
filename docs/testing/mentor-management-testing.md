# Mentor Management System - Testing Guide

## Setup

### 1. Make yourself an admin

First, find your username by checking the database or looking at your profile:

```bash
# Option 1: If you know your username
bun scripts/create-admin.ts your-username

# Option 2: See all users first
bun scripts/create-admin.ts
# ^ This will show you all usernames
```

### 2. Verify you're an admin

1. Log in to the app
2. Navigate to `/jam/admin/users`
3. If you see the admin panel, you're set! ✅
4. If you get "Access Denied", check the database:

```bash
# Check admin status in database
bun scripts/create-admin.ts your-username
```

---

## Testing Flow

### Test 1: Access Admin Mentor Management

**Steps:**
1. Log in as admin user
2. Navigate to `/jam/admin/mentors`
3. You should see:
   - "Gestión de Mentores" header
   - Stats cards (Total Mentores, Disponibles, No Disponibles)
   - "Crear Mentor Profile" button
   - Empty table (if no mentors yet)

**Expected:** ✅ Admin mentor management page loads with stats

---

### Test 2: Create a Mentor Profile

**Steps:**
1. Click "Crear Mentor Profile" button
2. Dialog opens with form
3. Select a user from dropdown (non-mentor users only)
4. Set fields:
   - **Disponibilidad**: Select "Disponible"
   - **Máximo de Participantes**: Enter `5`
   - **Áreas de Experiencia**:
     - Select "blockchain" from dropdown
     - Click + button
     - Select "frontend" from dropdown
     - Click + button
   - **Enfoque de Mentoría**: Enter "Hands-on mentoring with weekly check-ins"
   - **Experiencia**: Enter "5 years building web3 apps"
5. Click "Crear Mentor" button

**Expected:**
- ✅ Success toast: "Mentor profile creado exitosamente"
- ✅ Dialog closes
- ✅ Mentor appears in table
- ✅ Stats update (Total Mentores: 1, Disponibles: 1)

---

### Test 3: Verify Mentor Appears in Mentors List

**Steps:**
1. Navigate to `/jam/mentors` (public mentor directory)
2. New mentor should appear in the list
3. Check:
   - Avatar displays correctly
   - Name and location show
   - "Disponible" badge is green
   - Expertise badges show "blockchain", "frontend"

**Expected:** ✅ Mentor is publicly visible and discoverable

---

### Test 4: Mentor Settings (Self-Service)

**Steps:**
1. **Log out from admin account**
2. **Log in as the user you just made a mentor**
3. Navigate to `/jam/mentors/settings`
4. You should see the settings form pre-filled
5. Make changes:
   - Change **Disponibilidad** to "Limitada"
   - Change **Máximo de Participantes** to `3`
   - Add new expertise: Select "design", click +
   - Update **Enfoque de Mentoría**: Add more text
6. Click "Guardar Cambios"

**Expected:**
- ✅ Success toast: "Configuración actualizada"
- ✅ Changes persist on page refresh
- ✅ Changes visible in `/jam/mentors` list
- ✅ Changes visible in admin panel

---

### Test 5: Non-Mentor Cannot Access Settings

**Steps:**
1. Log in as a regular user (NOT a mentor)
2. Navigate to `/jam/mentors/settings`

**Expected:**
- ✅ Shows "No eres un mentor" message
- ✅ Suggests contacting admin

---

### Test 6: Delete Mentor Profile

**Steps:**
1. Log back in as admin
2. Navigate to `/jam/admin/mentors`
3. Find mentor in table
4. Click "Eliminar" button
5. Confirm in alert dialog

**Expected:**
- ✅ Success toast: "Mentor profile eliminado"
- ✅ Mentor removed from table
- ✅ Stats update (Total Mentores decreases)
- ✅ Mentor no longer appears in `/jam/mentors`
- ✅ User can no longer access `/jam/mentors/settings`

---

## Edge Cases to Test

### Edge Case 1: Try to Create Duplicate Mentor

**Steps:**
1. Create a mentor profile for User A
2. Try to create another mentor profile for User A

**Expected:** ❌ Error: "User is already a mentor"

---

### Edge Case 2: Mentor Not in User Selection

**Steps:**
1. Create mentor profile for User A
2. Open "Crear Mentor Profile" dialog again
3. Check user dropdown

**Expected:** ✅ User A does NOT appear in the list (only non-mentors show)

---

### Edge Case 3: Form Validation

**Steps:**
1. Open "Crear Mentor Profile" dialog
2. Try to submit without selecting user
3. Try to submit with 0 expertise areas
4. Try to set max participants to 0 or 51

**Expected:** ❌ Validation errors prevent submission

---

## API Testing (Optional)

If you want to test the API directly:

### Get All Mentors (Admin Only)
```bash
# Requires admin authentication
curl http://localhost:3000/api/jam/admin/mentors
```

### Create Mentor (Admin Only)
```bash
curl -X POST http://localhost:3000/api/jam/admin/mentors \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "availability": "AVAILABLE",
    "maxParticipants": 5,
    "expertiseAreas": ["blockchain", "frontend"],
    "mentoringApproach": "Hands-on mentoring",
    "experience": "5 years in web3"
  }'
```

### Get Mentor Settings
```bash
curl "http://localhost:3000/api/jam/mentors/settings?userId=USER_ID_HERE"
```

---

## Common Issues

### Issue: "Access Denied" in Admin Panel

**Solution:** Run `bun scripts/create-admin.ts your-username`

---

### Issue: No users in dropdown when creating mentor

**Possible causes:**
1. All users are already mentors
2. No users exist in database

**Solution:** Create a regular user account first, or check database:
```bash
# Check if users exist
bun scripts/create-admin.ts
# ^ Shows all users
```

---

### Issue: Changes not persisting

**Solution:** Check browser console for errors. Verify API endpoints are working:
```bash
# In another terminal, watch the dev server logs
bun dev
```

---

## Success Criteria

✅ Admin can create mentor profiles
✅ Admin can view all mentors with stats
✅ Admin can delete mentor profiles
✅ Mentors appear in public directory
✅ Mentors can update their own settings
✅ Non-mentors cannot access mentor settings
✅ Form validation works correctly
✅ Real-time updates work (no need to refresh)

---

## Next Steps After Testing

If all tests pass:
1. Seed production mentors using the admin panel
2. Train other admins on mentor management
3. Consider adding mentor interest form for users (Phase 3)
4. Monitor mentor utilization and capacity

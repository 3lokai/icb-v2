# Profile Components - Authentication Handling

## Props Pattern

All profile components now accept two authentication-related props:

- **`isOwner`** (boolean): `true` if the viewer is the profile owner
- **`isAuthenticated`** (boolean): `true` if the viewer is logged in (but not necessarily the owner)

## Usage Examples

### Example 1: Show edit buttons only to owner
```tsx
{isOwner && (
  <Button onClick={handleEdit}>Edit</Button>
)}
```

### Example 2: Show partial data to unauthenticated users
```tsx
{isAuthenticated ? (
  <FullDataView data={fullData} />
) : (
  <PartialDataView data={partialData} />
)}
```

### Example 3: Show login prompt for unauthenticated users
```tsx
{!isAuthenticated && (
  <div className="border border-dashed p-4">
    <p>Sign in to see full ratings</p>
    <Button href="/auth">Sign In</Button>
  </div>
)}
```

### Example 4: Limit data shown to unauthenticated users
```tsx
const visibleRatings = isAuthenticated 
  ? ratings 
  : ratings.slice(0, 5); // Show only first 5 to guests

<ProfileRatings ratings={visibleRatings} />
```

## Component Status

All profile components now accept both props:

- ✅ `ProfileHeader` - `isOwner`, `isAuthenticated`
- ✅ `ProfileRatings` - `isOwner`, `isAuthenticated`
- ✅ `ProfileTasteProfile` - `isAuthenticated`
- ✅ `ProfileSelections` - `isOwner`, `isAuthenticated`
- ✅ `ProfileGearStation` - `isOwner`, `isAuthenticated`

## Implementation Notes

1. **Owner vs Authenticated**: 
   - `isOwner = true` → User is viewing their own profile
   - `isAuthenticated = true` → User is logged in (could be viewing someone else's profile)
   - Both can be `true` (owner viewing own profile)
   - Both can be `false` (guest viewing public profile)

2. **Data Filtering**: 
   - The RPC already handles privacy (public vs private profiles)
   - Components should handle UI-level restrictions (e.g., showing limited data to guests)

3. **Future Variants**:
   - Create separate component variants (e.g., `ProfileRatingsGuest`) if needed
   - Or use conditional rendering within existing components using `isAuthenticated`

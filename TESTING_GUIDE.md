# 🧪 Cancellation Policy Testing Guide

## Quick Test Scenarios

### ✅ Test 1: Free Cancellation (Pending Booking)
**Goal**: Verify free cancellation works for early cancellations

**Steps**:
1. Login as a user
2. Book a car with pickup date 5+ days in future
3. Go to "My Bookings"
4. Click "Cancel Booking"
5. Check the modal

**Expected Result**:
- Modal shows: "No cancellation fee"
- Fee: ₹0
- Refund: Full amount
- Status changes to "cancelled"
- Car becomes available

---

### ⚠️ Test 2: Partial Fee (Confirmed Booking)
**Goal**: Verify fee calculation for confirmed bookings

**Steps**:
1. Login as a user
2. Book a car with pickup date 4 days in future
3. Login as owner and confirm the booking
4. Login back as user
5. Go to "My Bookings"
6. Click "Cancel Booking"

**Expected Result**:
- Modal shows: "Cancellation fee: 50%"
- Fee: 50% of booking amount
- Refund: 50% of booking amount
- Days until pickup displayed correctly

---

### 🚫 Test 3: Cannot Cancel (Too Late)
**Goal**: Verify blocking of last-minute cancellations

**Steps**:
1. Login as a user
2. Book a car with pickup date TOMORROW
3. Get it confirmed by owner
4. Try to cancel

**Expected Result**:
- Modal shows: "Cannot cancel within 24 hours"
- No cancel button or blocked
- Message to contact owner directly

---

### 📝 Test 4: Cancellation Reason
**Goal**: Verify reason field works

**Steps**:
1. Create a booking
2. Try to cancel
3. Add reason: "Change of plans"
4. Confirm cancellation
5. Check database or owner view

**Expected Result**:
- Reason saved in database
- Owner can see the reason
- Displayed in booking details

---

### 🔄 Test 5: Car Availability After Cancel
**Goal**: Verify car becomes available after cancellation

**Steps**:
1. Book a car (makes it unavailable)
2. Confirm booking
3. Cancel the booking
4. Check car listing page

**Expected Result**:
- Car shows "Available Now"
- Can be booked again
- bookedUntil field cleared

---

## 🎯 Edge Cases to Test

### Edge Case 1: Multiple Cancellations
**Test**: Cancel same booking twice
**Expected**: Second attempt shows "already cancelled"

### Edge Case 2: Unauthorized Cancellation
**Test**: Try to cancel someone else's booking
**Expected**: "Unauthorized" error

### Edge Case 3: Booking Not Found
**Test**: Send invalid booking ID
**Expected**: "Booking not found" error

### Edge Case 4: Exactly 24 Hours Before
**Test**: Cancel exactly 24 hours before pickup
**Expected**: Should allow with fee (not block)

### Edge Case 5: Past Booking
**Test**: Try to cancel a booking that already started
**Expected**: Should block or charge 100%

---

## 📊 Test Data Setup

### Create Test Bookings:

```javascript
// Booking 1: Far future (for free cancellation test)
{
  pickupDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
  returnDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  price: 5000,
  status: 'pending'
}

// Booking 2: Medium future (for partial fee test)
{
  pickupDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days
  returnDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
  price: 6000,
  status: 'confirmed'
}

// Booking 3: Near future (for high fee test)
{
  pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
  returnDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  price: 8000,
  status: 'confirmed'
}

// Booking 4: Very soon (for cannot cancel test)
{
  pickupDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
  returnDate: new Date(Date.now() + 36 * 60 * 60 * 1000),
  price: 10000,
  status: 'confirmed'
}
```

---

## 🔍 What to Check

### Frontend Checks:
- [ ] Modal displays correctly
- [ ] Fee calculation is accurate
- [ ] Refund amount is correct
- [ ] Days until pickup is accurate
- [ ] Reason field works
- [ ] Buttons work properly
- [ ] Modal closes on cancel
- [ ] Success message shows

### Backend Checks:
- [ ] Cancellation fee calculated correctly
- [ ] Booking status updated to 'cancelled'
- [ ] cancelledAt timestamp saved
- [ ] cancellationReason saved
- [ ] Car isAvailable set to true
- [ ] Car bookedUntil cleared
- [ ] API returns correct response

### Database Checks:
```javascript
// Check booking document after cancellation
{
  status: 'cancelled',
  cancellationFee: 2500, // Should match calculation
  cancelledAt: ISODate("2024-12-15T10:30:00Z"),
  cancellationReason: "Change of plans"
}

// Check car document
{
  isAvailable: true,
  bookedUntil: null
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Fee Calculation Wrong
**Symptom**: Shows wrong percentage
**Check**: 
- Date calculation logic
- Timezone issues
- Status check (pending vs confirmed)

### Issue 2: Cannot Cancel Button Not Working
**Symptom**: Button doesn't respond
**Check**:
- API endpoint connection
- Authentication token
- Booking ID passed correctly

### Issue 3: Car Still Shows Unavailable
**Symptom**: Car not available after cancel
**Check**:
- Car update logic in cancelBooking
- Database update successful
- Frontend refresh after cancel

### Issue 4: Modal Doesn't Show
**Symptom**: No modal appears
**Check**:
- State management
- Policy check API response
- Modal component rendering

---

## 📱 Manual Testing Checklist

### User Flow:
- [ ] Login as user
- [ ] Create booking
- [ ] View in "My Bookings"
- [ ] Click "Cancel Booking"
- [ ] See policy modal
- [ ] Check fee calculation
- [ ] Add cancellation reason
- [ ] Confirm cancellation
- [ ] See success message
- [ ] Verify booking shows "cancelled"
- [ ] Check fee is displayed

### Owner Flow:
- [ ] Login as owner
- [ ] View "Manage Bookings"
- [ ] See cancelled booking
- [ ] Check cancellation fee shown
- [ ] See cancellation reason
- [ ] Verify car is available again

### Admin Flow:
- [ ] Check database for cancelled bookings
- [ ] Verify all fields saved correctly
- [ ] Check car availability updated
- [ ] Review cancellation patterns

---

## 🎬 Video Test Script

**Record a test video showing**:
1. Creating a booking
2. Confirming it as owner
3. Attempting to cancel
4. Showing the policy modal
5. Confirming cancellation
6. Showing the cancelled status
7. Verifying car is available

**Duration**: 2-3 minutes
**Purpose**: Demo for stakeholders

---

## ✅ Success Criteria

All tests pass when:
1. ✅ Free cancellation works for early bookings
2. ✅ Fees calculated correctly based on timing
3. ✅ Cannot cancel within 24 hours of confirmed bookings
4. ✅ Cancellation reason saved
5. ✅ Car becomes available after cancel
6. ✅ UI shows clear policy information
7. ✅ No errors in console
8. ✅ Database updated correctly
9. ✅ Owner sees cancellation details
10. ✅ Works on mobile and desktop

---

**Happy Testing! 🚀**

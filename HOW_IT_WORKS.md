# 🎯 How the Cancellation Policy Works

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BOOKS A CAR                         │
│  Pickup Date: Dec 20, 2024 | Amount: ₹5,000                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              OWNER CONFIRMS BOOKING                         │
│  Status: Pending → Confirmed                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         USER WANTS TO CANCEL (Dec 15, 2024)                │
│         5 days before pickup                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              SYSTEM CHECKS POLICY                           │
│  - Booking Status: Confirmed                                │
│  - Days Until Pickup: 5 days                                │
│  - Policy Rule: 3-7 days = 50% fee                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              SHOWS CANCELLATION MODAL                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  ⚠️ Cancellation Policy                              │ │
│  │                                                       │ │
│  │  Booking Amount:        ₹5,000                       │ │
│  │  Cancellation Fee:    - ₹2,500 (50%)                │ │
│  │  ─────────────────────────────────                  │ │
│  │  Refund Amount:         ₹2,500                       │ │
│  │                                                       │ │
│  │  📅 5 days until pickup                              │ │
│  │                                                       │ │
│  │  [Keep Booking]  [Confirm Cancellation]             │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              USER CONFIRMS CANCELLATION                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              SYSTEM UPDATES BOOKING                         │
│  - Status: Cancelled                                        │
│  - Cancellation Fee: ₹2,500                                │
│  - Cancelled At: Dec 15, 2024                              │
│  - Car Status: Available                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    RESULT                                   │
│  ✅ Owner receives ₹2,500 compensation                     │
│  ✅ User gets ₹2,500 refund (when payment integrated)     │
│  ✅ Car becomes available for other bookings               │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Policy Decision Tree

```
User Clicks "Cancel Booking"
        │
        ├─→ Is booking already cancelled?
        │   └─→ YES → Show error ❌
        │
        ├─→ NO → Check booking status
                │
                ├─→ PENDING BOOKING
                │   │
                │   ├─→ 3+ days before? → FREE (0% fee) ✅
                │   ├─→ 1-3 days before? → 25% fee ⚠️
                │   └─→ <24 hours? → 50% fee ⚠️
                │
                └─→ CONFIRMED BOOKING
                    │
                    ├─→ 7+ days before? → 25% fee ⚠️
                    ├─→ 3-7 days before? → 50% fee ⚠️
                    ├─→ 2-3 days before? → 75% fee ⚠️
                    ├─→ 1-2 days before? → 100% fee ❌
                    └─→ <24 hours? → CANNOT CANCEL 🚫
```

## 💰 Fee Calculation Examples

### Example 1: Early Bird (No Fee)
```
Booking Details:
- Amount: ₹8,000
- Pickup: Jan 15
- Cancel Date: Jan 5 (10 days before)
- Status: Pending

Calculation:
- Days until pickup: 10 days
- Policy: 3+ days = FREE
- Fee: ₹0
- Refund: ₹8,000

Result: ✅ Full refund
```

### Example 2: Moderate Notice (Partial Fee)
```
Booking Details:
- Amount: ₹6,000
- Pickup: Jan 15
- Cancel Date: Jan 11 (4 days before)
- Status: Confirmed

Calculation:
- Days until pickup: 4 days
- Policy: 3-7 days = 50% fee
- Fee: ₹3,000
- Refund: ₹3,000

Result: ⚠️ Half refund, owner gets ₹3,000
```

### Example 3: Last Minute (High Fee)
```
Booking Details:
- Amount: ₹10,000
- Pickup: Jan 15
- Cancel Date: Jan 13 (2 days before)
- Status: Confirmed

Calculation:
- Days until pickup: 2 days
- Policy: 2-3 days = 75% fee
- Fee: ₹7,500
- Refund: ₹2,500

Result: ⚠️ Small refund, owner gets ₹7,500
```

### Example 4: Too Late (Cannot Cancel)
```
Booking Details:
- Amount: ₹5,000
- Pickup: Jan 15 at 10:00 AM
- Cancel Date: Jan 14 at 8:00 PM (14 hours before)
- Status: Confirmed

Calculation:
- Hours until pickup: 14 hours
- Policy: <24 hours = CANNOT CANCEL
- Fee: N/A
- Refund: N/A

Result: 🚫 Must contact owner directly
```

## 🎭 Real-World Scenarios

### Scenario A: Emergency Cancellation
```
User: "My flight got cancelled, need to cancel booking"
System: Checks policy
- 2 days before pickup
- Confirmed booking
- Shows: 75% fee (₹3,750 of ₹5,000)
User: Can add reason "Flight cancelled"
Owner: Sees reason, gets compensation
```

### Scenario B: Changed Plans
```
User: "Found a better deal elsewhere"
System: Checks policy
- 5 days before pickup
- Pending booking
- Shows: FREE cancellation
User: Cancels without penalty
Owner: Car becomes available for others
```

### Scenario C: Last-Minute Emergency
```
User: "Medical emergency, need to cancel"
System: Checks policy
- 12 hours before pickup
- Confirmed booking
- Shows: CANNOT CANCEL
User: Must contact owner directly
Owner: Can decide to waive fee for emergency
```

## 🔄 System Behavior

### When User Cancels:
1. ✅ Booking status → "cancelled"
2. ✅ Cancellation fee calculated and stored
3. ✅ Cancellation date recorded
4. ✅ Optional reason saved
5. ✅ Car availability → true
6. ✅ Car bookedUntil → null

### What Owner Sees:
- Cancelled booking in dashboard
- Cancellation fee amount
- User's cancellation reason
- Cancellation date
- Can track cancellation patterns

### What User Sees:
- Cancelled status on booking
- Cancellation fee charged
- Cancellation date
- Clear policy explanation

## 📱 Mobile Experience

```
┌─────────────────────────┐
│  My Bookings            │
├─────────────────────────┤
│  BMW X5                 │
│  Dec 20-25, 2024        │
│  ₹5,000                 │
│  Status: Confirmed      │
│                         │
│  [Cancel Booking]       │
└─────────────────────────┘
        ↓ (tap)
┌─────────────────────────┐
│  ⚠️ Cancellation Policy │
├─────────────────────────┤
│  5 days until pickup    │
│                         │
│  Booking:     ₹5,000    │
│  Fee (50%):  -₹2,500    │
│  Refund:      ₹2,500    │
│                         │
│  [Keep] [Confirm]       │
└─────────────────────────┘
```

## ✨ Key Features

1. **Transparent** - User sees fee before confirming
2. **Fair** - Early cancellation is free
3. **Protective** - Owner gets compensation
4. **Flexible** - Different rules for pending vs confirmed
5. **Trackable** - All data saved for records

---

**This system balances user flexibility with owner protection!**

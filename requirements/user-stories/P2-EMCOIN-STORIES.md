---
created: '2025-08-23'
domain: requirements
priority: P2
purpose: Document p2 user stories - emcoin transactions & economy
session: legacy
status: current
title: P2 User Stories - emCoin Transactions & Economy
topics:
- requirements
type: specification
---

# P2 User Stories - emCoin Transactions & Economy

**Extracted From**: Canvas 003-2 (emCoin Transactions Box)  
**Priority**: P2 (Enhancement Features)  
**Session**: 00019  

---

## emCoin Wallet Management

### US-136: View emCoin Balance
**As a** Player  
**I want to** view my current emCoin balance  
**So that** I know how many coins I have available

**Acceptance Criteria:**
- Balance displayed prominently on dashboard
- Real-time balance updates
- Balance breakdown (earned, spent, pending)
- Historical balance chart
- Low balance warnings
- Balance refresh button

### US-137: emCoin Transaction History
**As a** Player  
**I want to** view my complete transaction history  
**So that** I can track my earnings and spending

**Acceptance Criteria:**
- Chronological transaction list
- Transaction type (earned, spent, transferred, refunded)
- Transaction details (date, amount, description)
- Filter by date range
- Filter by transaction type
- Export to CSV for records

### US-138: emCoin Transaction Details
**As a** Player  
**I want to** see detailed information for each transaction  
**So that** I understand what each transaction was for

**Acceptance Criteria:**
- Transaction ID displayed
- Activity or item associated
- Timestamp with timezone
- Status (completed, pending, failed)
- Related user/team information
- Transaction notes if applicable

---

## Earning emCoins

### US-139: Earn emCoins from Activities
**As a** Player  
**I want to** earn emCoins by completing activities  
**So that** I can build my balance through participation

**Acceptance Criteria:**
- emCoin reward shown before activity
- Automatic credit upon completion
- Bonus coins for exceptional performance
- Team activity earnings split fairly
- Pending status until verified
- Notification when coins credited

### US-140: Daily Login Rewards
**As a** Player  
**I want to** earn emCoins for daily logins  
**So that** I'm rewarded for consistent engagement

**Acceptance Criteria:**
- Daily login bonus amount shown
- Streak counter for consecutive days
- Increasing rewards for longer streaks
- Reset rules clearly explained
- Automatic credit on login
- Monthly calendar showing earnings

### US-141: Achievement Bonuses
**As a** Player  
**I want to** earn emCoins for achievements  
**So that** I'm rewarded for reaching milestones

**Acceptance Criteria:**
- Badge completion rewards
- First-time achievement bonuses
- Level progression rewards
- Team achievement contributions
- Special event bonuses
- Retroactive credit for past achievements

---

## Spending emCoins

### US-142: Activity Registration Payments
**As a** Player  
**I want to** pay for activity registrations with emCoins  
**So that** I can participate in premium activities

**Acceptance Criteria:**
- Registration cost clearly displayed
- Insufficient balance prevention
- Payment confirmation required
- Transaction receipt generated
- Refund policy displayed
- Partial payment options

### US-143: Purchase Premium Resources
**As a** Player  
**I want to** purchase premium resources with emCoins  
**So that** I can access advanced learning materials

**Acceptance Criteria:**
- Resource price displayed
- Preview before purchase
- One-click purchase option
- Download after purchase
- Purchase history maintained
- Re-download purchased items

### US-144: Team Contribution Pool
**As a** Team Member  
**I want to** contribute emCoins to team pool  
**So that** we can register for team activities together

**Acceptance Criteria:**
- Team wallet visible to all members
- Voluntary contribution system
- Contribution history tracked
- Withdrawal restrictions
- Team founder management rights
- Fair usage policy

---

## emCoin Transfers

### US-145: Transfer emCoins to Players
**As a** Player  
**I want to** transfer emCoins to other players  
**So that** I can help teammates or friends

**Acceptance Criteria:**
- Recipient search by call_sign
- Transfer amount validation
- Transfer confirmation required
- Transfer limits enforced
- Transfer fee if applicable
- Transfer history maintained

### US-146: Request emCoins
**As a** Player  
**I want to** request emCoins from others  
**So that** I can participate when short on coins

**Acceptance Criteria:**
- Request specific amount
- Add reason for request
- Request expiry time
- Notification to requested player
- Accept/decline options
- Request history tracked

---

## Supervisor emCoin Management

### US-147: Purchase emCoins for Linked Players
**As a** Supervisor  
**I want to** purchase emCoins for my linked players  
**So that** they can participate fully in activities

**Acceptance Criteria:**
- Real money to emCoin conversion
- Secure payment processing
- Distribution to linked players
- Purchase receipts generated
- Tax documentation provided
- Spending controls available

### US-148: Monitor Linked Player Spending
**As a** Supervisor  
**I want to** monitor emCoin usage of linked players  
**So that** I can ensure responsible spending

**Acceptance Criteria:**
- View all linked player balances
- See transaction history per player
- Set spending limits
- Approve large transactions
- Receive spending alerts
- Generate spending reports

### US-149: emCoin Allowance System
**As a** Supervisor  
**I want to** set up automatic emCoin allowances  
**So that** linked players receive regular coins

**Acceptance Criteria:**
- Set weekly/monthly allowance amount
- Automatic distribution schedule
- Conditional allowances (based on performance)
- Allowance history tracking
- Pause/resume allowances
- Bulk allowance management

---

## Enabler Payment System

### US-150: Enabler Earnings Dashboard
**As an** Enabler  
**I want to** track my earnings from evaluations  
**So that** I know my payment status

**Acceptance Criteria:**
- Current period earnings displayed
- Evaluations completed count
- Payment per evaluation shown
- Pending vs confirmed earnings
- Payment schedule displayed
- Year-to-date totals

### US-151: Enabler Payment Processing
**As an** Enabler  
**I want to** receive payments for my work  
**So that** I'm compensated for evaluations

**Acceptance Criteria:**
- Bank account verification
- Payment method selection
- Payment threshold settings
- Tax form generation (1099)
- Payment history access
- Direct deposit confirmation

### US-152: Enabler Payment Information
**As an** Enabler  
**I want to** manage my payment information  
**So that** payments are processed correctly

**Acceptance Criteria:**
- Secure bank details entry
- Payment info verification
- Update payment methods
- Tax information collection
- Payment hold notifications
- Support for payment issues

---

## emCoin Analytics

### US-153: Personal Economics Dashboard
**As a** Player  
**I want to** see my economic analytics  
**So that** I can manage my emCoins better

**Acceptance Criteria:**
- Income vs spending trends
- Category breakdown of spending
- Earning source analysis
- Savings rate calculation
- Comparison to platform average
- Financial goals tracking

### US-154: Platform Economy Metrics
**As a** Platform Administrator  
**I want to** monitor the emCoin economy  
**So that** I can maintain economic balance

**Acceptance Criteria:**
- Total coins in circulation
- Inflation/deflation tracking
- Transaction volume metrics
- User wealth distribution
- Activity pricing analytics
- Economic health indicators

---

## Technical Requirements

emCoin system requires:
- Blockchain or ledger system for transactions
- Payment gateway integration
- Fraud detection system
- Transaction rollback capability
- Audit trail for all transactions
- PCI compliance for real money transactions

---

*Next: Create P2 success criteria document*
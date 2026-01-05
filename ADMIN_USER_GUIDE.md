# Admin Dashboard - User Guide

## Getting Started with TechMart Admin Dashboard

Welcome to the TechMart Admin Dashboard! This guide will help you navigate and use all the features available to manage your e-commerce platform.

---

## 📍 Navigation Overview

The admin dashboard is organized into 6 main sections:

1. **Dashboard** - Central hub with metrics and recent activity
2. **Products** - Manage inventory and product information
3. **Orders** - Track and manage customer orders
4. **Users** - Manage user accounts and permissions
5. **Settings** - Configure system and account preferences

---

## 🏠 Dashboard

### What You'll See

The dashboard provides an at-a-glance view of your business metrics:

**Top Statistics**

- Total Products: Number of items in inventory
- Total Orders: Count of all orders
- Total Users: Number of registered users
- Revenue: Total sales generated

Each statistic shows:

- Current value
- Percentage change from previous period
- Arrow indicator (↑ increase, ↓ decrease)

**Recent Orders**

- Last 4 orders
- Customer names
- Order amounts
- Order status (Completed, Processing, Pending)

**Top Products**

- Best-selling products
- Number of units sold
- Product pricing

**Recent Activity Feed**

- Latest system activities
- Timestamps
- Activity type (Orders, Products, Users)

**Performance Metrics**

- Conversion Rate: % of visitors who make purchases
- Growth Rate: Month-over-month sales growth
- Average Order Value: Average amount per order
- Today's Sales: Total sales for current day
- Pending Orders: Orders awaiting processing
- Low Stock Items: Products running low on inventory

### Quick Actions

- **View All Orders** - Jump to complete order list
- **View All Products** - Jump to complete product inventory
- **Download Report** - Export dashboard data

---

## 📦 Products Management

### Viewing Products

1. Click **Products** in the left sidebar
2. You'll see a table with all products

### Product Information

Each product row shows:

- **Product Image** - Thumbnail preview
- **Product Name** - Full product name
- **SKU** - Stock Keeping Unit (unique identifier)
- **Category** - Product category (Laptops, Smartphones, Accessories)
- **Price** - Product cost
- **Stock Level** - Number of units available
  - Red = Out of stock
  - Orange = Low stock
  - Green = Adequate stock
- **Status** - Active/Out of Stock/Inactive
- **Actions** - Edit or Delete buttons

### Searching & Filtering

**Search by Product Name or SKU**

1. Enter text in the search box
2. Results update instantly

**Filter by Category**

- Select from dropdown
- Options: All Categories, Laptops, Smartphones, Accessories

**Filter by Status**

- Select from dropdown
- Options: All Status, Active, Out of Stock, Inactive

**Combining Filters**

- Use multiple filters together
- Results show only items matching ALL filters

### Managing Products

**Edit a Product**

1. Find product in the table
2. Click the Edit button (pencil icon)
3. Update information
4. Save changes

**Delete a Product**

1. Find product in the table
2. Click the Delete button (trash icon)
3. Confirm deletion

**Add New Product**

1. Click **Add Product** button (top right)
2. Fill in product details:
   - Name
   - Category
   - Price
   - Description
   - Stock quantity
   - Images
3. Click Save

### Pagination

- Shows current page
- Use Previous/Next buttons to navigate
- Item count shows how many products total

---

## 📋 Orders Management

### Viewing Orders

1. Click **Orders** in the left sidebar
2. See all customer orders in a table

### Order Information

Each order row shows:

- **Order ID** - Unique order number (#12345)
- **Customer** - Customer name
- **Date** - Order placement date
- **Items** - Number of items in order
- **Payment Method** - How customer paid
- **Total** - Order amount
- **Status** - Order state with color coding:
  - Green = Completed
  - Blue = Processing
  - Yellow = Pending
  - Purple = Shipped
  - Red = Cancelled

### Searching & Filtering

**Search Orders**

1. Enter Order ID or Customer Name
2. Results update instantly

**Filter by Status**

- Select order status from dropdown
- View only orders in specific state

**Filter by Date**

- Click date picker
- Select specific date or date range

### Managing Orders

**View Order Details**

1. Find order in table
2. Click View button (eye icon)
3. See complete order information

**Update Order Status**

1. Open order details
2. Select new status
3. Save changes

### Order Statuses Explained

- **Pending** - Order received, awaiting processing
- **Processing** - Staff is preparing order for shipment
- **Shipped** - Order is in transit to customer
- **Completed** - Order delivered to customer
- **Cancelled** - Order was cancelled by customer or staff

---

## 👥 Users Management

### Viewing Users

1. Click **Users** in the left sidebar
2. See all registered users in a table

### User Information

Each user row shows:

- **Avatar** - User profile picture with initials
- **Name** - Full user name
- **Email** - Email address
- **Role** - User role/permission level
  - Admin (purple badge)
  - Manager (blue badge)
  - Customer (gray badge)
- **Orders** - Number of purchases made
- **Status** - User account status
  - Active (green)
  - Inactive (gray)
  - Suspended (red)
- **Join Date** - When user registered
- **Actions** - Edit or Delete buttons

### Searching & Filtering

**Search Users**

1. Enter name or email
2. Results update instantly

**Filter by Role**

- Admin users only
- Manager users only
- Customer users only

**Filter by Status**

- Active users
- Inactive users
- Suspended users

### Managing Users

**Edit User**

1. Click Edit button (pencil icon)
2. Update user information
3. Save changes

**Delete User**

1. Click Delete button (trash icon)
2. Confirm deletion

**Add New User**

1. Click **Add User** button
2. Enter user details:
   - Name
   - Email
   - Password
   - Role
   - Status
3. Click Create

### User Roles

- **Admin** - Full system access, can manage everything
- **Manager** - Limited access, can manage products and orders
- **Customer** - Regular user, can view products and place orders

---

## ⚙️ Settings

Settings is organized into 6 tabs for easy management:

### Account Profile

**What You Can Do:**

- Update your name
- Change email address
- Add phone number
- Update company info
- Change position/title
- Change profile picture

**How to Use:**

1. Click **Settings** in sidebar
2. Click **Account Profile** tab
3. Click **Edit** button
4. Update your information
5. Click **Save Changes**
6. You'll see a success message

### Security

**Change Password:**

1. Enter current password
2. Enter new password (8+ characters)
3. Confirm new password
4. Click **Update Password**

**Password Requirements:**

- Minimum 8 characters
- Mix of letters and numbers
- Different from current password

**Two-Factor Authentication:**

- Click **Enable 2FA**
- Follow setup instructions
- Provides extra security for your account

**Recent Login Activity:**

- See where your account was accessed
- Shows device and location
- See login timestamps
- Helps identify suspicious activity

### Roles & Permissions

**View All Roles:**

- Administrator
- Manager
- Viewer

**For Each Role:**

- Name and description
- Number of users assigned
- List of permissions
- Current status
- Edit button

**Manage Roles:**

1. Click **New Role** to create custom role
2. Click **Edit Role** to modify existing
3. Assign permissions to roles
4. Set active/inactive status

### System Preferences

**Personalize Your Dashboard:**

- **Theme** - Choose Light, Dark, or Auto
- **Language** - Select: English, Spanish, French, German
- **Timezone** - Set your local timezone
- **Date Format** - Choose format (MM/DD/YYYY, DD/MM/YYYY, etc.)
- **Time Format** - Choose 12-hour or 24-hour
- **Items Per Page** - Select: 10, 20, 50, or 100 items

**How to Use:**

1. Click **System Preferences** tab
2. Adjust each setting as desired
3. Click **Save Preferences**

### Notifications

**Email Notifications Toggle:**

- New Orders - Notify when orders arrive
- Daily Digest - Morning summary email
- Security Alerts - Critical security notices
- Weekly Reports - Business performance reports
- Product Updates - New inventory notifications
- System Updates - Platform maintenance notices

**Notification Frequency:**

- Instantly - Immediate notifications
- Hourly - One summary per hour
- Daily - One summary per day
- Weekly - One summary per week

**How to Use:**

1. Click **Notifications** tab
2. Toggle each notification on/off
3. Select notification frequency
4. Click **Save Settings**

### Integrations

**Available Integrations:**

- Stripe Payment - Payment processing
- SendGrid Email - Email delivery service
- Google Analytics - Website analytics
- AWS S3 - Cloud storage

**Integration Information Shows:**

- Connection status (Connected/Disconnected)
- When last synced
- Settings/Connect/Disconnect buttons

**API Keys:**

- Lists your API keys
- Shows when created
- Shows last used date
- Ability to generate new keys
- Secure key display (masked)

**How to Connect an Integration:**

1. Find integration in list
2. If disconnected, click **Connect**
3. Follow authentication steps
4. Once connected, you can:
   - View settings
   - Configure options
   - Disconnect if needed

**Manage API Keys:**

1. Scroll to API Keys section
2. Click **Generate Key** to create new
3. Copy key for use in applications
4. Delete old/unused keys
5. Monitor key usage

---

## 🎯 Common Tasks

### How to Add a New Product

1. Go to **Products**
2. Click **Add Product** (blue button, top right)
3. Fill in details:
   - Product name
   - Category
   - Price
   - Description
   - Stock quantity
   - Upload images
4. Click **Save**

**Time Required:** 5-10 minutes per product

### How to Process an Order

1. Go to **Orders**
2. Search for or find the order
3. Click **View** to see details
4. Update status as needed:
   - Pending → Processing
   - Processing → Shipped
   - Shipped → Completed
5. Notify customer of changes

**Status Flow:** Pending → Processing → Shipped → Completed

### How to Manage a User

1. Go to **Users**
2. Search for or find the user
3. Click **Edit** to make changes
4. Update:
   - Profile information
   - Role/permissions
   - Account status
5. Click **Save**

### How to Change Your Password

1. Go to **Settings**
2. Click **Security** tab
3. Fill in:
   - Current password
   - New password
   - Confirm new password
4. Click **Update Password**
5. New password takes effect immediately

### How to Connect a Service

1. Go to **Settings**
2. Click **Integrations** tab
3. Find the service you want
4. Click **Connect** button
5. Follow the authentication flow
6. Authorize the connection
7. Service is now active

---

## 📊 Understanding Data

### Status Badges

**Color Meanings:**

- 🟢 Green - Successful, active, completed
- 🔵 Blue - Processing, pending, info
- 🟡 Yellow - Warning, caution, awaiting action
- 🔴 Red - Error, inactive, critical
- 🟣 Purple - Admin, special role

### Stock Levels

- **Green** - Healthy stock (20+ units)
- **Orange** - Low stock (5-19 units)
- **Red** - Out of stock (0 units)
- **With "Low" badge** - Below minimum threshold

### Order Statuses

- **Pending** (Yellow) - Just received, not processed
- **Processing** (Blue) - Being prepared for shipment
- **Shipped** (Purple) - In transit to customer
- **Completed** (Green) - Successfully delivered
- **Cancelled** (Red) - Order was cancelled

---

## 💡 Tips & Tricks

### Shortcuts

- **Search Everything** - Use search bar to find products, orders, users
- **Filter Combinations** - Combine multiple filters for better results
- **Hover for More Info** - Hover over badges/icons for tooltip info
- **Links to Details** - Click "View All" links for complete list view

### Best Practices

1. **Regular Backups** - Regularly export important data
2. **Monitor Stock** - Check low stock items weekly
3. **Review Orders** - Process pending orders quickly
4. **Update Regularly** - Keep user information current
5. **Secure Password** - Use strong passwords
6. **Check Activity** - Review login activity monthly

### Keyboard Shortcuts

- **Tab** - Navigate through fields
- **Enter** - Submit forms
- **Escape** - Close modals/dialogs
- **Ctrl+S** - Save changes (some browsers)

---

## ❓ Frequently Asked Questions

**Q: How do I reset my password?**
A: Go to Settings → Security → Change Password section

**Q: Can I undo a deletion?**
A: Deletions are permanent. Consider marking as inactive instead.

**Q: How do I export data?**
A: Click "Download Report" button on Dashboard

**Q: Why can't I edit a field?**
A: Click "Edit" button first to enable editing

**Q: How do I enable two-factor authentication?**
A: Go to Settings → Security → Click "Enable 2FA"

**Q: Can I change my timezone?**
A: Yes, go to Settings → System Preferences

**Q: How do I connect third-party services?**
A: Go to Settings → Integrations → Click "Connect"

**Q: What's the difference between roles?**
A: Admin has full access, Manager has limited access, Viewer is read-only

---

## 🚨 Troubleshooting

### I Can't Log In

- Check username/email
- Reset password via Settings
- Clear browser cache/cookies

### Data Won't Save

- Check required fields are filled
- Look for error messages
- Verify internet connection

### Filters Not Working

- Clear search box
- Reset all filters
- Refresh page

### Page Won't Load

- Check internet connection
- Clear browser cache
- Try different browser
- Contact support

### Buttons Not Responding

- Verify you have correct permissions
- Refresh the page
- Check browser console for errors

---

## 📞 Getting Help

### Support Resources

1. **Documentation** - See ADMIN_SYSTEM_DOCUMENTATION.md
2. **Quick Start** - See ADMIN_QUICK_START.md
3. **In-App Help** - Hover over icons for tooltips
4. **Contact Admin** - Email: admin@techmart.com
5. **Help Center** - Visit support.techmart.com

### Reporting Issues

1. Note what you were doing
2. Take a screenshot
3. Check browser console for errors
4. Contact support with details
5. Reference error messages

---

## 📈 Best Practices

### Daily Tasks

- [ ] Check pending orders
- [ ] Monitor low stock items
- [ ] Review recent activity
- [ ] Process customer inquiries

### Weekly Tasks

- [ ] Review sales metrics
- [ ] Check user registrations
- [ ] Update product prices if needed
- [ ] Review login activity

### Monthly Tasks

- [ ] Analyze sales trends
- [ ] Audit user accounts
- [ ] Review integrations status
- [ ] Export and backup data

---

## 🎓 Training Resources

### Video Tutorials

- Dashboard overview (5 min)
- Product management (10 min)
- Order processing (8 min)
- User management (6 min)
- Settings configuration (7 min)

### Documentation Files

- System Documentation
- Quick Start Guide
- Implementation Summary
- This User Guide

### Live Training

- Schedule: Wednesdays at 2 PM
- Duration: 1 hour
- Topics: Rotating based on requests

---

**Dashboard Version:** 1.0.0  
**Last Updated:** January 5, 2026  
**For More Help:** Contact admin@techmart.com

**Congratulations! You're ready to manage TechMart! 🚀**

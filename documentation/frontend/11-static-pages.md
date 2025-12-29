# 📄 Frontend Static Pages

**Complete documentation for all static pages including About, Contact, FAQ, Privacy Policy, Terms, and other informational pages.**

---

## 📁 File Structure

```
frontend/src/app/(main)/
├── about/page.tsx                # About page
├── contact/page.tsx               # Contact page
├── faq/page.tsx                   # FAQ page
├── privacy-policy/page.tsx        # Privacy policy
├── terms-of-service/page.tsx      # Terms of service
├── return-policy/page.tsx         # Return policy
├── shipping/page.tsx              # Shipping information
├── cookie-policy/page.tsx         # Cookie policy
└── support/page.tsx               # Support page
```

---

## ℹ️ About Page

### **File**: `app/(main)/about/page.tsx`

**Purpose**: Company information and story

**Features**:

- ✅ **Hero Section**: Company name and tagline
- ✅ **Mission Section**: Company mission statement
- ✅ **Features Section**: Why choose us (4 features)
- ✅ **Values Section**: Company values (4 values)
- ✅ **Stats Section**: Dynamic statistics from API
- ✅ **Story Section**: Company story
- ✅ **CTA Section**: Call-to-action buttons
- ✅ **Animations**: Framer Motion animations
- ✅ **Responsive**: Mobile, tablet, desktop layouts

**Components Used**:

- `motion` - Framer Motion animations
- `Button` - CTA buttons
- `Link` - Navigation links

**Dynamic Data**:

- Product count from API
- Category count from API
- Customer count (estimated)
- Average rating from products

---

## 📧 Contact Page

### **File**: `app/(main)/contact/page.tsx`

**Purpose**: Contact form and information

**Features**:

- ✅ **Contact Form**: Full contact form with validation
- ✅ **Form Fields**: Name, email, phone, subject, message, category
- ✅ **Form Validation**: React Hook Form + Zod validation
- ✅ **Success State**: Success message display
- ✅ **Contact Information**: Email, phone, business hours
- ✅ **Error Handling**: Error messages and toast notifications
- ✅ **Responsive**: Mobile, tablet, desktop layouts

**Form Fields**:

- `name` - Name (required, min 2 chars)
- `email` - Email (required, email format)
- `phone` - Phone (optional, Indian format)
- `subject` - Subject (required, min 3 chars)
- `message` - Message (required, min 10 chars)
- `category` - Category (optional, enum: general, order, return, product, other)

**API Integration**:

- Uses `contactApi.submitContact()` to submit form

**Components Used**:

- `Input`, `Textarea`, `Button` - Form components
- `toast` - Toast notifications

---

## ❓ FAQ Page

### **File**: `app/(main)/faq/page.tsx`

**Purpose**: Frequently asked questions

**Features**:

- ✅ **FAQ Categories**: Filter by category
- ✅ **Accordion**: Expandable FAQ items
- ✅ **Categories**: Orders & Payment, Shipping & Delivery, Returns & Exchanges, Products & Sizing, Account & Profile, General
- ✅ **Search**: Search functionality (if implemented)
- ✅ **Contact CTA**: Link to contact page
- ✅ **Responsive**: Mobile, tablet, desktop layouts

**FAQ Categories**:

1. **Orders & Payment** (4 questions)
   - How to place order
   - Payment methods
   - Payment security
   - Modify/cancel order

2. **Shipping & Delivery** (4 questions)
   - Delivery time
   - Shipping locations
   - Shipping charges
   - Order tracking

3. **Returns & Exchanges** (4 questions)
   - Return policy
   - Non-returnable items
   - Initiate return
   - Refund processing

4. **Products & Sizing** (4 questions)
   - Size guide
   - Size exchanges
   - Color accuracy
   - Damaged products

5. **Account & Profile** (4 questions)
   - Create account
   - Reset password
   - Update profile
   - Manage addresses

6. **General** (4 questions)
   - Physical stores
   - Gift wrapping
   - Contact support
   - Loyalty program

**Components Used**:

- `ChevronDown` - Expand/collapse icon
- `Link` - Navigation links

---

## 🔒 Privacy Policy Page

### **File**: `app/(main)/privacy-policy/page.tsx`

**Purpose**: Privacy policy information

**Features**:

- ✅ **Policy Sections**: Multiple sections
- ✅ **Last Updated**: Last update date
- ✅ **Readable Format**: Well-formatted text
- ✅ **Responsive**: Mobile, tablet, desktop layouts

**Sections**:

1. Information We Collect
2. How We Use Information
3. Information Sharing
4. Data Security
5. Your Rights
6. Cookies
7. Third-Party Services
8. Children's Privacy
9. Changes to Policy
10. Contact Information

---

## 📜 Terms of Service Page

### **File**: `app/(main)/terms-of-service/page.tsx`

**Purpose**: Terms of service information

**Features**:

- ✅ **Terms Sections**: Multiple sections
- ✅ **Last Updated**: Last update date
- ✅ **Readable Format**: Well-formatted text
- ✅ **Responsive**: Mobile, tablet, desktop layouts

**Sections**:

1. Acceptance of Terms
2. Use of Service
3. User Accounts
4. Products and Pricing
5. Orders and Payment
6. Shipping and Delivery
7. Returns and Refunds
8. Intellectual Property
9. Limitation of Liability
10. Governing Law

---

## 🔄 Return Policy Page

### **File**: `app/(main)/return-policy/page.tsx`

**Purpose**: Return and refund policy

**Features**:

- ✅ **Policy Sections**: Detailed return policy
- ✅ **Return Process**: Step-by-step process
- ✅ **Eligibility**: What can be returned
- ✅ **Non-Returnable Items**: Items that cannot be returned
- ✅ **Refund Process**: How refunds work
- ✅ **Responsive**: Mobile, tablet, desktop layouts

**Sections**:

1. Return Eligibility
2. Return Timeframe
3. Return Process
4. Non-Returnable Items
5. Refund Processing
6. Exchange Policy
7. Return Shipping
8. Damaged/Defective Items

---

## 🚚 Shipping Page

### **File**: `app/(main)/shipping/page.tsx`

**Purpose**: Shipping information

**Features**:

- ✅ **Shipping Options**: Different shipping methods
- ✅ **Delivery Times**: Estimated delivery times
- ✅ **Shipping Charges**: Shipping cost information
- ✅ **Tracking**: How to track orders
- ✅ **Locations**: Shipping locations
- ✅ **Responsive**: Mobile, tablet, desktop layouts

**Sections**:

1. Shipping Methods
2. Delivery Times
3. Shipping Charges
4. Free Shipping
5. Order Tracking
6. Shipping Locations
7. International Shipping (if applicable)

---

## 🍪 Cookie Policy Page

### **File**: `app/(main)/cookie-policy/page.tsx`

**Purpose**: Cookie policy information

**Features**:

- ✅ **Cookie Types**: Different types of cookies
- ✅ **Cookie Usage**: How cookies are used
- ✅ **Cookie Management**: How to manage cookies
- ✅ **Third-Party Cookies**: Third-party cookie information
- ✅ **Responsive**: Mobile, tablet, desktop layouts

**Sections**:

1. What Are Cookies
2. Types of Cookies We Use
3. How We Use Cookies
4. Third-Party Cookies
5. Managing Cookies
6. Cookie Consent

---

## 🎧 Support Page

### **File**: `app/(main)/support/page.tsx`

**Purpose**: Support information and ticket creation

**Features**:

- ✅ **Support Options**: Different ways to get support
- ✅ **Ticket Form**: Create support ticket (if logged in)
- ✅ **Support Categories**: Ticket categories
- ✅ **Contact Information**: Support contact details
- ✅ **Business Hours**: Support hours
- ✅ **Responsive**: Mobile, tablet, desktop layouts

**Support Options**:

1. Email Support
2. Phone Support
3. Live Chat (if implemented)
4. Support Tickets
5. FAQ

---

## 📝 Page Patterns

### **Common Structure**

All static pages follow a similar structure:

```tsx
export default function StaticPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-10">
          <h1>Page Title</h1>
          <p>Page description</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container-luxury py-8 sm:py-10">
        <div className="max-w-4xl mx-auto">
          {/* Page content */}
        </div>
      </section>
    </div>
  );
}
```

---

## 🎨 Design Patterns

### **Styling**

- ✅ **Container**: `container-luxury` class for consistent width
- ✅ **Spacing**: Consistent padding (`py-8 sm:py-10`)
- ✅ **Typography**: Consistent font sizes and weights
- ✅ **Colors**: Neutral color palette
- ✅ **Borders**: Subtle borders (`border-[#e5e5e5]`)
- ✅ **Responsive**: Mobile-first approach

---

## 📝 Usage Examples

### **About Page**

```tsx
export default function AboutPage() {
  const { data: productsData } = useProducts({ limit: 1 });
  const { data: categoriesData } = useCategories();

  return (
    <div>
      <HeroSection />
      <MissionSection />
      <FeaturesSection />
      <ValuesSection />
      <StatsSection stats={stats} />
      <StorySection />
      <CTASection />
    </div>
  );
}
```

### **Contact Page**

```tsx
export default function ContactPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    await contactApi.submitContact(data);
    toast.success("Message sent!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

---

## 🔗 Related Documentation

- [Components](./07-components.md)
- [Services & Hooks](./09-services-hooks.md)
- [Core Application](./01-core-application.md)

---

**Last Updated**: January 2025


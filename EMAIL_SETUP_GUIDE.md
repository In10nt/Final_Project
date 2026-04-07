# Email Setup Guide for Order Confirmations

## Overview
The checkout system sends professional HTML email confirmations to customers after they place an order.

## Email Configuration

### Option 1: Gmail (Recommended for Demo)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password

3. **Update application.yml**:
```yaml
spring:
  mail:
    username: your-email@gmail.com
    password: your-16-char-app-password
```

### Option 2: Environment Variables (Recommended for Production)

Set environment variables:
```bash
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
```

### Option 3: For Campus Demo (No Email)

If you don't want to configure email for demo:
1. The system will log the email content to console
2. You can see the order confirmation in the application logs
3. The frontend will still show success message

## Email Features

### What's Included in the Email:
- ✅ Professional HTML template with Fashion Store branding
- ✅ Order ID and date
- ✅ Payment status badge
- ✅ Complete shipping address
- ✅ List of all ordered items with quantities and prices
- ✅ Order summary (subtotal, shipping, tax, total)
- ✅ Responsive design (looks good on mobile and desktop)

### Email Template Preview:
```
┌─────────────────────────────────────┐
│     Fashion Store                   │
│  AI-Powered Virtual Try-On          │
├─────────────────────────────────────┤
│         ✓ Order Confirmed!          │
│    Thank you for your purchase      │
├─────────────────────────────────────┤
│  Order Information                  │
│  Order ID: ORD-1234567890          │
│  Date: Dec 15, 2024 14:30          │
│  Status: Paid                       │
├─────────────────────────────────────┤
│  Shipping Address                   │
│  John Doe                           │
│  123 Main St                        │
│  New York, NY 10001                 │
├─────────────────────────────────────┤
│  Order Items                        │
│  Classic White Shirt (M) x2  $59.98│
│  Blue Jeans (L) x1          $79.99 │
├─────────────────────────────────────┤
│  Order Summary                      │
│  Subtotal:  $139.97                │
│  Shipping:  FREE                    │
│  Tax:       $13.99                  │
│  Total:     $153.96                │
└─────────────────────────────────────┘
```

## Testing Email

### Test the Email Service:

1. **Start the backend**:
```bash
mvn spring-boot:run
```

2. **Place a test order** through the checkout page

3. **Check your email** for the confirmation

4. **Check console logs** if email fails:
```
Order confirmation email sent to: customer@example.com
```

## Troubleshooting

### Email Not Sending?

1. **Check Gmail App Password**:
   - Make sure 2FA is enabled
   - Generate a new app password
   - Use the 16-character password (no spaces)

2. **Check Firewall**:
   - Port 587 must be open for SMTP

3. **Check Logs**:
```bash
tail -f logs/application.log | grep Email
```

4. **Test SMTP Connection**:
```bash
telnet smtp.gmail.com 587
```

### Common Errors:

**"Authentication failed"**
- Wrong username or password
- App password not generated
- 2FA not enabled

**"Connection timeout"**
- Firewall blocking port 587
- Wrong SMTP host

**"Invalid email address"**
- Check customer email format
- Verify email in checkout form

## For Campus Demo

If you don't want to set up email:

1. **Comment out email sending** in `EmailService.java`:
```java
// mailSender.send(message);
log.info("Email would be sent to: {}", order.getCustomer().getEmail());
log.info("Email content: {}", emailContent);
```

2. **Check console** for email content during demo

3. **Show the success dialog** which confirms the order was placed

## Production Recommendations

For production deployment:

1. Use a dedicated email service (SendGrid, AWS SES, Mailgun)
2. Set up SPF, DKIM, and DMARC records
3. Use environment variables for credentials
4. Implement email queue for reliability
5. Add email templates for different order statuses
6. Track email delivery status

## Email Service Providers

### Free Tier Options:
- **SendGrid**: 100 emails/day free
- **Mailgun**: 5,000 emails/month free
- **AWS SES**: 62,000 emails/month free (if hosted on AWS)

### Configuration Example (SendGrid):
```yaml
spring:
  mail:
    host: smtp.sendgrid.net
    port: 587
    username: apikey
    password: your-sendgrid-api-key
```

## Support

For issues with email setup:
1. Check application logs
2. Verify SMTP credentials
3. Test with a simple email first
4. Contact your email provider support

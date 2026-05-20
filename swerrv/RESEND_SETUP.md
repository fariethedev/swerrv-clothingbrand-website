# Resend Email Integration Setup Guide

This guide explains how to set up, configure, and use the Resend email delivery system with your Swerrv Spring Boot backend. 

By using environment variables instead of hardcoded values, your API keys and credentials remain secure and excluded from version control (Git).

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Get your Resend API Key](#2-get-your-resend-api-key)
3. [Domain Verification (Required for Production)](#3-domain-verification-required-for-production)
4. [Local Configuration (`.env`)](#4-local-configuration-env)
5. [Production/Deployment Configuration](#5-productiondeployment-configuration)
6. [How the Backend Resolves Configurations](#6-how-the-backend-resolves-configurations)

---

## 1. Prerequisites
- A **Resend** account (Sign up at [resend.com](https://resend.com/))
- A custom domain (e.g., `swerrv.shop`) to send emails from.

---

## 2. Get your Resend API Key
1. Log in to your **Resend** dashboard.
2. Navigate to **API Keys** in the sidebar.
3. Click **Create API Key**.
4. Set a name (e.g., `Swerrv Backend - Production` or `Swerrv Backend - Development`).
5. Choose **Sending Access** or **Full Access** depending on your security preference.
6. Click **Add** and copy the generated key immediately (it starts with `re_...`).

---

## 3. Domain Verification (Required for Production)
Resend only permits sending emails from verified domains to prevent spam.
1. In the Resend dashboard, go to **Domains**.
2. Click **Add Domain**.
3. Enter your domain (e.g., `swerrv.shop`) and select your region.
4. Resend will provide DNS records (**SPF**, **DKIM**, and **MX/TXT**).
5. Add these records to your DNS provider (e.g., GoDaddy, Namecheap, Cloudflare).
6. Wait for DNS propagation and click **Verify** on Resend.
7. Once verified, you can send emails from any address on that domain (e.g., `orders@swerrv.shop`).

> [!NOTE]
> If you do not have a verified domain yet, Resend allows you to test using `onboarding@resend.dev` as the sender, but you can only send emails to your own registered account email address.

---

## 4. Local Configuration (`.env`)
The backend uses a local `.env` file to store sensitive keys securely. This file is ignored by Git.

1. Open the `.env` file in the root directory of your project:
   `c:\Users\User\Desktop\swervbackend\swerrv\.env`
2. Configure or edit the following environment variables:

```properties
# Resend Email Configuration
RESEND_API_KEY=your_actual_resend_api_key_here
RESEND_FROM_EMAIL=orders@swerrv.shop
```

Replace `your_actual_resend_api_key_here` with the API key you copied from the Resend dashboard.

---

## 5. Production/Deployment Configuration
When deploying your application to hosting platforms (e.g. Railway, Render, AWS, Heroku), **do not upload your `.env` file**. Instead, configure these values as Environment Variables in your hosting dashboard:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `RESEND_API_KEY` | Your Resend API key starting with `re_...` | `re_URmmucX6_12MrZQm...` |
| `RESEND_FROM_EMAIL` | Verified sender address | `orders@swerrv.shop` |

---

## 6. How the Backend Resolves Configurations

We have successfully decoupled your Resend API configuration from your Java source code and application properties files.

1. **`EmailService.java`** reads the values from Spring's application properties:
   ```java
   @Value("${resend.api.key}")
   private String apiKey;

   @Value("${swerrv.mail.from}")
   private String fromEmail;
   ```

2. **`application.properties`** maps these fields directly to environment variables:
   ```properties
   resend.api.key=${RESEND_API_KEY}
   swerrv.mail.from=${RESEND_FROM_EMAIL:orders@swerrv.shop}
   ```

This architecture keeps your application highly secure and ready for clean, zero-configuration cloud deployments!

# Atlas Email Templates - Scorpion Branded

Copy each template into **Supabase Dashboard → Authentication → Email Templates**

## Brand Colors Used
| Color | Hex | Usage |
|-------|-----|-------|
| Scorpion Blue | #007FFD | Primary CTA buttons |
| Dark Background | #0a0a0f | Email body background |
| Card Background | #111118 | Content card |
| Border | #1e1e2e | Subtle borders |
| White | #FFFFFF | Headlines |
| Light Gray | #a1a1aa | Body text |
| Muted | #52525b | Footer text |

---

## 1. Confirm Signup

**Subject:** `Welcome to Atlas - Confirm your email`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0f;">
    <tr>
      <td align="center" style="padding: 48px 24px;">

        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #111118; border-radius: 16px; border: 1px solid #1e1e2e; overflow: hidden;">

          <!-- Blue Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: #007FFD;"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px 40px;">

              <!-- Logo -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td>
                    <span style="font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">ATLAS</span>
                    <span style="display: inline-block; margin-left: 10px; padding: 4px 10px; background: #007FFD; border-radius: 4px; font-size: 10px; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 1px;">Prompt Library</span>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                Confirm your email
              </h1>

              <!-- Body -->
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.7; color: #a1a1aa;">
                You're one step away from accessing proven prompts that will transform your SEO workflow. Click below to confirm your email and join your team on Atlas.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="border-radius: 8px; background: #007FFD;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Confirm Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Link fallback -->
              <p style="margin: 0; font-size: 13px; color: #52525b;">
                Or copy this link:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #007FFD; word-break: break-all; text-decoration: none;">{{ .ConfirmationURL }}</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background: #0a0a0f; border-top: 1px solid #1e1e2e;">
              <p style="margin: 0; font-size: 13px; color: #52525b; line-height: 1.6;">
                This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>

        <!-- Bottom Branding -->
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
          <tr>
            <td align="center">
              <p style="margin: 0; font-size: 12px; color: #3f3f46;">
                Powered by Scorpion
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 2. Invite User

**Subject:** `You've been invited to Atlas`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're invited</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0f;">
    <tr>
      <td align="center" style="padding: 48px 24px;">

        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #111118; border-radius: 16px; border: 1px solid #1e1e2e; overflow: hidden;">

          <!-- Blue Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: #007FFD;"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px 40px;">

              <!-- Logo -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td>
                    <span style="font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">ATLAS</span>
                    <span style="display: inline-block; margin-left: 10px; padding: 4px 10px; background: #007FFD; border-radius: 4px; font-size: 10px; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 1px;">Prompt Library</span>
                  </td>
                </tr>
              </table>

              <!-- Badge -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="background: rgba(0, 127, 253, 0.1); border: 1px solid rgba(0, 127, 253, 0.3); border-radius: 20px; padding: 6px 14px;">
                    <span style="color: #007FFD; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">You're Invited</span>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                Your team is waiting
              </h1>

              <!-- Body -->
              <p style="margin: 0 0 28px; font-size: 16px; line-height: 1.7; color: #a1a1aa;">
                You've been invited to join Atlas — the prompt library that helps your team produce consistently excellent AI outputs. Accept your invitation to get started.
              </p>

              <!-- Feature List -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 32px; width: 100%;">
                <tr>
                  <td style="padding: 20px; background: #0a0a0f; border-radius: 10px; border: 1px solid #1e1e2e;">
                    <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="color: #007FFD; font-size: 16px; font-weight: 600;">+</span>
                          <span style="color: #e4e4e7; font-size: 14px; margin-left: 12px;">18+ curated prompts ready to use</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="color: #007FFD; font-size: 16px; font-weight: 600;">+</span>
                          <span style="color: #e4e4e7; font-size: 14px; margin-left: 12px;">Variable injection for personalization</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="color: #007FFD; font-size: 16px; font-weight: 600;">+</span>
                          <span style="color: #e4e4e7; font-size: 14px; margin-left: 12px;">Team-powered quality ratings</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="border-radius: 8px; background: #007FFD;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Link fallback -->
              <p style="margin: 0; font-size: 13px; color: #52525b;">
                Or copy this link:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #007FFD; word-break: break-all; text-decoration: none;">{{ .ConfirmationURL }}</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background: #0a0a0f; border-top: 1px solid #1e1e2e;">
              <p style="margin: 0; font-size: 13px; color: #52525b; line-height: 1.6;">
                This invitation expires in 7 days. If you weren't expecting this, you can safely ignore it.
              </p>
            </td>
          </tr>

        </table>

        <!-- Bottom Branding -->
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
          <tr>
            <td align="center">
              <p style="margin: 0; font-size: 12px; color: #3f3f46;">
                Powered by Scorpion
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 3. Magic Link

**Subject:** `Your Atlas login link`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to Atlas</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0f;">
    <tr>
      <td align="center" style="padding: 48px 24px;">

        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #111118; border-radius: 16px; border: 1px solid #1e1e2e; overflow: hidden;">

          <!-- Blue Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: #007FFD;"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px 40px;">

              <!-- Logo -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td>
                    <span style="font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">ATLAS</span>
                    <span style="display: inline-block; margin-left: 10px; padding: 4px 10px; background: #007FFD; border-radius: 4px; font-size: 10px; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 1px;">Prompt Library</span>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                Sign in to Atlas
              </h1>

              <!-- Body -->
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.7; color: #a1a1aa;">
                Click the button below to securely sign in. No password needed — this link will log you in automatically.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="border-radius: 8px; background: #007FFD;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Sign In to Atlas
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 28px; width: 100%;">
                <tr>
                  <td style="padding: 14px 16px; background: rgba(0, 127, 253, 0.05); border-radius: 8px; border-left: 3px solid #007FFD;">
                    <p style="margin: 0; font-size: 13px; color: #a1a1aa;">
                      <strong style="color: #ffffff;">Security:</strong> This link expires in 1 hour and can only be used once.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Link fallback -->
              <p style="margin: 0; font-size: 13px; color: #52525b;">
                Or copy this link:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #007FFD; word-break: break-all; text-decoration: none;">{{ .ConfirmationURL }}</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background: #0a0a0f; border-top: 1px solid #1e1e2e;">
              <p style="margin: 0; font-size: 13px; color: #52525b; line-height: 1.6;">
                If you didn't request this login link, someone may have entered your email by mistake. You can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>

        <!-- Bottom Branding -->
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
          <tr>
            <td align="center">
              <p style="margin: 0; font-size: 12px; color: #3f3f46;">
                Powered by Scorpion
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 4. Reset Password

**Subject:** `Reset your Atlas password`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0f;">
    <tr>
      <td align="center" style="padding: 48px 24px;">

        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #111118; border-radius: 16px; border: 1px solid #1e1e2e; overflow: hidden;">

          <!-- Orange/Red Top Accent Bar for security -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #f59e0b 0%, #ef4444 100%);"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px 40px;">

              <!-- Logo -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td>
                    <span style="font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">ATLAS</span>
                    <span style="display: inline-block; margin-left: 10px; padding: 4px 10px; background: #007FFD; border-radius: 4px; font-size: 10px; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 1px;">Prompt Library</span>
                  </td>
                </tr>
              </table>

              <!-- Badge -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 20px; padding: 6px 14px;">
                    <span style="color: #f59e0b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Password Reset</span>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                Reset your password
              </h1>

              <!-- Body -->
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.7; color: #a1a1aa;">
                We received a request to reset your password. Click the button below to choose a new password for your Atlas account.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="border-radius: 8px; background: #007FFD;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 28px; width: 100%;">
                <tr>
                  <td style="padding: 14px 16px; background: rgba(239, 68, 68, 0.05); border-radius: 8px; border-left: 3px solid #ef4444;">
                    <p style="margin: 0; font-size: 13px; color: #a1a1aa;">
                      <strong style="color: #f87171;">Didn't request this?</strong> If you didn't ask to reset your password, please ignore this email. Your password won't change.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Link fallback -->
              <p style="margin: 0; font-size: 13px; color: #52525b;">
                Or copy this link:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #007FFD; word-break: break-all; text-decoration: none;">{{ .ConfirmationURL }}</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background: #0a0a0f; border-top: 1px solid #1e1e2e;">
              <p style="margin: 0; font-size: 13px; color: #52525b; line-height: 1.6;">
                This link expires in 1 hour for security. If you need help, contact your team administrator.
              </p>
            </td>
          </tr>

        </table>

        <!-- Bottom Branding -->
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
          <tr>
            <td align="center">
              <p style="margin: 0; font-size: 12px; color: #3f3f46;">
                Powered by Scorpion
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 5. Change Email Address

**Subject:** `Confirm your new email address`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm email change</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0f;">
    <tr>
      <td align="center" style="padding: 48px 24px;">

        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #111118; border-radius: 16px; border: 1px solid #1e1e2e; overflow: hidden;">

          <!-- Blue Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: #007FFD;"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px 40px;">

              <!-- Logo -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td>
                    <span style="font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">ATLAS</span>
                    <span style="display: inline-block; margin-left: 10px; padding: 4px 10px; background: #007FFD; border-radius: 4px; font-size: 10px; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 1px;">Prompt Library</span>
                  </td>
                </tr>
              </table>

              <!-- Badge -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="background: rgba(0, 127, 253, 0.1); border: 1px solid rgba(0, 127, 253, 0.3); border-radius: 20px; padding: 6px 14px;">
                    <span style="color: #007FFD; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email Change</span>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                Confirm your new email
              </h1>

              <!-- Body -->
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.7; color: #a1a1aa;">
                You requested to change your email address for your Atlas account. Click the button below to confirm this change.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="border-radius: 8px; background: #007FFD;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Confirm New Email
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info Notice -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 28px; width: 100%;">
                <tr>
                  <td style="padding: 14px 16px; background: rgba(0, 127, 253, 0.05); border-radius: 8px; border-left: 3px solid #007FFD;">
                    <p style="margin: 0; font-size: 13px; color: #a1a1aa;">
                      <strong style="color: #ffffff;">Note:</strong> After confirming, you'll use this new email to sign in to Atlas.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Link fallback -->
              <p style="margin: 0; font-size: 13px; color: #52525b;">
                Or copy this link:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #007FFD; word-break: break-all; text-decoration: none;">{{ .ConfirmationURL }}</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background: #0a0a0f; border-top: 1px solid #1e1e2e;">
              <p style="margin: 0; font-size: 13px; color: #52525b; line-height: 1.6;">
                If you didn't request this change, please contact your team administrator immediately.
              </p>
            </td>
          </tr>

        </table>

        <!-- Bottom Branding -->
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
          <tr>
            <td align="center">
              <p style="margin: 0; font-size: 12px; color: #3f3f46;">
                Powered by Scorpion
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
```

---

## How to Apply

1. **Supabase Dashboard** → **Authentication** → **Email Templates**
2. For each email type, update:
   - **Subject** line
   - **Body** (paste HTML)
3. Click **Save**

## Design Notes

- **Scorpion Blue (#007FFD)** - Primary brand color for CTAs
- **Dark theme** - Matches Scorpion's website aesthetic
- **Clean typography** - Professional, easy to read
- **Consistent layout** - Logo → Badge → Heading → Body → CTA → Footer
- **Security context** - Password reset uses amber/red accent to signal caution

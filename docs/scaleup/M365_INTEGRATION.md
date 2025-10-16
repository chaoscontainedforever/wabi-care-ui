# Wabi Care: Microsoft 365 Integration Guide

**Version**: 1.0  
**Date**: October 16, 2025  
**Owner**: Product & Engineering Team  
**Status**: Draft

---

## Executive Summary

This document details Wabi Care's deep integration with Microsoft 365 ecosystem, which serves as our primary competitive differentiator. **85% of ABA clinics and school districts already use Microsoft 365**, making native integration the fastest path to adoption.

**Key Insight**: Competitors treat Microsoft integration as an afterthought. Wabi Care makes it central to the product experience.

---

## Table of Contents

1. [Strategic Value](#strategic-value)
2. [Integration Architecture](#integration-architecture)
3. [Microsoft Teams Integration](#microsoft-teams-integration)
4. [Outlook Calendar Integration](#outlook-calendar-integration)
5. [OneDrive & SharePoint Integration](#onedrive--sharepoint-integration)
6. [Azure AD Single Sign-On](#azure-ad-single-sign-on)
7. [Power BI Embedded](#power-bi-embedded)
8. [Additional Integrations](#additional-integrations)
9. [Implementation Plan](#implementation-plan)
10. [Pricing & Packaging](#pricing--packaging)

---

## Strategic Value

### Why Microsoft 365 Integration is Our Moat

| Benefit | Impact | Competitive Advantage |
|---------|--------|----------------------|
| **Zero Adoption Friction** | Staff already know Teams/Outlook | Reduce training time from 5 hours → 30 minutes |
| **Easier Procurement** | IT already trusts Microsoft | Shorten sales cycle from 60 → 30 days |
| **Cost Savings** | Use existing OneDrive storage | Eliminate duplicate storage costs ($50/month saved) |
| **Single Vendor** | Microsoft + Wabi Care (on Azure) | Simplify vendor management for IT |
| **Network Effects** | Integrates with other M365 apps | More valuable as clinic uses more M365 tools |

### Market Opportunity

- **85%** of ABA clinics use Microsoft 365
- **62%** of school districts mandate Microsoft 365
- **$0** additional cost for users (no new licenses needed)
- **"Built for Microsoft 365"** badge increases conversion by 40% (Microsoft partner data)

---

## Integration Architecture

### High-Level Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Microsoft 365 Tenant                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │  Azure   │ │  Teams   │ │ Outlook  │ │ OneDrive │     │
│  │   AD     │ │          │ │ Calendar │ │SharePoint│     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└────────────────────────────────────────────────────────────┘
      │              │              │              │
      │              │              │              │
      ▼              ▼              ▼              ▼
┌────────────────────────────────────────────────────────────┐
│           Microsoft Graph API (Single API Layer)           │
│  /users, /calendar, /teams, /drive, /me/messages          │
└────────────────────────────────────────────────────────────┘
      │
      ▼ OAuth 2.0 + Delegated/Application Permissions
┌────────────────────────────────────────────────────────────┐
│              Wabi Care Integration Service                 │
│  - Token management                                        │
│  - Webhook handling                                        │
│  - Data synchronization                                    │
└────────────────────────────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────────────────────────────┐
│                   Wabi Care Microservices                  │
│  Auth Service | Patient Service | Scheduling Service       │
└────────────────────────────────────────────────────────────┘
```

### Microsoft Graph API Permissions Required

| Permission | Type | Scope | Use Case |
|------------|------|-------|----------|
| **User.Read** | Delegated | Read user profile | SSO, display name |
| **Calendars.ReadWrite** | Delegated | Manage user calendar | Outlook sync |
| **Files.ReadWrite.All** | Delegated | Access OneDrive files | Document storage |
| **ChannelMessage.Send** | Application | Post to Teams channels | Notifications |
| **User.ReadBasic.All** | Application | Read all users | Staff lookup |
| **Group.Read.All** | Application | Read groups | RBAC mapping |

**Security Note**: Use least-privilege principle. Request only necessary permissions.

---

## Microsoft Teams Integration

### Use Cases

1. **Real-Time Notifications**: Session completed, claim denied, patient at-risk
2. **Collaborative Case Discussions**: BCBA creates patient-specific channel
3. **AI-Generated Reports**: Post progress notes to Teams
4. **Command Bot**: "@WabiCare schedule Sarah for 3x/week"

---

### 1. Post Session Notifications to Teams Channel

**User Story**: As a BCBA, I want to receive Teams notifications when therapists complete sessions so I can review data immediately.

**Technical Implementation:**

```typescript
import { Client } from '@microsoft/microsoft-graph-client';
import { AdaptiveCards } from 'adaptivecards';

async function postSessionNotificationToTeams(session: Session) {
  // 1. Initialize Microsoft Graph client
  const client = Client.init({
    authProvider: async (done) => {
      const token = await getServiceToken(); // Service-to-service auth
      done(null, token);
    }
  });
  
  // 2. Prepare adaptive card
  const card = {
    type: 'message',
    attachments: [{
      contentType: 'application/vnd.microsoft.card.adaptive',
      content: {
        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
        type: 'AdaptiveCard',
        version: '1.4',
        body: [
          {
            type: 'TextBlock',
            text: '📊 New Session Data Available',
            weight: 'bolder',
            size: 'large'
          },
          {
            type: 'FactSet',
            facts: [
              { title: 'Patient', value: session.patientName },
              { title: 'Therapist', value: session.therapistName },
              { title: 'Goal', value: session.goalName },
              { title: 'Accuracy', value: `${session.accuracy}%` },
              { title: 'Duration', value: `${session.duration} min` },
              { title: 'Date', value: new Date(session.startTime).toLocaleDateString() }
            ]
          },
          {
            type: 'TextBlock',
            text: session.sessionNotes,
            wrap: true,
            isSubtle: true
          }
        ],
        actions: [
          {
            type: 'Action.OpenUrl',
            title: 'View Full Session',
            url: `https://app.wabicare.com/sessions/${session.id}`
          },
          {
            type: 'Action.OpenUrl',
            title: 'View Patient Dashboard',
            url: `https://app.wabicare.com/patients/${session.patientId}`
          }
        ]
      }
    }]
  };
  
  // 3. Post to Teams channel
  const teamId = await getTeamId(session.practiceId);
  const channelId = await getChannelId(teamId, 'Clinical Updates');
  
  await client
    .api(`/teams/${teamId}/channels/${channelId}/messages`)
    .post(card);
}

// Get service token (application permission)
async function getServiceToken(): Promise<string> {
  const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID,
    process.env.AZURE_CLIENT_ID,
    process.env.AZURE_CLIENT_SECRET
  );
  
  const token = await credential.getToken('https://graph.microsoft.com/.default');
  return token.token;
}
```

**Result**: BCBA sees this in Teams:

```
┌─────────────────────────────────────────┐
│ 📊 New Session Data Available           │
├─────────────────────────────────────────┤
│ Patient:   Sarah Johnson                │
│ Therapist: Rachel Smith (RBT)           │
│ Goal:      Identify Colors              │
│ Accuracy:  90%                           │
│ Duration:  45 min                        │
│ Date:      10/20/2024                    │
│                                          │
│ Sarah was very engaged today. Used      │
│ physical prompts twice for "purple".    │
│                                          │
│ [View Full Session]  [View Dashboard]   │
└─────────────────────────────────────────┘
```

---

### 2. Teams Bot for Commands

**User Story**: As a practice admin, I want to type "@WabiCare schedule Sarah for Mon/Wed/Fri at 2pm" in Teams to quickly create appointments.

**Technical Implementation:**

```typescript
import { TeamsActivityHandler, TurnContext } from 'botbuilder';
import { BotFrameworkAdapter } from 'botbuilder';

class WabiCareBot extends TeamsActivityHandler {
  constructor() {
    super();
    
    // Handle @mentions
    this.onMessage(async (context, next) => {
      const text = context.activity.text.trim();
      
      // Parse command: "@WabiCare schedule Sarah for Mon/Wed/Fri at 2pm"
      const scheduleMatch = text.match(/schedule (\w+) for (.+)/i);
      
      if (scheduleMatch) {
        const patientName = scheduleMatch[1];
        const schedule = scheduleMatch[2];
        
        // Call Wabi Care API
        const result = await schedulePatient(patientName, schedule);
        
        // Reply
        await context.sendActivity({
          type: 'message',
          text: `✅ Scheduled ${patientName} for ${result.sessions.length} sessions`,
          attachments: [createAppointmentCard(result)]
        });
      }
      
      await next();
    });
  }
}

// Bot endpoint
app.post('/api/messages', async (req, res) => {
  await adapter.processActivity(req, res, async (context) => {
    await bot.run(context);
  });
});
```

---

### 3. Proactive Messages to Users

**Use Case**: Alert specific therapist about authorization expiring

```typescript
async function sendProactiveMessage(userId: string, message: string) {
  const conversationReference = await getConversationReference(userId);
  
  await adapter.continueConversation(conversationReference, async (context) => {
    await context.sendActivity({
      type: 'message',
      text: message,
      attachments: [{
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          type: 'AdaptiveCard',
          body: [
            {
              type: 'TextBlock',
              text: '⚠️ Authorization Expiring',
              weight: 'bolder',
              color: 'warning'
            },
            {
              type: 'TextBlock',
              text: `Sarah Johnson's authorization expires in 5 days. Update now to avoid billing disruption.`,
              wrap: true
            }
          ],
          actions: [
            {
              type: 'Action.OpenUrl',
              title: 'Update Authorization',
              url: `https://app.wabicare.com/patients/sarah-johnson/insurance`
            }
          ]
        }
      }]
    });
  });
}
```

---

## Outlook Calendar Integration

### Use Cases

1. **Two-Way Sync**: Wabi Care appointments ↔ Outlook calendar
2. **Conflict Detection**: Check therapist availability before scheduling
3. **Automatic Reminders**: Outlook sends email/push notifications
4. **iCal Export**: Parents can subscribe to appointment feed

---

### 1. Create Appointment in Outlook

**User Story**: When admin schedules a session in Wabi Care, it appears in therapist's Outlook calendar automatically.

**Technical Implementation:**

```typescript
async function syncAppointmentToOutlook(appointment: Appointment) {
  const client = Client.init({ authProvider });
  
  // Create event in therapist's calendar
  const event = {
    subject: `ABA Session: ${appointment.patientName}`,
    body: {
      contentType: 'HTML',
      content: `
        <h3>Session Details</h3>
        <p><strong>Patient:</strong> ${appointment.patientName}</p>
        <p><strong>Goal:</strong> ${appointment.goalName}</p>
        <p><strong>Location:</strong> ${appointment.location}</p>
        <hr/>
        <p><a href="${appointment.wabiCareLink}">Open in Wabi Care</a></p>
      `
    },
    start: {
      dateTime: appointment.startTime,
      timeZone: appointment.timezone
    },
    end: {
      dateTime: appointment.endTime,
      timeZone: appointment.timezone
    },
    location: {
      displayName: appointment.location,
      address: {
        street: appointment.address.street,
        city: appointment.address.city,
        state: appointment.address.state,
        postalCode: appointment.address.zip
      }
    },
    attendees: [
      {
        emailAddress: {
          address: appointment.parentEmail,
          name: appointment.parentName
        },
        type: 'optional'
      }
    ],
    isReminderOn: true,
    reminderMinutesBeforeStart: 60,
    categories: ['Wabi Care', 'ABA Session'],
    showAs: 'busy',
    sensitivity: 'private' // HIPAA: Mark as private
  };
  
  const createdEvent = await client
    .api(`/users/${appointment.therapistEmail}/calendar/events`)
    .post(event);
  
  // Save event ID for two-way sync
  await db.appointments.update(appointment.id, {
    outlookEventId: createdEvent.id,
    syncStatus: 'synced'
  });
  
  return createdEvent;
}
```

---

### 2. Two-Way Sync via Webhooks

**Scenario**: Therapist updates appointment time in Outlook → Wabi Care updates automatically

**Setup Webhook Subscription:**

```typescript
async function subscribeToCalendarChanges(therapistEmail: string) {
  const client = Client.init({ authProvider });
  
  const subscription = {
    changeType: 'updated,deleted',
    notificationUrl: 'https://api.wabicare.com/webhooks/outlook/calendar',
    resource: `/users/${therapistEmail}/calendar/events`,
    expirationDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
    clientState: 'wabicare-secret-token' // For validation
  };
  
  const createdSubscription = await client
    .api('/subscriptions')
    .post(subscription);
  
  // Save subscription ID
  await db.therapists.update({ email: therapistEmail }, {
    outlookSubscriptionId: createdSubscription.id
  });
}

// Webhook handler
app.post('/webhooks/outlook/calendar', async (req, res) => {
  // 1. Validate webhook
  if (req.query.validationToken) {
    // Initial validation request
    return res.send(req.query.validationToken);
  }
  
  // 2. Verify client state
  const notifications = req.body.value;
  for (const notification of notifications) {
    if (notification.clientState !== 'wabicare-secret-token') {
      return res.status(401).send('Invalid client state');
    }
    
    // 3. Handle change
    if (notification.changeType === 'updated') {
      await handleOutlookEventUpdated(notification);
    } else if (notification.changeType === 'deleted') {
      await handleOutlookEventDeleted(notification);
    }
  }
  
  res.status(202).send(); // Acknowledge
});

async function handleOutlookEventUpdated(notification) {
  // Fetch updated event
  const event = await graphClient
    .api(`/users/${notification.resourceData.id}/events/${notification.resourceData.id}`)
    .get();
  
  // Find corresponding Wabi Care appointment
  const appointment = await db.appointments.findOne({
    outlookEventId: event.id
  });
  
  if (appointment) {
    // Update Wabi Care appointment
    await db.appointments.update(appointment.id, {
      startTime: event.start.dateTime,
      endTime: event.end.dateTime,
      location: event.location.displayName,
      syncStatus: 'synced',
      lastSyncedAt: new Date()
    });
    
    // Notify admin
    await sendNotification(appointment.practiceId, {
      type: 'appointment_updated',
      message: `Therapist updated appointment for ${appointment.patientName}`
    });
  }
}
```

---

### 3. Conflict Detection

**User Story**: Before scheduling, check if therapist is already booked.

**Technical Implementation:**

```typescript
async function checkTherapistAvailability(
  therapistEmail: string,
  startTime: string,
  endTime: string
): Promise<{ available: boolean; conflicts: Event[] }> {
  
  const client = Client.init({ authProvider });
  
  // Query Outlook calendar for events in time range
  const response = await client
    .api(`/users/${therapistEmail}/calendar/calendarView`)
    .query({
      startDateTime: startTime,
      endDateTime: endTime
    })
    .select('subject,start,end,showAs')
    .get();
  
  const conflicts = response.value.filter((event: any) => 
    event.showAs !== 'free' // Exclude "free" time blocks
  );
  
  return {
    available: conflicts.length === 0,
    conflicts
  };
}

// Usage in scheduling API
app.post('/schedules/appointments', async (req, res) => {
  const { therapistEmail, startTime, endTime } = req.body;
  
  // Check availability
  const availability = await checkTherapistAvailability(
    therapistEmail,
    startTime,
    endTime
  );
  
  if (!availability.available) {
    return res.status(409).json({
      error: {
        code: 'THERAPIST_NOT_AVAILABLE',
        message: `Therapist has ${availability.conflicts.length} conflict(s)`,
        conflicts: availability.conflicts.map(c => ({
          subject: c.subject,
          start: c.start.dateTime,
          end: c.end.dateTime
        }))
      }
    });
  }
  
  // Proceed with scheduling
  // ...
});
```

---

## OneDrive & SharePoint Integration

### Use Cases

1. **Document Storage**: IEPs, assessments, progress reports
2. **Automatic Organization**: Create folder structure per patient
3. **Shareable Links**: Generate secure links for parents
4. **Version Control**: OneDrive tracks document versions

---

### 1. Save Progress Report to OneDrive

**User Story**: When BCBA generates a progress report, save it to patient's OneDrive folder automatically.

**Technical Implementation:**

```typescript
async function saveReportToOneDrive(
  practiceId: string,
  patientId: string,
  reportPdf: Buffer,
  reportName: string
) {
  const client = Client.init({ authProvider });
  
  // Get practice's OneDrive (or shared drive)
  const driveId = await getDriveId(practiceId);
  
  // Create patient folder if doesn't exist
  const patientFolder = await ensurePatientFolder(driveId, patientId);
  
  // Upload file
  const uploadResponse = await client
    .api(`/drives/${driveId}/items/${patientFolder.id}:/${reportName}.pdf:/content`)
    .put(reportPdf);
  
  // Create shareable link
  const shareLink = await client
    .api(`/drives/${driveId}/items/${uploadResponse.id}/createLink`)
    .post({
      type: 'view',
      scope: 'organization', // Only people in same organization
      expirationDateTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    });
  
  // Save link in Wabi Care
  await db.documents.create({
    patientId,
    documentType: 'progress-report',
    fileName: `${reportName}.pdf`,
    oneDriveItemId: uploadResponse.id,
    shareLink: shareLink.link.webUrl,
    createdAt: new Date()
  });
  
  return {
    oneDriveUrl: uploadResponse.webUrl,
    shareLink: shareLink.link.webUrl
  };
}

// Ensure folder structure: /Patients/{PatientName}/Reports/
async function ensurePatientFolder(driveId: string, patientId: string) {
  const patient = await db.patients.findOne(patientId);
  const folderName = `${patient.firstName}-${patient.lastName}`;
  
  // Check if folder exists
  let folder = await client
    .api(`/drives/${driveId}/root:/Patients/${folderName}`)
    .get()
    .catch(() => null);
  
  if (!folder) {
    // Create folder
    folder = await client
      .api(`/drives/${driveId}/root:/Patients`)
      .post({
        name: folderName,
        folder: {},
        '@microsoft.graph.conflictBehavior': 'rename'
      });
    
    // Create subfolders
    await Promise.all([
      createSubfolder(driveId, folder.id, 'IEPs'),
      createSubfolder(driveId, folder.id, 'Progress Reports'),
      createSubfolder(driveId, folder.id, 'Assessments'),
      createSubfolder(driveId, folder.id, 'Parent Communication')
    ]);
  }
  
  return folder;
}
```

---

### 2. SharePoint Document Library

**Use Case**: Clinic-wide document library for templates, policies

```typescript
async function createSharedDocumentLibrary(practiceId: string) {
  const client = Client.init({ authProvider });
  
  // Get SharePoint site
  const siteId = await getSiteId(practiceId);
  
  // Create document library
  const library = await client
    .api(`/sites/${siteId}/lists`)
    .post({
      displayName: 'Wabi Care Documents',
      list: {
        template: 'documentLibrary'
      }
    });
  
  // Create folder structure
  const folders = [
    'Goal Bank Templates',
    'IEP Templates',
    'Assessment Forms',
    'Training Materials',
    'Policies & Procedures'
  ];
  
  for (const folder of folders) {
    await client
      .api(`/sites/${siteId}/lists/${library.id}/items`)
      .post({
        fields: {
          Title: folder,
          ContentType: 'Folder'
        }
      });
  }
  
  return library;
}
```

---

## Azure AD Single Sign-On

### Benefits

1. **One Login**: Use work email for Wabi Care
2. **Automatic Provisioning**: New employees auto-added
3. **Centralized Access Control**: IT manages all accounts
4. **MFA Enforcement**: Clinic's MFA policy applies

---

### Technical Implementation

**1. Azure AD App Registration:**

```bash
# Azure CLI
az ad app create \
  --display-name "Wabi Care" \
  --sign-in-audience "AzureADMyOrg" \
  --web-redirect-uris "https://app.wabicare.com/auth/callback" \
  --required-resource-accesses @manifest.json
```

**2. Next.js Authentication (next-auth):**

```typescript
// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';

export default NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: 'openid profile email User.Read Calendars.ReadWrite Files.ReadWrite.All offline_access'
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Auto-provision user in Wabi Care
      const existingUser = await db.users.findOne({ email: user.email });
      
      if (!existingUser) {
        // Create new user
        const role = mapAzureGroupToRole(profile.groups); // Map Azure AD groups to Wabi Care roles
        
        await db.users.create({
          id: user.id,
          email: user.email,
          azureAdOid: profile.oid,
          firstName: profile.given_name,
          lastName: profile.family_name,
          role,
          practiceId: await getPracticeId(profile.tid), // Map tenant ID to practice
          createdAt: new Date()
        });
      }
      
      return true;
    },
    
    async jwt({ token, account }) {
      // Attach access token for Microsoft Graph API calls
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Attach user role and access token
      const user = await db.users.findOne({ email: session.user.email });
      
      session.user.role = user.role;
      session.user.practiceId = user.practiceId;
      session.accessToken = token.accessToken;
      
      return session;
    }
  }
});

// Map Azure AD groups to Wabi Care roles
function mapAzureGroupToRole(groups: string[]): string {
  if (groups.includes('WabiCare-Admins')) return 'admin';
  if (groups.includes('WabiCare-BCBAs')) return 'bcba';
  if (groups.includes('WabiCare-RBTs')) return 'rbt';
  if (groups.includes('WabiCare-Billing')) return 'biller';
  return 'rbt'; // Default
}
```

**3. Protected Page Example:**

```typescript
// pages/patients/index.tsx
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false
      }
    };
  }
  
  // Check role
  if (session.user.role !== 'admin' && session.user.role !== 'bcba') {
    return {
      redirect: {
        destination: '/unauthorized',
        permanent: false
      }
    };
  }
  
  return {
    props: { session }
  };
}
```

---

## Power BI Embedded

### Use Cases

1. **Practice Dashboards**: Embedded in Wabi Care
2. **Custom Reports**: IT team builds reports with Power BI Desktop
3. **OData Feed**: Wabi Care exposes data for Power BI

---

### Technical Implementation

**1. Embed Power BI Report:**

```typescript
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

function AnalyticsDashboard() {
  const [embedConfig, setEmbedConfig] = useState(null);
  
  useEffect(() => {
    // Fetch embed token from backend
    fetch('/api/powerbi/embed-token')
      .then(res => res.json())
      .then(data => {
        setEmbedConfig({
          type: 'report',
          id: data.reportId,
          embedUrl: data.embedUrl,
          accessToken: data.accessToken,
          tokenType: models.TokenType.Embed,
          settings: {
            panes: {
              filters: { visible: false },
              pageNavigation: { visible: true }
            },
            background: models.BackgroundType.Transparent
          }
        });
      });
  }, []);
  
  if (!embedConfig) return <div>Loading...</div>;
  
  return (
    <div className="powerbi-container">
      <PowerBIEmbed
        embedConfig={embedConfig}
        cssClassName="powerbi-report"
      />
    </div>
  );
}
```

**2. Generate Embed Token (Backend):**

```typescript
import { PowerBIClient } from '@azure/powerbi-client';
import { ClientSecretCredential } from '@azure/identity';

async function generateEmbedToken(userId: string, reportId: string) {
  const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID,
    process.env.AZURE_CLIENT_ID,
    process.env.AZURE_CLIENT_SECRET
  );
  
  const client = new PowerBIClient(credential);
  
  // Generate embed token with RLS (Row-Level Security)
  const embedToken = await client.reports.generateToken(reportId, {
    accessLevel: 'View',
    identities: [
      {
        username: userId,
        roles: ['Clinic'], // RLS role
        datasets: [datasetId]
      }
    ]
  });
  
  return {
    reportId,
    embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}`,
    accessToken: embedToken.token,
    expiresAt: embedToken.expiration
  };
}
```

---

## Additional Integrations

### Microsoft Planner

**Use Case**: Task management for therapists

```typescript
async function createTaskForTherapist(therapistId: string, task: string, dueDate: string) {
  const client = Client.init({ authProvider });
  
  await client
    .api('/planner/tasks')
    .post({
      planId: clinicPlanId,
      bucketId: therapistBucketId,
      title: task,
      assignments: {
        [therapistId]: {
          '@odata.type': 'microsoft.graph.plannerAssignment',
          orderHint: ' !'
        }
      },
      dueDateTime: dueDate,
      priority: 5
    });
}
```

### Microsoft Forms

**Use Case**: Parent satisfaction surveys

```typescript
async function createParentSurvey(patientId: string) {
  const form = await client
    .api('/me/drive/items/root/children')
    .post({
      name: `Parent Survey - ${patientName}`,
      form: {
        title: 'Parent Satisfaction Survey',
        sections: [
          {
            questions: [
              {
                title: 'How satisfied are you with your child\'s progress?',
                questionType: 'rating',
                ratingScale: { min: 1, max: 5 }
              },
              {
                title: 'How would you rate communication with your therapist?',
                questionType: 'rating',
                ratingScale: { min: 1, max: 5 }
              }
            ]
          }
        ]
      }
    });
  
  // Auto-import responses to Wabi Care
  await subscribeToFormResponses(form.id, patientId);
  
  return form.webUrl;
}
```

---

## Implementation Plan

### Phase 1: MVP (Weeks 1-2)

**Priority**: P0 integrations for immediate value

| Integration | Effort | Value |
|-------------|--------|-------|
| **Azure AD SSO** | 3 days | High (zero friction login) |
| **Teams Notifications** | 2 days | High (visible daily) |
| **OneDrive Save** | 2 days | Medium (reduces manual uploads) |

**Deliverable**: Staff can log in with work email, receive Teams notifications, save reports to OneDrive.

---

### Phase 2: Operational (Weeks 3-4)

**Priority**: P1 integrations for scheduling workflow

| Integration | Effort | Value |
|-------------|--------|-------|
| **Outlook Calendar Sync** | 5 days | High (eliminates double entry) |
| **Conflict Detection** | 2 days | High (prevents scheduling errors) |
| **SharePoint Folders** | 3 days | Medium (better organization) |

**Deliverable**: Full two-way calendar sync, automatic conflict detection.

---

### Phase 3: Advanced (Weeks 5-6)

**Priority**: P2 integrations for power users

| Integration | Effort | Value |
|-------------|--------|-------|
| **Power BI Embedded** | 4 days | Medium (custom dashboards) |
| **Teams Bot** | 5 days | Low (nice-to-have) |
| **Microsoft Planner** | 2 days | Low (task management) |

**Deliverable**: Embedded dashboards, command bot, task integration.

---

## Pricing & Packaging

### Microsoft 365 Integration Add-On

**Strategy**: Charge premium for M365 integrations to align value with cost.

| Tier | Price/User/Month | Included Integrations |
|------|------------------|----------------------|
| **Basic** | $0 (Free) | Azure AD SSO only |
| **Professional** | +$30 | SSO + Teams + Outlook + OneDrive |
| **Enterprise** | +$50 | All integrations + Power BI + Priority support |

**Rationale**:
- Free SSO removes barrier to entry
- $30/user for operational integrations (saves 5+ hours/month)
- $50/user for advanced features (Power BI access typically costs $10/user separately)

---

### Azure Marketplace Listing

**Benefit**: Clinics can purchase Wabi Care through existing Microsoft invoice.

**Requirements**:
1. List on Azure Marketplace
2. Support MACC (Microsoft Azure Consumption Commitment)
3. Offer multi-year contracts (10% discount)

**Impact**: 40% faster procurement approval (Microsoft partner data)

---

## Appendix: Reference Documents

- [PRD (Product Requirements Document)](./PRD.md)
- [Functional Specification](./FUNCTIONAL_SPEC.md)
- [Technical Specification](./TECHNICAL_SPEC.md)
- [Microsoft Graph API Documentation](https://learn.microsoft.com/en-us/graph/)
- [Teams App Development](https://learn.microsoft.com/en-us/microsoftteams/platform/)

---

**Document History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2025-10-15 | Product Team | Initial draft |
| 1.0 | 2025-10-16 | Engineering Team | Added technical implementation details |


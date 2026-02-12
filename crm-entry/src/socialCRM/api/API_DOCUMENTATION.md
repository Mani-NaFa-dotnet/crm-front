# Social CRM API Documentation

Complete API integration for Facebook, Instagram, and LinkedIn social media management.

## 📁 API Structure

### Facebook APIs

#### Analytics
- `getFacebookPageAnalytics()` - GET /api/analytics/facebook/page

#### Capabilities  
- `getFacebookCapabilities()` - GET /api/facebook/capabilities

#### Forms
- `enableLeadForm(pageId, formId)` - POST /api/facebook/pages/{pageId}/forms/{formId}/enable
- `disableLeadForm(pageId, formId)` - POST /api/facebook/pages/{pageId}/forms/{formId}/disable

#### Leads
- `getLeadForms()` - GET /api/facebook/leads/forms
- `syncLeadForm(formId)` - POST /api/facebook/leads/forms/{formId}/sync
- `getLeads()` - GET /api/facebook/leads
- `updateLeadStatus(id, status)` - PUT /api/facebook/leads/{id}/status
- `assignLead(id, userId)` - PUT /api/facebook/leads/{id}/assign

#### Pages
- `getFacebookPages()` - GET /api/facebook/pages
- `selectPage(pageId)` - POST /api/facebook/pages/select
- `getAvailablePages()` - GET /api/facebook/pages/available
- `getActivePage()` - GET /api/facebook/pages/active
- `subscribePage(pageId)` - POST /api/facebook/pages/{pageId}/subscribe
- `unsubscribePage(pageId)` - POST /api/facebook/pages/{pageId}/unsubscribe

#### Posts
- `postTextToFacebook(data)` - POST /api/post/facebook/multi/text
- `postImageToFacebook(data)` - POST /api/post/facebook/multi/image
- `postVideoToFacebook(data)` - POST /api/post/facebook/multi/video

#### Post Analytics
- `getFacebookPosts()` - GET /api/analytics/facebook/posts
- `getTopFacebookPosts()` - GET /api/analytics/facebook/posts/top
- `getFacebookPostsOverview()` - GET /api/analytics/facebook/posts/overview
- `getFacebookEngagementTrend()` - GET /api/analytics/facebook/posts/engagement-trend
- `getBestTimeToPost()` - GET /api/analytics/facebook/posts/best-time
- `getBestDayToPost()` - GET /api/analytics/facebook/posts/best-day

#### Webhooks
- `getFacebookWebhooks()` - GET /api/webhooks/facebook
- `createFacebookWebhook(data)` - POST /api/webhooks/facebook

---

### Instagram APIs

#### Accounts
- `getInstagramAccounts()` - GET /api/instagram/accounts
- `activateInstagramAccount(instagramBusinessId)` - POST /api/instagram/accounts/{instagramBusinessId}/activate

#### Post Status
- `getInstagramPostStatus(creationId)` - GET /api/instagram/posts/{creationId}/status

---

### LinkedIn APIs

#### Organizations
- `getLinkedInOrgs()` - GET /api/linkedin/orgs
- `selectLinkedInOrg(orgId)` - POST /api/linkedin/orgs/select

#### Posts
- `createLinkedInPost(postData)` - POST /api/linkedin/post

#### Read
- `getLinkedInProfile()` - GET /api/linkedin/read/profile
- `getLinkedInPosts()` - GET /api/linkedin/read/posts
- `getLinkedInPostStats()` - GET /api/linkedin/read/post-stats

---

### Authentication

#### Social Auth
- `connectPlatform(platform)` - GET /api/auth/{platform}/connect
- Callback handled via: GET /api/auth/{platform}/callback

---

### Unified APIs

#### Multi-Platform Post
- `createUnifiedPost(formData)` - POST /api/post
  - Supports Facebook, Instagram, and LinkedIn
  - Supports Text, Image, and Video posts

#### Users
- `getUsers()` - GET /api/users

---

## 🚀 Usage Examples

### Connect Facebook
```javascript
import { connectPlatform } from './api/auth.api';

connectPlatform('facebook');
```

### Create Unified Post
```javascript
import api from './api/apiClient';

const formData = new FormData();
formData.append('Platforms', 'Facebook');
formData.append('Platforms', 'Instagram');
formData.append('TargetAccountIds', 'page-id-1');
formData.append('Type', 'Image');
formData.append('Content', 'Your post content');
formData.append('MediaFiles', imageFile);

const response = await api.post('/post', formData);
```

### Get Lead Forms
```javascript
import { getLeadForms } from './api/facebook.leads.api';

const forms = await getLeadForms();
```

---

## 📦 All API Files

1. `facebook.analytics.api.js`
2. `facebook.capabilities.api.js`
3. `facebook.forms.api.js`
4. `facebook.leads.api.js`
5. `facebook.pages.api.js`
6. `facebook.posts.api.js`
7. `facebook.post.analytics.api.js`
8. `facebook.multi.posts.api.js`
9. `facebook.webhooks.api.js`
10. `instagram.accounts.api.js`
11. `instagram.post.status.api.js`
12. `linkedin.orgs.api.js`
13. `linkedin.post.api.js`
14. `linkedin.read.api.js`
15. `auth.api.js`
16. `users.api.js`
17. `unified.post.api.js`
18. `apiClient.js` (Base configuration)

---

## 🔧 Configuration

Base URL: `https://crm.metagensoft.com/api`

All requests include:
- JWT Bearer token authentication
- withCredentials: true
- Automatic 401 redirect to login

---

## ✅ Status

All APIs implemented and ready to use!
- ✅ Facebook (Complete)
- ✅ Instagram (Complete)
- ✅ LinkedIn (Complete)
- ✅ Authentication (Complete)
- ✅ Unified Post (Complete)

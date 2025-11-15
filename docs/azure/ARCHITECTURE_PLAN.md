# Wabi Clinic Azure Hosting Architecture Plan

## Executive Summary

This document outlines the architecture and deployment plan for hosting the wabi-clinic Next.js application on Azure infrastructure. The plan follows a **DEV-first approach**, focusing on getting the development environment fully operational before proceeding to QA and PROD environments.

## Current State

- **Application**: Next.js 15.5.3 application
- **Current Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Not yet deployed to Azure
- **Infrastructure**: Terraform configurations ready for deployment

## Target Architecture

### Application Hosting

**Azure App Service (Linux)**
- Next.js application deployed as a Node.js app
- Environment-specific deployments (DEV, QA, PROD)
- VNet integrated (private subnet)
- Accessible only through Application Gateway
- Auto-scaling enabled

### Data Layer Migration

**From Supabase to Azure Cosmos DB**
- **SQL API**: Migrate relational data (patients, sessions, goals, billing)
- **Gremlin API**: Set up graph relationships for GraphRAG
- **Vector Search**: Use Cosmos DB native vector search for RAG

### Deployment Flow

```
Developer → GitHub → CI/CD Pipeline → Azure App Service
                                    ↓
                            Application Gateway (WAF)
                                    ↓
                            App Service (Private)
                                    ↓
                            Cosmos DB (Private Endpoint)
```

## Implementation Phases (DEV-First Approach)

### Phase 1: DEV Infrastructure Deployment (Priority - Week 1)
1. Deploy Terraform infrastructure for DEV environment only
2. Configure Application Gateway (DEV) with WAF in Detection mode
3. Set up Key Vault with secrets (DEV)
4. Configure monitoring and logging (DEV)
5. Verify network security and connectivity
6. Test Application Gateway → App Service → Cosmos DB flow

### Phase 2: DEV Code Preparation (Week 2)
1. **Option A**: Keep Supabase for DEV initially (recommended for speed)
   - Minimal code changes
   - Focus on infrastructure and deployment
   - Test deployment process
2. **Option B**: Replace Supabase client with Cosmos DB client
   - Implement Cosmos DB data access layer
   - Update all database queries
   - Test with sample data

### Phase 3: DEV Application Deployment (Week 2-3)
1. Build Next.js application for DEV
2. Deploy to DEV App Service (manual deployment initially)
3. Configure environment variables from Key Vault
4. Test application connectivity
5. Verify Application Gateway routing
6. Test core application functionality

### Phase 4: DEV Testing & Validation (Week 3-4)
1. End-to-end testing in DEV
2. Performance testing
3. Security validation
4. Fix issues and iterate
5. Document DEV deployment process
6. Validate network isolation

### Phase 5: DEV Stabilization (Week 4)
1. Optimize application performance
2. Fine-tune Cosmos DB queries (if migrated)
3. Set up basic CI/CD for DEV (GitHub Actions)
4. Create deployment runbook
5. Prepare for QA deployment

### Phase 6: QA Infrastructure & Deployment (After DEV is Stable)
1. Deploy Terraform infrastructure for QA
2. Configure Application Gateway (QA)
3. Set up monitoring (QA)
4. Deploy application to QA
5. Full testing in QA environment

### Phase 7: PROD Infrastructure & Deployment (After QA Validation)
1. Deploy Terraform infrastructure for PROD
2. Configure Application Gateway (PROD)
3. Set up monitoring and alerting (PROD)
4. Database migration (if not done in DEV)
5. DNS configuration
6. SSL certificate setup
7. Production deployment
8. Go-live support

## Code Changes Required

### 1. Database Client Migration

**Current**: `src/lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js'
```

**New**: `src/lib/cosmosdb.ts`
```typescript
import { CosmosClient } from '@azure/cosmos'
```

**Tasks**:
- Create Cosmos DB client wrapper
- Implement data access layer
- Update all database queries
- Add error handling and retry logic

**DEV Strategy**: Can keep Supabase initially to minimize changes

### 2. Authentication Migration

**Current**: Supabase Auth
**New**: Azure AD B2C or Azure AD

**Tasks**:
- Implement NextAuth.js with Azure AD provider
- Update authentication context
- Migrate user data
- Update session management

**DEV Strategy**: Can keep Supabase Auth initially, migrate later

### 3. Vector Search Implementation

**Tasks**:
- Implement vector embedding generation (Azure OpenAI)
- Store embeddings in Cosmos DB SQL API
- Implement similarity search queries
- Create RAG pipeline

**DEV Strategy**: Optional for initial DEV deployment

### 4. GraphRAG Implementation

**Tasks**:
- Set up Gremlin API client
- Create graph data model
- Implement graph traversal queries
- Build GraphRAG orchestration layer

**DEV Strategy**: Optional for initial DEV deployment

### 5. Environment Configuration

**Tasks**:
- Create environment-specific configuration files
- Update app settings to use Key Vault references
- Configure connection strings
- Set up feature flags

## Deployment Strategy (DEV-First)

### Phase 1: DEV - Direct Deployment (Recommended for Initial DEV)

**Method**: Deploy Next.js build directly to App Service

**Steps**:
1. Build Next.js application locally (`npm run build`)
2. Deploy build artifacts to DEV App Service via Azure CLI or Portal
3. Configure app settings from Key Vault
4. Start application
5. Test via Application Gateway

**Pros**:
- Simple and fast for DEV
- No container registry needed initially
- Quick iteration and testing
- Native App Service integration

**Cons**:
- Less control over runtime environment
- Manual deployment process

### Phase 2: DEV - Automated Deployment (After Initial Success)

**Method**: GitHub Actions workflow for DEV

**Steps**:
1. Create GitHub Actions workflow
2. Build on push to `develop` branch
3. Deploy automatically to DEV App Service
4. Run smoke tests
5. Notify on success/failure

### Phase 3: QA/PROD - Container Deployment (Later)

**Method**: Docker container deployed to App Service

**Steps**:
1. Create Dockerfile for Next.js
2. Build container image
3. Push to Azure Container Registry
4. Deploy container to App Service
5. Use deployment slots for blue-green

**Pros**:
- Consistent runtime environment
- Better control over dependencies
- Can test locally with same image
- Production-ready approach

**Cons**:
- More complex setup
- Requires Container Registry

## CI/CD Pipeline Architecture

### GitHub Actions Workflow

**Workflow Structure**:
1. **Build & Test**
   - Install dependencies
   - Run linting
   - Run unit tests
   - Build Next.js application
   - Run E2E tests (Playwright)

2. **Security Scanning**
   - Dependency vulnerability scanning
   - Code quality checks
   - Container scanning (if using containers)

3. **Deploy to DEV**
   - Automatic deployment on push to `develop` branch
   - Deploy to DEV App Service
   - Run smoke tests
   - Notify team

4. **Deploy to QA**
   - Manual trigger or on merge to `qa` branch
   - Deploy to QA App Service
   - Run integration tests
   - Performance testing

5. **Deploy to PROD**
   - Manual approval required
   - Deploy to PROD App Service
   - Health checks
   - Monitoring validation

### Deployment Methods

**Method 1: Azure App Service Deploy Action**
- Direct deployment from GitHub Actions
- Supports deployment slots for blue-green
- Automatic rollback on failure

**Method 2: Azure CLI**
- More control over deployment process
- Can script custom deployment steps
- Better for complex scenarios

## Database Migration Plan (DEV-First)

### DEV Migration Strategy

**Option A: Keep Supabase for DEV Initially (Recommended)**
- Use Supabase for DEV to minimize changes
- Set up Cosmos DB in parallel
- Test Cosmos DB with sample data
- Migrate when ready

**Option B: Migrate DEV to Cosmos DB**
- Export sample/test data from Supabase
- Transform for Cosmos DB
- Import to DEV Cosmos DB
- Switch DEV application to Cosmos DB
- Validate functionality

### DEV Data Strategy

**For Initial DEV Deployment:**
1. **Option 1**: Keep using Supabase (easiest, fastest)
   - No migration needed
   - Focus on infrastructure and deployment
   - Migrate database later

2. **Option 2**: Use Cosmos DB with sample data
   - Create sample data in Cosmos DB
   - Test application with Cosmos DB
   - Validate data access patterns

### QA/PROD Migration (After DEV is Stable)

**Approach**: Dual-write during migration period

1. **Phase 1**: Read from Supabase, write to both Supabase and Cosmos DB
2. **Phase 2**: Read from Cosmos DB, write to both (validate data)
3. **Phase 3**: Read and write only to Cosmos DB
4. **Phase 4**: Decommission Supabase

### Data Transformation

**Supabase (PostgreSQL) → Cosmos DB (SQL API)**

**Challenges**:
- Relational to document model
- Foreign keys to embedded documents or references
- Indexes and constraints

**Solution**:
- Create document models that embed related data
- Use reference documents for relationships
- Implement application-level referential integrity

### Migration Scripts

**Tools**:
- Custom Node.js scripts (for DEV and initial QA)
- Azure Data Factory (for large PROD datasets)
- Azure Functions (for real-time sync during migration)

## Application Configuration

### Environment Variables

**Required Variables** (stored in Key Vault):
- `COSMOSDB_ENDPOINT` - Cosmos DB endpoint (or `SUPABASE_URL` if keeping Supabase)
- `COSMOSDB_KEY` - Cosmos DB access key (or `SUPABASE_ANON_KEY` if keeping Supabase)
- `OPENAI_ENDPOINT` - Azure OpenAI endpoint
- `OPENAI_KEY` - Azure OpenAI key
- `COMMUNICATION_SERVICES_CONNECTION_STRING` - Email/SMS
- `AZURE_AD_CLIENT_ID` - Authentication (if migrating from Supabase Auth)
- `AZURE_AD_CLIENT_SECRET` - Authentication
- `AZURE_AD_TENANT_ID` - Authentication
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Session encryption

### App Service Configuration

**Build Configuration**:
- Build command: `npm run build`
- Output directory: `.next`
- Node version: 20-lts
- Startup command: `npm start`

**Scaling**:
- Auto-scale based on CPU/Memory
- Min instances: 1 (DEV), 2 (QA), 3 (PROD)
- Max instances: 3 (DEV), 10 (QA), 20 (PROD)

## Monitoring & Observability

### Application Insights Integration

**Metrics to Track**:
- Request rate and latency
- Error rates
- Database query performance
- AI service call latency
- User authentication events

**Custom Events**:
- RAG query performance
- GraphRAG traversal time
- Vector search latency
- Document ingestion events

### Logging Strategy

**Log Levels**:
- ERROR: Application errors, failed requests
- WARN: Performance issues, retries
- INFO: Business events, user actions
- DEBUG: Detailed tracing (DEV only)

**Log Retention**:
- DEV: 30 days
- QA: 90 days
- PROD: 7 years (HIPAA requirement)

## Security Considerations

### Application Security

1. **Secrets Management**
   - All secrets in Key Vault
   - App Service uses Managed Identity
   - No secrets in code or environment variables

2. **Network Security**
   - App Service in private subnet
   - Only accessible via Application Gateway
   - All database connections via private endpoints

3. **Authentication & Authorization**
   - Azure AD integration (or Supabase Auth for DEV)
   - Role-based access control (RBAC)
   - Session management with secure cookies

4. **Data Protection**
   - Encryption at rest (Cosmos DB)
   - Encryption in transit (TLS 1.3)
   - PHI data handling compliance

## Rollback Strategy

### Deployment Rollback

**Automatic Rollback Triggers**:
- Health check failures
- Error rate > 5%
- Response time > 5s (p95)

**Manual Rollback**:
- Deployment slots for blue-green deployment
- Quick rollback via Azure Portal or CLI
- Previous version always available

### Data Rollback

**Strategy**:
- Keep Supabase active during migration period
- Can switch back to Supabase if needed
- Cosmos DB backups for point-in-time recovery

## Testing Strategy

### Pre-Deployment Testing

1. **Unit Tests**
   - Test data access layer
   - Test business logic
   - Test API routes

2. **Integration Tests**
   - Test Cosmos DB operations
   - Test authentication flow
   - Test AI service integrations

3. **E2E Tests**
   - Playwright tests for critical user flows
   - Test RAG functionality
   - Test GraphRAG queries

### Post-Deployment Testing

1. **Smoke Tests**
   - Health check endpoints
   - Authentication flow
   - Basic CRUD operations

2. **Performance Tests**
   - Load testing
   - Stress testing
   - Database query performance

3. **Security Tests**
   - Penetration testing
   - Vulnerability scanning
   - Compliance validation

## Cost Optimization

### Development Environment

- Use smaller SKUs (Standard S1)
- Enable auto-pause for Cosmos DB (manual)
- Use free tiers where possible
- Scale down during off-hours

### Production Environment

- Right-size App Service Plan
- Optimize Cosmos DB throughput
- Use reserved capacity for predictable workloads
- Monitor and optimize costs regularly

## Timeline Estimate (DEV-First Approach)

### Week 1: DEV Infrastructure Deployment
- Deploy Terraform infrastructure (DEV only)
- Configure networking and security (DEV)
- Set up monitoring (DEV)
- Verify Application Gateway connectivity

### Week 2: DEV Code Migration (Minimal)
- Replace Supabase client with Cosmos DB client (or keep Supabase for initial DEV)
- Implement basic Cosmos DB data access layer
- Update environment configuration
- Test database connectivity

### Week 3: DEV Application Deployment
- Build and deploy Next.js to DEV App Service
- Configure app settings from Key Vault
- Test application functionality
- Fix deployment issues

### Week 4: DEV Testing & Iteration
- End-to-end testing
- Performance validation
- Security checks
- Bug fixes and improvements
- Document learnings

### Week 5+: QA and PROD (After DEV is Stable)
- Deploy QA infrastructure
- Deploy PROD infrastructure
- Full database migration
- CI/CD pipeline setup
- Production go-live

## Success Criteria (DEV-First)

### DEV Environment Success Criteria

1. **Infrastructure**
   - DEV environment deployed successfully
   - Application Gateway accessible
   - Network security verified
   - Monitoring operational

2. **Application**
   - Application deployed and accessible via Application Gateway
   - Core features working
   - Can connect to database (Supabase or Cosmos DB)
   - Basic functionality validated

3. **Database**
   - Database accessible from App Service
   - Can read/write data
   - Query performance acceptable for DEV
   - (Optional) Sample data migrated if using Cosmos DB

4. **Security**
   - Network isolation working (App Service in private subnet)
   - Application Gateway WAF enabled
   - Key Vault integration working
   - Private endpoints configured

5. **Operations**
   - Can deploy application updates
   - Monitoring shows application metrics
   - Logs are being collected
   - Basic troubleshooting procedures documented

### QA/PROD Success Criteria (After DEV)

1. **Infrastructure**
   - All environments deployed successfully
   - Network security verified
   - Monitoring operational

2. **Application**
   - Application deployed and accessible
   - All features working
   - Performance meets requirements

3. **Database**
   - Data migrated successfully (if not done in DEV)
   - No data loss
   - Query performance acceptable

4. **Security**
   - All security controls in place
   - HIPAA compliance verified
   - Audit logging operational

5. **Operations**
   - CI/CD pipeline working
   - Monitoring and alerting configured
   - Documentation complete

## Risk Mitigation

### Technical Risks

1. **Database Migration Issues**
   - Mitigation: Keep Supabase for DEV initially, dual-write period for QA/PROD
   - Rollback: Keep Supabase active

2. **Performance Issues**
   - Mitigation: Load testing, performance monitoring
   - Rollback: Scale up resources, optimize queries

3. **Integration Issues**
   - Mitigation: Staged rollout, feature flags
   - Rollback: Disable features, revert code

### Operational Risks

1. **Deployment Failures**
   - Mitigation: Deployment slots, automated testing
   - Rollback: Quick rollback procedures

2. **Data Loss**
   - Mitigation: Backups, dual-write, validation
   - Rollback: Restore from backup

## Next Steps (DEV-First Approach)

### Immediate Actions (Week 1)

1. **Review and approve this architecture plan**
2. **Deploy DEV Infrastructure**
   - Deploy Terraform infrastructure for DEV environment
   - Verify Application Gateway is accessible
   - Test network connectivity
   - Validate Key Vault access

3. **Prepare Application for Deployment**
   - Review current codebase
   - Identify minimal changes needed for DEV deployment
   - Decide: Keep Supabase for DEV or migrate to Cosmos DB?

4. **Set up Local Development**
   - Configure local environment to connect to DEV Azure resources
   - Test Cosmos DB connectivity (if migrating)
   - Test Application Gateway connectivity

### Week 2-3 Actions

5. **Deploy Application to DEV**
   - Build Next.js application
   - Deploy to DEV App Service
   - Configure environment variables
   - Test end-to-end functionality

6. **Iterate and Fix**
   - Address deployment issues
   - Fix connectivity problems
   - Optimize performance
   - Document learnings

### Week 4+ Actions

7. **Stabilize DEV Environment**
   - Complete testing
   - Performance optimization
   - Security validation
   - Documentation

8. **Plan QA/PROD Deployment**
   - Review DEV learnings
   - Update deployment procedures
   - Plan database migration (if not done in DEV)
   - Set up CI/CD pipelines

## References

- Infrastructure Terraform configurations: `infrastructure/terraform/`
- Network architecture: `infrastructure/NETWORKING.md`
- Deployment guide: `infrastructure/README.md`
- Application codebase: Root directory of `wabi-clinic/`


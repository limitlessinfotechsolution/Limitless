# CI/CD Pipeline Improvements TODO

## Phase 1: Configuration Fixes
- [x] Fix netlify.toml: Change dev command to "next dev", remove publish directory
- [x] Add NEXT_PUBLIC_SITE_URL environment variable to next.config.mjs
- [x] Update package.json scripts for production builds

## Phase 2: Workflow Enhancements
- [x] Update ci.yml: Add caching for dependencies and build artifacts
- [x] Add secret scanning job to ci.yml
- [x] Add code coverage reporting to ci.yml
- [x] Update deploy.yml: Add post-deployment smoke tests on production URL
- [x] Merge node.js.yml into ci.yml with matrix strategy

## Phase 3: Advanced Improvements
- [x] Add performance regression testing using production URL
- [x] Add accessibility testing on production URL
- [x] Implement automated rollback on deployment failure
- [x] Add notification system for deployment status
- [x] Optimize build times with parallel jobs and caching

## Phase 4: Testing and Validation
- [ ] Test updated workflows on feature branch
- [ ] Validate production URL usage in tests
- [ ] Monitor build times and success rates
- [ ] Update documentation for new CI/CD features

## Phase 5: Supabase CI/CD
- [x] Add Supabase workflow for lint, test, and deploy

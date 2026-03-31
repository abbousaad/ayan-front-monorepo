## Proposed Approach

**What**: Implement guest checkout workflow for MVP where unauthenticated users can continue as guest, see editable cart items, and submit orders via public API.

**Components**: 
- Auth choice modal (guest vs login/signup)
- Guest checkout form with editable cart items
- Cart summary component for checkout
- API client function for creating public orders
- Checkout route and layout modifications

**Approach**: Direct execution (1-4 files, straightforward implementation based on existing docs)

**Context discovered**: 
- .opencode/context/core/standards/code-quality.md
- .opencode/context/core/workflows/component-planning.md

**External docs**: Fetched API JSON showing POST /public/orders endpoint and schemas

**Approval needed before proceeding.**
<!-- Context: ui/guides | Priority: high | Version: 1.0 | Updated: 2026-03-30 -->

# UI Rules

**Purpose**: Shared UI principles for web and mobile so future work follows the same design direction by default.

## Core Principles

- **Minimalism first**: remove anything that does not improve clarity or usability.
- **Best UX wins**: prioritize speed, readability, predictability, and ease of use over decoration.
- **Cross-platform consistency**: web and mobile should feel like the same product.
- **Reuse before re-creating**: extract shared components, tokens, and patterns instead of duplicating UI.

## Rules

- Use shared theme tokens before hardcoded colors.
- Prefer compact layouts with clear hierarchy and generous whitespace.
- Keep cards focused: image, key text, and primary action only.
- Show full images when image understanding matters more than decorative cropping.
- Remove non-essential badges, counters, labels, and extra metadata.
- Keep navigation obvious and actions easy to reach.
- Favor white, black, and brand green as the default base palette.
- Design mobile and web updates together unless platform differences require otherwise.

## UX Checks

- Is this screen simpler than before?
- Is the main action obvious?
- Is the content readable in a few seconds?
- Can the same decision work for both web and mobile?

## Related

- See `web/ui-styling-standards.md` for web styling conventions.
- See `web/design-systems.md` for theme and token guidance.
- See `../core/standards/documentation.md` for documentation expectations.

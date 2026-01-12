---
name: garden
version: "11.1.0"
description: Health report on pattern authority and component usage
agent: "monitoring-patterns"
agent_path: .claude/skills/monitoring-patterns/SKILL.md
---

# /garden

Get a health report on your design system. Invokes the monitoring-patterns skill.

First, invoke the monitoring-patterns skill:

```
skill({ name: 'monitoring-patterns' })
```

Then follow the skill instructions to analyze and report.

<user-request>
$ARGUMENTS
</user-request>

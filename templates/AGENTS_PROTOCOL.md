# Claude Agents Communication Protocol

## Overview

This document describes the structured JSON communication protocol used by all agents in the Claude multi-agent orchestration system. All agents MUST communicate using this protocol to ensure consistency, traceability, and proper workflow execution.

## Core Principles

1. **Structured Communication**: All inter-agent communication uses JSON format
2. **Message Traceability**: Every message includes task_id and timestamps
3. **Status Transparency**: Clear status reporting at every workflow stage
4. **Error Handling**: Standardized blocker escalation mechanism
5. **Validation**: Every task has clear acceptance criteria

---

## Message Types

### 1. TASK_ASSIGNMENT

Sent by **ORCHESTRATOR** to delegate work to specialist agents.

**Structure:**
```json
{
  "message_type": "TASK_ASSIGNMENT",
  "task_id": "unique_task_identifier",
  "from_agent": "ORCHESTRATOR",
  "to_agent": "TARGET_AGENT_NAME",
  "timestamp": "2025-11-09T21:00:00Z",
  "task_name": "Human-readable task description",
  "priority": "high|medium|low",
  "deadline": "2025-11-10T08:00:00Z",

  "requirements": [
    "Specific requirement 1",
    "Specific requirement 2",
    "Specific requirement 3"
  ],

  "acceptance_criteria": [
    "✓ Criterion 1 must be met",
    "✓ Criterion 2 must be met",
    "✓ Criterion 3 must be met"
  ],

  "context": {
    "project": "Project name",
    "phase": "Development phase",
    "reference_docs": ["CLAUDE.md section"],
    "tech_stack": "Technology stack details",
    "key_constraints": ["Constraint 1", "Constraint 2"]
  },

  "blocked_by": null,
  "related_tasks": ["task_id_1", "task_id_2"]
}
```

**Required Fields:**
- `message_type`, `task_id`, `from_agent`, `to_agent`, `task_name`, `requirements`, `acceptance_criteria`

---

### 2. TASK_ACKNOWLEDGMENT

Sent by the **receiving agent** to confirm task receipt and understanding.

**Structure:**
```json
{
  "message_type": "TASK_ACKNOWLEDGMENT",
  "task_id": "same_task_id_from_assignment",
  "from_agent": "AGENT_NAME",
  "status": "acknowledged",
  "timestamp": "2025-11-09T21:05:00Z",
  "estimated_completion": "2025-11-10T02:00:00Z",
  "understood": true,
  "clarifications_needed": []
}
```

**Purpose:**
- Confirms agent received and understood the task
- Provides estimated completion time
- Requests clarifications if needed

---

### 3. TASK_COMPLETION

Sent by the **working agent** when task is finished.

**Structure:**
```json
{
  "message_type": "TASK_COMPLETION",
  "task_id": "same_task_id",
  "from_agent": "AGENT_NAME",
  "status": "completed",
  "timestamp": "2025-11-10T01:45:00Z",

  "output": {
    "files": ["file1.ts", "file2.tsx"],
    "code": "Code snippets or file paths",
    "summary": "Brief description of what was completed",
    "artifacts": ["Additional deliverables"]
  },

  "validation": {
    "acceptance_criteria_met": [true, true, true],
    "all_passed": true,
    "issues": []
  },

  "next_steps": ["Suggested next actions"]
}
```

**Validation Rules:**
- `all_passed` must be `true` for ORCHESTRATOR to approve
- If `all_passed` is `false`, task will be rejected with feedback

---

### 4. TASK_REJECTION

Sent by **ORCHESTRATOR** when task output doesn't meet acceptance criteria.

**Structure:**
```json
{
  "message_type": "TASK_REJECTION",
  "task_id": "same_task_id",
  "from_agent": "ORCHESTRATOR",
  "to_agent": "ORIGINAL_AGENT",
  "timestamp": "2025-11-10T02:00:00Z",
  "reason": "Brief reason for rejection",

  "issues": [
    "Issue 1: Description and location",
    "Issue 2: Description and location"
  ],

  "action_required": "Specific fixes needed",
  "deadline": "2025-11-10T06:00:00Z",
  "next_review": "Re-validation will occur on resubmission"
}
```

**Agent Response:**
- Fix all issues listed
- Resubmit with TASK_COMPLETION message
- Include notes on what was fixed

---

### 5. BLOCKER_ESCALATION

Sent by **any agent** when encountering a blocker that prevents task completion.

**Structure:**
```json
{
  "message_type": "BLOCKER_ESCALATION",
  "task_id": "current_task_id",
  "from_agent": "AGENT_NAME",
  "blocker_type": "clarification_needed|technical_blocker|dependency_missing|scope_change",
  "severity": "critical|high|medium|low",
  "timestamp": "2025-11-10T03:00:00Z",

  "description": "Detailed description of the blocker",

  "options": [
    "Option A: Description and implications",
    "Option B: Description and implications",
    "Option C: Description and implications"
  ],

  "suggested_resolution": "Agent's recommendation",
  "context": "Additional context needed for decision",
  "escalate_to": "ORCHESTRATOR|human"
}
```

**Escalation Targets:**
- `ORCHESTRATOR`: Technical decisions, pattern choices
- `human`: Business decisions, scope changes, critical issues

---

### 6. BLOCKER_RESOLUTION

Sent by **ORCHESTRATOR or human** to resolve a blocker.

**Structure:**
```json
{
  "message_type": "BLOCKER_RESOLUTION",
  "task_id": "same_task_id",
  "from_agent": "ORCHESTRATOR",
  "to_agent": "BLOCKED_AGENT",
  "timestamp": "2025-11-10T03:15:00Z",

  "decision": "Chosen option or custom solution",
  "rationale": "Explanation of why this decision was made",
  "modified_requirements": ["Updated requirements if any"],
  "resume_task": true
}
```

---

## Agent Workflow Sequence

### Standard Feature Development Pipeline

```
1. ORCHESTRATOR → ARCHITECT
   Message: TASK_ASSIGNMENT (design system architecture)

2. ARCHITECT → ORCHESTRATOR
   Message: TASK_ACKNOWLEDGMENT

3. ARCHITECT → ORCHESTRATOR
   Message: TASK_COMPLETION (architecture design complete)

4. ORCHESTRATOR validates → APPROVED

5. ORCHESTRATOR → DESIGNER
   Message: TASK_ASSIGNMENT (create UI specifications)

6. DESIGNER → ORCHESTRATOR
   Message: TASK_COMPLETION

7. ORCHESTRATOR validates → APPROVED

8. ORCHESTRATOR → DEVELOPER (implement components)
   ORCHESTRATOR → INTEGRATIONS (build API providers) [PARALLEL]

9. Both agents send TASK_COMPLETION

10. ORCHESTRATOR → TESTING
    Message: TASK_ASSIGNMENT (write tests)

11. TESTING → ORCHESTRATOR
    Message: TASK_COMPLETION (tests pass)

12. ORCHESTRATOR → SECURITY_AUDITOR
    Message: TASK_ASSIGNMENT (security review)

13. SECURITY_AUDITOR → ORCHESTRATOR
    Message: TASK_COMPLETION
    - approval_status: "APPROVED|CONDITIONAL|REJECTED"

14. IF APPROVED:
      ORCHESTRATOR → DOCUMENTATION (document features)
      ORCHESTRATOR → DEPLOYMENT (deploy to staging)

    ELSE:
      ORCHESTRATOR → DEVELOPER (fix issues)
      Return to step 12 (re-review)
```

---

## Security Gate Protocol

### Critical Rule
**NO DEPLOYMENT without SECURITY_AUDITOR approval**

### Security Review Flow

```json
{
  "message_type": "TASK_ASSIGNMENT",
  "task_id": "sec_review_001",
  "to_agent": "SECURITY_AUDITOR",
  "task_name": "Security review for Phase 1 MVP",

  "requirements": [
    "Review all code for security vulnerabilities",
    "Check production readiness checklist",
    "Assess scalability and performance",
    "Verify error handling and robustness"
  ],

  "files_to_review": [
    "components/*.tsx",
    "api/*.ts",
    "services/*.ts",
    "package.json"
  ],

  "acceptance_criteria": [
    "✓ Security vulnerabilities identified",
    "✓ Production readiness validated",
    "✓ Scalability assessed",
    "✓ Clear approval/rejection decision"
  ]
}
```

### Security Response Format

```json
{
  "message_type": "TASK_COMPLETION",
  "task_id": "sec_review_001",
  "from_agent": "SECURITY_AUDITOR",
  "status": "completed",
  "approval_status": "APPROVED|CONDITIONAL|REJECTED",

  "output": {
    "critical_issues": [],
    "high_issues": [],
    "medium_issues": [],
    "low_issues": [],
    "recommendations": [],
    "blocking_deployment": false
  },

  "validation": {
    "security_passed": true,
    "production_readiness_passed": true,
    "scalability_passed": true,
    "all_passed": true
  }
}
```

**Approval Status:**
- `APPROVED`: Deployment allowed
- `CONDITIONAL`: Minor issues - fix before production
- `REJECTED`: Critical issues - block deployment

---

## Communication Best Practices

### For All Agents

1. **Always Use JSON**: Never send unstructured messages
2. **Include All Required Fields**: task_id, message_type, from_agent, timestamp
3. **Be Specific**: Clear requirements, clear outputs
4. **Validate Work**: Check acceptance criteria before sending TASK_COMPLETION
5. **Escalate Early**: Don't waste time on blockers - escalate immediately

### For ORCHESTRATOR

1. **Clear Requirements**: Break down complex tasks into specific sub-tasks
2. **Set Acceptance Criteria**: Make success measurable
3. **Track Dependencies**: Don't start tasks before dependencies complete
4. **Validate Thoroughly**: Check all acceptance criteria before approving
5. **Enforce Security Gate**: Always review with SECURITY_AUDITOR before deployment

### For Specialist Agents

1. **Acknowledge Tasks**: Send TASK_ACKNOWLEDGMENT immediately
2. **Ask Questions**: Use BLOCKER_ESCALATION for clarifications
3. **Self-Validate**: Check your own work against acceptance criteria
4. **Be Honest**: Report issues in validation section
5. **Stay in Scope**: Only do what was assigned

---

## Error Handling

### Common Errors

**1. Vague Requirements**
```json
{
  "message_type": "BLOCKER_ESCALATION",
  "blocker_type": "clarification_needed",
  "description": "Requirement 'improve performance' is not specific enough",
  "suggested_resolution": "Specify target performance metrics (e.g., response time < 200ms)"
}
```

**2. Missing Dependencies**
```json
{
  "message_type": "BLOCKER_ESCALATION",
  "blocker_type": "dependency_missing",
  "description": "Cannot implement authentication - ARCHITECT hasn't designed auth flow",
  "suggested_resolution": "Assign ARCHITECT to design authentication architecture first"
}
```

**3. Scope Change**
```json
{
  "message_type": "BLOCKER_ESCALATION",
  "blocker_type": "scope_change",
  "description": "Implementing OAuth2 was not in original requirements",
  "escalate_to": "human"
}
```

---

## Example: Complete Task Flow

### Task: Implement Chat Message Component

```json
// Step 1: ORCHESTRATOR assigns to DEVELOPER
{
  "message_type": "TASK_ASSIGNMENT",
  "task_id": "dev_chat_msg_001",
  "to_agent": "DEVELOPER",
  "task_name": "Implement ChatMessage component",
  "requirements": [
    "Implement ChatMessage component from DESIGNER spec",
    "Support markdown rendering",
    "Handle user and assistant roles",
    "Include timestamp display"
  ],
  "acceptance_criteria": [
    "✓ Component matches DESIGNER specification",
    "✓ Markdown content renders correctly",
    "✓ TypeScript types are correct",
    "✓ No console.log statements",
    "✓ Error handling implemented"
  ]
}

// Step 2: DEVELOPER acknowledges
{
  "message_type": "TASK_ACKNOWLEDGMENT",
  "task_id": "dev_chat_msg_001",
  "from_agent": "DEVELOPER",
  "status": "acknowledged",
  "estimated_completion": "2 hours"
}

// Step 3: DEVELOPER completes
{
  "message_type": "TASK_COMPLETION",
  "task_id": "dev_chat_msg_001",
  "from_agent": "DEVELOPER",
  "status": "completed",
  "output": {
    "files": ["components/ChatMessage.tsx"],
    "summary": "ChatMessage component implemented with markdown support"
  },
  "validation": {
    "acceptance_criteria_met": [true, true, true, true, true],
    "all_passed": true,
    "issues": []
  }
}

// Step 4: ORCHESTRATOR validates and approves
// Proceeds to next task (TESTING)
```

---

## Tools & Resources

### Suggested Implementation

**Languages**: Node.js, TypeScript
**Validation**: JSON Schema validation for all messages
**Logging**: Store all messages in structured log for audit trail
**Monitoring**: Track task completion times, rejection rates

---

## Version History

- **v1.0.0** (2025-11-09): Initial protocol specification

---

## Support

For questions or issues with the protocol:
- GitHub Issues: https://github.com/technioz/claude-agents/issues
- Documentation: https://github.com/technioz/claude-agents

---

**Remember**: This protocol ensures quality, traceability, and collaboration. Following it strictly prevents miscommunication and ensures successful project delivery.

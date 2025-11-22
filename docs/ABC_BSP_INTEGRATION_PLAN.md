# ABC Data Collection & BSP Integration Plan

## Overview
This plan outlines how to integrate ABC (Antecedent-Behavior-Consequence) data collection and Behavior Support Plans (BSP) into the Data Collection tab without making it overly complex for RBTs.

## Understanding ABC Data & BSP

### ABC Data Collection
Based on [Blue ABA's guide](https://blueabatherapy.com/aba/abc-data-collection/):
- **Antecedent**: What happens immediately before the behavior (environmental factors, demands, social interactions)
- **Behavior**: Specific, observable, measurable behavior
- **Consequence**: What happens immediately after (reinforcement, punishment, or neutral response)
- **Purpose**: Identify the function of behavior (attention, escape, access, automatic)

### Behavior Support Plan (BSP)
Based on [Empowered Psychology's guide](https://www.empowered-psych.com/resources/whats-a-behavioral-support-plan-bsp):
- **Behavior Definition**: Clear, observable description
- **Function of Behavior**: Why the behavior occurs
- **Prevention Strategies**: Proactive interventions
- **Replacement Behaviors**: Alternative skills to teach
- **Response Strategies**: How to respond when behavior occurs

## Integration Plan

### Phase 1: ABC Data Collection Integration

#### 1.1 Conditional Display Based on Goal Data Type
- When a goal with `dataType: "abc-data"` is selected, show ABC data collection interface
- Replace or supplement the "Trial Recording" section with ABC form
- Keep the same layout structure (left: goals, right: data collection)

#### 1.2 Simple ABC Entry Form
**Location**: Right panel, "Capture" tab, when ABC data type goal is selected

**Components**:
- Three text fields (Antecedent, Behavior, Consequence)
- Quick-select buttons for common antecedents/consequences
- Intensity selector (Low/Moderate/High)
- "Record ABC" button
- Recent entries list below

**Design Principles**:
- One-click recording (similar to trial buttons)
- Voice command support ("antecedent", "behavior", "consequence")
- Quick templates for common scenarios

#### 1.3 ABC Data History
- Display recent ABC entries in a scrollable list
- Show timestamp, intensity badge
- Allow quick editing/deletion
- Visual indicators for patterns (e.g., same antecedent → behavior)

### Phase 2: BSP Integration

#### 2.1 BSP View/Edit Section
**Location**: New tab or collapsible section in "Capture" tab

**Components**:
- **Behavior Definition Card**: Read-only, set by BCBA
- **Function of Behavior**: Display identified function (Attention, Escape, Access, Automatic)
- **Quick Reference Card**: 
  - Prevention strategies (bullet list)
  - Replacement behaviors (bullet list)
  - Response strategies (bullet list)
- **Edit Mode**: BCBA-only toggle to edit BSP

#### 2.2 BSP Quick Actions
- "View BSP" button in session header
- Collapsible BSP card that can be pinned/unpinned
- Quick access to replacement behavior prompts

### Phase 3: Simplified Implementation

#### 3.1 Data Collection Method Switching
- Add method selector in Session Setup: "Trial", "Frequency", "Duration", "ABC"
- When "ABC" is selected, show ABC interface
- When other methods selected, show current trial/frequency/duration interface

#### 3.2 ABC Quick Entry
**For RBTs during active sessions**:
- Large, easy-to-tap buttons:
  - "Record ABC" button opens quick entry form
  - Pre-filled templates for common scenarios
  - Voice commands: "antecedent [text]", "behavior [text]", "consequence [text]"

#### 3.3 BSP Integration Points
- **During Session**: Show BSP quick reference as collapsible card
- **Before Session**: BCBA can review/edit BSP
- **After Session**: Link ABC data to BSP for analysis

## Implementation Details

### File Structure
```
src/components/goal-data-2/
  ├── DataCollectionTab.tsx (main component)
  ├── ABCDataCollection.tsx (new - ABC entry form)
  ├── BSPViewer.tsx (new - BSP display/editor)
  └── ABCDataHistory.tsx (new - ABC entries list)
```

### Data Structure
```typescript
interface ABCData {
  id: string
  timestamp: number
  antecedent: string
  behavior: string
  consequence: string
  intensity: "low" | "moderate" | "high"
  goalId: string
  sessionId: string
  notes?: string
}

interface BSP {
  id: string
  goalId: string
  behaviorDefinition: string
  function: "attention" | "escape" | "access" | "automatic"
  preventionStrategies: string[]
  replacementBehaviors: string[]
  responseStrategies: string[]
  createdBy: string
  lastUpdated: string
}
```

### UI Flow
1. **Select Goal** → Check `dataType`
2. **If ABC Data Type**:
   - Show ABC entry form instead of trial buttons
   - Show BSP quick reference card
3. **If Other Data Type**:
   - Show current trial/frequency/duration interface
   - BSP still accessible via button

## Key Design Principles

1. **Simplicity First**: RBTs should be able to record ABC data in < 30 seconds
2. **Context-Aware**: Show relevant interface based on selected goal's data type
3. **Non-Intrusive**: BSP should be accessible but not blocking
4. **Voice-Enabled**: Support voice commands for hands-free data entry
5. **Quick Templates**: Pre-filled common scenarios to speed up entry

## User Experience Flow

### ABC Data Collection Flow
1. RBT selects goal with ABC data type
2. ABC entry form appears (replaces trial buttons)
3. RBT records: Antecedent → Behavior → Consequence
4. Clicks "Record" or uses voice command
5. Entry saved and appears in history
6. Can continue recording multiple ABC entries

### BSP Access Flow
1. RBT clicks "View BSP" button (always visible)
2. BSP card expands showing:
   - Behavior definition
   - Function
   - Prevention strategies
   - Replacement behaviors
   - Response strategies
3. RBT can reference during session
4. Can collapse to save space

## Next Steps

1. Create ABCDataCollection component
2. Create BSPViewer component
3. Update DataCollectionTab to conditionally show ABC interface
4. Add BSP data structure to goals
5. Integrate voice commands for ABC data
6. Add BSP quick reference card


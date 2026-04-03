# App Routing Structure

## Root Routes

```
/                          Home (Landing Page)
├── /classic               Classic Pattern - Todo Demo
├── /transition            Transition Pattern - Todo Demo
└── /actions               Actions Pattern - Todo Demo
```

## Race Conditions Routes

```
/race                      Race Condition Landing Page
├── /race/classic          Classic Pattern - Race Condition Demo
├── /race/transition       Transition Pattern - Race Condition Demo
└── /race/actions          Actions Pattern - Race Condition Demo
```

## Detailed Route Description

### Root Level Routes (Form Pattern Demos)

| Route         | Type          | Description                                           | Component                 |
| ------------- | ------------- | ----------------------------------------------------- | ------------------------- |
| `/`           | Client        | Landing page with navigation to all patterns          | `app/page.tsx`            |
| `/classic`    | Client        | Classic pattern (useState + useEffect) todo form demo | `app/classic/page.tsx`    |
| `/transition` | Client        | Transition pattern (useTransition) todo form demo     | `app/transition/page.tsx` |
| `/actions`    | Server/Client | Actions pattern (Server Actions) todo form demo       | `app/actions/page.tsx`    |

### Race Condition Routes

| Route              | Type   | Description                                                        | Component                      |
| ------------------ | ------ | ------------------------------------------------------------------ | ------------------------------ |
| `/race`            | Client | Racing conditions landing page explaining what race conditions are | `app/race/page.tsx`            |
| `/race/classic`    | Client | Classic pattern - demonstrates race condition bugs                 | `app/race/classic/page.tsx`    |
| `/race/transition` | Client | Transition pattern - better race handling                          | `app/race/transition/page.tsx` |
| `/race/actions`    | Client | Actions pattern - race condition solved                            | `app/race/actions/page.tsx`    |

## File Structure

```
app/
├── layout.tsx                    # Root layout (metadata, typography)
├── page.tsx                      # Home route (/)
├── globals.css                   # Global styles
│
├── classic/
│   └── page.tsx                  # /classic
│
├── transition/
│   └── page.tsx                  # /transition
│
├── actions/
│   ├── page.tsx                  # /actions
│   └── actions.ts                # Server actions (handleAddTodo)
│
└── race/
    ├── layout.tsx                # Layout wrapper for /race/* routes
    ├── page.tsx                  # /race
    │
    ├── classic/
    │   └── page.tsx              # /race/classic
    │
    ├── transition/
    │   └── page.tsx              # /race/transition
    │
    └── actions/
        └── page.tsx              # /race/actions
```

## Navigation Flow

### From Home (/)

- → Form Demos (tab on home) → Links to `/classic`, `/transition`, `/actions`
- → Race Condition Demos (tab on home) → Links to `/race`

### Pattern Pages (/classic, /transition, /actions)

- ← Home (button to return to `/`)
- ← Previous Pattern (button to go to previous pattern)
- → Next Pattern (button to go to next pattern)
- Pattern flow: `/classic` → `/transition` → `/actions`

### Race Routes (/race/\*)

- All race routes share `race/layout.tsx` wrapper
- Header shows navigation between all three race demos
- ← Back to Home (button to return to `/`)

## Key Features by Route

### / (Home)

- **Purpose**: Navigation hub explaining all three patterns
- **Content**: Educational cards, comparison table, mental model shift explanation

### /classic, /transition, /actions (Form Demos)

- **Purpose**: Compare how each pattern handles the same todo form
- **Features**: Add todo, list todos, error handling, loading states
- **Navigation**: Previous/Next buttons between patterns

### /race (Race Condition Hub)

- **Purpose**: Explain what race conditions are
- **Content**: Educational explanation with links to demos

### /race/classic, /race/transition, /race/actions (Race Demos)

- **Purpose**: Demonstrate how each pattern handles rapid (racing) submissions
- **Features**: Increment counter rapidly to see race condition behavior
- **UI Color Coding**:
  - Classic: Red (bugs/broken)
  - Transition: Yellow (better)
  - Actions: Green (solved)

## Special Files

- `app/layout.tsx` - Root layout (typography, analytics)
- `app/race/layout.tsx` - Shared layout for all race routes (header with nav)
- `app/actions/actions.ts` - Server actions for the Actions pattern demo

## Components Used

- **UI Components** (from `components/ui/`): Button, Input, Card, Badge
- **Custom Components**: TodoForm, TodoList, ThemeProvider
- **Layout Wrappers**: RaceLayout

## API/Server Actions

- `app/actions/actions.ts` - Contains `addTodoAction` (Server Action)
- All routes use simulated/fake API calls for demo purposes

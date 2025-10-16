# Chat Assistant Implementation

## Overview

The chat assistant is a collapsible floating window that appears on the right side of the application. It provides AI-powered assistance for special education tasks including student assessments, IEP goals, data collection, and more.

## Features

### ✅ Implemented Features

1. **Collapsible Design**
   - Collapsed state shows a floating chat button
   - Expanded state shows full chat interface
   - Smooth transitions between states

2. **Resizable Window**
   - Drag handle on the left edge to resize
   - Minimum width: 280px
   - Maximum width: 60% of screen width (max 600px)
   - Responsive behavior on mobile (full screen)

3. **Responsive Layout**
   - Main content area automatically adjusts when chat is open
   - Mobile-first design with full-screen chat on small devices
   - Smooth transitions and animations

4. **Chat Interface**
   - Message history with user and assistant messages
   - Real-time typing and sending
   - Auto-scroll to latest messages
   - Timestamp display for each message

5. **Material Design Integration**
   - Consistent with existing UI components
   - Gradient styling matching the app theme
   - Proper shadows and elevation

## Components

### Core Components

1. **`ChatAssistant.tsx`** - Main chat component
2. **`ChatAssistantProvider.tsx`** - Context provider for state management
3. **`PageLayout.tsx`** - Reusable layout wrapper with chat integration

### Usage

#### Basic Implementation

```tsx
import { PageLayout } from "@/components/PageLayout"

export function MyPage() {
  return (
    <PageLayout 
      breadcrumbs={[
        { label: "Section", href: "/section" },
        { label: "Page" }
      ]}
      title="Page Title"
    >
      <YourPageContent />
    </PageLayout>
  )
}
```

#### Manual Integration

```tsx
import { ChatAssistantProvider, useChatAssistant } from "@/components/ChatAssistantProvider"
import { ChatAssistant } from "@/components/ChatAssistant"

function MyPageContent() {
  const { isOpen, toggleChat, width, setWidth } = useChatAssistant()
  
  return (
    <>
      <div style={{ marginRight: isOpen ? `${width}px` : '0px' }}>
        {/* Your content */}
      </div>
      <ChatAssistant 
        isOpen={isOpen}
        onToggle={toggleChat}
        width={width}
        onWidthChange={setWidth}
      />
    </>
  )
}

export function MyPage() {
  return (
    <ChatAssistantProvider>
      <MyPageContent />
    </ChatAssistantProvider>
  )
}
```

## State Management

The chat assistant uses React Context for state management:

```tsx
interface ChatAssistantContextType {
  isOpen: boolean           // Whether chat is open
  setIsOpen: (open: boolean) => void
  toggleChat: () => void    // Toggle chat open/closed
  width: number            // Current width in pixels
  setWidth: (width: number) => void
}
```

## Responsive Behavior

### Desktop (≥768px)
- Chat appears as a resizable panel on the right
- Main content adjusts margin to accommodate chat
- Resize handle visible for width adjustment

### Mobile (<768px)
- Chat takes full screen when open
- Resize handle hidden
- Smooth transitions maintained

## Styling

The chat assistant follows Material Design principles:

- **Colors**: Gradient from pink-500 to purple-600
- **Shadows**: Material elevation system
- **Typography**: Roboto font family
- **Spacing**: 8dp grid system
- **Animations**: 300ms transitions with cubic-bezier easing

## Future Enhancements

### Planned Features

1. **AI Integration**
   - Connect to actual AI service (OpenAI, Claude, etc.)
   - Context-aware responses based on current page
   - Student-specific assistance

2. **Advanced Chat Features**
   - Message persistence
   - File attachments
   - Voice input/output
   - Chat history search

3. **Specialized Assistance**
   - Assessment form help
   - IEP goal suggestions
   - Data collection guidance
   - Compliance checking

4. **Integration Features**
   - Quick actions from chat
   - Student data lookup
   - Form pre-filling
   - Report generation

## Migration Guide

To migrate existing pages to use the chat assistant:

1. **Replace existing layout structure**:
   ```tsx
   // Before
   <SidebarProvider>
     <AppSidebar />
     <SidebarInset>
       <header>...</header>
       <div>{children}</div>
     </SidebarInset>
   </SidebarProvider>
   
   // After
   <PageLayout breadcrumbs={breadcrumbs} title={title}>
     {children}
   </PageLayout>
   ```

2. **Update breadcrumbs**:
   ```tsx
   breadcrumbs={[
     { label: "Parent", href: "/parent" },
     { label: "Current Page" }
   ]}
   ```

3. **Remove manual sidebar management** - handled by PageLayout

## Testing

The implementation has been tested for:

- ✅ Responsive behavior across screen sizes
- ✅ Smooth animations and transitions
- ✅ Proper state management
- ✅ Integration with existing components
- ✅ Material Design compliance
- ✅ Accessibility considerations

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lazy loading of chat components
- Optimized re-renders with React.memo
- Efficient state updates
- Minimal bundle size impact

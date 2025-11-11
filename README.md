# GoalFlow

**Turning Ambition Into Action** - A modern SaaS platform for transforming your goals into actionable, day-by-day learning roadmaps.

![GoalFlow](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0+-38bdf8?style=flat-square&logo=tailwind-css)

## 🚀 Features

- **Beautiful Landing Page** - Hero section, features grid, testimonials, and CTAs
- **Authentication UI** - Clean sign-in/sign-up forms (UI only, no backend)
- **Dashboard** - View today's tasks, progress tracking, and streak counter
- **Goal Creation** - Interactive form with timeframe slider
- **Roadmap View** - Visual milestone breakdown with progress indicators
- **Task Management** - Detailed task pages with resources and notes
- **Responsive Design** - Works seamlessly from mobile (375px) to desktop (1440px+)
- **Accessible** - WCAG compliant with keyboard navigation and ARIA labels
- **Modern UI** - Built with shadcn/ui components and Framer Motion animations

## 📁 Project Structure

```
goalflow/
├── src/
│   ├── app/
│   │   ├── (marketing)/          # Public landing page
│   │   │   ├── _components/      # Hero, Features, etc.
│   │   │   └── page.tsx
│   │   ├── (auth)/                # Sign in/Sign up
│   │   │   ├── signin/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (app)/                 # Authenticated app
│   │   │   ├── layout.tsx         # App shell with header
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── goals/
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [goalId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── task/[taskId]/page.tsx
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── AppHeader.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskDrawer.tsx
│   │   ├── ProgressBar.tsx
│   │   └── EmptyState.tsx
│   ├── lib/
│   │   ├── mock.ts                # Mock data (goals, tasks, progress)
│   │   └── utils.ts               # Utility functions
│   └── styles/
│       └── theme.css              # CSS variables for brand colors
├── public/
├── components.json                # shadcn/ui config
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with CSS variables
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Icons:** lucide-react
- **Animations:** Framer Motion
- **Notifications:** Sonner
- **Theme:** next-themes

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd goalflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎨 Customizing Brand Colors

All brand colors are defined in `src/styles/theme.css` using CSS variables. This makes it easy to change the entire color scheme without touching component code.

### Main Brand Variables

```css
:root {
  /* Primary & Accent */
  --brand-primary: #316BFF;  /* Electric blue */
  --brand-accent: #7B61FF;   /* Violet */

  /* Surface & Text */
  --surface: #FFFFFF;
  --text-strong: #0A0A0A;
  --text-muted: #6B7280;

  /* Gradients */
  --grad-hero: linear-gradient(135deg, #316BFF 0%, #7B61FF 100%);
  --grad-section: linear-gradient(180deg, #FFFFFF 0%, #F5F8FF 100%);
}
```

### To Change Colors:

1. Open `src/styles/theme.css`
2. Update the hex values for `--brand-primary` and `--brand-accent`
3. Optionally adjust gradients to match
4. Save and refresh - all components update automatically!

### Tailwind Integration

The theme variables are also exposed as Tailwind utilities via the `tailwind.config.ts` file. You can use them in your components:

```tsx
<div className="bg-primary text-primary-foreground">
  Primary colored element
</div>
```

## 🧪 What's Mocked vs. Real

### ✅ Fully Functional (UI Only)

- All page layouts and navigation
- Form inputs and interactions
- Animations and transitions
- Responsive design
- Toast notifications
- Component states (hover, focus, active)

### 🔄 Mocked Data

- **Mock data location:** `src/lib/mock.ts`
- **Goals:** Pre-defined "Learn Python in 30 days" goal
- **Milestones:** 6 milestones spanning 30 days
- **Tasks:** 10 sample tasks with resources
- **Progress:** Simulated completion for first 6 tasks
- **User data:** No authentication, static user avatar

### ❌ Not Implemented (Future)

- Backend API / Database (Neon, Supabase, etc.)
- Real authentication (NextAuth, Clerk, etc.)
- AI roadmap generation
- Actual progress persistence
- User accounts and profiles
- Payment/subscription system

## 🧭 Navigation Flow

```
Landing (/)
  → Sign Up (/signup) → Dashboard (/dashboard)
  → Sign In (/signin) → Dashboard (/dashboard)

Dashboard (/dashboard)
  → View today's tasks
  → Open task drawer (modal)
  → Create New Goal (/goals/new)
  → View Goal Roadmap (/goals/[goalId])

Goal Roadmap (/goals/[goalId])
  → View all milestones
  → See progress breakdown
  → Return to Dashboard

Task Details (/goals/[goalId]/task/[taskId])
  → View learning guide
  → Access resources
  → Add notes
  → Mark complete
```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start            # Run production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🎯 Sample Data

The app includes a fully populated example goal:

- **Goal:** "Learn Python in 30 days"
- **Milestones:** 6 phases (Fundamentals → Final Project)
- **Tasks:** 10 detailed tasks with guides and resources
- **Progress:** 60% complete (6/10 tasks done)
- **Streak:** 7 days

Navigate to `/dashboard` to see the demo in action!

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Vercel auto-detects Next.js and deploys

### Other Platforms

The app is a standard Next.js 14 app and can be deployed to:
- Netlify
- Railway
- Render
- AWS Amplify
- Any platform supporting Next.js

## 🤝 Contributing

This is an initial UI/UX prototype. Future enhancements:

- [ ] Backend integration (Neon, Supabase)
- [ ] Real authentication
- [ ] AI roadmap generation (OpenAI, Anthropic)
- [ ] Progress persistence
- [ ] Flashcard system
- [ ] Quiz functionality
- [ ] User settings
- [ ] Dark mode toggle

## 📄 License

MIT License - feel free to use this project as a template for your own SaaS applications.

## 🙏 Credits

- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide](https://lucide.dev/)
- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

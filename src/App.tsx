import { lazy, Suspense } from 'react'
import { MotionConfig } from 'framer-motion'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SelectionProvider } from './hooks/SelectionContext'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'

// Home ships in the main bundle; other pages load on demand.
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Systems = lazy(() => import('./pages/Systems'))
// Old How It Works page is temporarily disabled (src/pages/HowItWorks.tsx is kept for later use).
// To restore it: re-add `const HowItWorks = lazy(() => import('./pages/HowItWorks'))` and its route below.
const Pricing = lazy(() => import('./pages/Pricing'))
const BookMeeting = lazy(() => import('./pages/BookMeeting'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

const page = (el: React.ReactNode) => <Suspense fallback={<div className="page-loading" aria-hidden="true" />}>{el}</Suspense>

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SelectionProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={page(<About />)} />
            <Route path="services" element={page(<Services />)} />
            <Route path="systems" element={page(<Systems />)} />
            <Route path="how-it-works" element={<Navigate to="/pricing" replace />} />
            <Route path="pricing" element={page(<Pricing />)} />
            <Route path="book-a-meeting" element={page(<BookMeeting />)} />
            <Route path="contact" element={page(<Contact />)} />
            <Route path="*" element={page(<NotFound />)} />
          </Route>
        </Routes>
      </SelectionProvider>
    </MotionConfig>
  )
}

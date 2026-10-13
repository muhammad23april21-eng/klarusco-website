import {
  BadgeCheck,
  BookOpenCheck,
  Calculator,
  ChartLine,
  Clock3,
  Compass,
  Cpu,
  FileChartColumn,
  Layers,
  MessageSquareText,
  PiggyBank,
  Rocket,
  Sigma,
  SlidersHorizontal,
  Target,
  UserRoundCheck,
  type LucideIcon,
} from 'lucide-react'
import type { IconKey } from '../content/site'

export const icons: Record<IconKey, LucideIcon> = {
  quality: BadgeCheck,
  timely: Clock3,
  expertise: Compass,
  attention: UserRoundCheck,
  cost: PiggyBank,
  technology: Cpu,
  bookkeeping: BookOpenCheck,
  reporting: FileChartColumn,
  consultancy: ChartLine,
  budgeting: Calculator,
  costControl: Target,
  actuarial: Sigma,
}

/** Icons for the four "How It Works" steps, in order. */
export const stepIcons: LucideIcon[] = [MessageSquareText, SlidersHorizontal, Layers, Rocket]

"use client"

import React from "react"
import { addMonths, eachWeekOfInterval, format, startOfDay, startOfMonth } from "date-fns"

import { cn } from "@/lib/utils"

export interface CalendarProps<T = unknown> {
  currentDate: Date
  events?: T[]
  getEventDate: (event: T) => Date
  getEventKey?: (event: T, index: number) => string
  renderEvent?: (event: T) => React.ReactNode
  className?: string
}

export function Calendar<T>({
  currentDate,
  events = [],
  getEventDate,
  getEventKey,
  renderEvent,
  className,
}: CalendarProps<T>) {
  const monthStart = startOfMonth(currentDate)
  const weeks = eachWeekOfInterval({ start: monthStart, end: addMonths(monthStart, 1) }, { weekStartsOn: 0 })

  const eventsByDay = events.reduce<Record<string, T[]>>((acc, event) => {
    const date = getEventDate(event)
    const key = format(startOfDay(date), "yyyy-MM-dd")
    acc[key] = acc[key] ? [...acc[key], event] : [event]
    return acc
  }, {})

  return (
    <div className={cn("rounded-xl border bg-card shadow-sm", className)}>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{format(currentDate, "MMMM yyyy")}</p>
          <h3 className="text-xl font-semibold text-foreground">Monthly Schedule</h3>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b text-center text-sm font-medium text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-3 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {weeks.map((weekStart) =>
          Array.from({ length: 7 }).map((_, dayIndex) => {
            const date = new Date(weekStart)
            date.setDate(date.getDate() + dayIndex)
            const key = format(date, "yyyy-MM-dd")
            const isCurrentMonth = date.getMonth() === monthStart.getMonth()
            const items = eventsByDay[key] ?? []

            return (
              <div
                key={`${key}-${dayIndex}`}
                className={cn(
                  "min-h-[110px] border p-3 text-sm transition-colors",
                  !isCurrentMonth && "bg-muted/40 text-muted-foreground",
                  isCurrentMonth && "bg-background",
                  "hover:bg-muted/60"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{date.getDate()}</span>
                  {items.length > 0 && (
                    <span className="rounded-full bg-primary/10 px-2 text-xs font-medium text-primary">
                      {items.length}
                    </span>
                  )}
                </div>
                <div className="mt-2 space-y-2">
                  {items.slice(0, 3).map((item, index) => (
                    <div
                      key={getEventKey ? getEventKey(item, index) : `${key}-${index}`}
                      className="truncate rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"
                    >
                      {renderEvent ? renderEvent(item) : format(getEventDate(item), "hh:mm a")}
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="text-xs text-muted-foreground">+{items.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
      <div className="border-t px-4 py-3 text-sm">
        <p className="font-semibold text-foreground">Upcoming Sessions</p>
        <ul className="mt-2 space-y-2">
          {events
            .map((event) => ({ event, date: startOfDay(getEventDate(event)).getTime(), start: getEventDate(event) }))
            .sort((a, b) => a.start.getTime() - b.start.getTime())
            .slice(0, 4)
            .map(({ event, start }, index) => (
              <li key={getEventKey ? getEventKey(event, index) : index} className="flex items-center justify-between text-muted-foreground">
                <span>{format(start, "EEE, MMM d • h:mm a")}</span>
                <span className="font-medium text-foreground">
                  {renderEvent ? renderEvent(event) : undefined}
                </span>
              </li>
            ))}
          {events.length === 0 && <li className="text-muted-foreground">No upcoming sessions.</li>}
        </ul>
      </div>
    </div>
  )
}



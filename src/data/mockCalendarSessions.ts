export const mockCalendarSessions = [
  createSession("cal-1", "Jordan Brooks", "Rachel Smith", 0, 9, 0, 60, "confirmed"),
  createSession("cal-2", "Avery Chen", "Priya Patel", 0, 11, 30, 45, "suggested"),
  createSession("cal-3", "Leo Martinez", "Rachel Smith", 2, 14, 0, 60, "pending"),
  createSession("cal-4", "Harper Nguyen", "Marcus Lee", 5, 10, 30, 90, "suggested"),
]

function createSession(
  id: string,
  student: string,
  therapist: string,
  daysFromToday: number,
  hour: number,
  minute: number,
  durationMinutes: number,
  status: "suggested" | "confirmed" | "pending"
) {
  const startDate = new Date()
  startDate.setHours(hour, minute, 0, 0)
  startDate.setDate(startDate.getDate() + daysFromToday)

  return {
    id,
    student,
    therapist,
    start: startDate.toISOString(),
    durationMinutes,
    status,
    end: new Date(startDate.getTime() + durationMinutes * 60000).toISOString(),
  }
}


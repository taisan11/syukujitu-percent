import "uno.css"
import { getHolidaysOfYear,HOLIDAY_TYPE } from "holiday-jp-since"

function nextHoliday(): { next: boolean, Deta: Date, name: string, hurikae: boolean, previousHolidayDate: Date | null } {
  const now = new Date()
  const year = now.getFullYear()
  const holidays = getHolidaysOfYear(year)
  const todayHoliday = holidays.find(h => {
    const date = new Date(year, h.month - 1, h.day)
    return date.toDateString() === now.toDateString()
  })
  const previous = holidays.slice().reverse().find(h => {
    const date = new Date(year, h.month - 1, h.day)
    return date < now
  })
  if (todayHoliday) {
    return {
      next: todayHoliday.name === "振替休日",
      Deta: now,
      name: todayHoliday && todayHoliday.name === "振替休日" ? previous?.name || todayHoliday.name : todayHoliday.name,
      hurikae: false,
      previousHolidayDate: previous ? new Date(year, previous.month - 1, previous.day) : null
    }
  }

  const next = holidays.find(h => {
    const date = new Date(year, h.month - 1, h.day)
    return date > now && h.holidayType !== HOLIDAY_TYPE.FURIKAE_KYUJITU as unknown as (typeof HOLIDAY_TYPE)[]
  })

  if (next) {
    let nextDate = new Date(year, next.month - 1, next.day)
    let hurikae = next.name === "振替休日"
    if (nextDate.getDay() === 0) {
      nextDate.setDate(nextDate.getDate() + 1)
      hurikae = true
    }
    return {
      next: true,
      Deta: nextDate,
      name: next && next.name === "振替休日" ? previous?.name || next.name : next.name,
      hurikae: hurikae,
      previousHolidayDate: previous ? new Date(year, previous.month - 1, previous.day) : null
    }
  } else {
    const nextYear = year + 1
    const newYearsDay = new Date(nextYear, 0, 1)
    return {
      next: true,
      Deta: newYearsDay,
      name: "元日",
      hurikae: false,
      previousHolidayDate: previous ? new Date(year, previous.month - 1, previous.day) : null
    }
  }
}

console.log(nextHoliday())

async function updateHolidayInfo() {
  while (true) {
    const now = new Date()
    const holiday = nextHoliday()
    const texttext = document.getElementById("texttext")
    // const pasento = document.getElementById("pa-sento")
    if (!holiday.next) {
      texttext!.textContent = `今日は${holiday.name}!!休みだ!!`
      // pasento!.textContent = "100%!!"
    }
    if (holiday.hurikae) {
      texttext!.textContent = `今日は${holiday.name}の振替休日です。`
    }
    //${holiday.Deta.toLocaleString("ja-JP", { dateStyle:"short" })}(${holiday.Deta.toLocaleString("ja-JP", { weekday:"short" })})です。
    const previousHolidayDate = holiday.previousHolidayDate || new Date(now.getFullYear(), 0, 1)
    const daysSincePreviousHoliday = (now.getTime() - previousHolidayDate.getTime()) / (1000 * 60 * 60 * 24)
    const daysBetweenHolidays = (holiday.Deta.getTime() - previousHolidayDate.getTime()) / (1000 * 60 * 60 * 24)
    const percentUntilNextHoliday = (daysSincePreviousHoliday / daysBetweenHolidays) * 100
    
    const progress = document.getElementById("progress")
    progress!.style.cssText = `width: ${percentUntilNextHoliday}%;`
    texttext!.textContent = `次は${holiday.name}。前の祝日から次の祝日まで残り${Math.floor(percentUntilNextHoliday)}%`
    // pasento!.textContent = `${Math.floor(percentUntilNextHoliday)}%`
    
    // 1秒ごとに更新
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

updateHolidayInfo()
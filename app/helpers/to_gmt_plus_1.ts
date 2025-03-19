import { DateTime } from 'luxon'

export function dateToGMTplus1(date: string | Date) {
  return DateTime.fromJSDate(new Date(date), {
    zone: 'Europe/Paris',
  })
}

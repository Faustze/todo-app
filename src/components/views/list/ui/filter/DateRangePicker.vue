<template>
  <Select.Root v-model="isOpen">
    <Select.Activator v-slot="{ attrs }">
      <UiButton
        variant="outline"
        size="sm"
        v-bind="attrs"
        color="primary"
        :data-active="hasRange"
      >
        <IconCalendar size="20" />
      </UiButton>
    </Select.Activator>

    <Select.Content class="date-picker p-3 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: '280px' }">
      <!-- Header: выбор месяцев -->
      <div class="flex items-center justify-between mb-3">
        <button type="button" class="p-1 rounded hover:bg-background" @click="prevMonth">
          <IconChevronLeft size="18" />
        </button>
        <span class="text-sm font-medium">{{ monthLabel }}</span>
        <button type="button" class="p-1 rounded hover:bg-background" @click="nextMonth">
          <IconChevronRight size="18" />
        </button>
      </div>

      <!-- Недели headers -->
      <div class="date-picker__grid mb-1">
        <span
          v-for="day in weekdays"
          :key="day"
          class="date-picker__weekday"
        >
          {{ day }}
        </span>
      </div>

      <!-- Сетка дней -->
      <div class="date-picker__grid">
        <button
          v-for="cell in calendarCells"
          :key="cell.key"
          type="button"
          class="date-picker__cell"
          :class="{
            'date-picker__cell--outside': !cell.inMonth,
            'date-picker__cell--start': cell.isStart,
            'date-picker__cell--end': cell.isEnd,
            'date-picker__cell--in-range': cell.inRange,
            'date-picker__cell--today': cell.isToday,
          }"
          :disabled="!cell.inMonth"
          @click="onDayClick(cell)"
        >
          {{ cell.day }}
        </button>
      </div>

      <!-- Отображение отрезка + очистка -->
      <div class="flex items-center justify-between mt-3 pt-2 border-t border-divider">
        <span class="text-xs text-muted">
          <template v-if="range.from || range.to">
            {{ formatRange() }}
          </template>
          <template v-else>
            Выберите период
          </template>
        </span>
        <button
          v-if="range.from || range.to"
          type="button"
          class="text-xs text-primary hover:underline"
          @click="clearRange"
        >
          Сбросить
        </button>
      </div>
    </Select.Content>
  </Select.Root>
</template>

<script setup lang="ts">
import { IconCalendar, IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'
import { Select } from '@vuetify/v0'
import { computed, ref } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import { displayDate } from '@/utils/date'

interface DateCell {
  key: string
  year: number
  month: number
  day: number
  inMonth: boolean
  date: Date
  inRange: boolean
  isStart: boolean
  isEnd: boolean
  isToday: boolean
}

const today = new Date()
const todayStr = toDateStr(today)

const isOpen = defineModel<string>({ default: 'false' })

// Внутреннее хранилище диапазона
const range = ref<{ from: Date | null, to: Date | null }>({ from: null, to: null })

// Навигация месяцев (0-индекс)
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const weekdays = WEEKDAYS

const monthLabel = computed(() => {
  const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
  return `${months[currentMonth.value]} ${currentYear.value}`
})

const hasRange = computed(() => range.value.from !== null || range.value.to !== null)

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b)
    return false
  return toDateStr(a) === toDateStr(b)
}

const calendarCells = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstOfMonth = new Date(year, month, 1)
  const lastOfMonth = new Date(year, month + 1, 0)

  // Понедельник как база: Пон=0 ... Вос=6
  const startDow = (firstOfMonth.getDay() + 6) % 7

  const from = range.value.from ? stripTime(range.value.from) : null
  const to = range.value.to ? stripTime(range.value.to) : null
  const rangeStart = from && to && from > to ? to : from
  const rangeEnd = from && to && from > to ? from : to

  const cells: DateCell[] = []

  // Отступ к предыдущему месяцу
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i)
    cells.push({
      key: toDateStr(d),
      year: d.getFullYear(),
      month: d.getMonth(),
      day: prevMonthLastDay - i,
      inMonth: false,
      date: d,
      inRange: false,
      isStart: false,
      isEnd: false,
      isToday: false,
    })
  }

  // Нынешний месяц
  for (let day = 1; day <= lastOfMonth.getDate(); day++) {
    const d = new Date(year, month, day)
    const dStr = toDateStr(d)
    const stripped = stripTime(d)
    const iso = toDateStr(stripped)

    const isStart = isSameDay(range.value.from, stripped)
    const isEnd = isSameDay(range.value.to, stripped)
    const isInRange = rangeStart && rangeEnd
      ? stripped >= rangeStart && stripped <= rangeEnd
      : false

    cells.push({
      key: dStr,
      year,
      month,
      day,
      inMonth: true,
      date: d,
      inRange: isInRange && !isStart && !isEnd,
      isStart,
      isEnd,
      isToday: iso === todayStr,
    })
  }

  // Отступ для следующего месяца
  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i)
    cells.push({
      key: toDateStr(d),
      year: d.getFullYear(),
      month: d.getMonth(),
      day: i,
      inMonth: false,
      date: d,
      inRange: false,
      isStart: false,
      isEnd: false,
      isToday: false,
    })
  }

  return cells
})

function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function onDayClick(cell: DateCell): void {
  if (!cell.inMonth)
    return

  const clicked = stripTime(cell.date)
  const from = range.value.from ? stripTime(range.value.from) : null
  const to = range.value.to ? stripTime(range.value.to) : null

  if (!from || (from && to)) {
    // Начинаем новый отрезок
    range.value = { from: clicked, to: null }
  }
  else if (from && !to) {
    // Имеем начало, выбираем конец
    if (clicked < from) {
      range.value = { from: clicked, to: null }
    }
    else if (toDateStr(clicked) === toDateStr(from)) {
      range.value = { from: null, to: null }
    }
    else {
      range.value = { from, to: clicked }
      // Закрыть выбор когда отрезок выбран
      isOpen.value = 'false'
    }
  }
}

function clearRange(): void {
  range.value = { from: null, to: null }
}

function formatRange(): string {
  const { from, to } = range.value
  if (from && to)
    return `${displayDate(from)} — ${displayDate(to)}`
  if (from)
    return `от ${displayDate(from)}`
  if (to)
    return `до ${displayDate(to)}`
  return ''
}

function prevMonth(): void {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  }
  else {
    currentMonth.value--
  }
}

function nextMonth(): void {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  }
  else {
    currentMonth.value++
  }
}

// Отобразить диапазон для родительского элемента
defineExpose({ range, clearRange })
</script>

<style scoped>
  .date-picker {
    --cell-size: 36px;
  }

  .date-picker__grid {
    display: grid;
    grid-template-columns: repeat(7, var(--cell-size));
    gap: 2px;
  }

  .date-picker__weekday {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--v0-muted);
    text-align: center;
    padding: 0.25rem 0;
  }

  .date-picker__cell {
    width: var(--cell-size);
    height: var(--cell-size);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    border-radius: 0.2rem;
    cursor: pointer;
    border: none;
    background: transparent;
    color: var(--v0-on-surface);
    transition: background 0.1s ease, color 0.1s ease;
  }

  .date-picker__cell:hover:not(:disabled) {
    background: var(--v0-background);
  }

  .date-picker__cell--outside {
    color: var(--v0-muted);
    opacity: 0.4;
  }

  .date-picker__cell--today {
    border: 1px solid var(--v0-primary);
    color: var(--v0-primary);
  }

  .date-picker__cell--in-range {
    background: color-mix(in srgb, var(--v0-primary) 15%, transparent);
    border-radius: 0;
  }

  .date-picker__cell--start {
    background: var(--v0-primary);
    color: var(--v0-on-primary);
    border-radius: 0.2rem 0 0 0.2rem;
  }

  .date-picker__cell--end {
    background: var(--v0-primary);
    color: var(--v0-on-primary);
    border-radius: 0 0.2rem 0.2rem 0;
  }

  .date-picker__cell--start.date-picker__cell--end {
    border-radius: 0.2rem;
  }

  /* Активное состояние кнопки фильтра при установке диапазона */
  [data-active="true"] {
    border-color: var(--v0-primary);
    color: var(--v0-primary);
  }
</style>

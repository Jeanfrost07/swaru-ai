export const DEFAULT_SYLLABUS = `Data Structures: arrays, linked lists, stacks, queues, trees, graphs, sorting and searching
Java Programming: OOP concepts, inheritance, interfaces, exception handling, collections, multithreading
Operating Systems: process management, CPU scheduling, deadlocks, memory management, synchronization
Web Development: HTML, CSS, JavaScript, DOM, Node.js, REST APIs, React basics`

export const DEFAULT_STATE = {
  inputs: { syllabus: DEFAULT_SYLLABUS, days: 30, hours: 3 },
  plan: null,
  completed: {},
  currentDay: 1,
  reminders: { enabled: false, time: '18:00', lastNotifiedOn: null },
}

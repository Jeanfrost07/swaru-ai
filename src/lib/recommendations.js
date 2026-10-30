import { BCA_SUBJECTS } from '../data/bcaSubjects.js'
import { YOUTUBE_VIDEOS } from '../data/youtubeVideos.js'

const MAX_RECOMMENDATIONS = 6
const TOPIC_MATCH_SCORE = 3
const SUBJECT_MATCH_SCORE = 1

export function recommendVideos(tasks) {
  const topics = new Set(tasks.map((task) => task.topic))
  const subjectIds = new Set(tasks.map((task) => task.subjectId))

  return YOUTUBE_VIDEOS.map((video) => {
    const topicHits = video.topics.filter((topic) => topics.has(topic)).length
    const score =
      topicHits * TOPIC_MATCH_SCORE + (subjectIds.has(video.subjectId) ? SUBJECT_MATCH_SCORE : 0)
    return { video, score }
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RECOMMENDATIONS)
    .map(({ video }) => ({
      ...video,
      subject: BCA_SUBJECTS.find((subject) => subject.id === video.subjectId),
    }))
}

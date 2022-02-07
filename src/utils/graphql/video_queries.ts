export const failedFramesQuery = `{
  time
  likelihood
}`

export const videoFields = `{
  uid
  fileName
  tempFileName
  pageUid
  sectionUid
  finalDestination
  finalUrl
  transcoderStatus
  transcoderJobId
  intelligenceStatus
  failedFrames ${failedFramesQuery}
  isDeleted
  created
  updated
}`

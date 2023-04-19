// casting error props
export function getStatusCode(err: unknown) {
  return (err as { statusCode: number }).statusCode || 400
}

export function getMessage(err: unknown) {
  return (err as { message: string }).message || "Something went wrong"
}

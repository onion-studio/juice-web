const encoder = new TextEncoder()

export async function hashedHue(input: string): Promise<number> {
  const encoded = encoder.encode(input)
  const buf = await crypto.subtle.digest('SHA-1', encoded)
  return new Uint8Array(buf)[0]
}

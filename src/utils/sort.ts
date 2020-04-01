import { Md5 } from 'ts-md5'

export function deterministicShuffle<T>(
  arr: T[],
  salt: string,
  selector: (k: T) => string,
) {
  return [...arr].sort((item1, item2) => {
    const hashed1 = Md5.hashStr(salt + selector(item1))
    const hashed2 = Md5.hashStr(salt + selector(item2))
    if (hashed1 < hashed2) {
      return -1
    } else if (hashed1 === hashed2) {
      return 0
    } else {
      return 1
    }
  })
}

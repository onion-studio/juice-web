// 1	더불어민주당	진보
// 2	미래통합당	보수
// 3	정의당	진보
// 4	국민의당	보수
// 5	민생당	진보
// 6	우리공화당	보수
// 7	민중당	진보
// 8	친박신당	보수
// 9	녹색당	진보

export const partyNames = {
  1: '더불어민주당',
  2: '미래통합당',
  3: '정의당',
  4: '국민의당',
  5: '민생당',
  6: '우리공화당',
  7: '민중당',
  8: '친박신당',
  9: '녹색당',
} as const

export type PartyId = keyof typeof partyNames

export const partyColor: { [K in PartyId]: string } = {
  1: '#397FD3',
  2: '#EF426F',
  3: '#FFBD0A',
  4: '#FF952C',
  5: '#00A85F',
  6: '#C95352',
  7: '#F26522',
  8: '#AB2222',
  9: '#62C546',
}

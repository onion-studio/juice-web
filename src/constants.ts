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

export type PartyID = keyof typeof partyNames
export const progressiveParties: PartyID[] = [1, 3, 7, 9]
export const conservativeParties: PartyID[] = [2, 5, 6, 4, 8]

export const partyNamesWithPro: { [K in PartyID]: string } = {
  1: '더불어민주당(더불어시민당)',
  2: '미래통합당(미래한국당)',
  3: '정의당',
  4: '국민의당',
  5: '민생당',
  6: '우리공화당',
  7: '민중당',
  8: '친박신당',
  9: '녹색당',
}

export const introLinks: { [K in PartyID]: string } = {
  1: 'https://theminjoo.kr/introduce/rule',
  2: 'http://www.saenuriparty.kr/renewal/about/preamble.do',
  3: 'http://www.justice21.org/newhome/about/info02.html',
  4: 'https://peopleparty.kr/vision',
  5: 'http://minsaengdang.kr/kr/company/policy.php',
  6: 'http://orp.or.kr/main/sub_menu/sub_01_rules.php',
  7: 'http://minjungparty.com/pages/?p=275',
  8: 'https://www.pro-parknewparty.kr/wp/ethics/',
  9: 'http://www.kgreens.org/platform/',
}

export const profileLinks: { [K in PartyID]: string } = {
  1: 'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjFY&query=%EB%8D%94%EB%B6%88%EC%96%B4%EC%8B%9C%EB%AF%BC%EB%8B%B9%20%EB%B9%84%EB%A1%80%EB%8C%80%ED%91%9C%20%ED%9B%84%EB%B3%B4',
  2: 'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjFY&query=%EB%AF%B8%EB%9E%98%ED%95%9C%EA%B5%AD%EB%8B%B9%20%EB%B9%84%EB%A1%80%EB%8C%80%ED%91%9C%20%ED%9B%84%EB%B3%B4',
  3: 'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjFY&query=%EC%A0%95%EC%9D%98%EB%8B%B9%20%EB%B9%84%EB%A1%80%EB%8C%80%ED%91%9C%20%ED%9B%84%EB%B3%B4',
  4: 'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjFY&query=%EA%B5%AD%EB%AF%BC%EC%9D%98%EB%8B%B9%20%EB%B9%84%EB%A1%80%EB%8C%80%ED%91%9C%20%ED%9B%84%EB%B3%B4',
  5: 'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjFY&query=%EB%AF%BC%EC%83%9D%EB%8B%B9%20%EB%B9%84%EB%A1%80%EB%8C%80%ED%91%9C%20%ED%9B%84%EB%B3%B4',
  6: 'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjFY&query=%EC%9A%B0%EB%A6%AC%EA%B3%B5%ED%99%94%EB%8B%B9%20%EB%B9%84%EB%A1%80%EB%8C%80%ED%91%9C%20%ED%9B%84%EB%B3%B4',
  7: 'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjFY&query=%EB%AF%BC%EC%A4%91%EB%8B%B9%20%EB%B9%84%EB%A1%80%EB%8C%80%ED%91%9C%20%ED%9B%84%EB%B3%B4',
  8: 'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjFY&query=%EC%B9%9C%EB%B0%95%EC%8B%A0%EB%8B%B9%20%EB%B9%84%EB%A1%80%EB%8C%80%ED%91%9C%20%ED%9B%84%EB%B3%B4',
  9: 'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjFY&query=%EB%85%B9%EC%83%89%EB%8B%B9%20%EB%B9%84%EB%A1%80%EB%8C%80%ED%91%9C%20%ED%9B%84%EB%B3%B4',
}

export const partyColor: { [K in PartyID]: string } = {
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

export type JuiceID =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21

export const minimumIssueCount = 3
export const recommendedIssueCount = 7

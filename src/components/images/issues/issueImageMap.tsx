import { Issue } from '../../../contexts/entities'
import I01 from './01_코로나.png'
import I02 from './02_에너지.png'
import I03 from './03_미세먼지.png'
import I04 from './04_병역의무.png'
import I05 from './05_안보.png'
import I06 from './06_부정부패.png'
import I07 from './07_성범죄.png'
import I08 from './08_사회적약자.png'
import I09 from './09_주거.png'
import I10 from './10_스타트업.png'
import I11 from './11_워라밸.png'
import I12 from './12_육아.png'
import I13 from './13_정치개혁.png'
import I14 from './14_수사기관.png'
import I15 from './15_취업.png'
import I16 from './16_교육.png'
import I17 from './17_자영업자.png'
import I18 from './18_반려동물.png'
import I19 from './19_장애인.png'

export const issueImageMap: { [K in Issue['id']]: string } = {
  1: I01,
  2: I02,
  3: I03,
  4: I04,
  5: I05,
  6: I06,
  7: I07,
  8: I08,
  9: I09,
  10: I10,
  11: I11,
  12: I12,
  13: I13,
  14: I14,
  15: I15,
  16: I16,
  17: I17,
  18: I18,
  19: I19,
}

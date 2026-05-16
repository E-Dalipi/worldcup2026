import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TeamData {
  name: string;
  code: string;
  flag: string;
  groupName: string;
}

interface MatchData {
  matchNumber: number;
  date: string;
  time: string;
  stage: string;
  venue: string;
  city: string;
  homeTeam?: string;
  awayTeam?: string;
  homePlaceholder?: string;
  awayPlaceholder?: string;
}

const teams: TeamData[] = [
  // Group A
  { name: "Mexico", code: "MEX", flag: "🇲🇽", groupName: "A" },
  { name: "South Africa", code: "RSA", flag: "🇿🇦", groupName: "A" },
  { name: "South Korea", code: "KOR", flag: "🇰🇷", groupName: "A" },
  { name: "Czechia", code: "CZE", flag: "🇨🇿", groupName: "A" },
  // Group B
  { name: "Canada", code: "CAN", flag: "🇨🇦", groupName: "B" },
  { name: "Bosnia and Herzegovina", code: "BIH", flag: "🇧🇦", groupName: "B" },
  { name: "Qatar", code: "QAT", flag: "🇶🇦", groupName: "B" },
  { name: "Switzerland", code: "SUI", flag: "🇨🇭", groupName: "B" },
  // Group C
  { name: "Brazil", code: "BRA", flag: "🇧🇷", groupName: "C" },
  { name: "Morocco", code: "MAR", flag: "🇲🇦", groupName: "C" },
  { name: "Haiti", code: "HAI", flag: "🇭🇹", groupName: "C" },
  { name: "Scotland", code: "SCO", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", groupName: "C" },
  // Group D
  { name: "United States", code: "USA", flag: "🇺🇸", groupName: "D" },
  { name: "Paraguay", code: "PAR", flag: "🇵🇾", groupName: "D" },
  { name: "Australia", code: "AUS", flag: "🇦🇺", groupName: "D" },
  { name: "Turkey", code: "TUR", flag: "🇹🇷", groupName: "D" },
  // Group E
  { name: "Germany", code: "GER", flag: "🇩🇪", groupName: "E" },
  { name: "Curaçao", code: "CUW", flag: "🇨🇼", groupName: "E" },
  { name: "Ivory Coast", code: "CIV", flag: "🇨🇮", groupName: "E" },
  { name: "Ecuador", code: "ECU", flag: "🇪🇨", groupName: "E" },
  // Group F
  { name: "Netherlands", code: "NED", flag: "🇳🇱", groupName: "F" },
  { name: "Japan", code: "JPN", flag: "🇯🇵", groupName: "F" },
  { name: "Sweden", code: "SWE", flag: "🇸🇪", groupName: "F" },
  { name: "Tunisia", code: "TUN", flag: "🇹🇳", groupName: "F" },
  // Group G
  { name: "Belgium", code: "BEL", flag: "🇧🇪", groupName: "G" },
  { name: "Egypt", code: "EGY", flag: "🇪🇬", groupName: "G" },
  { name: "Iran", code: "IRN", flag: "🇮🇷", groupName: "G" },
  { name: "New Zealand", code: "NZL", flag: "🇳🇿", groupName: "G" },
  // Group H
  { name: "Spain", code: "ESP", flag: "🇪🇸", groupName: "H" },
  { name: "Cape Verde", code: "CPV", flag: "🇨🇻", groupName: "H" },
  { name: "Saudi Arabia", code: "KSA", flag: "🇸🇦", groupName: "H" },
  { name: "Uruguay", code: "URU", flag: "🇺🇾", groupName: "H" },
  // Group I
  { name: "France", code: "FRA", flag: "🇫🇷", groupName: "I" },
  { name: "Senegal", code: "SEN", flag: "🇸🇳", groupName: "I" },
  { name: "Iraq", code: "IRQ", flag: "🇮🇶", groupName: "I" },
  { name: "Norway", code: "NOR", flag: "🇳🇴", groupName: "I" },
  // Group J
  { name: "Argentina", code: "ARG", flag: "🇦🇷", groupName: "J" },
  { name: "Algeria", code: "ALG", flag: "🇩🇿", groupName: "J" },
  { name: "Austria", code: "AUT", flag: "🇦🇹", groupName: "J" },
  { name: "Jordan", code: "JOR", flag: "🇯🇴", groupName: "J" },
  // Group K
  { name: "Portugal", code: "POR", flag: "🇵🇹", groupName: "K" },
  { name: "DR Congo", code: "COD", flag: "🇨🇩", groupName: "K" },
  { name: "Uzbekistan", code: "UZB", flag: "🇺🇿", groupName: "K" },
  { name: "Colombia", code: "COL", flag: "🇨🇴", groupName: "K" },
  // Group L
  { name: "England", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", groupName: "L" },
  { name: "Croatia", code: "CRO", flag: "🇭🇷", groupName: "L" },
  { name: "Ghana", code: "GHA", flag: "🇬🇭", groupName: "L" },
  { name: "Panama", code: "PAN", flag: "🇵🇦", groupName: "L" },
];

const matches: MatchData[] = [
  // ===== GROUP STAGE =====
  // Day 1 - June 11
  { matchNumber: 1, date: "2026-06-11", time: "3:00 PM ET", stage: "Group A", venue: "Mexico City Stadium", city: "Mexico City, MEX", homeTeam: "Mexico", awayTeam: "South Africa" },
  { matchNumber: 2, date: "2026-06-11", time: "10:00 PM ET", stage: "Group A", venue: "Estadio Guadalajara", city: "Guadalajara, MEX", homeTeam: "South Korea", awayTeam: "Czechia" },
  // Day 2 - June 12
  { matchNumber: 3, date: "2026-06-12", time: "3:00 PM ET", stage: "Group B", venue: "BMO Field", city: "Toronto, CAN", homeTeam: "Canada", awayTeam: "Bosnia and Herzegovina" },
  { matchNumber: 4, date: "2026-06-12", time: "9:00 PM ET", stage: "Group D", venue: "SoFi Stadium", city: "Inglewood, CA", homeTeam: "United States", awayTeam: "Paraguay" },
  // Day 3 - June 13
  { matchNumber: 5, date: "2026-06-13", time: "3:00 PM ET", stage: "Group B", venue: "Levi's Stadium", city: "San Francisco, CA", homeTeam: "Qatar", awayTeam: "Switzerland" },
  { matchNumber: 6, date: "2026-06-13", time: "6:00 PM ET", stage: "Group C", venue: "MetLife Stadium", city: "East Rutherford, NJ", homeTeam: "Brazil", awayTeam: "Morocco" },
  { matchNumber: 7, date: "2026-06-13", time: "9:00 PM ET", stage: "Group C", venue: "Gillette Stadium", city: "Boston, MA", homeTeam: "Haiti", awayTeam: "Scotland" },
  { matchNumber: 8, date: "2026-06-14", time: "12:00 AM ET", stage: "Group D", venue: "BC Place", city: "Vancouver, CAN", homeTeam: "Australia", awayTeam: "Turkey" },
  // Day 4 - June 14
  { matchNumber: 9, date: "2026-06-14", time: "1:00 PM ET", stage: "Group E", venue: "NRG Stadium", city: "Houston, TX", homeTeam: "Germany", awayTeam: "Curaçao" },
  { matchNumber: 10, date: "2026-06-14", time: "4:00 PM ET", stage: "Group F", venue: "AT&T Stadium", city: "Arlington, TX", homeTeam: "Netherlands", awayTeam: "Japan" },
  { matchNumber: 11, date: "2026-06-14", time: "7:00 PM ET", stage: "Group E", venue: "Lincoln Financial Field", city: "Philadelphia, PA", homeTeam: "Ivory Coast", awayTeam: "Ecuador" },
  { matchNumber: 12, date: "2026-06-14", time: "10:00 PM ET", stage: "Group F", venue: "Estadio BBVA", city: "Monterrey, MEX", homeTeam: "Sweden", awayTeam: "Tunisia" },
  // Day 5 - June 15
  { matchNumber: 13, date: "2026-06-15", time: "12:00 PM ET", stage: "Group H", venue: "Mercedes-Benz Stadium", city: "Atlanta, GA", homeTeam: "Spain", awayTeam: "Cape Verde" },
  { matchNumber: 14, date: "2026-06-15", time: "3:00 PM ET", stage: "Group G", venue: "SoFi Stadium", city: "Inglewood, CA", homeTeam: "Belgium", awayTeam: "Egypt" },
  { matchNumber: 15, date: "2026-06-15", time: "6:00 PM ET", stage: "Group H", venue: "Hard Rock Stadium", city: "Miami Gardens, FL", homeTeam: "Saudi Arabia", awayTeam: "Uruguay" },
  { matchNumber: 16, date: "2026-06-15", time: "9:00 PM ET", stage: "Group G", venue: "Lumen Field", city: "Seattle, WA", homeTeam: "Iran", awayTeam: "New Zealand" },
  // Day 6 - June 16
  { matchNumber: 17, date: "2026-06-16", time: "3:00 PM ET", stage: "Group I", venue: "MetLife Stadium", city: "East Rutherford, NJ", homeTeam: "France", awayTeam: "Senegal" },
  { matchNumber: 18, date: "2026-06-16", time: "6:00 PM ET", stage: "Group I", venue: "Gillette Stadium", city: "Foxborough, MA", homeTeam: "Iraq", awayTeam: "Norway" },
  { matchNumber: 19, date: "2026-06-16", time: "9:00 PM ET", stage: "Group J", venue: "Arrowhead Stadium", city: "Kansas City, MO", homeTeam: "Argentina", awayTeam: "Algeria" },
  { matchNumber: 20, date: "2026-06-17", time: "12:00 AM ET", stage: "Group J", venue: "Levi's Stadium", city: "Santa Clara, CA", homeTeam: "Austria", awayTeam: "Jordan" },
  // Day 7 - June 17
  { matchNumber: 21, date: "2026-06-17", time: "1:00 PM ET", stage: "Group K", venue: "NRG Stadium", city: "Houston, TX", homeTeam: "Portugal", awayTeam: "DR Congo" },
  { matchNumber: 22, date: "2026-06-17", time: "4:00 PM ET", stage: "Group L", venue: "AT&T Stadium", city: "Arlington, TX", homeTeam: "England", awayTeam: "Croatia" },
  { matchNumber: 23, date: "2026-06-17", time: "7:00 PM ET", stage: "Group L", venue: "BMO Field", city: "Toronto, CAN", homeTeam: "Ghana", awayTeam: "Panama" },
  { matchNumber: 24, date: "2026-06-17", time: "10:00 PM ET", stage: "Group K", venue: "Estadio Azteca", city: "Mexico City, MEX", homeTeam: "Uzbekistan", awayTeam: "Colombia" },
  // Matchday 2 - June 18
  { matchNumber: 25, date: "2026-06-18", time: "12:00 PM ET", stage: "Group A", venue: "Mercedes-Benz Stadium", city: "Atlanta, GA", homeTeam: "Czechia", awayTeam: "South Africa" },
  { matchNumber: 26, date: "2026-06-18", time: "3:00 PM ET", stage: "Group B", venue: "SoFi Stadium", city: "Inglewood, CA", homeTeam: "Bosnia and Herzegovina", awayTeam: "Switzerland" },
  { matchNumber: 27, date: "2026-06-18", time: "6:00 PM ET", stage: "Group B", venue: "BC Place", city: "Vancouver, CAN", homeTeam: "Canada", awayTeam: "Qatar" },
  { matchNumber: 28, date: "2026-06-18", time: "9:00 PM ET", stage: "Group A", venue: "Estadio Guadalajara", city: "Guadalajara, MEX", homeTeam: "Mexico", awayTeam: "South Korea" },
  // June 19
  { matchNumber: 29, date: "2026-06-19", time: "3:00 PM ET", stage: "Group D", venue: "Lumen Field", city: "Seattle, WA", homeTeam: "United States", awayTeam: "Australia" },
  { matchNumber: 30, date: "2026-06-19", time: "6:00 PM ET", stage: "Group C", venue: "Lincoln Financial Field", city: "Philadelphia, PA", homeTeam: "Scotland", awayTeam: "Morocco" },
  { matchNumber: 31, date: "2026-06-19", time: "9:00 PM ET", stage: "Group C", venue: "Gillette Stadium", city: "Boston, MA", homeTeam: "Brazil", awayTeam: "Haiti" },
  { matchNumber: 32, date: "2026-06-20", time: "12:00 AM ET", stage: "Group D", venue: "Levi's Stadium", city: "Santa Clara, CA", homeTeam: "Turkey", awayTeam: "Paraguay" },
  // June 20
  { matchNumber: 33, date: "2026-06-20", time: "1:00 PM ET", stage: "Group F", venue: "Estadio BBVA", city: "Monterrey, MEX", homeTeam: "Tunisia", awayTeam: "Japan" },
  { matchNumber: 34, date: "2026-06-20", time: "4:00 PM ET", stage: "Group E", venue: "BMO Field", city: "Toronto, CAN", homeTeam: "Germany", awayTeam: "Ivory Coast" },
  { matchNumber: 35, date: "2026-06-20", time: "8:00 PM ET", stage: "Group E", venue: "Arrowhead Stadium", city: "Kansas City, MO", homeTeam: "Ecuador", awayTeam: "Curaçao" },
  { matchNumber: 36, date: "2026-06-21", time: "12:00 AM ET", stage: "Group F", venue: "NRG Stadium", city: "Houston, TX", homeTeam: "Netherlands", awayTeam: "Sweden" },
  // June 21
  { matchNumber: 37, date: "2026-06-21", time: "12:00 PM ET", stage: "Group H", venue: "Mercedes-Benz Stadium", city: "Atlanta, GA", homeTeam: "Spain", awayTeam: "Saudi Arabia" },
  { matchNumber: 38, date: "2026-06-21", time: "3:00 PM ET", stage: "Group G", venue: "SoFi Stadium", city: "Inglewood, CA", homeTeam: "Belgium", awayTeam: "Iran" },
  { matchNumber: 39, date: "2026-06-21", time: "6:00 PM ET", stage: "Group H", venue: "Hard Rock Stadium", city: "Miami Gardens, FL", homeTeam: "Uruguay", awayTeam: "Cape Verde" },
  { matchNumber: 40, date: "2026-06-21", time: "9:00 PM ET", stage: "Group G", venue: "BC Place", city: "Vancouver, CAN", homeTeam: "New Zealand", awayTeam: "Egypt" },
  // June 22
  { matchNumber: 41, date: "2026-06-22", time: "1:00 PM ET", stage: "Group J", venue: "AT&T Stadium", city: "Arlington, TX", homeTeam: "Argentina", awayTeam: "Austria" },
  { matchNumber: 42, date: "2026-06-22", time: "5:00 PM ET", stage: "Group I", venue: "Lincoln Financial Field", city: "Philadelphia, PA", homeTeam: "France", awayTeam: "Iraq" },
  { matchNumber: 43, date: "2026-06-22", time: "8:00 PM ET", stage: "Group I", venue: "MetLife Stadium", city: "East Rutherford, NJ", homeTeam: "Norway", awayTeam: "Senegal" },
  { matchNumber: 44, date: "2026-06-22", time: "11:00 PM ET", stage: "Group J", venue: "Levi's Stadium", city: "Santa Clara, CA", homeTeam: "Jordan", awayTeam: "Algeria" },
  // June 23
  { matchNumber: 45, date: "2026-06-23", time: "1:00 PM ET", stage: "Group K", venue: "NRG Stadium", city: "Houston, TX", homeTeam: "Portugal", awayTeam: "Uzbekistan" },
  { matchNumber: 46, date: "2026-06-23", time: "4:00 PM ET", stage: "Group L", venue: "Gillette Stadium", city: "Foxborough, MA", homeTeam: "England", awayTeam: "Ghana" },
  { matchNumber: 47, date: "2026-06-23", time: "7:00 PM ET", stage: "Group L", venue: "BMO Field", city: "Toronto, CAN", homeTeam: "Panama", awayTeam: "Croatia" },
  { matchNumber: 48, date: "2026-06-23", time: "10:00 PM ET", stage: "Group K", venue: "Estadio Akron", city: "Guadalajara, MEX", homeTeam: "Colombia", awayTeam: "DR Congo" },
  // Matchday 3 - June 24
  { matchNumber: 49, date: "2026-06-24", time: "3:00 PM ET", stage: "Group B", venue: "BC Place", city: "Vancouver, CAN", homeTeam: "Switzerland", awayTeam: "Canada" },
  { matchNumber: 50, date: "2026-06-24", time: "3:00 PM ET", stage: "Group B", venue: "Lumen Field", city: "Seattle, WA", homeTeam: "Bosnia and Herzegovina", awayTeam: "Qatar" },
  { matchNumber: 51, date: "2026-06-24", time: "6:00 PM ET", stage: "Group C", venue: "Hard Rock Stadium", city: "Miami Gardens, FL", homeTeam: "Scotland", awayTeam: "Brazil" },
  { matchNumber: 52, date: "2026-06-24", time: "6:00 PM ET", stage: "Group C", venue: "Mercedes-Benz Stadium", city: "Atlanta, GA", homeTeam: "Morocco", awayTeam: "Haiti" },
  { matchNumber: 53, date: "2026-06-24", time: "9:00 PM ET", stage: "Group A", venue: "Mexico City Stadium", city: "Mexico City, MEX", homeTeam: "Czechia", awayTeam: "Mexico" },
  { matchNumber: 54, date: "2026-06-24", time: "9:00 PM ET", stage: "Group A", venue: "Estadio Monterrey", city: "Monterrey, MEX", homeTeam: "South Africa", awayTeam: "South Korea" },
  // June 25
  { matchNumber: 55, date: "2026-06-25", time: "4:00 PM ET", stage: "Group E", venue: "MetLife Stadium", city: "East Rutherford, NJ", homeTeam: "Ecuador", awayTeam: "Germany" },
  { matchNumber: 56, date: "2026-06-25", time: "4:00 PM ET", stage: "Group E", venue: "Lincoln Financial Field", city: "Philadelphia, PA", homeTeam: "Curaçao", awayTeam: "Ivory Coast" },
  { matchNumber: 57, date: "2026-06-25", time: "7:00 PM ET", stage: "Group F", venue: "AT&T Stadium", city: "Arlington, TX", homeTeam: "Tunisia", awayTeam: "Netherlands" },
  { matchNumber: 58, date: "2026-06-25", time: "7:00 PM ET", stage: "Group F", venue: "Arrowhead Stadium", city: "Kansas City, MO", homeTeam: "Japan", awayTeam: "Sweden" },
  { matchNumber: 59, date: "2026-06-25", time: "10:00 PM ET", stage: "Group D", venue: "SoFi Stadium", city: "Inglewood, CA", homeTeam: "Turkey", awayTeam: "United States" },
  { matchNumber: 60, date: "2026-06-25", time: "10:00 PM ET", stage: "Group D", venue: "Levi's Stadium", city: "Santa Clara, CA", homeTeam: "Paraguay", awayTeam: "Australia" },
  // June 26
  { matchNumber: 61, date: "2026-06-26", time: "3:00 PM ET", stage: "Group I", venue: "Gillette Stadium", city: "Foxborough, MA", homeTeam: "Norway", awayTeam: "France" },
  { matchNumber: 62, date: "2026-06-26", time: "3:00 PM ET", stage: "Group I", venue: "BMO Field", city: "Toronto, CAN", homeTeam: "Senegal", awayTeam: "Iraq" },
  { matchNumber: 63, date: "2026-06-26", time: "8:00 PM ET", stage: "Group G", venue: "Lumen Field", city: "Seattle, WA", homeTeam: "New Zealand", awayTeam: "Belgium" },
  { matchNumber: 64, date: "2026-06-26", time: "8:00 PM ET", stage: "Group G", venue: "BC Place", city: "Vancouver, CAN", homeTeam: "Egypt", awayTeam: "Iran" },
  { matchNumber: 65, date: "2026-06-26", time: "8:00 PM ET", stage: "Group H", venue: "NRG Stadium", city: "Houston, TX", homeTeam: "Uruguay", awayTeam: "Spain" },
  { matchNumber: 66, date: "2026-06-26", time: "8:00 PM ET", stage: "Group H", venue: "Estadio Akron", city: "Guadalajara, MEX", homeTeam: "Cape Verde", awayTeam: "Saudi Arabia" },
  // June 27
  { matchNumber: 67, date: "2026-06-27", time: "5:00 PM ET", stage: "Group L", venue: "MetLife Stadium", city: "East Rutherford, NJ", homeTeam: "Panama", awayTeam: "England" },
  { matchNumber: 68, date: "2026-06-27", time: "5:00 PM ET", stage: "Group L", venue: "Lincoln Financial Field", city: "Philadelphia, PA", homeTeam: "Croatia", awayTeam: "Ghana" },
  { matchNumber: 69, date: "2026-06-27", time: "7:30 PM ET", stage: "Group K", venue: "Hard Rock Stadium", city: "Miami Gardens, FL", homeTeam: "Colombia", awayTeam: "Portugal" },
  { matchNumber: 70, date: "2026-06-27", time: "7:30 PM ET", stage: "Group K", venue: "Mercedes-Benz Stadium", city: "Atlanta, GA", homeTeam: "DR Congo", awayTeam: "Uzbekistan" },
  { matchNumber: 71, date: "2026-06-27", time: "10:00 PM ET", stage: "Group J", venue: "Arrowhead Stadium", city: "Kansas City, MO", homeTeam: "Jordan", awayTeam: "Argentina" },
  { matchNumber: 72, date: "2026-06-27", time: "10:00 PM ET", stage: "Group J", venue: "AT&T Stadium", city: "Arlington, TX", homeTeam: "Algeria", awayTeam: "Austria" },

  // ===== KNOCKOUT STAGE =====
  // Round of 32
  { matchNumber: 73, date: "2026-06-28", time: "3:00 PM ET", stage: "R32", venue: "SoFi Stadium", city: "Inglewood, CA", homePlaceholder: "2nd Group A", awayPlaceholder: "2nd Group B" },
  { matchNumber: 74, date: "2026-06-29", time: "4:30 PM ET", stage: "R32", venue: "Gillette Stadium", city: "Foxborough, MA", homePlaceholder: "1st Group E", awayPlaceholder: "3rd Place" },
  { matchNumber: 75, date: "2026-06-29", time: "9:00 PM ET", stage: "R32", venue: "Estadio BBVA", city: "Guadalupe, MEX", homePlaceholder: "1st Group F", awayPlaceholder: "2nd Group C" },
  { matchNumber: 76, date: "2026-06-29", time: "1:00 PM ET", stage: "R32", venue: "NRG Stadium", city: "Houston, TX", homePlaceholder: "1st Group C", awayPlaceholder: "2nd Group F" },
  { matchNumber: 77, date: "2026-06-30", time: "5:00 PM ET", stage: "R32", venue: "MetLife Stadium", city: "East Rutherford, NJ", homePlaceholder: "1st Group I", awayPlaceholder: "3rd Place" },
  { matchNumber: 78, date: "2026-06-30", time: "1:00 PM ET", stage: "R32", venue: "AT&T Stadium", city: "Arlington, TX", homePlaceholder: "2nd Group E", awayPlaceholder: "2nd Group I" },
  { matchNumber: 79, date: "2026-06-30", time: "9:00 PM ET", stage: "R32", venue: "Estadio Azteca", city: "Mexico City, MEX", homePlaceholder: "1st Group A", awayPlaceholder: "3rd Place" },
  { matchNumber: 80, date: "2026-07-01", time: "12:00 PM ET", stage: "R32", venue: "Mercedes-Benz Stadium", city: "Atlanta, GA", homePlaceholder: "1st Group L", awayPlaceholder: "3rd Place" },
  { matchNumber: 81, date: "2026-07-01", time: "8:00 PM ET", stage: "R32", venue: "Levi's Stadium", city: "Santa Clara, CA", homePlaceholder: "1st Group D", awayPlaceholder: "3rd Place" },
  { matchNumber: 82, date: "2026-07-01", time: "4:00 PM ET", stage: "R32", venue: "Lumen Field", city: "Seattle, WA", homePlaceholder: "1st Group G", awayPlaceholder: "3rd Place" },
  { matchNumber: 83, date: "2026-07-02", time: "7:00 PM ET", stage: "R32", venue: "BMO Field", city: "Toronto, CAN", homePlaceholder: "2nd Group K", awayPlaceholder: "2nd Group L" },
  { matchNumber: 84, date: "2026-07-02", time: "3:00 PM ET", stage: "R32", venue: "SoFi Stadium", city: "Inglewood, CA", homePlaceholder: "1st Group H", awayPlaceholder: "2nd Group J" },
  { matchNumber: 85, date: "2026-07-02", time: "11:00 PM ET", stage: "R32", venue: "BC Place", city: "Vancouver, CAN", homePlaceholder: "1st Group B", awayPlaceholder: "3rd Place" },
  { matchNumber: 86, date: "2026-07-03", time: "6:00 PM ET", stage: "R32", venue: "Hard Rock Stadium", city: "Miami Gardens, FL", homePlaceholder: "1st Group J", awayPlaceholder: "2nd Group H" },
  { matchNumber: 87, date: "2026-07-03", time: "9:30 PM ET", stage: "R32", venue: "Arrowhead Stadium", city: "Kansas City, MO", homePlaceholder: "1st Group K", awayPlaceholder: "3rd Place" },
  { matchNumber: 88, date: "2026-07-03", time: "2:00 PM ET", stage: "R32", venue: "AT&T Stadium", city: "Arlington, TX", homePlaceholder: "2nd Group D", awayPlaceholder: "2nd Group G" },
  // Round of 16
  { matchNumber: 89, date: "2026-07-04", time: "1:00 PM ET", stage: "R16", venue: "NRG Stadium", city: "Houston, TX", homePlaceholder: "W R32-M1", awayPlaceholder: "W R32-M3" },
  { matchNumber: 90, date: "2026-07-04", time: "5:00 PM ET", stage: "R16", venue: "Lincoln Financial Field", city: "Philadelphia, PA", homePlaceholder: "W R32-M2", awayPlaceholder: "W R32-M5" },
  { matchNumber: 91, date: "2026-07-05", time: "4:00 PM ET", stage: "R16", venue: "MetLife Stadium", city: "East Rutherford, NJ", homePlaceholder: "W R32-M4", awayPlaceholder: "W R32-M6" },
  { matchNumber: 92, date: "2026-07-05", time: "8:00 PM ET", stage: "R16", venue: "Estadio Azteca", city: "Mexico City, MEX", homePlaceholder: "W R32-M7", awayPlaceholder: "W R32-M8" },
  { matchNumber: 93, date: "2026-07-06", time: "3:00 PM ET", stage: "R16", venue: "AT&T Stadium", city: "Arlington, TX", homePlaceholder: "W R32-M11", awayPlaceholder: "W R32-M12" },
  { matchNumber: 94, date: "2026-07-06", time: "8:00 PM ET", stage: "R16", venue: "Lumen Field", city: "Seattle, WA", homePlaceholder: "W R32-M9", awayPlaceholder: "W R32-M10" },
  { matchNumber: 95, date: "2026-07-07", time: "12:00 PM ET", stage: "R16", venue: "Mercedes-Benz Stadium", city: "Atlanta, GA", homePlaceholder: "W R32-M14", awayPlaceholder: "W R32-M16" },
  { matchNumber: 96, date: "2026-07-07", time: "4:00 PM ET", stage: "R16", venue: "BC Place", city: "Vancouver, CAN", homePlaceholder: "W R32-M13", awayPlaceholder: "W R32-M15" },
  // Quarterfinals
  { matchNumber: 97, date: "2026-07-09", time: "4:00 PM ET", stage: "QF", venue: "Gillette Stadium", city: "Foxborough, MA", homePlaceholder: "W R16-M1", awayPlaceholder: "W R16-M2" },
  { matchNumber: 98, date: "2026-07-10", time: "3:00 PM ET", stage: "QF", venue: "SoFi Stadium", city: "Inglewood, CA", homePlaceholder: "W R16-M5", awayPlaceholder: "W R16-M6" },
  { matchNumber: 99, date: "2026-07-11", time: "5:00 PM ET", stage: "QF", venue: "Hard Rock Stadium", city: "Miami Gardens, FL", homePlaceholder: "W R16-M3", awayPlaceholder: "W R16-M4" },
  { matchNumber: 100, date: "2026-07-11", time: "9:00 PM ET", stage: "QF", venue: "Arrowhead Stadium", city: "Kansas City, MO", homePlaceholder: "W R16-M7", awayPlaceholder: "W R16-M8" },
  // Semifinals
  { matchNumber: 101, date: "2026-07-14", time: "3:00 PM ET", stage: "SF", venue: "AT&T Stadium", city: "Arlington, TX", homePlaceholder: "W QF1", awayPlaceholder: "W QF2" },
  { matchNumber: 102, date: "2026-07-15", time: "3:00 PM ET", stage: "SF", venue: "Mercedes-Benz Stadium", city: "Atlanta, GA", homePlaceholder: "W QF3", awayPlaceholder: "W QF4" },
  // Third place
  { matchNumber: 103, date: "2026-07-18", time: "5:00 PM ET", stage: "3rd", venue: "Hard Rock Stadium", city: "Miami Gardens, FL", homePlaceholder: "L SF1", awayPlaceholder: "L SF2" },
  // Final
  { matchNumber: 104, date: "2026-07-19", time: "3:00 PM ET", stage: "Final", venue: "MetLife Stadium", city: "East Rutherford, NJ", homePlaceholder: "W SF1", awayPlaceholder: "W SF2" },
];

async function main() {
  console.log("🌍 Seeding 2026 World Cup data...");

  // Clear existing data
  await prisma.highlight.deleteMany();
  await prisma.goalEvent.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();

  // Create teams
  const teamMap = new Map<string, number>();
  for (const t of teams) {
    const created = await prisma.team.create({ data: t });
    teamMap.set(t.name, created.id);
  }
  console.log(`✅ Created ${teams.length} teams`);

  // Create matches
  for (const m of matches) {
    await prisma.match.create({
      data: {
        matchNumber: m.matchNumber,
        date: m.date,
        time: m.time,
        stage: m.stage,
        venue: m.venue,
        city: m.city,
        homeTeamId: m.homeTeam ? teamMap.get(m.homeTeam) ?? null : null,
        awayTeamId: m.awayTeam ? teamMap.get(m.awayTeam) ?? null : null,
        homePlaceholder: m.homePlaceholder ?? null,
        awayPlaceholder: m.awayPlaceholder ?? null,
      },
    });
  }
  console.log(`✅ Created ${matches.length} matches`);
  console.log("🏆 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

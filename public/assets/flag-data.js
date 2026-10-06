/* Explicit spelling allowances: recognizing countries is the goal, not spelling.
   Never infer acceptance from edit distance or accept another country's name. */
globalThis.flagSpellings = {
 se:['Svergie'], dk:['Dannmark'], de:['Tysklan'], gb:['Storbrittanien','Storbritanien'],
 ca:['Canada'], ru:['Rysland'], nl:['Nederländer'], ch:['Sweiz','Schweitz'],
 at:['Österike'], lv:['Letland'], au:['Australlien'], br:['Brasillien']
};
globalThis.flagApplications = [
 {id:'flag-norden',code:'no',question:'Norges flagga följer med på vår resa. Vad heter området som Norge, Sverige och Danmark tillhör?',answer:'Norden',hint:'Områdets namn börjar på N. Det är en del av Europa.',explanation:'Norge, Sverige och Danmark ligger i Norden. Norden är en del av Europa.'},
 {id:'flag-asien',code:'jp',question:'Vi sätter Japans flagga på en världskarta. I vilken världsdel ska den sitta?',answer:'Asien',hint:'Världsdelen börjar på A. Där ligger också Kina.',explanation:'Japan ligger i Asien. Den röda cirkeln på Japans flagga föreställer solen.'},
 {id:'flag-nordamerika',code:'ca',question:'Vi sorterar flaggor efter världsdel. I vilken världsdel lägger vi Kanadas flagga?',answer:'Nordamerika',hint:'Världsdelen börjar på N. Där ligger också USA.',explanation:'Kanada ligger i Nordamerika. Kanadas flagga har ett rött lönnlöv.'}
];

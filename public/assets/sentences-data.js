const levels = [
  {
    "number": 1,
    "sentences": [
      {
        "start": "Katten",
        "words": [
          "sover",
          "på",
          "soffan"
        ],
        "actor": "🐈",
        "object": "🛋️",
        "motion": "sleep",
        "hint": "Katten tar en tupplur."
      },
      {
        "start": "Hunden",
        "words": [
          "jagar",
          "en",
          "boll"
        ],
        "actor": "🐕",
        "object": "⚽",
        "motion": "run",
        "hint": "Hunden springer efter bollen."
      },
      {
        "start": "Jag",
        "words": [
          "äter",
          "ett",
          "äpple"
        ],
        "actor": "😋",
        "object": "🍎",
        "motion": "feed",
        "hint": "Dags för en fruktstund."
      },
      {
        "start": "Vi",
        "words": [
          "läser",
          "en",
          "rolig",
          "bok"
        ],
        "actor": "🧑",
        "object": "📖",
        "motion": "bob",
        "hint": "Boken får oss att skratta."
      },
      {
        "start": "Mira",
        "words": [
          "bor",
          "i",
          "ett",
          "gult",
          "hus"
        ],
        "actor": "🏡",
        "object": "☀️",
        "motion": "bob",
        "hint": "Miras hus är gult."
      },
      {
        "start": "Fågeln",
        "words": [
          "flyger",
          "över",
          "trädet"
        ],
        "actor": "🐦",
        "object": "🌳",
        "motion": "swim",
        "hint": "Fågeln är ovanför trädet."
      },
      {
        "start": "Barnen",
        "words": [
          "leker",
          "i",
          "parken"
        ],
        "actor": "🛝",
        "object": "🌳",
        "motion": "sway",
        "hint": "Barnen har roligt utomhus."
      },
      {
        "start": "Pappa",
        "words": [
          "bakar",
          "goda",
          "bullar"
        ],
        "actor": "👨‍🍳",
        "object": "🥐",
        "motion": "sway",
        "hint": "Det doftar gott i köket."
      },
      {
        "start": "Kaninen",
        "words": [
          "äter",
          "en",
          "stor",
          "morot"
        ],
        "actor": "🐇",
        "object": "🥕",
        "motion": "feed",
        "hint": "Kaninen är hungrig."
      },
      {
        "start": "Leo",
        "words": [
          "cyklar",
          "till",
          "skolan"
        ],
        "actor": "🚴",
        "object": "🏫",
        "motion": "ride",
        "hint": "Leo tar cykeln på morgonen."
      },
      {
        "start": "Vi",
        "words": [
          "bygger",
          "ett",
          "högt",
          "torn"
        ],
        "actor": "🧱",
        "object": "🏗️",
        "motion": "grow",
        "hint": "Byggklossarna staplas på varandra."
      },
      {
        "start": "Mormor",
        "words": [
          "planterar",
          "röda",
          "blommor"
        ],
        "actor": "👵",
        "object": "🌷",
        "motion": "sway",
        "hint": "Blommorna ska ner i jorden."
      },
      {
        "start": "Nu",
        "words": [
          "sover",
          "katten"
        ],
        "actor": "🐈",
        "object": "💤",
        "motion": "sleep",
        "hint": "Katten har precis somnat."
      },
      {
        "start": "Snart",
        "words": [
          "kommer",
          "bussen"
        ],
        "actor": "🚌",
        "object": "⏱️",
        "motion": "ride",
        "hint": "Vi väntar vid hållplatsen."
      },
      {
        "start": "Sedan",
        "words": [
          "går",
          "vi",
          "hem"
        ],
        "actor": "🚶",
        "object": "🏠",
        "motion": "ride",
        "hint": "Leken är slut för i dag."
      }
    ]
  },
  {
    "number": 2,
    "sentences": [
      {
        "start": "",
        "words": [
          "Den",
          "lilla",
          "katten",
          "sover",
          "på",
          "den",
          "mjuka",
          "soffan"
        ],
        "actor": "🐈",
        "object": "🛋️",
        "motion": "sleep",
        "hint": "En liten katt har hittat en mjuk sovplats.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "Min",
          "bästa",
          "vän",
          "har",
          "en",
          "röd",
          "cykel"
        ],
        "actor": "🧑",
        "object": "🚲",
        "motion": "bob",
        "hint": "Din väns cykel är röd.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "Vi",
          "bygger",
          "ett",
          "högt",
          "torn",
          "av",
          "klossar"
        ],
        "actor": "🧱",
        "object": "🏗️",
        "motion": "grow",
        "hint": "Klossarna staplas till ett torn.",
        "alternatives": [
          [
            "Vi",
            "bygger",
            "av",
            "klossar",
            "ett",
            "högt",
            "torn"
          ]
        ]
      },
      {
        "start": "",
        "words": [
          "Pappa",
          "läser",
          "en",
          "rolig",
          "bok",
          "för",
          "oss"
        ],
        "actor": "👨",
        "object": "📖",
        "motion": "bob",
        "hint": "Vi lyssnar när pappa läser.",
        "alternatives": [
          [
            "Pappa",
            "läser",
            "för",
            "oss",
            "en",
            "rolig",
            "bok"
          ]
        ]
      },
      {
        "start": "",
        "words": [
          "Hunden",
          "springer",
          "efter",
          "den",
          "blå",
          "bollen"
        ],
        "actor": "🐕",
        "object": "🔵",
        "motion": "run",
        "hint": "Hunden försöker fånga en blå boll.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "På",
          "morgonen",
          "äter",
          "vi",
          "gröt",
          "till",
          "frukost"
        ],
        "actor": "🥣",
        "object": "☀️",
        "motion": "bob",
        "hint": "Dagen börjar med gröt.",
        "alternatives": [
          [
            "På",
            "morgonen",
            "äter",
            "vi",
            "till",
            "frukost",
            "gröt"
          ]
        ]
      },
      {
        "start": "",
        "words": [
          "I",
          "trädgården",
          "växer",
          "det",
          "många",
          "gula",
          "blommor"
        ],
        "actor": "🌻",
        "object": "🌻",
        "motion": "sway",
        "hint": "Trädgården är full av gula blommor.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "Barnen",
          "leker",
          "tillsammans",
          "på",
          "den",
          "stora",
          "lekplatsen"
        ],
        "actor": "🛝",
        "object": "🧒",
        "motion": "sway",
        "hint": "Alla barnen är på samma lekplats.",
        "alternatives": [
          [
            "Barnen",
            "leker",
            "på",
            "den",
            "stora",
            "lekplatsen",
            "tillsammans"
          ]
        ]
      },
      {
        "start": "",
        "words": [
          "Mormor",
          "bakar",
          "varma",
          "bullar",
          "till",
          "hela",
          "familjen"
        ],
        "actor": "👵",
        "object": "🥐",
        "motion": "sway",
        "hint": "Alla i familjen ska få bullar.",
        "alternatives": [
          [
            "Mormor",
            "bakar",
            "till",
            "hela",
            "familjen",
            "varma",
            "bullar"
          ]
        ]
      },
      {
        "start": "",
        "words": [
          "Den",
          "nyfikna",
          "hunden",
          "hittar",
          "en",
          "liten",
          "boll"
        ],
        "actor": "🐕",
        "object": "⚽",
        "motion": "bob",
        "hint": "En hund upptäcker en liten boll.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "Snart",
          "ska",
          "vi",
          "åka",
          "till",
          "simhallen"
        ],
        "actor": "🚌",
        "object": "🏊",
        "motion": "ride",
        "hint": "Det är nästan dags att åka och bada.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "Jag",
          "packar",
          "en",
          "smörgås",
          "i",
          "min",
          "väska"
        ],
        "actor": "🥪",
        "object": "🎒",
        "motion": "move",
        "hint": "Smörgåsen ska följa med i väskan.",
        "alternatives": [
          [
            "Jag",
            "packar",
            "i",
            "min",
            "väska",
            "en",
            "smörgås"
          ]
        ]
      },
      {
        "start": "",
        "words": [
          "Efter",
          "skolan",
          "går",
          "vi",
          "till",
          "den",
          "stora",
          "parken"
        ],
        "actor": "🚶",
        "object": "🌳",
        "motion": "ride",
        "hint": "Vi besöker parken när skoldagen är slut.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "På",
          "kvällen",
          "läser",
          "jag",
          "i",
          "min",
          "bok"
        ],
        "actor": "📖",
        "object": "🌙",
        "motion": "bob",
        "hint": "Jag läser när det börjar bli mörkt.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "Kaninen",
          "sitter",
          "under",
          "det",
          "lilla",
          "bordet"
        ],
        "actor": "🐇",
        "object": "🪑",
        "motion": "bob",
        "hint": "Kaninen har satt sig under ett litet bord.",
        "alternatives": []
      }
    ]
  },
  {
    "number": 3,
    "sentences": [
      {
        "start": "",
        "words": [
          "Fastän",
          "jag",
          "är",
          "hungrig",
          "åt",
          "jag",
          "inte",
          "så",
          "mycket"
        ],
        "actor": "😋",
        "object": "🍽️",
        "motion": "feed",
        "hint": "Jag är hungrig, men åt ändå bara lite.",
        "alternatives": [
          [
            "Fastän",
            "jag",
            "är",
            "hungrig",
            "åt",
            "inte",
            "jag",
            "så",
            "mycket"
          ]
        ]
      },
      {
        "start": "",
        "words": [
          "Anna",
          "befann",
          "sig",
          "på",
          "fel",
          "buss"
        ],
        "actor": "🧑",
        "object": "🚌",
        "motion": "ride",
        "hint": "Anna hade råkat kliva på en annan buss.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "När",
          "regnet",
          "slutade",
          "gick",
          "vi",
          "ut",
          "för",
          "att",
          "leka"
        ],
        "actor": "🌦️",
        "object": "🛝",
        "motion": "bob",
        "hint": "Vi väntade på att regnet skulle sluta.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "Jag",
          "tog",
          "på",
          "mig",
          "jackan",
          "eftersom",
          "det",
          "var",
          "kallt"
        ],
        "actor": "🧥",
        "object": "❄️",
        "motion": "shiver",
        "hint": "Kylan gjorde att jag behövde en jacka.",
        "alternatives": [
          [
            "Jag",
            "tog",
            "jackan",
            "på",
            "mig",
            "eftersom",
            "det",
            "var",
            "kallt"
          ]
        ]
      },
      {
        "start": "",
        "words": [
          "Om",
          "du",
          "vill",
          "kan",
          "vi",
          "bygga",
          "en",
          "koja",
          "tillsammans"
        ],
        "actor": "🛖",
        "object": "🧑",
        "motion": "grow",
        "hint": "Vi kan hjälpas åt att bygga om du vill.",
        "alternatives": [
          [
            "Om",
            "du",
            "vill",
            "kan",
            "vi",
            "tillsammans",
            "bygga",
            "en",
            "koja"
          ],
          [
            "Om",
            "du",
            "vill",
            "kan",
            "vi",
            "bygga",
            "tillsammans",
            "en",
            "koja"
          ]
        ]
      },
      {
        "start": "",
        "words": [
          "Trots",
          "att",
          "det",
          "regnade",
          "fortsatte",
          "vi",
          "att",
          "spela",
          "fotboll"
        ],
        "actor": "🌧️",
        "object": "⚽",
        "motion": "bob",
        "hint": "Regnet stoppade inte vår fotbollsmatch.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "Innan",
          "vi",
          "gick",
          "hem",
          "plockade",
          "vi",
          "undan",
          "alla",
          "leksaker"
        ],
        "actor": "🧸",
        "object": "📦",
        "motion": "move",
        "hint": "Vi städade klart innan vi gick hem.",
        "alternatives": [
          [
            "Innan",
            "vi",
            "gick",
            "hem",
            "plockade",
            "vi",
            "alla",
            "leksaker",
            "undan"
          ]
        ]
      },
      {
        "start": "",
        "words": [
          "Hunden",
          "som",
          "låg",
          "under",
          "bordet",
          "väntade",
          "på",
          "sin",
          "mat"
        ],
        "actor": "🐕",
        "object": "🥣",
        "motion": "rest",
        "hint": "Hunden väntar på maten från sin plats under bordet.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "Eftersom",
          "bussen",
          "var",
          "sen",
          "kom",
          "vi",
          "för",
          "sent"
        ],
        "actor": "🚌",
        "object": "⏰",
        "motion": "ride",
        "hint": "En försenad buss gjorde att vi inte hann i tid.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "När",
          "jag",
          "öppnade",
          "dörren",
          "sprang",
          "katten",
          "ut",
          "i",
          "trädgården"
        ],
        "actor": "🐈",
        "object": "🌳",
        "motion": "run",
        "hint": "Katten passade på när dörren öppnades.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "Vi",
          "hittade",
          "boken",
          "som",
          "hade",
          "försvunnit",
          "bakom",
          "soffan"
        ],
        "actor": "📖",
        "object": "🛋️",
        "motion": "hide",
        "hint": "Den borttappade boken låg bakom soffan.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "Fastän",
          "väskan",
          "var",
          "tung",
          "bar",
          "hon",
          "den",
          "hela",
          "vägen"
        ],
        "actor": "🧑",
        "object": "🧳",
        "motion": "move",
        "hint": "Hon bar väskan ända fram utan att ge upp.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "Jag",
          "undrade",
          "varför",
          "lampan",
          "fortfarande",
          "lyste",
          "i",
          "det",
          "tomma",
          "rummet"
        ],
        "actor": "💡",
        "object": "🚪",
        "motion": "twinkle",
        "hint": "Ingen var i rummet, men lampan var fortfarande tänd.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "Medan",
          "brödet",
          "gräddades",
          "dukade",
          "vi",
          "bordet",
          "i",
          "köket"
        ],
        "actor": "🍞",
        "object": "🍽️",
        "motion": "sway",
        "hint": "Vi gjorde i ordning bordet medan brödet var i ugnen.",
        "alternatives": []
      },
      {
        "start": "",
        "words": [
          "När",
          "filmen",
          "var",
          "slut",
          "ville",
          "ingen",
          "gå",
          "hem"
        ],
        "actor": "🎬",
        "object": "🏠",
        "motion": "bob",
        "hint": "Alla ville stanna även efter filmen.",
        "alternatives": []
      }
    ]
  }
];

levels.forEach((level,l) => level.sentences.forEach((item,i) => {item.id = `sentence-${l+1}-${i+1}`;}));
// Additional readings with the same tiles; no general grammar checker is implied.
const additionalOrders = {
 'sentence-2-3':['Vi bygger av klossar ett högt torn'],
 'sentence-2-4':['Pappa läser för oss en rolig bok'],
 'sentence-2-8':['Barnen leker på den stora lekplatsen tillsammans'],
 'sentence-3-8':['Hunden som väntade på sin mat låg under bordet'],
 'sentence-3-11':['Vi hittade bakom soffan boken som hade försvunnit','Vi hittade boken bakom soffan som hade försvunnit'],
 'sentence-3-13':['Jag undrade varför lampan i det tomma rummet fortfarande lyste'],
 'sentence-3-14':['Medan brödet gräddades i köket dukade vi bordet']
};
for(const level of levels)for(const item of level.sentences){
 for(const text of additionalOrders[item.id]||[]){
  const order=text.split(' ');item.alternatives ||= [];
  if(!item.alternatives.some(a=>a.join(' ')===text))item.alternatives.push(order);
 }
}
// Explicitly retain the user's example: the hunger can continue into the present.
levels[2].sentences[0].hint='Jag är hungrig nu, men åt ändå inte så mycket.';
levels[2].sentences[7].hint='Berätta om hunden under bordet och maten den väntade på.';
levels[2].sentences[10].hint='Vi hittar en bok. Använd orden för att berätta om boken och soffan.';
levels[2].sentences[13].hint='Berätta om brödet, dukningen och köket.';
const sentenceApplications = [
 [{id:'sentence-use-1',start:'Jag',words:['hittade','en','vante'],actor:'🧤',object:'🔎',motion:'bob',hint:'Berätta att du hittade en vante.',alternatives:[]}],
 [{id:'sentence-use-2',start:'',words:['I','morgon','ska','vi','åka','på','utflykt'],actor:'🎒',object:'🌳',motion:'bob',hint:'Berätta om morgondagens utflykt.',alternatives:[]}],
 [{id:'sentence-use-3',start:'',words:['Fastän','det','regnade','gick','vi','ut'],actor:'🌧️',object:'🥾',motion:'bob',hint:'Det regnade. Ändå gick vi ut.',alternatives:[]}]
];

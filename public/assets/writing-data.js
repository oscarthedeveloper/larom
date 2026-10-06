globalThis.writingTasks = [
  {
    "title": "Skriv ett ord",
    "instruction": "Skriv ordet katt.",
    "initial": "",
    "answer": "katt",
    "hint": "Använd bokstavstangenterna.",
    "id": "writing-word",
    "focus": "word",
    "explanation": "Du skrev ordet katt."
  },
  {
    "title": "Stor bokstav",
    "instruction": "Skriv namnet Anna med stor första bokstav.",
    "initial": "",
    "answer": "Anna",
    "hint": "Håll Skift medan du trycker på A, eller använd skärmtangentbordets pil upp.",
    "id": "writing-capital",
    "focus": "capital",
    "explanation": "Namn börjar med stor bokstav: Anna."
  },
  {
    "title": "Mellanrum",
    "instruction": "Skriv två ord med ett mellanslag: hej du.",
    "initial": "",
    "answer": "hej du",
    "hint": "Mellanslag gör mellanrum mellan ord.",
    "id": "writing-space",
    "focus": "space",
    "explanation": "Ett mellanslag skiljer de två orden åt."
  },
  {
    "title": "Sudda ett tecken",
    "instruction": "Ta bort det sista t:et så att ordet blir katt.",
    "initial": "kattt",
    "answer": "katt",
    "hint": "Du kan sätta markören efter sista bokstaven och använda Backsteg. Det går också att markera ett t och ta bort det.",
    "id": "writing-delete",
    "focus": "delete",
    "explanation": "Du tog bort en överflödig bokstav."
  },
  {
    "title": "Byt bokstav",
    "instruction": "Ändra mus till hus.",
    "initial": "mus",
    "answer": "hus",
    "hint": "Markera m och skriv h, eller sudda m och skriv h.",
    "id": "writing-replace-letter",
    "focus": "replace-letter",
    "explanation": "Du ändrade första bokstaven. Ett nytt ord fick en ny betydelse."
  },
  {
    "title": "Lägg till ett ord",
    "instruction": "Skriv ordet röd mellan en och bil.",
    "initial": "en bil",
    "answer": "en röd bil",
    "hint": "Sätt markören före bil och skriv röd följt av ett mellanslag.",
    "id": "writing-insert",
    "focus": "insert",
    "explanation": "Ordet röd berättar vilken färg bilen har."
  },
  {
    "title": "En punkt",
    "instruction": "Lägg till en punkt i slutet av meningen.",
    "initial": "Jag gillar päron",
    "answer": "Jag gillar päron.",
    "hint": "En mening kan avslutas med en punkt.",
    "id": "writing-period",
    "focus": "period",
    "explanation": "Punkten visar var meningen slutar."
  },
  {
    "title": "Två rader",
    "instruction": "Skriv Hej på första raden och Anna på nästa rad.",
    "initial": "",
    "answer": "Hej\nAnna",
    "hint": "Enter gör en ny rad i den här skrivrutan.",
    "id": "writing-lines",
    "focus": "lines",
    "explanation": "En radbrytning flyttar nästa ord till en ny rad."
  },
  {
    "title": "Byt ett ord",
    "instruction": "Byt ordet hund mot katt.",
    "initial": "Min hund sover.",
    "answer": "Min katt sover.",
    "hint": "Markera hund och skriv katt. Resten ska vara kvar.",
    "id": "writing-replace-word",
    "focus": "replace-word",
    "explanation": "Du bytte ett ord och behöll resten av meningen."
  },
  {
    "title": "Fixa meningen",
    "instruction": "Gör första bokstaven stor och lägg till en punkt.",
    "initial": "vi leker ute",
    "answer": "Vi leker ute.",
    "hint": "Ändra v till V och sätt en punkt efter ute.",
    "id": "writing-sentence",
    "focus": "sentence",
    "explanation": "Meningen börjar med stor bokstav och slutar med punkt."
  }
];

globalThis.writingApplications = [
  {
    "id": "writing-invitation",
    "title": "Rätta inbjudan",
    "instruction": "Inbjudan är till Amir och träffen börjar klockan 15. Byt Ella mot Amir och 14 mot 15. Behåll resten av texten.",
    "initial": "Hej Ella! Vi ses klockan 14.",
    "answer": "Hej Amir! Vi ses klockan 15.",
    "hint": "Ändra namnet och siffrorna. Resten av inbjudan ska stå kvar.",
    "focus": "invitation",
    "explanation": "Du ändrade både mottagaren och tiden utan att skriva om resten."
  },
  {
    "id": "writing-packing",
    "title": "Gör en packlista",
    "instruction": "Skriv mössa, vatten och frukt i den ordningen, ett ord på varje rad. Du får börja varje rad med liten eller stor bokstav. Inga punkter behövs.",
    "initial": "",
    "answer": "mössa\nvatten\nfrukt",
    "hint": "Tryck Enter efter mössa och efter vatten så att listan får tre rader.",
    "focus": "packing",
    "explanation": "Ett ord på varje rad gör listan lätt att följa.",
    "alternatives": [
      "mössa\nvatten\nFrukt",
      "mössa\nVatten\nfrukt",
      "mössa\nVatten\nFrukt",
      "Mössa\nvatten\nfrukt",
      "Mössa\nvatten\nFrukt",
      "Mössa\nVatten\nfrukt",
      "Mössa\nVatten\nFrukt"
    ]
  },
  {
    "id": "writing-message",
    "title": "Gör meddelandet tydligt",
    "instruction": "Börja med stor bokstav och avsluta med en punkt. Behåll orden i meddelandet.",
    "initial": "jag kommer efter maten",
    "answer": "Jag kommer efter maten.",
    "hint": "Kontrollera första bokstaven och tecknet efter sista ordet.",
    "focus": "sentence",
    "explanation": "Stor bokstav visar början och punkten visar slutet på meddelandet."
  }
];

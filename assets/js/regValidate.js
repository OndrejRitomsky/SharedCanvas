$(function()  {
  $("#register").formValidation({             // Volame nas plugin, ktory je v subore form_validation.js
    "login": [                           // Prvok username a jeho validacne pravidla
      ["required"],                       // Musi mat nejaku hodnotu
      ["min_length", 5],                  // Hodnota musi mat aspon 5 znakov
      ["max_length", 20],                 // Ale nie viac ako 20
      ["alphanumeric"]                    // Musi byt alfanumericka
    ],
    "password": [
      ["required"],                       // Heslo musi byt
      ["min_length", 5]                   // Ale nech ma aspon 5 znakov
    ],
    "password2": [
      ["required"],                       // Heslo musi byt znova
      ["min_length", 5],                  // Opat aspon 5 znakov
      ["matches", "password"]             // A musi sa rovnat prvemu heslu
    ],
    "nickname": [
      ["min_length", 3]                   // Meno byt nemusi, ale aspon 3 pismena musi mat (ak bude prazdne, validacia bude OK)
    ]

  });
});
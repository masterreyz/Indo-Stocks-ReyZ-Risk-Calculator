function NewLine(text, isPrompt, className = "result-line") {

  if (CurrentId !== undefined) {

    $("#" + CurrentId + " input")
      .prop("disabled", true);

  }


  CurrentId =
    "consoleInput-" +
    GenerateId();


  if (isPrompt) {

    const cleanText =
      text
        .replace(/:\s*$/, "")
        .trim();


    $("#Content").append(`
      <div
        id="${CurrentId}"
        class="login-line"
      >

        <span class="prompt-label">
          ${cleanText}
        </span>

        <span class="prompt-colon">
          :
        </span>

        <input
          class="terminal-input"
          type="text"
          autocomplete="off"
        >

      </div>
    `);


    $("#" + CurrentId + " input")
      .focus();

  }

  else {

    $("#Content").append(`
      <div class="${className}">
        ${text}
      </div>
    `);

  }

}

function ResultLine(label, value) {

  $("#Content").append(`
    <div class="result-line">

      <span class="result-label">
        ${label}
      </span>

      <span class="result-colon">
        :
      </span>

      <span class="result-value">
        ${value}
      </span>

    </div>
  `);

}

ResultLine(
  "Risk dalam trade tersebut",
  `${(percentageRisk * 100).toFixed(2)} %`
);

ResultLine(
  `Max buy ${ticker}`,
  `${maxBuyLot} lot`
);

ResultLine(
  "Total uang yang dikeluarkan",
  formatRupiah(grossBuy)
);

ResultLine(
  "Uang yang tersisa kalau Cut Loss",
  formatRupiah(grossSell)
);

ResultLine(
  "Realized loss scenario",
  formatRupiah(realizedLoss)
);

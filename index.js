// ==========================================================
// REYZ INDO STOCKS RISK CALCULATOR
// ==========================================================


// ==========================================================
// VARIABLES
// ==========================================================

let CurrentId = undefined;

let inputValues = [];

const inputPrompts = [
  "Saham apa yang ingin dibeli?",
  "Harga Entry Saham tersebut:",
  "Harga Stop Loss saham tersebut di:",
  "Max Risk dalam posisi tersebut: Rp"
];


// ==========================================================
// CONSTANTS
// ==========================================================

const BUY_FEE = 0.15 / 100;
const SELL_FEE = 0.25 / 100;
const SHARES_PER_LOT = 100;


// ==========================================================
// DOCUMENT READY
// ==========================================================

$(document).ready(function () {

  // ========================================================
  // CALCULATE BUTTON
  // ========================================================

  $("#run-button").on("click", function () {

    // Reset data
    inputValues = [];
    CurrentId = undefined;

    // Clear initial content
    $("#Content").empty();

    // Welcome message
    WelcomeLine(
      "Welcome to ReyZ Indo Stocks Risk Calculator"
    );

    // First input
    NewLine(
      inputPrompts[0],
      true
    );

  });

});


// ==========================================================
// ENTER KEY
// ==========================================================

$(document).on("keydown", function (event) {

  if (event.key !== "Enter") {
    return;
  }

  if (CurrentId === undefined) {
    return;
  }


  const currentInput =
    $("#" + CurrentId + " input");


  // Jangan proses kalau input sudah disabled
  if (currentInput.prop("disabled")) {
    return;
  }


  const value =
    currentInput.val().trim();


  // Jangan menerima input kosong
  if (value === "") {
    currentInput.focus();
    return;
  }


  // Simpan value
  inputValues.push(value);


  // Disable input yang sudah selesai
  currentInput.prop(
    "disabled",
    true
  );


  // ========================================================
  // JIKA SEMUA INPUT SUDAH DIISI
  // ========================================================

  if (
    inputValues.length ===
    inputPrompts.length
  ) {

    calculateRisk();

    return;

  }


  // ========================================================
  // NEXT INPUT
  // ========================================================

  NewLine(
    inputPrompts[inputValues.length],
    true
  );

});


// ==========================================================
// AUTO FOCUS INPUT
// ==========================================================

$(document).on(
  "click",
  ".login-line",
  function () {

    const input =
      $(this).find("input");


    if (!input.prop("disabled")) {
      input.focus();
    }

  }
);


// ==========================================================
// AUTO UPPERCASE TICKER
// ==========================================================

$(document).on(
  "input",
  ".terminal-input",
  function () {

    // Hanya input pertama / ticker
    if (inputValues.length === 0) {

      this.value =
        this.value
          .toUpperCase()
          .replace(
            /[^A-Z0-9]/g,
            ""
          );

    }

  }
);


// ==========================================================
// CALCULATE RISK
// ==========================================================

function calculateRisk() {

  // ========================================================
  // GET VALUES
  // ========================================================

  const ticker =
    inputValues[0]
      .toUpperCase();


  const entryPrice =
    Number(
      inputValues[1]
        .replace(/\./g, "")
        .replace(/,/g, "")
    );


  const stopLoss =
    Number(
      inputValues[2]
        .replace(/\./g, "")
        .replace(/,/g, "")
    );


  const willingRisk =
    Number(
      inputValues[3]
        .replace(/\./g, "")
        .replace(/,/g, "")
    );


  // ========================================================
  // VALIDATION
  // ========================================================

  if (!ticker) {

    ErrorLine(
      "Ticker saham tidak boleh kosong."
    );

    return;

  }


  if (
    !Number.isFinite(entryPrice) ||
    entryPrice <= 0
  ) {

    ErrorLine(
      "Harga Entry harus berupa angka lebih besar dari 0."
    );

    return;

  }


  if (
    !Number.isFinite(stopLoss) ||
    stopLoss <= 0
  ) {

    ErrorLine(
      "Harga Stop Loss harus berupa angka lebih besar dari 0."
    );

    return;

  }


  if (
    !Number.isFinite(willingRisk) ||
    willingRisk <= 0
  ) {

    ErrorLine(
      "Maximum Risk harus berupa angka lebih besar dari 0."
    );

    return;

  }


  if (stopLoss >= entryPrice) {

    ErrorLine(
      "Harga Stop Loss harus lebih rendah dari Harga Entry."
    );

    return;

  }


  // ========================================================
  // RISK PERCENTAGE
  // Python:
  //
  // percentage_risk =
  // (entry_price - exit_price) / entry_price
  // ========================================================

  const percentageRisk =
    (
      entryPrice -
      stopLoss
    ) /
    entryPrice;


  // ========================================================
  // MAX BUY LOT
  //
  // Python:
  //
  // math.floor(
  // willing_risk /
  // (percentage_risk * entry_price)
  // / 100
  // )
  // ========================================================

  const maxBuyLot =
    Math.floor(

      willingRisk /

      (
        percentageRisk *
        entryPrice
      ) /

      SHARES_PER_LOT

    );


  // ========================================================
  // VALIDATION LOT
  // ========================================================

  if (maxBuyLot < 1) {

    ErrorLine(
      "Maximum Risk terlalu kecil untuk membeli minimal 1 lot."
    );

    return;

  }


  // ========================================================
  // TOTAL SHARES
  // ========================================================

  const totalShares =
    maxBuyLot *
    SHARES_PER_LOT;


  // ========================================================
  // GROSS BUY
  //
  // Buy Fee = 0.15%
  // ========================================================

  const buyValue =
    entryPrice *
    totalShares;


  const grossBuy =
    buyValue +
    (
      BUY_FEE *
      buyValue
    );


  // ========================================================
  // GROSS SELL
  //
  // Sell Fee = 0.25%
  // ========================================================

  const sellValue =
    stopLoss *
    totalShares;


  const grossSell =
    sellValue -
    (
      SELL_FEE *
      sellValue
    );


  // ========================================================
  // REALIZED LOSS
  // ========================================================

  const realizedLoss =
    grossBuy -
    grossSell;


  // ========================================================
  // OUTPUT
  // ========================================================

  Separator();


  ResultLine(
    "Risk dalam trade tersebut",
    `${formatPercentage(
      percentageRisk
    )}`
  );


  ResultLine(
    `Max buy ${ticker}`,
    `${formatNumber(
      maxBuyLot
    )} lot`
  );


  ResultLine(
    "Total uang yang dikeluarkan",
    formatRupiah(
      grossBuy
    )
  );


  ResultLine(
    "Uang yang tersisa kalau Cut Loss",
    formatRupiah(
      grossSell
    )
  );


  ResultLine(
    "Realized loss scenario",
    formatRupiah(
      realizedLoss
    )
  );


  Separator();

}


// ==========================================================
// NEW INPUT LINE
// ==========================================================

function NewLine(
  text,
  isPrompt,
  className = "result-line"
) {

  // Disable previous input
  if (
    CurrentId !== undefined
  ) {

    $("#" + CurrentId + " input")
      .prop(
        "disabled",
        true
      );

  }


  CurrentId =
    "consoleInput-" +
    GenerateId();


  // ========================================================
  // PROMPT
  // ========================================================

  if (isPrompt) {

    // Hapus ":" atau "Rp" terakhir agar
    // titik dua dibuat oleh kolom sendiri

    let cleanText =
      text.trim();


    cleanText =
      cleanText
        .replace(
          /:\s*Rp\s*$/i,
          ""
        )
        .replace(
          /:\s*$/,
          ""
        )
        .trim();


    // Untuk maximum risk
    const isRupiah =
      text
        .toLowerCase()
        .includes("rp");


    $("#Content").append(`

      <div
        id="${CurrentId}"
        class="login-line"
      >

        <span
          class="prompt-label"
        >
          ${cleanText}
        </span>


        <span
          class="prompt-colon"
        >
          :
        </span>


        <div class="input-container">

          ${
            isRupiah
              ?
              `
              <span class="currency-prefix">
                Rp
              </span>
              `
              :
              ""
          }

          <input
            class="terminal-input"
            type="text"
            autocomplete="off"
            inputmode="${
              inputValues.length === 0
                ?
                "text"
                :
                "numeric"
            }"
          >

        </div>

      </div>

    `);


    // Focus input
    $("#" + CurrentId + " input")
      .focus();

  }


  // ========================================================
  // NORMAL LINE
  // ========================================================

  else {

    $("#Content").append(`

      <div
        class="${className}"
      >
        ${text}
      </div>

    `);

  }

}


// ==========================================================
// WELCOME LINE
// ==========================================================

function WelcomeLine(text) {

  $("#Content").append(`

    <div class="welcome-line">

      ${text}

    </div>

  `);

}


// ==========================================================
// RESULT LINE
// ==========================================================

function ResultLine(
  label,
  value
) {

  $("#Content").append(`

    <div class="result-line">

      <span
        class="result-label"
      >
        ${label}
      </span>


      <span
        class="result-colon"
      >
        :
      </span>


      <span
        class="result-value"
      >
        ${value}
      </span>

    </div>

  `);

}


// ==========================================================
// SEPARATOR
// ==========================================================

function Separator() {

  $("#Content").append(`

    <div class="separator"></div>

  `);

}


// ==========================================================
// ERROR
// ==========================================================

function ErrorLine(text) {

  $("#Content").append(`

    <div class="error-line">

      ${text}

    </div>

  `);

}


// ==========================================================
// FORMAT RUPIAH
// ==========================================================

function formatRupiah(number) {

  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",

      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  ).format(
    Math.round(number)
  );

}


// ==========================================================
// FORMAT NUMBER
// ==========================================================

function formatNumber(number) {

  return new Intl.NumberFormat(
    "id-ID"
  ).format(number);

}


// ==========================================================
// FORMAT PERCENTAGE
// ==========================================================

function formatPercentage(decimal) {

  return new Intl.NumberFormat(
    "id-ID",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ).format(
    decimal * 100
  ) + " %";

}


// ==========================================================
// GENERATE RANDOM ID
// ==========================================================

function GenerateId() {

  return Math
    .random()
    .toString(16)
    .slice(2);

}

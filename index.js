// ==========================================
// ReyZ Indo Stocks Risk Calculator
// ==========================================

let CurrentId;

let inputValues = [];

const inputPrompts = [
  "Saham apa yang ingin dibeli? ",
  "Harga Entry Saham tersebut: ",
  "Harga Stop Loss saham tersebut di: ",
  "Max Risk dalam posisi tersebut: Rp "
];


// ==========================================
// RUN BUTTON
// ==========================================

$(document).ready(function () {

  $("#run-button").click(function () {

    // Reset data
    inputValues = [];
    CurrentId = undefined;

    // Bersihkan terminal
    $("#Content").empty();

    NewLine(
      "Welcome to ReyZ Indo Stocks Risk Calculator",
      false
    );

    NewLine(
      inputPrompts[0],
      true
    );

  });

});


// ==========================================
// ENTER BUTTON
// ==========================================

$(document).on("keydown", function (event) {

  if (event.key === "Enter") {

    if (CurrentId === undefined) {
      return;
    }

    const input = $("#" + CurrentId + " input");

    // Jika input sudah disabled, jangan diproses
    if (input.prop("disabled")) {
      return;
    }

    const consoleLine = input.val().trim();

    // Jangan menerima input kosong
    if (consoleLine === "") {
      return;
    }

    inputValues.push(consoleLine);

    // Disable input sebelumnya
    input.prop("disabled", true);

    $(".console-carrot").remove();


    // ======================================
    // Jika semua input sudah dimasukkan
    // ======================================

    if (inputValues.length === inputPrompts.length) {

      calculateRisk();

      return;
    }


    // ======================================
    // Tampilkan pertanyaan selanjutnya
    // ======================================

    NewLine(
      inputPrompts[inputValues.length],
      true
    );

  }

});


// ==========================================
// AUTO FOCUS
// ==========================================

$(document).on("click", function () {

  if (CurrentId !== undefined) {

    $("#" + CurrentId + " input").focus();

  }

});


// ==========================================
// INPUT SIZE
// ==========================================

$(document).on("input", ".terminal-input", function () {

  const length = $(this).val().length;

  $(this).attr(
    "size",
    Math.max(1, length + 1)
  );

});


// ==========================================
// CALCULATION
// Python:
// percentage_risk =
// (entry_price - exit_price) / entry_price
// ==========================================

function calculateRisk() {

  const ticker =
    inputValues[0].toUpperCase();

  const entryPrice =
    Number(inputValues[1]);

  const exitPrice =
    Number(inputValues[2]);

  const willingRisk =
    Number(inputValues[3]);


  // ======================================
  // VALIDATION
  // ======================================

  if (
    isNaN(entryPrice) ||
    isNaN(exitPrice) ||
    isNaN(willingRisk)
  ) {

    ErrorLine(
      "Error: Harga dan Max Risk harus berupa angka."
    );

    return;
  }


  if (
    entryPrice <= 0 ||
    exitPrice <= 0 ||
    willingRisk <= 0
  ) {

    ErrorLine(
      "Error: Nilai harus lebih besar dari 0."
    );

    return;
  }


  if (exitPrice >= entryPrice) {

    ErrorLine(
      "Error: Harga Stop Loss harus lebih rendah dari Harga Entry."
    );

    return;
  }


  // ======================================
  // RISK PERCENTAGE
  // ======================================

  const percentageRisk =
    (entryPrice - exitPrice) /
    entryPrice;


  // ======================================
  // MAX BUY LOT
  //
  // Python:
  //
  // math.floor(
  // willing_risk /
  // (percentage_risk * entry_price)
  // / 100
  // )
  // ======================================

  const maxBuyLot =
    Math.floor(
      willingRisk /
      (percentageRisk * entryPrice) /
      100
    );


  // ======================================
  // GROSS BUY
  //
  // Buy fee default = 0.15%
  // ======================================

  const buyValue =
    entryPrice *
    maxBuyLot *
    100;

  const buyFee =
    0.15 / 100;

  const grossBuy =
    buyValue +
    (buyFee * buyValue);


  // ======================================
  // GROSS SELL
  //
  // Sell fee default = 0.25%
  // ======================================

  const sellValue =
    exitPrice *
    maxBuyLot *
    100;

  const sellFee =
    0.25 / 100;

  const grossSell =
    sellValue -
    (sellFee * sellValue);


  // ======================================
  // REALIZED LOSS
  // ======================================

  const realizedLoss =
    grossBuy -
    grossSell;


  // ======================================
  // OUTPUT
  // ======================================

  NewLine(
    "=".repeat(60),
    false,
    "separator"
  );


  NewLine(
    `Risk dalam trade tersebut : ${(percentageRisk * 100).toFixed(2)} %`,
    false
  );


  NewLine(
    `Max buy ${ticker} : ${maxBuyLot} lot`,
    false
  );


  NewLine(
    `Total uang yang dikeluarkan : ${formatRupiah(grossBuy)}`,
    false
  );


  NewLine(
    `Uang yang tersisa kalau Cutloss : ${formatRupiah(grossSell)}`,
    false
  );


  NewLine(
    `Realized loss scenario : ${formatRupiah(realizedLoss)}`,
    false
  );


  NewLine(
    "=".repeat(60),
    false,
    "separator"
  );

}


// ==========================================
// FORMAT RUPIAH
// ==========================================

function formatRupiah(number) {

  return "Rp. " +
    Math.round(number)
      .toLocaleString("en-US");

}


// ==========================================
// NEW TERMINAL LINE
// ==========================================

function NewLine(
  text,
  isPrompt = false,
  className = "result-line"
) {

  if (
    CurrentId !== undefined
  ) {

    $("#" + CurrentId + " input")
      .prop("disabled", true);

  }


  CurrentId =
    "consoleInput-" +
    GenerateId();


  // ======================================
  // INPUT / PROMPT
  // ======================================

  if (isPrompt) {

    $("#Content").append(`
      <div
        id="${CurrentId}"
        class="login-line"
      >
        ${text}

        <input
          class="terminal-input"
          type="text"
          autocomplete="off"
          size="1"
        >

        <span
          class="console-carrot"
        ></span>

      </div>
    `);


    $("#" + CurrentId + " input")
      .focus();

  }


  // ======================================
  // NORMAL OUTPUT
  // ======================================

  else {

    $("#Content").append(`
      <div class="${className}">
        ${text}
      </div>
    `);

  }

}


// ==========================================
// ERROR LINE
// ==========================================

function ErrorLine(text) {

  $(".console-carrot").remove();

  $("#Content").append(`
    <div class="error-line">
      ${text}
    </div>
  `);

}


// ==========================================
// RANDOM ID
// ==========================================

function GenerateId() {

  return Math
    .random()
    .toString(16)
    .slice(2);

}

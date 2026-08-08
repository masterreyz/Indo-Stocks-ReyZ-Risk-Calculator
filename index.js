"use strict";

// ==========================================================
// REYZ INDO STOCKS RISK CALCULATOR
// ==========================================================


// ==========================================================
// CONSTANTS
// ==========================================================

const BUY_FEE = 0.15 / 100;
const SELL_FEE = 0.25 / 100;
const SHARES_PER_LOT = 100;


// ==========================================================
// ELEMENTS
// ==========================================================

const form =
  document.getElementById("risk-form");

const tickerInput =
  document.getElementById("ticker");

const entryPriceInput =
  document.getElementById("entry-price");

const stopLossInput =
  document.getElementById("stop-loss");

const maxRiskInput =
  document.getElementById("max-risk");

const resetButton =
  document.getElementById("reset-button");

const errorBox =
  document.getElementById("error-box");

const resultCard =
  document.getElementById("result-card");


// ==========================================================
// AUTO UPPERCASE TICKER
// ==========================================================

tickerInput.addEventListener(
  "input",
  function () {

    this.value =
      this.value
        .toUpperCase()
        .replace(
          /[^A-Z0-9]/g,
          ""
        );

  }
);


// ==========================================================
// FORM SUBMIT
// ==========================================================

form.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();

    hideError();


    // ======================================================
    // GET INPUT
    // ======================================================

    const ticker =
      tickerInput
        .value
        .trim()
        .toUpperCase();


    const entryPrice =
      parseNumber(
        entryPriceInput.value
      );


    const stopLoss =
      parseNumber(
        stopLossInput.value
      );


    const willingRisk =
      parseNumber(
        maxRiskInput.value
      );


    // ======================================================
    // VALIDATION
    // ======================================================

    if (ticker === "") {

      showError(
        "Masukkan ticker saham terlebih dahulu."
      );

      tickerInput.focus();

      return;

    }


    if (
      !Number.isFinite(entryPrice) ||
      entryPrice <= 0
    ) {

      showError(
        "Harga Entry harus berupa angka lebih besar dari 0."
      );

      entryPriceInput.focus();

      return;

    }


    if (
      !Number.isFinite(stopLoss) ||
      stopLoss <= 0
    ) {

      showError(
        "Harga Stop Loss harus berupa angka lebih besar dari 0."
      );

      stopLossInput.focus();

      return;

    }


    if (
      stopLoss >= entryPrice
    ) {

      showError(
        "Harga Stop Loss harus lebih rendah dari Harga Entry."
      );

      stopLossInput.focus();

      return;

    }


    if (
      !Number.isFinite(willingRisk) ||
      willingRisk <= 0
    ) {

      showError(
        "Maximum Risk harus berupa angka lebih besar dari 0."
      );

      maxRiskInput.focus();

      return;

    }


    // ======================================================
    // RISK PERCENTAGE
    //
    // Python:
    //
    // percentage_risk =
    // (entry_price - exit_price) / entry_price
    // ======================================================

    const percentageRisk =
      (
        entryPrice -
        stopLoss
      ) /
      entryPrice;


    // ======================================================
    // MAX BUY LOT
    //
    // Python:
    //
    // math.floor(
    //     willing_risk /
    //     (percentage_risk * entry_price)
    //     / 100
    // )
    // ======================================================

    const maxBuyLot =
      Math.floor(
        willingRisk /
        (
          percentageRisk *
          entryPrice
        ) /
        SHARES_PER_LOT
      );


    if (maxBuyLot < 1) {

      showError(
        "Maximum Risk terlalu kecil untuk membeli minimal 1 lot pada setup ini."
      );

      resultCard.classList.add(
        "hidden"
      );

      return;

    }


    // ======================================================
    // TOTAL SHARES
    // ======================================================

    const totalShares =
      maxBuyLot *
      SHARES_PER_LOT;


    // ======================================================
    // GROSS BUY
    //
    // Buy fee = 0.15%
    // ======================================================

    const buyValue =
      entryPrice *
      totalShares;


    const grossBuy =
      buyValue +
      (
        BUY_FEE *
        buyValue
      );


    // ======================================================
    // GROSS SELL
    //
    // Sell fee = 0.25%
    // ======================================================

    const sellValue =
      stopLoss *
      totalShares;


    const grossSell =
      sellValue -
      (
        SELL_FEE *
        sellValue
      );


    // ======================================================
    // REALIZED LOSS
    // ======================================================

    const realizedLoss =
      grossBuy -
      grossSell;


    // ======================================================
    // SHOW RESULTS
    // ======================================================

    document.getElementById(
      "result-ticker"
    ).textContent =
      `${ticker} Position Summary`;


    document.getElementById(
      "risk-badge"
    ).textContent =
      `${formatPercentage(percentageRisk)} Risk`;


    document.getElementById(
      "result-lot"
    ).textContent =
      formatNumber(maxBuyLot);


    document.getElementById(
      "result-shares"
    ).textContent =
      `${formatNumber(totalShares)} shares`;


    document.getElementById(
      "result-risk"
    ).textContent =
      formatPercentage(
        percentageRisk
      );


    document.getElementById(
      "result-max-buy"
    ).textContent =
      `${formatNumber(maxBuyLot)} lot ${ticker}`;


    document.getElementById(
      "result-capital"
    ).textContent =
      formatRupiah(
        grossBuy
      );


    document.getElementById(
      "result-cutloss"
    ).textContent =
      formatRupiah(
        grossSell
      );


    document.getElementById(
      "result-loss"
    ).textContent =
      formatRupiah(
        realizedLoss
      );


    resultCard.classList.remove(
      "hidden"
    );


    // Scroll result into view on small screens

    if (
      window.innerWidth <= 600
    ) {

      resultCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  }
);


// ==========================================================
// RESET
// ==========================================================

resetButton.addEventListener(
  "click",
  function () {

    form.reset();

    hideError();

    resultCard.classList.add(
      "hidden"
    );

    tickerInput.focus();

  }
);


// ==========================================================
// PARSE NUMBER
//
// Bisa membaca:
// 1000000
// 1.000.000
// Rp 1.000.000
// 1,000,000
// ==========================================================

function parseNumber(value) {

  const cleanedValue =
    String(value)
      .replace(
        /[^0-9]/g,
        ""
      );


  if (
    cleanedValue === ""
  ) {

    return NaN;

  }


  return Number(
    cleanedValue
  );

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
    "id-ID",
    {
      maximumFractionDigits: 0
    }
  ).format(number);

}


// ==========================================================
// FORMAT PERCENTAGE
// ==========================================================

function formatPercentage(decimal) {

  return (
    new Intl.NumberFormat(
      "id-ID",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    ).format(
      decimal * 100
    )
    +
    "%"
  );

}


// ==========================================================
// ERROR
// ==========================================================

function showError(message) {

  errorBox.textContent =
    message;

  errorBox.classList.add(
    "show"
  );

}


function hideError() {

  errorBox.textContent =
    "";

  errorBox.classList.remove(
    "show"
  );

}

// Deklarasi Variabel Global
var CurrentId = undefined;
var inputValues = [];
// Array ini hanya berisi pertanyaan ke-2 dan seterusnya
const inputPrompts = [
  "Di harga berapa anda ingin beli saham tersebut? Rp ",
];

// Tombol Run untuk memulai aplikasi
$(document).ready(function () {
  $("#run-button").click(function () {
    inputValues = []; // Reset memori jawaban
    
    $("#Content").empty(); // Bersihkan layar
    
    // Sambutan dan pertanyaan pertama
    NewLine("Welcome to the MasterReyZ Indo Stocks Risk Calculator!", false);
    NewLine("Saham apa yang ingin dibeli? ", true);
  });
});

// --- FITUR BARU: Validasi Input Real-Time ---
// Membatasi karakter apa saja yang boleh diketik berdasarkan urutan pertanyaan
$(document).on("input", ".terminal-input", function () {
  let step = inputValues.length; // Mengetahui user sedang di pertanyaan ke berapa
  let currentVal = $(this).val();

  if (step === 0) {
    // Pertanyaan 1 (Saham): Hanya huruf, maksimal 4 karakter, otomatis kapital
    currentVal = currentVal.replace(/[^a-zA-Z]/g, ''); // Hapus semua selain huruf
    currentVal = currentVal.substring(0, 4).toUpperCase(); // Potong maks 4 huruf & Kapital
    $(this).val(currentVal);
  } 
  else if (step === 1) {
    // Pertanyaan 2 (Harga): Hanya boleh angka
    currentVal = currentVal.replace(/[^0-9]/g, ''); // Hapus semua selain angka
    $(this).val(currentVal);
  }
});

// Tombol Enter ditekan
$(document).on("keydown", function (e) {
  var x = event.which || event.keyCode;
  
  if (x === 13) { // 13 adalah kode untuk tombol Enter
    var consoleInput = $("#" + CurrentId + " input");
    var consoleLine = consoleInput.val();

    // Mencegah user menekan enter jika input masih kosong
    if (consoleLine.trim() === "") return;

    // Simpan jawaban ke array
    inputValues.push({ id: CurrentId, val: consoleLine });

    // Cek apakah semua pertanyaan sudah dijawab
    if (inputValues.length > inputPrompts.length) {
      
      // Ambil data yang sudah divalidasi
      const saham = inputValues[0].val;
      const harga = Number(inputValues[1].val);

      // (Tahap Sementara) Menampilkan output konfirmasi sebelum lanjut ke logika kalkulator nanti
      NewLine(`> Memproses data... Saham: ${saham} | Harga Beli: Rp ${harga}`, false);
      NewLine("--- Kalkulasi selanjutnya akan dibuat disini ---", false);

      $(".console-carrot").remove(); // Hapus kursor
      return; // Hentikan fungsi
    }

    // Jika masih ada pertanyaan, tampilkan pertanyaan berikutnya
    $(".console-carrot").remove();
    NewLine(inputPrompts[inputValues.length - 1], true);
  }
});

// Efek Dinamis Panjang Input (Auto-Resize) saat mengetik
$(document).on("keydown", function (e) {
  var x = event.which || event.keyCode;
  var line = $("#" + CurrentId + " input");
  
  // Jika input belum ada/hilang, jangan jalankan
  if (!line.length) return; 

  var length = line.val().length;
  if (x != 8) { // Jika bukan tombol backspace
    line.attr("size", 1 + length);
  } else {
    line.attr("size", length * 0.95);
  }
  if (length === 0) {
    line.attr("size", "1");
  }
});

// Auto-Focus jika layar diklik
$(document).on("click", function (e) {
  if (CurrentId !== undefined) {
    $("#" + CurrentId + " input").focus();
  }
});

// Fungsi Bantuan: Mencetak baris baru di terminal
function NewLine(text, isPrompt) {
  if (CurrentId !== undefined) {
    $("#" + CurrentId + " input").prop("disabled", true);
  }
  CurrentId = "consoleInput-" + GenerateId();

  if (isPrompt) {
    $("#Content").append(
      '<div id="' + CurrentId + '">' +
        text +
        '<input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" type="text" class="terminal-input" /><div class="console-carrot"></div></div>'
    );
    $("#" + CurrentId + " input").focus();
    $("#" + CurrentId + " input").attr("size", "1");
  } else {
    $("#Content").append('<div id="' + CurrentId + '">' + text + "</div>");
  }
}

// Fungsi Bantuan: Membuat ID acak
function GenerateId() {
  return Math.random().toString(16).slice(2);
}

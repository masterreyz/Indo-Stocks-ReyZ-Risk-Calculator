//Current line
var CurrentId = undefined;

var inputValues = [];
const inputPrompts = [
  "How much tip would you like to give? 10, 12, or 15? ",
  "How many people to split the bill?",
];
let isFirstClick = true;

//Click Run
$(document).ready(function () {
  $("#run-button").click(function () {
    inputValues = []
    
    $("#Content").empty();
    NewLine("Welcome to the MasterReyZ Indo Stocks Risk Calculator!", false);
    NewLine("Saham apa yang ingin dibeli? $", true);
  });
});

//Enter button
$(document).on("keydown", function (e) {
  var x = event.which || event.keyCode;
  if (x === 13 || x == 13) {
   
    var consoleLine = $("#" + CurrentId + " input").val();

    console.log(consoleLine);

    inputValues.push({ id: CurrentId, val: consoleLine });

    console.log(inputValues);

    if (inputValues.length > inputPrompts.length) {
      console.log("called");
      const bill = Number(inputValues[0].val);
      const tip = Number(inputValues[1].val);
      const people = Number(inputValues[2].val);
      const tip_as_percent = tip / 100;
      const total_tip_amount = bill * tip_as_percent;
      const total_bill = bill + total_tip_amount;
      const bill_per_person = total_bill / people;
      let final_amount = Number(Math.round(bill_per_person * 100) / 100);
      if (final_amount % 1 == 0) final_amount = `${final_amount}.00`;
      else if ((final_amount * 10) % 1 == 0) final_amount = `${final_amount}0`;
      NewLine("Each person should pay: $" + final_amount, false);

      $(".console-carrot").remove();
      return;
    }

    $(".console-carrot").remove();

    NewLine(inputPrompts[inputValues.length - 1], true);
    // setTimeout(NewLine, delay);
  }
});
$(document).on("keydown", function (e) {
  var x = event.which || event.keyCode;
  var line = $("#" + CurrentId + " input");
  var length = line.val().length;
  if (x != 8) {
    line.attr("size", 1 + length);
  } else {
    line.attr("size", length * 0.95);
  }
  if (length === 0) {
    $("#" + CurrentId + " input").attr("size", "1");
  }
});
$(document).on("click", function (e) {
  $("#" + CurrentId + " input").focus();
});

//New line
function NewLine(text, isPrompt) {
  if (CurrentId !== undefined) {
    $("#" + CurrentId + " input").prop("disabled", true);
  }
  CurrentId = "consoleInput-" + GenerateId();

  if (isPrompt) {
    $("#Content").append(
      //One Line
      '<div id="' +
        CurrentId +
        '">' +
        text +
        '<input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" type="text" class="terminal-input" /><div class="console-carrot"></div></div>'
    );
    $("#" + CurrentId + " input").focus();
    $("#" + CurrentId + " input").attr("size", "1");
  } else {
    $("#Content").append('<div id="' + CurrentId + '">' + text + "</div>");
  }
}

function GenerateId() {
  return Math.random().toString(16).slice(2);
}

`print("Welcome to the tip calculator!")
bill = float(input("What was the total bill? $"))
tip = int(input("How much tip would you like to give? 10, 12, or 15? "))
people = int(input("How many people to split the bill?"))

tip_as_percent = tip / 100
total_tip_amount = bill * tip_as_percent
total_bill = bill + total_tip_amount
bill_per_person = total_bill / people
final_amount = round(bill_per_person, 2)


# FAQ: How to round to 2 decimal places?

# Find the answer in the Q&A here: https://www.udemy.com/course/100-days-of-code/learn/lecture/17965132#questions/13315048


print(f"Each person should pay: final_amount")`;

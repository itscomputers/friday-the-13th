//----------------------------
// calendar generator

Date.prototype.absoluteDate = function() {
  const value = this.valueOf();
  const perDay = 24 * 60 * 60 * 1000;
  return (value - (value % perDay)) / perDay;
}

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
  "triskaidektober",
];

const today = new Date();
const januaryFirst = new Date(`Jan 1 ${today.getFullYear()}`);

const dayOfYear = today.absoluteDate() - januaryFirst.absoluteDate();
const todayDate = dayOfYear % 28;
const todayMonth = months[(dayOfYear - todayDate) / 28];

const generateTable = table => {
  generateHeader(table);
  generateBody(table);
}

const generateHeader = table => {
  let thead = table.createTHead();
  let row = thead.insertRow();
  ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].forEach(day => {
    let th = document.createElement("th");
    let text = document.createTextNode(day);
    th.appendChild(text);
    row.appendChild(th);
  });
}

const generateBody = table => {
  const dayOfTheYear = today.absoluteDate() - januaryFirst.absoluteDate();
  const firstDay = januaryFirst.getDay();
  const daysInFirstWeek = 7 - firstDay;
  const weeks = firstDay === 0 ? 4 : 5;
  const dayNumber = (week, day) => (
    daysInFirstWeek + week * 7 + day + 1
  );
  let row = table.insertRow();
  [...Array(firstDay).keys()].forEach(idx => {
    let cell = row.insertCell();
    if (table.id === "january" && idx === firstDay - 1) {
      let text = document.createTextNode("nye");
      cell.appendChild(text);
    }
  });
  [...Array(daysInFirstWeek).keys()].forEach(day => {
    let cell = row.insertCell();
    let text = document.createTextNode(day + 1);
    cell.appendChild(text);
    if (table.id === todayMonth && day === todayDate) {
      cell.classList.toggle("active");
    }
  });
  [...Array(weeks - 1).keys()].forEach(week => {
    let row = table.insertRow();
    [...Array(7).keys()].forEach(day => {
      let cell = row.insertCell();
      if (dayNumber(week, day) < 29) {
        let text = document.createTextNode(dayNumber(week, day));
        cell.appendChild(text);
        if (table.id === todayMonth && dayNumber(week, day) === todayDate + 1) {
          cell.classList.toggle("active");
        }
      } else if (table.id === "triskaidektober" && dayNumber(week, day) === 29) {
        let text = document.createTextNode("nye");
        cell.appendChild(text);
      }
    });
  });
}

months.forEach(month => generateTable(document.getElementById(month)));
const todayIs = `today's date is ${todayDate + 1} ${todayMonth}, ${today.getFullYear()}`
document.getElementById('today-is').textContent = todayIs;

const toggleSection = id => {
  ["calendar", "faq"].forEach(localId => {
    if (id === localId) {
      document.getElementById(localId).classList.remove('hidden');
      document.getElementById(`${localId}-button`).classList.add('highlighted');
    } else {
      document.getElementById(localId).classList.add('hidden');
      document.getElementById(`${localId}-button`).classList.remove('highlighted');
    }
  });

}

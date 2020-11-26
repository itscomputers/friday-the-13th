Date.prototype.moveBy = function(offset) {
  this.setDate(this.getDate() + offset);
  return this;
}

//----------------------------
// friday the 13th search functionality

const offsetToFriday = (date, direction) => {
  if (direction === 'next') {
    return -date.getDay() + ((date.getDay() < 5) ? 5 : 12);
  } else if (direction === 'prev') {
    return -date.getDay() + ((date.getDay() > 5) ? 5 : -2);
  }
  return 0;
};

Date.prototype.isFridayThe13th = function() {
  return this.getDay() === 5 && this.getDate() === 13;
}

Date.prototype.moveToFriday = function(direction) {
  this.moveBy(offsetToFriday(this, direction));
}

Date.prototype.moveToFridayThe13th = function(direction) {
  this.moveToFriday(direction);
  if (this.isFridayThe13th()) {
    return this;
  }
  return this.moveToFridayThe13th(direction);
}

//----------------------------
// dom management

const today = new Date();
document.getElementById('is-it-today').textContent = today.isFridayThe13th() ? 'yes' : 'no';

const date = new Date();

const updateDateOnWindow = () => {
  document.getElementById('date').textContent = date.toDateString();
};

const moveToFridayThe13th = (direction) => {
  date.moveToFridayThe13th(direction);
  updateDateOnWindow();
};

const toggleSection = (prefix) => {
  ['is-it', 'when-is', 'how-often-is'].forEach(localPrefix => {
    const button = document.getElementById(`${localPrefix}-button`);
    const article = document.getElementById(`${localPrefix}-friday-the-13th`);
    if (prefix === localPrefix) {
      button.classList.add('highlighted');
      article.classList.remove('hidden');
    } else {
      button.classList.remove('highlighted');
      article.classList.add('hidden');
    }
  });
}

document.body.addEventListener('keydown', function(event) {
  switch (event.key) {
    case "ArrowLeft":
      moveToFridayThe13th('prev');
      break;
    case "ArrowRight":
      moveToFridayThe13th('next');
      break;
  }
});

if (!date.isFridayThe13th()) {
  moveToFridayThe13th('next');
}

//----------------------------
// tests

Date.prototype.isDifferentFrom = function(date) {
  return this.toDateString() !== date.toDateString();
}

const offset = (direction) => {
  switch(direction) {
    case "next": return 1;
    case "prev": return -1;
    default: return 0;
  }
};

const testMessage = (funcString, input, result, errors) => {
  const identifier = `${funcString}\n   ${input} ~> ${result}`;
  if (errors.length === 0) {
    return `${identifier} \n   passed`;
  }
  return [identifier, 'failed', errors.join("\n   ")].join("\n   ");
};

const testMoveToFriday = (date, direction, verbose) => {
  const title = `Date.prototype.moveToFriday(${direction})`;
  const errors = [];

  const testDate = new Date(date);

  const friday = new Date(date);
  friday.moveToFriday(direction);
  const result = friday.toDateString();
  if (friday.getDay() !== 5) {
    errors.push(`${result} is not a friday`);
  }

  testDate.moveBy(offset(direction));
  while (testDate.isDifferentFrom(friday)) {
    if (testDate.getDay() === 5) {
      errors.push(`${testDate.toDateString()} is a friday between ${date} and ${result}`);
    }

    const localFriday = new Date(testDate);
    localFriday.moveToFriday(direction);
    if (localFriday.isDifferentFrom(friday)) {
      errors.push(`${testDate.toDateString()} gave inconsistent result: ${localFriday.toDateString()} instead of ${result}`);
    }

    testDate.moveBy(offset(direction));
  }

  if (verbose || errors.length > 0) {
    console.log(testMessage(title, date, result, errors));
  }
}

const testMoveToFridayThe13th = (date, direction, verbose) => {
  const title = `Date.prototype.moveToFridayThe13th(${direction})`;
  const errors = [];

  const testDate = new Date(date);

  const fridayThe13th = new Date(date);
  fridayThe13th.moveToFridayThe13th(direction);
  const result = fridayThe13th.toDateString();
  if (!fridayThe13th.isFridayThe13th()) {
    errors.push(`${result} is not a friday the 13th`);
  }

  testDate.moveBy(offset(direction));
  while (testDate.isDifferentFrom(fridayThe13th)) {
    if (testDate.isFridayThe13th()) {
      errors.push(`${testDate.toDateString()} is a friday the 13th between ${date} and ${result}`);
    }

    const localFridayThe13th = new Date(testDate);
    localFridayThe13th.moveToFridayThe13th(direction);
    if (localFridayThe13th.isDifferentFrom(fridayThe13th)) {
      errors.push(`${testDate.toDateString()} gave inconsistent result: ${localFridayThe13th.toDateString()} instead of ${result}`);
    }

    testDate.moveBy(offset(direction));
  }

  if (verbose || errors.length > 0) {
    console.log(testMessage(title, date, result, errors));
  }
}

const runRandomizedTests = ({ quantity, verbose }) => {
  for (let i=0; i<quantity; i++) {
    let date = new Date();
    date.moveBy(parseInt(Math.random() * 5000) - 2500);
    date = date.toDateString();
    testMoveToFriday(date, 'next', verbose);
    testMoveToFriday(date, 'prev', verbose);
    testMoveToFridayThe13th(date, 'next', verbose);
    testMoveToFridayThe13th(date, 'prev', verbose);
  }
}

// runRandomizedTests({ quantity: 5 });


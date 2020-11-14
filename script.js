const offset = (date, direction) => {
  if (direction === 'next') {
    return -date.getDay() + ((date.getDay() < 5) ? 5 : 12);
  } else if (direction === 'prev') {
    return -date.getDay() + ((date.getDay() > 5) ? 5 : -2);
  }
  return 0;
};

Date.prototype.moveToFriday = function(direction) {
  this.setDate(this.getDate() + offset(this, direction));
  return this;
}

Date.prototype.moveToFridayThe13th = function(direction) {
  this.moveToFriday(direction);
  if (this.getDate() === 13) {
    return this;
  }
  return this.moveToFridayThe13th(direction);
}

const date = new Date();

const updateDateOnWindow = () => {
  document.getElementById('date').textContent = date.toDateString();
};

const moveToFridayThe13th = (direction) => {
  date.moveToFridayThe13th(direction);
  updateDateOnWindow();
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

moveToFridayThe13th('next');

// tests

// tests that from a friday 13th to the next/prev, all of the dates have the expected next/prev.
const testFridayThe13th = (startingDate, direction, expected) => {
  const testDate = new Date(startingDate);
  const expectedString = new Date(expected).toDateString();

  while (testDate.toDateString() !== expectedString) {
    const localDate = new Date(testDate);
    if (localDate.moveToFridayThe13th(direction).toDateString() !== expectedString) {
      console.log(`failed on ${testDate.toDateString()}: got ${localDate.toDateString()}, expected ${expected}`);
    }
    testDate.setDate(testDate.getDate() + (direction === 'next' ? 1 : -1));
  }
}

// testFridayThe13th('Nov 13 2020', 'next', 'Aug 13 2021');
// testFridayThe13th('Aug 13 2021', 'prev', 'Nov 13 2020');


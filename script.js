const offset = (date, direction) => {
  if (direction === 'next') {
    return -date.getDay() + ((date.getDay() < 5) ? 5 : 12);
  } else if (direction === 'prev') {
    return -date.getDay() + ((date.getDay() > 5) ? -2 : -9);
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
date.moveToFridayThe13th('next');

const updateDateOnWindow = () => {
  document.getElementById('date').textContent = date.toDateString();
};

const moveTo = (direction) => {
  date.moveToFridayThe13th(direction);
  updateDateOnWindow();
}

updateDateOnWindow();


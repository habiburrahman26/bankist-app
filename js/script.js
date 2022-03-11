'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-03-08T16:01:17.194Z',
    '2022-03-09T16:36:17.929Z',
    '2022-03-10T10:51:36.790Z',
  ],
  currency: 'BDT',
  locale: 'en-BD', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-03-08T16:01:17.194Z',
    '2022-03-09T16:36:17.929Z',
    '2022-03-10T10:51:36.790Z',
  ],
  currency: 'BDT',
  locale: 'bn-BD',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-03-08T16:01:17.194Z',
    '2022-03-09T16:36:17.929Z',
    '2022-03-10T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-03-08T16:01:17.194Z',
    '2022-03-09T16:36:17.929Z',
    '2022-03-10T10:51:36.790Z',
  ],
  currency: '',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Element
const labelWelcome = document.querySelector('.welcome');
const labelBalance = document.querySelector('.balance__value');
const labelDate = document.querySelector('.date');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// hide app
containerApp.style.opacity = 0;

// FUNCTION

const dateFormatter = function (date, locale) {
  const formater = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = formater(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yestarday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const balanceFormatter = function (mov, currency, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(mov);
};

// display movements
const displayMovements = function (accs) {
  containerMovements.textContent = '';

  accs.movements.forEach((mov, i) => {
    const movs = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(accs.movementsDates[i]);
    const formateDate = dateFormatter(date, accs.locale);

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${movs}">2 ${movs}</div>
          <div class="movements__date">${formateDate}</div>
          <div class="movements__value">${balanceFormatter(
            mov,
            accs.currency,
            accs.locale
          )}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calDisplayMovements = function (acc) {
  //balance
  acc.balance = acc.movements.reduce((acc, val) => acc + val, 0);
  labelBalance.textContent = `${balanceFormatter(
    acc.balance,
    acc.currency,
    acc.locale
  )}`;

  // total deposit
  const deposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${balanceFormatter(
    deposit,
    acc.currency,
    acc.locale
  )}`;

  //total withdrawal
  const withdrawal = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${balanceFormatter(
    Math.abs(withdrawal),
    acc.currency,
    acc.locale
  )}`;

  //interest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, val) => acc + val, 0);

  labelSumInterest.textContent = `${balanceFormatter(
    interest,
    acc.currency,
    acc.locale
  )}`;
};

// UPDATE UI
const updateUI = function (acc) {
  displayMovements(acc);
  calDisplayMovements(acc);
};

// create username
const createUsername = function (accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsername(accounts);

const startLogOutTime = function () {
  let time = 120;

  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const second = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${second}`;
    time--;

    if (time === 0) {
      clearInterval(tick);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//which account is logged in
let currentAccount, timer;

// LOGIN
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount.pin === +inputLoginPin.value) {
    // display welcome message
    labelWelcome.innerText = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };

    const dateFormate = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    labelDate.textContent = dateFormate;

    // show UI
    containerApp.style.opacity = 100;

    // countdown start
    if (timer) clearInterval(timer);
    timer = startLogOutTime();

    // updateUI
    updateUI(currentAccount);
  }

  //clear input field
  inputLoginUsername.value = inputLoginPin.value = '';
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferAmount = +inputTransferAmount.value;
  const reciverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  // transfer account doesn't be the current account
  if (
    transferAmount > 0 &&
    reciverAccount &&
    currentAccount.balance >= transferAmount &&
    reciverAccount?.username !== currentAccount.username
  ) {
    reciverAccount.movements.push(transferAmount);
    currentAccount.movements.push(-transferAmount);
    const now = new Date();
    currentAccount.movementsDates.push(now.toISOString());
    reciverAccount.movementsDates.push(now.toISOString());

    // rest timer
    clearInterval(timer);
    timer = startLogOutTime();

    // updateUI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;

  if (amount > 0) {
    // Add movement
    currentAccount.movements.push(amount);
    const now = new Date();
    currentAccount.movementsDates.push(now.toISOString());

    // rest timer
    clearInterval(timer);
    timer = startLogOutTime();

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const deleteAccountIndex = accounts.findIndex(
      acc =>
        acc.username === inputCloseUsername.value &&
        acc.pin === +inputClosePin.value
    );

    // delete account
    accounts.splice(deleteAccountIndex, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

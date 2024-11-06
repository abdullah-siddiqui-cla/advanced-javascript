// 1. Get all required elements from the DOM
const currencyOne = document.getElementById("currency-one");
const currencyTwo = document.getElementById("currency-two");
const amuountOne = document.getElementById("amount-one");
const amuountTwo = document.getElementById("amount-two");
const swapButton = document.getElementById("swap");

// 2. Store API response data in `conversionData`, which holds conversion rates for the selected base currency.
//    Update this whenever the base currency (currencyOne) changes.
let conversionData = {};

// 3. Make a method that fetches the conversion data and set it into `conversionData` variable.
//    Call this function when the base currency is updated by the user to ensure up-to-date rates.
const fetchConversionData = () => {
  const currency = currencyOne.value;

  fetch(
    `https://v6.exchangerate-api.com/v6/9c4a82fc6e6b0eec73123671/latest/${currency}`
  )
    .then((response) => response.json())
    .then((data) => {
      conversionData = data;

      // Once conversionData is set, perform the conversion based on the new rates.
      convert();
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      conversionData = {};
    });
};

// 4. Perform currency conversion based on input amount and current rates in `conversionData`.
//    If the amount or rates are missing, default the target amount to 0.
const convert = () => {
  const amount = !!amuountOne.value ? parseInt(amuountOne.value) : 0;

  if (amount && conversionData.conversion_rates) {
    const rate = conversionData.conversion_rates[currencyTwo.value];
    const convertedAmount = amount * rate;

    amuountTwo.value = convertedAmount;
  } else {
    amuountTwo.value = 0;
  }
}

// 5. Set event listeners for base and target currency changes to update rates or perform conversions.
currencyOne.addEventListener("change", fetchConversionData);
currencyTwo.addEventListener("change", convert);

// 6. Load conversion rates for the initial base currency on page load.
fetchConversionData();

// 7. Perform conversion whenever the source amount is updated.
amuountOne.addEventListener("change", convert);

// 8. Add an on-click listener to the swap button to switch currencies, then fetch new rates and convert.
swapButton.addEventListener("click", () => {
  const currencyOneBackup = currencyOne.value;

  currencyOne.value = currencyTwo.value;
  currencyTwo.value = currencyOneBackup;

  fetchConversionData();
})
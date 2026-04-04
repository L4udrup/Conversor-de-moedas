const dropList = document.querySelectorAll("form select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const exchangeRateTxt = document.querySelector(".exchange-rate");
const amountInput = document.querySelector(".amount input");
const form = document.querySelector("form");

// POPULAR SELECTS
dropList.forEach((select, index) => {
  for (let currency_code in country_list) {

    let selected =
      index === 0 && currency_code === "USD"
        ? "selected"
        : index === 1 && currency_code === "BRL"
        ? "selected"
        : "";

    const option = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    select.insertAdjacentHTML("beforeend", option);
  }

  select.addEventListener("change", (e) => loadFlag(e.target));
});

// TROCAR BANDEIRA
function loadFlag(element) {
  const countryCode = country_list[element.value];
  const imgTag = element.parentElement.querySelector("img");

  imgTag.src = `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
}

// TROCAR MOEDAS
const exchangeIcon = document.querySelector(".icon");

exchangeIcon.addEventListener("click", () => {
  const temp = fromCurrency.value;

  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;

  loadFlag(fromCurrency);
  loadFlag(toCurrency);

  getExchangeRate();
});

// CONVERSÃO
async function getExchangeRate() {
  let amount = amountInput.value;

  if (amount === "" || amount <= 0) {
    amount = 1;
    amountInput.value = "1";
  }

  exchangeRateTxt.innerText = "Convertendo...";

  const from = fromCurrency.value;
  const to = toCurrency.value;

  try {

    const response = await fetch(`http://localhost:5006/convert?from=${from}&to=${to}&amount=${amount}`);

    const data = await response.json();

    exchangeRateTxt.innerText =
      `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;

  } catch (error) {

    exchangeRateTxt.innerText = "Erro ao converter moeda";
    console.error(error);

  }
}

// SUBMIT DO FORM
form.addEventListener("submit", (e) => {
  e.preventDefault();
  getExchangeRate();
});

// PRIMEIRA CONVERSÃO AO CARREGAR
window.addEventListener("load", () => {
  getExchangeRate();
});
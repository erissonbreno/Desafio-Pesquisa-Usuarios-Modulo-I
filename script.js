let allPeople = [];
let fiteredPeople = [];

let tabPeople = document.querySelector('#tab-people');
let tabStatistics = document.querySelector('#tab-statistics');
let inputText = document.querySelector('#input-text');
let btnSearch = document.querySelector('#btn-search');
let lblSearch = document.querySelector('#lbl-search');
let textUsers = document.querySelector('#text-users');
let textStatistics = document.querySelector('#text-statistics');

window.addEventListener('load', () => {
  fetchPeople();
});

inputText.addEventListener('keyup', function events(e) {
  checkInput();
  if (
    inputText.value.length > 0 &&
    e.keyCode === 13 &&
    inputText.value.trim(' ')
  ) {
    doSearch();
  }
});

inputText.addEventListener('focus', onFocus);
inputText.addEventListener('focusout', onFocusOut);
btnSearch.addEventListener('click', doSearch);

async function fetchPeople() {
  btnSearch.disabled = true;
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  console.log(json.results);
  allPeople = json.results.map((person) => {
    return {
      name: person.name.first + ' ' + person.name.last,
      age: person.dob.age,
      gender: person.gender,
      picture: person.picture.medium,
    };
  });

  allPeople.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  console.log(allPeople);

  numberFormat = Intl.NumberFormat('pt-BR');
}

function checkInput() {
  if (inputText.value.length > 0 && inputText.value.trim(' ')) {
    btnSearch.disabled = false;
  } else {
    btnSearch.disabled = true;
  }
}

function doSearch() {
  filteredPeople = allPeople.filter((person) => {
    return person.name.toLowerCase().includes(inputText.value.toLowerCase());
  });
  renderFilteredPeople();
  renderStatistics(filteredPeople);
}

function renderFilteredPeople() {
  let peopleHTML = '<div>';

  filteredPeople.forEach((person) => {
    const { picture, name, age } = person;

    const personHTML = `
    <div class='person'>
      <div id='profile'>
        <img src="${picture}" alt="${name}" id='imgs'>
        <ul>
          <li>${name}, ${age} anos</li>
        </ul>
      </div>
    `;

    peopleHTML += personHTML;
  });

  peopleHTML += '</div>';

  tabPeople.innerHTML = peopleHTML;
  updateHtml(filteredPeople.length);
}

function renderStatistics(users) {
  tabStatistics.innerHTML = '';

  let statsElement = document.createElement('div');

  if (users.length !== 0) {
    let statsMaleUsers = document.createElement('div');
    const maleUsers = users.reduce(
      (acc, cur) => (cur.gender === 'male' ? ++acc : acc),
      0
    );
    statsMaleUsers.textContent = `Sexo Masculino: ${maleUsers}`;
    statsElement.appendChild(statsMaleUsers);

    let statsFamaleUsers = document.createElement('div');
    const famaleUsers = users.reduce(
      (acc, cur) => (cur.gender === 'female' ? ++acc : acc),
      0
    );
    statsFamaleUsers.textContent = `Sexo Feminino: ${famaleUsers}`;
    statsElement.appendChild(statsFamaleUsers);

    let statsAgeSum = document.createElement('div');
    const usersAgeSum = users.reduce((acc, cur) => acc + cur.age, 0);
    statsAgeSum.textContent = `Soma das idades: ${formatNumber(
      usersAgeSum.toFixed(2)
    )}`;
    statsElement.appendChild(statsAgeSum);

    let statsAgeAvg = document.createElement('div');
    const usersAgeAvg = usersAgeSum / users.length;
    statsAgeAvg.textContent = `Média das idades: ${formatNumber(
      usersAgeAvg.toFixed(2)
    )}`;
    statsElement.appendChild(statsAgeAvg);
  }
  tabStatistics.appendChild(statsElement);
}
function onFocus() {
  lblSearch.classList.add('active');
}

function onFocusOut() {
  if (!inputText.value) {
    lblSearch.classList.remove('active');
  }
}

function updateHtml(users) {
  if (users === 0) {
    textUsers.textContent = 'Nenhum usuário filtrado';
    textStatistics.textContent = 'Nada a ser exibido';
  } else {
    textUsers.textContent = '';
    textStatistics.textContent = '';
    textUsers.innerHTML = `${users} usuário(s) encontrado(s)`;
    textStatistics.innerHTML = 'Estatísticas';
  }
}

function formatNumber(number) {
  return numberFormat.format(number);
}

/* global data */
/* exported data */

const $headbarMenu = document.querySelector('.headbar-menu-toggle');
const $sidebarMenu = document.querySelector('.sidebar-modal');
const $sidebarContainer = document.querySelector('.sidebar-container');
const $cardContainer = document.querySelector('.card-container');
const $sidebarGenres = document.querySelector('.sidebar-genres');
const $sidebarThemes = document.querySelector('.sidebar-themes');
const $sidebarDemos = document.querySelector('.sidebar-demos');
const $sidebarStatus = document.querySelector('.sidebar-status');

window.addEventListener('DOMContentLoaded', function (event) {
  // Ideally these three if's should only run once.
  if (data.genres.length === 0) {
    data.genres = updateGenreObjectXMLCall();
  }
  if (data.themes.length === 0) {
    data.themes = updateThemeObjectXMLCall();
  }
  if (data.demographics.length === 0) {
    data.demographics = updateDemographicObjectXMLCall();
  }
  genreObjectToCheckbox(data.genres, $sidebarGenres);
  genreObjectToCheckbox(data.themes, $sidebarThemes);
  genreObjectToCheckbox(data.demographics, $sidebarDemos);
  data.entries = [];
  data.status = [];
});

$headbarMenu.addEventListener('click', function (event) {
  sidebarVisibilityToggle();
});

$sidebarMenu.addEventListener('click', function (event) {
  if (event.target.className.includes('blur')) {
    sidebarVisibilityToggle();
  }
});

$sidebarGenres.addEventListener('click', function (event) {
  if (event.target.className.includes('fa-solid')) {
    cycleGenreCheckbox(event.target);
  }
});

$sidebarThemes.addEventListener('click', function (event) {
  if (event.target.className.includes('fa-solid')) {
    cycleGenreCheckbox(event.target);
  }
});

$sidebarDemos.addEventListener('click', function (event) {
  if (event.target.className.includes('fa-solid')) {
    cycleGenreCheckbox(event.target);
  }
});

$sidebarStatus.addEventListener('click', function (event) {
  if (event.target.className.includes('fa-solid')) {
    cycleStatusCheckbox(event.target);
  }
});

function sidebarVisibilityToggle() {
  $sidebarMenu.classList.toggle('blur');
  $sidebarContainer.classList.toggle('hidden');
}

const $sidebarSearchbar = document.querySelector('form#search');

$sidebarSearchbar.addEventListener('submit', function (event) {
  event.preventDefault();
  getJSOMFromAPI($sidebarSearchbar.elements[0].value);
  $sidebarSearchbar.reset();
  sidebarVisibilityToggle();
});

const $sidebarGenreToggle = document.querySelector('.sidebar-genre-toggle');
$sidebarGenreToggle.addEventListener('click', function (event) {
  if (event.target.nodeName === 'I' || event.target.nodeName === 'SPAN') {
    event.target.parentElement.children[1].classList.toggle('fa-ellipsis');
    event.target.parentElement.children[1].classList.toggle('fa-caret-down');
    $sidebarGenres.classList.toggle('hidden');
  }
});

const $sidebarThemeToggle = document.querySelector('.sidebar-theme-toggle');
$sidebarThemeToggle.addEventListener('click', function (event) {
  if (event.target.nodeName === 'I' || event.target.nodeName === 'SPAN') {
    event.target.parentElement.children[1].classList.toggle('fa-ellipsis');
    event.target.parentElement.children[1].classList.toggle('fa-caret-down');
    $sidebarThemes.classList.toggle('hidden');
  }
});

const $sidebarDemoToggle = document.querySelector('.sidebar-demo-toggle');
$sidebarDemoToggle.addEventListener('click', function (event) {
  if (event.target.nodeName === 'I' || event.target.nodeName === 'SPAN') {
    event.target.parentElement.children[1].classList.toggle('fa-ellipsis');
    event.target.parentElement.children[1].classList.toggle('fa-caret-down');
    $sidebarDemos.classList.toggle('hidden');
  }
});

const $sidebarStatusToggle = document.querySelector('.sidebar-status-toggle');
$sidebarStatusToggle.addEventListener('click', function (event) {
  if (event.target.nodeName === 'I' || event.target.nodeName === 'SPAN') {
    event.target.parentElement.children[1].classList.toggle('fa-ellipsis');
    event.target.parentElement.children[1].classList.toggle('fa-caret-down');
    $sidebarStatus.classList.toggle('hidden');
  }
});

function genreObjectToCheckbox(object, $parent) {
  for (const genre in object) {
    const $spanContainer = document.createElement('span');
    $spanContainer.setAttribute('id', 'genre-check-' + object[genre]);
    const $span = document.createElement('span');
    $span.textContent = genre;
    const $checkbox = document.createElement('i');
    $checkbox.className = 'fa-solid fa-square';
    $spanContainer.appendChild($span);
    $spanContainer.appendChild($checkbox);
    $parent.appendChild($spanContainer);
  }
}

function updateGenreObjectXMLCall() {
  const xhr = new XMLHttpRequest();
  const targetUrl = encodeURIComponent('https://api.jikan.moe/v4/genres/manga?filter=genres');
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    // there is only 19 unique genres, bugged API spits out 4 copies of it.
    const genredata = xhr.response.data.slice(0, 19);
    // linter doesn't recognize property assignment
    // eslint-disable-next-line prefer-const
    let genreObj = {};
    for (const genre of genredata) {
      genreObj[genre.name] = genre.mal_id;
    }
    data.genres = genreObj;
  });
  xhr.send();
}

function updateThemeObjectXMLCall() {
  const xhr = new XMLHttpRequest();
  const targetUrl = encodeURIComponent('https://api.jikan.moe/v4/genres/manga?filter=themes');
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const themedata = xhr.response.data;
    const themeObj = {};
    for (const genre of themedata) {
      themeObj[genre.name] = genre.mal_id;
    }
    data.themes = themeObj;
  });
  xhr.send();
}

function updateDemographicObjectXMLCall() {
  const xhr = new XMLHttpRequest();
  const targetUrl = encodeURIComponent('https://api.jikan.moe/v4/genres/manga?filter=demographics');
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const demodata = xhr.response.data;
    const demoObj = {};
    for (const genre of demodata) {
      demoObj[genre.name] = genre.mal_id;
    }
    data.demographics = demoObj;
  });
  xhr.send();
}

// eslint-disable-next-line no-unused-vars
function currentDisplayedGenres() {
  const genrelist = new Set();
  for (const entry of data.entries) {
    for (const genre of entry.genres) {
      genrelist.add(genre.name);
    }
  }
  return genrelist;
}

function getJSOMFromAPI(q) {
  const xhr = new XMLHttpRequest();
  const apiParams = getParams(q);
  const targetUrl = encodeURIComponent('https://api.jikan.moe/v4/manga' + '?limit=8&min_score=4' + apiParams);
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    removeNothing();
    cardContainerClearDOM();
    if (xhr.response.data.length) {
      data.entries = [];
      for (let i = 0; i < xhr.response.data.length; i++) {
        const viewObject = {
          title: xhr.response.data[i].title,
          image: xhr.response.data[i].images.jpg.image_url,
          synopsis: xhr.response.data[i].synopsis,
          genres: xhr.response.data[i].genres,
          status: xhr.response.data[i].status
        };
        data.entries.push(viewObject);
      }
      renderDataObject();
    } else {
      const $nothingFound = document.createElement('p');
      $nothingFound.textContent = 'Nothing found with endpoint: ' + getParams(q);
      $nothingFound.className = 'no-find';
      $cardContainer.appendChild($nothingFound);
    }
  });
  xhr.send();
}

function getParams(q) {
  let apiParams = '';
  if (data.genreInclude.length) {
    apiParams += '&genres=' + data.genreInclude.join(',');
  }
  if (data.genreExclude.length) {
    apiParams += '&genres_exclude=' + data.genreExclude.join(',');
  }
  if (data.status.length) {
    apiParams += '&status=' + data.status.join(',');
  }
  if (q) {
    apiParams += '&q=' + q;
  }
  return apiParams;
}

function renderDataObject() {
  for (const entry of data.entries) {
    $cardContainer.appendChild(cardObjectToDOM(entry));
  }
}

function cardContainerClearDOM() {
  const $cardNodeList = document.querySelectorAll('.card');
  for (const node of $cardNodeList) {
    node.remove();
  }
}

function removeNothing() {
  const $nothing = document.querySelector('.noFind');
  if ($nothing) {
    $nothing.remove();
  }
}

function cardObjectToDOM(object) {
  // <div class="card">
  //   <div class="card-image">
  //     <img src="https://cdn.myanimelist.net/images/manga/5/IMAGENUMBER.jpg" alt="">
  //   </div>
  //   <div class="card-text">
  //     <h4>Title Text</h4>
  //     <p>Description Text</p>
  //   </div>
  // </div>

  const $card = document.createElement('div');
  $card.className = 'card';
  const $cardImage = document.createElement('div');
  $cardImage.className = 'card-image';
  const $cardText = document.createElement('div');
  const $img = document.createElement('img');
  $cardText.className = 'card-text';
  const $h4 = document.createElement('h4');
  const $p = document.createElement('p');

  if (object) {
    $img.setAttribute('src', object.image);
    $h4.textContent = object.title;
    $p.textContent = object.synopsis;
  }

  $cardText.appendChild($h4);
  $cardText.appendChild($p);
  $cardImage.appendChild($img);
  $card.appendChild($cardImage);
  $card.appendChild($cardText);

  return $card;
}

function cycleGenreCheckbox(element) {
  if (element.className.includes('square')) {
    const genreID = +element.parentElement.id.split('-')[2];
    if (element.className.includes('xmark')) {
      // X goes to neutral, remove genre-exclusion
      element.className = 'fa-solid fa-square';
      data.genreExclude = data.genreExclude.filter(x => x !== genreID);
    } else if (element.className.includes('check')) {
      // check goes to X, remove genre-inclusion, add genre-exclusion
      element.className = 'fa-solid fa-square-xmark';
      data.genreInclude = data.genreInclude.filter(x => x !== genreID);
      data.genreExclude.push(genreID);
    } else {
      element.className = 'fa-solid fa-square-check';
      // square to check, add genre-inclusion
      data.genreInclude.push(genreID);
    }
  }
}

function cycleStatusCheckbox(element) {
  if (element.className.includes('square')) {
    const statusName = element.parentElement.id.split('-')[1];
    if (element.className.includes('check')) {
      element.className = 'fa-solid fa-square';
      data.status = data.status.filter(x => x !== statusName);
    } else {
      element.className = 'fa-solid fa-square-check';
      data.status.push(statusName);
    }
  }
}

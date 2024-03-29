/* global data */
/* global LZString */
/* exported data */

const $headbarMenu = document.querySelector('.headbar-menu-toggle');
const $sidebarMenu = document.querySelector('.sidebar-modal');
const $sidebarContainer = document.querySelector('.sidebar-container');
const $cardContainer = document.querySelector('.card-container');
const $sidebarGenres = document.querySelector('.sidebar-genres');
const $sidebarThemes = document.querySelector('.sidebar-themes');
const $sidebarDemos = document.querySelector('.sidebar-demos');
const $sidebarStatus = document.querySelector('.sidebar-status');
const $detailContainer = document.querySelector('.detail-container');
const $detailModal = document.querySelector('.detail-modal');
const $myList = document.querySelector('.my-list');
const $listContainer = document.querySelector('.list-container');
const $loadspin = document.querySelector('.lds-spinner');

window.addEventListener('DOMContentLoaded', function (event) {
  if (data.genres.length === 0) {
    data.genres = updateGenreObjectXMLCall();
    data.themes = updateThemeObjectXMLCall();
    data.demographics = updateDemographicObjectXMLCall();
  } else {
    genreObjectToCheckbox(data.genres, $sidebarGenres);
    genreObjectToCheckbox(data.themes, $sidebarThemes);
    genreObjectToCheckbox(data.demographics, $sidebarDemos);
  }
  data.entries = [];
  data.status = [];
  if (!data.saved) {
    data.saved = [];
  }
  $myList.textContent = 'View My List ' + '(' + data.saved.length + ')';
  updateInfoMessage('Welcome to YALM.\r\n\r\nTouch the hamburger menu in the top-right to get started with searching for and creating a manga list.');
});

$cardContainer.addEventListener('click', function (event) {
  const close = event.target.closest('.card');
  if (close) {
    const targetID = +close.classList[1].split('-')[1];
    for (const entry of data.entries) {
      if (entry.mal_id === targetID) {
        objectToDetailViewDOM(entry);
        break;
      }
    }
    detailVisibilityToggle();
  }
});

$listContainer.addEventListener('click', function (event) {
  const close = event.target.closest('.my-card');
  if (close) {
    const targetID = +close.classList[1].split('-')[1];
    for (const entry of data.saved) {
      if (entry.mal_id === targetID) {
        objectToDetailViewDOM(entry);
        break;
      }
    }
    detailVisibilityToggle();
  }
});

$detailModal.addEventListener('click', function (event) {
  if (event.target.className.includes('dark-blur')) {
    detailVisibilityToggle();
  } else if (event.target.className.includes('detail-save')) {
    const objectid = +event.target.classList[1].split('-')[1];
    for (const object of data.entries) {
      if (object.mal_id === objectid) {
        data.saved = data.saved.filter(x => x.mal_id !== objectid);
        data.saved.push(object);
      }
    }
    event.target.classList.toggle('detail-save');
    event.target.classList.toggle('detail-remove');
    event.target.textContent = 'Remove';
    $myList.textContent = 'View My List ' + '(' + data.saved.length + ')';
  } else if (event.target.className.includes('detail-remove')) {
    const objectid = +event.target.classList[1].split('-')[1];
    data.saved = data.saved.filter(x => x.mal_id !== objectid);
    event.target.classList.toggle('detail-save');
    event.target.classList.toggle('detail-remove');
    event.target.textContent = 'Save';
    $myList.textContent = 'View My List ' + '(' + data.saved.length + ')';
    if (!$listContainer.classList.contains('hidden')) {
      detailVisibilityToggle();
    }
  }
  if (!$listContainer.classList.contains('hidden')) {
    listContainerClearDOM();
    renderList();
  }
});

$headbarMenu.addEventListener('click', function (event) {
  sidebarVisibilityToggle();
});

$sidebarMenu.addEventListener('click', function (event) {
  if (event.target.className.includes('blur')) {
    sidebarVisibilityToggle();
  }
});

$myList.addEventListener('click', function (event) {
  if ($listContainer.classList.contains('hidden')) {
    swapCardListViews();
    listContainerClearDOM();
    renderList();
  }
  sidebarVisibilityToggle();
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
  $sidebarContainer.classList.toggle('offset-right');
}

function detailVisibilityToggle() {
  $detailModal.classList.toggle('dark-blur');
  $detailContainer.classList.toggle('hidden');
}

function swapCardListViews() {
  $cardContainer.classList.toggle('hidden');
  $listContainer.classList.toggle('hidden');
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
  dropdownToggle(event, $sidebarGenres);
});

const $sidebarThemeToggle = document.querySelector('.sidebar-theme-toggle');
$sidebarThemeToggle.addEventListener('click', function (event) {
  dropdownToggle(event, $sidebarThemes);
});

const $sidebarDemoToggle = document.querySelector('.sidebar-demo-toggle');
$sidebarDemoToggle.addEventListener('click', function (event) {
  dropdownToggle(event, $sidebarDemos);
});

const $sidebarStatusToggle = document.querySelector('.sidebar-status-toggle');
$sidebarStatusToggle.addEventListener('click', function (event) {
  dropdownToggle(event, $sidebarStatus);
});

function dropdownToggle(event, element) {
  if (event.target.nodeName === 'I' || event.target.nodeName === 'SPAN') {
    event.target.parentElement.children[1].classList.toggle('fa-ellipsis');
    event.target.parentElement.children[1].classList.toggle('fa-caret-down');
    element.classList.toggle('hidden');
  }
}

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
    // eslint-disable-next-line prefer-const
    let genreObj = {};
    for (const genre of genredata) {
      genreObj[genre.name] = genre.mal_id;
    }
    data.genres = genreObj;
    genreObjectToCheckbox(data.genres, $sidebarGenres);
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
    genreObjectToCheckbox(data.themes, $sidebarThemes);
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
    genreObjectToCheckbox(data.demographics, $sidebarDemos);
  });
  xhr.send();
}

function getJSOMFromAPI(q) {
  const xhr = new XMLHttpRequest();
  const apiParams = getParams(q);
  const targetUrl = encodeURIComponent('https://api.jikan.moe/v4/manga' + '?min_score=3' + apiParams);
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.responseType = 'json';
  $loadspin.classList.toggle('hidden');
  xhr.addEventListener('load', function () {
    $loadspin.classList.toggle('hidden');
    cardContainerClearDOM();
    if ($cardContainer.classList.contains('hidden')) {
      swapCardListViews();
    }
    if (xhr.response.data.length) {
      data.entries = [];
      for (let i = 0; i < xhr.response.data.length; i++) {
        const viewObject = {
          title: xhr.response.data[i].title,
          image: xhr.response.data[i].images.jpg.image_url,
          synopsis: xhr.response.data[i].synopsis,
          genres: xhr.response.data[i].genres,
          themes: xhr.response.data[i].themes,
          status: xhr.response.data[i].status,
          authors: xhr.response.data[i].authors,
          score: xhr.response.data[i].score,
          demo: xhr.response.data[i].demographics,
          mal_id: xhr.response.data[i].mal_id
        };
        data.entries.push(viewObject);
      }
      renderEntries();
    } else {
      updateInfoMessage('Nothing found with endpoint: \r\n' + getParams(q));
    }
  });
  xhr.addEventListener('error', function () {
    $loadspin.classList.add('hidden');
    updateInfoMessage('There has been an network error.');
  });
  xhr.send();
}

function updateInfoMessage(content) {
  const $infoMessage = document.createElement('p');
  $infoMessage.setAttribute('style', 'white-space: pre-wrap;');
  $infoMessage.textContent = content;
  $infoMessage.className = 'no-find';
  $cardContainer.appendChild($infoMessage);
}

function getParams(q) {
  let apiParams = '&order_by=score&sort=desc';
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

function renderEntries() {
  for (const entry of data.entries) {
    $cardContainer.appendChild(objectToCardDOM(entry));
  }
}

function renderList() {
  for (const entry of data.saved) {
    $listContainer.appendChild(objectToListDOM(entry));
  }
}

function cardContainerClearDOM() {
  const $cardNodeList = document.querySelectorAll('.card');
  for (const node of $cardNodeList) {
    node.remove();
  }
  removeNothing();
}

function listContainerClearDOM() {
  const $cardNodeList = document.querySelectorAll('.my-card');
  for (const node of $cardNodeList) {
    node.remove();
  }
  removeNothing();
}

function removeNothing() {
  const $nothing = document.querySelector('.no-find');
  if ($nothing) {
    $nothing.remove();
  }
}

function objectToCardDOM(object) {
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
  $card.classList.add('card');
  $card.classList.add('id-' + object.mal_id);
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
    // only render some of the text since it will otherwise overflow.
    $p.textContent = object.synopsis.slice(0, 650);
  }

  $cardText.appendChild($h4);
  $cardText.appendChild($p);
  $cardImage.appendChild($img);
  $card.appendChild($cardImage);
  $card.appendChild($cardText);

  return $card;
}

function objectToListDOM(object) {
  // <div class="my-card id-___">
  //   <div class="card-image">
  //     <img src="https://cdn.myanimelist.net/images/manga/5/IMAGENUMBER.jpg" alt="">
  //   </div>
  //   <div class="card-text">
  //     <h4>Title Text</h4>
  //   </div>
  // </div>

  const $card = document.createElement('div');
  $card.classList.add('my-card');
  $card.classList.add('id-' + object.mal_id);
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
    $p.textContent = object.authors[0].name;
  }

  $cardText.appendChild($h4);
  $cardText.appendChild($p);
  $cardImage.appendChild($img);
  $card.appendChild($cardImage);
  $card.appendChild($cardText);

  return $card;
}

function objectToDetailViewDOM(object) {
  clearDetailView();
  // object properties:
  // title image synopsis genres[] status authors[] score demo[] mal_id

  const $titlewrapper = document.createElement('div');

  const $title = document.createElement('p');
  $title.textContent = object.title;
  $titlewrapper.appendChild($title);

  const $img = document.createElement('img');
  $img.setAttribute('src', object.image);
  $img.classList.add('detail-img');

  const $synopsis = document.createElement('p');
  $synopsis.textContent = object.synopsis;
  $synopsis.classList.add('detail-desc');

  const $status = document.createElement('span');
  $status.textContent = 'Status: ' + object.status;
  $status.classList.add('detail-status');

  const $scoreWrap = document.createElement('p');
  const $score = document.createElement('span');
  $score.textContent = object.score;

  const $starI = document.createElement('i');
  $starI.className = 'fa-solid fa-star';

  const $authors = document.createElement('p');
  for (const author of object.authors) {
    const $auth = document.createElement('span');
    $auth.textContent = author.name;
    $authors.appendChild($auth);
  }

  const $genreList = document.createElement('div');
  $genreList.classList.add('detail-tag');

  // Some of the objects don't have demographic data, should fix a break.
  if (object.demo[0]) {
    const $demo = document.createElement('span');
    $demo.textContent = object.demo[0].name;
    $demo.className = 'detail-demographic-tag';
    $genreList.appendChild($demo);
  }

  for (const genre of object.genres) {
    const $genre = document.createElement('span');
    $genre.textContent = genre.name;
    $genreList.appendChild($genre);
  }

  for (const theme of object.themes) {
    const $theme = document.createElement('span');
    $theme.textContent = theme.name;
    $genreList.appendChild($theme);
  }

  const $saveButton = document.createElement('button');
  if (data.saved.some(x => x.mal_id === object.mal_id)) {
    $saveButton.textContent = 'Remove';
    $saveButton.classList.add('detail-remove');
  } else {
    $saveButton.textContent = 'Save';
    $saveButton.classList.add('detail-save');
  }
  $saveButton.classList.add('saveid-' + object.mal_id);

  $scoreWrap.appendChild($score);
  $scoreWrap.appendChild($starI);
  $scoreWrap.appendChild($status);

  $titlewrapper.appendChild($authors);
  $titlewrapper.appendChild($scoreWrap);
  $titlewrapper.appendChild($saveButton);
  $titlewrapper.className = 'detail-title';

  $detailContainer.appendChild($titlewrapper);
  $detailContainer.appendChild($img);
  $detailContainer.appendChild($genreList);
  $detailContainer.appendChild($synopsis);
}

function clearDetailView() {
  while ($detailContainer.firstChild) {
    $detailContainer.removeChild($detailContainer.firstChild);
  }
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

const $exportTextbox = document.getElementById('export-list');
const $sidebarInput = document.querySelector('.sidebar-import');

$sidebarInput.addEventListener('submit', function (event) {
  event.preventDefault();
  if (event.submitter.classList.contains('export-clipboard')) {
    $exportTextbox.value = LZString.compressToUTF16(JSON.stringify(data.saved));
    $exportTextbox.select();
    navigator.clipboard.writeText($exportTextbox.value);
  } else if (event.submitter.classList.contains('import-button')) {
    const $load = document.getElementById('import-list');

    $load.select();

    const readvalue = JSON.parse(LZString.decompressFromUTF16($load.value));

    if (validLoad(readvalue)) {
      data.saved = readvalue;
    }

    $myList.textContent = 'View My List ' + '(' + data.saved.length + ')';
    if ($listContainer.classList.contains('hidden')) {
      swapCardListViews();
    }
    sidebarVisibilityToggle();
    listContainerClearDOM();
    renderList();
  }
});

function validLoad(object) {
  // this will need some more development. more checks needed.
  if (object !== null) {
    return true;
  }
  return false;
}

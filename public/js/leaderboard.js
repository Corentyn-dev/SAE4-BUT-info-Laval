// leaderboard.js

// État de tri initial pour chaque colonne
let sortState = {
  name: 0, // 0: non trié, 1: croissant, -1: décroissant
  xp: 0,
  category: 0
};

document.addEventListener('DOMContentLoaded', () => {
  fetchLeaderboardData();
});

function fetchLeaderboardData() {
  const leaderboard = document.querySelector('#xpLeaderboardContainer');

  fetch('/api/user/leaderboard')
      .then((res) => res.json())
      .then((data) => {
          if (data.error) {
              leaderboard.innerHTML = `<p class="error">${data.error}</p>`;
          } else {
              let max_xp = 0;

              data.forEach((user) => {
                  if (user.xp > max_xp) {
                      max_xp = user.xp;
                  }
              });

              data.forEach((user, index) => {
                  const xp_width = (user.xp / max_xp) * 100 + '%';

                  let pfp = user.dc_pfp ? `https://cdn.discordapp.com/avatars/${user.dc_id}/${user.dc_pfp}.png` : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

                  leaderboard.innerHTML += `
                      <div class="leaderboardUser sortable"> <!-- Ajoutez la classe 'sortable' ici -->
                          <p class="leaderboardUserRank">${index + 1}</p>
                          <span class="leaderboardUserSpan">
                              <img class="leaderboardUserPfp" src="${pfp}" alt="pfp">
                              <p class="leaderboardUserPseudo">${user.username}</p>
                          </span>
                          <p class="leaderboardUserScore" style="--xp_bar_width: ${xp_width};">${user.xp}</p>
                          <p class="leaderboardUserCategory">${user.category}</p>
                      </div>
                  `;
              });
              
              // Une fois que les données du tableau sont chargées, attachez les écouteurs d'événements pour le tri
              attachSortEventListeners();
          }
      });
}

function attachSortEventListeners() {
  document.querySelector('#nameSortIcon').addEventListener('click', () => sortLeaderboard('name'));
  document.querySelector('#xpSortIcon').addEventListener('click', () => sortLeaderboard('xp'));
  document.querySelector('#categorySortIcon').addEventListener('click', () => sortLeaderboard('category'));
}

function sortLeaderboard(column) {
  const leaderboard = document.querySelector('#xpLeaderboardContainer');
  const leaderboardUsers = leaderboard.querySelectorAll('.sortable'); // Modifiez la classe ici
  const leaderboardUsersArray = Array.from(leaderboardUsers);

  // Changer l'état de tri pour la colonne donnée
  sortState[column] = sortState[column] === 0 ? 1 : sortState[column] === 1 ? -1 : 0;

  // Réinitialiser les états de tri des autres colonnes
  Object.keys(sortState).forEach(key => {
    if (key !== column) {
      sortState[key] = 0;
    }
  });

  leaderboardUsersArray.sort((a, b) => {
      let aValue, bValue;
      if (column === 'name') {
        aValue = a.querySelector('.leaderboardUserPseudo').innerText;
        bValue = b.querySelector('.leaderboardUserPseudo').innerText;
      } else if (column === 'xp') {
        aValue = parseInt(a.querySelector('.leaderboardUserScore').innerText);
        bValue = parseInt(b.querySelector('.leaderboardUserScore').innerText);
      } else if (column === 'category') {
        aValue = a.querySelector('.leaderboardUserCategory').innerText;
        bValue = b.querySelector('.leaderboardUserCategory').innerText;
      }
      return sortState[column] === 1 ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  // Ajouter les utilisateurs triés à nouveau
  leaderboardUsersArray.forEach((user, index) => {
      leaderboard.appendChild(user);
  });

  // Mettre à jour l'icône de tri
  updateSortIcon(column, sortState[column]);
}

function updateSortIcon(column, state) {
  // Réinitialiser toutes les icônes de tri
  document.querySelectorAll('.fa-sort-up, .fa-sort-down').forEach(icon => {
      icon.style.display = 'none';
  });
  
  // Mettre à jour l'icône de tri pour la colonne donnée
  const iconElement = document.querySelector(`#${column}SortIcon`);
  iconElement.style.display = 'inline';
  if (state === 1) {
      iconElement.classList.add('fa-sort-up');
      iconElement.classList.remove('fa-sort-down');
  } else if (state === -1) {
      iconElement.classList.add('fa-sort-down');
      iconElement.classList.remove('fa-sort-up');
  } else {
      iconElement.classList.remove('fa-sort-up', 'fa-sort-down');
  }
}

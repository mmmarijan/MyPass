let editingIndex = null;

function generatePassword(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-[]{}';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function saveUserData(user, pass) {
  let data = JSON.parse(localStorage.getItem('userData')) || [];
  if (editingIndex !== null) {
    data[editingIndex] = { user, pass };
    editingIndex = null;
  } else {
    data.push({ user, pass });
  }
  localStorage.setItem('userData', JSON.stringify(data));
  renderUserData();
}

function deleteEntry(index) {
  let data = JSON.parse(localStorage.getItem('userData')) || [];
  data.splice(index, 1);
  localStorage.setItem('userData', JSON.stringify(data));
  renderUserData();
}

function renderUserData() {
  const data = JSON.parse(localStorage.getItem('userData')) || [];
  const list = document.getElementById('data-list');
  list.innerHTML = '';

  data.forEach((entry, index) => {
    const li = document.createElement('li');

    const info = document.createElement('div');
    info.className = 'entry-info';

    const username = document.createElement('strong');
    username.textContent = entry.user;

    const password = document.createElement('div');
    password.className = 'password';
    password.textContent = 'Passwort Anzeigen';
    password.addEventListener('click', () => {
      password.textContent = password.textContent === entry.pass ? 'Klicke zum Anzeigen' : entry.pass;
    });

    info.appendChild(username);
    info.appendChild(password);
    li.appendChild(info);

    if (entry.pass) {
      const menuBtn = document.createElement('button');
      menuBtn.className = 'menu-button';
      menuBtn.innerHTML = '⋮';

      const menu = document.createElement('div');
      menu.className = 'menu';

      const edit = document.createElement('button');
      edit.textContent = 'Bearbeiten';
      edit.addEventListener('click', () => {
        document.getElementById('username-email').value = entry.user;
        document.getElementById('custom-password').value = entry.pass;
        editingIndex = index;
        menu.style.display = 'none';
      });

      const del = document.createElement('button');
      del.textContent = 'Löschen';
      del.addEventListener('click', () => {
        deleteEntry(index);
      });

      menu.appendChild(edit);
      menu.appendChild(del);

      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.menu').forEach(m => m.style.display = 'none');
        menu.style.display = 'block';
      });

      document.addEventListener('click', () => {
        menu.style.display = 'none';
      });

      li.appendChild(menuBtn);
      li.appendChild(menu);
    }

    list.appendChild(li);
  });
}

document.getElementById('toggle-generator').addEventListener('click', () => {
  const section = document.getElementById('generator-section');
  section.style.display = section.style.display === 'none' || !section.style.display ? 'block' : 'none';
});

document.getElementById('generate-password').addEventListener('click', () => {
  const len = parseInt(document.getElementById('password-length').value);
  const pwd = generatePassword(len);
  document.getElementById('generated-password').value = pwd;
});

document.getElementById('save-btn').addEventListener('click', () => {
  const user = document.getElementById('username-email').value.trim();
  const custom = document.getElementById('custom-password').value.trim();
  const gen = document.getElementById('generated-password').value.trim();

  if (!user) return alert('Bitte gib einen Benutzernamen oder eine E-Mail ein.');

  const password = custom || gen;
  if (!password) return alert('Bitte gib ein Passwort ein oder generiere eins.');

  saveUserData(user, password);

  // Felder leeren
  document.getElementById('username-email').value = '';
  document.getElementById('custom-password').value = '';
  document.getElementById('generated-password').value = '';
});

window.onload = renderUserData;

// Adoptails - Camada de acesso ao banco de dados (localStorage)
// Depende de: database/pets-data.js (INITIAL_PETS)

// Database Management (LocalStorage wrapper)
function getPetsDatabase() {
    const data = localStorage.getItem('adoptails_pets');
    if (!data) {
        localStorage.setItem('adoptails_pets', JSON.stringify(INITIAL_PETS));
        return INITIAL_PETS;
    }
    return JSON.parse(data);
}

function savePetDatabase(pet) {
    const currentPets = getPetsDatabase();
    currentPets.unshift(pet);
    localStorage.setItem('adoptails_pets', JSON.stringify(currentPets));
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('adoptails_favorites') || '[]');
}

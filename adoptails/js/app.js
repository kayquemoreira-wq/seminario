// Adoptails - Lógica da interface
// Depende de: database/pets-data.js e database/db.js

function toggleFavorite(petId) {
    let favorites = getFavorites();
    if (favorites.includes(petId)) {
        favorites = favorites.filter(id => id !== petId);
        alertNotification('Removido dos favoritos');
    } else {
        favorites.push(petId);
        alertNotification('Adicionado aos seus favoritos! ❤️');
    }
    localStorage.setItem('adoptails_favorites', JSON.stringify(favorites));
    updateFavoritesBadge();
    renderPetsGrid();
    renderFavoritesList();
}

// Render Functions
function renderPetsGrid() {
    const pets = getPetsDatabase();
    const favorites = getFavorites();

    const searchVal = document.getElementById('filterSearch').value.toLowerCase();
    const especieVal = document.getElementById('filterEspecie').value;
    const porteVal = document.getElementById('filterPorte').value;
    const sexoVal = document.getElementById('filterSexo').value;

    const filteredPets = pets.filter(pet => {
        const matchesSearch = pet.nome.toLowerCase().includes(searchVal) || pet.historia.toLowerCase().includes(searchVal);
        const matchesEspecie = especieVal === 'todos' || pet.especie === especieVal;
        const matchesPorte = porteVal === 'todos' || pet.porte === porteVal;
        const matchesSexo = sexoVal === 'todos' || pet.sexo === sexoVal;

        return matchesSearch && matchesEspecie && matchesPorte && matchesSexo;
    });

    const grid = document.getElementById('petsGrid');
    const emptyState = document.getElementById('emptyState');

    if (filteredPets.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }

    grid.innerHTML = filteredPets.map(pet => {
        const isFav = favorites.includes(pet.id);
        return `
            <div class="bg-white rounded-3xl overflow-hidden border border-amber-100/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div class="relative overflow-hidden h-56">
                    <img src="${pet.foto}" alt="${pet.nome}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'">
                    <button onclick="toggleFavorite('${pet.id}')" class="absolute top-3 right-3 w-10 h-10 rounded-full glass-card flex items-center justify-center text-warmGray-800 hover:text-red-500 transition shadow-md">
                        <i class="${isFav ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart text-lg"></i>
                    </button>
                    <span class="absolute bottom-3 left-3 bg-warmGray-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                        ${pet.sexo} • ${pet.porte}
                    </span>
                </div>

                <div class="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <h3 class="text-xl font-bold text-amber-950">${pet.nome}</h3>
                            <span class="text-xs font-bold text-brand-700 bg-amber-100 px-2.5 py-1 rounded-lg">${pet.idade}</span>
                        </div>

                        <div class="flex flex-wrap gap-1.5 my-3">
                            ${pet.tags.map(tag => `<span class="text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200/60 px-2 py-0.5 rounded-md">${tag}</span>`).join('')}
                        </div>

                        <p class="text-xs text-warmGray-800 line-clamp-2 leading-relaxed mb-4">
                            ${pet.historia}
                        </p>
                    </div>

                    <button onclick="verDetalhesPet('${pet.id}')" class="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2">
                        <span>Quero Adotar</span>
                        <i class="fa-solid fa-paw text-xs"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function verDetalhesPet(petId) {
    const pets = getPetsDatabase();
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;

    const content = document.getElementById('modalPetContent');
    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2">
            <div class="h-64 md:h-full relative">
                <img src="${pet.foto}" alt="${pet.nome}" class="w-full h-full object-cover">
            </div>
            <div class="p-6 md:p-8 flex flex-col justify-between space-y-4">
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h3 class="text-3xl font-extrabold text-amber-950">${pet.nome}</h3>
                            <p class="text-xs text-warmGray-800 flex items-center gap-1 mt-1">
                                <i class="fa-solid fa-location-dot text-brand-600"></i> ${pet.localizacao || 'São Paulo - SP'}
                            </p>
                        </div>
                        <span class="bg-amber-100 text-brand-800 font-bold text-xs px-3 py-1 rounded-full">${pet.idade}</span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 my-4 bg-amber-50 p-3 rounded-2xl border border-amber-100 text-xs text-warmGray-800">
                        <div><strong>Porte:</strong> ${pet.porte}</div>
                        <div><strong>Sexo:</strong> ${pet.sexo}</div>
                        <div><strong>Vacinas:</strong> ${pet.vacinado ? 'Em dia ✅' : 'Pendente'}</div>
                        <div><strong>Castrado:</strong> ${pet.castrado ? 'Sim ✅' : 'Não'}</div>
                    </div>

                    <h4 class="text-xs font-bold text-warmGray-800 uppercase tracking-wider mb-1">História de Resgate</h4>
                    <p class="text-sm text-warmGray-800 leading-relaxed mb-4">${pet.historia}</p>
                </div>

                <!-- Formulário de Contato para Adoção -->
                <form onsubmit="enviarSolicitacaoAdocao(event, '${pet.nome}')" class="space-y-3 pt-3 border-t border-amber-100">
                    <h4 class="text-xs font-bold text-amber-950 uppercase">Tenho interesse em adotar ${pet.nome}</h4>
                    <input type="text" required placeholder="Seu Nome Completo" class="w-full px-3 py-2 border border-warmGray-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500">
                    <input type="tel" required placeholder="Seu WhatsApp / Telefone" class="w-full px-3 py-2 border border-warmGray-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500">
                    <button type="submit" class="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm shadow transition">
                        Enviar Pedido de Adoção
                    </button>
                </form>
            </div>
        </div>
    `;

    openModal('modalPetDetalhes');
}

function renderFavoritesList() {
    const favorites = getFavorites();
    const pets = getPetsDatabase();
    const favPets = pets.filter(p => favorites.includes(p.id));
    const container = document.getElementById('favoritosList');

    if (favPets.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-warmGray-800">
                <i class="fa-regular fa-heart text-4xl mb-2 text-amber-300"></i>
                <p class="text-sm">Você ainda não favoritou nenhum pet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = favPets.map(pet => `
        <div class="flex items-center justify-between gap-3 p-3 bg-amber-50/50 border border-amber-100 rounded-2xl">
            <img src="${pet.foto}" alt="${pet.nome}" class="w-14 h-14 rounded-xl object-cover">
            <div class="flex-1">
                <h4 class="font-bold text-amber-950 text-sm">${pet.nome}</h4>
                <p class="text-xs text-warmGray-800">${pet.sexo} • ${pet.idade}</p>
            </div>
            <button onclick="verDetalhesPet('${pet.id}'); toggleFavoritosDrawer();" class="p-2 bg-brand-600 text-white rounded-lg text-xs">
                <i class="fa-solid fa-eye"></i>
            </button>
            <button onclick="toggleFavorite('${pet.id}')" class="p-2 text-red-500 hover:bg-red-50 rounded-lg text-xs">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function updateFavoritesBadge() {
    const count = getFavorites().length;
    document.getElementById('favCountBadge').innerText = count;
    document.getElementById('favCountBadgeMobile').innerText = count;
}

// Form Submit Actions
function salvarNovoPet(e) {
    e.preventDefault();
    const nome = document.getElementById('petNome').value;
    const especie = document.getElementById('petEspecie').value;
    const sexo = document.getElementById('petSexo').value;
    const porte = document.getElementById('petPorte').value;
    const idade = document.getElementById('petIdade').value;
    const foto = document.getElementById('petFoto').value;
    const tagsInput = document.getElementById('petTags').value;
    const historia = document.getElementById('petHistoria').value;

    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : ['Resgatado', 'Acolhido'];

    const novoPet = {
        id: Date.now().toString(),
        nome,
        especie,
        sexo,
        porte,
        idade,
        foto,
        tags,
        historia,
        vacinado: true,
        castrado: true,
        localizacao: 'São Paulo - SP'
    };

    savePetDatabase(novoPet);
    renderPetsGrid();
    closeModal('modalCadastrarPet');
    document.getElementById('formCadastrarPet').reset();
    alertNotification(`Pet ${nome} cadastrado com sucesso! ❤️`);
}

function enviarSolicitacaoAdocao(e, petNome) {
    e.preventDefault();
    closeModal('modalPetDetalhes');
    alertNotification(`Solicitação para adotar o(a) ${petNome} enviada! Entraremos em contato via WhatsApp.`);
}

function enviarVoluntario(e) {
    e.preventDefault();
    closeModal('modalVoluntario');
    alertNotification('Cadastro de voluntário enviado! Obrigado por estender a mão.');
}

// Helper Actions
function applyFilters() {
    renderPetsGrid();
}

function resetFilters() {
    document.getElementById('filterSearch').value = '';
    document.getElementById('filterEspecie').value = 'todos';
    document.getElementById('filterPorte').value = 'todos';
    document.getElementById('filterSexo').value = 'todos';
    renderPetsGrid();
}

function copiarPix() {
    const pix = document.getElementById('pixKeyText').innerText;
    navigator.clipboard.writeText(pix).then(() => {
        alertNotification('Chave PIX copiada para a área de transferência!');
    }).catch(() => {
        alertNotification('Chave PIX: pix@adoptails.org.br');
    });
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
}

function toggleFavoritosDrawer() {
    document.getElementById('favoritosDrawer').classList.toggle('hidden');
    renderFavoritesList();
}

function alertNotification(msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMessage');
    msgEl.innerText = msg;

    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3500);
}

// Initialize on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
    renderPetsGrid();
    updateFavoritesBadge();
});

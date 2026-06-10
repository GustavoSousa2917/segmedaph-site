document.addEventListener("DOMContentLoaded", () => {
    
    const selectCidade = document.getElementById('cidade');
    const containerDepoimentos = document.getElementById('container-depoimentos');

    async function carregarDadosDoCurso() {
        try {
            const response = await fetch('./assets/data/dados.json');
            
            if (!response.ok) {
                throw new Error(`Erro de rede: ${response.status}`);
            }
            
            const dados = await response.json();
            
            // 1. Preenche o Select de Cidades
            if (selectCidade) {
                selectCidade.innerHTML = '<option value="" selected disabled>Escolha sua cidade...</option>';
                dados.cidades_disponiveis.forEach(cidade => {
                    const option = document.createElement('option');
                    option.value = cidade.nome.toLowerCase().replace(' - ce', '');
                    option.textContent = `${cidade.nome} (Mensalidade: R$ ${cidade.mensalidade.toFixed(2)})`;
                    selectCidade.appendChild(option);
                });
            }

            // 2. Preenche os Depoimentos Dinamicamente com Bootstrap Cards
            if (containerDepoimentos && dados.depoimentos) {
                containerDepoimentos.innerHTML = ''; 
                
                dados.depoimentos.forEach(dep => {
                    const col = document.createElement('div');
                    col.className = 'col-md-4';
                    
                    col.innerHTML = `
                        <div class="card h-100 border-0 shadow-sm p-4">
                            <div class="d-flex align-items-center mb-3">
                                <img src="${dep.foto}" alt="${dep.nome}" class="rounded-circle me-3" width="60" height="60" style="object-fit: cover; border: 2px solid var(--cor-primaria);">
                                <div>
                                    <h5 class="fw-bold mb-0 text-dark" style="font-size: 1.1rem;">${dep.nome}</h5>
                                    <small class="text-muted"><i class="fa-solid fa-location-dot me-1"></i> Aluno(a) de ${dep.cidade}</small>
                                </div>
                            </div>
                            <p class="card-text text-muted fst-italic">"${dep.texto}"</p>
                            <div class="text-warning mt-auto">
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                            </div>
                        </div>
                    `;
                    containerDepoimentos.appendChild(col);
                });
            }
            
        } catch (erro) {
            console.error("Falha ao carregar os dados.json:", erro);
            if(selectCidade) selectCidade.innerHTML = '<option value="" selected disabled>Erro ao carregar dados.</option>';
        }
    }

    // Interceptando o envio do formulário
    const form = document.getElementById('formInscricao');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Inscrição simulada com sucesso! Em um ambiente real, enviaríamos isso para um banco de dados ou WhatsApp.");
            form.reset();
        });
    }

    carregarDadosDoCurso();
});
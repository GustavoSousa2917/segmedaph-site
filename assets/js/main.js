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

            // 2. Preenche os Depoimentos Dinamicamente
            if (containerDepoimentos && dados.depoimentos) {
                containerDepoimentos.innerHTML = ''; 
                
                dados.depoimentos.forEach((dep) => {
                    const slide = document.createElement('div');
                    slide.className = 'depoimento-slide'; // Apenas o card normal
                    
                    slide.innerHTML = `
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
                    containerDepoimentos.appendChild(slide);
                });

                // Inicia o motor do Slider
                iniciarSliderDepoimentos();
            }
            
        } catch (erro) {
            console.error("Falha ao carregar os dados.json:", erro);
            if(selectCidade) selectCidade.innerHTML = '<option value="" selected disabled>Erro ao carregar dados.</option>';
        }
    }

    // 3. Função do Slider Centralizado
    function iniciarSliderDepoimentos() {
        const track = document.getElementById('container-depoimentos');
        const slides = document.querySelectorAll('.depoimento-slide');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        let currentIndex = 0;

        if (slides.length === 0) return;

        function updateSlider() {
            // Adiciona a classe 'active' apenas no item do meio
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (index === currentIndex) {
                    slide.classList.add('active');
                }
            });

            // Pega a largura do card, o espaço (gap) e a largura total da tela
            const slideWidth = slides[0].getBoundingClientRect().width;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
            const containerWidth = track.parentElement.getBoundingClientRect().width;
            
            // O offset é a margem necessária para empurrar o slide para o centro exato
            const offset = (containerWidth - slideWidth) / 2;
            const moveAmount = slideWidth + gap;
            
            // Move a trilha compensando com o offset para centralizar
            track.style.transform = `translateX(${-(currentIndex * moveAmount) + offset}px)`;
        }

        // Lógica dos Botões
        btnNext.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Se chegou no fim, volta pro começo
            }
            updateSlider();
        });

        btnPrev.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = slides.length - 1; // Se está no começo, vai pro final
            }
            updateSlider();
        });

        // Executa a primeira vez
        updateSlider();

        // Recalcula se o usuário virar o celular ou redimensionar a tela
        window.addEventListener('resize', updateSlider);

        // Transição automática a cada 4 segundos
        let autoplay = setInterval(() => {
            btnNext.click();
        }, 4000);

        // Pausa a transição se o usuário colocar o mouse em cima
        track.parentElement.addEventListener('mouseenter', () => clearInterval(autoplay));
    }

    // Interceptando o formulário
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
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
            
            if (selectCidade) {
                selectCidade.innerHTML = '<option value="" selected disabled>Escolha sua cidade...</option>'; //pega as cidades que tem no json
                dados.cidades_disponiveis.forEach(cidade => {
                    const option = document.createElement('option');
                    option.value = cidade.nome.toLowerCase().replace(' - ce', '');
                    option.textContent = `${cidade.nome} (Mensalidade: R$ ${cidade.mensalidade.toFixed(2)})`;
                    selectCidade.appendChild(option);
                });
            }

            if (containerDepoimentos && dados.depoimentos) {
                containerDepoimentos.innerHTML = ''; 
                
                dados.depoimentos.forEach((dep) => {
                    const slide = document.createElement('div'); 
                    slide.className = 'depoimento-slide'; 
                    
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

                iniciarSliderDepoimentos();
            }
            
        } catch (erro) {
            console.error("Falha ao carregar os dados.json:", erro);
            if(selectCidade) selectCidade.innerHTML = '<option value="" selected disabled>Erro ao carregar dados.</option>';
        }
    }

    function iniciarSliderDepoimentos() {
        const track = document.getElementById('container-depoimentos');
        const slides = document.querySelectorAll('.depoimento-slide');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        let IndexAtual = 0;

        if (slides.length === 0) return;

        function updateSlider() {
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (index === IndexAtual) {
                    slide.classList.add('active'); 
                }
            });

            
            const slidelargura = slides[0].getBoundingClientRect().width;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 0; 
            const containerlargura = track.parentElement.getBoundingClientRect().width;
            
          
            const centro = (containerlargura - slidelargura) / 2;
            const movendo = slidelargura + gap;
            
         
            track.style.transform = `translateX(${-(IndexAtual * movendo) + centro}px)`;
        }

     
        btnNext.addEventListener('click', () => {
            if (IndexAtual < slides.length - 1) {
                IndexAtual++;
            } else {
                IndexAtual = 0; 
            }
            updateSlider();
        });

       
        btnPrev.addEventListener('click', () => {
            if (IndexAtual > 0) {
                IndexAtual--;
            } else {
                IndexAtual = slides.length - 1; 
            }
            updateSlider();
        });

    
        updateSlider();

        
        let autoplay = setInterval(() => {
            btnNext.click();
        }, 10000);
    }

   
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
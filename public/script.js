// script.js - VERSÃO BLINDADA (COM AVISO DE ERRO)

const ACCESS_PASSWORD = "K92-X4M-PRO-88"; 

// 1. LOGIN
if(localStorage.getItem('studioProAuth') === 'true') {
    document.getElementById('loginOverlay').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
}

function checkPassword() {
    const input = document.getElementById('passwordInput');
    const errorMsg = document.getElementById('errorMsg');
    
    if(input.value === ACCESS_PASSWORD) {
        localStorage.setItem('studioProAuth', 'true'); 
        document.getElementById('loginOverlay').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
    } else {
        errorMsg.classList.remove('hidden');
        input.style.borderColor = "red";
    }
}

function logout() { localStorage.removeItem('studioProAuth'); location.reload(); }

// 2. GERADOR
document.getElementById('generatorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btnText');
    const grid = document.getElementById('resultsGrid');
    
    // Trava o botão
    btn.disabled = true;
    btnText.textContent = "Conectando ao Servidor...";
    
    // Limpa estado vazio
    if(grid.querySelector('.empty-state')) grid.innerHTML = '';

    const baseData = {
        handle: document.getElementById('handle').value,
        niche: document.getElementById('nicheSelector').value,
        keywords: document.getElementById('keywords').value,
        customTitle: document.getElementById('titleText').value,
        customSub: document.getElementById('subText').value
    };

    const visualOptions = {
        fontStyle: document.getElementById('fontStyle').value,
        primaryColor: document.getElementById('primaryColor').value,
        gradientColor: document.getElementById('gradientColor').value
    };

    const weeks = parseInt(document.getElementById('weeks').value) || 1;
    const postsPerWeek = parseInt(document.getElementById('postsPerWeek').value) || 1;
    const totalPosts = weeks * postsPerWeek;

    // Garante fontes carregadas
    await document.fonts.ready;

    for (let i = 1; i <= totalPosts; i++) {
        btnText.textContent = `Gerando Arte ${i}/${totalPosts}...`;
        addSkeleton(i); 

        try {
            // Tenta conectar. Se falhar, vai para o 'catch'
            // IMPORTANTE: '/api/generate' funciona tanto local quanto no Render
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(baseData)
            });

            // Verifica se o servidor respondeu OK (200)
            if (!response.ok) {
                throw new Error(`Erro do Servidor: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                await createCompositePost(data, i, visualOptions);
            } else {
                throw new Error(data.error || "Erro desconhecido na API");
            }

        } catch (error) {
            console.error("ERRO GRAVE:", error);
            // Mostra o erro no lugar do Skeleton para você ver!
            showErrorCard(i, error.message);
        }
    }

    btn.disabled = false;
    btnText.textContent = "Gerar Artes";
});

// --- FUNÇÕES VISUAIS ---

function addSkeleton(index) {
    const grid = document.getElementById('resultsGrid');
    const div = document.createElement('div');
    div.id = `skeleton-${index}`;
    div.className = 'skeleton-card';
    div.innerHTML = `
        <div class="skeleton-shimmer"></div>
        <div class="skeleton-content">
            <i class="fas fa-circle-notch fa-spin"></i>
            <span>Criando Design ${index}...</span>
        </div>
    `;
    grid.appendChild(div);
    if(window.innerWidth < 900) div.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function removeSkeleton(index) {
    const el = document.getElementById(`skeleton-${index}`);
    if (el) el.remove();
}

function showErrorCard(index, msg) {
    const el = document.getElementById(`skeleton-${index}`);
    if (el) {
        el.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #ff6b6b;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 10px;"></i>
                <p>Falha ao gerar:</p>
                <small>${msg}</small>
            </div>
        `;
        el.style.border = "1px solid red";
    }
}

// --- MONTAGEM CANVAS ---

async function createCompositePost(data, index, options) {
    const grid = document.getElementById('resultsGrid');
    
    // Cria Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Carrega Imagem
    const bgImage = new Image();
    bgImage.crossOrigin = "Anonymous"; // Crucial para não travar
    bgImage.src = data.image;

    await new Promise((resolve, reject) => {
        bgImage.onload = resolve;
        bgImage.onerror = () => reject(new Error("Falha ao baixar imagem da IA"));
    });

    // Remove Skeleton SÓ AGORA que deu tudo certo
    removeSkeleton(index);

    // Desenha Fundo
    ctx.drawImage(bgImage, 0, 0, 1080, 1080);

    // Degradê
    const rgb = hexToRgb(options.gradientColor);
    const gradient = ctx.createLinearGradient(0, 0, 0, 750);
    gradient.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.95)`); 
    gradient.addColorStop(0.6, `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.6)`);
    gradient.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b}, 0)`); 
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Elementos
    drawProDesignElements(ctx, options.primaryColor);

    // Texto
    const { title, sub, handle } = data.textData;
    let titleFont = "900 160px 'Anton'"; let subFont = "700 70px 'Montserrat'";
    
    if (options.fontStyle === 'modern') { titleFont = "900 150px 'Montserrat'"; subFont = "500 70px 'Roboto'"; }
    else if (options.fontStyle === 'elegant') { titleFont = "700 140px 'Playfair Display'"; subFont = "400 60px 'Montserrat'"; }
    else if (options.fontStyle === 'hand') { titleFont = "700 180px 'Dancing Script'"; subFont = "700 70px 'Montserrat'"; }
    else if (options.fontStyle === 'clean') { titleFont = "900 150px 'Roboto'"; subFont = "400 70px 'Roboto'"; }

    ctx.textAlign = "center";
    
    // @Handle
    ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 10;
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = `600 35px 'Montserrat', sans-serif`;
    ctx.fillText(handle, 540, 120);

    // Título
    ctx.shadowBlur = 25; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
    ctx.fillStyle = "#FFFFFF";
    drawTextWithFit(ctx, title, 540, 380, 160, "900", titleFont.split("'")[1]);

    // Subtítulo
    ctx.shadowBlur = 10;
    ctx.fillStyle = options.primaryColor; 
    drawTextWithFit(ctx, sub, 540, 460, 70, "700", subFont.split("'")[1]);

    // Finaliza
    const finalImageUrl = canvas.toDataURL('image/jpeg', 0.95);
    
    const div = document.createElement('div');
    div.className = 'post-card';
    const captionId = `cap-${index}`;

    div.innerHTML = `
        <div class="image-container">
            <img src="${finalImageUrl}" class="card-image">
        </div>
        <div class="card-content">
            <div class="tag-area">
                <span class="engine-tag">✨ Design Pró</span>
            </div>
            <div class="caption-box" id="${captionId}">${data.textData.caption}</div>
            <div class="card-actions">
                <button onclick="copyTxt('${captionId}', this)" class="btn-action btn-copy"><i class="far fa-copy"></i> Copiar</button>
                <a href="${finalImageUrl}" download="post-${index}.jpg" class="btn-action btn-download" style="text-decoration:none;"><i class="fas fa-download"></i> Baixar</a>
            </div>
        </div>
    `;
    grid.appendChild(div);
    if(window.innerWidth < 900) div.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Auxiliares
function drawTextWithFit(ctx, text, x, y, initialSize, weight, family) {
    const maxWidth = 900; 
    let fontSize = initialSize;
    ctx.font = `${weight} ${fontSize}px ${family}`;
    let textWidth = ctx.measureText(text).width;
    while (textWidth > maxWidth && fontSize > 40) {
        fontSize -= 5; 
        ctx.font = `${weight} ${fontSize}px ${family}`;
        textWidth = ctx.measureText(text).width;
    }
    ctx.fillText(text, x, y);
}

function drawProDesignElements(ctx, colorHex) {
    const rgb = hexToRgb(colorHex);
    const style = Math.floor(Math.random() * 6);
    ctx.save();
    const rand = (min, max) => Math.random() * (max - min) + min;

    if(style === 0) {
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.15)`;
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(rand(200,400),0); ctx.lineTo(0, rand(200,400)); ctx.fill();
    } else {
        // ... (Seu código de estilos anterior funciona aqui, simplifiquei pro exemplo caber)
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.2)`;
        ctx.fillRect(0,0,1080,20); // Exemplo simples
    }
    ctx.restore();
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 255, g: 255, b: 255 };
}

function copyTxt(id, btn) {
    navigator.clipboard.writeText(document.getElementById(id).innerText);
    const old = btn.innerHTML;
    btn.innerHTML = "<i class='fas fa-check'></i>";
    btn.style.background = "#10b981";
    setTimeout(() => { btn.innerHTML = old; btn.style.background = ""; }, 2000);
}

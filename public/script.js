// script.js - VERSÃO FINAL (COMPATÍVEL COM RENDER E CELULAR)

const ACCESS_PASSWORD = "K92-X4M-PRO-88"; 

// 1. SEGURANÇA
if(localStorage.getItem('studioProAuth') === 'true') {
    document.getElementById('loginOverlay').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
}

function checkPassword() {
    if(document.getElementById('passwordInput').value === ACCESS_PASSWORD) {
        localStorage.setItem('studioProAuth', 'true'); 
        document.getElementById('loginOverlay').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
    } else {
        document.getElementById('errorMsg').classList.remove('hidden');
    }
}

function logout() { localStorage.removeItem('studioProAuth'); location.reload(); }

// 2. GERADOR
document.getElementById('generatorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btnText');
    
    btn.disabled = true;
    btnText.textContent = "Processando...";
    
    const grid = document.getElementById('resultsGrid');
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

    // Garante carregamento das fontes
    await document.fonts.ready;

    for (let i = 1; i <= totalPosts; i++) {
        addSkeleton(i); 

        try {
            // AQUI ESTÁ A CORREÇÃO DO LINK PARA FUNCIONAR NO RENDER:
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(baseData)
            });
            const data = await response.json();

            if (data.success) {
                await createCompositePost(data, i, visualOptions);
            } else {
                removeSkeleton(i);
            }
        } catch (error) {
            console.error(error);
            removeSkeleton(i);
        }
    }

    btn.disabled = false;
    btnText.textContent = "Gerar Artes";
});

// 3. ANIMAÇÃO SKELETON
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
    div.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function removeSkeleton(index) {
    const el = document.getElementById(`skeleton-${index}`);
    if (el) el.remove();
}

// 4. MONTAGEM (CANVAS)
async function createCompositePost(data, index, options) {
    const grid = document.getElementById('resultsGrid');
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    const bgImage = new Image();
    bgImage.crossOrigin = "Anonymous"; 
    bgImage.src = data.image;

    await new Promise((resolve, reject) => {
        bgImage.onload = resolve;
        bgImage.onerror = reject;
    });

    // Só remove o skeleton quando a imagem estiver 100% pronta para ser pintada
    removeSkeleton(index);

    ctx.drawImage(bgImage, 0, 0, 1080, 1080);

    const rgb = hexToRgb(options.gradientColor);
    const gradient = ctx.createLinearGradient(0, 0, 0, 750);
    gradient.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.95)`); 
    gradient.addColorStop(0.6, `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.6)`);
    gradient.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b}, 0)`); 
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    drawProDesignElements(ctx, options.primaryColor);

    const { title, sub, handle } = data.textData;
    
    let titleFont = "900 160px 'Anton'"; let subFont = "700 70px 'Montserrat'";
    
    if (options.fontStyle === 'modern') { titleFont = "900 150px 'Montserrat'"; subFont = "500 70px 'Roboto'"; }
    else if (options.fontStyle === 'elegant') { titleFont = "700 140px 'Playfair Display'"; subFont = "400 60px 'Montserrat'"; }
    else if (options.fontStyle === 'hand') { titleFont = "700 180px 'Dancing Script'"; subFont = "700 70px 'Montserrat'"; }
    else if (options.fontStyle === 'clean') { titleFont = "900 150px 'Roboto'"; subFont = "400 70px 'Roboto'"; }

    ctx.textAlign = "center";
    
    // Handle
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
    div.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

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

    if (style === 0) { 
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.15)`; 
        const w1 = rand(200, 400); const h1 = rand(200, 400);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w1, 0); ctx.lineTo(0, h1); ctx.fill();
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.3)`; ctx.lineWidth = rand(3, 8);
        const startX = rand(800, 950); const endY = rand(80, 200);
        ctx.beginPath(); ctx.moveTo(1080, endY); ctx.lineTo(startX, 0); ctx.lineTo(1080, 0); ctx.closePath(); ctx.stroke();
    } else if (style === 1) { 
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.25)`; ctx.lineWidth = rand(5, 12); ctx.lineCap = 'round';
        const cp1y = rand(0, 200); const cp2y = rand(200, 500); const endY = rand(100, 300);
        ctx.beginPath(); ctx.moveTo(-50, rand(150, 300)); ctx.bezierCurveTo(300, cp1y, 700, cp2y, 1150, endY); ctx.stroke();
        ctx.strokeStyle = `rgba(255,255,255, 0.1)`; ctx.lineWidth = rand(2, 6);
        ctx.beginPath(); ctx.moveTo(-50, rand(250, 400)); ctx.bezierCurveTo(300, cp1y + 100, 700, cp2y + 50, 1150, endY + 50); ctx.stroke();
    } else if (style === 2) {
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.3)`;
        const spacing = rand(30, 60); const startX = rand(700, 850); const rows = rand(200, 400);
        for(let x = startX; x < 1080; x += spacing) {
            for(let y = 50; y < rows; y += spacing) {
                if(Math.random() > 0.2) { ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill(); }
            }
        }
    } else if (style === 3) {
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.1)`;
        const bubbles = Math.floor(rand(3, 6));
        for(let i=0; i<bubbles; i++) {
            ctx.beginPath(); ctx.arc(rand(0, 1080), rand(0, 600), rand(50, 200), 0, Math.PI*2); ctx.fill();
        }
    } else if (style === 4) {
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.2)`; ctx.lineWidth = 2;
        for(let i=0; i<15; i++) {
            const offset = i * 40; ctx.beginPath(); ctx.moveTo(0, 200 + offset); ctx.lineTo(400, 0 + offset); ctx.stroke();
        }
    } else {
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.5)`; ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, 1000, 1000);
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

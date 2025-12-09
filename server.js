// server.js - VERSÃO RESTAURADA E CORRIGIDA (PROXY DE IMAGEM)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Importação dinâmica do fetch para funcionar em qualquer versão do Node
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const nicheLibrary = {
    gastronomia: {
        visual: "hyper-realistic food photography, delicious gourmet dish, steam rising, dark moody lighting, 8k resolution",
        titles: [{t:"FOME?", s:"PEÇA JÁ"}, {t:"SABOR", s:"INCRÍVEL"}, {t:"OFERTA", s:"DO DIA"}],
        captions: ["🤤 **Imagens fortes!** O sabor que você merece.\n\nIngredientes frescos e preparo artesanal.", "🍕 **Deu fome?** A gente resolve rapidinho.\n\nPeça agora e receba no conforto da sua casa."],
        tags: "#foodporn #delivery #gastronomia #jantar"
    },
    barbearia: {
        visual: "cinematic barber shop portrait, man with perfect beard and haircut, sharp focus, dramatic lighting, masculine aesthetic",
        titles: [{t:"ESTILO", s:"PRO"}, {t:"CORTE", s:"TOP"}, {t:"VISUAL", s:"NOVO"}],
        captions: ["💈 **Respeito se conquista com estilo.**\n\nAgende seu horário com os melhores.", "🔥 **Confiança começa no espelho.**\n\nVenha renovar o visual com quem entende."],
        tags: "#barber #estilo #barbearia #fade"
    },
    advocacia: {
        visual: "luxury law office background, blur bokeh, scales of justice on mahogany desk, professional, trustworthy",
        titles: [{t:"DIREITO", s:"SEU"}, {t:"JUSTIÇA", s:"AGORA"}, {t:"LEI", s:"ATUAL"}],
        captions: ["⚖️ **Seus direitos defendidos com excelência.**\n\nConsultoria jurídica estratégica.", "🤝 **Segurança jurídica para você.**\n\nConte com nossa experiência."],
        tags: "#direito #advocacia #oab #juridico"
    },
    saude: {
        visual: "bright and airy wellness photography, spa setting, white stones, orchid flower, soft sunlight, high key lighting",
        titles: [{t:"CUIDE", s:"SE"}, {t:"SAÚDE", s:"TOTAL"}, {t:"VIDA", s:"LEVE"}],
        captions: ["🌿 **O maior investimento é você.**\n\nPriorize sua saúde hoje.", "✨ **Saúde é o novo luxo.**\n\nComece sua jornada de bem-estar agora."],
        tags: "#saude #bemestar #vidasaudavel"
    },
    estetica: {
        visual: "beauty fashion portrait, glowing skin model, soft pastel colors, elegant makeup, studio lighting, high resolution",
        titles: [{t:"GLOW", s:"UP"}, {t:"LINDA", s:"SEMPRE"}, {t:"SPA", s:"DAY"}],
        captions: ["✨ **Realce sua beleza natural.**\n\nProcedimentos personalizados para você.", "💖 **Momento de rainha.**\n\nVocê merece esse cuidado."],
        tags: "#estetica #beleza #glowup #skincare"
    },
    fitness: {
        visual: "intense gym workout atmosphere, cinematic dark lighting, neon rim light, dumbbells, sweat, motivation",
        titles: [{t:"FOCO", s:"TOTAL"}, {t:"TREINO", s:"HOJE"}, {t:"FORÇA", s:"BRUTA"}],
        captions: ["💪 **O corpo alcança o que a mente acredita.**", "🔥 **Sem dor, sem ganho.**\n\nVenha treinar conosco."],
        tags: "#fitness #treino #academia #nopainnogain"
    },
    tech: {
        visual: "futuristic technology abstract background, cyberpunk blue and purple neon lights, circuit board lines, 3d render",
        titles: [{t:"TECH", s:"NOVO"}, {t:"INOVA", s:"ÇÃO"}, {t:"FUTURO", s:"HOJE"}],
        captions: ["🚀 **Tecnologia que transforma.**\n\nPotência e performance.", "⚡ **Inovação ao seu alcance.**\n\nConfira as novidades."],
        tags: "#tecnologia #inovacao #tech #gadgets"
    },
    imobiliaria: {
        visual: "modern luxury mansion exterior, twilight lighting, swimming pool, architectural masterpiece, photorealistic 8k",
        titles: [{t:"CASA", s:"NOVA"}, {t:"IMÓVEL", s:"TOP"}, {t:"SONHO", s:"SEU"}],
        captions: ["🏡 **O lar dos seus sonhos.**\n\nAgende uma visita.", "🔑 **Chegou a hora de mudar.**\n\nOportunidade única."],
        tags: "#imoveis #casa #corretor #mercadoimobiliario"
    }
};

const buildPrompt = (data) => {
    const { keywords, niche } = data;
    const config = nicheLibrary[niche] || nicheLibrary.gastronomia;
    return `${config.visual}, ${keywords}, best quality, ultra realistic`;
};

function generateMetadata(data) {
    const { niche, handle, customTitle, customSub } = data;
    const config = nicheLibrary[niche] || nicheLibrary.gastronomia;
    
    let titleObj = { t: "OFERTA", s: "TOP" };
    if (customTitle) {
        titleObj = { t: customTitle.toUpperCase(), s: (customSub || "").toUpperCase() };
    } else {
        const options = config.titles;
        titleObj = options[Math.floor(Math.random() * options.length)];
    }
    const caption = config.captions[Math.floor(Math.random() * config.captions.length)];
    
    return {
        title: titleObj.t,
        sub: titleObj.s,
        caption: `${caption}\n\n${config.tags} #${handle}`,
        handle: `@${handle}`
    };
}

// === A CORREÇÃO: O SERVIDOR BAIXA A IMAGEM ===
async function generateAndDownloadImage(prompt) {
    const seed = Math.floor(Math.random() * 99999999);
    // Usando modelo FLUX (melhor qualidade)
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1080&height=1080&seed=${seed}&model=flux&nologo=true&enhance=true`;
    
    console.log("Baixando imagem...", url);
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro na IA");
        
        // Pega a imagem crua
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Converte para Base64 (Texto seguro para enviar)
        const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        return base64Image;
    } catch (error) {
        console.error("Erro no download:", error);
        throw error;
    }
}

app.post('/api/generate', async (req, res) => {
    try {
        const prompt = buildPrompt(req.body);
        // Gera e baixa no servidor
        const imageBase64 = await generateAndDownloadImage(prompt);
        const metadata = generateMetadata(req.body);
        
        res.json({ success: true, image: imageBase64, textData: metadata });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Servidor ocupado, tente novamente." });
    }
});

app.listen(port, () => {
    console.log(`✅ SERVIDOR RODANDO NA PORTA ${port}`);
});

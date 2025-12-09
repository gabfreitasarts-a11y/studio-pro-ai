// server.js - VERSÃO TURBO (MAIS ESTÁVEL)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const nicheLibrary = {
    gastronomia: {
        visual: "Professional food photography, cinematic lighting, delicious dish, dark background, 8k, highly detailed",
        titles: [{t:"FOME?", s:"PEÇA JÁ"}, {t:"SABOR", s:"INCRÍVEL"}, {t:"OFERTA", s:"DO DIA"}],
        captions: ["🤤 **Imagens fortes!** O sabor que você merece.\n\nIngredientes frescos e preparo artesanal.", "🍕 **Deu fome?** A gente resolve rapidinho.\n\nPeça agora e receba no conforto da sua casa."],
        tags: "#foodporn #delivery #gastronomia #jantar"
    },
    barbearia: {
        visual: "Barber shop interior, dark cinematic lighting, tools, luxury atmosphere, professional photography",
        titles: [{t:"ESTILO", s:"PRO"}, {t:"CORTE", s:"TOP"}, {t:"VISUAL", s:"NOVO"}],
        captions: ["💈 **Respeito se conquista com estilo.**\n\nAgende seu horário com os melhores.", "🔥 **Confiança começa no espelho.**\n\nVenha renovar o visual com quem entende."],
        tags: "#barber #estilo #barbearia #fade"
    },
    advocacia: {
        visual: "Modern office desk, law books, scales of justice, blurred background, professional corporate atmosphere",
        titles: [{t:"DIREITO", s:"SEU"}, {t:"JUSTIÇA", s:"AGORA"}, {t:"LEI", s:"ATUAL"}],
        captions: ["⚖️ **Seus direitos defendidos com excelência.**\n\nConsultoria jurídica estratégica.", "🤝 **Segurança jurídica para você.**\n\nConte com nossa experiência."],
        tags: "#direito #advocacia #oab #juridico"
    },
    saude: {
        visual: "Wellness concept, spa atmosphere, soft lighting, nature elements, zen, high quality",
        titles: [{t:"CUIDE", s:"SE"}, {t:"SAÚDE", s:"TOTAL"}, {t:"VIDA", s:"LEVE"}],
        captions: ["🌿 **O maior investimento é você.**\n\nPriorize sua saúde hoje.", "✨ **Saúde é o novo luxo.**\n\nComece sua jornada de bem-estar agora."],
        tags: "#saude #bemestar #vidasaudavel"
    },
    estetica: {
        visual: "Beauty salon aesthetics, skincare products, soft pink and gold lighting, elegant, luxury",
        titles: [{t:"GLOW", s:"UP"}, {t:"LINDA", s:"SEMPRE"}, {t:"SPA", s:"DAY"}],
        captions: ["✨ **Realce sua beleza natural.**\n\nProcedimentos personalizados para você.", "💖 **Momento de rainha.**\n\nVocê merece esse cuidado."],
        tags: "#estetica #beleza #glowup #skincare"
    },
    fitness: {
        visual: "Gym atmosphere, dark background, neon lights, weights, motivation, energetic",
        titles: [{t:"FOCO", s:"TOTAL"}, {t:"TREINO", s:"HOJE"}, {t:"FORÇA", s:"BRUTA"}],
        captions: ["💪 **O corpo alcança o que a mente acredita.**", "🔥 **Sem dor, sem ganho.**\n\nVenha treinar conosco."],
        tags: "#fitness #treino #academia #nopainnogain"
    },
    tech: {
        visual: "Abstract technology background, cyber network, neon blue lines, futuristic, 3d render",
        titles: [{t:"TECH", s:"NOVO"}, {t:"INOVA", s:"ÇÃO"}, {t:"FUTURO", s:"HOJE"}],
        captions: ["🚀 **Tecnologia que transforma.**\n\nPotência e performance.", "⚡ **Inovação ao seu alcance.**\n\nConfira as novidades."],
        tags: "#tecnologia #inovacao #tech #gadgets"
    },
    imobiliaria: {
        visual: "Modern luxury house exterior, golden hour lighting, architectural photography, photorealistic",
        titles: [{t:"CASA", s:"NOVA"}, {t:"IMÓVEL", s:"TOP"}, {t:"SONHO", s:"SEU"}],
        captions: ["🏡 **O lar dos seus sonhos.**\n\nAgende uma visita.", "🔑 **Chegou a hora de mudar.**\n\nOportunidade única."],
        tags: "#imoveis #casa #corretor #mercadoimobiliario"
    }
};

const buildPrompt = (data) => {
    const { keywords, niche } = data;
    const config = nicheLibrary[niche] || nicheLibrary.gastronomia;
    // Prompt simplificado para garantir geração
    return `${config.visual}, ${keywords}`;
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

async function generateFluxFree(prompt) {
    const seed = Math.floor(Math.random() * 999999);
    const safePrompt = encodeURIComponent(prompt);
    // Mudamos para o modelo TURBO (mais rápido e falha menos)
    return `https://image.pollinations.ai/prompt/${safePrompt}?width=1080&height=1080&seed=${seed}&model=turbo&nologo=true`;
}

app.post('/api/generate', async (req, res) => {
    try {
        const prompt = buildPrompt(req.body);
        const imageUrl = await generateFluxFree(prompt);
        const metadata = generateMetadata(req.body);
        res.json({ success: true, image: imageUrl, textData: metadata });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`✅ SERVIDOR PRONTO NA PORTA ${port}`);
});

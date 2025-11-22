// server.js - VERSÃO FINAL CORRIGIDA (LEGENDAS PREMIUM)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- BANCO DE DADOS (COPYWRITING AVANÇADO & VISUAL LIMPO) ---
const nicheLibrary = {
    gastronomia: {
        visual: "Professional Food Photography. Delicious food positioned strictly at the BOTTOM HALF. TOP HALF is clean blurred background for text. High contrast.",
        titles: [
            {t:"SABOR QUE", s:"VOCÊ MERECE"}, 
            {t:"EXPERIÊNCIA", s:"GASTRONÔMICA"}, 
            {t:"O VERDADEIRO", s:"SABOR ARTESANAL"},
            {t:"PROMOÇÃO", s:"IMPERDÍVEL HOJE"}
        ],
        captions: [
            "🚨 **Alerta de imagens fortes!**\n\nSeus olhos não estão te enganando. Essa é a definição visual de felicidade.\n\nNós não entregamos apenas comida, entregamos uma experiência completa:\n✨ Ingredientes selecionados a dedo.\n🔥 Preparo artesanal com paixão.\n🛵 Entrega rápida para chegar perfeito até você.\n\n👇 **Não passe vontade sozinho(a):**\nMarque nos comentários quem te deve um jantar desses hoje!",
            "🍕 **Sextou (ou quase)! E você merece o melhor.**\n\nChega de pedir sempre o mesmo. Permita-se experimentar o verdadeiro sabor que conquista a cidade.\n\n✅ Massa no ponto certo.\n✅ Recheio generoso.\n✅ Sabor inesquecível.\n\n📲 **Clique no link da bio e faça seu pedido agora mesmo!**"
        ],
        tags: "#gastronomia #foodporn #delivery #jantar #comidadeverdade #instafood #chef"
    },
    barbearia: {
        visual: "Dark Cinematic Portrait of a man. Subject at bottom center. Top area is dark negative space. Luxury aesthetic.",
        titles: [
            {t:"SEU ESTILO", s:"EM OUTRO NÍVEL"}, 
            {t:"VISUAL", s:"DE RESPEITO"}, 
            {t:"A SUA", s:"MELHOR VERSÃO"}
        ],
        captions: [
            "💈 **Mais do que um corte, um ritual.**\n\nO seu visual é sua assinatura antes mesmo de você falar. Não entregue sua imagem na mão de qualquer um.\n\n🔥 **Aqui você encontra:**\n▪️ Técnicas clássicas e modernas.\n▪️ Ambiente exclusivo para relaxar.\n▪️ Profissionais de elite.\n\n👊 **Agende seu horário e eleve sua autoestima.** O café (ou a cerveja) é por nossa conta.",
            "✂️ **Atenção aos detalhes que fazem a diferença.**\n\nCabelo na régua, barba alinhada e a confiança lá em cima. Venha viver a experiência completa da nossa barbearia.\n\n✅ **Garanta sua vaga para essa semana.** Link na bio."
        ],
        tags: "#barber #barbearia #barbershop #fade #homemmoderno #estilo #mensgrooming"
    },
    advocacia: {
        visual: "Minimalist Corporate Office background. Desk or subject at bottom. Top is clean wall space.",
        titles: [
            {t:"SEUS DIREITOS", s:"EM PRIMEIRO LUGAR"}, 
            {t:"JUSTIÇA", s:"COM EXCELÊNCIA"}, 
            {t:"SEGURANÇA", s:"JURÍDICA TOTAL"}
        ],
        captions: [
            "⚖️ **Informação é o primeiro passo para a justiça.**\n\nEm um mundo complexo, ter a orientação jurídica correta não é um luxo, é uma necessidade para proteger seu patrimônio e sua família.\n\n🤝 **Nossa atuação é pautada em:**\n🔹 Ética e transparência total.\n🔹 Estratégias personalizadas para o seu caso.\n🔹 Combate incansável pelos seus interesses.\n\nAgende uma consultoria estratégica e tire suas dúvidas.",
            "📄 **Advocacia humanizada e eficiente.**\n\nEntendemos que por trás de cada processo existem pessoas, histórias e sonhos. Conte com uma equipe experiente e dedicada a buscar a melhor solução para você.\n\n👇 **Precisa de orientação? Chame no direct.**"
        ],
        tags: "#advocacia #direito #oab #justiça #juridico #consultoria #direitocivil"
    },
    saude: {
        visual: "Bright airy wellness photography. Subject at bottom. Top is clean white/sky negative space.",
        titles: [
            {t:"CUIDE DE", s:"QUEM VOCÊ AMA"}, 
            {t:"SAÚDE É", s:"PRIORIDADE"}, 
            {t:"BEM-ESTAR", s:"TODOS OS DIAS"}
        ],
        captions: [
            "🌿 **Pare um minuto. Como você tem cuidado de si mesmo?**\n\nNa correria do dia a dia, nossa saúde física e mental muitas vezes fica em segundo plano. É hora de mudar essa prioridade.\n\n✨ **Lembre-se:**\n✅ O autocuidado não é egoísmo, é necessidade.\n✅ Pequenos hábitos diários transformam vidas.\n\nEstamos aqui para te apoiar nessa jornada de bem-estar completo. 🤍",
            "✨ **O equilíbrio que você busca começa com o primeiro passo.**\n\nInvestir na sua saúde é garantir um futuro com mais qualidade de vida. Conte com nossos profissionais para te guiar.\n\n👇 **Clique no link da bio e agende sua avaliação.**"
        ],
        tags: "#saude #bemestar #vidasaudavel #autocuidado #qualidadedevida #prevenção"
    },
    estetica: {
        visual: "High fashion beauty shot. Model face at bottom. Clean space for text at top.",
        titles: [
            {t:"REALCE SUA", s:"BELEZA NATURAL"}, 
            {t:"MOMENTO", s:"DE AUTOESTIMA"}, 
            {t:"VOCÊ", s:"MAIS PODEROSA"}
        ],
        captions: [
            "✨ **Beleza é sentir-se bem na própria pele.**\n\nNossos procedimentos são pensados para realçar o que você já tem de melhor, unindo tecnologia e sofisticação para resultados naturais.\n\n💖 **Por que você merece:**\n🌸 Renova a autoestima.\n🌸 Momento exclusivo de cuidado.\n🌸 Profissionais capacitadas.\n\nAgende seu horário e venha brilhar.",
            "💅 **Tire um tempo só para você.**\n\nNa correria do dia a dia, esquecemos de nos cuidar. Venha relaxar, desconectar do mundo e sair daqui renovada e confiante.\n\n📲 **Link na bio para agendamentos.**"
        ],
        tags: "#estetica #beleza #glowup #salaodebeleza #skincare #procedimentosesteticos"
    },
    fitness: {
        visual: "Intense gym atmosphere. Athlete in action at bottom. Dark ceiling at top for text.",
        titles: [
            {t:"SUPERE", s:"SEUS LIMITES"}, 
            {t:"FOCO NO", s:"RESULTADO REAL"}, 
            {t:"TREINO", s:"DE ALTA INTENSIDADE"}
        ],
        captions: [
            "💪 **O corpo alcança o que a mente acredita.**\n\nA dor de hoje é a vitória de amanhã. Não existe atalho, existe constância, disciplina e o ambiente certo.\n\n🔥 **Aqui você encontra:**\n✅ Equipamentos de ponta.\n✅ Orientação profissional.\n✅ A motivação que faltava.\n\nA melhor versão de você está te esperando. **Bora treinar?** 🚀",
            "⚡ **Transforme sua rotina, transforme sua vida.**\n\nChega de desculpas. O momento de começar é agora. Supere o cansaço e foque no objetivo.\n\n✅ **Venha fazer uma aula experimental conosco!**"
        ],
        tags: "#fitness #treino #academia #nopainnogain #musculacao #vidafit #crossfit"
    },
    tech: {
        visual: "Futuristic tech background. Gadgets on table at bottom. Top is abstract data space.",
        titles: [
            {t:"TECNOLOGIA", s:"DE PONTA"}, 
            {t:"INOVAÇÃO", s:"AO SEU ALCANCE"}, 
            {t:"O FUTURO", s:"CHEGOU AGORA"}
        ],
        captions: [
            "🚀 **Tecnologia que simplifica e transforma.**\n\nPotência, design e performance unidos em um só lugar. Chega de aparelhos lentos que travam sua produtividade.\n\n⚡ **Destaques:**\n▪️ A mais alta performance do mercado.\n▪️ Design inovador e sofisticado.\n▪️ Condições especiais de lançamento.\n\n**Garanta o seu antes que acabe o estoque!**",
            "📱 **Conectividade total na palma da sua mão.**\n\nDescubra as novidades que vão transformar o seu dia a dia. O melhor da tecnologia, com garantia e procedência, você encontra aqui.\n\n👇 **Confira o catálogo completo no link da bio.**"
        ],
        tags: "#tecnologia #inovacao #tech #gadgets #smartphone #eletronicos #setup"
    },
    imobiliaria: {
        visual: "Modern luxury house. House at bottom. Blue sky at top for text.",
        titles: [
            {t:"O LAR DOS", s:"SEUS SONHOS"}, 
            {t:"OPORTUNIDADE", s:"EXCLUSIVA"}, 
            {t:"VIVA COM", s:"CONFORTO E ESTILO"}
        ],
        captions: [
            "🏡 **Chegou a hora de mudar de vida e de endereço.**\n\nAcorde todos os dias em um lugar incrível. Imagine o conforto, a segurança e o lazer que sua família merece, em uma localização privilegiada.\n\n🔑 **Este imóvel oferece:**\n✨ Amplitude e iluminação natural.\n✨ Acabamentos de alto padrão.\n✨ Área de lazer completa.\n\nAgende sua visita hoje mesmo e encante-se.",
            "🏢 **Investimento seguro e rentável.**\n\nO mercado imobiliário está aquecido. Aproveite as condições especiais e realize o sonho da casa própria ou expanda sua carteira de investimentos.\n\n📲 **Fale agora com nossos corretores especializados.**"
        ],
        tags: "#imoveis #casa #corretor #mercadoimobiliario #vendas #apartamento #investimento"
    }
};

const buildPrompt = (data) => {
    const { keywords, niche } = data;
    const config = nicheLibrary[niche] || nicheLibrary.gastronomia;
    return `Professional background image for "${keywords}". STYLE: ${config.visual} COMPOSITION: Wide shot, Subject strictly at the bottom, clean negative space at the top. QUALITY: 8k resolution, highly detailed, photorealistic, NO TEXT IN IMAGE.`;
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
    const seed = Math.floor(Math.random() * 999999999);
    const safePrompt = encodeURIComponent(prompt);
    return `https://image.pollinations.ai/prompt/${safePrompt}?width=1080&height=1080&seed=${seed}&model=flux&nologo=true&enhance=true`;
}

app.post('/api/generate', async (req, res) => {
    try {
        const prompt = buildPrompt(req.body);
        const imageUrl = await generateFluxFree(prompt);
        const metadata = generateMetadata(req.body);
        await new Promise(resolve => setTimeout(resolve, 300));
        res.json({ success: true, image: imageUrl, textData: metadata });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`✅ SERVIDOR FINAL (LEGENDAS PREMIUM) RODANDO: http://localhost:${port}`);
});
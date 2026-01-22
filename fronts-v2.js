(async () => {
    const CONFIG = {
        API_URL: "https://manuuu.com",
        API_KEY: "key123", 
        DOMAIN: window.location.origin
    };

    const pathName = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    const detailSlug = urlParams.get('detail') || (pathName !== '/' ? pathName.substring(1) : null);
    let isTldMode = (pathName !== '/' && !urlParams.has('detail'));

    const formatIndoDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + " WIB" : "";
    const toTitleCase = (s) => s ? s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()) : "";
    const getLink = (slug) => isTldMode ? `/${slug}` : `/?detail=${slug}`;

    const fetchAPI = async (endpoint) => {
        try {
            const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
                headers: { 'x-api-key': CONFIG.API_KEY, 'original-domain': CONFIG.DOMAIN }
            });
            if (!response.ok) throw new Error("Server Error");
            return await response.json();
        } catch (e) { return null; }
    };

    const injectSchema = (data) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(data);
        document.head.appendChild(script);
    };

    const renderNoConnection = async () => {
        let userIp = "Mendeteksi...";
        try {
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipRes.json();
            userIp = ipData.ip;
        } catch (e) {}

        document.body.innerHTML = `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0f2f5;">
                <div style="text-align: center; padding: 40px; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-width: 400px; width: 90%;">
                    <div style="background: #fff1f0; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                        <svg style="width: 40px; height: 40px; color: #ff4d4f;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <h2 style="color: #1a1a1a; margin: 0 0 10px; font-size: 22px; font-weight: 700;">NOT CONNECTED TO SERVER</h2>
                    <div style="text-align: left; background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; line-height: 1.6; color: #444; border: 1px solid #e8e8e8;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <strong>Your Domain:</strong> <span>${window.location.hostname}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <strong>Your IP:</strong> <span>${userIp}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <strong>Status:</strong> <span style="color: #ff4d4f; font-weight: bold;">DISCONNECTED</span>
                        </div>
                    </div>
                    <p style="color: #666; font-size: 13px; margin-bottom: 25px;">Akses ditolak atau server backend tidak merespon.</p>
                    <div style="display: grid; gap: 10px;">
                        <a href="https://t.me/manualslibs.space" target="_blank" style="text-decoration: none; padding: 12px; background: #0088cc; color: white; border-radius: 8px; font-weight: 600;">Hubungi Administrator</a>
                        <button onclick="window.location.reload()" style="cursor: pointer; padding: 12px; background: white; color: #555; border: 1px solid #ddd; border-radius: 8px;">Coba Muat Ulang</button>
                    </div>
                </div>
            </div>`;
    };

    const getSkeletonStyle = () => `
        <style>
            .skeleton { background: #f2f4f5;position: relative; overflow: hidden; border-radius: 2px; }
            .skeleton::after {content: ""; position: absolute; top: 0; right: 0; bottom: 0; left: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);animation: shimmer 1.5s infinite;}
            @keyframes shimmer { 100% { transform: translateX(100%); } }
            
            .sk-item { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
            .sk-title { height: 18px; width: 85%; margin-top: 5px; margin-bottom: 5px; }
            .sk-text { height: 10px; width: 30%; }
            
            .sk-h1 { height: 32px; width: 90%; margin-bottom: 10px; }
            .sk-img { height: 350px; width: 100%; margin: 10px 0 20px 0; border-radius: 8px; }
            .sk-body { height: 14px; width: 100%; margin-bottom: 12px; }
        </style>
    `;

    const wrapInLayout = (innerContent) => `
			<div id="navnews" class="navbar-fixed-top">
				<div class="container">
					<div class="table-layout nm">
						<div class="col-xs-4 col-md-3 col-lg-2"></div>
						<div class="col-xs-4 col-md-6 col-lg-8">
							<div class="logo-brand text-center">
								<a href="/" class="mh-auto"><img id="main-logo" src="https://cdn.statically.io/gh/digiitaltools/csr-manualslib@main/n1_ipotnews.png" class="img-responsive hidden-xs hidden-sm mh-auto"></a><a href="/" class="mh-auto"><img id="main-logo-mobile" src="https://cdn.statically.io/gh/digiitaltools/csr-manualslib@main/n1_ipotnews_w.png" class="img-responsive visible-xs visible-sm mh-auto"></a>
							</div>
						</div>
						<div class="col-xs-4 col-md-3 col-lg-2 text-right"></div>
					</div>
				</div>
			</div>
			
			<div class="container-fluid hidden-xs hidden-sm">
				<div id="navbarIpotnews" class="navbar navbar-default">
					<div class="collapse navbar-collapse" id="ipotnewsMainMenu">
						<ul class="nav navbar-nav navbar-news">
							<div id="top-home-ads" style="display: block; text-align: center; margin: 20px 0px;">
								<div id="ads-728x90" style="display: none; width:728px; height:90px; margin: 0 auto; background:#f9f9f9;"></div>
							</div>
							<div class="clearfix mm-page mm-slideout"></div>
						</ul>
					</div>
				</div>
			</div>
			
            <div class="clearfix mm-page mm-slideout">
                <section class="startcontent newsonly">
                    <div class="header sub-menu single"><ul class="breadcrumb" role="tablist"></ul></div>
					
					<div class="clearfix"></div>
                    <section class="section pt10 bgcolor-white">
                        <div class="container" id="divMoreNewsPages">
                            ${innerContent}
                        </div>
                    </section>
                </section>
                <footer class="footer pt20 pb20 bgcolor-gray" style="border-top: 1px solid #eee; margin-top: 30px;">
                    <div class="container text-center">
                        <p style="font-size: 12px; color: #777;">&copy; 2026 Manualslibs. All rights reserved.</p>
                    </div>
                </footer>
            </div>
			
			<div id="popup-ads-container" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center;">
				<div class="popup-content" style="position:relative; background:#fff; padding:10px; border-radius:8px; width:320px; min-height:270px; display:flex; flex-direction:column; align-items:center;">
					<button onclick="document.getElementById('popup-ads-container').style.display='none'" 
							style="position:absolute; top:-15px; right:-15px; background:#000; color:#fff; border-radius:50%; width:30px; height:30px; border:2px solid #fff; cursor:pointer; font-size:18px; line-height:1;">
						&times;
					</button>
					<div id="ads-placeholder" style="width:300px; height:250px; overflow:hidden;">
						</div>
				</div>
			</div>
    `;

    const loadDetail = async (slug) => {
        document.body.innerHTML = getSkeletonStyle() + wrapInLayout(`
			<div class="row">
                <div class="col-sm-8" id="article-area">
                    <div class="skeleton sk-h1"></div>
                    <div class="skeleton sk-text" style="margin-bottom:20px;"></div>
                    <hr>
                    <div class="skeleton sk-img"></div>
                    <div class="skeleton sk-body"></div>
                    <div class="skeleton sk-body"></div>
                    <div class="skeleton sk-body" style="width:75%;"></div>
                </div>
                <aside class="col-sm-4" id="sidebar-area">
                    <div class="skeleton" style="height:250px; width:300px; margin-bottom:30px;"></div>
                    <div class="skeleton sk-title" style="width:50%; height:25px;"></div>
                    <div class="skeleton sk-item" style="height:50px;"></div>
                    <div class="skeleton sk-item" style="height:50px;"></div>
                </aside>
            </div>
        `);

        const detailPromise = fetchAPI(`/api/manuals/detail/${slug}`);
        const secondaryPromise = Promise.all([fetchAPI('/api/backlinks'), fetchAPI('/api/manuals')]);

        const resDetail = await detailPromise;
        if (!resDetail || resDetail.status !== "success") return renderNoConnection();

        const item = resDetail.data;
        document.title = toTitleCase(item.title);
        injectSchema({
            "@context": "https://schema.org",
            "@type": "ManualslibsArticle",
            "headline": toTitleCase(item.title),
            "datePublished": item.date_create,
            "author": { "@type": "Organization", "name": "Manualslibs" }
        });

        let bodyHtml = "";
        let content = item.json_contents;
        if (typeof content === 'string') { try { content = JSON.parse(content); } catch (e) {} }

        if (Array.isArray(content)) {
            bodyHtml = content.map(obj => {
                switch (obj.tag) {
                    case 'img':
                        return `<div style="margin: 20px 0; text-align:center;">
                                    <img src="${obj.link_image}" alt="${obj.alt || ''}" loading="lazy" style="max-width:100%; height:auto; border-radius:8px;">
                                    ${obj.alt ? `<p style="font-size:12px; color:#666; margin-top:5px;">${obj.alt}</p>` : ''}
                                </div>`;
                    case 'h2':
                        return `<h2 style="margin: 25px 0 15px; font-size:22px; font-weight:bold; color:#333; border-left:4px solid #086cab; padding-left:10px;">${obj.text}</h2>`;
                    case 'h3':
                        return `<h3 style="margin: 20px 0 10px; font-size:18px; font-weight:bold; color:#444;">${obj.text}</h3>`;
                    case 'li':
                        return `<li style="margin-bottom:10px; font-size:16px; margin-left:25px; line-height:1.6;">${obj.text}</li>`;
                    case 'span':
                        return `<span style="font-size:16px; line-height:1.7; display:inline-block; margin-bottom:10px;">${obj.text}</span>`;
                    case 'table':
                        const cells = obj.text.split('|').map(c => c.trim());
                        return `<div style="overflow-x:auto; margin:15px 0;">
                                    <table style="width:100%; border-collapse:collapse; background:#f9f9f9;">
                                        <tr>${cells.map(c => `<td style="border:1px solid #ddd; padding:8px;">${c}</td>`).join('')}</tr>
                                    </table>
                                </div>`;
                    default:
                        return `<p style="margin-bottom:15px; font-size:16px; line-height:1.7; color:#333;">${obj.text}</p>`;
                }
            }).join('');
        } else {
            let cleaned = content.replace(/<a class="zoom start_zoom" href="#">[\s\S]*?<\/a>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<script[\s\S]*?>[\s\S]*?<\/script>/g, '');
            cleaned = cleaned.replace(/<img /g, '<img loading="lazy" '); 
            
            bodyHtml = `
                <style>
                    .manual-outer-limit { width: 100%; overflow: hidden; border: 1px solid #eee; }
                    .manual-ratio-keeper { width: 100%; padding-top: 141.89%; position: relative; }
                    .manual-scaler-fixed { position: absolute; top: 0; left: 0; width: 950px; height: 1348px; transform: scale(90%); transform-origin: top left; }
                    .manual-scaler-fixed div.pdf { width: 950px !important; height: 1348px !important; transform: scale(90%); transform-origin: top left; }
                    .manual-scaler-fixed div.ocr { opacity: 0.7 !important; color: #333 !important; }
                </style>
                <div class="manual-outer-limit"><div class="manual-ratio-keeper"><div class="manual-scaler-fixed">${cleaned}</div></div></div>`;
        }

        document.getElementById('article-area').innerHTML = `
            <article class="newsContent fade-in">
                <h1 style="font-size: 24px; line-height: 1.3; font-weight:bold; margin-top:0;">${toTitleCase(item.title)}</h1>
                <small class="text-muted">${formatIndoDate(item.date_create)}</small>
                <hr>
                <div class="manual-body">${bodyHtml}</div>
                <div id="recommended-placeholder"></div>
            </article>
        `;

        const [resBacklinks, resRelated] = await secondaryPromise;

        if (resBacklinks?.data) {
            document.getElementById('recommended-placeholder').innerHTML = `
                <div style="margin-top: 40px; font-size: 16px; padding:20px; background:#f8f9fa; border-radius:8px;">
                    <h4 style="border-left:4px solid #333; padding-left:10px; font-weight:bold; margin-bottom:15px;">Recommended</h4>
                    <div style="line-height:2.2;">
                        ${resBacklinks.data.map(l => `<a href="${l.url}" target="_blank" style="margin-right:10px; color:#0088cc; text-decoration:none;">${toTitleCase(l.keyword)}</a>`).join('• ')}
                    </div>
                </div>`;
        }

        if (resRelated?.data) {
            const rData = resRelated.data.sort(() => Math.random() - 0.5).slice(0, 15);
            document.getElementById('sidebar-area').innerHTML = `
                <div class="fade-in">
                    <div id="ads-320x50" style="width:300px; min-height:250px; margin-bottom:30px; background:#eee; display:flex; align-items:center; justify-content:center; color:#999; border-radius:8px;">ADVERTISEMENT</div>
                    <h4 style="font-weight:bold; border-bottom:2px solid #333; padding-bottom:10px; margin-bottom:20px;">Related</h4>
                    ${rData.map(rel => `<dl class="listNews" style="margin-bottom:15px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;"><small class="text-muted" style="font-size:11px;">${formatIndoDate(rel.date_create)}</small><dt style="font-size:14px; margin-top:3px;"><a href="${getLink(rel.slug)}" style="color:#086cab; text-decoration:none;">${toTitleCase(rel.title)}</a></dt></dl>`).join('')}
                </div>`;
        }
		
		//ADS
		//Direct Link => if (typeof direct === "function") direct();else if (window.direct && typeof window.direct === "function") window.direct();
        //Popup => if (typeof showMyAds === "function") showMyAds();
        if (typeof fillDetailAds === "function") { const topAds = document.getElementById('top-home-ads'); if (topAds) topAds.style.display = 'block'; fillDetailAds();} //Banner
    };

	const loadHome = async () => {
        document.body.innerHTML = getSkeletonStyle() + wrapInLayout(`
            <div class="listMoreLeft divColumn" id="news-list">
                ${Array(12).fill(0).map(() => `
                    <dl class="listNews" style="margin-bottom:20px;">
                        <div class="skeleton" style="height:12px; width:30%; margin-bottom:8px;"></div>
                        <div class="skeleton" style="height:18px; width:85%;"></div>
                    </dl>
                `).join('')}
            </div>
        `);

        const res = await fetchAPI('/api/manuals');
        if (!res || res.status !== "success") return renderNoConnection();
        const shuffledData = res.data.sort(() => Math.random() - 0.5);
        
        injectSchema({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": res.data.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${CONFIG.DOMAIN}${getLink(item.slug)}`
            }))
        });

        const listHtml = shuffledData.map(item => `
            <dl class="listNews fade-in" style="margin-bottom:20px; margin-top:0px;">
                <small class="text-muted">${formatIndoDate(item.date_create)}</small>
                <dt>
                    <a href="${getLink(item.slug)}" style="color:#086cab; text-decoration:none; font-weight:bold;">
                        ${toTitleCase(item.title)}
                    </a>
                </dt>
            </dl>`).join('');

        const newsListCont = document.getElementById('news-list');
        if (newsListCont) {
            newsListCont.innerHTML = listHtml;
        }

		//ADS
        //Direct Link => if (typeof direct === "function") direct();else if (window.direct && typeof window.direct === "function") window.direct();
        //Popup => if (typeof showMyAds === "function") showMyAds();
		if (typeof fillHomeAds === "function") {const topAds = document.getElementById('ads-728x90');if (topAds) topAds.style.display = 'block'; fillHomeAds();} //Banner
    };
	
	const renderRawXml = async (type) => {
        try {
            const res = await fetch(`${CONFIG.API_URL}/api/${type}`, {
                headers: { 'x-api-key': CONFIG.API_KEY, 'original-domain': CONFIG.DOMAIN }
            });
            const xmlText = await res.text();
            document.open("text/xml", "replace");
            document.write(xmlText);
            document.close();
        } catch (e) {
            console.error("XML Render Error:", e);
        }
    };

    const injectMetaLinks = () => {
        const head = document.head;
        if (!document.querySelector('link[rel="sitemap"]')) {
            const s = document.createElement('link');
            s.rel = 'sitemap'; 
            s.type = 'application/xml';
            s.href = `${CONFIG.DOMAIN}/?page=sitemap`;
            head.appendChild(s);
        }
    };
	
	injectMetaLinks();
	
    // --- ROUTER ---
    if (pageParam === 'sitemap') {
        await renderRawXml('sitemap');
    } else if (pageParam === 'rss') {
        await renderRawXml('rss');
    } else if (detailSlug) {
        loadDetail(detailSlug);
    } else {
        loadHome();
    }
})();

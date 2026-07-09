
    const log = (msg) => {
        const d = document.getElementById('debug-log');
        if (d) d.innerHTML += '<br>[' + new Date().toLocaleTimeString() + '] ' + msg;
    };
    window.onerror = function(message, source, lineno, colno, error) {
        log("ERR: " + message + " L:" + lineno);
        return true;
    };
    log("JS naštartovaný");

    // --- Globálne funkcie pre inline eventy ---
    window.shareGreenCards = async (btnElement, url) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Zelené karty 2026',
                    text: 'Ahoj, tu je odkaz na aktuálne Zelené karty (poistné) pre naše služobné vozidlá:',
                    url: url
                });
            } catch (err) {
                console.log('Zdieľanie bolo zrušené alebo zlyhalo.', err);
            }
        } else {
            // Fallback pre zariadenia, ktoré nepodporujú Web Share API
            const textArea = document.createElement("textarea");
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                const originalText = btnElement.innerHTML;
                btnElement.innerHTML = `<span class="text-emerald-600 dark:text-emerald-400 font-bold">✓ Skopírované!</span>`;
                setTimeout(() => { btnElement.innerHTML = originalText; }, 2000);
            } catch (err) {
                console.error('Nepodarilo sa skopírovať odkaz', err);
            }
            document.body.removeChild(textArea);
        }
    };

    log("Pridávam DOMContentLoaded listener");
    document.addEventListener('DOMContentLoaded', () => {
        log("DOMContentLoaded odpálený");
        // --- Tmavý režim ---
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
        const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

        const applyTheme = (theme) => {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                if (themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden');
                if (themeToggleDarkIcon) themeToggleDarkIcon.classList.add('hidden');
            } else {
                document.documentElement.classList.remove('dark');
                if (themeToggleLightIcon) themeToggleLightIcon.classList.add('hidden');
                if (themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden');
            }
        };
        let savedTheme = 'light';
        try { savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch(e) { savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
        applyTheme(savedTheme);
        themeToggleBtn.addEventListener('click', () => {
            const isDarkMode = document.documentElement.classList.contains('dark');
            const newTheme = isDarkMode ? 'light' : 'dark';
            try { localStorage.setItem('theme', newTheme); } catch(e) {}
            applyTheme(newTheme);
        });

        // --- QR Kód Funkcionalita ---
        const qrBtn = document.getElementById('qr-btn');
        const qrModalBackdrop = document.getElementById('qr-modal-backdrop');
        const qrModalContent = document.getElementById('qr-modal-content');
        const closeQrBtn = document.getElementById('close-qr-btn');
        let qrCodeGenerated = false;

        const openQrModal = () => {
            qrModalBackdrop.classList.remove('hidden');
            qrModalContent.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            if (!qrCodeGenerated) {
                new QRCode(document.getElementById("qrcode"), {
                    text: window.location.href,
                    width: 200,
                    height: 200,
                    colorDark : "#0050AA",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
                qrCodeGenerated = true;
            }
        };

        const closeQrModal = () => {
            qrModalBackdrop.classList.add('hidden');
            qrModalContent.classList.add('hidden');
            document.body.style.overflow = '';
        };

        if(qrBtn) qrBtn.addEventListener('click', openQrModal);
        if(closeQrBtn) closeQrBtn.addEventListener('click', closeQrModal);
        if(qrModalBackdrop) qrModalBackdrop.addEventListener('click', closeQrModal);

      // --- Preklady ---
        const translations = {
            sk: {
                main_title: "Príručka pre Vodičov", main_subtitle: "Váš interaktívny sprievodca pre služobné vozidlá Lidl",
                quick_actions_title: "Rýchle Akcie a Núdzové Situácie", accident_title: "Mám nehodu", accident_subtitle: "Okamžitý postup krok za krokom.",
                service_title: "Potrebujem servis", service_subtitle_quick: "Objednajte si opravu alebo údržbu.",
                breakdown_title: "Pokazilo sa mi auto, alebo mám defekt", breakdown_subtitle: "Kontakt na asistenčnú službu.",
                categories_title: "Informačné Kategórie", nav_rules: "Základné Pravidlá", nav_legal_rules: "Zákonné Pravidlá",
                nav_fueling: "Tankovanie", nav_fueling_abroad: "Tankovanie v Zahraničí", nav_maintenance: "Údržba a Pneu",
                nav_insurance: "Poistné Udalosti", nav_logbook: "Kniha Jázd", nav_fines: "Pokuty", nav_new_car: "Nové Vozidlo",
                nav_my_bmw: "MY BMW", nav_contacts: "Dôležité Kontakty",
                acc_h1: "DOPRAVNÁ NEHODA", acc_p1: "Zachovajte pokoj. Tu je váš sprievodca.",
                acc_h2_1: "KROK 1: Okamžitá bezpečnosť", acc_p2: "Vašou prioritou je zabrániť ďalšej škode a postarať sa o zdravie všetkých zúčastnených.",
                acc_h3_1: "ZASTAVTE A ZAPNITE SVETLÁ", acc_p3: "Okamžite zastavte a zapnite výstražné svetlá.",
                acc_h3_2: "VESTA A TROJUHOLNÍK", acc_p4: "Oblečte si vestu a umiestnite trojuholník.",
                acc_h3_3: "SKONTROLUJTE ZRANENIA", acc_p5: "Ak je niekto zranený, okamžite volajte.", acc_call_1: "Volať Záchranku", acc_call_2: "Volať Linku 112",
                acc_h2_2: "KROK 2: Volať políciu?", acc_p6: "Zákon presne stanovuje, kedy je prítomnosť polície povinná.",
                acc_q1: "Je niekto zranený alebo usmrtený?", acc_yes: "ÁNO", acc_no: "NIE", acc_call_police: "VOLAŤ 158",
                acc_q2: "Je škoda vyššia ako 4000€?", acc_yes_2: "ÁNO", acc_no_2: "NIE", acc_call_police_2: "VOLAŤ 158",
                acc_q3: "Viete sa dohodnúť na vinníkovi?", acc_no_3: "NIE", acc_call_police_3: "VOLAŤ 158", acc_yes_3: "ÁNO", acc_no_police: "Políciu volať nemusíte.",
                acc_h2_3: "KROK 3: Správna dokumentácia", acc_p7: "Ak nevoláte políciu, je na vás, aby ste všetko správne zdokumentovali pre poisťovňu.",
                acc_doc_1_h: "Vyplniť Správu o nehode", acc_doc_1_p: "Najdôležitejší dokument. Musí byť podpísaný oboma stranami.",
                acc_doc_2_h: "Fotodokumentácia miesta", acc_doc_2_p: "Odfoťte všetko: postavenie áut, poškodenia, brzdné dráhy.",
                acc_doc_3_h: "Údaje o druhom účastníkovi", acc_doc_3_p: "Meno, adresa, EČV, a hlavne číslo poistnej zmluvy (PZP).",
                acc_doc_4_h: "Získať svedkov", acc_doc_4_p: "Ak nehodu niekto videl, požiadajte ho o kontakt.",
                acc_h2_4: "KROK 4: Nahlásenie poisťovni", acc_p8: "Nezabudnite na zákonné lehoty.",
                acc_broker_h: "Vždy kontaktujte makléra MARSH", acc_broker_p: "Všetky poistné udalosti je nutné <strong>bezodkladne hlásiť</strong> maklérovi a v kópii oddeleniu Mobility.",
                phone: "Telefón:", acc_broker_call: "Volať makléra MARSH", acc_deadline_h: "Lehoty na nahlásenie",
                acc_deadline_1: "Nehoda na Slovensku", acc_deadline_2: "Nehoda v zahraničí", acc_deadline_p: "Nemeškajte. Po uplynutí týchto lehôt môže poisťovňa krátiť alebo úplne zamietnuť poistné plnenie.",
                legal_h2: "Zákonné pravidlá a povinnosti", legal_p1: "Prehľad najdôležitejších zákonných povinností vodiča na Slovensku.",
                legal_pdf_link: "Zákon o cestnej premávke (PDF)", legal_docs_h: "Základné povinnosti a doklady",
                legal_docs_intro: "Pred jazdou sa uistite, že máte pri sebe:", legal_docs_1: "Vodičský preukaz.",
                legal_docs_2: "Osvedčenie o evidencii vozidla (malý techničák - časť I).", legal_docs_3: "Potvrdenie o poistení (Biela/Zelená karta – PZP).",
                legal_docs_4: "Doklad o STK a EK (protokol/nálepka, ak je auto > 4 roky).", legal_docs_5: "Občiansky preukaz (alebo pas).",
                legal_lights_h: "Pozor:", legal_lights_p: "Povinnosť celodenného svietenia (stretávacie alebo denné LED).",
                legal_speed_h: "Rýchlosť", legal_speed_city: "Obec:", legal_speed_out: "Mimo obce:", legal_speed_hwy: "Diaľnica:", legal_speed_note: "(Diaľnica v obci: 90 km/h)",
                legal_alcohol_h: "Alkohol", legal_alcohol_p: "Nulová tolerancia pred aj počas jazdy.",
                legal_phone_h: "Mobil", legal_phone_ok: "✅ Hands-free", legal_phone_no: "❌ Držanie v ruke, písanie, scrollovanie.",
                legal_lanes_h: "Jazda v pruhoch a predbiehanie", legal_zip_h: "Zipsovanie",
                legal_zip_p: "Kde sa pruhy zbiehajú, platí striedavé radenie. Vodič v priebežnom pruhu musí pustiť jedno auto z končiaceho.",
                legal_rescue_h: "Záchranárska ulička", legal_rescue_p: "Pri kolóne: Ľavý pruh sa tlačí vľavo, ostatné pruhy vpravo (aj na krajnicu). Stred ostáva voľný.",
                legal_vulnerable_h: "Cyklisti a Chodci", legal_cyclist_h: "Odstup od cyklistu:", legal_pedestrian_h: "Chodci:", legal_pedestrian_p: "Povinnosť dať prednosť chodcovi na priechode (neplatí pre električky).",
                legal_hwy_winter_h: "Diaľnice a Zimná prevádzka", legal_hwy_h: "Diaľnice", legal_hwy_1: "Povinná elektronická známka (eznamka.sk).", legal_hwy_2: "Minimálna rýchlosť: 80 km/h (v meste 65 km/h).",
                legal_winter_h: "Zimná prevádzka", legal_winter_1: "<strong>Pneumatiky:</strong> Povinné pri súvislej vrstve snehu/ľadu (odporúčané od 15.11. do 31.3.).",
                legal_winter_2: "<strong>Očistenie:</strong> Zakázané jazdiť so snehom na streche/oknách. EČV musí byť čitateľné.",
                legal_equip_h: "Povinná výbava (skontrolujte kufor)", legal_equip_1: "<strong>Autolekárnička:</strong> Nepreexpirovaná.",
                legal_equip_2: "<strong>Výstražný trojuholník.</strong>", legal_equip_3: "<strong>Reflexná vesta:</strong> Musí byť v dosahu vodiča (nie v kufri!). Ideálne pre každého pasažiera.",
                legal_equip_4: "<strong>Rezervné koleso:</strong> Alebo opravná sada / run-flat pneu.",
                break_h2: "Porucha vozidla", 
                break_p1: "Ak je vaše vozidlo nepojazdné z dôvodu technickej poruchy, alebo máte defekt, postupujte nasledovne.",
                break_contact_h: "Kontaktujte NONSTOP Hotlinku Ayvens / LeasePlan:", break_call_sk: "Volať na Slovensku", break_call_abroad: "Volať zo Zahraničia",
                break_p2: "Operátor vám zabezpečí odťah vozidla a v prípade potreby aj náhradné vozidlo.",
                break_specific_cases: "Špecifické prípady a problémy s vozidlom riešené individuálne", break_flat_tire: "Defekt",
                break_flat_1: "<strong>Cez víkend:</strong> Oprava v najbližšom pneuservise (úhrada súkromne, preplatenie cez Concur).",
                break_flat_2: "<strong>V zahraničí:</strong> Riešiť individuálne kontaktovaním asistenčnej služby Kooperativa.<br><a href='tel:+421263532236' class='mt-2 inline-flex items-center justify-center bg-white text-red-700 font-bold py-1.5 px-3 rounded-lg border border-red-200 shadow-sm hover:bg-gray-50 transition-all text-xs'>📞 +421 2 6353 2236 (Odťah)</a>",
                break_flat_3: "<strong>Nepojazdné vozidlo:</strong> Volať asistenčnú službu Kooperativa pre odťah.",
                break_flat_4: "<strong>Poškodený disk:</strong> volať asistenčnú službu Kooperatíva a následne riešiť ako poistnú udalosť cez makléra MARSH.",
                break_flat_ayvens_title: "alebo najjednoduchšie volať: Asistencia Ayvens (NONSTOP):", break_flat_ayvens_sk: "(Slovensko)", break_flat_ayvens_abroad: "(Zahraničie)",
                break_locked_keys: "Zabuchnuté kľúče", break_locked_1: "Skúste otvoriť cez aplikáciu MyBMW.", break_locked_2: "Alternatívne objednať kľúčovú službu cez Kooperativu.",
                break_locked_3: "<strong>Urgentne (v prac. dobe 08:00-17:00):</strong> Kontaktovať odd. Mobility na <a href='mailto:mobilita@lidl.sk' class='underline font-semibold'>mobilita@lidl.sk</a>.",
                break_locked_4: "<strong>Urgentne (mimo prac. doby):</strong> Volať NONSTOP Hotlinku Ayvens / LeasePlan.",
                break_lost_keys: "Strata kľúčov", break_lost_1: "Okamžite zložiť EČV z vozidla.", break_lost_2: "Pokúsiť sa otvoriť cez appku a vybrať osobné veci.", break_lost_3: "Komunikovať s odd. Mobility.",
                break_lost_4: "Zabezpečiť prevoz do servisu BMW na zablokovanie starého a objednanie nového kľúča.", go_to_contacts_more: "Ďalšie dôležité kontakty",
                serv_h2: "Servis a Oprava Vozidla", serv_p1: "Pravidelný servis a opravy zabezpečuje spoločnosť Ayvens / LeasePlan v sieti zmluvných partnerov.",
                serv_order_h: "Objednávka do servisu / prezutie, oprava, výmena čelného skla", serv_order_p: "Pre objednanie servisu, prezutia, opravy alebo výmeny čelného skla volajte zákaznícku linku Ayvens / LeasePlan:",
                serv_call_sk: "Volať na Slovensku", serv_call_abroad: "Volať zo Zahraničia", serv_glass_h: "Oprava čelného skla", serv_glass_p: "Vždy riešiť cez <strong>Autosklo HORNET</strong> na vyššie uvedených kontaktoch.",
                serv_partners_h: "Servisní partneri", serv_partners_p: "<strong>Volkswagen:</strong> sieť TODOS<br><strong>BMW:</strong> sieť BMW",
                serv_warning_h: "Dôležité upozornenie", serv_warning_p: "Servisný interval nesmie byť za žiadnych okolností prekročený! Objednávajte sa s dostatočným predstihom. Nedodržanie intervalu môže viesť k strate záruky a zosobneniu nákladov.",
                rules_h2: "Základné pravidlá používania vozidla", rules_1: "<strong>Zákaz fajčenia:</strong> Vo všetkých služobných vozidlách platí prísny zákaz fajčenia!",
                rules_2: "<strong>Doklady a karty:</strong> Nikdy nenechávajte doklady od vozidla a tankovacie karty vo vozidle.", rules_3: "<strong>Zamykanie:</strong> Pri každom opustení vozidla je užívateľ povinný ho riadne uzamknúť a vziať si kľúč.",
                rules_4: "<strong>Čistota:</strong> Služobné vozidlo je užívateľ povinný udržiavať v čistote. Čistenie interiéru na náklady spol. Lidl je zakázané.", rules_5: "<strong>Poistenie:</strong> Vozidlo je poistené proti krádeži a poškodeniu. Poistenie sa nevzťahuje na súkromné veci vo vozidle.",
                fuel_h2: "Pravidlá pre Tankovanie", fuel_p1: "Dodržiavajte tieto pravidlá pri používaní tankovacích kariet.", fuel_allowed_h: "Povolené služby a pravidlá",
                fuel_allowed_1: "Zadávanie stavu tachometra je pri platbe kartou povinné.", fuel_allowed_2: "Umytie vozidla je povolené (iba najlacnejší program, max. 1x týždenne).", fuel_allowed_3: "Pri tankovaní do požičaného vozidla zadajte stav km ako '1'.",
                fuel_forbidden_h: "Zakázané úkony", fuel_forbidden_1: "Kupovať diaľničné známky alebo platiť mýtne poplatky pri súkromných cestách.", fuel_forbidden_2: "Tankovať špeciálne/prémiové pohonné hmoty (napr. V-Power, MaxxMotion a pod.).",
                fuel_forbidden_3: "PIN kód nesmie byť vyznačený na karte ani uchovávaný spolu s ňou.", fuel_lost_card_h: "Strata alebo odcudzenie karty",
                fuel_lost_card_p: "V prípade straty je nutné <strong>okamžite hlásiť</strong> udalosť oddeleniu Mobility na email <a href='mailto:mobilita@lidl.sk' class='underline font-semibold'>mobilita@lidl.sk</a>. Počas doby do vystavenia nových kariet (2-3 týždne) tankuje zamestnanec za súkromné prostriedky a náklady si vyúčtuje cez Concur.",
                fuel_abroad_h2: "Použitie tankovacích kariet v zahraničí", fuel_abroad_rules_h: "Pravidlá pre tankovanie", fuel_abroad_rules_p: "Pravidlá sú totožné ako pri tankovaní na Slovensku. Podrobnosti sú popísané v kategórii <strong>Tankovanie</strong>.",
                go_to_fueling: "Zobraziť kategóriu Tankovanie", fuel_abroad_partners_h: "Sieť partnerských čerpacích staníc s použitím našich tankovacích kariet", fuel_abroad_omv_h: "OMV (Karta Routex)",
                fuel_abroad_omv_p: "Akceptačnú sieť, kde Vašu Routex kartu môžete použiť, nájdete na oficiálnej stránke. Na ľavej strane použite funkciu 'Site Finder' na vyhľadanie staníc.", fuel_abroad_omv_a: "Navštíviť www.routex.com", fuel_abroad_shell_h: "SHELL",
                fuel_abroad_shell_p: "Keďže offline zoznam nie je možné udržiavať neustále aktualizovaný, prosíme vás, aby ste použili náš vyhľadávač čerpacích staníc („verejne” dostupný na našich stránkach). Prednastavený filter je vrátane partnerských staníc.", fuel_abroad_shell_a: "Otvoriť vyhľadávač Shell",
                maint_h2: "Údržba a Pneumatiky", maint_p1: "Okrem pravidelných servisných prehliadok je vodič zodpovedný aj za bežnú údržbu vozidla.",
                maint_tires_sk_h: "Prezúvanie pneumatík na Slovensku", maint_winter_h: "Zimné pneumatiky: Povinnosť a odporúčania",
                maint_winter_p1: "Zákon o cestnej premávke ukladá vodičom osobných vozidiel povinnosť použiť zimné pneumatiky vtedy, ak je na vozovke súvislá vrstva snehu, ľad alebo námraza. Toto pravidlo platí bez ohľadu na dátum v kalendári.",
                maint_winter_p2: "Všeobecným a osvedčeným odporúčaním je prezuť na zimné pneumatiky, keď priemerná denná teplota klesne pod 7 °C. Zmes letných pneumatík pri nízkych teplotách tvrdne, čím stráca priľnavosť a predlžuje sa brzdná dráha.",
                maint_winter_l1: "Minimálna hĺbka dezénu pre zimné pneumatiky na osobných vozidlách je zákonom stanovená na <strong>3 mm</strong>. Odborníci však z bezpečnostných dôvodov odporúčajú výmenu už pri hĺbke <strong>4 mm</strong>.",
                maint_winter_l2: "Zimné pneumatiky sú označené symbolom \"M+S\", \"M.S\", \"M&S\" alebo symbolom alpského štítu (3PMSF - Three-Peak Mountain Snowflake).",
                maint_summer_h: "Letné pneumatiky: Kedy je správny čas na prezutie?",
                maint_summer_p1: "Zákon nestanovuje povinnosť prezuť na letné pneumatiky. Jazda na zimných pneumatikách v letných mesiacoch však nie je bezpečná ani ekonomická. Zimné pneumatiky sa pri vyšších teplotách rýchlejšie opotrebúvajú, zvyšujú spotrebu paliva a majú horšie brzdné vlastnosti na suchej a mokrej vozovke.",
                maint_summer_p2: "Ideálnym časom na prezutie na letné pneumatiky je, keď sa priemerné denné teploty stabilne držia nad 7 °C.",
                maint_summer_l1: "Minimálna povolená hĺbka dezénu pre letné pneumatiky je <strong>1,6 mm</strong>. Z bezpečnostného hľadiska sa však odporúča pneumatiky vymeniť, ak hĺbka dezénu klesne pod <strong>3 mm</strong>.",
                maint_check_h: "Kontrola stavu vozidla", maint_check_p: "Pravidelne sledujte funkčnosť vozidla a stav prevádzkových kvapalín, o potrebe doplnenia sa dozviete z infopanelu vozidla i v aplikácii MY BMW.", go_to_my_bmw: "Prejsť na sekciu MY BMW",
                maint_bolt_h: "Stratený poistný šrób od kolesa", maint_bolt_p: "Nástavec sa zvyčajne nachádza v kufri. Ak ho servis nevie nájsť, je potrebné vymeniť celú sadu poistných šróbov.",
                maint_tires_h: "Objednávka na prezutie pneumatík", maint_tires_p: "Objednáva sa cez zákaznícku linku Ayvens / LeasePlan:", maint_call_customer_line: "Volať Zákaznícku Linku",
                maint_fluids_h: "Olej a voda do ostrekovačov", maint_fluids_p: "Sú k dispozícii na recepcii centrály alebo u technikov skladu proti podpisu. V servise sa tieto kvapaliny nedopĺňajú na náklady firmy.",
                ins_h2: "Poistné Udalosti", ins_p1: "Aktuálne máme vozidlá poistené cez poisťovňu <strong>Kooperativa</strong>.", 
                ins_green_cards_h: "Zelené karty (poistné) 2026", ins_green_cards_p: "Stiahnite si alebo zdieľajte aktuálne elektronické zelené karty pre služobné vozidlá.", ins_green_cards_btn: "Otvoriť Zelené karty", ins_green_cards_share: "Odoslať kolegovi", ins_green_cards_note: "⚠️ Stiahnutie je možné len zo služobných zariadení.",
                ins_kasko_h: "Havarijné poistenie KASKO", ins_kasko_p: "Všetky služobné vozidlá majú uzatvorené havarijné poistenie KASKO. Toto poistenie kryje škody na vlastnom vozidle spôsobené haváriou, živelnou udalosťou, vandalizmom alebo odcudzením.",
                ins_report_h: "Hlásenie poistnej udalosti", ins_report_p: "Všetky poistné udalosti je nutné <strong>bezodkladne</strong> hlásiť maklérovi <strong>MARSH</strong> a v kópii vždy informovať oddelenie Mobility.", go_to_accident: "Zobraziť postup pri nehode",
                ins_abroad_h: "Poistná udalosť v zahraničí", ins_abroad_p1: "V prípade poistnej udalosti v zahraničí sa postupuje individuálne. Vždy bezodkladne kontaktujte makléra MARSH, ktorý vám poskytne presné inštrukcie.",
                ins_abroad_p2: "Skontrolujte si platnosť a územný rozsah poistenia na vašej <strong>Zelenej karte</strong>. Zoznam povolených krajín je uvedený na karte. Cesta do krajiny, ktorá nie je na zozname, je zakázaná.",
                logbook_h2: "Elektronická Kniha Jázd (EKJ)", logbook_p1: "Správne a včasné vedenie knihy jázd je kľúčovou povinnosťou každého vodiča.",
                logbook_rules_h: "Základné Pravidlá a Povinnosti", logbook_rules_l1: "<strong>Povinné vedenie:</strong> Každý užívateľ je povinný viesť EKJ.", logbook_rules_l2: "<strong>Aktivácia:</strong> Aktivácia vozidla a kariet v systéme prebehne do 3 týždňov od prebratia vozidla.",
                logbook_rules_l3: "<strong>Súkromné vs. Služobné jazdy:</strong> Dôsledne rozlišujte medzi súkromnými a služobnými jazdami. Cesta medzi bydliskom a prácou je vždy súkromná.", logbook_rules_l4: "<strong>Voľné dni:</strong> Počas dovolenky a dní pracovného voľna musia byť všetky kilometre vykázané ako súkromné.",
                logbook_deadlines_h: "Dôležité Termíny", logbook_deadlines_l1: "<strong>Spracovanie jázd:</strong> Vždy spätne za uplynulý mesiac, najneskôr do konca nasledujúceho mesiaca.",
                logbook_deadlines_l2: "<strong>Nahrávanie tankovaní (SK):</strong> Prebieha automaticky 2. pracovný deň nasledujúceho mesiaca.", logbook_deadlines_l3: "<strong>Nahrávanie tankovaní (Zahraničie):</strong> Synchronizujte až po 20. dni nasledujúceho mesiaca.",
                logbook_problems_h: "Riešenie Problémov", logbook_problems_p: "Akékoľvek problémy s knihou jázd nahláste okamžite cez IT ticket na oddelenie Mobility.",
                fines_h2: "Pokuty a Priestupky", fines_p1: "Zodpovednosť za dopravné priestupky a z nich vyplývajúce sankcie nesie vždy vodič, ktorý priestupok spáchal.", fines_process_h: "Proces riešenia pokút",
                fines_step1_h: "Doručenie pokuty", fines_step1_p: "Pokuta je doručená spoločnosti Lidl ako držiteľovi vozidla.", fines_step2_h: "Identifikácia vodiča", fines_step2_p: "Oddelenie Mobility identifikuje vodiča a pošle mu emailom výzvu na úhradu spolu so všetkými podkladmi.",
                fines_step3_h: "Úhrada zamestnancom", fines_step3_p: "Zamestnanec je povinný pokutu bezodkladne uhradiť a poslať doklad o úhrade na email <a href='mailto:pokuty@lidl.sk' class='underline text-blue-600 font-semibold'>pokuty@lidl.sk</a>.",
                fines_warning_h: "Dôležité upozornenie", fines_warning_p: "Ak zamestnanec pokutu neuhradí a nepredloží doklad o úhrade v stanovenej lehote, príslušná suma mu bude <strong>stiahnutá zo mzdy</strong>.",
                newcar_h2: "Proces Nového Vozidla", newcar_p1: "Pridelenie a objednanie nového služobného vozidla sa riadi internými pravidlami spoločnosti.", newcar_return_h: "Pred odovzdaním (výmenou) vozidla", newcar_return_p: "Zamestnanec je povinný:",
                newcar_return_l1: "nahlásiť na poistnú udalosť všetky poškodenia vozidla", newcar_return_l2: "ukončiť a odoslať všetky elektronické knihy jázd", newcar_return_l3: "dohodnúť si termín odovzdania (výmeny vozidla) na DL s mobilitou / na LC s určeným zamestnancom z Transportlogistik",
                newcar_assign_h: "Pridelenie Vozidla", newcar_assign_p: "Služobné vozidlo sa prideľuje zamestnancovi na základe jeho pracovnej pozície a interných smerníc.", newcar_assign_l1: "<strong>Podmienky:</strong> Nárok na vozidlo a jeho kategória sú určené pracovnou pozíciou. Používanie na súkromné účely vyžaduje podpísanú dohodu.",
                newcar_assign_l2: "<strong>Protokol:</strong> Pridelenie aj odovzdanie vozidla sa vždy zaznamenáva do preberacieho protokolu.", newcar_order_h: "Objednanie Nového Vozidla", newcar_order_p: "Proces objednania je plne v kompetencii oddelenia Mobility a riadi sa schváleným modelom obmeny.",
                newcar_order_l1: "<strong>Plán obmeny:</strong> Objednávka sa riadi vekom aktuálneho vozidla a platným mesačným modelom obmeny.", newcar_order_l2: "<strong>Nenárokovateľnosť:</strong> Nárok na objednanie nového vozidla nie je zo strany zamestnanca automaticky nárokovateľný.",
                newcar_order_subtitle: "Proces objednania:", newcar_order_l3: "<strong>FE6(MP), FE6(Budget):</strong> Objednáva sa cez objednávkový formulár.", newcar_order_l4: "<strong>FE5 až FE1:</strong> Objednáva sa cez Schwarz/BMW konfigurátor.",
                mybmw_h2: "Aplikácia My BMW", mybmw_p1: "Aplikácia je vaše digitálne prepojenie s vozidlom. Ponúka funkcie pre plánovanie jázd, kontrolu stavu vozidla a vzdialené ovládanie. Je nápomocná pri vypisovaní EKJ.",
                mybmw_features_h: "Kľúčové funkcie", mybmw_features_l1: "<strong>Kontrola stavu vozidla:</strong> Hladina oleja, stav pneumatík, potreba servisu.", mybmw_features_l2: "<strong>Vzdialené ovládanie:</strong> Odomknutie/zamknutie, spustenie ventilácie.",
                mybmw_features_l3: "<strong>Plánovanie ciest:</strong> Posielanie cieľov priamo do navigácie vozidla.", mybmw_features_l4: "<strong>Pomocník pre EKJ:</strong> Zobrazuje prejdené kilometre a uľahčuje vypisovanie knihy jázd.",
                mybmw_download_h: "Stiahnite si aplikáciu", mybmw_info_p: "Aplikácia je kompatibilná so všetkými BMW vozidlami. Pri problémoch s pripojením alebo funkčnosťou kontaktujte servisného poradcu BMW.",
                contacts_h2: "Dôležité kontakty",
                contacts_warning_h: "Dôležité upozornenie",
                contacts_warning_p: "Dodržujte postup nahlasovania a primárne využívajte nonstop kontakt spoločnosti Ayvens. Kontakty na poisťovňu využívajte len v krajných prípadoch, ak sa neviete dovolať na Ayvens linku.",
                contacts_assist_h: "Asistencia a Servis",
                contacts_assist_3_h: "Odťah Kooperativa (mimo prac. doby) - SK",
                contacts_assist_4_h: "Odťah Kooperativa - Zahraničie",
                contacts_report_h: "Hlásenie poistných udalostí a administratíva",
                contacts_report_1_h: "Poistné udalosti (MARSH)",
                contacts_report_2_h: "Oddelenie Mobility (vždy v kópii)",
                contacts_lostkey_h: "Strata kľúča",
                contacts_lostkey_1_h: "V pracovnej dobe (08:00 - 17:00)",
                contacts_lostkey_1_p: "Kontaktujte <strong>Oddelenie Mobility</strong>.",
                contacts_lostkey_2_h: "Mimo pracovnej doby",
                contacts_lostkey_2_p: "Kontaktujte <strong>LeasePlan nonstop linku</strong>.",
                call: "Volať",
                send_email: "Poslať email",
                acc_deadline_15: "15 dní",
                acc_deadline_30: "30 dní",
                maint_tp_guide_h: "Sprievodca Tlakom v Pneumatikách",
                maint_tp_impact_h: "Vplyv na spotrebu a životnosť",
                maint_tp_under_h: "Podhustené",
                maint_tp_fuel: "Spotreba paliva",
                maint_tp_life: "Životnosť pneu",
                maint_tp_correct_h: "Správny Tlak",
                maint_tp_optimal: "Optimálna",
                maint_tp_over_h: "Prehustené",
                maint_tp_where_h: "Kde nájsť správne hodnoty tlaku v pneumatikách?",
                maint_tp_tab_label: "Štítok na vozidle",
                maint_tp_tab_idrive: "BMW iDrive (23+)",
                maint_tp_tab_manual: "Manuál",
                maint_tp_loc_door: "Stĺpik dverí",
                maint_tp_loc_fuel: "Viečko nádrže",
                maint_tp_loc_glove: "Príručná skrinka",
                maint_tp_idrive_h: "Kontrola cez BMW iDrive",
                maint_tp_idrive_menu: "MENU",
                maint_tp_idrive_myveh: "MOJE VOZIDLO",
                maint_tp_idrive_status: "STAV VOZIDLA",
                maint_tp_idrive_tpms: "KONTROLA TLAKU",
                maint_tp_idrive_desc: "Zobrazený aktuálny a odporúčaný tlak",
                maint_tp_manual_h: "Príručka k vozidlu",
                maint_tp_manual_desc: "V manuáli nájdete detailné tabuľky s hodnotami tlaku pre rôzne zaťaženie vozidla a rozmery pneumatík.",
                maint_tp_proc_h: "Postup kontroly a hustenia",
                maint_tp_proc_btn: "Zobraziť postup",
                maint_tp_proc_1: "Merať na <span class=\"font-semibold\">studených pneumatikách</span> (pred jazdou).",
                maint_tp_proc_2: "Odskrutkovať čiapočku z ventilu.",
                maint_tp_proc_3: "Pevne pritlačiť <span class=\"font-semibold\">tlakomer</span> na ventil a odčítať hodnotu.",
                maint_tp_proc_4: "Porovnať s odporúčanou hodnotou.",
                maint_tp_proc_5: "V prípade potreby <span class=\"font-semibold\">dofúkať</span> na kompresore (napr. na čerpacej stanici).",
                maint_tp_proc_6: "Naskrutkovať čiapočku späť. Zopakovať pre všetky 4 pneu.",
                maint_tp_tip_h: "Tip: Pomoc na stanici Shell",
                maint_tp_tip_desc: "Ak si nie ste istí, obsluha na čerpacích staniciach Shell vám ochotne pomôže s kontrolou a dofúkaním."
            },
            en: {
                main_title: "Driver's Handbook", main_subtitle: "Your interactive guide to Lidl company vehicles",
                quick_actions_title: "Quick Actions & Emergencies", accident_title: "I had an accident", accident_subtitle: "Immediate step-by-step procedure.",
                service_title: "I need a service", service_subtitle_quick: "Book a repair or maintenance.",
                breakdown_title: "My car broke down or flat tire", breakdown_subtitle: "Contact assistance service.",
                categories_title: "Information Categories", nav_rules: "Basic Rules", nav_legal_rules: "Legal Rules",
                nav_fueling: "Fueling", nav_fueling_abroad: "Fueling Abroad", nav_maintenance: "Maintenance & Tires",
                nav_insurance: "Insurance Claims", nav_logbook: "Logbook", nav_fines: "Fines", nav_new_car: "New Vehicle",
                nav_my_bmw: "MY BMW", nav_contacts: "Important Contacts",
                acc_h1: "TRAFFIC ACCIDENT", acc_p1: "Stay calm. Here is your guide.",
                acc_h2_1: "STEP 1: Immediate Safety", acc_p2: "Your priority is to prevent further damage and take care of the health of everyone involved.",
                acc_h3_1: "STOP AND TURN ON LIGHTS", acc_p3: "Stop immediately and turn on hazard lights.",
                acc_h3_2: "VEST AND TRIANGLE", acc_p4: "Put on a reflective vest and place a warning triangle.",
                acc_h3_3: "CHECK FOR INJURIES", acc_p5: "If anyone is injured, call for help immediately.", acc_call_1: "Call Ambulance", acc_call_2: "Call 112",
                acc_h2_2: "STEP 2: Call the police?", acc_p6: "The law strictly dictates when the presence of police is mandatory.",
                acc_q1: "Is anyone injured or killed?", acc_yes: "YES", acc_no: "NO", acc_call_police: "CALL 158 (Police)",
                acc_q2: "Is the damage higher than €4,000?", acc_yes_2: "YES", acc_no_2: "NO", acc_call_police_2: "CALL 158 (Police)",
                acc_q3: "Can you agree on who is at fault?", acc_no_3: "NO", acc_call_police_3: "CALL 158 (Police)", acc_yes_3: "YES", acc_no_police: "No need to call the police.",
                acc_h2_3: "STEP 3: Proper documentation", acc_p7: "If you do not call the police, it is up to you to document everything properly for the insurance company.",
                acc_doc_1_h: "Fill out the Accident Report", acc_doc_1_p: "The most important document. Must be signed by both parties.",
                acc_doc_2_h: "Photo documentation", acc_doc_2_p: "Take photos of everything: position of cars, damages, skid marks.",
                acc_doc_3_h: "Details of the other party", acc_doc_3_p: "Name, address, license plate, and most importantly, the insurance policy number (PZP).",
                acc_doc_4_h: "Get witnesses", acc_doc_4_p: "If anyone saw the accident, ask for their contact info.",
                acc_h2_4: "STEP 4: Reporting to the insurance company", acc_p8: "Do not forget the legal reporting deadlines.",
                acc_broker_h: "Always contact the MARSH broker", acc_broker_p: "All insurance events must be reported <strong>without delay</strong> to the broker and cc'd to the Mobility department.",
                phone: "Phone:", acc_broker_call: "Call MARSH broker", acc_deadline_h: "Reporting deadlines",
                acc_deadline_1: "Accident in Slovakia", acc_deadline_2: "Accident abroad", acc_deadline_p: "Do not delay. After these deadlines, the insurance company may reduce or completely reject the claim.",
                legal_h2: "Legal rules and obligations", legal_p1: "Overview of the most important legal obligations of a driver in Slovakia.",
                legal_pdf_link: "Road Traffic Act (PDF)", legal_docs_h: "Basic obligations and documents",
                legal_docs_intro: "Before driving, make sure you have:", legal_docs_1: "Driver's license.",
                legal_docs_2: "Vehicle registration certificate (Part I).", legal_docs_3: "Proof of insurance (White/Green card – PZP).",
                legal_docs_4: "MOT and Emissions certificate (protocol/sticker, if the car is > 4 years old).", legal_docs_5: "ID card (or passport).",
                legal_lights_h: "Attention:", legal_lights_p: "Obligation to use headlights all day (dipped beam or daytime running LEDs).",
                legal_speed_h: "Speed Limits", legal_speed_city: "Town/City:", legal_speed_out: "Outside town:", legal_speed_hwy: "Highway:", legal_speed_note: "(Highway in town: 90 km/h)",
                legal_alcohol_h: "Alcohol", legal_alcohol_p: "Zero tolerance before and during driving.",
                legal_phone_h: "Phone", legal_phone_ok: "✅ Hands-free", legal_phone_no: "❌ Holding in hand, typing, scrolling.",
                legal_lanes_h: "Driving in lanes and overtaking", legal_zip_h: "Zipper merge",
                legal_zip_p: "Where lanes merge, alternate merging applies. A driver in the continuing lane must let one car from the ending lane merge.",
                legal_rescue_h: "Emergency corridor", legal_rescue_p: "In a traffic jam: Left lane moves left, other lanes move right (even to the shoulder). The middle remains clear.",
                legal_vulnerable_h: "Cyclists and Pedestrians", legal_cyclist_h: "Distance from a cyclist:", legal_pedestrian_h: "Pedestrians:", legal_pedestrian_p: "Obligation to give way to a pedestrian on a crosswalk (does not apply to trams).",
                legal_hwy_winter_h: "Highways and Winter Driving", legal_hwy_h: "Highways", legal_hwy_1: "Mandatory electronic vignette (eznamka.sk).", legal_hwy_2: "Minimum speed: 80 km/h (in town 65 km/h).",
                legal_winter_h: "Winter driving", legal_winter_1: "<strong>Tires:</strong> Mandatory on a continuous layer of snow/ice (recommended from Nov 15 to Mar 31).",
                legal_winter_2: "<strong>Clearing snow:</strong> Prohibited from driving with snow on the roof/windows. License plate must be readable.",
                legal_equip_h: "Mandatory equipment (check the trunk)", legal_equip_1: "<strong>First aid kit:</strong> Unexpired.",
                legal_equip_2: "<strong>Warning triangle.</strong>", legal_equip_3: "<strong>Reflective vest:</strong> Must be within reach of the driver (not in the trunk!). Ideally for every passenger.",
                legal_equip_4: "<strong>Spare wheel:</strong> Or repair kit / run-flat tires.",
                break_p1: "If your vehicle is immobile due to a technical failure or you have a flat tire, proceed as follows.",
                break_contact_h: "Contact the Ayvens / LeasePlan NONSTOP Hotline:", break_call_sk: "Call in Slovakia", break_call_abroad: "Call from Abroad",
                break_p2: "The operator will arrange for the vehicle to be towed and, if necessary, provide a replacement vehicle.",
                break_specific_cases: "Specific cases and vehicle problems handled individually", break_flat_tire: "Flat tire",
                break_flat_1: "<strong>Weekend:</strong> Repair at the nearest tire service (pay privately, reimburse via Concur).",
                break_flat_2: "<strong>Abroad:</strong> Resolve individually by contacting Kooperativa assistance service.<br><a href='tel:+421263532236' class='mt-2 inline-flex items-center justify-center bg-white text-red-700 font-bold py-1.5 px-3 rounded-lg border border-red-200 shadow-sm hover:bg-gray-50 transition-all text-xs'>📞 +421 2 6353 2236 (Towing)</a>",
                break_flat_3: "<strong>Immobile vehicle:</strong> Call Kooperativa assistance service for towing.",
                break_flat_4: "<strong>Damaged rim:</strong> Call Kooperativa assistance service and then treat as an insurance claim via MARSH broker.",
                break_flat_ayvens_title: "or simply call: Ayvens Assistance (NONSTOP):", break_flat_ayvens_sk: "(Slovakia)", break_flat_ayvens_abroad: "(Abroad)",
                break_locked_keys: "Locked keys inside", break_locked_1: "Try to open via the MyBMW app.", break_locked_2: "Alternatively, order a locksmith via Kooperativa.",
                break_locked_3: "<strong>Urgent (work hours 08:00-17:00):</strong> Contact Mobility dept. at <a href='mailto:mobilita@lidl.sk' class='underline font-semibold'>mobilita@lidl.sk</a>.",
                break_locked_4: "<strong>Urgent (outside work hours):</strong> Call NONSTOP Ayvens / LeasePlan Hotline.",
                break_lost_keys: "Lost keys", break_lost_1: "Immediately remove the license plates from the vehicle.", break_lost_2: "Try to open via the app and take out personal belongings.", break_lost_3: "Communicate with the Mobility dept.",
                break_lost_4: "Arrange transport to a BMW service to block the old key and order a new one.", go_to_contacts_more: "Other important contacts",
                serv_h2: "Vehicle Service and Repair", serv_p1: "Regular service and repairs are provided by Ayvens / LeasePlan in a network of contracted partners.",
                serv_order_h: "Service booking / tire change, repair, windshield replacement", serv_order_p: "To book a service, tire change, repair, or windshield replacement, call the Ayvens / LeasePlan customer line:",
                serv_call_sk: "Call in Slovakia", serv_call_abroad: "Call from Abroad", serv_glass_h: "Windshield repair", serv_glass_p: "Always handle through <strong>Autosklo HORNET</strong> using the contacts above.",
                serv_partners_h: "Service partners", serv_partners_p: "<strong>Volkswagen:</strong> TODOS network<br><strong>BMW:</strong> BMW network",
                serv_warning_h: "Important warning", serv_warning_p: "The service interval must not be exceeded under any circumstances! Book in advance. Failure to observe the interval may lead to a loss of warranty and personal liability for costs.",
                rules_h2: "Basic rules for using the vehicle", rules_1: "<strong>No smoking:</strong> Strict smoking ban applies in all company vehicles!",
                rules_2: "<strong>Documents and cards:</strong> Never leave vehicle documents and fuel cards in the vehicle.", rules_3: "<strong>Locking:</strong> The user is obliged to lock the vehicle and take the key every time they leave it.",
                rules_4: "<strong>Cleanliness:</strong> The user must keep the company vehicle clean. Interior cleaning at Lidl's expense is prohibited.", rules_5: "<strong>Insurance:</strong> The vehicle is insured against theft and damage. Insurance does not cover personal belongings inside.",
                fuel_h2: "Fueling Rules", fuel_p1: "Follow these rules when using fuel cards.", fuel_allowed_h: "Allowed services and rules",
                fuel_allowed_1: "Entering the mileage is mandatory when paying by card.", fuel_allowed_2: "Car wash is allowed (cheapest program only, max. 1x per week).", fuel_allowed_3: "When fueling a borrowed vehicle, enter mileage as '1'.",
                fuel_forbidden_h: "Prohibited actions", fuel_forbidden_1: "Buying highway vignettes or paying tolls on private trips.", fuel_forbidden_2: "Fueling special/premium fuels (e.g., V-Power, MaxxMotion, etc.).",
                fuel_forbidden_3: "The PIN code must not be written on the card or kept with it.", fuel_lost_card_h: "Lost or stolen card",
                fuel_lost_card_p: "In case of loss, it is necessary to <strong>immediately report</strong> the event to the Mobility dept. at <a href='mailto:mobilita@lidl.sk' class='underline font-semibold'>mobilita@lidl.sk</a>. Until new cards are issued (2-3 weeks), the employee pays for fuel privately and claims expenses via Concur.",
                fuel_abroad_h2: "Using fuel cards abroad", fuel_abroad_rules_h: "Fueling rules", fuel_abroad_rules_p: "The rules are the same as when fueling in Slovakia. Details are described in the <strong>Fueling</strong> category.",
                go_to_fueling: "Go to Fueling category", fuel_abroad_partners_h: "Network of partner gas stations for our fuel cards", fuel_abroad_omv_h: "OMV (Routex Card)",
                fuel_abroad_omv_p: "You can find the acceptance network for your Routex card on the official website. Use the 'Site Finder' feature on the left side.", fuel_abroad_omv_a: "Visit www.routex.com", fuel_abroad_shell_h: "SHELL",
                fuel_abroad_shell_p: "Since an offline list cannot be kept updated, please use our station locator ('publicly' available on our site). The default filter includes partner stations.", fuel_abroad_shell_a: "Open Shell Locator",
                maint_h2: "Maintenance and Tires", maint_p1: "In addition to regular service checks, the driver is also responsible for routine vehicle maintenance.",
                maint_tires_sk_h: "Tire changing in Slovakia", maint_winter_h: "Winter tires: Obligations and recommendations",
                maint_winter_p1: "The Road Traffic Act requires drivers of passenger cars to use winter tires if there is a continuous layer of snow, ice, or frost on the road. This rule applies regardless of the calendar date.",
                maint_winter_p2: "A general and proven recommendation is to switch to winter tires when the average daily temperature drops below 7 °C. Summer tire compounds harden at low temperatures, losing grip and increasing braking distance.",
                maint_winter_l1: "The minimum tread depth for winter tires on passenger cars is legally set at <strong class='text-slate-800 dark:text-white'>3 mm</strong>. However, for safety reasons, experts recommend replacement at <strong class='text-slate-800 dark:text-white'>4 mm</strong>.",
                maint_winter_l2: "Winter tires are marked with the symbol \"M+S\", \"M.S\", \"M&S\" or the alpine symbol (3PMSF - Three-Peak Mountain Snowflake).",
                maint_summer_h: "Summer tires: When is the right time to change?",
                maint_summer_p1: "The law does not mandate switching to summer tires. However, driving on winter tires in summer is neither safe nor economical. Winter tires wear out faster at higher temperatures, increase fuel consumption, and have worse braking performance on dry and wet roads.",
                maint_summer_p2: "The ideal time to switch to summer tires is when average daily temperatures stabilize above 7 °C.",
                maint_summer_l1: "The minimum legal tread depth for summer tires is <strong class='text-slate-800 dark:text-white'>1.6 mm</strong>. For safety, it is recommended to replace them if the tread depth drops below <strong class='text-slate-800 dark:text-white'>3 mm</strong>.",
                maint_check_h: "Checking vehicle status", maint_check_p: "Regularly monitor the vehicle's functionality and fluid levels via the MY BMW app.", go_to_my_bmw: "Open MY BMW section",
                maint_bolt_h: "Lost wheel lock nut", maint_bolt_p: "The socket is usually located in the trunk. If the service cannot find it, the entire set of lock nuts must be replaced.",
                maint_tires_h: "Tire change booking", maint_tires_p: "Book via the Ayvens / LeasePlan customer line:", maint_call_customer_line: "Call Line",
                maint_fluids_h: "Oil and washer fluid", maint_fluids_p: "Available at the HQ reception or from warehouse technicians upon signature. Services do not refill these fluids at the company's expense.",
                ins_h2: "Insurance Claims", ins_p1: "Currently, our vehicles are insured with <strong>Kooperativa</strong>.", 
                ins_green_cards_h: "Green Cards (Insurance) 2026", ins_green_cards_p: "Download or share the current electronic green cards for company vehicles.", ins_green_cards_btn: "Open Green Cards", ins_green_cards_share: "Send to a colleague", ins_green_cards_note: "⚠️ Download is only possible from company devices.",
                ins_kasko_h: "KASKO Collision Insurance", ins_kasko_p: "All company vehicles have KASKO collision insurance. This covers damage to your own vehicle caused by an accident, natural disaster, vandalism, or theft.",
                ins_report_h: "Reporting an insurance claim", ins_report_p: "All insurance events must be reported <strong>without delay</strong> to the MARSH broker, always keeping the Mobility department in copy.", go_to_accident: "Show accident procedure",
                ins_abroad_h: "Insurance event abroad", ins_abroad_p1: "In the event of an insurance claim abroad, it is handled individually. Always contact the MARSH broker immediately for precise instructions.",
                ins_abroad_p2: "Check the validity and territorial scope of insurance on your <strong>Green Card</strong>. The list of permitted countries is on the card. Travel to a country not on the list is prohibited.",
                logbook_h2: "Electronic Logbook (EKJ)", logbook_p1: "Proper and timely maintenance of the logbook is a key obligation of every driver.",
                logbook_rules_h: "Basic Rules and Obligations", logbook_rules_l1: "<strong class='text-slate-900 dark:text-white'>Mandatory keeping:</strong> Every user is obliged to keep the EKJ.", logbook_rules_l2: "<strong class='text-slate-900 dark:text-white'>Activation:</strong> Activation of the vehicle and cards in the system will take place within 3 weeks of taking over the vehicle.",
                logbook_rules_l3: "<strong class='text-slate-900 dark:text-white'>Private vs. Business trips:</strong> Strictly distinguish between private and business trips. Traveling between home and work is always private.", logbook_rules_l4: "<strong class='text-slate-900 dark:text-white'>Days off:</strong> During holidays and days off, all kilometers must be reported as private.",
                logbook_deadlines_h: "Important Deadlines", logbook_deadlines_l1: "<strong>Trip processing:</strong> Always retroactively for the past month, no later than the end of the following month.",
                logbook_deadlines_l2: "<strong>Fueling uploads (SK):</strong> Takes place automatically on the 2nd working day of the following month.", logbook_deadlines_l3: "<strong>Fueling uploads (Abroad):</strong> Synchronize only after the 20th day of the following month.",
                logbook_problems_h: "Troubleshooting", logbook_problems_p: "Report any issues with the logbook immediately via an IT ticket to the Mobility dept.",
                fines_h2: "Fines and Offenses", fines_p1: "Responsibility for traffic offenses and resulting sanctions always lies with the driver who committed the offense.", fines_process_h: "Fine resolution process",
                fines_step1_h: "Delivery of fine", fines_step1_p: "The fine is delivered to Lidl as the vehicle owner.", fines_step2_h: "Driver identification", fines_step2_p: "Mobility dept. identifies the driver and sends an email request for payment along with all documents.",
                fines_step3_h: "Payment by employee", fines_step3_p: "The employee is obliged to pay the fine without delay and send proof of payment to <a href='mailto:pokuty@lidl.sk' class='underline text-blue-600 dark:text-blue-400 font-bold'>pokuty@lidl.sk</a>.",
                fines_warning_h: "Important warning", fines_warning_p: "If the employee does not pay the fine and submit proof within the set deadline, the relevant amount will be <strong class='text-red-600 dark:text-red-400 font-bold'>deducted from their salary</strong>.",
                newcar_h2: "New Vehicle Process", newcar_p1: "The assignment and ordering of a new company vehicle is governed by internal company rules.", newcar_return_h: "Before returning (exchanging) a vehicle", newcar_return_p: "The employee is obliged to:",
                newcar_return_l1: "report all vehicle damages as insurance claims", newcar_return_l2: "close and send all electronic logbooks", newcar_return_l3: "agree on a handover date (vehicle exchange) on DL with Mobility / on LC with designated employee from Transportlogistics",
                newcar_assign_h: "Vehicle Assignment", newcar_assign_p: "A company vehicle is assigned to an employee based on their job position and internal guidelines.", newcar_assign_l1: "<strong class='text-slate-900 dark:text-white'>Conditions:</strong> Entitlement to a vehicle and its category are determined by job position. Use for private purposes requires a signed agreement.",
                newcar_assign_l2: "<strong class='text-slate-900 dark:text-white'>Protocol:</strong> Assignment and handover of a vehicle are always recorded in a handover protocol.", newcar_order_h: "Ordering a New Vehicle", newcar_order_p: "The ordering process is fully within the competence of the Mobility dept. and follows an approved replacement model.",
                newcar_order_l1: "<strong class='text-slate-900 dark:text-white'>Replacement plan:</strong> Ordering is governed by the age of the current vehicle and the valid monthly replacement model.", newcar_order_l2: "<strong class='text-slate-900 dark:text-white'>Non-entitlement:</strong> The right to order a new vehicle is not automatically claimable by the employee.",
                newcar_order_subtitle: "Ordering process:", newcar_order_l3: "<strong class='text-slate-900 dark:text-white'>FE6(MP), FE6(Budget):</strong> Ordered via an order form.", newcar_order_l4: "<strong class='text-slate-900 dark:text-white'>FE5 to FE1:</strong> Ordered via Schwarz/BMW configurator.",
                mybmw_h2: "My BMW App", mybmw_p1: "The app is your digital connection to the vehicle. It offers features for trip planning, checking vehicle status, and remote control. It is helpful for filling out the EKJ.",
                mybmw_features_h: "Key features", mybmw_features_l1: "<strong class='text-slate-900 dark:text-white'>Vehicle status check:</strong> Oil level, tire condition, service needs.", mybmw_features_l2: "<strong class='text-slate-900 dark:text-white'>Remote control:</strong> Unlock/lock, start ventilation.",
                mybmw_features_l3: "<strong class='text-slate-900 dark:text-white'>Trip planning:</strong> Sending destinations directly to vehicle navigation.", mybmw_features_l4: "<strong class='text-slate-900 dark:text-white'>EKJ assistant:</strong> Shows driven kilometers and simplifies filling out the logbook.",
                mybmw_download_h: "Download the app", mybmw_info_p: "The app is compatible with all BMW vehicles. For issues with connection or functionality, contact a BMW service advisor.",
                contacts_h2: "Important Contacts",
                contacts_warning_h: "Important warning",
                contacts_warning_p: "Follow the reporting procedure and primarily use the Ayvens nonstop contact. Use insurance contacts only in extreme cases if you cannot reach the Ayvens line.",
                contacts_assist_h: "Assistance and Service",
                contacts_assist_3_h: "Towing Kooperativa (outside work hours) - SK",
                contacts_assist_4_h: "Towing Kooperativa - Abroad",
                contacts_report_h: "Insurance claims reporting and administration",
                contacts_report_1_h: "Insurance claims (MARSH)",
                contacts_report_2_h: "Mobility Department (always CC)",
                contacts_lostkey_h: "Lost key",
                contacts_lostkey_1_h: "Work hours (08:00 - 17:00)",
                contacts_lostkey_1_p: "Contact <strong>Mobility Dept.</strong>",
                contacts_lostkey_2_h: "Outside work hours",
                contacts_lostkey_2_p: "Contact <strong>LeasePlan nonstop line</strong>.",
                call: "Call",
                send_email: "Send Email",
                acc_deadline_15: "15 days",
                acc_deadline_30: "30 days",
                maint_tp_guide_h: "Tire Pressure Guide",
                maint_tp_impact_h: "Impact on fuel consumption and tire life",
                maint_tp_under_h: "Underinflated",
                maint_tp_fuel: "Fuel consumption",
                maint_tp_life: "Tire life",
                maint_tp_correct_h: "Correct Pressure",
                maint_tp_optimal: "Optimal",
                maint_tp_over_h: "Overinflated",
                maint_tp_where_h: "Where to find correct tire pressure values?",
                maint_tp_tab_label: "Vehicle Label",
                maint_tp_tab_idrive: "BMW iDrive (23+)",
                maint_tp_tab_manual: "Manual",
                maint_tp_loc_door: "Door pillar",
                maint_tp_loc_fuel: "Fuel filler flap",
                maint_tp_loc_glove: "Glove compartment",
                maint_tp_idrive_h: "Check via BMW iDrive",
                maint_tp_idrive_menu: "MENU",
                maint_tp_idrive_myveh: "MY VEHICLE",
                maint_tp_idrive_status: "VEHICLE STATUS",
                maint_tp_idrive_tpms: "TIRE PRESSURE",
                maint_tp_idrive_desc: "Current and recommended pressure displayed",
                maint_tp_manual_h: "Vehicle Manual",
                maint_tp_manual_desc: "In the manual, you will find detailed tables with pressure values for various vehicle loads and tire sizes.",
                maint_tp_proc_h: "Checking and inflating procedure",
                maint_tp_proc_btn: "Show procedure",
                maint_tp_proc_1: "Measure on <span class=\"font-semibold\">cold tires</span> (before driving).",
                maint_tp_proc_2: "Unscrew the valve cap.",
                maint_tp_proc_3: "Firmly press the <span class=\"font-semibold\">pressure gauge</span> onto the valve and read the value.",
                maint_tp_proc_4: "Compare with the recommended value.",
                maint_tp_proc_5: "If necessary, <span class=\"font-semibold\">inflate</span> at an air compressor (e.g., at a gas station).",
                maint_tp_proc_6: "Screw the valve cap back on. Repeat for all 4 tires.",
                maint_tp_tip_h: "Tip: Help at a Shell station",
                maint_tp_tip_desc: "If you are unsure, the staff at Shell gas stations will gladly help you with checking and inflating."
            }
        };
        // --- Jazyk ---
        const langSkBtn = document.getElementById('lang-sk');
        const langEnBtn = document.getElementById('lang-en');
        let currentLang = 'sk';
        try { currentLang = localStorage.getItem('lang') || 'sk'; } catch(e) {}

        function setLanguage(lang) {
            currentLang = lang;
            try { localStorage.setItem('lang', lang); } catch(e) {}
            document.querySelectorAll('[data-translate-key]').forEach(el => {
                const key = el.dataset.translateKey;
                if (translations[lang] && translations[lang][key]) {
                    el.innerHTML = translations[lang][key];
                }
            });
            if(langSkBtn) langSkBtn.classList.toggle('active', lang === 'sk');
            if(langEnBtn) langEnBtn.classList.toggle('active', lang === 'en');
        }
        if(langSkBtn) langSkBtn.addEventListener('click', () => setLanguage('sk'));
        if(langEnBtn) langEnBtn.addEventListener('click', () => setLanguage('en'));
        setLanguage(currentLang);

        // --- Tmavý režim (Dark Mode) ---
        const themeToggleBtn = document.getElementById('theme-toggle');
        const applyTheme = (theme) => {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };
        let savedTheme = 'light';
        try { savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch(e) { savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
        applyTheme(savedTheme);
        if(themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                const isDarkMode = document.documentElement.classList.contains('dark');
                const newTheme = isDarkMode ? 'light' : 'dark';
                try { localStorage.setItem('theme', newTheme); } catch(e) {}
                applyTheme(newTheme);
            });
        }

        // --- Modály ---
        const modalBackdrop = document.getElementById('modal-backdrop');
        const modalContent = document.getElementById('modal-content');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const closeModalBtn = document.getElementById('close-modal-btn');
        let activeCard = null;

        const initModalInteractivity = (container) => {
            container.querySelectorAll('.accordion-header').forEach(header => {
                header.addEventListener('click', () => {
                    const content = header.nextElementSibling;
                    const icon = header.querySelector('span:last-child');
                    content.classList.toggle('hidden');
                    if (icon) icon.textContent = content.classList.contains('hidden') ? '+' : '-';
                });
            });
            const tabButtons = container.querySelectorAll('.tab-button');
            const tabContents = container.querySelectorAll('.tab-content');
            if (tabButtons.length > 0) {
                tabButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        tabButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        const tabId = button.getAttribute('data-tab');
                        tabContents.forEach(content => {
                            if (content.id === tabId) content.classList.add('active');
                            else content.classList.remove('active');
                        });
                    });
                });
            }
        };

        const openModal = (contentId, cardElement) => {
            log("openModal volaný pre: " + contentId);
            const contentElement = document.getElementById(contentId);
            if (contentElement) {
                log("Nájdený obsah pre: " + contentId);
                modalBody.innerHTML = '';
                modalBody.appendChild(contentElement.cloneNode(true));
                const titleElement = cardElement.querySelector('h3, span.font-semibold');
                modalTitle.textContent = titleElement ? titleElement.textContent.trim() : 'Informácie';
                modalBackdrop.classList.remove('hidden');
                modalContent.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                if (activeCard) activeCard.classList.remove('active-card');
                activeCard = cardElement;
                activeCard.classList.add('active-card');
                initModalInteractivity(modalBody);
            } else {
                log("CHYBA: Nenašiel sa obsah pre ID: " + contentId);
            }
        };

        const closeModal = () => {
            log("closeModal volaný");
            modalBackdrop.classList.add('hidden');
            modalContent.classList.add('hidden');
            document.body.style.overflow = '';
            if (activeCard) { activeCard.classList.remove('active-card'); activeCard = null; }
        };

        const cards = document.querySelectorAll('.nav-card, .quick-action-btn');
        log("Počet kariet v DOM: " + cards.length);
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const contentId = card.dataset.contentId;
                log("Klik na kartu s ID: " + contentId);
                if (contentId) openModal(contentId, card);
            });
        });
        if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if(modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
        
        modalBody.addEventListener('click', (event) => {
            const target = event.target.closest('[data-internal-link]');
            if (target) {
                const newContentId = target.dataset.internalLink;
                const newCard = document.querySelector(`[data-content-id="${newContentId}"]`);
                if (newCard) openModal(newContentId, newCard);
            }
        });

        // --- QR Kód ---
        const qrBtn = document.getElementById('qr-btn');
        const qrModalBackdrop = document.getElementById('qr-modal-backdrop');
        const qrModalContent = document.getElementById('qr-modal-content');
        const closeQrBtn = document.getElementById('close-qr-btn');
        let qrCodeGenerated = false;
        if(qrBtn) {
            qrBtn.addEventListener('click', () => {
                if(qrModalBackdrop) qrModalBackdrop.classList.remove('hidden');
                if(qrModalContent) qrModalContent.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                if (!qrCodeGenerated && typeof QRCode !== 'undefined') {
                    try {
                        new QRCode(document.getElementById("qrcode"), {
                            text: window.location.href,
                            width: 200,
                            height: 200,
                            colorDark : "#0050AA",
                            colorLight : "#ffffff",
                            correctLevel : QRCode.CorrectLevel.H
                        });
                        qrCodeGenerated = true;
                    } catch(e) {}
                }
            });
        }
        const closeQrModal = () => {
            if(qrModalBackdrop) qrModalBackdrop.classList.add('hidden');
            if(qrModalContent) qrModalContent.classList.add('hidden');
            document.body.style.overflow = '';
        };
        if(closeQrBtn) closeQrBtn.addEventListener('click', closeQrModal);
        if(qrModalBackdrop) qrModalBackdrop.addEventListener('click', closeQrModal);
    });
    

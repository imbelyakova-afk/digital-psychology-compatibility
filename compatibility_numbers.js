const VERSION = "5.0";
const HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
const reply = (data, status = 200) => new Response(JSON.stringify(data), {status, headers: HEADERS});

function reduceNumber(value) {
  let n = Math.abs(Number(value) || 0);
  while (n > 9) n = String(n).split("").reduce((s, d) => s + Number(d), 0);
  return n;
}
function digitsSum(value) {
  return String(value).replace(/\D/g, "").split("").reduce((s, d) => s + Number(d), 0);
}
function parseDate(value) {
  if (typeof value !== "string") return null;
  const m = value.match(/(?:^|\D)(\d{1,2})[./-](\d{1,2})[./-](\d{4})(?!\d)/);
  if (!m) return null;
  const day = +m[1], month = +m[2], year = +m[3];
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (year < 1900 || year > 2100 || dt.getUTCFullYear() !== year ||
      dt.getUTCMonth() !== month - 1 || dt.getUTCDate() !== day) return null;
  const date = `${String(day).padStart(2,"0")}.${String(month).padStart(2,"0")}.${year}`;
  const consciousness = reduceNumber(day);
  const realization = reduceNumber(digitsSum(`${String(day).padStart(2,"0")}${String(month).padStart(2,"0")}${year}`));
  const mission = reduceNumber(consciousness + realization);
  const finalNumber = reduceNumber(consciousness + realization + mission);
  return {date, day, month, year, consciousness, realization, mission, finalNumber};
}
function strings(value, out = [], depth = 0) {
  if (depth > 10 || value == null) return out;
  if (typeof value === "string" || typeof value === "number") out.push(String(value));
  else if (Array.isArray(value)) for (const v of value) strings(v, out, depth + 1);
  else if (typeof value === "object") for (const [k,v] of Object.entries(value)) {
    if (!/^(headers|cookies|token|secret|password|authorization)$/i.test(k)) strings(v, out, depth + 1);
  }
  return out;
}
function extractDates(payload, raw = "") {
  const sources = strings(payload);
  if (raw) sources.push(raw);
  const out = [], seen = new Set(), re = /(?:^|\D)(\d{1,2}[./-]\d{1,2}[./-]\d{4})(?!\d)/g;
  for (const s of sources) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(s))) {
      const d = parseDate(m[1]);
      if (d && !seen.has(d.date)) { seen.add(d.date); out.push(d); }
    }
  }
  return out;
}
const M = {
1:{title:"Лидерство и самостоятельность",plus:"Инициатива, внутренний стержень и готовность брать ответственность. В отношениях это помогает защищать союз, предлагать решения и двигаться к общим целям.",minus:"Самостоятельность может перейти в командование, нетерпение и борьбу за право быть главным. Каждый начинает доказывать свою правоту вместо поиска решения.",advice:"Распределяйте ответственность, обсуждайте решения на равных и признавайте право партнёра видеть ситуацию иначе."},
2:{title:"Партнёрство и чувствительность",plus:"Умение слышать другого, замечать настроение, проявлять деликатность и искать компромисс. Близость укрепляется благодаря эмоциональному контакту и поддержке.",minus:"Возможны обидчивость, зависимость от реакции партнёра, молчаливые ожидания и надежда, что другой сам догадается о потребностях.",advice:"Говорите о чувствах прямо, не проверяйте любовь молчанием и обозначайте границы без обвинений."},
3:{title:"Общение и эмоциональное оживление",plus:"Общительность, творчество, юмор и способность привносить в отношения радость. Совместные впечатления и открытые разговоры помогают сохранять интерес.",minus:"Разговоров может быть много, а понимания мало. Серьёзные темы иногда скрываются за шутками, а обещания остаются невыполненными.",advice:"Сочетайте лёгкость с надёжностью: обсуждайте сложные темы, выполняйте договорённости и выделяйте время для спокойного разговора."},
4:{title:"Стабильность и ответственность",plus:"Практичность, порядок и надёжность. Эти качества помогают создавать устойчивую основу, вести общий быт, планировать бюджет и достигать долгосрочных целей.",minus:"Стремление к порядку может стать жёсткостью, критикой и контролем. Отношения рискуют превратиться в список обязанностей.",advice:"Разделяйте ответственность и контроль. Сохраняйте договорённости, но оставляйте место отдыху, гибкости и спонтанности."},
5:{title:"Свобода и перемены",plus:"Гибкость, любознательность и потребность в развитии. Партнёры могут пробовать новое, поддерживать интересы друг друга и адаптироваться к переменам.",minus:"Возможны непостоянство, импульсивность, скука от рутины или уход от обязательств. Чрезмерные ограничения могут усиливать сопротивление.",advice:"Обсуждайте личное пространство и общие обязательства. Надёжность не должна означать однообразие."},
6:{title:"Забота и близость",plus:"Тепло, внимание, нежность и желание создавать комфорт. Забота особенно ценна, когда проявляется в ежедневных действиях и уважении к потребностям друг друга.",minus:"Забота может превратиться в опеку, ревность, завышенные ожидания или контроль. Один человек рискует брать всё на себя и копить усталость.",advice:"Спрашивайте, какая помощь нужна, не решайте за другого и распределяйте ответственность взаимно."},
7:{title:"Глубина и внутренний мир",plus:"Наблюдательность, размышление и стремление понять причины происходящего. Союз укрепляют доверие, честность и уважение к личному пространству.",minus:"Возможны закрытость, чрезмерный анализ и отдаление вместо разговора. Молчание одного партнёра другой может воспринимать как холодность.",advice:"Обозначайте потребность в уединении словами и возвращайтесь к разговору после паузы. Уточняйте, а не додумывайте."},
8:{title:"Сила и общие достижения",plus:"Организованность, амбиции и умение управлять ресурсами. Пара может объединять усилия, строить планы и решать практические задачи.",minus:"Возможна борьба за власть, деньги или признание. Работа и достижения могут вытеснить эмоциональную близость.",advice:"Обсуждайте финансы открыто, не измеряйте ценность человека доходом и принимайте решения без давления."},
9:{title:"Мудрость и принятие",plus:"Зрелость, сострадание и способность видеть ситуацию шире. Партнёры могут поддерживать развитие друг друга и не сводить отношения к мелким разногласиям.",minus:"Возможны отстранённость, идеализация, роль спасателя или долгое терпение с последующим резким отдалением.",advice:"Сочетайте принятие с ясными границами. Поддержка не означает, что нужно отвечать за все решения другого человека."}
};
const POS = {
consciousness:["Сознание пары","Первое впечатление, стиль общения и повседневные реакции."],
realization:["Реализация пары","Совместные действия, практические задачи, планы и распределение ответственности."],
mission:["Миссия пары","Общий вектор развития, ценности и долгосрочные ориентиры."],
finalNumber:["Итоговое число пары","Обобщённая тема союза, объединяющая взаимодействие, действия и развитие."]
};
function personReport(p,label) {
  const out=[`${label}: ${p.date}`,`Сознание: ${p.consciousness} — ${M[p.consciousness].title}`,`Реализация: ${p.realization} — ${M[p.realization].title}`,`Миссия: ${p.mission} — ${M[p.mission].title}`,`Итоговое число: ${p.finalNumber} — ${M[p.finalNumber].title}`];
  for (const [label,key] of [["Сознание","consciousness"],["Реализация","realization"],["Миссия","mission"]]) {
    const n=p[key], m=M[n]; out.push("",`${label} ${n}: ${m.title}`,`Сильные стороны: ${m.plus}`,`Возможные трудности: ${m.minus}`,`Совет: ${m.advice}`);
  }
  out.push("",`Итоговое число ${p.finalNumber}: ${M[p.finalNumber].advice}`);
  return out.join("\n");
}
function positionReport(key,n) {
  const [title,desc]=POS[key],m=M[n];
  return `${title}: ${n} — ${m.title}\n${desc}\nСильные стороны: ${m.plus}\nВозможные трудности: ${m.minus}\nПрактический совет: ${m.advice}`;
}
function combinationReport(title,a,b) {
  const n=reduceNumber(a+b),x=M[a],y=M[b],z=M[n];
  return `${title}\nЧисло партнёрши: ${a} — ${x.title}.\nЧисло партнёра: ${b} — ${y.title}.\nОбщее число сочетания: ${n} — ${z.title}.\nЧто может получаться хорошо: ${x.plus} ${y.plus}\nГде возможны разногласия: ${x.minus} ${y.minus}\nЧто поможет: ${z.advice}`;
}
function buildReport(woman,man) {
  const pair={
    consciousness:reduceNumber(woman.consciousness+man.consciousness),
    realization:reduceNumber(woman.realization+man.realization),
    mission:reduceNumber(woman.mission+man.mission)
  };
  pair.finalNumber=reduceNumber(pair.consciousness+pair.realization+pair.mission);
  const text=[
    "🔮 РАСШИРЕННЫЙ РАЗБОР СОВМЕСТИМОСТИ","",
    `Партнёрша: ${woman.date}`,`Партнёр: ${man.date}`,"",
    "ЛИЧНЫЕ ЧИСЛА ПАРТНЁРОВ","",personReport(woman,"ПАРТНЁРША"),"",personReport(man,"ПАРТНЁР"),"",
    "ЧЕТЫРЕ ЧИСЛА СОВМЕСТИМОСТИ","",
    positionReport("consciousness",pair.consciousness),"",
    positionReport("realization",pair.realization),"",
    positionReport("mission",pair.mission),"",
    positionReport("finalNumber",pair.finalNumber),"",
    "ТРИ ЛИЧНЫХ СОЧЕТАНИЯ","",
    combinationReport("1. Сочетание по сознанию",woman.consciousness,man.consciousness),"",
    combinationReport("2. Сочетание по реализации",woman.realization,man.realization),"",
    combinationReport("3. Сочетание по миссии",woman.mission,man.mission),"",
    "ОБЩИЙ ВЫВОД",
    `Итоговое число пары — ${pair.finalNumber}: ${M[pair.finalNumber].title}.`,
    `Главный ресурс союза: ${M[pair.finalNumber].plus}`,
    `Главный риск: ${M[pair.finalNumber].minus}`,
    `Рекомендация: ${M[pair.finalNumber].advice}`,"",
    "Это символическая нумерологическая интерпретация, а не объективный прогноз. Реальные отношения зависят от поступков, ценностей, обстоятельств, безопасности и способности людей договариваться."
  ].join("\n");
  return {text,pair,people:{woman,man}};
}

export default {
  async fetch(request) {
    if (request.method==="OPTIONS") return new Response(null,{status:204,headers:HEADERS});
    if (!["GET","POST"].includes(request.method)) {
      const t="Используйте GET или POST.";
      return reply({ok:false,version:VERSION,error:t,text:t},405);
    }
    let rawBody="",payload={};
    try {
      if (request.method==="GET") {
        const url=new URL(request.url);
        const text=url.searchParams.get("text")||url.searchParams.get("message")||url.searchParams.get("date")||"";
        if (!text) return reply({ok:true,version:VERSION,service:"digital-psychology-compatibility",method:"GET",message:"Worker работает. Для расчёта отправьте POST JSON: {\"text\":\"09.06.1979 29.11.1974\"}."});
        payload={text};
      } else {
        rawBody=await request.text();
        if (rawBody.trim()) {
          try { payload=JSON.parse(rawBody); }
          catch { payload={text:rawBody}; }
        }
      }
      const dates=extractDates(payload,rawBody);
      if (dates.length<2) {
        const t="Не удалось найти две даты рождения. Отправьте обе даты в одном сообщении, например: 09.06.1979 29.11.1974.";
        return reply({ok:false,version:VERSION,error:t,text:t,method:request.method,contentType:request.headers.get("content-type")||"",receivedKeys:payload&&typeof payload==="object"?Object.keys(payload):[],rawBodyLength:rawBody.length,receivedPreview:rawBody.slice(0,300)},400);
      }
      const result=buildReport(dates[0],dates[1]);
      return reply({ok:true,version:VERSION,text:result.text,pair:result.pair,people:result.people,method:request.method,datesFound:dates.slice(0,2).map(d=>d.date)});
    } catch (error) {
      const t=`Ошибка при расчёте: ${String(error?.message||error)}`;
      return reply({ok:false,version:VERSION,error:t,text:t},500);
    }
  }
};

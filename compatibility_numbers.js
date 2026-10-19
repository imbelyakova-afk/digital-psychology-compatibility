const VERSION = "4.0";

const jsonResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });

function reduceNumber(value) {
  let n = Math.abs(Number(value) || 0);

  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }

  return n;
}

function digitsSum(value) {
  return String(value)
    .replace(/\D/g, "")
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

function parseDate(value) {
  if (typeof value !== "string") return null;

  const match = value.match(
    /(?:^|\D)(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})(?!\d)/
  );

  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    year < 1900 ||
    year > 2100
  ) {
    return null;
  }

  const normalized =
    String(day).padStart(2, "0") + "." +
    String(month).padStart(2, "0") + "." +
    String(year);

  const consciousness = reduceNumber(day);
  const realization = reduceNumber(digitsSum(normalized));
  const mission = reduceNumber(consciousness + realization);
  const finalNumber = reduceNumber(
    consciousness + realization + mission
  );

  return {
    date: normalized,
    day,
    month,
    year,
    consciousness,
    realization,
    mission,
    finalNumber
  };
}

function findDatesInText(value) {
  if (typeof value !== "string") return [];

  const pattern =
    /(?:^|\D)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{4})(?!\d)/g;

  const found = [];
  let match;

  while ((match = pattern.exec(value)) !== null) {
    const parsed = parseDate(match[1]);

    if (parsed) found.push(parsed);
  }

  return found;
}

function collectTextValues(value, output = [], depth = 0) {
  if (depth > 8 || value == null) return output;

  if (typeof value === "string") {
    output.push(value);
    return output;
  }

  if (typeof value === "number") {
    output.push(String(value));
    return output;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectTextValues(item, output, depth + 1);
    }

    return output;
  }

  if (typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (/^(headers|cookies|token|secret|password)$/i.test(key)) {
        continue;
      }

      collectTextValues(item, output, depth + 1);
    }
  }

  return output;
}

function extractDates(payload, rawBody = "") {
  const sources = [];

  if (typeof payload === "string") {
    sources.push(payload);
  }

  if (payload && typeof payload === "object") {
    const preferredKeys = [
      "text",
      "message",
      "user_input",
      "user_reply",
      "reply",
      "input",
      "content",
      "body",
      "data",
      "query",
      "prompt",
      "date",
      "compatibility_dates"
    ];

    for (const key of preferredKeys) {
      if (payload[key] !== undefined) {
        sources.push(...collectTextValues(payload[key]));
      }
    }

    sources.push(...collectTextValues(payload));
  }

  if (rawBody) sources.push(rawBody);

  const dates = [];
  const seen = new Set();

  for (const source of sources) {
    for (const item of findDatesInText(source)) {
      if (!seen.has(item.date)) {
        seen.add(item.date);
        dates.push(item);
      }
    }
  }

  return dates;
}

const NUMBER_MEANINGS = {
  1: {
    title: "Лидерство и самостоятельность",
    plus: "Единица символизирует инициативу, внутренний стержень, самостоятельность и способность начинать новое. В плюсе человек берёт ответственность, предлагает решения, умеет вдохновлять и не боится двигаться вперёд. В отношениях это может проявляться как готовность защищать пару, принимать решения и преодолевать трудности вместе.",
    minus: "В минусе самостоятельность превращается в стремление командовать, настаивать на своём и считать собственный взгляд единственно верным. Возможны нетерпение, соперничество за лидерство, обида на критику и трудность признать ошибку. Партнёры могут бороться не за решение проблемы, а за право быть главным.",
    advice: "Полезно заранее договариваться, кто за что отвечает, и не превращать разногласия в соревнование. Сильная позиция каждого не мешает союзу, если решения принимаются с уважением к обоим."
  },

  2: {
    title: "Партнёрство и чувствительность",
    plus: "Двойка связана с умением слышать другого, замечать настроение, искать компромисс и создавать ощущение близости. В плюсе партнёры проявляют деликатность, заботятся о душевном комфорте, умеют поддерживать и договариваться без давления. Это число напоминает, что отношения строятся не только на поступках, но и на эмоциональном контакте.",
    minus: "В минусе чувствительность может переходить в обидчивость, зависимость от реакции партнёра, сомнения и ожидание, что другой сам догадается о потребностях. Вместо прямого разговора могут появляться молчание, намёки и накопленные претензии. Стремление избежать конфликта иногда мешает обсуждать важное.",
    advice: "Нужно говорить о чувствах и желаниях прямо, не проверять любовь молчанием и не требовать чтения мыслей. Компромисс полезен тогда, когда оба человека могут честно обозначить собственные границы."
  },

  3: {
    title: "Общение и эмоциональное оживление",
    plus: "Тройка символизирует общительность, лёгкость, творческое мышление и способность привносить в отношения радость. В плюсе партнёры умеют разговаривать, шутить, придумывать совместные занятия и поддерживать интерес друг к другу. Союз получает энергию через новые впечатления, открытость и возможность выражать себя.",
    minus: "В минусе разговоров может быть много, а реального понимания — мало. Серьёзные темы иногда заменяются шутками, обещания остаются без выполнения, а эмоциональные реакции становятся слишком резкими. Есть риск искать постоянных впечатлений, избегая спокойной повседневной работы над отношениями.",
    advice: "Важно сочетать лёгкость с надёжностью: обсуждать не только приятное, но и сложное, выполнять договорённости и выделять время для спокойного разговора без отвлечений."
  },

  4: {
    title: "Стабильность и ответственность",
    plus: "Четвёрка связана с практичностью, порядком, надёжностью и умением создавать устойчивую основу. В плюсе партнёры способны планировать бюджет, распределять обязанности, поддерживать друг друга в бытовых вопросах и последовательно двигаться к общим целям. Чувство безопасности укрепляется благодаря понятным действиям и выполненным обещаниям.",
    minus: "В минусе стремление к порядку становится жёсткостью, критикой и попыткой контролировать каждую мелочь. Отношения могут превратиться в список обязанностей, где мало спонтанности и тепла. Один партнёр рискует занять позицию проверяющего, а второй — чувствовать, что его постоянно оценивают.",
    advice: "Полезно разделять ответственность и контроль. Сохраняйте договорённости, но оставляйте место отдыху, гибкости и разным способам решать одну и ту же задачу."
  },

  5: {
    title: "Свобода и перемены",
    plus: "Пятёрка символизирует движение, любознательность, гибкость и потребность в развитии. В плюсе отношения не застывают: партнёры пробуют новое, поддерживают интересы друг друга, легче адаптируются к переменам и не боятся обновлять привычный уклад. Свобода помогает каждому сохранять индивидуальность внутри союза.",
    minus: "В минусе стремление к свободе может восприниматься как непостоянство, уход от обязательств или нежелание обсуждать последствия собственных решений. Возможны импульсивность, быстрое увлечение новыми идеями и скука при столкновении с рутиной. Попытка ограничить партнёра, в свою очередь, усиливает сопротивление.",
    advice: "Стоит заранее обсуждать границы личной свободы, верность договорённостям и общие планы. Устойчивость не обязана означать однообразие: отношениям полезны и надёжность, и новые впечатления."
  },

  6: {
    title: "Забота и близость",
    plus: "Шестёрка связана с теплом, вниманием, семейностью и желанием создавать комфорт. В плюсе партнёры замечают потребности друг друга, готовы помогать, проявляют нежность и вместе создают уютное пространство. Забота выражается не только в словах, но и в ежедневных действиях, которые дают ощущение принятия.",
    minus: "В минусе забота может превратиться в опеку, ревность, чрезмерные ожидания и попытку решать за другого. Иногда помощь становится способом получить признание или контролировать ситуацию. Один партнёр может брать на себя слишком много, а затем испытывать усталость и скрытую обиду.",
    advice: "Важно спрашивать, какая помощь действительно нужна, и не подменять заботой контроль. Ответственность за отношения должна быть общей, а личное пространство и собственные интересы — сохраняться."
  },

  7: {
    title: "Глубина и внутренний мир",
    plus: "Семёрка символизирует размышление, наблюдательность, стремление понять причины происходящего и потребность в содержательной близости. В плюсе партнёры способны обсуждать важные вопросы, уважать личное пространство и поддерживать друг друга в поиске смысла. Связь укрепляется через доверие, честность и готовность смотреть глубже поверхностных реакций.",
    minus: "В минусе появляется закрытость, чрезмерный анализ, подозрительность или привычка отдаляться вместо разговора. Один партнёр может воспринимать молчание как необходимость побыть одному, а другой — как холодность и отвержение. Попытки угадать скрытый смысл поведения создают лишнее напряжение.",
    advice: "Нужно обозначать потребность в уединении словами и возвращаться к разговору после паузы. Не стоит делать выводы за партнёра: спокойные уточняющие вопросы помогают отличить реальные проблемы от предположений."
  },

  8: {
    title: "Сила и общие достижения",
    plus: "Восьмёрка связана с организованностью, амбициями, управлением ресурсами и способностью добиваться результатов. В плюсе пара может объединять усилия, строить планы, поддерживать карьерные цели и вместе решать финансовые или практические задачи. Важным ресурсом становятся дисциплина, взаимное уважение и умение действовать как команда.",
    minus: "В минусе отношения могут превратиться в борьбу за власть, деньги, влияние или признание. Возникает соблазн оценивать вклад партнёра только по результатам, давить авторитетом или использовать материальную зависимость как аргумент. Работа и достижения способны вытеснить эмоциональную близость.",
    advice: "Следует обсуждать финансы и ответственность открыто, не измерять ценность человека его доходом и не решать спор силой. Общая цель должна объединять партнёров, а не становиться инструментом контроля."
  },

  9: {
    title: "Мудрость и принятие",
    plus: "Девятка символизирует зрелость, сострадание, широту взгляда и способность видеть ситуацию в более широком контексте. В плюсе партнёры умеют прощать ошибки, поддерживать развитие друг друга и не сводить отношения к мелким бытовым разногласиям. Союз может укрепляться через общие ценности, щедрость и уважение к жизненному опыту каждого.",
    minus: "В минусе возможны эмоциональная отстранённость, завышенные ожидания, позиция спасателя или убеждение, что партнёр должен измениться ради идеала. Иногда человек слишком долго терпит, а затем резко отдаляется. Желание быть мудрым может мешать признать собственную боль и потребность в поддержке.",
    advice: "Важно сочетать принятие с конкретными границами. Прощение не означает согласие на повторяющееся неуважение, а поддержка не требует брать на себя ответственность за все решения другого человека."
  }
};

const POSITION_INFO = {
  consciousness: {
    title: "Сознание пары",
    meaning: "первое впечатление, стиль общения, повседневные реакции и то, как партнёры проявляют себя рядом друг с другом"
  },
  realization: {
    title: "Реализация пары",
    meaning: "совместные действия, практические задачи, планы, распределение ответственности и способность воплощать намерения в жизнь"
  },
  mission: {
    title: "Миссия пары",
    meaning: "общий вектор развития, ценности, долгосрочные ориентиры и темы, вокруг которых может складываться совместный путь"
  },
  finalNumber: {
    title: "Итоговое число пары",
    meaning: "обобщённая тема союза, объединяющая способы взаимодействия, совместные действия и общий вектор развития"
  }
};

function positionDescription(position, number) {
  const info = POSITION_INFO[position];
  const meaning = NUMBER_MEANINGS[number];

  return [
    `${info.title}: ${number} — ${meaning.title}.`,
    "",
    `Что показывает эта позиция: ${info.meaning}.`,
    "",
    `Сильные стороны: ${meaning.plus}`,
    "",
    `Возможные трудности: ${meaning.minus}`,
    "",
    `Рекомендации: ${meaning.advice}`
  ].join("\n");
}

function personDescription(person, label) {
  return [
    `${label}: ${person.date}`,
    `Сознание — ${person.consciousness}; реализация — ${person.realization}; миссия — ${person.mission}; итоговое число — ${person.finalNumber}.`,
    "",
    `Сознание ${person.consciousness}: ${NUMBER_MEANINGS[person.consciousness].title}. ${NUMBER_MEANINGS[person.consciousness].plus}`,
    "",
    `Реализация ${person.realization}: ${NUMBER_MEANINGS[person.realization].title}. ${NUMBER_MEANINGS[person.realization].plus}`,
    "",
    `Миссия ${person.mission}: ${NUMBER_MEANINGS[person.mission].title}. ${NUMBER_MEANINGS[person.mission].plus}`,
    "",
    `Итоговое число ${person.finalNumber}: ${NUMBER_MEANINGS[person.finalNumber].title}. ${NUMBER_MEANINGS[person.finalNumber].advice}`
  ].join("\n");
}

function combinationDescription(title, womanNumber, manNumber) {
  const woman = NUMBER_MEANINGS[womanNumber];
  const man = NUMBER_MEANINGS[manNumber];

  const pairNumber = reduceNumber(womanNumber + manNumber);
  const pair = NUMBER_MEANINGS[pairNumber];

  return [
    title,
    `Число партнёрши: ${womanNumber} — ${woman.title}.`,
    `Число партнёра: ${manNumber} — ${man.title}.`,
    `Общее число сочетания: ${pairNumber} — ${pair.title}.`,
    "",
    `Как это может проявляться: ${woman.plus} ${man.plus}`,
    "",
    `Где возможны разногласия: ${woman.minus} ${man.minus}`,
    "",
    `Что поможет паре: ${pair.advice}`
  ].join("\n");
}

function overallConclusion(pair) {
  const numbers = [
    ["Сознание пары", pair.consciousness],
    ["Реализация пары", pair.realization],
    ["Миссия пары", pair.mission],
    ["Итоговое число", pair.finalNumber]
  ];

  const strengths = numbers.map(([title, number]) =>
    `${title} (${number}): ${NUMBER_MEANINGS[number].title}.`
  );

  const advice = numbers.map(([title, number]) =>
    `${title}: ${NUMBER_MEANINGS[number].advice}`
  );

  return [
    "ОБЩИЙ ВЫВОД",
    "",
    `В этой системе расчёта итоговое число пары — ${pair.finalNumber}. Оно связано с темой «${NUMBER_MEANINGS[pair.finalNumber].title.toLowerCase()}». Это символическая интерпретация чисел, а не объективный прогноз отношений.`,
    "",
    "Ключевые темы союза:",
    ...strengths.map(item => `• ${item}`),
    "",
    "На что обратить внимание:",
    ...numbers.map(([title, number]) =>
      `• ${title}: ${NUMBER_MEANINGS[number].minus}`
    ),
    "",
    "Практические шаги:",
    ...advice.map(item => `• ${item}`),
    "",
    "Совместимость не определяется одним числом. На отношения влияют поведение людей, их ценности, обстоятельства, умение договариваться и готовность учитывать потребности друг друга. Используйте этот разбор как повод для открытого разговора, а не как окончательный вердикт о будущем пары."
  ].join("\n");
}

function buildText(woman, man) {
  const pair = {
    consciousness: reduceNumber(
      woman.consciousness + man.consciousness
    ),
    realization: reduceNumber(
      woman.realization + man.realization
    ),
    mission: reduceNumber(
      woman.mission + man.mission
    )
  };

  pair.finalNumber = reduceNumber(
    pair.consciousness +
    pair.realization +
    pair.mission
  );

  const sections = [
    "РАСШИРЕННЫЙ РАЗБОР СОВМЕСТИМОСТИ",
    "",
    "Даты рождения:",
    `Партнёрша: ${woman.date}`,
    `Партнёр: ${man.date}`,
    "",
    "ЛИЧНЫЕ ЧИСЛА ПАРТНЁРОВ",
    "",
    personDescription(woman, "Партнёрша"),
    "",
    personDescription(man, "Партнёр"),
    "",
    "ЧЕТЫРЕ ЧИСЛА СОВМЕСТИМОСТИ",
    "",
    positionDescription("consciousness", pair.consciousness),
    "",
    positionDescription("realization", pair.realization),
    "",
    positionDescription("mission", pair.mission),
    "",
    positionDescription("finalNumber", pair.finalNumber),
    "",
    "ТРИ ЛИЧНЫХ СОЧЕТАНИЯ",
    "",
    combinationDescription(
      "1. Сочетание по сознанию",
      woman.consciousness,
      man.consciousness
    ),
    "",
    combinationDescription(
      "2. Сочетание по реализации",
      woman.realization,
      man.realization
    ),
    "",
    combinationDescription(
      "3. Сочетание по миссии",
      woman.mission,
      man.mission
    ),
    "",
    overallConclusion(pair)
  ];

  return {
    text: sections.join("\n"),
    pair,
    people: { woman, man }
  };
}

export default {
  async fetch(request) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    if (!["GET", "POST"].includes(request.method)) {
      return jsonResponse({
        ok: false,
        version: VERSION,
        error: "Используйте GET или POST для передачи дат рождения."
      }, 405);
    }

    let rawBody = "";
    let payload = {};

    try {
      if (request.method === "GET") {
        const url = new URL(request.url);

        payload = {
          text:
            url.searchParams.get("text") ||
            url.searchParams.get("message") ||
            url.searchParams.get("date") ||
            ""
        };
      } else {
        rawBody = await request.text();

        if (rawBody.trim()) {
          try {
            payload = JSON.parse(rawBody);
          } catch {
            payload = rawBody;
          }
        }
      }

      const dates = extractDates(payload, rawBody);

      if (dates.length < 2) {
        return jsonResponse({
          ok: false,
          version: VERSION,
          error:
            "Не удалось найти две даты рождения. " +
            "Передайте их в формате ДД.ММ.ГГГГ, " +
            "например: 09.06.1979 и 29.11.1974.",
          received: payload,
          rawBody,
          method: request.method
        }, 400);
      }

      const woman = dates[0];
      const man = dates[1];
      const report = buildText(woman, man);

      return jsonResponse({
        ok: true,
        version: VERSION,
        text: report.text,
        pair: report.pair,
        people: report.people
      });
    } catch (error) {
      return jsonResponse({
        ok: false,
        version: VERSION,
        error: "Ошибка при расчёте совместимости.",
        details: String(error?.message || error)
      }, 500);
    }
  }
};

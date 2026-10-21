const VERSION = "7.0";

const HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function reply(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: HEADERS
  });
}

function reduceNumber(value) {
  let n = Math.abs(Number(value) || 0);

  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }

  return n;
}

function parseDate(value) {
  const match = String(value || "").match(
    /^\s*(\d{2})\.(\d{2})\.(\d{4})\s*$/
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
    year < 1
  ) {
    return null;
  }

  return {
    formatted: `${match[1]}.${match[2]}.${match[3]}`,
    day,
    month,
    year
  };
}

function extractDates(value) {
  return String(value || "").match(
    /\b\d{2}\.\d{2}\.\d{4}\b/g
  ) || [];
}

function getNumbers(dateText) {
  const date = parseDate(dateText);

  if (!date) {
    throw new Error(
      `Некорректная дата: ${dateText}. Используйте ДД.ММ.ГГГГ.`
    );
  }

  const { day, month, year } = date;
  const consciousness = reduceNumber(day);

  const sum = (
    String(day) +
    String(month).padStart(2, "0") +
    String(year)
  )
    .split("")
    .reduce((total, digit) => total + Number(digit), 0);

  const realization = reduceNumber(sum);
  const mission = reduceNumber(consciousness + realization);
  const final = reduceNumber(
    consciousness + realization + mission
  );

  return {
    consciousness,
    realization,
    mission,
    final
  };
}

function calculate(womanDateText, manDateText) {
  const womanDate = parseDate(womanDateText);
  const manDate = parseDate(manDateText);

  if (!womanDate || !manDate) {
    throw new Error(
      "Нужно передать две корректные даты в формате ДД.ММ.ГГГГ."
    );
  }

  const woman = getNumbers(womanDate.formatted);
  const man = getNumbers(manDate.formatted);

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

  pair.final = reduceNumber(
    pair.consciousness +
    pair.realization +
    pair.mission
  );

  return {
    dates: {
      woman: womanDate.formatted,
      man: manDate.formatted
    },
    pair,
    individual: { woman, man }
  };
}

const MEANINGS = {
  1: {
    title: "Лидерство и самостоятельность",
    plus: "Пара может вдохновлять друг друга, проявлять инициативу и вместе двигаться к целям.",
    minus: "Возможны борьба за лидерство, соперничество и стремление навязать собственное решение.",
    advice: "Распределяйте ответственность, обсуждайте решения и уважайте самостоятельность партнёра."
  },
  2: {
    title: "Партнёрство и чувствительность",
    plus: "Важными сильными сторонами могут стать забота, эмоциональная близость и умение слышать друг друга.",
    minus: "Недосказанность, обиды и ожидание, что партнёр сам догадается о потребностях, могут создавать напряжение.",
    advice: "Говорите о чувствах прямо и спокойно. Обсуждайте потребности и не бойтесь уважительных разногласий."
  },
  3: {
    title: "Общение и эмоциональное оживление",
    plus: "Юмор, разговоры и совместные впечатления помогают поддерживать интерес и ощущение близости.",
    minus: "Серьёзные вопросы могут откладываться, а разговоры — не приводить к реальному пониманию.",
    advice: "Больше слушайте друг друга и обсуждайте непростые темы без ухода от разговора."
  },
  4: {
    title: "Стабильность и ответственность",
    plus: "Пара может строить надёжные отношения, планировать будущее и справедливо распределять обязанности.",
    minus: "Рутина, чрезмерный контроль и споры о бытовых вопросах могут вытеснять нежность.",
    advice: "Договаривайтесь об обязанностях, благодарите друг друга и оставляйте место отдыху и спонтанности."
  },
  5: {
    title: "Свобода и перемены",
    plus: "Совместное развитие, новые впечатления и уважение личной свободы могут оживлять отношения.",
    minus: "Неопределённость и разные потребности в стабильности могут приводить к недоверию.",
    advice: "Обсуждайте границы свободы, предупреждайте об изменениях планов и создавайте общие традиции."
  },
  6: {
    title: "Забота и близость",
    plus: "Нежность, поддержка и желание заботиться друг о друге могут укреплять эмоциональную связь.",
    minus: "Забота иногда превращается в контроль, чрезмерную опеку или ожидание благодарности.",
    advice: "Уточняйте, какая помощь нужна, открыто говорите о своих потребностях и сохраняйте личные интересы."
  },
  7: {
    title: "Глубина и внутренний мир",
    plus: "Доверие, вдумчивое общение и уважение личного пространства помогают лучше понимать друг друга.",
    minus: "Молчание и замкнутость могут восприниматься как холодность или отвержение.",
    advice: "Объясняйте потребность в уединении и договаривайтесь, когда вернётесь к важному разговору."
  },
  8: {
    title: "Сила и общие достижения",
    plus: "Пара может объединять усилия, поддерживать цели друг друга и совместно решать практические задачи.",
    minus: "Соперничество, борьба за влияние и разногласия о деньгах могут мешать близости.",
    advice: "Обсуждайте общие цели и финансы, признавайте вклад каждого и находите время не только для дел."
  },
  9: {
    title: "Мудрость и принятие",
    plus: "Отношения могут помогать развивать терпение, понимание различий и способность учиться на опыте.",
    minus: "Отстранённость, непрошеные советы или терпимость к нарушению личных границ могут создавать трудности.",
    advice: "Старайтесь понимать партнёра, сохраняя собственные границы. Обсуждайте конкретные проблемы и договорённости."
  }
};

const POSITIONS = [
  {
    key: "consciousness",
    title: "1. СОЗНАНИЕ ПАРЫ",
    description: "Первое впечатление, повседневное общение и эмоциональные реакции."
  },
  {
    key: "realization",
    title: "2. РЕАЛИЗАЦИЯ ПАРЫ",
    description: "Совместные действия, бытовые задачи, ответственность и общие планы."
  },
  {
    key: "mission",
    title: "3. МИССИЯ ПАРЫ",
    description: "Общий вектор развития, ценности и направления совместного роста."
  },
  {
    key: "final",
    title: "4. ИТОГОВОЕ ЧИСЛО ПАРЫ",
    description: "Обобщённая тема союза и возможные уроки, которые партнёры могут извлечь из отношений."
  }
];

function buildReport(calculation) {
  const sections = POSITIONS.map(position => {
    const number = calculation.pair[position.key];
    const meaning = MEANINGS[number];

    return [
      position.title,
      "",
      `Число: ${number} — ${meaning.title}`,
      "",
      "Что означает эта позиция:",
      position.description,
      "",
      "СИЛЬНЫЕ СТОРОНЫ",
      meaning.plus,
      "",
      "ВОЗМОЖНЫЕ ТРУДНОСТИ",
      meaning.minus,
      "",
      "ПРАКТИЧЕСКИЕ РЕКОМЕНДАЦИИ",
      meaning.advice
    ].join("\n");
  });

  const text = [
    "🔮 ПОДРОБНАЯ РАСШИФРОВКА СОВМЕСТИМОСТИ",
    "",
    `Дата женщины: ${calculation.dates.woman}`,
    `Дата мужчины: ${calculation.dates.man}`,
    "",
    `Сознание: ${calculation.pair.consciousness}`,
    `Реализация: ${calculation.pair.realization}`,
    `Миссия: ${calculation.pair.mission}`,
    `Итог: ${calculation.pair.final}`,
    "",
    "Эта расшифровка — повод осмыслить взаимодействие, а не неизменный прогноз отношений.",
    "",
    "════════════════════════",
    "",
    ...sections.flatMap(section => [
      section,
      "",
      "════════════════════════",
      ""
    ]),
    "ОБЩИЙ ВЫВОД",
    "",
    `В вашей паре представлены темы: ${POSITIONS.map(p => MEANINGS[calculation.pair[p.key]].title).join(", ")}.`,
    "",
    "Используйте сильные стороны пары как опору, а возможные трудности — как повод для честного разговора. Ваши реальные решения, уважение и взаимная забота важнее любого числового описания."
  ].join("\n");

  return { text };
}

function getRequestData(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Ожидается JSON-объект с данными расчёта.");
  }

  // 1. Если переданы даты, используем их.
  const womanDate =
    body.womanDate ?? body.woman_date ?? body.woman;
  const manDate =
    body.manDate ?? body.man_date ?? body.man;

  if (womanDate && manDate) {
    return calculate(womanDate, manDate);
  }

  // 2. Проверяем готовые числа в разных форматах.
  const sources = [
    body.pair,
    body.variable_set,
    body.numbers,
    body
  ];

  for (const source of sources) {
    if (!source || typeof source !== "object") continue;

    const consciousness = Number(source.consciousness);
    const realization = Number(source.realization);
    const mission = Number(source.mission);
    const finalNumber = Number(
      source.finalNumber ?? source.final_number ?? source.final
    );

    if (
      [consciousness, realization, mission, finalNumber].every(
        n => Number.isInteger(n) && n >= 1 && n <= 9
      )
    ) {
      return {
        dates: {
          woman: body.dates?.woman ?? "Не указана",
          man: body.dates?.man ?? "Не указана"
        },
        pair: {
          consciousness,
          realization,
          mission,
          final: finalNumber
        },
        individual: null
      };
    }
  }

  // 3. Ищем текст первого API в известных полях.
  const textParts = [
    body.text,
    body.api_result,
    body.apiResult,
    body.result,
    body.message,
    body.user_reply
  ];

  for (const part of textParts) {
    if (typeof part !== "string") continue;

    // Если текст содержит две даты, используем их.
    const dates = extractDates(part);

    if (dates.length === 2) {
      return calculate(dates[0], dates[1]);
    }

    // Иначе извлекаем четыре числа по названиям.
    function getValue(labels) {
      for (const label of labels) {
        const pattern = new RegExp(
          "(?:^|\\n)\\s*" + label +
          "\\s*[:：-]\\s*([1-9])\\b",
          "i"
        );
        const match = part.match(pattern);
        if (match) return Number(match[1]);
      }
      return null;
    }

    const consciousness = getValue(["Сознание", "consciousness"]);
    const realization = getValue(["Реализация", "realization"]);
    const mission = getValue(["Миссия", "mission"]);
    const finalNumber = getValue(["Итог", "finalNumber", "final"]);

    if (
      [consciousness, realization, mission, finalNumber].every(
        n => Number.isInteger(n) && n >= 1 && n <= 9
      )
    ) {
      return {
        dates: {
          woman: "Не указана",
          man: "Не указана"
        },
        pair: {
          consciousness,
          realization,
          mission,
          final: finalNumber
        },
        individual: null
      };
    }

    // Если текст содержит JSON, проверяем вложенные данные.
    try {
      const parsed = JSON.parse(part);

      if (parsed && typeof parsed === "object") {
        const nested = getRequestData(parsed);
        if (nested) return nested;
      }
    } catch (_) {
      // Обычный текст не является JSON — продолжаем поиск.
    }
  }

  throw new Error(
    "Не получены данные первого расчёта. Проверьте, что второй API получает текст или объект с четырьмя числами."
  );
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: HEADERS
      });
    }

    if (request.method === "GET") {
      return reply({
        ok: true,
        service: "compatibility-calculator-decoding",
        version: VERSION,
        message: "API готов. Отправьте POST JSON с датами, четырьмя числами или текстом первого расчёта."
      });
    }

    if (request.method !== "POST") {
      return reply({
        ok: false,
        version: VERSION,
        error: "Используйте POST."
      }, 405);
    }

    try {
      const body = await request.json();
      const calculation = getRequestData(body);
      const report = buildReport(calculation);

      return reply({
        ok: true,
        version: VERSION,
        text: report.text,
        dates: calculation.dates,
        pair: calculation.pair,
        individual: calculation.individual
      });
    } catch (error) {
      const message =
        error?.message || "Не удалось сформировать расшифровку.";

      return reply({
        ok: false,
        version: VERSION,
        error: message,
        text: message
      }, 400);
    }
  }
};

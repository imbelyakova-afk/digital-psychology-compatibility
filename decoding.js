const VERSION = "5.5";

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

const M = {
  1: {
    title: "Лидерство и самостоятельность",
    plus: "В этих отношениях важны инициатива, движение вперёд и возможность влиять на происходящее. Партнёры способны вдохновлять друг друга, поддерживать начинания и брать ответственность. В сильном проявлении это союз двух самостоятельных людей, которые выбирают быть вместе по собственному желанию.",
    minus: "Главная трудность — борьба за лидерство. Каждый может считать своё мнение правильнее, стремиться контролировать решения и доказывать свою правоту. Самостоятельность может восприниматься как холодность, а стремление руководить — как давление.",
    advice: "Разделяйте ответственность и заранее договаривайтесь, кто за что отвечает. Обсуждайте важные решения, поддерживайте цели друг друга и не превращайте разногласия в соревнование. Ищите решение, подходящее обоим."
  },

  2: {
    title: "Партнёрство и чувствительность",
    plus: "Для этой пары важны эмоциональная близость, внимание и ощущение, что партнёры слышат друг друга. Союз может строиться на тонком понимании настроения, заботе, доверии и готовности поддерживать в сложные моменты.",
    minus: "Чувствительность может приводить к обидам и недосказанности. Один партнёр может ждать, что другой сам догадается о его потребностях. Страх конфликта способен заставлять замалчивать недовольство и накапливать напряжение.",
    advice: "Говорите о чувствах прямо и спокойно. Объясняйте, что именно вас задело и какая поддержка нужна. Не избегайте всех разногласий любой ценой и уважайте личное пространство друг друга."
  },

  3: {
    title: "Общение и эмоциональное оживление",
    plus: "Отношения могут наполняться разговорами, юмором, совместными идеями и новыми впечатлениями. Общение помогает восстанавливать близость, поддерживать творческие начинания и делать повседневную жизнь насыщеннее.",
    minus: "Серьёзные вопросы могут откладываться, если партнёры заменяют откровенный разговор шутками или сменой темы. Можно много говорить, но не слышать друг друга по-настоящему.",
    advice: "Поддерживайте живое общение, но не избегайте непростых разговоров. Делитесь чувствами, внимательно слушайте ответы и создавайте совместные впечатления: прогулки, поездки и небольшие традиции."
  },

  4: {
    title: "Стабильность и ответственность",
    plus: "Для этой пары важны надёжность, предсказуемость и прочная основа отношений. Партнёры могут вместе планировать будущее, решать бытовые вопросы, распределять обязанности и создавать комфортную жизнь. Любовь часто выражается через конкретные действия, выполнение обещаний и взаимную поддержку.",
    minus: "Стремление к стабильности может сделать отношения слишком строгими и предсказуемыми. Партнёры рискуют сосредоточиться на обязанностях, забывая об эмоциональной близости. Возможны конфликты из-за денег, домашних дел, обещаний и разных представлений о порядке.",
    advice: "Заранее договаривайтесь об обязанностях и ожиданиях. Разделяйте ответственность справедливо, проявляйте нежность и благодарность, оставляйте место отдыху, спонтанности и новым впечатлениям."
  },

  5: {
    title: "Свобода и перемены",
    plus: "В этих отношениях важны развитие, движение и возможность открывать новое. Партнёры могут вдохновлять друг друга на путешествия, обучение, новые решения и расширение личных горизонтов. Союз сочетает близость с самостоятельностью, если оба уважают индивидуальность друг друга.",
    minus: "Потребность в свободе может конфликтовать с потребностью в стабильности. Необсуждённые изменения планов вызывают раздражение и недоверие. Возможны избегание обязательств, импульсивные решения и усталость от неопределённости.",
    advice: "Обсуждайте, какая свобода важна каждому и какие договорённости необходимы для доверия. Предупреждайте об изменениях планов, создавайте новые впечатления вместе и поддерживайте традиции, которые дают ощущение близости."
  },

  6: {
    title: "Забота и близость",
    plus: "В этой паре важны нежность, поддержка, домашний уют и желание быть рядом в сложные периоды. Партнёры могут создавать тёплую атмосферу, заботиться друг о друге и выстраивать семейные традиции. Союз способен давать чувство принадлежности и эмоциональной защищённости.",
    minus: "Забота может превратиться в контроль или чрезмерную опеку. Один партнёр может отдавать слишком много сил, забывать о собственных потребностях и затем испытывать усталость и обиду. Помощь иногда становится способом получить благодарность или управлять другим.",
    advice: "Спрашивайте, какая поддержка действительно нужна. Открыто говорите о своих потребностях, сохраняйте личные интересы и следите за равновесием между отдачей и получением. Заботьтесь друг о друге, не теряя себя."
  },

  7: {
    title: "Глубина и внутренний мир",
    plus: "Эти отношения могут строиться на доверии, глубоком внутреннем контакте и стремлении понять ценности и переживания партнёра. Близость проявляется в уважении к личному пространству, спокойном присутствии рядом и способности принимать особенности друг друга.",
    minus: "Потребность в уединении может восприниматься как холодность или отвержение. Партнёры могут замыкаться в себе, переживать трудности молча и додумывать причины поведения друг друга. Из-за этого возникает эмоциональная дистанция.",
    advice: "Уважайте потребность в личном пространстве, но не заменяйте им открытый разговор. Объясняйте, когда вам нужно побыть одному, и договаривайтесь, когда вернётесь к обсуждению. Проверяйте предположения вопросами."
  },

  8: {
    title: "Сила и общие достижения",
    plus: "Партнёры могут объединять усилия ради общих целей, поддерживать профессиональные начинания и создавать устойчивое будущее. Практичность, настойчивость и способность выдерживать нагрузку помогают преодолевать трудности и развиваться вместе.",
    minus: "Стремление к успеху может привести к соперничеству, борьбе за влияние и сравнению вкладов. Работа и материальные цели иногда вытесняют эмоциональную близость. Финансовые разногласия могут становиться причиной более глубоких конфликтов.",
    advice: "Обсуждайте общие цели, финансы и вклад каждого. Признавайте усилия друг друга, не сравнивайте доходы и статус. Находите время, когда можно не решать задачи, а просто быть вместе."
  },

  9: {
    title: "Мудрость и принятие",
    plus: "Эти отношения могут помогать развивать терпение, зрелость и способность принимать различия. Партнёры могут переосмысливать опыт, учиться понимать друг друга и проходить сложные периоды с большим уважением и состраданием.",
    minus: "Стремление к пониманию может превратиться в отстранённость или чрезмерную терпимость к болезненному поведению. Один партнёр может занять позицию наставника, давать непрошеные советы или игнорировать собственные границы ради сохранения мира.",
    advice: "Старайтесь понимать партнёра, не оправдывая автоматически любой поступок. Разделяйте принятие человека и согласие с его поведением. Обсуждайте проблемы конкретно, обозначайте границы и договаривайтесь об изменениях."
  }
};

const POS = {
  consciousness: [
    "1. СОЗНАНИЕ ПАРЫ",
    "Первое впечатление друг о друге, повседневное общение и эмоциональные реакции."
  ],
  realization: [
    "2. РЕАЛИЗАЦИЯ ПАРЫ",
    "Совместные действия, бытовые задачи, распределение ответственности и воплощение общих планов."
  ],
  mission: [
    "3. МИССИЯ ПАРЫ",
    "Общий вектор развития отношений, ценности и направления, в которых партнёры могут расти вместе."
  ],
  finalNumber: [
    "4. ИТОГОВОЕ ЧИСЛО ПАРЫ",
    "Обобщённая тема союза: что помогает отношениям укрепляться и чему партнёры могут научиться друг у друга."
  ]
};

function calculate(womanDateText, manDateText) {
  const womanDate = parseDate(womanDateText);
  const manDate = parseDate(manDateText);

  if (!womanDate || !manDate) {
    throw new Error(
      "Укажите две корректные даты в формате ДД.ММ.ГГГГ."
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

function buildReport(calculation) {
  const numbers = {
    consciousness: calculation.pair.consciousness,
    realization: calculation.pair.realization,
    mission: calculation.pair.mission,
    finalNumber: calculation.pair.final
  };

  const sections = Object.entries(numbers).map(
    ([key, number]) => {
      const [position, description] = POS[key];
      const meaning = M[number];

      return [
        position,
        "",
        `Число: ${number} — ${meaning.title}`,
        "",
        "Что означает эта позиция:",
        description,
        "",
        "СИЛЬНЫЕ СТОРОНЫ ПАРЫ",
        meaning.plus,
        "",
        "ВОЗМОЖНЫЕ ТРУДНОСТИ",
        meaning.minus,
        "",
        "ПРАКТИЧЕСКИЕ РЕКОМЕНДАЦИИ",
        meaning.advice
      ].join("\n");
    }
  );

  const titles = Object.values(numbers).map(
    number => M[number].title
  );

  const text = [
    "🔮 ПОДРОБНАЯ РАСШИФРОВКА СОВМЕСТИМОСТИ",
    "",
    `Дата женщины: ${calculation.dates.woman}`,
    `Дата мужчины: ${calculation.dates.man}`,
    "",
    `Сознание: ${numbers.consciousness}`,
    `Реализация: ${numbers.realization}`,
    `Миссия: ${numbers.mission}`,
    `Итог: ${numbers.finalNumber}`,
    "",
    "Четыре числа описывают разные стороны отношений. Используйте эту расшифровку для осмысления взаимодействия, а не как неизменный прогноз.",
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
    `В вашей паре соединяются четыре темы: ${titles.join(", ")}.`,
    "",
    "Сильные стороны помогают поддерживать отношения, а возможные трудности показывают, где особенно важны честный разговор, уважение к границам и готовность договариваться.",
    "",
    "Главный ориентир — не переделывать друг друга, а использовать понимание особенностей пары для более открытого общения, взаимной поддержки и осознанных решений."
  ].join("\n");

  return { text, numbers };
}

function getRequestData(body) {
  // 1. Прямые даты из JSON.
  const womanDate =
    body.womanDate ??
    body.woman_date ??
    body.woman ??
    null;

  const manDate =
    body.manDate ??
    body.man_date ??
    body.man ??
    null;

  if (womanDate && manDate) {
    return calculate(womanDate, manDate);
  }

  // 2. Готовые четыре числа.
  const source =
    body.pair ??
    body.variable_set ??
    body.numbers ??
    body;

  const consciousness = Number(source.consciousness);
  const realization = Number(source.realization);
  const mission = Number(source.mission);
  const finalNumber = Number(
    source.finalNumber ??
    source.final_number ??
    source.final
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

  // 3. Извлекаем даты из текста, включая ответ первого API.
  const textParts = [
    body.text,
    body.api_result,
    body.apiResult,
    body.result,
    body.message
  ];

  for (const part of textParts) {
    if (typeof part !== "string") continue;

    // Сначала ищем даты в обычном тексте.
    const dates = extractDates(part);

    if (dates.length === 2) {
      return calculate(dates[0], dates[1]);
    }

    // Если это JSON, пробуем извлечь даты из вложенных полей.
    try {
      const parsed = JSON.parse(part);

      if (parsed && typeof parsed === "object") {
        const nested = getRequestData(parsed);

        if (nested) return nested;
      }
    } catch (_) {
      // Строка может быть не JSON — продолжаем проверку.
    }

    // Поддержка строкового представления объекта с одинарными кавычками.
    const womanMatch = part.match(
      /Дата женщины\s*:\s*(\d{2}\.\d{2}\.\d{4})/i
    );
    const manMatch = part.match(
      /Дата мужчины\s*:\s*(\d{2}\.\d{2}\.\d{4})/i
    );

    if (womanMatch && manMatch) {
      return calculate(womanMatch[1], manMatch[1]);
    }
  }

  throw new Error(
    "Не удалось получить данные для расшифровки. Передайте две даты рождения или четыре числа пары."
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
        message:
          "Worker 5.5 готов. Отправьте POST JSON с двумя датами или четырьмя числами пары."
      });
    }

    if (request.method !== "POST") {
      return reply({
        ok: false,
        version: VERSION,
        error: "Используйте POST-запрос."
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
        individual: calculation.individual,
        numbers: report.numbers
      });
    } catch (error) {
      const message =
        error?.message ||
        "Не удалось сформировать расшифровку.";

      return reply({
        ok: false,
        version: VERSION,
        error: message,
        text: message
      }, 400);
    }
  }
};

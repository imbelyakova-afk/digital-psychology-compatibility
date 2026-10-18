
const VERSION = "1.5";

const MEANINGS = {
  1: {
    name: "Инициатива и самостоятельность",
    plus: "смелость, решительность, лидерство и способность начинать новое",
    minus: "упрямство, борьба за лидерство и желание настоять на своём",
    advice: "учиться договариваться и принимать решения вместе"
  },
  2: {
    name: "Чувствительность и интуиция",
    plus: "эмоциональная чуткость, интуиция и способность замечать настроение партнёра",
    minus: "обидчивость, сомнения, недосказанность и зависимость от реакции партнёра",
    advice: "говорить о чувствах прямо и не ожидать, что другой обо всём догадается"
  },
  3: {
    name: "Общение и радость",
    plus: "лёгкость, юмор, творчество и способность создавать приятные впечатления",
    minus: "поверхностность, избегание серьёзных разговоров и несоблюдение обещаний",
    advice: "сохранять лёгкость, не откладывая важные разговоры и решения"
  },
  4: {
    name: "Стабильность и опора",
    plus: "надёжность, ответственность, порядок и способность создавать устойчивую основу",
    minus: "жёсткость, контроль, критика и стремление всё делать по-своему",
    advice: "договариваться о правилах, сохраняя гибкость и уважение к партнёру"
  },
  5: {
    name: "Свобода и развитие",
    plus: "любознательность, перемены, расширение горизонтов и готовность пробовать новое",
    minus: "непостоянство, нетерпение и трудности с обязательствами",
    advice: "сочетать свободу с ответственностью и общими договорённостями"
  },
  6: {
    name: "Любовь и выбор",
    plus: "притяжение, нежность, забота и желание строить близкие отношения",
    minus: "ревность, сомнения, завышенные ожидания и сложности с выбором",
    advice: "подтверждать чувства поступками, не проверяя любовь партнёра"
  },
  7: {
    name: "Цель и движение",
    plus: "решительность, целеустремлённость, активность и поддержка в достижении целей",
    minus: "соперничество, поспешность и стремление контролировать ход событий",
    advice: "направлять энергию на общие цели, а не на борьбу друг с другом"
  },
  8: {
    name: "Справедливость и баланс",
    plus: "честность, ответственность, равновесие и уважение к договорённостям",
    minus: "претензии, подсчёт заслуг и ощущение, что один вкладывается больше другого",
    advice: "обсуждать ожидания и распределять ответственность справедливо"
  },
  9: {
    name: "Глубина и принятие",
    plus: "мудрость, глубина чувств, принятие различий и уважение личного пространства",
    minus: "закрытость, эмоциональная дистанция и привычка переживать трудности в одиночку",
    advice: "делиться переживаниями и не превращать личное пространство в стену"
  }
};

function reduceNumber(value) {
  let n = Math.abs(Number(value));
  while (n > 9) {
    n = String(n).split("").reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
}

function sumDigits(value) {
  return String(value).split("").reduce((sum, digit) => sum + Number(digit), 0);
}

function parseDate(value) {
  const match = String(value ?? "").trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    year < 1900 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return {
    date: match[0],
    day,
    digits: `${match[1]}${match[2]}${match[3]}`
  };
}

function calculatePerson(parsed) {
  const consciousness = reduceNumber(parsed.day);
  const realization = reduceNumber(sumDigits(parsed.digits));
  const mission = reduceNumber(consciousness + realization);
  const final = reduceNumber(consciousness + realization + mission);

  return { consciousness, realization, mission, final };
}

function calculateCompatibility(woman, man) {
  const consciousness = reduceNumber(woman.consciousness + man.consciousness);
  const realization = reduceNumber(woman.realization + man.realization);
  const mission = reduceNumber(woman.mission + man.mission);
  const final = reduceNumber(consciousness + realization + mission);

  return { consciousness, realization, mission, final };
}

function extractDates(input) {
  if (typeof input === "string") {
    try {
      return extractDates(JSON.parse(input));
    } catch {
      const dates = input.match(/\d{2}\.\d{2}\.\d{4}/g) || [];
      return { womanDate: dates[0] || "", manDate: dates[1] || "" };
    }
  }

  if (input && typeof input === "object") {
    const womanDate =
      input.womanDate ?? input.woman_date ?? input.woman;
    const manDate =
      input.manDate ?? input.man_date ?? input.man;

    if (womanDate != null && manDate != null) {
      return {
        womanDate: String(womanDate).trim(),
        manDate: String(manDate).trim()
      };
    }

    const candidates = [
      input.text,
      input.compatibility_dates,
      input.user_reply,
      input.user_input,
      input.userInput,
      input.message,
      input.body,
      input.data
    ];

    for (const candidate of candidates) {
      const result = extractDates(candidate);
      if (result.womanDate && result.manDate) return result;
    }

    const dates = JSON.stringify(input).match(/\d{2}\.\d{2}\.\d{4}/g) || [];
    return { womanDate: dates[0] || "", manDate: dates[1] || "" };
  }

  return { womanDate: "", manDate: "" };
}

function section(title, number, context) {
  const meaning = MEANINGS[number] || MEANINGS[1];

  return `${title} — ${number} (${meaning.name})\n${context}\n` +
    `В плюсе: ${meaning.plus}.\n` +
    `В минусе: ${meaning.minus}.\n` +
    `Что важно: ${meaning.advice}.`;
}

function describeCombination(numberA, numberB, labelA, labelB) {
  const a = MEANINGS[numberA] || MEANINGS[1];
  const b = MEANINGS[numberB] || MEANINGS[1];

  let interaction;

  if (numberA === numberB) {
    interaction =
      "Партнёры могут хорошо понимать похожие потребности друг друга. " +
      "При этом общие слабые стороны тоже способны усиливаться.";
  } else if ([2, 6, 9].includes(numberA) && [2, 6, 9].includes(numberB)) {
    interaction =
      "Это сочетание можно трактовать через чувства, близость и глубину. " +
      "Важно не уходить в молчание и не ждать, что партнёр сам угадает переживания.";
  } else if ([1, 4, 7, 8].includes(numberA) && [1, 4, 7, 8].includes(numberB)) {
    interaction =
      "В таком сочетании заметна тема силы воли, ответственности и решений. " +
      "В плюсе партнёры могут стать надёжной командой, в минусе — спорить за контроль.";
  } else if ([3, 5].includes(numberA) || [3, 5].includes(numberB)) {
    interaction =
      "Сочетание можно рассматривать через общение, впечатления и стремление к новому. " +
      "Важно, чтобы интерес и свобода сочетались с надёжностью и выполнением обещаний.";
  } else {
    interaction =
      "Разные качества могут дополнять друг друга, если партнёры готовы слышать разные взгляды. " +
      "Трудности возникают, когда каждый считает свой способ реагирования единственно верным.";
  }

  return `${labelA}: ${numberA} — ${a.name.toLowerCase()}; ${labelB}: ${numberB} — ${b.name.toLowerCase()}.\n` +
    `${interaction}\n` +
    `Возможный минус: ${a.minus}; у второго партнёра может проявляться ${b.minus}.\n` +
    `Рекомендация: ${a.advice}; также ${b.advice}.`;
}

function buildOverallConclusion(compatibility) {
  const c = MEANINGS[compatibility.consciousness];
  const r = MEANINGS[compatibility.realization];
  const m = MEANINGS[compatibility.mission];
  const f = MEANINGS[compatibility.final];

  return [
    "🌷 ОБЩИЙ ВЫВОД О ВАШЕМ СОЮЗЕ",
    "",
    `Сильная сторона пары — ${c.plus}, а также ${r.plus}.`,
    `В рамках этой нумерологической трактовки отношения могут помогать вам развивать ${m.plus}.`,
    "",
    `На что обратить внимание: ${c.minus}; в повседневной жизни также могут проявляться ${r.minus}.`,
    `Главная тема для проработки — ${m.advice}.`,
    "",
    `Итоговое число ${compatibility.final} связано с темой «${f.name.toLowerCase()}». ${f.advice}.`,
    "",
    "Подходите ли вы друг другу? Эти числа не определяют судьбу отношений. Их можно использовать как повод обсудить сильные стороны, ожидания и возможные разногласия."
  ].join("\n");
}

function buildText(womanDate, manDate, woman, man, compatibility) {
  const lines = [
    "💞 ПОДРОБНАЯ СОВМЕСТИМОСТЬ ПАРЫ",
    "",
    `👩 Первый партнёр — ${womanDate}`,
    `Сознание: ${woman.consciousness}`,
    `Реализация: ${woman.realization}`,
    `Миссия: ${woman.mission}`,
    `Итог: ${woman.final}`,
    "",
    `👨 Второй партнёр — ${manDate}`,
    `Сознание: ${man.consciousness}`,
    `Реализация: ${man.realization}`,
    `Миссия: ${man.mission}`,
    `Итог: ${man.final}`,
    "",
    "❤️ ЧИСЛА ВАШЕЙ ПАРЫ",
    "",
    section(
      "Сознание пары",
      compatibility.consciousness,
      "Эта позиция символически описывает эмоциональную атмосферу и привычные реакции в союзе."
    ),
    "",
    section(
      "Реализация пары",
      compatibility.realization,
      "Эта позиция символически описывает то, как пара проявляется в повседневной жизни и общих делах."
    ),
    "",
    section(
      "Миссия пары",
      compatibility.mission,
      "Эта позиция символически описывает темы общего развития и уроки, которые партнёры могут осмыслять вместе."
    ),
    "",
    section(
      "Итог пары",
      compatibility.final,
      "Это общий символический акцент союза, а не прогноз его неизбежного будущего."
    ),
    "",
    "🔗 КАК СОЧЕТАЮТСЯ ВАШИ ЛИЧНЫЕ ЧИСЛА",
    "",
    "Сознание партнёров:",
    describeCombination(woman.consciousness, man.consciousness, "Первый партнёр", "Второй партнёр"),
    "",
    "Реализация партнёров:",
    describeCombination(woman.realization, man.realization, "Первый партнёр", "Второй партнёр"),
    "",
    "Миссия партнёров:",
    describeCombination(woman.mission, man.mission, "Первый партнёр", "Второй партнёр"),
    "",
    buildOverallConclusion(compatibility),
    "",
    "Нумерологическая трактовка не является научно подтверждённым прогнозом совместимости. Реальные отношения зависят от поступков, доверия, безопасности и взаимного выбора."
  ];

  return lines.join("\n");
}

export default {
  async fetch(request) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json; charset=utf-8"
    };

    const respond = (data, status = 200) =>
      new Response(JSON.stringify(data), { status, headers });

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method === "GET") {
      return respond({
        ok: true,
        version: VERSION,
        message: "Отправьте POST с womanDate и manDate или с текстом, содержащим две даты.",
        example: {
          womanDate: "09.06.1979",
          manDate: "29.11.1974"
        }
      });
    }

    if (request.method !== "POST") {
      return respond({ ok: false, error: "Используйте POST." }, 405);
    }

    let rawBody = "";
    let body;

    try {
      rawBody = await request.text();
      body = JSON.parse(rawBody);
    } catch {
      body = rawBody;
    }

    const dates = extractDates(body);
    const parsedWoman = parseDate(dates.womanDate);
    const parsedMan = parseDate(dates.manDate);

    if (!parsedWoman || !parsedMan) {
      return respond({
        ok: false,
        version: VERSION,
        error: "Укажите две корректные даты в формате ДД.ММ.ГГГГ.",
        received: dates,
        rawBody: rawBody.slice(0, 500),
        example: "09.06.1979 29.11.1974"
      }, 400);
    }

    const woman = calculatePerson(parsedWoman);
    const man = calculatePerson(parsedMan);
    const compatibility = calculateCompatibility(woman, man);

    return respond({
      ok: true,
      version: VERSION,
      womanDate: parsedWoman.date,
      woman,
      manDate: parsedMan.date,
      man,
      compatibility,
      text: buildText(
        parsedWoman.date,
        parsedMan.date,
        woman,
        man,
        compatibility
      )
    });
  }
};

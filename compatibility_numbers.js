const VERSION = "3.0";
const HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: HEADERS
  });
}
// Все числа сводим к диапазону 1–9.
// Мастер-числа 11, 22 и 33 также сокращаются.
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
function getNumbers(dateText) {
  const date = parseDate(dateText);
  if (!date) {
    throw new Error(
      `Некорректная дата: ${dateText}. Используйте ДД.ММ.ГГГГ.`
    );
  }
  const { day, month, year } = date;
  const consciousness = reduceNumber(day);
  const digitsSum = (
    String(day).padStart(2, "0") +
    String(month).padStart(2, "0") +
    String(year).padStart(4, "0")
  )
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
  const realization = reduceNumber(digitsSum);
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
const MEANINGS = {
  1: {
    title: "Инициатива и самостоятельность",
    plus: "Решительность, лидерство, смелость начинать новое.",
    minus: "Упрямство, стремление всё контролировать, нежелание уступать.",
    need: "Уважение к самостоятельности и право принимать собственные решения."
  },
  2: {
    title: "Чувствительность и партнёрство",
    plus: "Эмпатия, дипломатичность, умение слышать другого.",
    minus: "Обидчивость, зависимость от оценки, избегание прямых разговоров.",
    need: "Эмоциональная безопасность, поддержка и честный диалог."
  },
  3: {
    title: "Общение и самовыражение",
    plus: "Лёгкость, юмор, творчество, способность вдохновлять.",
    minus: "Поверхностность, импульсивные слова, рассеянность.",
    need: "Живое общение, интерес и возможность проявлять себя."
  },
  4: {
    title: "Порядок и надёжность",
    plus: "Ответственность, стабильность, верность договорённостям.",
    minus: "Жёсткость, критичность, сопротивление переменам.",
    need: "Понятные правила, надёжность и предсказуемость."
  },
  5: {
    title: "Свобода и перемены",
    plus: "Гибкость, любознательность, открытость новому опыту.",
    minus: "Нетерпение, непостоянство, стремление избегать ограничений.",
    need: "Личное пространство, разнообразие и доверие."
  },
  6: {
    title: "Забота и ответственность",
    plus: "Теплота, преданность, умение создавать уют и поддерживать.",
    minus: "Гиперопека, завышенные ожидания, желание исправлять другого.",
    need: "Взаимная забота без жертвенности и контроля."
  },
  7: {
    title: "Глубина и внутренний мир",
    plus: "Наблюдательность, вдумчивость, стремление понять суть.",
    minus: "Закрытость, чрезмерный анализ, эмоциональная дистанция.",
    need: "Доверие, спокойствие и время на осмысление."
  },
  8: {
    title: "Сила и результат",
    plus: "Организованность, амбиции, способность достигать целей.",
    minus: "Борьба за власть, категоричность, оценка всего через результат.",
    need: "Уважение, равноправие и согласованные общие цели."
  },
  9: {
    title: "Смысл и широта взглядов",
    plus: "Сочувствие, мудрость, щедрость, способность видеть общую картину.",
    minus: "Идеализация, эмоциональное выгорание, спасательство.",
    need: "Общие ценности, личные границы и реалистичные ожидания."
  }
};
const PAIR_GUIDANCE = {
  1: "В паре важно договариваться о лидерстве и не превращать разногласия в соревнование.",
  2: "Союзу помогают нежность, внимательность и привычка проговаривать чувства.",
  3: "Отношения оживают через общение, юмор, совместные впечатления и творчество.",
  4: "Опорой становятся надёжность, конкретные договорённости и общие планы.",
  5: "Важно сохранять свободу каждого, добавлять новизну и не ограничивать партнёра чрезмерно.",
  6: "Особенно важны забота, совместный быт и справедливое распределение ответственности.",
  7: "Союзу нужны доверие, глубокие разговоры и уважение к личному пространству.",
  8: "Полезно объединять амбиции, обсуждать деньги и решения на равных.",
  9: "Отношения укрепляют общие ценности, сочувствие и умение принимать различия."
};
function describePerson(name, numbers) {
  const c = MEANINGS[numbers.consciousness];
  const r = MEANINGS[numbers.realization];
  const m = MEANINGS[numbers.mission];
  const f = MEANINGS[numbers.final];
  return [
    `👤 ${name}`,
    "",
    `Сознание — ${numbers.consciousness}: ${c.title}.`,
    `Сильная сторона: ${c.plus}`,
    `Возможная сложность: ${c.minus}`,
    "",
    `Реализация — ${numbers.realization}: ${r.title}.`,
    `В проявлении себя помогают: ${r.plus}`,
    `Зона внимания: ${r.minus}`,
    "",
    `Миссия — ${numbers.mission}: ${m.title}.`,
    `Важная потребность: ${m.need}`,
    "",
    `Итоговое число — ${numbers.final}: ${f.title}.`,
    `Ресурс: ${f.plus}`,
    `Что полезно отслеживать: ${f.minus}`
  ].join("\n");
}
function calculate(date1Text, date2Text) {
  const date1 = parseDate(date1Text);
  const date2 = parseDate(date2Text);
  if (!date1 || !date2) {
    throw new Error(
      "Нужны две действительные даты в формате ДД.ММ.ГГГГ."
    );
  }
  const person1 = getNumbers(date1.formatted);
  const person2 = getNumbers(date2.formatted);
  const pair = {
    consciousness: reduceNumber(
      person1.consciousness + person2.consciousness
    ),
    realization: reduceNumber(
      person1.realization + person2.realization
    ),
    mission: reduceNumber(
      person1.mission + person2.mission
    )
  };
  pair.final = reduceNumber(
    pair.consciousness +
    pair.realization +
    pair.mission
  );
  const pairC = MEANINGS[pair.consciousness];
  const pairR = MEANINGS[pair.realization];
  const pairM = MEANINGS[pair.mission];
  const pairF = MEANINGS[pair.final];
  const text = [
    "💗 СОВМЕСТИМОСТЬ ПАРЫ",
    "",
    `Дата первого человека: ${date1.formatted}`,
    `Дата второго человека: ${date2.formatted}`,
    "",
    "━━━━━━━━━━━━━━━━",
    "🔹 ЧИСЛА ПЕРВОГО ЧЕЛОВЕКА",
    "",
    `Сознание: ${person1.consciousness}`,
    `Реализация: ${person1.realization}`,
    `Миссия: ${person1.mission}`,
    `Итог: ${person1.final}`,
    "",
    "🔹 ЧИСЛА ВТОРОГО ЧЕЛОВЕКА",
    "",
    `Сознание: ${person2.consciousness}`,
    `Реализация: ${person2.realization}`,
    `Миссия: ${person2.mission}`,
    `Итог: ${person2.final}`,
    "",
    "━━━━━━━━━━━━━━━━",
    "💞 ОБЩИЕ ЧИСЛА ПАРЫ",
    "",
    `Сознание пары: ${pair.consciousness} — ${pairC.title}.`,
    `Ресурс: ${pairC.plus}`,
    `Сложность: ${pairC.minus}`,
    "",
    `Реализация пары: ${pair.realization} — ${pairR.title}.`,
    `Общий потенциал: ${pairR.plus}`,
    `Что может мешать: ${pairR.minus}`,
    "",
    `Миссия пары: ${pair.mission} — ${pairM.title}.`,
    `Важная потребность союза: ${pairM.need}`,
    "",
    `Итог пары: ${pair.final} — ${pairF.title}.`,
    `Сильная сторона: ${pairF.plus}`,
    `Зона внимания: ${pairF.minus}`,
    "",
    "━━━━━━━━━━━━━━━━",
    "🔄 КАК ВЫ ВЛИЯЕТЕ ДРУГ НА ДРУГА",
    "",
    `Сознание первого человека (${person1.consciousness}) влияет на восприятие и реакции второго, а сознание второго (${person2.consciousness}) — на первого. Сильные стороны первого: ${MEANINGS[person1.consciousness].plus} Сильные стороны второго: ${MEANINGS[person2.consciousness].plus}`,
    "",
    `Реализация первого человека (${person1.realization}) показывает, как он может проявлять себя и двигаться к целям. Важно, чтобы это не обесценивало потребности второго человека (${person2.consciousness} — ${MEANINGS[person2.consciousness].title}). Реализация второго (${person2.realization}) тоже влияет на ощущение поддержки и свободы первого (${person1.consciousness} — ${MEANINGS[person1.consciousness].title}).`,
    "",
    `Миссия первого (${person1.mission}) и миссия второго (${person2.mission}) показывают разные способы искать смысл и направление. Вместо ожидания, что партнёр будет думать так же, полезно обсуждать общие цели и уважать различия.`,
    "",
    "━━━━━━━━━━━━━━━━",
    "🌿 СОВЕТ ДЛЯ ВАШЕЙ ПАРЫ",
    "",
    PAIR_GUIDANCE[pair.consciousness],
    PAIR_GUIDANCE[pair.realization],
    PAIR_GUIDANCE[pair.mission],
    "",
    "Помните: эти числа — инструмент для размышления и разговора, а не научный прогноз отношений. Реальная совместимость зависит от общения, уважения, безопасности и поступков обоих людей."
  ].join("\n");
  return {
    text,
    dates: {
      date_1: date1.formatted,
      date_2: date2.formatted
    },
    individual: {
      person1,
      person2
    },
    pair
  };
}
function getDatesFromBody(body) {
  // Основной формат для Telegram Bot Builder.
  const first = body.date_1 ?? body.date1 ?? body.firstDate;
  const second = body.date_2 ?? body.date2 ?? body.secondDate;
  if (first != null && second != null) {
    return [String(first).trim(), String(second).trim()];
  }
  // Поддержка прежнего формата, чтобы не ломать старые интеграции.
  if (body.womanDate != null && body.manDate != null) {
    return [
      String(body.womanDate).trim(),
      String(body.manDate).trim()
    ];
  }
  // Также поддерживаем текст, в котором указаны обе даты.
  const inputText = String(
    body.text ?? body.user_reply ?? body.user_input ?? ""
  );
  const dates = inputText.match(/\d{2}\.\d{2}\.\d{4}/g) || [];
  if (dates.length === 2) {
    return dates;
  }
  return null;
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
      return json({
        ok: true,
        version: VERSION,
        service: "digital-psychology-compatibility",
        message: "API работает. Для расчёта отправьте POST JSON с date_1 и date_2."
      });
    }
    if (request.method !== "POST") {
      return json({
        ok: false,
        version: VERSION,
        error: "Используйте POST."
      }, 405);
    }
    try {
      const body = await request.json();
      const dates = getDatesFromBody(body);
      if (!dates) {
        return json({
          ok: false,
          version: VERSION,
          error: "Не найдены две даты рождения.",
          text: "Передайте date_1 и date_2 в формате ДД.ММ.ГГГГ."
        }, 400);
      }
      const result = calculate(dates[0], dates[1]);
      return json({
        ok: true,
        version: VERSION,
        text: result.text,
        dates: result.dates,
        pair: result.pair,
        individual: result.individual,
        variable_set: {
          consciousness: String(result.pair.consciousness),
          realization: String(result.pair.realization),
          mission: String(result.pair.mission),
          finalNumber: String(result.pair.final)
        }
      });
    } catch (error) {
      return json({
        ok: false,
        version: VERSION,
        error: error.message || "Ошибка обработки запроса.",
        text: error.message || "Не удалось выполнить расчёт."
      }, 400);
    }
  }
};

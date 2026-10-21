
const VERSION = "2.0";

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

// Сведение числа к диапазону 1–9.
function reduceNumber(n) {
  n = Math.abs(Number(n) || 0);

  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }

  return n;
}

// Проверка даты рождения.
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
    year < 1 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
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

// Извлечение дат из текста.
function extractDates(text) {
  return String(text || "").match(
    /\d{2}\.\d{2}\.\d{4}/g
  ) || [];
}

// Расчёт чисел одного человека.
function getNumbers(dateText) {
  const date = parseDate(dateText);

  if (!date) {
    throw new Error(`Некорректная дата: ${dateText}`);
  }

  const { day, month, year } = date;

  const consciousness = reduceNumber(day);

  const dateDigitsSum = (
    String(day).padStart(2, "0") +
    String(month).padStart(2, "0") +
    String(year).padStart(4, "0")
  )
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);

  const realization = reduceNumber(dateDigitsSum);

  const mission = reduceNumber(
    consciousness + realization
  );

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

// База трактовок чисел.
const NUMBER_MEANINGS = {
  1: {
    title: "Единица",
    plus: "Инициативность, самостоятельность, умение принимать решения и двигаться к цели.",
    minus: "Упрямство, стремление всё решать самостоятельно и трудности с уступками.",
    advice: "Учитесь договариваться и оставлять партнёру право на собственное мнение."
  },
  2: {
    title: "Двойка",
    plus: "Чувствительность, нежность, эмоциональная глубина и внимание к отношениям.",
    minus: "Обидчивость, сомнения, зависимость от реакции партнёра и желание всё анализировать.",
    advice: "Говорите о своих потребностях прямо, не заставляя партнёра угадывать ваши чувства."
  },
  3: {
    title: "Тройка",
    plus: "Общительность, лёгкость, творческий подход и умение привносить эмоции в отношения.",
    minus: "Непостоянство, рассеянность и склонность избегать неприятных разговоров.",
    advice: "Подкрепляйте красивые слова конкретными действиями."
  },
  4: {
    title: "Четвёрка",
    plus: "Надёжность, практичность, ответственность и стремление создавать устойчивую основу.",
    minus: "Жёсткость, контроль, критичность и сопротивление переменам.",
    advice: "Сохраняйте надёжность, но не превращайте отношения в систему требований."
  },
  5: {
    title: "Пятёрка",
    plus: "Свобода, любознательность, движение, гибкость и новые впечатления.",
    minus: "Нетерпение, непоследовательность и желание уйти от ограничений.",
    advice: "Сочетайте личное пространство с понятными договорённостями."
  },
  6: {
    title: "Шестёрка",
    plus: "Забота, гармония, эстетика, близость и комфорт совместной жизни.",
    minus: "Зависимость от одобрения, завышенные ожидания и поиск подтверждения любви.",
    advice: "Не забывайте о собственных целях и не измеряйте любовь количеством внимания."
  },
  7: {
    title: "Семёрка",
    plus: "Наблюдательность, глубина, самостоятельное мышление и стремление понимать причины происходящего.",
    minus: "Закрытость, подозрительность, чрезмерный анализ и эмоциональная дистанция.",
    advice: "Не заменяйте откровенный разговор догадками и проверками."
  },
  8: {
    title: "Восьмёрка",
    plus: "Организованность, целеустремлённость, ответственность и умение решать практические задачи.",
    minus: "Стремление контролировать, жёсткость и оценка отношений только через результат.",
    advice: "Делите ответственность и учитывайте чувства, а не только эффективность."
  },
  9: {
    title: "Девятка",
    plus: "Широкий взгляд на жизнь, щедрость, способность поддерживать и видеть ситуацию целиком.",
    minus: "Категоричность, завышенные ожидания и желание переделывать партнёра.",
    advice: "Принимайте различия и не превращайте отношения в проект по исправлению другого человека."
  }
};

const AREAS = {
  consciousness: {
    title: "Сознание пары",
    description: "Как вы воспринимаете друг друга, общаетесь и чего ожидаете от отношений."
  },
  realization: {
    title: "Реализация пары",
    description: "Как вы действуете, строите повседневную жизнь и поддерживаете цели друг друга."
  },
  mission: {
    title: "Миссия пары",
    description: "Какие темы и задачи могут повторяться в ваших отношениях."
  },
  final: {
    title: "Финал пары",
    description: "Какие сильные стороны и зоны внимания символически отражает итоговое число."
  }
};

// Трактовка общего числа пары.
function describeNumber(number, area) {
  const meaning = NUMBER_MEANINGS[number];
  const section = AREAS[area];

  return [
    `💗 ${section.title} — ${number}`,
    section.description,
    "",
    `✨ Сильные стороны: ${meaning.plus}`,
    "",
    `⚠️ Возможные сложности: ${meaning.minus}`,
    "",
    `🤝 Что поможет: ${meaning.advice}`
  ].join("\n");
}

// Трактовка взаимодействия двух индивидуальных чисел.
function describeCombination(number1, number2, title) {
  const first = NUMBER_MEANINGS[number1];
  const second = NUMBER_MEANINGS[number2];

  let dynamic;

  if (number1 === number2) {
    dynamic =
      `У вас похожие особенности в этой сфере. ` +
      `Это может давать ощущение, что вы понимаете друг друга с полуслова. ` +
      `Но общие слабые стороны тоже могут усиливаться, особенно если оба избегают решений.`;
  } else {
    dynamic =
      `${first.title} и ${second.title} по-разному проявляют себя в отношениях. ` +
      `Эти различия могут дополнять друг друга, но без открытого общения способны становиться причиной недопонимания.`;
  }

  return [
    `💞 ${title}: ${first.title} и ${second.title}`,
    "",
    dynamic,
    "",
    `Первый человек: ${first.plus}`,
    `Второй человек: ${second.plus}`,
    "",
    `⚠️ Зоны внимания: ${first.minus} ${second.minus}`,
    "",
    `❤️ Совет: ${first.advice} ${second.advice}`
  ].join("\n");
}

// Общие числа пары.
function calculatePair(person1, person2) {
  const pair = {
    consciousness: reduceNumber(
      person1.consciousness + person2.consciousness
    ),
    realization: reduceNumber(
      person1.realization + person2.realization
    ),
    mission: reduceNumber(
      person1.mission + person2.mission
    ),
    final: 0
  };

  pair.final = reduceNumber(
    pair.consciousness +
    pair.realization +
    pair.mission
  );

  return pair;
}

// Полный текст результата.
function formatResult(dates, individual, pair) {
  const p1 = individual.person1;
  const p2 = individual.person2;

  const sections = [
    "💞 ПОДРОБНАЯ СОВМЕСТИМОСТЬ",
    "",
    "👤 ПЕРВЫЙ ЧЕЛОВЕК",
    `Дата рождения: ${dates.person1}`,
    `Сознание: ${p1.consciousness}`,
    `Реализация: ${p1.realization}`,
    `Миссия: ${p1.mission}`,
    `Финал: ${p1.final}`,
    "",
    "👤 ВТОРОЙ ЧЕЛОВЕК",
    `Дата рождения: ${dates.person2}`,
    `Сознание: ${p2.consciousness}`,
    `Реализация: ${p2.realization}`,
    `Миссия: ${p2.mission}`,
    `Финал: ${p2.final}`,
    "",
    "💗 ЧИСЛА ВАШЕЙ ПАРЫ",
    "",
    describeNumber(pair.consciousness, "consciousness"),
    "",
    describeNumber(pair.realization, "realization"),
    "",
    describeNumber(pair.mission, "mission"),
    "",
    describeNumber(pair.final, "final"),
    "",
    "🔥 КАК ВЫ ВЛИЯЕТЕ ДРУГ НА ДРУГА",
    "",
    "Реализация первого человека и сознание второго:",
    describeCombination(
      p1.realization,
      p2.consciousness,
      "Реализация первого и сознание второго"
    ),
    "",
    "Реализация второго человека и сознание первого:",
    describeCombination(
      p2.realization,
      p1.consciousness,
      "Реализация второго и сознание первого"
    ),
    "",
    "Сознание первого человека и сознание второго:",
    describeCombination(
      p1.consciousness,
      p2.consciousness,
      "Сознание партнёров"
    ),
    "",
    "Реализация первого человека и реализация второго:",
    describeCombination(
      p1.realization,
      p2.realization,
      "Реализация партнёров"
    ),
    "",
    "💌 Помните: это символическая интерпретация чисел, а не научный прогноз отношений. Реальная совместимость зависит от поступков, общения и взаимного уважения."
  ];

  return sections.join("\n");
}

// Главная функция расчёта.
function calculate(date1Text, date2Text) {
  const date1 = parseDate(date1Text);
  const date2 = parseDate(date2Text);

  if (!date1 || !date2) {
    throw new Error(
      "Укажите две корректные даты в формате ДД.ММ.ГГГГ."
    );
  }

  const person1 = getNumbers(date1.formatted);
  const person2 = getNumbers(date2.formatted);

  const individual = {
    person1,
    person2
  };

  const dates = {
    person1: date1.formatted,
    person2: date2.formatted
  };

  const pair = calculatePair(person1, person2);

  return {
    text: formatResult(dates, individual, pair),
    dates,
    individual,
    pair
  };
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
        message: "API расчёта совместимости работает.",
        expectedFormat: {
          date_1: "ДД.ММ.ГГГГ",
          date_2: "ДД.ММ.ГГГГ"
        }
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

      let date1;
      let date2;

      if (body.womanDate && body.manDate) {
        date1 = String(body.womanDate).trim();
        date2 = String(body.manDate).trim();
      } else if (body.date_1 && body.date_2) {
        date1 = String(body.date_1).trim();
        date2 = String(body.date_2).trim();
      } else if (body.date1 && body.date2) {
        date1 = String(body.date1).trim();
        date2 = String(body.date2).trim();
      } else {
        const inputText = String(
          body.text ||
          body.user_reply ||
          body.user_input ||
          ""
        );

        const dates = extractDates(inputText);

        if (dates.length !== 2) {
          return json({
            ok: false,
            version: VERSION,
            error: "Нужно передать ровно две даты рождения.",
            text: "Отправьте две даты в формате ДД.ММ.ГГГГ через пробел."
          }, 400);
        }

        [date1, date2] = dates;
      }

      const result = calculate(date1, date2);

      return json({
        ok: true,
        version: VERSION,
        text: result.text,
        dates: result.dates,
        individual: result.individual,
        pair: result.pair,
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


const VERSION = "1.1";

const HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function reduceNumber(n) {
  n = Math.abs(Number(n) || 0);

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

function extractDates(text) {
  return String(text || "").match(
    /\b\d{2}\.\d{2}\.\d{4}\b/g
  ) || [];
}

function getNumbers(dateText) {
  const date = parseDate(dateText);

  if (!date) {
    throw new Error(`Некорректная дата: ${dateText}`);
  }

  const { day, month, year } = date;

  const consciousness = reduceNumber(day);

  const dateDigitsSum = (
    String(day) +
    String(month).padStart(2, "0") +
    String(year)
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

  const text = [
    "СОВМЕСТИМОСТЬ ПО ЧЕТЫРЁМ ЧИСЛАМ",
    "",
    `Дата женщины: ${womanDate.formatted}`,
    `Дата мужчины: ${manDate.formatted}`,
    "",
    `Сознание: ${pair.consciousness}`,
    `Реализация: ${pair.realization}`,
    `Миссия: ${pair.mission}`,
    `Итог: ${pair.final}`
  ].join("\n");

  return {
    text,
    dates: {
      woman: womanDate.formatted,
      man: manDate.formatted
    },
    pair,
    individual: {
      woman,
      man
    }
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: HEADERS
  });
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
        message: "Отправьте POST JSON с двумя датами."
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

      let womanDate;
      let manDate;

      if (body.womanDate && body.manDate) {
        womanDate = String(body.womanDate).trim();
        manDate = String(body.manDate).trim();
      } else {
        const dates = extractDates(body.text || "");

        if (dates.length !== 2) {
          return json({
            ok: false,
            version: VERSION,
            error: "Нужно передать ровно две даты рождения.",
            text: "Напишите обе даты в формате ДД.ММ.ГГГГ через пробел."
          }, 400);
        }

        [womanDate, manDate] = dates;
      }

      const result = calculate(womanDate, manDate);

      return json({
        ok: true,
        version: VERSION,
        text: result.text,
        dates: result.dates,
        pair: result.pair,
        individual: result.individual
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

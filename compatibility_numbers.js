
const VERSION = "1.0";

function reduceNumber(n) {
  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
}

function getNumbers(date) {
  const [day, month, year] = date.split(".").map(Number);

  const consciousness = reduceNumber(day);
  const realization = reduceNumber(
    `${day}${String(month).padStart(2, "0")}${year}`
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0)
  );
  const mission = reduceNumber(consciousness + realization);
  const final = reduceNumber(
    consciousness + realization + mission
  );

  return { consciousness, realization, mission, final };
}

function extractDates(text) {
  return String(text || "").match(
    /\b\d{2}\.\d{2}\.\d{4}\b/g
  ) || [];
}

function calculate(text) {
  const dates = extractDates(text);

  if (dates.length < 2) {
    return "Не удалось найти две даты. Пример: 09.06.1979 29.11.1974";
  }

  const woman = getNumbers(dates[0]);
  const man = getNumbers(dates[1]);

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
    pair.consciousness + pair.realization + pair.mission
  );

  return [
    "СОВМЕСТИМОСТЬ ПО ЧЕТЫРЁМ ЧИСЛАМ",
    "",
    `Дата женщины: ${dates[0]}`,
    `Дата мужчины: ${dates[1]}`,
    "",
    `Сознание: ${pair.consciousness}`,
    `Реализация: ${pair.realization}`,
    `Миссия: ${pair.mission}`,
    `Итог: ${pair.final}`
  ].join("\n");
}

export default {
  async fetch(request) {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers
      });
    }

    if (request.method === "GET") {
      return Response.json({
        ok: true,
        version: VERSION,
        service: "digital-psychology-compatibility",
        message: "Отправьте POST JSON с полем text."
      }, { headers });
    }

    if (request.method !== "POST") {
      return Response.json({
        ok: false,
        version: VERSION,
        error: "Используйте POST."
      }, { status: 405, headers });
    }

    try {
      const body = await request.json();
      const result = calculate(body.text || body.date || "");

      return Response.json({
        ok: true,
        version: VERSION,
        text: result
      }, { headers });
    } catch (error) {
      return Response.json({
        ok: false,
        version: VERSION,
        error: "Ошибка чтения JSON.",
        text: "Ошибка запроса. Проверьте формат JSON."
      }, { status: 400, headers });
    }
  }
};

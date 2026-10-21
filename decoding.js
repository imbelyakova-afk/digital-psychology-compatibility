const meanings = {
  1: "Лидерство, самостоятельность и инициатива.",
  2: "Партнёрство, чувствительность и взаимопонимание.",
  3: "Общение, творчество и лёгкость.",
  4: "Стабильность, ответственность и порядок.",
  5: "Свобода, перемены и яркие впечатления.",
  6: "Забота, любовь и семейные ценности.",
  7: "Глубина, размышления и духовный рост.",
  8: "Амбиции, сила и достижение целей.",
  9: "Мудрость, сострадание и завершение циклов."
};

const labels = {
  consciousness: "Сознание",
  realization: "Реализация",
  mission: "Миссия",
  final: "Итог"
};

function getNumbers(body) {
  // Вариант: пришёл готовый объект с числами
  const pair = body.pair || body.numbers || body.variable_set;

  if (pair) {
    const result = {
      consciousness: pair.consciousness,
      realization: pair.realization,
      mission: pair.mission,
      final: pair.final ?? pair.finalNumber ?? pair.final_number
    };

    if (Object.values(result).every(
      n => Number.isInteger(Number(n)) &&
           Number(n) >= 1 && Number(n) <= 9
    )) {
      return Object.fromEntries(
        Object.entries(result).map(([k, v]) => [k, Number(v)])
      );
    }
  }

  // Вариант: пришёл текст первого API
  const text = typeof body.text === "string"
    ? body.text
    : typeof body.api_result === "string"
      ? body.api_result
      : typeof body.result === "string"
        ? body.result
        : "";

  if (!text) return null;

  const find = label => {
    const re = new RegExp(label + "\\s*[:：]\\s*([1-9])", "i");
    const match = text.match(re);
    return match ? Number(match[1]) : null;
  };

  const result = {
    consciousness: find("Сознание"),
    realization: find("Реализация"),
    mission: find("Миссия"),
    final: find("Итог")
  };

  return Object.values(result).every(n => n !== null)
    ? result
    : null;
}

function makeDescription(numbers) {
  return [
    "РАСШИФРОВКА СОВМЕСТИМОСТИ",
    "",
    ...Object.entries(labels).flatMap(([key, label]) => [
      `${label}: ${numbers[key]}`,
      meanings[numbers[key]],
      ""
    ])
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
        headers: {
          ...headers,
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (request.method === "GET") {
      return new Response(JSON.stringify({
        ok: true,
        version: "7.1",
        message: "Передайте текст первого API в поле text."
      }), { headers });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({
        ok: false,
        error: "Используйте POST."
      }), { status: 405, headers });
    }

    try {
      const body = await request.json();
      const numbers = getNumbers(body);

      if (!numbers) {
        return new Response(JSON.stringify({
          ok: false,
          error: "Не удалось найти четыре числа в тексте первого API.",
          receivedType: typeof body.text,
          receivedKeys: Object.keys(body)
        }), { status: 400, headers });
      }

      return new Response(JSON.stringify({
        ok: true,
        version: "7.1",
        text: makeDescription(numbers),
        numbers
      }), { headers });

    } catch (error) {
      return new Response(JSON.stringify({
        ok: false,
        error: "Ошибка обработки JSON."
      }), { status: 400, headers });
    }
  }
};

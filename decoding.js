
const VERSION = "8.0";

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

function getText(body) {
  const candidates = [
    body.text,
    body.api_result,
    body.apiResult,
    body.result,
    body.message,
    body.api_result?.text,
    body.result?.text
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "";
}

function getNumbers(body) {
  // Если передан готовый объект чисел
  const pair = body.pair || body.numbers || body.variable_set;

  if (pair && typeof pair === "object") {
    const result = {
      consciousness: pair.consciousness,
      realization: pair.realization,
      mission: pair.mission,
      final: pair.final ?? pair.finalNumber ?? pair.final_number
    };

    const values = Object.values(result).map(Number);

    if (values.every(n =>
      Number.isInteger(n) && n >= 1 && n <= 9
    )) {
      return {
        consciousness: Number(result.consciousness),
        realization: Number(result.realization),
        mission: Number(result.mission),
        final: Number(result.final)
      };
    }
  }

  // Извлекаем числа из текста первого API
  const text = getText(body);

  if (!text) return null;

  function find(label) {
    const match = text.match(
      new RegExp(label + "\\s*[:：]\\s*([1-9])(?:\\D|$)", "i")
    );

    return match ? Number(match[1]) : null;
  }

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
  const lines = [
    "РАСШИФРОВКА СОВМЕСТИМОСТИ",
    ""
  ];

  for (const [key, label] of Object.entries(labels)) {
    const number = numbers[key];

    lines.push(`${label}: ${number}`);
    lines.push(meanings[number]);
    lines.push("");
  }

  return lines.join("\n").trim();
}

export default {
  async fetch(request) {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (request.method === "GET") {
      return new Response(JSON.stringify({
        ok: true,
        service: "compatibility-calculator-decoding",
        version: VERSION,
        message: "API готов. Передайте текст первого расчёта через POST."
      }), { headers });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({
        ok: false,
        version: VERSION,
        error: "Используйте POST."
      }), { status: 405, headers });
    }

    try {
      const body = await request.json();
      const numbers = getNumbers(body);

      if (!numbers) {
        return new Response(JSON.stringify({
          ok: false,
          version: VERSION,
          error: "Не удалось извлечь четыре числа из входных данных.",
          receivedKeys: Object.keys(body),
          textReceived: getText(body).slice(0, 250)
        }), { status: 400, headers });
      }

      return new Response(JSON.stringify({
        ok: true,
        version: VERSION,
        text: makeDescription(numbers),
        numbers
      }), { headers });

    } catch (error) {
      return new Response(JSON.stringify({
        ok: false,
        version: VERSION,
        error: "Не удалось прочитать JSON-запрос."
      }), { status: 400, headers });
    }
  }
};

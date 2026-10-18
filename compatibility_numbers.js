
const VERSION = "1.2";

const MEANINGS = {
  consciousness: {
    1: "Притяжение сильных личностей. В плюсе партнёры вдохновляют друг друга и уважают самостоятельность. В минусе возможна борьба за лидерство.",
    2: "Чувства и интуиция. В плюсе есть эмоциональная чуткость. В минусе возможны недосказанность и ревность.",
    3: "Лёгкость и романтика. В плюсе много общения и радости. В минусе может не хватать глубины.",
    4: "Стабильность и надёжность. В плюсе есть ответственность. В минусе возможны контроль и жёсткость.",
    5: "Свобода и перемены. В плюсе отношения наполнены новизной. В минусе может не хватать постоянства.",
    6: "Любовь и семья. В плюсе есть нежность и желание быть вместе. В минусе возможны сомнения и сложный выбор.",
    7: "Страсть и характер. В плюсе партнёры поддерживают цели друг друга. В минусе возможны соперничество и конфликты.",
    8: "Сила и справедливость. В плюсе отношения строятся на честности. В минусе возможны претензии и обиды.",
    9: "Глубина и внутренний мир. В плюсе есть принятие и уважение личного пространства. В минусе возможны закрытость и дистанция."
  },
  realization: {
    1: "Инициатива. В плюсе пара смело начинает новое. В минусе каждый может настаивать на своём.",
    2: "Доверие. В плюсе партнёры тонко чувствуют друг друга. В минусе возможны подозрения и недосказанность.",
    3: "Общение. В плюсе отношения поддерживают юмор и общие впечатления. В минусе слова могут расходиться с поступками.",
    4: "Порядок и опора. В плюсе пара умеет договариваться. В минусе отношения могут стать слишком строгими.",
    5: "Общие ценности. В плюсе помогают честность и уважение взглядов. В минусе возможны споры о правилах.",
    6: "Выбор и партнёрство. В плюсе оба вкладываются в отношения. В минусе возможны колебания и ревность.",
    7: "Движение к цели. В плюсе пара действует сообща. В минусе отношения могут превратиться в соревнование.",
    8: "Баланс и ответственность. В плюсе важны равный вклад и честные договорённости. В минусе возникает ощущение несправедливости.",
    9: "Самостоятельность. В плюсе каждый сохраняет индивидуальность. В минусе партнёры могут отдаляться."
  },
  mission: {
    1: "Совместное начало. Пара вдохновляет друг друга на смелые решения.",
    2: "Тонкая связь. Важны доверие, эмоциональная честность и открытый разговор.",
    3: "Радость и творчество. Отношения расцветают благодаря общению и совместным занятиям.",
    4: "Создание опоры. Важны надёжность, ответственность и ясные договорённости.",
    5: "Развитие и перемены. Пара может открывать новое, уважая свободу каждого.",
    6: "Любовь и выбор. Центральная тема — взаимность, близость и осознанный выбор друг друга.",
    7: "Общая цель. Отношения укрепляются, когда партнёры действуют как команда.",
    8: "Равновесие. Важны честность, ответственность и справедливые решения.",
    9: "Мудрость и глубина. Пара учится принимать различия и уважать личное пространство."
  },
  final: {
    1: "Итоговая тема — самостоятельность и новые начинания.",
    2: "Итоговая тема — доверие и эмоциональная близость.",
    3: "Итоговая тема — радость, общение и творчество.",
    4: "Итоговая тема — стабильность и ответственность.",
    5: "Итоговая тема — свобода и развитие.",
    6: "Итоговая тема — любовь и партнёрский выбор.",
    7: "Итоговая тема — общая цель и движение вперёд.",
    8: "Итоговая тема — честность и баланс.",
    9: "Итоговая тема — глубина и принятие."
  }
};

function reduceNumber(number) {
  while (number > 9) {
    number = String(number)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return number;
}

function sumDigits(value) {
  return String(value)
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

function parseDate(value) {
  const match = String(value || "").trim().match(
    /^(\d{2})\.(\d{2})\.(\d{4})$/
  );

  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  const now = new Date();
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );

  if (
    year < 1900 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    date.getTime() > today
  ) {
    return null;
  }

  return {
    date: match[0],
    day,
    digits: `${match[1]}${match[2]}${match[3]}`
  };
}

// Формула из калькулятора одного человека.
function calculatePerson(parsed) {
  const consciousness = reduceNumber(parsed.day);
  const realization = reduceNumber(sumDigits(parsed.digits));
  const mission = reduceNumber(consciousness + realization);
  const final = reduceNumber(
    consciousness + realization + mission
  );

  return { consciousness, realization, mission, final };
}

// Совместимость рассчитывается по соответствующим трём числам.
function calculateCompatibility(woman, man) {
  const consciousness = reduceNumber(
    woman.consciousness + man.consciousness
  );
  const realization = reduceNumber(
    woman.realization + man.realization
  );
  const mission = reduceNumber(
    woman.mission + man.mission
  );
  const final = reduceNumber(
    consciousness + realization + mission
  );

  return { consciousness, realization, mission, final };
}

const TITLES = {
  consciousness: "✨ Сознание пары",
  realization: "🌟 Реализация пары",
  mission: "🎯 Миссия пары",
  final: "💫 Итог совместимости"
};

function buildText(womanDate, manDate, woman, man, compatibility) {
  const lines = [
    "💞 СОВМЕСТИМОСТЬ ПАРЫ",
    "",
    `👩 Женщина — ${womanDate}`,
    `Сознание: ${woman.consciousness}`,
    `Реализация: ${woman.realization}`,
    `Миссия: ${woman.mission}`,
    `Финал: ${woman.final}`,
    "",
    `👨 Мужчина — ${manDate}`,
    `Сознание: ${man.consciousness}`,
    `Реализация: ${man.realization}`,
    `Миссия: ${man.mission}`,
    `Финал: ${man.final}`,
    "",
    "❤️ ЧИСЛА СОВМЕСТИМОСТИ"
  ];

  for (const key of [
    "consciousness",
    "realization",
    "mission",
    "final"
  ]) {
    const number = compatibility[key];
    lines.push(
      "",
      `${TITLES[key]}: ${number}`,
      MEANINGS[key][number]
    );
  }

  lines.push(
    "",
    "Это символическая нумерологическая интерпретация для самопознания, а не точный прогноз отношений."
  );

  return lines.join("\n");
}

// Поддерживает JSON-поля и сообщение с двумя датами через пробел.
function extractDates(input) {
  if (typeof input === "string") {
    try {
      input = JSON.parse(input);
    } catch {
      const dates = input.match(/\d{2}\.\d{2}\.\d{4}/g) || [];
      return {
        womanDate: dates[0] || "",
        manDate: dates[1] || ""
      };
    }
  }

  if (!input || typeof input !== "object") {
    return { womanDate: "", manDate: "" };
  }

  const womanDate =
    input.womanDate ??
    input.woman_date ??
    input.woman;

  const manDate =
    input.manDate ??
    input.man_date ??
    input.man;

  if (
    typeof womanDate === "string" &&
    typeof manDate === "string"
  ) {
    return {
      womanDate: womanDate.trim(),
      manDate: manDate.trim()
    };
  }

  const candidates = [
    input.text,
    input.compatibility_dates,
    input.user_input,
    input.userInput,
    input.data
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string") {
      const dates = candidate.match(/\d{2}\.\d{2}\.\d{4}/g) || [];
      if (dates.length >= 2) {
        return {
          womanDate: dates[0],
          manDate: dates[1]
        };
      }

      try {
        const nested = JSON.parse(candidate);
        const result = extractDates(nested);
        if (result.womanDate && result.manDate) return result;
      } catch {
        // Продолжаем проверять остальные поля.
      }
    } else if (candidate && typeof candidate === "object") {
      const result = extractDates(candidate);
      if (result.womanDate && result.manDate) return result;
    }
  }

  // Проверяем все строковые поля, если данные пришли в другом формате.
  const allDates = JSON.stringify(input).match(
    /\d{2}\.\d{2}\.\d{4}/g
  ) || [];

  return {
    womanDate: allDates[0] || "",
    manDate: allDates[1] || ""
  };
}

export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          ...cors,
          "Content-Type": "application/json; charset=utf-8"
        }
      });

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === "GET") {
      return json({
        ok: true,
        version: VERSION,
        message: "Отправьте две даты рождения через пробел или полями womanDate и manDate.",
        example: {
          womanDate: "09.06.1979",
          manDate: "29.11.1974"
        }
      });
    }

    if (request.method !== "POST") {
      return json({
        ok: false,
        error: "Используйте POST."
      }, 405);
    }

    let body;

    try {
      const raw = await request.text();
      try {
        body = JSON.parse(raw);
      } catch {
        body = raw;
      }
    } catch {
      return json({
        ok: false,
        error: "Не удалось прочитать тело запроса."
      }, 400);
    }

    const { womanDate, manDate } = extractDates(body);
    const parsedWoman = parseDate(womanDate);
    const parsedMan = parseDate(manDate);

    if (!parsedWoman || !parsedMan) {
      return json({
        ok: false,
        error: "Укажите две корректные даты в формате ДД.ММ.ГГГГ.",
        received: { womanDate, manDate },
        example: "09.06.1979 29.11.1974"
      }, 400);
    }

    const woman = calculatePerson(parsedWoman);
    const man = calculatePerson(parsedMan);
    const compatibility = calculateCompatibility(woman, man);

    return json({
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

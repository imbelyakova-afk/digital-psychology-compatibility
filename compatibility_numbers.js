
const VERSION = "1.4";

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

function reduceNumber(n) {
  n = Math.abs(Number(n));
  while (n > 9) {
    n = String(n).split("").reduce((s, d) => s + Number(d), 0);
  }
  return n;
}

function sumDigits(value) {
  return String(value).split("").reduce((s, d) => s + Number(d), 0);
}

function parseDate(value) {
  const match = String(value ?? "").trim().match(
    /^(\d{2})\.(\d{2})\.(\d{4})$/
  );
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
  const consciousness = reduceNumber(
    woman.consciousness + man.consciousness
  );
  const realization = reduceNumber(
    woman.realization + man.realization
  );
  const mission = reduceNumber(woman.mission + man.mission);
  const final = reduceNumber(consciousness + realization + mission);

  return { consciousness, realization, mission, final };
}

function extractDates(input) {
  // Поддержка JSON, текстовых ответов и вложенных объектов.
  if (typeof input === "string") {
    try {
      input = JSON.parse(input);
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

    // Последняя попытка: найти обе даты в любом поле объекта.
    const allDates = JSON.stringify(input).match(
      /\d{2}\.\d{2}\.\d{4}/g
    ) || [];

    if (allDates.length >= 2) {
      return { womanDate: allDates[0], manDate: allDates[1] };
    }
  }

  return { womanDate: "", manDate: "" };
}

function buildText(womanDate, manDate, woman, man, compatibility) {
  const titles = {
    consciousness: "✨ Сознание пары",
    realization: "🌟 Реализация пары",
    mission: "🎯 Миссия пары",
    final: "💫 Итог совместимости"
  };

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

  for (const key of ["consciousness", "realization", "mission", "final"]) {
    const number = compatibility[key];
    lines.push("", `${titles[key]}: ${number}`, MEANINGS[key][number]);
  }

  lines.push(
    "",
    "Это символическая нумерологическая интерпретация для самопознания, а не точный прогноз отношений."
  );

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

    let raw = "";
    let body;

    try {
      raw = await request.text();
      body = JSON.parse(raw);
    } catch {
      body = raw;
    }

    const { womanDate, manDate } = extractDates(body);
    const parsedWoman = parseDate(womanDate);
    const parsedMan = parseDate(manDate);

    if (!parsedWoman || !parsedMan) {
      return respond({
        ok: false,
        version: VERSION,
        error: "Укажите две корректные даты в формате ДД.ММ.ГГГГ.",
        received: { womanDate, manDate },
        rawBody: raw.slice(0, 500),
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

"use client";

import { useEffect, useMemo, useState } from "react";

type ToastTone = "info" | "success";

type ToastState = {
  message: string;
  tone: ToastTone;
  visible: boolean;
};

const STORAGE_KEY = "orucluk-48-tracker";
const GOAL_DAYS = 48;
const weekdayLabels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const LOVE_PREFIX = "Ben sevgilin Abdurrahman, ";
const MESSAGES: string[] = [
  "seninle gurur duyuyorum, yolun açık olsun canım ❤️",
  "çok az kaldı, pes etme, sen başarı için yaratıldın ❤️",
  "her adımın kıymetli, sen bunu yaparsın canım ❤️",
  "ne olursa olsun yanındayım, devam et güzel insan ❤️",
  "senin azmin beni her zaman büyülüyor, bırakma sakın ❤️",
  "yorgunsan bile ilerle, çünkü başaracaksın ❤️",
  "kendine güven, sen gerçekten güçlüsün canım ❤️",
  "bu yolda yalnız değilsin, ben hep buradayım ❤️",
  "attığın küçük adımlar bile çok büyük başarıların habercisi ❤️",
  "kalbin de aklın da çok güçlü, devam et canım ❤️",
  "hedeflerine çok yakınsın, sakın durma ❤️",
  "her zorluğu aşabilecek bir kalbin var ❤️",
  "senin emeğine hayranım, sonuçlar muhteşem olacak ❤️",
  "gülümse, çünkü başarı sana doğru koşuyor ❤️",
  "bugün zor olabilir ama yarın senin olacak ❤️",
  "kendini asla küçümseme, sen gerçekten değerlisin ❤️",
  "biraz daha dayan, çok güzel şeyler geliyor ❤️",
  "sen yaparsın, her zaman yaptığın gibi ❤️",
  "azminle ışık saçıyorsun, hiç sönme ❤️",
  "yolun uzun gibi görünse de sen hızla ilerliyorsun ❤️",
  "kalbinde taşıdığın güç her şeye yeter ❤️",
  "sen çalıştıkça hayat güzelleşiyor, devam et ❤️",
  "bir nefes al, dik dur ve ilerle, çünkü sen güçlüsün ❤️",
  "seninle gurur duyuyorum, yaptıkların mükemmel ❤️",
  "daha yolun başındasın, önünde büyük başarılar var ❤️",
  "düştüğünde kalkabildiğin için çok değerlisin ❤️",
  "senin kararlılığın ilham veriyor canım ❤️",
  "bir adım daha… işte tam da bu kadar yakınsın ❤️",
  "kendine inan, çünkü ben sana inanıyorum ❤️",
  "enerjin ve kalbinle her şeyi mümkün kılıyorsun ❤️",
  "attığın her adım seni hayallerine yaklaştırıyor ❤️",
  "vazgeçmek yok, çünkü sen bitirmeyi hak ediyorsun ❤️",
  "ben yanındayım, sen ilerle, gerisini hallederiz ❤️",
  "sen çalışınca güzel şeyler olur, buna inanıyorum ❤️",
  "zorluklar seni daha da güçlendiriyor ❤️",
  "sabırlısın, akıllısın ve başaracaksın ❤️",
  "her gün bir öncekinden daha iyi oluyorsun ❤️",
  "kendinle gurur duy, çünkü bunu hak ediyorsun ❤️",
  "güzel yoldasın, yönünü hiç kaybetme ❤️",
  "senin çabanı görmek bana mutluluk veriyor ❤️",
  "zorlanıyorsan doğru yoldasın, devam et canım ❤️",
  "başarının sesini şimdiden duyuyorum ❤️",
  "senin potansiyelin sınırsız, inan bana ❤️",
  "bu süreçte büyüyorsun, güçleniyorsun, parlıyorsun ❤️",
  "biraz daha sabır, harika sonuçlar geliyor ❤️",
  "emeklerin boşa gitmiyor, hepsi meyve verecek ❤️",
  "yol arkadaşınım, sen yürüdükçe ben buradayım ❤️",
  "sen harikasın Abdurrahman, aynen böyle devam et canım ❤️",
];

const formatDateKey = (date: Date) => date.toISOString().split("T")[0];

const normalizeMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const buildMonthDays = (month: Date) => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  ).getDate();
  const leadingEmpty = (firstDay.getDay() + 6) % 7; // Pazartesi haftanın başlangıcı olsun

  const days: (Date | null)[] = Array.from(
    { length: leadingEmpty },
    () => null
  );
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  return days;
};

export default function Home() {
  const [month, setMonth] = useState(() => normalizeMonth(new Date()));
  const [doneDays, setDoneDays] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<ToastState>({
    message: "",
    tone: "info",
    visible: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: string[] = JSON.parse(saved);
        setDoneDays(new Set(parsed));
      } catch (error) {
        console.warn("Kayıt okunamadı:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...doneDays]));
  }, [doneDays]);

  const calendarDays = useMemo(() => buildMonthDays(month), [month]);
  const completedCount = doneDays.size;
  const remainingCount = Math.max(GOAL_DAYS - completedCount, 0);
  const progress = Math.min(100, (completedCount / GOAL_DAYS) * 100);

  const showToast = (message: string, tone: ToastTone = "info") => {
    setToast({ message, tone, visible: true });
  };

  const closeToast = () => setToast((prev) => ({ ...prev, visible: false }));

  const toggleDay = (date: Date) => {
    const key = formatDateKey(date);
    setDoneDays((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        showToast("Bir günü kaldırdın, birlikte devam ediyoruz! 💙", "info");
        return next;
      }
      if (next.size >= GOAL_DAYS) {
        showToast("48 günü zaten tamamladın, harikasın! 💖", "success");
        return prev;
      }
      next.add(key);
      const left = Math.max(GOAL_DAYS - next.size, 0);
      const messageIndex = (next.size - 1) % MESSAGES.length;
      const loveMessage = `${LOVE_PREFIX}${MESSAGES[messageIndex]}`;
      showToast(
        left > 0 ? `${loveMessage} (${left} gün kaldı)` : loveMessage,
        "success"
      );
      return next;
    });
  };

  const changeMonth = (delta: number) => {
    setMonth((prev) =>
      normalizeMonth(new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
    );
  };

  const resetAll = () => {
    setDoneDays(new Set());
    showToast("Tüm işaretler temizlendi, yeniden başlayalım! 🌸", "info");
  };

  const isToday = (date: Date) =>
    formatDateKey(date) === formatDateKey(new Date());

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-pink-50 text-slate-800">
      <div className="mx-auto max-w-5xl px-3 py-10 sm:px-4 sm:py-16">
        <div className="rounded-3xl border border-sky-100 bg-white/70 p-4 shadow-xl shadow-sky-100/50 backdrop-blur sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-sky-500">
                48 Günlük Yolculuk
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Oruç Takip ve Motivasyon
              </h1>
              <p className="mt-2 max-w-2xl text-base text-slate-600">
                Her işaretlediğin gün seni hedefe bir adım daha yaklaştırıyor.
                Sevgi dolu minik hatırlatmalarla yanındayım canım. 💗
              </p>
            </div>
            <div className="min-w-[220px] rounded-2xl bg-linear-to-br from-sky-100 to-pink-100 p-4 text-center shadow-md">
              <p className="text-xs font-semibold uppercase text-sky-600">
                Kalan Gün
              </p>
              <p className="text-4xl font-bold text-slate-900">
                {remainingCount}
              </p>
              <p className="text-xs text-slate-600">
                {remainingCount === 0
                  ? "Hedef tamam! 🌟"
                  : "Birlikte az kaldı, devam!"}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600 sm:gap-3">
                <span className="flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sky-700">
                  Tamamlanan:{" "}
                  <strong className="text-slate-900">{completedCount}</strong>
                </span>
                <span className="flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-pink-700">
                  Hedef: <strong className="text-slate-900">{GOAL_DAYS}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <button
                  onClick={() => changeMonth(-1)}
                  className="rounded-full border border-sky-100 bg-white px-3 py-1 text-sky-700 shadow-sm transition hover:-translate-x-[2px] hover:shadow-md"
                  aria-label="Önceki ay"
                >
                  ←
                </button>
                <div className="rounded-full bg-sky-50 px-4 py-1 text-sm font-semibold text-slate-800">
                  {month.toLocaleDateString("tr-TR", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <button
                  onClick={() => changeMonth(1)}
                  className="rounded-full border border-sky-100 bg-white px-3 py-1 text-sky-700 shadow-sm transition hover:translate-x-[2px] hover:shadow-md"
                  aria-label="Sonraki ay"
                >
                  →
                </button>
              </div>
            </div>

            <div className="h-3 w-full rounded-full bg-sky-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-sky-400 via-sky-300 to-pink-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-8 overflow-x-auto rounded-3xl border border-sky-100 bg-white/80 p-2 shadow-sm sm:p-6">
            <div className="min-w-[320px] space-y-3 sm:min-w-0">
              <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:gap-3 sm:text-xs">
                {weekdayLabels.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 sm:gap-3">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return (
                      <div key={`empty-${index}`} className="rounded-2xl" />
                    );
                  }
                  const key = formatDateKey(day);
                  const isDone = doneDays.has(key);
                  const today = isToday(day);

                  return (
                    <button
                      key={key}
                      onClick={() => toggleDay(day)}
                      className={[
                        "flex aspect-square flex-col items-center justify-center rounded-2xl border text-xs font-semibold transition-all sm:text-sm",
                        "hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300",
                        isDone
                          ? "border-pink-200 bg-linear-to-br from-sky-200 to-pink-200 text-slate-900 shadow-lg shadow-pink-100"
                          : "border-sky-100 bg-white/70 text-slate-700 hover:-translate-y-0.5 hover:border-pink-200",
                        today && !isDone ? "ring-2 ring-pink-200" : "",
                      ].join(" ")}
                    >
                      <span className="text-base sm:text-lg">
                        {day.getDate()}
                      </span>
                      <span className="text-[10px] font-medium text-sky-700">
                        {today ? "Bugün" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-linear-to-br from-sky-50 via-white to-pink-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {/* <p className="text-sm font-semibold text-slate-800">
                Sevgi Dolu Hatırlatma
              </p> */}
              <p className="text-sm text-slate-600">
                Ben Abdurrahman, seni çok seviyorum canım. Devam edelim, Beraber
                oruç tutalım 💕
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <button
                onClick={() => changeMonth(0)}
                className="rounded-full border border-sky-100 bg-white px-4 py-2 font-semibold text-sky-700 shadow-sm transition hover:shadow-md"
              >
                Bu Aya Dön
              </button>
              <button
                onClick={resetAll}
                className="rounded-full bg-linear-to-r from-sky-400 to-pink-400 px-4 py-2 font-semibold text-white shadow-md transition hover:brightness-105"
              >
                Tüm İşaretleri Temizle
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast.visible && (
        <div className="fixed inset-x-0 bottom-6 flex justify-center px-4">
          <div
            className={[
              "relative flex max-w-xl items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg shadow-pink-100/80 transition",
              toast.tone === "success"
                ? "bg-linear-to-r from-sky-200 to-pink-200 text-slate-900"
                : "bg-white text-slate-800",
            ].join(" ")}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={closeToast}
              aria-label="Kapat"
              className="grid h-7 w-7 place-items-center rounded-full bg-white/70 text-slate-700 transition hover:bg-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// assets/js/utils.js

/**
 * 日付変更時間(cutoffHour)を考慮して、
 * 指定された日時が「どの営業日」に属するかを返します。
 * * 例: cutoffHour=6 (朝6時締め)
 * 10月25日 03:00 -> 10月24日の営業日
 * 10月25日 07:00 -> 10月25日の営業日
 * * @param {Date} date - 判定したい日時
 * @param {number} cutoffHour - 日付変更時間 (0-23)
 * @returns {Date} 時間を00:00:00にリセットしたDateオブジェクト
 */
export function getBusinessDate(date, cutoffHour = 0) {
    const d = new Date(date);
    // 指定時間を過ぎていなければ、前日扱いにする
    if (d.getHours() < cutoffHour) {
        d.setDate(d.getDate() - 1);
    }
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Dateオブジェクトを YYYY-MM-DD 文字列に変換
 */
export function formatDateYMD(date) {
    const y = date.getFullYear();
    const m = ('0' + (date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);
    return `${y}-${m}-${d}`;
}
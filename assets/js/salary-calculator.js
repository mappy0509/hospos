// assets/js/salary-calculator.js

export class SalaryCalculator {
    /**
     * @param {Object} config - 店舗の salary 設定オブジェクト
     */
    constructor(config) {
        this.config = config || {};
        // デフォルト値
        this.basePayType = this.config.basePayType || 'daily';
        this.creditSystem = this.config.creditSystem || 'sales_base';
        this.taxRate = this.config.taxRate ?? 10.21;
        this.welfareFee = this.config.welfareFee ?? 10000;
        this.slides = (this.config.commissionSlide || []).sort((a, b) => b.minSales - a.minSales);
    }

    /**
     * 給与計算を実行
     * @param {Object} attendance - { workDays: 20, workHours: 100 }
     * @param {Array} salesSlips - 対象期間の伝票配列 (visitType='shime'のみ抽出済み)
     * @param {Object} castSettings - キャスト個別の設定 { dailyWage: 10000 } など
     */
    calculate(attendance, salesSlips, castSettings = {}) {
        let result = {
            grossSales: 0,      // 総売上 (小計)
            collectedSales: 0,  // 回収済み (現金+カード)
            unpaidCredit: 0,    // 未回収売掛
            
            basePay: 0,         // 基本給
            commissionRate: 0,  // 適用バック率
            commission: 0,      // 歩合給
            
            creditDeduction: 0, // 売掛天引き額
            tax: 0,             // 源泉徴収税
            welfare: 0,         // 厚生費
            
            totalDeduction: 0,  // 控除計
            payout: 0           // 差引支給額
        };

        // 1. 売上集計
        salesSlips.forEach(slip => {
            const amount = slip.totalAmount || 0;
            const pay = slip.paymentDetails || { cash: 0, card: 0, credit: 0 };
            
            result.grossSales += amount;
            result.collectedSales += (pay.cash + pay.card);
            result.unpaidCredit += pay.credit;
        });

        // 2. バック率決定 (スライド制)
        let targetSales = (this.creditSystem === 'sales_base') ? result.grossSales : result.collectedSales;
        
        // スライドテーブルを上から見ていき、条件を満たす最大の率を探す
        for (const slide of this.slides) {
            if (targetSales >= slide.minSales) {
                result.commissionRate = slide.rate;
                break;
            }
        }
        // テーブルがない、または条件満たさない場合は最低設定、それもなければ40%
        if (result.commissionRate === 0 && this.slides.length > 0) {
            result.commissionRate = this.slides[this.slides.length - 1].rate;
        }
        if (result.commissionRate === 0) result.commissionRate = 40;

        // 3. 歩合給計算
        result.commission = Math.floor(targetSales * (result.commissionRate / 100));

        // 4. 売掛天引き (売上ベースの場合のみ)
        if (this.creditSystem === 'sales_base' && result.unpaidCredit > 0) {
            // 簡略化のため、未回収分は全額天引きとする (設定で変更可にするならここを修正)
            result.creditDeduction = result.unpaidCredit;
        }

        // 5. 基本給計算
        const wage = castSettings.dailyWage || 0; // キャストごとの日給/時給
        if (this.basePayType === 'daily') {
            result.basePay = (attendance.workDays || 0) * wage;
        } else if (this.basePayType === 'hourly') {
            result.basePay = (attendance.workHours || 0) * wage;
        }

        // 6. 控除計算
        const grossPayout = result.basePay + result.commission;
        result.tax = Math.floor(grossPayout * (this.taxRate / 100));
        result.welfare = this.welfareFee;

        // 7. 最終支給額
        result.totalDeduction = result.tax + result.welfare + result.creditDeduction;
        result.payout = grossPayout - result.totalDeduction;

        return result;
    }
}